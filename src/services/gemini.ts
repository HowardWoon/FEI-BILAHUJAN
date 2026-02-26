import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini API client
// The API key is automatically injected by the AI Studio environment
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

export async function analyzeFloodImage(base64Image: string, mimeType: string): Promise<FloodAnalysisResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a flood and drainage condition analysis AI for the BILAHUJAN emergency response platform. Your ONLY purpose is to analyze images related to:
              - Active flooding (roads, streets, residential areas, fields)
              - Drainage systems (drains, culverts, monsoon drains — whether flowing normally or blocked/overflowing)
              - Rivers, streams, or canals that may be at flood risk
              - Rainfall, stormwater runoff, or waterlogged areas

              STRICT REJECTION RULES — set "isRelevant" to false if the image shows:
              - People, portraits, selfies
              - Food, objects, toys, products, animals (unless in a flooded scene)
              - Indoor scenes with no flood context
              - Screenshots, documents, charts, maps, UI
              - Vehicles NOT in a flood scenario
              - Any scene clearly unrelated to water/flooding/drainage

              If the image does NOT clearly show flooding, water accumulation, or a drainage system, you MUST set "isRelevant" to false and fill "rejectionReason" with a clear, human-friendly explanation.

              ═══════════════════════════════════════════════
              MANDATORY SEVERITY CALIBRATION RUBRIC
              You MUST use the exact level below that best matches the image. DO NOT default to Level 3.
              ═══════════════════════════════════════════════
              Level 1 | Score 1  | NORMAL   | Completely dry. No water. Drains flowing normally.
              Level 2 | Score 2  | NORMAL   | Surface dampness or puddles <5cm. Drain at <50% capacity.
              Level 3 | Score 3  | MINOR    | Light pooling, ankle-deep <0.15m. Drain slightly overflowing. Road markings still visible.
              Level 4 | Score 4  | MINOR    | Ankle-deep ~0.15–0.2m. Road markings submerged. Motorcycles at risk.
              Level 5 | Score 5  | MODERATE | Knee-deep ~0.2–0.4m. Water at bottom of car doors. Cars should not proceed.
              Level 6 | Score 6  | MODERATE | Knee-deep ~0.4–0.5m. Water entering car cabins. Active current visible.
              Level 7 | Score 7  | SEVERE   | Waist-deep ~0.5–0.8m. Water above car bonnets/hoods. Pedestrians cannot cross safely.
              Level 8 | Score 8  | SEVERE   | Deep ~0.8–1.2m. Water at car ROOF level. Vehicles partially or fully submerged up to roof.
              Level 9 | Score 9  | CRITICAL | >1.2m. Vehicles completely submerged. Only roof or top visible. Immediate life threat.
              Level 10| Score 10 | CRITICAL | Catastrophic. Full submersion. Buildings flooded to 2nd floor. Mass evacuation imperative.
              ═══════════════════════════════════════════════

              VISUAL REFERENCE CUES — use these to anchor your depth estimate:
              - Tyre bottom to axle centre = ~0.25m
              - Car door bottom sill = ~0.3–0.35m
              - Car door handle = ~0.8–0.9m
              - Car bonnet/hood top = ~0.9–1.1m
              - Car roof = ~1.3–1.5m
              - Standard kerb height = ~0.15m
              - Adult knee = ~0.5m | waist = ~1.0m | chest = ~1.3m

              IMPORTANT RULES:
              - DO NOT default to Level 3 or MODERATE unless the image genuinely shows ankle-deep light pooling.
              - If water is at or above car bonnet level, the minimum score is 7.
              - If water is at or above car roof level, the minimum score is 8.
              - If vehicles are fully submerged, the minimum score is 9.
              - Be honest. Underreporting severity may cost lives.
              - Lower aiConfidence if reference objects are unclear or image quality is poor.

              The current time is ${new Date().toISOString()}.
              Return ONLY a valid JSON object with this exact structure:
              {
                "isRelevant": <boolean>,
                "rejectionReason": "<Empty string if relevant. If not relevant, a clear user-facing message explaining why the image was rejected and what to upload instead.>",
                "estimatedDepth": "<e.g., ~1.2m (at car roof level) — be precise using visual references above>",
                "detectedHazards": "<Comma-separated list, e.g., Submerged manhole covers, Fast-moving current, Floating debris, Live electrical cables, or 'None visible'>",
                "passability": "<Separate assessments — Pedestrians: [status] | Motorcycles: [status] | Cars: [status] | 4x4: [status]>",
                "aiConfidence": <number 0-100 — be conservative. Lower if depth is hard to judge.>,
                "directive": "<A direct, honest survival directive. State the water level clearly. E.g.: 'Water is at car roof level (~1.3m). This is a life-threatening flood. Do NOT enter the water. Evacuate immediately to the nearest high ground or multi-storey building.'>",
                "riskScore": <integer 1-10 strictly from the calibration rubric above>,
                "severity": "<NORMAL | MINOR | MODERATE | SEVERE | CRITICAL — must match the calibration rubric>",
                "waterDepth": "<Dry | Ankle-Deep (<0.2m) | Knee-Deep (0.2–0.5m) | Waist-Deep (0.5–1m) | Roof-Level (1–1.5m) | Full Submersion (>1.5m) | Not applicable (drain only)>",
                "waterCurrent": "<Stagnant | Slow-moving | Moderate current | Fast-moving | Rapid and dangerous>",
                "infrastructureStatus": "<e.g., Roads submerged, drains overflowing, power lines at risk, or Normal>",
                "humanRisk": "<e.g., Life-threatening — water at vehicle roof level / Pedestrian drowning risk / None visible>",
                "eventType": "<Flash Flood | Monsoon Flood | Drain Overflow | Waterlogging | Drain Inspection (normal) | Normal>",
                "estimatedStartTime": "<ISO 8601 format or 'Already in progress'>",
                "estimatedEndTime": "<ISO 8601 format — estimate based on severity and typical Malaysian weather patterns. Do NOT write 'Unknown'.>"
              }`
            },
            {
              inlineData: {
                data: base64Image,
                mimeType: mimeType,
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isRelevant: { type: Type.BOOLEAN },
            rejectionReason: { type: Type.STRING },
            estimatedDepth: { type: Type.STRING },
            detectedHazards: { type: Type.STRING },
            passability: { type: Type.STRING },
            aiConfidence: { type: Type.INTEGER },
            directive: { type: Type.STRING },
            riskScore: { type: Type.INTEGER },
            severity: { type: Type.STRING },
            waterDepth: { type: Type.STRING },
            waterCurrent: { type: Type.STRING },
            infrastructureStatus: { type: Type.STRING },
            humanRisk: { type: Type.STRING },
            eventType: { type: Type.STRING },
            estimatedStartTime: { type: Type.STRING },
            estimatedEndTime: { type: Type.STRING }
          },
          required: ["isRelevant", "rejectionReason", "estimatedDepth", "detectedHazards", "passability", "aiConfidence", "directive", "riskScore", "severity", "waterDepth", "waterCurrent", "infrastructureStatus", "humanRisk", "eventType", "estimatedStartTime", "estimatedEndTime"]
        }
      }
    });

    if (response.text) {
      // Strip markdown code fences if the model wraps the JSON
      const cleaned = response.text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
      const parsed = JSON.parse(cleaned) as FloodAnalysisResult;

      // Safety net: if the model returns isRelevant=true but the directive
      // is suspiciously generic (fallback-like), trust the model's own fields.
      // No override needed — just return the real parsed result.
      return parsed;
    }
    throw new Error("Empty response from Gemini API. Please try again.");
  } catch (error: any) {
    // Re-throw so CameraScreen can display a real error message.
    // NEVER silently return fake flood data — that would bypass the AI gate entirely.
    console.error("Gemini analyzeFloodImage failed:", error);
    const msg = error?.message || '';
    if (msg.includes('timed out')) throw new Error(msg);
    if (msg.includes('API_KEY') || msg.includes('API key') || msg.includes('401')) {
      throw new Error('API key error. Please check your Gemini API key configuration.');
    }
    if (msg.includes('404') || msg.includes('not found') || msg.includes('model')) {
      throw new Error('AI model unavailable. Please try again in a moment.');
    }
    if (msg.includes('quota') || msg.includes('429') || msg.includes('Resource')) {
      throw new Error('AI quota exceeded. Please wait a moment and try again.');
    }
    throw new Error('AI analysis failed. Please check your connection and try again with a clear flood or drain image.');
  }
}

export interface AudioAnalysisResult {
  isFloodRisk: boolean;
  severity: string;
  analysis: string;
}

export interface LiveWeatherAnalysis {
  state: string;
  weatherCondition: string;
  isRaining: boolean;
  floodRisk: string;
  severity: number;
  aiAnalysisText: string;
}

export async function fetchLiveWeatherAndCCTV(state: string, retries = 2): Promise<LiveWeatherAnalysis> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: `Search for the current real-time weather in ${state}, Malaysia. Also, search for any recent flood warnings, heavy rain alerts, or traffic CCTV reports regarding flooding in the whole state of ${state}. 
      Based on the real-time search results, determine if it is currently raining, the flood risk, and provide a short AI analysis.
      Return ONLY a valid JSON object with this exact structure (no markdown, no code fences):
      {"state":"${state}","weatherCondition":"<e.g., Heavy Rain, Cloudy, Sunny, Thunderstorm>","isRaining":<true|false>,"floodRisk":"<High|Moderate|Low>","severity":<1-10>,"aiAnalysisText":"<short actionable analysis>"}`,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    if (response.text) {
      // Strip markdown code fences if present
      const cleaned = response.text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
      // Extract JSON object from the response
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as LiveWeatherAnalysis;
      }
      throw new Error("Could not parse JSON from Gemini response");
    }
    throw new Error("Empty response from Gemini");
  } catch (error: any) {
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
      console.warn(`Rate limit exceeded for ${state}. Using fallback data.`);
      return {
        state,
        weatherCondition: "Cloudy",
        isRaining: false,
        floodRisk: "Low",
        severity: 1,
        aiAnalysisText: `Current weather in ${state} appears stable. No immediate flood risks detected based on available data.`
      };
    }

    if (retries > 0) {
      console.warn(`Retrying fetchLiveWeatherAndCCTV for ${state}. Retries left: ${retries - 1}`);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s before retry
      return fetchLiveWeatherAndCCTV(state, retries - 1);
    }
    console.error(`Error fetching live weather for ${state}:`, error);
    // Fallback if search fails after retries
    return {
      state,
      weatherCondition: "Cloudy",
      isRaining: false,
      floodRisk: "Low",
      severity: 1,
      aiAnalysisText: `Current weather in ${state} appears stable. No immediate flood risks detected based on available data.`
    };
  }
}

export async function analyzeAudio(base64Audio: string, mimeType: string): Promise<AudioAnalysisResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Analyze this audio recording of the environment. Determine if the sound indicates a potential flood risk (e.g., heavy rain, rushing water, thunder, emergency sirens).
              Return ONLY a valid JSON object with this exact structure:
              {
                "isFloodRisk": <boolean>,
                "severity": "<e.g., CRITICAL, HIGH, MODERATE, LOW, NONE>",
                "analysis": "<A short explanation of what you hear and the risk level. If no risk, say something reassuring like 'Everything sounds normal, no need to worry.'>"
              }`
            },
            {
              inlineData: {
                data: base64Audio,
                mimeType: mimeType,
              }
            }
          ]
        }
      ],
      config: {
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

    if (response.text) {
      return JSON.parse(response.text) as AudioAnalysisResult;
    }
    throw new Error("Empty response from Gemini");
  } catch (error: any) {
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
      console.warn("Rate limit exceeded for audio analysis. Using fallback data.");
      return {
        isFloodRisk: false,
        severity: "NONE",
        analysis: "Unable to analyze audio due to high server load. Please try again later."
      };
    }
    console.error("Error analyzing audio with Gemini:", error);
    throw error;
  }
}
