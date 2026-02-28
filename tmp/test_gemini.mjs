import { readFileSync } from 'fs';
import https from 'https';

const KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

// Download a real public JPEG image
function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('base64')));
      res.on('error', reject);
    }).on('error', reject);
  });
}

const TINY_BLUE_JPEG = await downloadImage('https://www.gstatic.com/webp/gallery/1.jpg')
  .catch(() => null);

// Fallback to a slightly bigger valid JPEG if download fails
const b64Image = TINY_BLUE_JPEG || 
  "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgICAgMCAgIDAwMDBAYEBAQEBAgGBgUGCQgKCgkICQkKDA8MCgsOCwkJDRENDg8QEBEQCgwSExIQEw8QEBD/2wBDAQMDAwQDBAgEBAgQCwkLEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBD/wAARCAAQABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgcE/8QAJBAAAQMEAgIDAQAAAAAAAAAAAQIDBAURBhIhMUFR/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AMqpBWpKCQVKOgMnvSVTVRhlqPLkOOoiJJbZHCpSE7lAfknW9DW9Y1rxVLp9Vpl1kqafCF8bUhOlJ+KH/9k=";

const prompt = `You are a Malaysian flood risk AI analyst. Analyze this image.

STEP 1: Is this image showing flood, water, or drainage conditions?
If NO: set isRelevant=false, explain in rejectionReason, return zero/empty defaults.

YOU MUST return ONLY the JSON object below. No markdown. No code fences. No text before or after.

{"isRelevant":true,"rejectionReason":"","estimatedDepth":"~0.3m","detectedHazards":"Submerged manholes, floating debris","passability":"Pedestrians:Caution|Motorcycles:Avoid|Cars:Avoid|4x4:Caution","aiConfidence":80,"directive":"Water is knee-deep. Avoid crossing.","riskScore":5,"severity":"MODERATE","waterDepth":"Knee-Deep (0.3-0.5m)","waterCurrent":"Slow","infrastructureStatus":"Roads partially submerged","humanRisk":"Moderate","eventType":"Flash Flood","estimatedStartTime":"Already in progress","estimatedEndTime":"2026-02-28T14:00:00.000Z"}`;

const body = {
  contents: [{
    parts: [
      { text: prompt },
      { inline_data: { mime_type: "image/jpeg", data: b64Image } }
    ]
  }],
  generationConfig: {
    temperature: 0.1,
    maxOutputTokens: 512,
    topP: 0.8,
    topK: 10,
    thinkingConfig: { thinkingBudget: 0 }
  }
};

const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${KEY}`;

console.log("🔍 Testing gemini-2.5-flash with image + thinkingBudget:0 ...\n");

const res = await fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
});

const data = await res.json();

if (!res.ok) {
  console.error("❌ HTTP", res.status, JSON.stringify(data.error));
  process.exit(1);
}

const parts = data?.candidates?.[0]?.content?.parts ?? [];
console.log("✅ HTTP 200 — Parts count:", parts.length);
parts.forEach((p, i) => {
  console.log(`  Part[${i}]: thought=${p.thought ?? false} | text="${(p.text ?? '').slice(0, 200)}"`);
});

const rawText = [...parts].reverse().find(p => p.text && !p.thought)?.text ?? parts[0]?.text ?? '';
const stripped = rawText.replace(/^```(?:json)?\s*/im, '').replace(/\s*```\s*$/im, '').trim();
const match = stripped.match(/\{[\s\S]*\}/);

if (!match) {
  console.error("❌ No JSON found in response:", stripped);
  process.exit(1);
}

try {
  const parsed = JSON.parse(match[0]);
  console.log("\n✅ JSON parsed successfully!");
  console.log("  isRelevant:", parsed.isRelevant);
  console.log("  riskScore:", parsed.riskScore);
  console.log("  severity:", parsed.severity);
  console.log("  directive:", parsed.directive);
  console.log("\n🎉 Gemini integration is working correctly!");
} catch (e) {
  console.error("❌ JSON.parse failed:", e.message, "\nRaw:", match[0]);
  process.exit(1);
}
