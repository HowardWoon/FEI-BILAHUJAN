# 🌧️ BILAHUJAN
### AI-Powered Hyper-Local Flood Triage & Community Resilience Platform


---

## 1) Repository Overview & Team Introduction

BILAHUJAN is an intelligent disaster response mobile application built for **KitaHack 2026**, designed to operate at the critical intersection between civilians, AI, and emergency services. The platform directly addresses the weakest link in disaster response systems: **unstructured human reporting under panic conditions.**

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
> *Powered by TensorFlow Lite*

Disaster apps have a fatal flaw: they fail when the internet cuts out. BILAHUJAN includes an **Offline Survival Mode** using compressed AI models that live directly on the device.

- **Capability:** Detects *"Flood Water"* or *"Road Blocked"* in photos without Wi-Fi or data.
- **Impact:** Ensures victims can still capture and queue verified reports even during **total infrastructure blackout.**

---

### 🗺️ Predictive Flood Pathing (Scientific Defense)
> *Powered by Google Earth Engine*

Moves the platform from *"Social Media for Floods"* to **"Scientific Defense."** By analyzing topography and elevation data, the system logic works like this:

> *"If Report A is at High Ground, and gravity flows to Point B (Low Ground), warn Point B before the water arrives."*

This turns **reactive reporting into proactive warning.**

---

## 4) Overview of Technologies Used

### 🟦 Google Technologies

| Technology | Role |
|---|---|
| **Flutter & Dart** | Single-codebase production-grade system, reducing deployment friction for government scaling. |
| **Gemini 1.5 Flash / Vision** | Multi-modal reasoning engine — combining image reasoning, NLP, and structured output generation. |
| **TensorFlow Lite** | The *"Offline Superpower"* — runs compressed AI models locally on device, enabling detection during internet blackouts. |
| **Google Earth Engine** | The *"Scientific Flex"* — analyzes planetary-scale topography to predict flood flow direction based on elevation data. |
| **Firebase Cloud Firestore** | Real-time synchronization, essential for live emergency response coordination. |
| **Google Maps Platform** | Transforms data into spatial intelligence, enabling geographic prioritization. |

### 🔧 Other Supporting Tools

| Tool | Purpose |
|---|---|
| **image_picker** | Native-level hardware access for low-latency data capture. |
| **Git & GitHub** | Transparent development, auditability, and open innovation. |
| **Android Studio** | Native performance testing and deployment simulation. |

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
Data Capture → Edge AI Check → Cloud AI Verification → Synthesis → Deployment
```

| Stage | Description |
|---|---|
| **Data Capture** | Structured UI ensures consistent input format. |
| **Edge AI Check** | Offline verification using TensorFlow Lite. |
| **Cloud AI Verification** | Online deep analysis using Gemini. |
| **Synthesis** | Multi-modal reasoning aligns visual + textual data. |
| **Deployment** | Only validated intelligence enters the government dashboard. |

---

## 6) Challenges Faced

| Challenge | Solution |
|---|---|
| **Offline Reliability** | Integrated TensorFlow Lite to ensure the app remains functional even when cell towers are down. |
| **AI Output Formatting** | Strict prompt engineering enforced deterministic structured outputs, essential for real-time systems. |
| **Geospatial Prediction** | Utilized Google Earth Engine logic to move beyond simple point-reporting to predictive flow analysis. |

---

## 7) Installation & Setup
```bash
# Clone the repository
git clone https://github.com/your-username/bilahujan.git

# Navigate to project directory
cd bilahujan

# Install dependencies
flutter pub get

# Run the application
flutter run
```

> ⚠️ Ensure you have **Flutter SDK**, **Android Studio**, and valid **Firebase & Google Maps API keys** configured before running.

---

## 8) Future Roadmap

| Phase | Feature | Focus | Goal |
|---|---|---|---|
| **Phase 1** | Telemetry Integration | AI + Sensor Fusion | Improve model confidence and accuracy by using phone sensors. |
| **Phase 2** | Offline Survival Mode | Disaster-Resilient Infrastructure | Transform the app into infrastructure that works without internet. |
| **Phase 3** | Authority Dashboard | Predictive Flow Models | Complete the ecosystem loop: Citizen → AI → Government → Action. |

---

<div align="center">
  Built with ❤️ for KitaHack 2026 · Powered by Google AI · Made in Malaysia 🇲🇾
</div>
