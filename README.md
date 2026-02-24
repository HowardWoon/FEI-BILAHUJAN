# 🌧️ BILAHUJAN
### AI-Powered Hyper-Local Flood Triage & Community Resilience Platform

---

## 1) Repository Overview & Team Introduction

BILAHUJAN is an intelligent disaster response mobile application built for **KitaHack 2026**, designed to operate at the critical intersection between civilians, AI, and emergency services. The platform directly addresses the weakest link in disaster response systems: **unstructured human reporting under panic conditions.**

Rather than acting as a passive reporting tool, BILAHUJAN functions as an **AI-mediated verification layer** that transforms chaotic, emotionally-driven inputs into structured, reliable, and actionable intelligence. This ensures that emergency responders receive **objective situational awareness**, not subjective perception.

By embedding intelligence at the edge (user device + AI interception layer), the system prevents misinformation, severity misclassification, and data noise before it contaminates emergency databases.

### 👤 Meet the Developer

**HOWARD WOON HAO ZHE** — Lead Software Engineer & AI Integrator

First-year Computer Science (Software Engineering) student at the University of Malaya, combining financial analytics discipline with systems engineering thinking. Focused on building scalable, real-world deployable architectures rather than demo-only prototypes. Core interests include AI systems design, distributed architectures, and civic-tech innovation.

> This project is designed not as a hackathon demo, but as a **deployable civic infrastructure prototype.**

---

## 2) Project Overview

### 🔴 Problem Statement

During rapid-onset flash floods in Malaysia (especially in dense urban regions like Selangor), emergency response systems suffer from three structural failures:

| Failure | Description |
|---|---|
| **Subjective Severity Reporting** | Civilians misjudge danger levels due to panic, shock, or lack of situational awareness. |
| **Unstructured Information Chaos** | Emergency centers receive text messages, calls, images, and descriptions that are impossible to algorithmically prioritize in real time. |
| **Zero Visual Verification** | Authorities lack standardized visual confirmation of water depth, flow speed, and physical hazards. |

This results in misallocated rescue resources, delayed response times, and inefficient triage prioritization — not because of lack of manpower, but because of **poor data quality.**

---

### 🌍 SDG Alignment

- **SDG 11 – Sustainable Cities and Communities**
  BILAHUJAN strengthens urban resilience by enabling data-driven emergency response, reducing infrastructure strain and preventing avoidable loss of life and property damage.

- **SDG 13 – Climate Action**
  As climate change increases extreme weather frequency, BILAHUJAN provides a scalable adaptation mechanism that helps communities respond intelligently rather than react chaotically.

> This positions BILAHUJAN as not just a flood app, but a **climate resilience infrastructure tool.**

---

### 💡 Short Description of the Solution

BILAHUJAN eliminates panic bias and misinformation at the source.

Instead of trusting user-selected severity levels, the system:

- ✅ Uses **AI vision** to objectively estimate water depth
- ✅ Uses **NLP** to interpret urgency from language
- ✅ **Cross-validates** text + image data
- ✅ **Auto-corrects** severity classification
- ✅ Outputs **standardized, machine-readable intelligence**

> The result: **structured threat intelligence**, not social media-style reporting.

This transforms civilians from unreliable reporters into **distributed sensor nodes** in a verified emergency intelligence network.

---

## 3) Key Features

### 🔭 FloodVision Auto-Verification (Computer Vision)

The AI system performs **contextual visual analysis**, not simple image classification. It detects reference objects (vehicles, doors, walls, human height, staircases) to approximate real-world scale and water depth estimation.

This allows responders to receive **quantified flood metrics** instead of vague descriptions like *"water is high."*

Directly supports operational decisions such as:
- Boat deployment
- High-clearance vehicle dispatch
- Evacuation urgency classification

---

### 🧠 Smart NLP Triage & Correction

Instead of trusting user-selected severity, the AI performs **semantic risk extraction** — keywords, phrasing, urgency indicators, and emotional intensity are analyzed together to infer true threat level.

This creates **automatic severity correction**, preventing:
- Underreporting of life-threatening situations
- Overloading emergency systems with false high-priority alerts

> The system enforces data integrity **before storage**, not after damage is done.

---

### 📋 Government-Ready JSON Formatting

Data is structured into machine-readable emergency schemas, enabling:
- Instant ingestion into dashboards
- Automated prioritization systems
- Heatmap generation
- AI-assisted dispatching
- Cross-agency data sharing

> This makes BILAHUJAN **interoperable, not isolated** — critical for government adoption.

---

### 🗺️ Real-Time Interactive Mapping

The mapping system is not just visualization — it enables:
- Flood clustering detection
- High-risk zone identification
- Resource optimization
- Predictive escalation modeling

> This turns raw reports into **strategic operational intelligence.**

---

## 4) Overview of Technologies Used

### 🟦 Google Technologies

| Technology | Role |
|---|---|
| **Flutter & Dart** | Single-codebase production-grade system, reducing deployment friction for government scaling. |
| **Gemini 1.5 Flash / Vision** | Multi-modal reasoning engine — combining image reasoning, NLP, and structured output generation. |
| **Firebase Cloud Firestore** | Real-time synchronization, essential for live emergency response coordination. |
| **Google Maps Platform** | Transforms data into spatial intelligence, enabling geographic prioritization. |

### 🔧 Other Supporting Tools & Libraries

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

### 🏗️ System Architecture
```
Data Capture → AI Interception → Synthesis → Formatting → Deployment
```

| Stage | Description |
|---|---|
| **Data Capture** | Structured UI ensures consistent input format. |
| **AI Interception** | All reports are intercepted before database entry. |
| **Synthesis** | Multi-modal reasoning aligns visual + textual data. |
| **Formatting** | Standardized schema enforces consistency. |
| **Deployment** | Only validated intelligence enters the system. |

> This creates a **trust pipeline**, not just a data pipeline.

---

## 6) Challenges Faced

| Challenge | Solution |
|---|---|
| **AI Output Formatting** | Strict prompt engineering enforced deterministic structured outputs, essential for real-time systems. |
| **Asynchronous State Management** | Ensured smooth UX despite heavy AI computation, maintaining user trust and usability. |
| **Environment Constraints** | Demonstrates real engineering problem-solving beyond surface-level prototyping. |

> This proves **technical depth**, not just concept strength.

---

## 7) Installation & Setup

> ⚙️ *Setup instructions are structured as a reproducible deployment pipeline for scalability and judging transparency.*

This allows judges to verify:
- Reproducibility
- Stability
- Deployment readiness
- Technical maturity
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

> ⚠️ Ensure you have **Flutter SDK**, **Android Studio**, and a valid **Firebase & Google Maps API key** configured before running.

---

## 8) Future Roadmap
```
Phase 1 ──────────────── Phase 2 ──────────────── Phase 3
Telemetry Integration    Offline Survival Mode    Authority Dashboard
AI + Sensor Fusion       Disaster-Resilient       Citizen → AI →
                         Infrastructure           Government → Action
```

| Phase | Feature | Impact |
|---|---|---|
| **Phase 1** | Telemetry Integration | AI + sensor fusion, improving model confidence and accuracy. |
| **Phase 2** | Offline Survival Mode | Transforms app into disaster-resilient infrastructure, not cloud-dependent software. |
| **Phase 3** | Authority Dashboard | Completes the ecosystem from citizen → AI → government → action. |

> This forms a **full-stack civic intelligence platform.**

---

<div align="center">
  Built with ❤️ for KitaHack 2026 · Powered by Google AI · Made in Malaysia 🇲🇾
</div>
