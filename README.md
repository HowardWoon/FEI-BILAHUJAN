# 🌧️ FEI-BILAHUJAN
### *Hyper-Local Flood Prediction & Community Survival Platform*

[![Built with](https://img.shields.io/badge/Built_with-Flutter-blue?style=flat-square&logo=flutter)](https://flutter.dev)
[![AI Power](https://img.shields.io/badge/AI-Gemini_1.5-yw?style=flat-square&logo=google-gemini)](https://deepmind.google/technologies/gemini/)
[![Data Source](https://img.shields.io/badge/Data-Kaggle_Trained-20BEFF?style=flat-square&logo=kaggle)](https://kaggle.com)
[![Status](https://img.shields.io/badge/Hackathon-KitaHack_2026-orange?style=flat-square)](https://devpost.com)

---

**BILAHUJAN** is an AI-powered disaster resilience platform that predicts major flood events by fusing meteorological data with ground-level evidence. Unlike traditional systems that rely on single data points, we aggregate intelligence from **three distinct sources** to calculate a comprehensive "Flood Risk Score."

## 🚀 How It Works: The Data Fusion Engine

> 🧠 **Core Intelligence:** Our decision engine is built on a custom **Machine Learning model trained on historical flood datasets from Kaggle**. It recognizes complex flood patterns that simple rule-based systems miss.

### 📊 System Architecture (Live Data Flow)
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
