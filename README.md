# 🌧️ FEI-BILAHUJAN
### *Hyper-Local Flood Prediction & Community Survival Platform*

[![Built with](https://img.shields.io/badge/Built_with-Flutter-blue?style=flat-square&logo=flutter)](https://flutter.dev)
[![AI Power](https://img.shields.io/badge/AI-Gemini_1.5-yw?style=flat-square&logo=google-gemini)](https://deepmind.google/technologies/gemini/)
[![Data Source](https://img.shields.io/badge/Data-Kaggle_Trained-20BEFF?style=flat-square&logo=kaggle)](https://kaggle.com)
[![Status](https://img.shields.io/badge/Hackathon-KitaHack_2026-orange?style=flat-square)](https://devpost.com)

---

## 1) Repository Overview & Team Introduction

**BILAHUJAN** is an AI-powered disaster resilience platform that predicts major flood events by fusing meteorological data with ground-level evidence. Unlike traditional systems that rely on single data points, we aggregate intelligence from three distinct sources to calculate a comprehensive "Flood Risk Score."

### Meet Team [FILL IN: Your Team Name]
* **[FILL IN: Your Name]**: [FILL IN: Your Role, e.g., Backend Developer / AI Integrator]
* **[FILL IN: Friend's Name]**: [FILL IN: Friend's Role, e.g., Frontend Developer / UI Designer]
* *[Add more team members if needed]*

---

## 2) Project Overview

### Problem Statement
[FILL IN: Describe the problem. Example: Flash floods in Malaysia (like in Selangor) often happen too quickly for traditional warning systems. Citizens lack real-time, verified hyper-local data to know when to evacuate and where to find safe refuge.]

### SDG Alignment
[FILL IN: Which UN Sustainable Development Goals are you targeting? Example: 
* **SDG 11:** Sustainable Cities and Communities
* **SDG 13:** Climate Action]

### Short Description of the Solution
[FILL IN: A 2-3 sentence summary. Example: BILAHUJAN bridges the gap between weather forecasts and ground-level survival. It uses AI to verify flood photos and cross-references them with official JPS river data to send immediate, verified evacuation alerts to the community.]

---

## 3) Key Features

* **FloodVision AI:** Verifies crowdsourced user photos to confirm flood depth and severity using Gemini 1.5.
* **RainPredict Engine:** Fuses data from Google Flood APIs and JPS Selangor to predict imminent risks.
* **Automated Mass Alerts:** Instantly notifies users in affected zones when the Risk Score exceeds the safety threshold.
* **[FILL IN: Add 1-2 more features, e.g., Offline Survival Mode, Safe Route Finder]**

---

## 4) Overview of Technologies Used

### Google Technologies
* **Google AI Studio / Gemini 1.5 Flash:** Powers the core visual analysis engine to process user-uploaded images and extract structured JSON risk data.
* **Google Flood Forecasting API:** Provides predictive weather modeling and riverine flood warnings.
* **[FILL IN: e.g., Firebase]**: For real-time database management and user authentication.
* **[FILL IN: e.g., Flutter]**: Cross-platform framework for building the mobile interface.

### Other Supporting Tools / Libraries
* **Stitch:** Utilized for rapid UI/UX design and prototyping.
* **Info Banjir (JPS Selangor):** Official API for real-time water level data from government telemetry stations.
* **Kaggle:** Source of historical flood datasets used to train our initial Machine Learning models.

---

## 5) Implementation Details & Innovation

> 🧠 **Core Intelligence:** Our decision engine utilizes logic derived from historical flood datasets (via Kaggle). It recognizes complex flood patterns that simple rule-based systems miss.

### System Architecture

```mermaid
graph TD
    subgraph INPUTS [Real-Time Data Sources]
        direction TB
        A[☁️ Google Flood API] -->|Forecast Data| D{AI Decision Engine}
        B[🌊 JPS Selangor] -->|Sensor Levels| D
        C[📸 User Uploads] -->|Gemini Vision Analysis| D
    end

    subgraph LEARNING [Historical Context]
        K[📚 Kaggle Flood Dataset] -.->|Training Weights| D
    end

    D -->|Calculate Risk Score| E[⚡ Risk Assessment]
    E -->|Score > 85%| F[🚨 TRIGGER MASS ALERT]
    E -->|Score < 85%| G[✅ Update Safety Map]

    style F fill:#ff0000,stroke:#333,stroke-width:2px,color:#fff
    style D fill:#4285F4,stroke:#333,stroke-width:2px,color:#fff
