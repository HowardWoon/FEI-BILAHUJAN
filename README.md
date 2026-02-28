<div align="center">

<br>

<pre align="center">
██████╗ ██╗██╗      █████╗ ██╗  ██╗██╗   ██╗     ██╗ █████╗ ███╗   ██╗
██╔══██╗██║██║     ██╔══██╗██║  ██║██║   ██║     ██║██╔══██╗████╗  ██║
██████╔╝██║██║     ███████║███████║██║   ██║     ██║███████║██╔██╗ ██║
██╔══██╗██║██║     ██╔══██║██╔══██║██║   ██║██   ██║██╔══██║██║╚██╗██║
██████╔╝██║███████╗██║  ██║██║  ██║╚██████╔╝╚█████╔╝██║  ██║██║ ╚████║
╚═════╝ ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝
</pre>

**AI-Powered Hyper-Local Flood Triage & Community Resilience Platform**

<br>

### *"Turning flood chaos into rescue intelligence."*

<br>

**🔴 [TEST THE LIVE PLATFORM → bilahujan-app.web.app](https://bilahujan-app.web.app)**

*Built for KitaHack 2026 · Powered by Google Gemini 2.5 Flash · Firebase · Google Maps Platform*

<br>

</div>

---

## 1) Repository Overview & Team Introduction

BILAHUJAN is a **deployed civic intelligence platform** built for **KitaHack 2026**, designed to operate at the critical intersection between civilians, AI, and emergency services. The platform directly addresses the weakest link in disaster response systems: **unstructured human reporting under panic conditions.**

Rather than acting as a passive reporting tool, BILAHUJAN functions as an **AI-mediated verification layer** that transforms chaotic, emotionally driven inputs into structured, reliable, and actionable intelligence — ensuring that emergency responders receive **objective situational awareness**, not subjective perception.

By embedding intelligence at the edge — the user's device combined with an AI interception layer — the system prevents misinformation, severity misclassification, and data noise **before it contaminates emergency databases**.

> This project is designed not as a hackathon demo, but as a **deployable civic infrastructure prototype** — built to the standards of a production system.

---

### 👥 Meet the Team

BILAHUJAN is built by a four-person multidisciplinary team, each contributing a distinct domain of expertise to deliver a production-grade civic technology platform.

| Name | Role |
|:---|:---|
| **Howard Woon Hao Zhe** | Lead Software Engineer & AI Integrator — full technical build, Gemini integration, Firebase pipeline, Google Maps overlay, all real-time application logic |
| **Sanjay Mukojima Ravindran** | Front-End Engineer & UX Architect — UI design execution, technical documentation, human-centred design under high-stress conditions |
| **Wong En Sheng** | Marketing Lead & Pitching Strategist — pitching video, marketing materials, public-facing narrative |
| **Ng Tze Fhung** | Technical Documentation Lead & Presentation Designer — system documentation, judge-facing slides, written and visual deliverables |

---

## 2) Project Overview

### 🔴 Problem Statement

Malaysia is one of Southeast Asia's most flood-prone nations. The scale of the problem is not hypothetical:

| Statistic | Figure |
|:---|:---|
| 💸 Annual economic loss from flooding | **RM 1–5 billion/year** |
| 👥 Malaysians affected annually | **200,000+** |
| ⏱️ Response time gap from poor data | **30–120 minutes** |
| 🌊 Dec 2021 Klang Valley flood | **70,000+ displaced · RM 6.1B in damage** |

> **The December 2021 Klang Valley flood was Malaysia's most devastating in a generation — yet coordinated digital reporting and real-time AI triage were largely absent. BILAHUJAN is built to close that gap.**

During rapid-onset flash floods, emergency response systems suffer from four structural failures:

| Failure | Description |
|:---|:---|
| **Subjective Severity Reporting** | Civilians misjudge danger levels due to panic, shock, or lack of situational awareness |
| **Unstructured Information Chaos** | Emergency centers receive texts, calls, and images impossible to algorithmically prioritize |
| **Zero Visual Verification** | Authorities lack standardized visual confirmation of water depth, flow speed, and hazards |
| **Infrastructure Vulnerability** | Standard apps fail when cell towers go down, leaving victims digitally stranded |

> This results in misallocated rescue resources and delayed response times — not because of lack of manpower, but because of **poor data quality**.

---

### 🌍 SDG Alignment

| SDG | Goal | BILAHUJAN's Contribution |
|:---|:---|:---|
| **SDG 11** | Sustainable Cities & Communities | Enables data-driven emergency response, reducing infrastructure strain and preventing avoidable loss of life in dense urban environments |
| **SDG 13** | Climate Action | Scalable adaptation mechanism as climate change intensifies extreme weather — communities respond intelligently, not reactively |

---

### 💡 Short Description of the Solution

> **BILAHUJAN intercepts subjective panic reports, verifies them with Gemini AI vision, restructures the data into standardized machine-readable intelligence, and delivers it to emergency responders in real time — across all 16 Malaysian states.**

```
WITHOUT BILAHUJAN                        WITH BILAHUJAN
─────────────────                        ──────────────
😰 "THE WATER IS SO HIGH HELP"      →    ✅ Severity: 8/10 | Depth: ~1.1m
📱 WhatsApp / social media chaos    →    📊 16-field validated JSON
🚒 Responders guess priority        →    🗺️  Real-time map update
⏳ 30–120 min response gap          →    ⚡ Instant structured dispatch
```

BILAHUJAN is the **only system** that combines AI vision verification, structured data collection, real-time spatial mapping, live weather intelligence, and evacuation routing in a single, publicly deployed civic platform.

---

## 3) Key Features

### `01` FloodVision Auto-Verification *(Computer Vision)*

The engine of BILAHUJAN is a **proprietary 10-level severity calibration rubric** embedded directly into the Gemini prompt — anchoring every depth estimate to physical reference objects visible in the image:

| Score | Level | Conditions | Hard Rule |
|:---:|:---|:---|:---|
| 1–2 | 🟢 NORMAL | Dry or surface dampness | — |
| 3–4 | 🟡 MINOR | Ankle-deep ≤ 0.2m | — |
| 5–6 | 🟠 MODERATE | Knee-deep 0.2–0.5m | — |
| **7** | 🔴 SEVERE | Waist-deep 0.5–0.8m | **Min 7 if bonnet submerged** |
| **8** | 🔴 SEVERE | 0.8–1.2m at car roof | **Min 8 if roof submerged** |
| **9–10** | 🆘 CRITICAL | Full vehicle / 2nd floor flooding | **Min 9 if fully submerged** |

For every image, Gemini returns **16 validated structured fields** — depth estimate, risk score, passability per vehicle class, hazard detection, water current, event type, and ISO 8601 timestamps. Zero free-form responses.

> *"Underreporting severity may cost lives."* — embedded directly in the AI prompt.

---

### `02` Audio Environment Risk Scanning

Users record **ambient sound** — Gemini classifies heavy rain, rushing water, thunder, and emergency sirens as flood risk signals. An input channel for users who cannot safely photograph the scene.

---

### `03` Live Weather Intelligence via Google Search Grounding

The Alert Menu uses **Gemini with Google Search grounding** to pull real-time weather data, rain alerts, and CCTV traffic reports for all 16 Malaysian states on demand — creating an always-current intelligence layer independent of citizen submissions.

---

### `04` All 16 States · Dual-Layer Interactive Map

**37 pre-seeded flood zones** covering every Malaysian state and territory, rendered in two simultaneous layers:

- 🔵 **State-level circles** — visible at national zoom, live-coloured by severity
- 🔷 **Fine-grained organic polygons** — appear when zooming into specific areas

---

### `05` Real-Time Evacuation Centre Discovery

When a user opens any alert, **Google Maps Places API** finds the nearest verified evacuation-suitable locations within 10km — community halls, public shelters, and schools — sorted by real geographic proximity using the **Haversine formula** and navigable with one tap.

> No hardcoded addresses. No static lists. Every result is a verified real-world location, recalculated live for every alert in every part of Malaysia.

---

### `06` Structured 5-Step Flood Reporting with Mandatory Validation Gate

The **Submit button is disabled** until all four conditions are simultaneously met:

```
[ ] Location confirmed      ← map pin placed + address resolved
[ ] Photo uploaded          ← image captured via camera or upload
[ ] AI analysis complete    ← Gemini returned valid flood analysis
[ ] Authority selected      ← at least one of JPS / NADMA / APM checked
```

Every submitted report is complete, verified, and actionable — by design.

---

### `07` Government Analytics Dashboard

- 📊 Aggregate flood statistics segmented by date range
- 🗺️ Location-based risk heatmap analytics
- 📥 One-click **CSV and JSON export** — compatible with Excel, GIS tools, and government systems

---

### `08` Real-Time Ambient Flood Alert Notifications

A continuous background monitoring loop fires event-based notifications when new zones are published or severity thresholds are crossed — users can tap through to full zone detail without abandoning their current screen.

---

## 4) Overview of Technologies Used

### 🟦 Google Technologies

| Technology | Role in BILAHUJAN |
|:---|:---|
| **Gemini 2.5 Flash** | Multi-modal AI engine: 10-level severity rubric, 16-field JSON schema, audio scanning, live weather via Search grounding |
| **Maps JavaScript API** | Real-time dual-layer flood zone visualization across all of Malaysia |
| **Places API** | Automatic discovery of nearest verified evacuation centres per alert zone |
| **Geocoding API** | 3-layer Malaysian location validation (text → coordinates → place type) |
| **Firebase Cloud Firestore** | Persistent structured storage for verified flood reports and zone data |
| **Firebase Realtime Database** | Live cross-user flood zone synchronization |
| **Firebase Hosting** | Global CDN deployment · zero infrastructure maintenance |
| **Google Search via Gemini Grounding** | Real-time weather and CCTV traffic intelligence for live state alerts |

---

### 🔧 Other Supporting Tools & Libraries

| Tool | Version | Purpose |
|:---|:---:|:---|
| React + TypeScript | 18 | Type-safe component-driven single-page application |
| Vite | 6 | Sub-4-second production builds with hot module replacement |
| Tailwind CSS | 3 | Consistent utility-first UI accessible under high-stress use |
| @google/genai SDK | 1.29 | Official Gemini client with `responseSchema` JSON enforcement |
| @react-google-maps/api | 2.20 | Type-safe React bindings for all Google Maps components |

---

## 5) Implementation Details & Innovation

### 💡 Core Innovation Philosophy

```
❌  Traditional systems:  Collect bad data → Try to fix it later
✅  BILAHUJAN:            Prevent bad data from entering the system
```

> **This is preventive intelligence architecture — not reactive processing.**

What makes this Gemini integration different from standard AI implementations:

- Forces exactly one of **10 calibrated severity levels** — never a free-form opinion
- Anchors all depth estimates to **named real-world reference objects** visible in the image
- Requires **ISO 8601 timestamps** for event start and end — "Unknown" is explicitly forbidden
- Enforces **hard score minimums** (car roof submerged = minimum score 8; full submersion = minimum score 9)
- Uses `responseSchema` — all **16 output fields** are machine-validated types, not strings to parse
- Mandates **image rejection** (`isRelevant: false`) for selfies, food, screenshots, or any non-flood content
- Self-regulates `aiConfidence` downward when image quality or reference visibility is poor

> This turns Gemini into a **calibrated scientific instrument**, not a conversational assistant.

---

### 🏗️ System Architecture

```
📸 User submits image
         │
         ▼
🤖 Gemini 2.5 Flash Vision
   (16-field validated JSON · 10-level severity rubric)
         │
    ┌────┴────┐
    │         │
    ▼         ▼
❌ Not      ✅ Relevant
  Relevant       │
    │        Firebase Realtime Sync
Rejection        │
  Modal     ┌────┴────┐
            │         │
            ▼         ▼
        🗺️ Live    📊 Government
          Map       Dashboard
         Update
            │
            ▼
    🔔 Alert Notifications
       to Nearby Users
```

---

### 🔄 Workflow — From Report to Government Action

| Step | What Happens |
|:---:|:---|
| **1** | Image captured → resized to max 800px, JPEG compressed to 70% quality |
| **2** | Gemini vision analysis → 16-field validated JSON returned |
| **3** | Relevance gate → `isRelevant: false` triggers rejection modal; no data stored |
| **4** | Severity calibration → 10-level rubric applied with hard floor rules |
| **5** | Firebase sync → validated zone pushed; all user sessions update instantly |
| **6** | Map update → severity circles and polygons re-colour in real time |
| **7** | Notifications → ambient alert fires for nearby users if critical threshold crossed |
| **8** | Government export → aggregated verified intelligence available as CSV or JSON |

---

## 6) Challenges Faced

| Challenge | Root Cause | Solution |
|:---|:---|:---|
| AI returning generic severity | LLM avoids extreme outputs by default | Mandatory 10-level calibration rubric with hard floor rules per visual reference object |
| Google Maps singleton crash | Two screens used `useJsApiLoader` with different `libraries` options | Module-level `GOOGLE_MAPS_LIBRARIES` constant shared across all screens |
| Gemini grounding + JSON schema conflict | `googleSearch` incompatible with `responseMimeType: application/json` | Removed schema constraint for grounded requests; parse JSON from free-text with regex |
| Geocoder accepting invalid inputs | Google finds fuzzy matches for random strings | 3-layer validation: Malaysia keyword + geographic bounds + real place-type filter |
| Map zones invisible at country view | Polygon paths drawn at ~0.05° radius — invisible at zoom 6 | State-level Circle overlays sized to actual state area |
| Evacuation centres hardcoded | Original design used a static address regardless of flood zone | Live Places API `nearbySearch` recalculated per zone with Haversine distance sorting |
| Camera back button returning wrong screen | `onBack` hardcoded to Map regardless of origin | `cameraOrigin` state tracks which screen opened camera; returns to correct screen |
| Gemini model name invalid | Model referenced as `gemini-3-flash-preview` which does not exist | Corrected to `gemini-2.5-flash` across all three API call sites |

---

## 7) Installation & Setup

**Prerequisites:** Node.js v18+ · Firebase CLI (`npm install -g firebase-tools`)

```bash
# Clone the repository
git clone https://github.com/HowardWoon/FEI-BILAHUJAN.git
cd bilahujan

# Install dependencies
npm install
```

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

```bash
# Start local development server
npm run dev

# Production build and deploy
npm run build
firebase deploy --only hosting
```

**🌐 Live Production Site:** https://bilahujan-app.web.app

---

## 8) Future Roadmap

| Phase | Feature | Technology | Impact |
|:---:|:---|:---|:---|
| **1** | Progressive Web App | Service Workers + Web Push | Install from browser · push alerts when app is closed |
| **2** | 🔑 Full Offline Mode | TensorFlow Lite | AI flood detection with **zero internet connection** |
| **3** | Predictive Flood Pathing | Google Elevation API + topographic modelling | Warn downstream areas **before water physically arrives** |
| **4** | AI Sensor Fusion | Device sensors + Gemini | Detect flood conditions before the user opens the app |
| **5** | Authority Command Centre | Firebase + real-time dispatch map | Full loop: Citizen → AI → Government → Rescue dispatch |

> **Phase 2 is the most critical:** when the worst floods hit, cell towers go down. On-device TensorFlow Lite would allow BILAHUJAN to perform AI flood detection with **zero internet** — functional exactly when it is most needed.

---

## 9) Full Feature Delivery Checklist

> Every item below is **live and testable** at [bilahujan-app.web.app](https://bilahujan-app.web.app)

| Feature | Status |
|:---|:---:|
| Gemini 2.5 Flash multi-modal image analysis | ✅ |
| 10-level calibrated severity rubric with visual anchors | ✅ |
| 16-field structured JSON output per analysis | ✅ |
| Image rejection gate (non-flood images blocked with explanation) | ✅ |
| Audio environment risk scanning via Gemini | ✅ |
| Live weather and CCTV intelligence via Google Search grounding | ✅ |
| 37 pre-seeded flood zones across all 16 states and territories | ✅ |
| Dual-layer map (state-level circles + fine-grained polygons) | ✅ |
| Real-time evacuation centre discovery via Places API | ✅ |
| Haversine distance sorting of evacuation centres | ✅ |
| One-tap Google Maps navigation to evacuation centre | ✅ |
| 3-layer Malaysian location validation | ✅ |
| Structured 5-step flood report with authority notification | ✅ |
| Mandatory 4-condition submission gate | ✅ |
| Real-time submission checklist with live tick-off feedback | ✅ |
| Government analytics dashboard with CSV + JSON export | ✅ |
| Real-time ambient flood alert notification stack | ✅ |
| Firebase live cross-user synchronization | ✅ |
| Firebase Hosting global CDN deployment | ✅ |

---

## 10) Commercial Viability & Data Monetization

All collected data is **fully anonymized** and **privacy-compliant** — users acknowledge the data collection notice on every app load. The anonymized dataset has direct commercial value:

| Buyer | What They Receive | Why It Has Value |
|:---|:---|:---|
| 🏦 Insurance Companies | Flood risk scores by postcode · historical incident frequency | Accurate property and vehicle insurance premium calculation |
| 🏗️ Property Developers | Zone heatmaps · drainage performance scores | Site selection, risk disclosure, infrastructure planning |
| 🏛️ Urban Planners & Councils | Drainage efficiency · critical zones · historical trends | Infrastructure investment prioritization |
| 🚨 Government (JPS, NADMA, APM) | Verified real-time intelligence · time-series exports | Emergency preparedness and resource allocation |
| 🔬 Academic & Research | Anonymized hydrology datasets | Publication-quality data at a fraction of sensor network cost |

```
Every citizen report simultaneously:
    improves public safety  AND  grows the commercial data asset
                    ↑________________________↑
                         compounds with every new user
```

---

## 11) Acknowledgements

- **KitaHack 2026** — for the platform and the opportunity
- **Google** — for Gemini, Firebase, Google Maps Platform, and the @google/genai SDK
- **NADMA, JPS, APM** — whose real-world emergency response domains shaped every design decision
- **University of Malaya** — for fostering the civic-tech thinking that inspired this build

---

<div align="center">

<br>

**SDG 11** · Sustainable Cities &nbsp;|&nbsp; **SDG 13** · Climate Action

<br>

*BILAHUJAN is dedicated to every Malaysian family that has lost property, safety, or loved ones to floodwater —*

*and to the emergency responders who work through the storm to reach them.*

<br>

**© 2026 FEI Team · Built for KitaHack 2026**

<br>

**[🌐 bilahujan-app.web.app](https://bilahujan-app.web.app)**

<br>

</div>
