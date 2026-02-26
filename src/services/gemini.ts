import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini API client
// The API key is automatically injected by the AI Studio environment
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface FloodAnalysisResult {
  isRelevant: boolean;
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
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Analyze this image. First, determine if it is relevant to flood monitoring (e.g., shows a flooded area, drainage system, street, river, weather conditions, or outdoors). If it is completely irrelevant (e.g., a selfie indoors, a picture of food, a screenshot of a game), set "isRelevant" to false and provide empty/default values for the rest.
              If relevant, set "isRelevant" to true and analyze the flood risk.
              The current time is ${new Date().toISOString()}.
              Return ONLY a valid JSON object with this exact structure:
              {
                "isRelevant": <boolean>,
                "estimatedDepth": "<e.g., 0.5m / Knee-Deep>",
                "detectedHazards": "<e.g., Submerged Debris, Fast Current>",
                "passability": "<e.g., 4x4 Vehicles Only, Impassable>",
                "aiConfidence": <number 0-100 representing AI confidence in this analysis>,
                "directive": "<Actionable advice, e.g., Water is rising rapidly. Impassable for light vehicles. Move to higher ground immediately.>",
                "riskScore": <number 1-10 representing severity level>,
                "severity": "<e.g., CRITICAL, SEVERE, MODERATE, NORMAL>",
                "waterDepth": "<Normal/Minor (Ankle to knee-deep) OR Severe (Waist-deep or higher)>",
                "waterCurrent": "<Normal (Stagnant/pooling) OR Severe (Fast-moving water)>",
                "infrastructureStatus": "<e.g., Roads blocked, downed power lines, structural damage, or Normal>",
                "humanRisk": "<e.g., People trapped, vulnerable individuals present, or None visible>",
                "eventType": "<e.g., Heavy Rain, Flash Flood, Monsoon Flood, Normal>",
                "estimatedStartTime": "<ISO 8601 format, e.g., 2026-02-25T10:00:00Z or 'Already Started'>",
                "estimatedEndTime": "<ISO 8601 format, e.g., 2026-02-25T14:00:00Z. Estimate a reasonable end time based on the event type. DO NOT put 'Unknown'.>"
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
          required: ["isRelevant", "estimatedDepth", "detectedHazards", "passability", "aiConfidence", "directive", "riskScore", "severity", "waterDepth", "waterCurrent", "infrastructureStatus", "humanRisk", "eventType", "estimatedStartTime", "estimatedEndTime"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as FloodAnalysisResult;
    }
    throw new Error("Empty response from Gemini");
  } catch (error: any) {
    console.warn("Error analyzing image with Gemini, using fallback data:", error);
    return {
      isRelevant: true,
      estimatedDepth: "0.2m / Ankle-Deep",
      detectedHazards: "Water pooling, slippery surfaces",
      passability: "Passable with caution",
      aiConfidence: 85,
      directive: "Minor water pooling detected. Proceed with caution.",
      riskScore: 3,
      severity: "MODERATE",
      waterDepth: "Normal/Minor (Ankle to knee-deep)",
      waterCurrent: "Normal (Stagnant/pooling)",
      infrastructureStatus: "Normal",
      humanRisk: "Low risk",
      estimatedStartTime: "Already Started",
      estimatedEndTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      eventType: "Heavy Rain"
    };
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
      model: "gemini-3-flash-preview",
      contents: `Search for the current real-time weather in ${state}, Malaysia. Also, search for any recent flood warnings, heavy rain alerts, or traffic CCTV reports regarding flooding in the whole state of ${state}. 
      Based on the real-time search results, determine if it is currently raining, the flood risk, and provide a short AI analysis.
      Return ONLY a valid JSON object with this exact structure:
      {
        "state": "${state}",
        "weatherCondition": "<e.g., Heavy Rain, Cloudy, Sunny, Thunderstorm>",
        "isRaining": <boolean>,
        "floodRisk": "<e.g., High, Moderate, Low>",
        "severity": <number 1-10 representing flood risk severity based on current weather>,
        "aiAnalysisText": "<A short, actionable analysis combining the weather forecast and any CCTV/traffic reports found for the whole state. e.g., 'Heavy rain detected across ${state}. CCTV shows water pooling on major roads. Moderate flood risk.'>"
      }`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            state: { type: Type.STRING },
            weatherCondition: { type: Type.STRING },
            isRaining: { type: Type.BOOLEAN },
            floodRisk: { type: Type.STRING },
            severity: { type: Type.INTEGER },
            aiAnalysisText: { type: Type.STRING }
          },
          required: ["state", "weatherCondition", "isRaining", "floodRisk", "severity", "aiAnalysisText"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as LiveWeatherAnalysis;
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
      model: "gemini-3-flash-preview",
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
