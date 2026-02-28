import { GoogleGenAI, Type } from "@google/genai";
import { ref, get, set } from "firebase/database";
import { rtdb } from "../firebase";

// ─────────────────────────────────────────────────────────────────────────────
// API KEY — TWO PROBLEMS FIXED HERE:
//
// Problem 1 (localhost):  process.env doesn't work in Vite browser builds.
//                         Must use import.meta.env.VITE_GEMINI_API_KEY
//
// Problem 2 (deployed site):  .env is NEVER included in Firebase Hosting.
//                              The key must be hardcoded or injected at build time.
//
// SOLUTION: Try import.meta.env first, fall back to HARDCODED_KEY.
// ─────────────────────────────────────────────────────────────────────────────
const HARDCODED_KEY = 'AIzaSyAmZGP5zA3T8m3SlXW27NMyQSBvMtM-i7k'; // ← replace with your real key
const GEMINI_API_KEY: string =
  (import.meta.env.VITE_GEMINI_API_KEY as string) || HARDCODED_KEY;

if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_ACTUAL_GEMINI_API_KEY_HERE') {
  console.error(
    '[Gemini] ❌ API key not set!\n' +
    'Replace YOUR_ACTUAL_GEMINI_API_KEY_HERE in gemini.ts with your real key.\n' +
    'Get one free at: https://aistudio.google.com/apikey'
  );
} else {
  console.log(`[Gemini] ✅ Key loaded (starts: ${GEMINI_API_KEY.slice(0, 8)}...)`);
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// ─── Rate limit: 1 scan per 4 seconds (free tier max = 15 RPM) ───────────────
let lastCallTime = 0;
const COOLDOWN_MS = 4000;

// ─── Firebase result cache TTL: 10 minutes ───────────────────────────────────
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
//
// Model: gemini-2.5-flash  (REST v1beta — confirmed working Feb 2026)
// thinkingBudget: 0  → single-part response, no markdown wrapping
// Strategy: Firebase cache → REST fetch → save result to cache
// ─────────────────────────────────────────────────────────────────────────────
export async function analyzeFloodImage(
  base64Image: string,
  mimeType: string
): Promise<FloodAnalysisResult> {

  // ── Key guard ───────────────────────────────────────────────────────────────
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_ACTUAL_GEMINI_API_KEY_HERE') {
    throw new Error(
      'Gemini API key not configured.\n' +
      'Open src/services/gemini.ts and replace YOUR_ACTUAL_GEMINI_API_KEY_HERE with your key.\n' +
      'Get one free at: https://aistudio.google.com/apikey'
    );
  }

  // ── Cooldown guard ──────────────────────────────────────────────────────────
  const now = Date.now();
  if (now - lastCallTime < COOLDOWN_MS) {
    const wait = Math.ceil((COOLDOWN_MS - (now - lastCallTime)) / 1000);
    throw new Error(`Please wait ${wait} second${wait !== 1 ? 's' : ''} before scanning again.`);
  }
  lastCallTime = now;

  // ── Firebase cache check (3s timeout, non-blocking) ────────────────────────
  const cacheKey = hashImageData(base64Image);
  try {
    const snap = await Promise.race([
      get(ref(rtdb, `analysisCache/${cacheKey}`)),
      new Promise<null>(res => setTimeout(() => res(null), 3000))
    ]);
    if (snap && (snap as any).exists?.()) {
      const cached = (snap as any).val();
      if (now - cached.timestamp < CACHE_TTL_MS) {
        console.log('[Gemini] ✅ Cache hit — skipping API call');
        return cached.result as FloodAnalysisResult;
      }
    }
  } catch { /* cache miss is fine */ }

  // ── Prompt ──────────────────────────────────────────────────────────────────
  const prompt = `You are a Malaysian flood risk AI analyst. Analyze this image.

STEP 1: Is this image showing flood, water, or drainage conditions?
If NO (selfie, food, document, indoor room, clear sky, etc):
  → set isRelevant=false, explain in rejectionReason, return zero/empty defaults for all other fields.

STEP 2: If YES, estimate depth using these physical anchors:
  Kerb = 0.15m | Door sill = 0.30m | Ankle = 0.15m | Knee = 0.50m
  Waist = 1.0m | Car bonnet = 1.0m | Car roof = 1.4m

SEVERITY scale (riskScore 1-10):
  1-2 = NORMAL (dry/damp surface)
  3-4 = MINOR  (ankle-deep, <0.2m)
  5-6 = MODERATE (knee-deep, 0.2-0.5m)
  7-8 = SEVERE (waist/bonnet, 0.5-1.2m)
  9-10 = CRITICAL (car roof or 2nd floor flooded)

HARD FLOOR RULES — never score below these:
  Car bonnet submerged → riskScore MINIMUM 7
  Car roof submerged   → riskScore MINIMUM 8
  Car fully submerged  → riskScore MINIMUM 9

YOU MUST return ONLY the JSON object below. No markdown. No code fences. No text before or after.

{"isRelevant":true,"rejectionReason":"","estimatedDepth":"~0.3m","detectedHazards":"Submerged manholes, floating debris","passability":"Pedestrians:Caution|Motorcycles:Avoid|Cars:Avoid|4x4:Caution","aiConfidence":80,"directive":"Water is knee-deep. Avoid crossing. Move to higher ground.","riskScore":5,"severity":"MODERATE","waterDepth":"Knee-Deep (0.3-0.5m)","waterCurrent":"Slow","infrastructureStatus":"Roads partially submerged","humanRisk":"Moderate","eventType":"Flash Flood","estimatedStartTime":"Already in progress","estimatedEndTime":"${new Date(Date.now() + 7200000).toISOString()}"}`;

  // ── REST API — gemini-2.5-flash on v1beta (confirmed working with new keys) ──
  const REST_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  const body = {
    contents: [{
      parts: [
        { text: prompt },
        { inline_data: { mime_type: mimeType, data: base64Image } }
      ]
    }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 512,
      topP: 0.8,
      topK: 10,
      thinkingConfig: {
        thinkingBudget: 0  // disable thinking — faster, no multi-part split
      }
    }
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 35000);

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
      throw new Error('Request timed out. Try a smaller image and tap Retry.');
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

    console.error(`[Gemini] HTTP ${response.status}:`, errMsg);

    if (response.status === 429) {
      throw new Error('Quota exceeded. Wait 60 seconds and tap Retry.\nFor unlimited use, enable billing at aistudio.google.com.');
    }
    if (response.status === 400 && errMsg.toLowerCase().includes('api key')) {
      throw new Error('Invalid API key. Check VITE_GEMINI_API_KEY in your .env or the hardcoded key in gemini.ts.');
    }
    if (response.status === 401 || response.status === 403) {
      throw new Error('API key rejected. Verify it is active at aistudio.google.com/apikey');
    }
    if (response.status === 404) {
      throw new Error('Gemini model not found (404). The model name in gemini.ts may be wrong.');
    }
    throw new Error(`Gemini error (${response.status}): ${errMsg}`);
  }

  // ── Parse response ──────────────────────────────────────────────────────────
  const json = await response.json();
  console.log('[Gemini] Candidates count:', json?.candidates?.length ?? 0);

  // gemini-2.5-flash may return multiple parts (thoughts + answer) — find the last text part
  const parts: any[] = json?.candidates?.[0]?.content?.parts ?? [];
  const rawText: string = [...parts].reverse().find((p: any) => p.text && !p.thought)?.text ?? parts[0]?.text ?? '';
  console.log('[Gemini] Parts count:', parts.length, '| Raw text (first 400 chars):', rawText.slice(0, 400));

  if (!rawText) {
    const blockReason = json?.promptFeedback?.blockReason;
    const finishReason = json?.candidates?.[0]?.finishReason;
    console.error('[Gemini] Empty text. blockReason:', blockReason, 'finishReason:', finishReason);

    if (blockReason) throw new Error(`Image blocked by safety filter: ${blockReason}. Try a different image.`);
    if (finishReason === 'MAX_TOKENS') throw new Error('Response was too long. Tap Retry.');
    throw new Error('Empty AI response. Tap Retry.');
  }

  // Strip markdown code fences if model added them
  const stripped = rawText
    .replace(/^```(?:json)?\s*/im, '')
    .replace(/\s*```\s*$/im, '')
    .trim();

  // Extract outermost JSON object
  const match = stripped.match(/\{[\s\S]*\}/);
  if (!match) {
    console.error('[Gemini] No JSON found in response:', stripped);
    throw new Error('Could not read AI response. Tap Retry.');
  }

  let parsed: FloodAnalysisResult;
  try {
    parsed = JSON.parse(match[0]) as FloodAnalysisResult;
  } catch (parseErr) {
    console.error('[Gemini] JSON.parse failed on:', match[0]);
    throw new Error('AI response was malformed. Tap Retry.');
  }

  // ── Cache result (fire-and-forget) ─────────────────────────────────────────
  set(ref(rtdb, `analysisCache/${cacheKey}`), {
    result: parsed,
    timestamp: Date.now()
  }).catch(() => { /* non-fatal */ });

  return parsed;
}

// ─────────────────────────────────────────────────────────────────────────────
// fetchLiveWeatherAndCCTV
// Real-time weather + flood alerts per Malaysian state
// Uses gemini-2.0-flash with Google Search grounding (confirmed available)
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
    aiAnalysisText: `Live weather data temporarily unavailable for ${state}. Check local news for flood updates.`
  };

  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_ACTUAL_GEMINI_API_KEY_HERE') return fallback;

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
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in weather response');

    return JSON.parse(jsonMatch[0]) as LiveWeatherAnalysis;

  } catch (error: any) {
    const msg = error?.message ?? '';
    const status = error?.status ?? error?.code ?? 0;

    if (status === 429 || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota') || msg.includes('free_tier')) {
      console.warn(`[Weather] Rate limit for ${state} — using fallback`);
      return fallback;
    }
    if (retries > 0) {
      console.warn(`[Weather] Retrying ${state}, ${retries - 1} attempts left`);
      await new Promise(r => setTimeout(r, 2000));
      return fetchLiveWeatherAndCCTV(state, retries - 1);
    }
    console.error(`[Weather] All retries failed for ${state}:`, error);
    return fallback;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// analyzeAudio
// Flood risk detection from ambient sound (rain, rushing water, sirens, thunder)
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

  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_ACTUAL_GEMINI_API_KEY_HERE') return fallback;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
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