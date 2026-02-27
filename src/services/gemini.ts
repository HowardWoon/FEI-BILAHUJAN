import { GoogleGenAI, Type } from "@google/genai";
import { ref, get, set } from "firebase/database";
import { rtdb } from "../firebase";

// ─────────────────────────────────────────────────────────────────────────────
// ⚠️  CRITICAL FIX: Vite requires import.meta.env — NOT process.env
//     process.env returns undefined in the browser (Vite/React),
//     which is why every Gemini call silently fails with an auth error.
//
//     Your .env file must use: VITE_GEMINI_API_KEY=your_key_here
// ─────────────────────────────────────────────────────────────────────────────
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

if (!GEMINI_API_KEY) {
  console.error(
    '[Gemini] ❌ VITE_GEMINI_API_KEY is undefined!\n' +
    'Steps to fix:\n' +
    '  1. Open your .env file in the project root\n' +
    '  2. Add: VITE_GEMINI_API_KEY=your_api_key_here\n' +
    '  3. Stop the dev server (Ctrl+C)\n' +
    '  4. Run: npm run dev'
  );
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// ─── Rate limit: 1 scan per 4 seconds (free tier max = 15 RPM) ───────────────
let lastCallTime = 0;
const COOLDOWN_MS = 4000;

// ─── Firebase result cache: 10 minutes TTL ───────────────────────────────────
const CACHE_TTL_MS = 10 * 60 * 1000;

function hashImageData(base64: string): string {
  let hash = 5381;
  const step = Math.max(1, Math.floor(base64.length / 512));
  for (let i = 0; i < base64.length; i += step) {
    hash = ((hash << 5) + hash) ^ base64.charCodeAt(i);
    hash = hash >>> 0;
  }
  return `img_${hash}_${base64.length}`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FloodAnalysisResult {
  isRelevant: boolean;
  rejectionReason: string;
  estimatedDepth: string;
  detectedHazards: string;
  passability: string;
  aiConfidence: number;
  directive: string;
  riskScore: number;
  severity: string;
  waterDepth: string;
  waterCurrent: string;
  infrastructureStatus: string;
  humanRisk: string;
  estimatedStartTime: string;
  estimatedEndTime: string;
  eventType: string;
}

export interface LiveWeatherAnalysis {
  state: string;
  weatherCondition: string;
  isRaining: boolean;
  floodRisk: string;
  severity: number;
  aiAnalysisText: string;
}

export interface AudioAnalysisResult {
  isFloodRisk: boolean;
  severity: string;
  analysis: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// analyzeFloodImage
// Model: gemini-2.0-flash  (REST fetch — SDK hangs silently in browser)
// Strategy: Firebase cache first → REST API → save result to cache
// ─────────────────────────────────────────────────────────────────────────────
export async function analyzeFloodImage(
  base64Image: string,
  mimeType: string
): Promise<FloodAnalysisResult> {

  // ── Guard: API key ──────────────────────────────────────────────────────────
  if (!GEMINI_API_KEY) {
    throw new Error(
      'Gemini API key missing. Add VITE_GEMINI_API_KEY=your_key to your .env file and restart the dev server.'
    );
  }

  // ── Guard: cooldown ─────────────────────────────────────────────────────────
  const now = Date.now();
  if (now - lastCallTime < COOLDOWN_MS) {
    const wait = Math.ceil((COOLDOWN_MS - (now - lastCallTime)) / 1000);
    throw new Error(`Please wait ${wait} second${wait !== 1 ? 's' : ''} before scanning again.`);
  }
  lastCallTime = now;

  // ── Firebase cache (3s timeout, non-blocking) ───────────────────────────────
  const cacheKey = hashImageData(base64Image);
  try {
    const snap = await Promise.race([
      get(ref(rtdb, `analysisCache/${cacheKey}`)),
      new Promise<null>(res => setTimeout(() => res(null), 3000))
    ]);
    if (snap && (snap as any).exists?.()) {
      const cached = (snap as any).val();
      if (now - cached.timestamp < CACHE_TTL_MS) {
        console.log('[Gemini] ✅ Cache hit — no API call needed');
        return cached.result as FloodAnalysisResult;
      }
    }
  } catch { /* cache miss is fine */ }

  // ── Prompt ──────────────────────────────────────────────────────────────────
  const prompt = `You are a Malaysian flood risk AI analyst. Analyze this image.

STEP 1: Is this image showing flood, water, or drainage conditions?
- If NO (selfie, food, text document, indoor room, clear sky, etc):
  Return isRelevant=false and explain in rejectionReason.

STEP 2: If YES, use these physical references to estimate depth:
  Kerb = 0.15m | Door sill = 0.30m | Ankle = 0.15m | Knee = 0.50m
  Waist = 1.0m  | Car bonnet = 1.0m | Car roof = 1.4m

SEVERITY (riskScore):
  1-2 = NORMAL (dry/damp)   3-4 = MINOR (ankle)   5-6 = MODERATE (knee)
  7-8 = SEVERE (waist/bonnet)   9-10 = CRITICAL (roof/2nd floor)

HARD RULES — never go below these:
  Car bonnet submerged → riskScore minimum 7
  Car roof submerged   → riskScore minimum 8
  Car fully submerged  → riskScore minimum 9

Return ONLY this JSON. No markdown, no code fences, no explanation:
{"isRelevant":true,"rejectionReason":"","estimatedDepth":"~0.3m","detectedHazards":"Submerged manholes, debris","passability":"Pedestrians:Caution|Motorcycles:Avoid|Cars:Avoid|4x4:Caution","aiConfidence":80,"directive":"Water is knee-deep. Avoid crossing. Move to higher ground.","riskScore":5,"severity":"MODERATE","waterDepth":"Knee-Deep (0.3-0.5m)","waterCurrent":"Slow","infrastructureStatus":"Roads partially submerged","humanRisk":"Moderate","eventType":"Flash Flood","estimatedStartTime":"Already in progress","estimatedEndTime":"${new Date(Date.now() + 7200000).toISOString()}"}`;

  // ── REST API call (most reliable for browser + image upload) ────────────────
  const REST_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const body = {
    contents: [{
      parts: [
        { text: prompt },
        { inline_data: { mime_type: mimeType, data: base64Image } }
      ]
    }],
    generationConfig: {
      temperature: 0.1,     // deterministic → consistent JSON output
      maxOutputTokens: 400, // our JSON needs ~300 tokens max
      topP: 0.8,
      topK: 10
    }
  };

  // 30s abort controller
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);

  let response: Response;
  try {
    response = await fetch(REST_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal
    });
  } catch (err: any) {
    clearTimeout(timer);
    if (err?.name === 'AbortError') {
      throw new Error('Request timed out. Try a smaller/clearer image and tap Retry.');
    }
    throw new Error('Network error. Check your internet connection and tap Retry.');
  }
  clearTimeout(timer);

  // ── HTTP error handling ─────────────────────────────────────────────────────
  if (!response.ok) {
    let errMsg = response.statusText;
    try {
      const errJson = await response.json();
      errMsg = (errJson as any)?.error?.message || errMsg;
    } catch { /* ignore */ }

    if (response.status === 429) {
      throw new Error('Quota exceeded. Wait 60 seconds and tap Retry.\nOr enable billing at aistudio.google.com for unlimited usage.');
    }
    if (response.status === 400 && errMsg.toLowerCase().includes('api key')) {
      throw new Error('Invalid API key. Check VITE_GEMINI_API_KEY in your .env file.');
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error('API key rejected. Verify it is active at aistudio.google.com/apikey');
    }
    throw new Error(`Gemini error (${response.status}): ${errMsg}`);
  }

  // ── Parse JSON from response ────────────────────────────────────────────────
  const json = await response.json();
  const rawText: string = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  if (!rawText) {
    const blockReason = json?.promptFeedback?.blockReason;
    if (blockReason) throw new Error(`Image blocked: ${blockReason}. Try a different image.`);
    throw new Error('Empty AI response. Tap Retry.');
  }

  const match = rawText.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('Could not read AI response. Tap Retry.');

  const parsed = JSON.parse(match[0]) as FloodAnalysisResult;

  // ── Save to cache (fire-and-forget) ────────────────────────────────────────
  set(ref(rtdb, `analysisCache/${cacheKey}`), {
    result: parsed,
    timestamp: Date.now()
  }).catch(() => { /* non-fatal */ });

  return parsed;
}

// ─────────────────────────────────────────────────────────────────────────────
// fetchLiveWeatherAndCCTV
// Alert Menu: live weather + flood alerts per Malaysian state
// Uses Gemini 2.0 Flash with Google Search grounding
// ─────────────────────────────────────────────────────────────────────────────
export async function fetchLiveWeatherAndCCTV(
  state: string,
  retries = 2
): Promise<LiveWeatherAnalysis> {

  const fallback: LiveWeatherAnalysis = {
    state,
    weatherCondition: "Cloudy",
    isRaining: false,
    floodRisk: "Low",
    severity: 1,
    aiAnalysisText: `Live weather data temporarily unavailable for ${state}. Check local news for updates.`
  };

  if (!GEMINI_API_KEY) return fallback;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Search for the CURRENT real-time weather in ${state}, Malaysia right now.
Also search for any active flood warnings, heavy rain alerts, or CCTV traffic flood reports for ${state} Malaysia today.

Based on live search results respond ONLY with this JSON (no markdown, no code fences):
{"state":"${state}","weatherCondition":"<Heavy Rain|Thunderstorm|Drizzle|Cloudy|Sunny>","isRaining":<true|false>,"floodRisk":"<High|Moderate|Low>","severity":<1-10>,"aiAnalysisText":"<2 short actionable sentences for residents>"}`,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
        maxOutputTokens: 200
      }
    });

    const raw = response.text?.trim() ?? '';
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found in weather response');

    return JSON.parse(jsonMatch[0]) as LiveWeatherAnalysis;

  } catch (error: any) {
    const msg = error?.message ?? '';
    const status = error?.status ?? error?.code ?? 0;

    if (status === 429 || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota') || msg.includes('free_tier')) {
      console.warn(`[Weather] Rate limit hit for ${state} — using fallback`);
      return fallback;
    }
    if (retries > 0) {
      console.warn(`[Weather] Retrying ${state}, attempts left: ${retries - 1}`);
      await new Promise(r => setTimeout(r, 2000));
      return fetchLiveWeatherAndCCTV(state, retries - 1);
    }
    console.error(`[Weather] All retries failed for ${state}:`, error);
    return fallback;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// analyzeAudio
// Detects flood risk from ambient sound (rain, rushing water, sirens, thunder)
// ─────────────────────────────────────────────────────────────────────────────
export async function analyzeAudio(
  base64Audio: string,
  mimeType: string
): Promise<AudioAnalysisResult> {

  const fallback: AudioAnalysisResult = {
    isFloodRisk: false,
    severity: 'NONE',
    analysis: 'Audio analysis unavailable. Please try again later.'
  };

  if (!GEMINI_API_KEY) return fallback;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Listen to this audio clip. Detect any signs of flood risk: heavy rain, rushing water, thunder, emergency sirens, or strong wind.
Return ONLY valid JSON (no markdown, no code fences):
{"isFloodRisk":<true|false>,"severity":"<CRITICAL|HIGH|MODERATE|LOW|NONE>","analysis":"<2 sentences describing what you hear and the flood risk>"}`
            },
            { inlineData: { data: base64Audio, mimeType } }
          ]
        }
      ],
      config: {
        temperature: 0.1,
        maxOutputTokens: 150,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isFloodRisk: { type: Type.BOOLEAN },
            severity: { type: Type.STRING },
            analysis: { type: Type.STRING }
          },
          required: ["isFloodRisk", "severity", "analysis"]
        }
      }
    });

    const text = response.text?.trim() ?? '';
    if (!text) return fallback;
    return JSON.parse(text) as AudioAnalysisResult;

  } catch (error: any) {
    const msg = error?.message ?? '';
    const status = error?.status ?? error?.code ?? 0;
    if (status === 429 || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) {
      return { isFloodRisk: false, severity: 'NONE', analysis: 'Server busy. Please try audio analysis again in a moment.' };
    }
    console.error('[Audio] Failed:', error);
    return fallback;
  }
}