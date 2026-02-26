# BILAHUJAN
### AI-Powered Hyper-Local Flood Triage & Community Resilience Platform

---

> **LIVE AND DEPLOYED — Test it now:**
> **https://bilahujan-app.web.app**
>
> *Built for KitaHack 2026 · Powered by Google Gemini 2.0 Flash · Firebase · Google Maps Platform*

---

## 1) Repository Overview and Team Introduction

BILAHUJAN is an intelligent disaster response **web application** built for **KitaHack 2026**, designed to operate at the critical intersection between civilians, AI, and emergency services. The platform directly addresses the weakest link in disaster response systems: **unstructured human reporting under panic conditions.**

Rather than acting as a passive reporting tool, BILAHUJAN functions as an **AI-mediated verification layer** that transforms chaotic, emotionally driven inputs into structured, reliable, and actionable intelligence. This ensures that emergency responders receive **objective situational awareness**, not subjective perception.

By embedding intelligence at the edge — the user's device combined with an AI interception layer — the system prevents misinformation, severity misclassification, and data noise **before it contaminates emergency databases**.

---

### Meet the Team

BILAHUJAN is built by a four-person multidisciplinary team competing in **KitaHack 2026**, each member contributing a distinct domain of expertise to deliver a production-grade civic technology platform.

---

**Howard Woon Hao Zhe** — Lead Software Engineer & AI Integrator

A first-year Computer Science (Software Engineering) student at the University of Malaya, combining financial analytics discipline with systems engineering thinking. Responsible for the full technical build of the platform — including the Gemini AI integration, Firebase data pipeline, Google Maps overlay system, and all real-time application logic. Focused on building scalable, deployable architectures rather than demo-only prototypes. Core interests include AI systems design, distributed architectures, and civic-tech innovation.

---

**Sanjay Mukojima Ravindran** — Front-End Engineer & UX Architect

Responsible for front-end design execution, technical documentation, and user experience architecture. Translates complex data pipelines and AI-generated outputs into intuitive, accessible user interfaces — ensuring that emergency features remain operable under high-stress conditions. Applies human-centred design principles to bridge the gap between technical capability and real-world usability.

---

**Wong En Sheng** — Marketing Lead & Pitching Strategist

Leads the communication and public-facing narrative of BILAHUJAN. Responsible for producing the pitching video and marketing materials, distilling the platform's technical value into a compelling story for both technical evaluators and general audiences. Ensures the project's civic impact is clearly articulated and resonates with the hackathon's mission.

---

**Ng Tze Fung** — Technical Documentation Lead & Presentation Designer

Owns the technical documentation suite and presentation deck for BILAHUJAN. Responsible for structuring complex system architectures and feature sets into clear, professional documentation and judge-facing slides. Ensures consistency, clarity, and precision across all written and visual deliverables.

---

> This project is designed not as a hackathon demo, but as a **deployable civic infrastructure prototype** — built to the standards of a production system.

---

## 2) Project Overview

### The Problem — Grounded in Real Data

Malaysia is one of Southeast Asia's most flood-prone nations. The scale of the problem is not hypothetical:

| Statistic | Figure |
|---|---|
| Annual economic loss from flooding | RM 1–5 billion per year |
| Malaysians affected by floods annually | 200,000+ |
| Response time gap from poor situational data | 30–120 minutes in uncoordinated events |
| States with highest urban flood risk | Selangor, Johor, Kelantan, Pahang, Terengganu |
| Dec 2021 Klang Valley flood (worst in decades) | 70,000+ displaced; RM 6.1 billion in damage |

> The December 2021 Klang Valley flood was Malaysia's most devastating in a generation — yet coordinated digital reporting and real-time AI triage were largely absent. BILAHUJAN is built to close that gap.

During rapid-onset flash floods, emergency response systems suffer from four structural failures:

| Failure | Description |
|---|---|
| **Subjective Severity Reporting** | Civilians misjudge danger levels due to panic, shock, or lack of situational awareness |
| **Unstructured Information Chaos** | Emergency centers receive text messages, calls, and images impossible to algorithmically prioritize |
| **Zero Visual Verification** | Authorities lack standardized visual confirmation of water depth, flow speed, and hazards |
| **Infrastructure Vulnerability** | Standard apps fail when cell towers go down during storms, leaving victims digitally stranded |

> This results in misallocated rescue resources and delayed response times — not because of lack of manpower, but because of **poor data quality**.

---

### Why Existing Solutions Are Not Enough

BILAHUJAN is not building in a vacuum. Existing tools have well-documented limitations:

| Existing Tool | Critical Gap |
|---|---|
| WhatsApp / Telegram groups | Unverified, unstructured, no AI triage, no spatial indexing |
| MySejahtera / government portals | Reactive reporting only; no AI severity scoring; no real-time map |
| JPS flood portals | Sensor-based only — no citizen image reporting pipeline |
| Generic weather apps | No flood-specific intelligence; no community layer; no AI vision |
| Social media (Twitter/X, Facebook) | Noise-to-signal ratio is catastrophic during disasters |

> **BILAHUJAN is the only system that combines AI vision verification, structured data collection, real-time spatial mapping, live weather intelligence, and evacuation routing in a single, publicly deployed civic platform.**

---

### SDG Alignment

| SDG | Goal | BILAHUJAN's Contribution |
|---|---|---|
| **SDG 11** | Sustainable Cities and Communities | Enables data-driven emergency response, reducing infrastructure strain and preventing avoidable loss of life in dense urban environments |
| **SDG 13** | Climate Action | Scalable adaptation mechanism as climate change intensifies extreme weather — communities respond intelligently, not reactively |
| **SDG 17** | Partnerships for the Goals | Bridges citizens, AI, government agencies (JPS, NADMA, APM), and the private sector through a shared verified data infrastructure |

---

### Solution in One Sentence

> BILAHUJAN intercepts subjective panic reports, verifies them with Gemini AI vision, restructures the data into standardized machine-readable intelligence, and delivers it to emergency responders in real time — across all 16 Malaysian states.

---

## 3) Key Features

### 1. FloodVision Auto-Verification — Multi-Modal AI Analysis

The engine of BILAHUJAN is a **proprietary 10-level severity calibration rubric** embedded directly into the Gemini prompt. This prevents the AI from defaulting to generic responses by anchoring every depth estimate to physical objects visible in the image:

| Severity | Label | Conditions | Hard Rule |
|---|---|---|---|
| 1–2 | NORMAL | Dry or surface dampness; drain under 50% | — |
| 3–4 | MINOR | Ankle-deep up to 0.2m; road markings submerged | — |
| 5–6 | MODERATE | Knee-deep 0.2–0.5m; water at car door level | — |
| 7 | SEVERE | Waist-deep 0.5–0.8m; above car bonnet | Score forced to minimum 7 if bonnet submerged |
| 8 | SEVERE | 0.8–1.2m; water at car roof | Score forced to minimum 8 if roof submerged |
| 9–10 | CRITICAL | Full vehicle submersion; 2nd-floor flooding | Score forced to minimum 9 if fully submerged |

**Visual Reference Anchors the AI uses:**

| Object | Real-world Height |
|---|---|
| Standard kerb | ~0.15m |
| Tyre bottom to axle centre | ~0.25m |
| Car door bottom sill | ~0.30–0.35m |
| Car door handle | ~0.80–0.90m |
| Car bonnet/hood top | ~0.90–1.10m |
| Car roof | ~1.30–1.50m |
| Adult knee / waist / chest | ~0.5m / 1.0m / 1.3m |

For every image, Gemini returns **16 validated structured fields** enforced by a JSON response schema:

- Water depth estimate with visual reference citation
- Risk score 1–10 from the calibrated rubric (never a generic guess)
- Passability for each vehicle class: Pedestrian / Motorcycle / Car / 4x4
- Detected hazards: submerged manholes, live cables, fast current, floating debris
- Water current: Stagnant / Slow / Moderate / Fast / Rapid and dangerous
- Infrastructure status
- Human risk level
- Event type: Flash Flood / Monsoon Flood / Drain Overflow / Waterlogging / Normal
- Estimated start and end times in ISO 8601 format
- AI confidence score (auto-lowered when reference objects are unclear)

> "Underreporting severity may cost lives." The AI is explicitly instructed to be honest, not reassuring.

---

### 2. Audio Environment Risk Scanning

Beyond images, BILAHUJAN supports **ambient audio analysis** — the user records surrounding sound and Gemini classifies the environmental threat level. Heavy rain, rushing water, thunder, and emergency sirens are automatically identified as flood risk signals. This provides an input channel for users who cannot photograph the scene safely.

---

### 3. Live Weather Intelligence via Google Search Grounding

The Alert Menu includes a **Live Refresh** system that calls Gemini with Google Search grounding enabled — pulling real-time weather data, rain alerts, and CCTV traffic reports for all 16 Malaysian states on demand. This creates an always-current intelligence layer that is independent of citizen submissions.

---

### 4. All 16 States / Territories — Dual-Layer Map

BILAHUJAN ships with **37 pre-seeded flood zones** covering every Malaysian state and federal territory: Johor, Pahang, Kelantan, Terengganu, Perak, Penang, Kedah, Selangor, Negeri Sembilan, Melaka, Perlis, Sabah, Sarawak, Kuala Lumpur, Putrajaya, and Labuan.

Two rendered layers work simultaneously:

- **State-level circles** — visible at national zoom (level 6), proportionally sized to each state's real area (Sarawak: 160km radius, KL: 14km, Labuan: 6km), live-coloured by severity
- **Fine-grained organic polygons** — irregular zone shapes that appear when the user zooms into specific areas

---

### 5. Real-Time Evacuation Centre Discovery

When a user opens any alert, BILAHUJAN calls **Google Maps Places API (`nearbySearch`)** to find the nearest real, verified evacuation-suitable locations within 10km — targeting community halls (`dewan orang ramai`), public shelters (`balai raya`), and schools. Results are:

- Sorted by real geographic proximity using the Haversine formula
- Displayed as a ranked selectable list with distance shown
- Immediately navigable via a one-tap Google Maps directions link

> No hardcoded addresses. No static lists. Every result is a verified real-world location, recalculated live for every alert in every part of Malaysia.

---

### 6. Structured 5-Step Flood Reporting with Mandatory Validation Gate

The Report screen guides users through a validated submission flow:

1. **Confirm Location** — geocoded with Malaysian bounds validation; map pin is editable
2. **Upload Photo** — triggers the full Gemini verification pipeline
3. **Additional Details** — free-text context
4. **Notify Authorities** — select JPS, NADMA, and/or APM
5. **AI Analysis Results** — Gemini output displayed inline before submission

The **Submit Report** button is disabled and visually grayed out until all four mandatory conditions are simultaneously satisfied:

| Condition | What triggers it |
|---|---|
| Location confirmed | Map marker placed and address resolved via geocoder or map click |
| Photo uploaded | Image file selected via the camera/upload flow |
| AI analysis complete | Gemini has returned a valid flood analysis for the uploaded photo |
| Authority selected | At least one of JPS, NADMA, or APM is checked |

A real-time checklist appears above the button, ticking off each condition as it is met. The button turns orange and becomes active only when all four are satisfied — ensuring every submitted report is complete, verified, and actionable.

---

### 7. 3-Layer Location Validation (Anti-Noise System)

The map search enforces three independent checks before showing any result:

1. Geocoded address must explicitly contain the word "Malaysia"
2. Coordinates must fall within Malaysia's geographic bounds (1.0deg–7.5deg N, 99.0deg–120.0deg E)
3. Google result type must be a real named place (locality, establishment, POI) — not a fuzzy route, premise, or plus-code match

> This blocks nonsense inputs like random strings or locations outside Malaysia from producing results — maintaining data integrity at the first point of contact.

---

### 8. Government Analytics Dashboard

A dedicated government-facing dashboard provides:

- Aggregate flood statistics segmented by date range
- Location-based risk heatmap analytics
- Drainage efficiency and infrastructure status summaries
- One-click **CSV and JSON data exports** compatible with Excel, GIS tools, and government systems

---

### 9. Real-Time Ambient Flood Alert Notifications

A continuous background monitoring loop fires event-based notifications when new zones are published or severity thresholds are crossed. An overlay notification stack appears in real time — users can tap through to full zone detail without abandoning their current screen.

---

## 4) Technologies Used

### Google Technologies

| Technology | Role in BILAHUJAN |
|---|---|
| **Gemini 2.0 Flash** | Multi-modal AI engine: flood image analysis with 10-level rubric, audio scanning, live weather intelligence via Search grounding, structured JSON schema output |
| **Google Maps — Maps JavaScript API** | Real-time dual-layer flood zone visualization across all of Malaysia |
| **Google Maps — Places API** | Automatic discovery of nearest verified evacuation centres per alert zone |
| **Google Maps — Geocoding API** | 3-layer Malaysian location validation (text to coordinates to place type) |
| **Firebase Cloud Firestore** | Persistent structured storage for verified flood reports and zone data |
| **Firebase Realtime Database** | Live cross-user flood zone synchronization |
| **Firebase Hosting** | Global CDN deployment; zero infrastructure maintenance |
| **Google Search via Gemini Grounding** | Real-time weather and CCTV traffic intelligence for live state alerts |

### Supporting Stack

| Tool | Purpose |
|---|---|
| React 18 + TypeScript | Type-safe component-driven single-page application |
| Vite 6 | Sub-4-second production builds with hot module replacement |
| Tailwind CSS | Consistent utility-first UI accessible under high-stress use |
| @google/genai SDK v1.29 | Official Gemini client with responseSchema JSON enforcement |
| @react-google-maps/api v2.20 | Type-safe React bindings for all Google Maps components |

---

## 5) AI Architecture Deep-Dive

### Core Design Principle

> Traditional systems collect bad data and try to fix it later.
> BILAHUJAN **prevents bad data from entering the system.**
> This is **preventive intelligence architecture**, not reactive processing.

### What Makes This Gemini Integration Different

Standard AI integrations send a simple free-form prompt. BILAHUJAN embeds a **multi-constraint deterministic prompt system** that:

- Forces exactly one of 10 calibrated severity levels — never a free-form opinion
- Anchors all depth estimates to named real-world reference objects visible in the submitted image
- Requires ISO 8601 timestamps for event start and end — "Unknown" is explicitly forbidden in the prompt
- Enforces hard score minimums (car roof submerged = minimum score 8; full submersion = minimum score 9)
- Uses `responseSchema` via @google/genai — all 16 output fields are machine-validated types, not strings to parse
- Mandates image rejection (`isRelevant: false`) for selfies, food, screenshots, documents, or any non-flood content
- Self-regulates `aiConfidence` downward when image quality or reference visibility is poor

This turns Gemini into a **calibrated scientific instrument**, not a conversational assistant.

### End-to-End Data Flow

```
User submits image
        |
        v
Gemini 2.0 Flash Vision
(16-field validated JSON, 10-level severity rubric)
        |
   +----|----+
   |         |
   v         v
Not relevant  Relevant
   |              |
Rejection     Firebase Realtime Sync
Modal              |
              +----+----+
              |         |
              v         v
          Live Map   Government
          Updated    Dashboard
              |
              v
       Alert Notifications
       to Nearby Users
```

### From Report to Government Action

| Step | What Happens |
|---|---|
| 1. Image captured | Resized to max 800px, JPEG compressed to 70% quality for fast upload |
| 2. Gemini vision analysis | 16-field validated JSON: depth, score 1–10, hazards, passability x4, event type, ISO timestamps |
| 3. Relevance gate | `isRelevant: false` triggers rejection modal; no data stored |
| 4. Severity calibration | 10-level rubric applied with hard floor rules; AI confidence auto-adjusted |
| 5. Firebase sync | Validated zone pushed to Realtime Database; all user sessions update instantly |
| 6. Map update | Severity circles and polygons re-colour in real time across all users |
| 7. Notifications | If critical threshold crossed, ambient alert fires for nearby users |
| 8. Government export | Aggregated verified intelligence available as CSV or JSON one-click download |

---

## 6) Engineering Challenges and Solutions

| Challenge | Root Cause | Solution Implemented |
|---|---|---|
| AI returning generic severity | LLM default behaviour avoids extreme outputs | Mandatory 10-level calibration rubric with hard floor rules per visual reference object |
| Google Maps singleton loader crash | Two screens used `useJsApiLoader` with different `libraries` options | Module-level `GOOGLE_MAPS_LIBRARIES` constant shared across all screens |
| Gemini grounding rejecting JSON schema | `googleSearch` grounding is incompatible with `responseMimeType: application/json` | Removed schema constraint for grounded requests; parse JSON from free-text response with regex |
| Geocoder accepting invalid inputs | Google Geocoder finds fuzzy matches for random strings | 3-layer validation: Malaysia keyword + geographic bounds + real place-type filter |
| Evacuation centres hardcoded | Original design used a static address regardless of flood zone location | Live Places API `nearbySearch` recalculated per zone; Haversine distance sorting |
| Map zones invisible at country view | Polygon paths drawn at ~0.05 degree radius — invisible at zoom 6 | State-level Circle overlays sized to actual state area |
| Report screen rendering blank | `useJsApiLoader` singleton crashes when `libraries` options differ | Standardised all loader calls with identical `id` and `libraries` props |
| Camera back button returning to wrong screen | `onBack` hardcoded to navigate to Map regardless of origin | `cameraOrigin` state tracks which screen opened the camera; back returns to the correct one |
| Gemini model name invalid | Model was referenced as `gemini-3-flash-preview` which does not exist | Corrected to `gemini-2.0-flash` across all three API call sites |

---

## 7) Full Feature Delivery Checklist

Every item below is live and testable at **https://bilahujan-app.web.app**

| Feature | Status |
|---|---|
| Gemini 2.0 Flash multi-modal image analysis | Delivered |
| 10-level calibrated severity rubric with visual anchors | Delivered |
| 16-field structured JSON output per analysis | Delivered |
| Image rejection gate (non-flood images blocked with explanation) | Delivered |
| Audio environment risk scanning via Gemini | Delivered |
| Live weather and CCTV intelligence via Google Search grounding | Delivered |
| 37 pre-seeded flood zones across all 16 states and territories | Delivered |
| Dual-layer map (state-level circles + fine-grained polygons) | Delivered |
| Real-time evacuation centre discovery via Places API | Delivered |
| Haversine distance sorting of evacuation centres | Delivered |
| One-tap Google Maps navigation to selected evacuation centre | Delivered |
| 3-layer Malaysian location validation | Delivered |
| Structured 5-step flood report with authority notification | Delivered |
| Mandatory 4-condition submission gate (location + photo + AI + authority) | Delivered |
| Real-time submission checklist with live tick-off feedback | Delivered |
| Government analytics dashboard with CSV and JSON export | Delivered |
| Real-time ambient flood alert notification stack | Delivered |
| Firebase live cross-user synchronization | Delivered |
| Firebase Hosting global CDN deployment | Delivered |
| Privacy-first data collection with in-app consent notice | Delivered |
| Screen-aware camera back navigation | Delivered |
| Alert list organized by all 16 Malaysian states | Delivered |

---

## 8) Data Monetization and Commercial Viability

BILAHUJAN has a concrete commercial strategy that activates as its user base scales.

### Anonymized Flood Intelligence as a Product

All collected data is **fully anonymized** and **privacy-compliant** — users acknowledge the data collection notice on every app load. The anonymized dataset has direct commercial value:

| Buyer | What They Receive | Why It Has Value |
|---|---|---|
| Insurance Companies | Flood risk scores by postcode, historical incident frequency | Accurate property and vehicle insurance premium calculation |
| Property Developers | Zone heatmaps, drainage performance scores | Site selection, risk disclosure, infrastructure planning |
| Urban Planners and Local Councils | Drainage efficiency, critical zones, historical trends | Infrastructure investment prioritization |
| Government Agencies (JPS, NADMA, APM) | Verified real-time intelligence; time-series exports | Emergency preparedness and resource allocation |
| Academic and Research Institutions | Anonymized datasets for hydrology and climate research | Publication-quality data at a fraction of sensor network cost |

### The Self-Reinforcing Value Loop

```
Citizen submits flood report
           |
           v
AI verifies and structures data
           |
           v
Anonymized data stored in Firebase
           |
      +----+----+
      |         |
      v         v
  Public    Commercial
  Safety    Intelligence
  Tool      Data Product
```

Every report simultaneously improves public safety AND grows the commercial data asset. Both objectives compound with every new user.

---

## 9) Future Roadmap

| Phase | Feature | Technology | Impact |
|---|---|---|---|
| Phase 1 | Progressive Web App | Service Workers + Web Push | Install from browser; push alerts when app is closed |
| Phase 2 | On-Device AI (Full Offline Mode) | TensorFlow Lite | Run flood detection with zero internet — works during total infrastructure blackout |
| Phase 3 | Predictive Flood Pathing | Google Elevation API + topographic modelling | Warn downstream areas before water physically arrives |
| Phase 4 | AI Sensor Fusion | Device sensors + Gemini | Detect flood conditions before the user even opens the app |
| Phase 5 | Authority Command Centre | Firebase + real-time dispatch map | Full loop: Citizen to AI to Government to Rescue dispatch |

> Phase 2 is the most critical: when the worst floods hit, cell towers go down. On-device TensorFlow Lite would allow BILAHUJAN to perform AI flood detection with **zero internet connection** — functional exactly when it is most needed.

---

## 10) Installation and Setup

**Prerequisites:**
- Node.js v18+
- Firebase CLI: `npm install -g firebase-tools`
- A `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

```bash
# Clone the repository
git clone https://github.com/howardwoonhz06/bilahujan.git
cd bilahujan

# Install dependencies
npm install

# Start local development server
npm run dev

# Production build and deploy
npm run build
firebase deploy --only hosting
```

**Live Production Site:** https://bilahujan-app.web.app

---

## 11) Acknowledgements

BILAHUJAN was built fully within the KitaHack 2026 hackathon window. Every component — the Gemini prompt calibration rubric, the Places API evacuation logic, the dual-layer map architecture, the 3-layer location validator — was conceived, implemented, debugged, and deployed from scratch under hackathon time pressure.

- **KitaHack 2026 Organizers** — for the platform and the opportunity
- **Google** — for Gemini, Firebase, Google Maps Platform, and the @google/genai SDK
- **NADMA, JPS, APM** — whose real-world emergency response domains shaped every design decision in this platform
- **University of Malaya** — for fostering the civic-tech thinking that inspired this build

---

> *BILAHUJAN is dedicated to every Malaysian family that has lost property, safety, or loved ones to floodwater — and to the emergency responders who work through the storm to reach them.*

---

*Copyright (c) 2026 FEI — Developed for KitaHack 2026.*
