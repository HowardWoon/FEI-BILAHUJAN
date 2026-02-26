# 🌧️ BILAHUJAN
### AI-Powered Hyper-Local Flood Triage & Community Resilience Platform


---

## 1) Repository Overview & Team Introduction

BILAHUJAN is an intelligent disaster response **web application** built for **KitaHack 2026**, designed to operate at the critical intersection between civilians, AI, and emergency services. The platform directly addresses the weakest link in disaster response systems: **unstructured human reporting under panic conditions.**

Rather than acting as a passive reporting tool, BILAHUJAN functions as an **AI-mediated verification layer** that transforms chaotic, emotionally driven inputs into structured, reliable, and actionable intelligence. This ensures that emergency responders receive **objective situational awareness**, not subjective perception.

By embedding intelligence at the edge (user device + AI interception layer), the system prevents misinformation, severity misclassification, and data noise before it contaminates emergency databases.

### 👤 Meet the Developer

**HOWARD WOON HAO ZHE** — Lead Software Engineer & AI Integrator

A first-year Computer Science (Software Engineering) student at the University of Malaya, combining financial analytics discipline with systems engineering thinking. Focused on building scalable, real-world deployable architectures rather than demo-only prototypes. Core interests include AI systems design, distributed architectures, and civic-tech innovation.

> This project is designed not as a hackathon demo, but as a **deployable civic infrastructure prototype.**

---

## 2) Project Overview

### 🔴 Problem Statement

During rapid-onset flash floods in Malaysia (especially in dense urban regions like Selangor), emergency response systems suffer from four structural failures:

| Failure | Description |
|---|---|
| **Subjective Severity Reporting** | Civilians misjudge danger levels due to panic, shock, or lack of situational awareness. |
| **Unstructured Information Chaos** | Emergency centers receive text messages, calls, images, and descriptions that are impossible to algorithmically prioritize in real time. |
| **Zero Visual Verification** | Authorities lack standardized visual confirmation of water depth, flow speed, and physical hazards. |
| **Infrastructure Vulnerability** | Standard apps fail when cell towers go down during storms, leaving victims digitally stranded. |

> This results in misallocated rescue resources and delayed response times — not because of lack of manpower, but because of **poor data quality.**

---

### 🌍 SDG Alignment

- **SDG 11 – Sustainable Cities and Communities**
  BILAHUJAN strengthens urban resilience by enabling data-driven emergency response, reducing infrastructure strain and preventing avoidable loss of life.

- **SDG 13 – Climate Action**
  As climate change increases extreme weather frequency, BILAHUJAN provides a scalable adaptation mechanism that helps communities respond intelligently rather than react chaotically.

---

### 💡 Solution Description

BILAHUJAN eliminates panic bias and misinformation at the source. Instead of trusting user-selected severity levels, the system:

- ✅ Uses **AI vision** to objectively estimate water depth
- ✅ Uses **NLP** to interpret urgency from language
- ✅ **Cross-validates** text and image data
- ✅ **Auto-corrects** severity classification
- ✅ Outputs **standardized, machine-readable intelligence**

> The result: **structured threat intelligence**, not social media-style reporting.

---

## 3) Key Features

### 🔭 FloodVision Auto-Verification (Computer Vision)

The AI system performs **contextual visual analysis**, not simple image classification. It detects reference objects (vehicles, doors, walls) to approximate real-world scale and water depth estimation.

This allows responders to receive **quantified flood metrics** (e.g., *"Water Level: 0.5m"*) instead of vague descriptions.

---

### 🧠 Smart NLP Triage & Correction

Instead of trusting user-selected severity, the AI performs **semantic risk extraction** — analyzing keywords (*"trapped"*, *"rising fast"*, *"elderly"*) to infer the true threat level.

This prevents underreporting of life-threatening situations and enforces data integrity **before storage.**

---

### 📡 Edge AI Survival Mode (Offline Intelligence)
> *Powered by Gemini AI with local fallback logic*

Disaster apps have a fatal flaw: they fail when the internet cuts out. BILAHUJAN is designed with resilience in mind — core flood zone data and risk logic are cached locally so users still see relevant alerts even during connectivity loss.

- **Capability:** Displays last-known flood zone data and risk levels without an active connection.
- **Impact:** Ensures victims can still access critical information even during **degraded network conditions.**

---

### 🗺️ Predictive Flood Pathing (Scientific Defense)
> *Powered by Google Maps Platform*

Moves the platform from *"Social Media for Floods"* to **"Scientific Defense."** By analyzing geolocated flood reports and their positions, the system logic works like this:

> *"If Report A is at High Ground, and gravity flows to Point B (Low Ground), warn Point B before the water arrives."*

This turns **reactive reporting into proactive warning.**

---

## 4) Overview of Technologies Used

### 🟦 Google Technologies

| Technology | Role |
|---|---|
| **Gemini Flash (gemini-3-flash-preview)** | Multi-modal reasoning engine — combining image reasoning, NLP, and structured output generation. |
| **Firebase Cloud Firestore** | Real-time synchronization, essential for live emergency response coordination. |
| **Firebase Realtime Database** | Live data streaming for instant flood zone updates across all users. |
| **Firebase Hosting** | Production deployment at `bilahujan-app.web.app`, globally distributed via Google CDN. |
| **Google Maps Platform** | Transforms data into spatial intelligence, enabling geographic prioritization. |

### 🔧 Other Supporting Tools

| Tool | Purpose |
|---|---|
| **React & TypeScript** | Component-based web application framework with type-safe, scalable development. |
| **Vite** | Lightning-fast build tool and development server with hot module replacement. |
| **Tailwind CSS** | Utility-first styling for rapid, consistent UI development. |
| **Git & GitHub** | Transparent development, auditability, and open innovation. |

---

## 5) Implementation Details & Innovation

> 💡 **Core Innovation Philosophy:**
> BILAHUJAN does not digitize existing systems — it **restructures the information pipeline.**
>
> Traditional systems collect bad data and try to fix it later.
> BILAHUJAN **prevents bad data from entering the system.**
>
> This is **preventive intelligence architecture**, not reactive processing.

### 🏗️ System Architecture Flow
```
Data Capture → AI Verification → Cloud Sync → Synthesis → Deployment
```

| Stage | Description |
|---|---|
| **Data Capture** | Structured UI ensures consistent input format across all report types. |
| **AI Verification** | Gemini Vision analyzes images for water depth, flow speed, and hazard classification. |
| **Cloud Sync** | Validated reports pushed to Firebase Realtime Database for live coordination. |
| **Synthesis** | Multi-modal reasoning aligns visual + textual data into a unified risk score. |
| **Deployment** | Only validated intelligence enters the government dashboard. |

---

## 6) Challenges Faced

| Challenge | Solution |
|---|---|
| **Real-time Data Sync** | Integrated Firebase Realtime Database to ensure all flood zone updates propagate instantly to all users. |
| **AI Output Formatting** | Strict prompt engineering enforced deterministic structured outputs, essential for real-time systems. |
| **Geospatial Visualization** | Utilized Google Maps Platform with custom polygon overlays to display flood risk zones spatially. |

---

## 7) Installation & Setup
**Prerequisites:**
- Node.js v18+
- Firebase CLI: `npm install -g firebase-tools`
- A `.env` file in the project root with the following keys:
```env
GEMINI_API_KEY=your_gemini_api_key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

```bash
# Clone the repository
git clone https://github.com/howardwoonhz06/bilahujan.git

# Navigate to project directory
cd bilahujan

# Install dependencies
npm install

# Start local development server (auto-updates instantly at localhost:3000)
npm run dev

# Deploy to Firebase manually
npm run build && firebase deploy

# OR — auto-build and deploy to Firebase on every file save
npm run deploy:watch
```

**Live Site:** https://bilahujan-app.web.app

---

## 8) Future Roadmap

| Phase | Feature | Technology | Goal |
|---|---|---|---|
| **Phase 1** | Native Mobile App | React Native / PWA | Bring BILAHUJAN to Android & iOS for wider disaster-zone reach without browser dependency. |
| **Phase 2** | 🔥 On-Device AI (Offline Mode) | **TensorFlow Lite** | Run compressed flood detection models directly on-device — app works with **zero internet**. Detects *"Flood Water"* and *"Road Blocked"* from photos even during full infrastructure blackout. |
| **Phase 3** | AI Sensor Fusion | Phone Sensors + Gemini | Fuse accelerometer, barometer, and microphone data with AI to detect floods **before the user even opens the app**. |
| **Phase 4** | Authority Command Dashboard | Firebase + Predictive Models | Complete the ecosystem loop: Citizen → AI → Government → Action. Real-time command view for NADMA, JPS, and APM. |

> 💪 **Why TensorFlow Lite is a game-changer (Phase 2):**
> During the worst floods, cell towers go down. Standard apps become useless. TensorFlow Lite allows BILAHUJAN to run AI **entirely offline**, making it functional exactly when it is needed most — turning a web app into true disaster-resilient infrastructure.

---

## 9) Hackathon Context & Acknowledgements

### 🏆 Hackathon Context
This project was built in an intense, time-limited environment for **KitaHack 2026**. All features, design, and code were developed with a focus on rapid prototyping, real-world deployability, and maximum impact for disaster resilience in Malaysia. The constraints of the hackathon inspired creative solutions, fast iteration, and a relentless focus on user needs.

- **Rapid Prototyping:** Features were prioritized for maximum value and feasibility within the hackathon window.
- **Teamwork & Learning:** The project reflects a blend of technical skill, civic responsibility, and continuous learning under pressure.
- **Open Source Spirit:** All code is open for review, reuse, and improvement by the community.

### 🙏 Acknowledgements
- **KitaHack 2026 Organizers** for the opportunity and platform.
- **Mentors, judges, and fellow participants** for feedback and inspiration.
- **Open source contributors** whose libraries and tools made rapid development possible.
- **Malaysian emergency responders and civic tech community** for their real-world insights and motivation.

> This project is dedicated to everyone working to make Malaysia safer, smarter, and more resilient in the face of climate change.