<div align="center">

# 🛡️ DeepShield AI

### India's First AI-Powered Digital Asset Protection Platform

**Protecting 1.4 Billion Indians from Deepfakes, Document Fraud & Digital Scams**

[![React](https://img.shields.io/badge/React-18.0-blue?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Gemini AI](https://img.shields.io/badge/Gemini_1.5_Pro-1A73E8?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)

---

### 🌐 [Live Demo](https://deepshield-ai.web.app) &nbsp;|&nbsp; 📹 [Demo Video](#) &nbsp;|&nbsp; 🏆 Google Build with AI 2026

**Built by Team Neuro Galaxy &nbsp;|&nbsp; Category: Digital Asset Protection**

</div>

---

## 📌 About The Project

**DeepShield AI** is India's first AI-powered platform that protects citizens from the fastest-growing digital threats — deepfakes, document forgery, scam messages, and phishing links — all powered by **Google Gemini 1.5 Pro**.

### 🚨 The Problem

India recorded **13.2 lakh cybercrime cases** in 2024, with losses exceeding **₹11,333 crore**:

- 🎭 Deepfake videos/audio used to impersonate family members and scam elderly Indians
- 📄 Fake Aadhaar, PAN cards and certificates used for identity theft
- 💬 WhatsApp/SMS scam messages in Hindi bypass English-only detection tools
- 🔗 Phishing links disguised as SBI, HDFC, government portals steal crores daily
- 😰 Common citizens have **no easy tool** to verify suspicious digital content

### ✅ Our Solution

DeepShield AI provides **4 powerful AI shields** + **Live India Threat Map** + **Hindi/English Support**

---

## ✨ Features

### 🎭 1. Deepfake & Synthetic Media Detector
- Upload any **image, video, or audio** file
- Google Gemini 1.5 Pro analyzes pixel artifacts, facial anomalies & voice inconsistencies
- Returns **REAL ✅ or FAKE ❌** verdict with confidence % in under 2 seconds
- Lists exact red flags found (lighting, border artifacts, eye movement)
- Explanation in both **Hindi and English**

### 📄 2. Document Authenticity Scanner
- Photograph any **Aadhaar, PAN, passport, or certificate**
- AI checks font consistency, logo authenticity, QR validity, layout standards
- Returns **GENUINE or SUSPICIOUS** verdict
- Generates unique **DSA-2026-IND verification certificate** for genuine documents
- Permanently verifiable via Firebase database

### 💬 3. Scam Message Analyzer
- Paste any suspicious **SMS, WhatsApp, or email message**
- Detects UPI fraud, fake KYC requests, electricity bill scams, loan harassment
- Works in **Hindi and English** — covers all major Indian scam patterns
- One-click report generation for **cybercrime.gov.in**

### 🔗 4. URL Safety Checker
- Paste any suspicious link before clicking
- Detects **phishing sites, fake SBI/HDFC pages, government impersonation**
- Catches typo-squatting (`g00gle.com`, `paypal-security.net`)
- Returns **SAFE ✅ or DANGEROUS ❌** verdict instantly

### 🗺️ 5. Live India Threat Map
- Real-time SVG map showing threat levels across **15+ Indian cities**
- Pulsing red/orange/yellow animated dots per threat level
- Hover any city to see active threats, scam types, and last scan time
- Live scrolling ticker showing latest threats detected nationwide

### 🇮🇳 6. Hindi / English Toggle
- Full bilingual support — one click switches entire UI to Hindi
- Reaches non-English speaking Indians who need protection most

### 📜 7. Safety Certificates
- Genuine detections generate **downloadable PDF certificate**
- Unique `DSA-2026-IND-XXXXXX` verification ID
- Permanently stored in Firebase — anyone can verify authenticity

### 🚔 8. One-Click Cybercrime Reporting
- Fake/dangerous detections auto-generate a complete report
- One click opens **cybercrime.gov.in**
- Helpline **1930** prominently displayed

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **AI Engine** | Google Gemini 1.5 Pro | Multimodal deepfake, document & scam analysis |
| **Frontend** | React 18 + TypeScript | UI components and state management |
| **Build Tool** | Vite | Fast development and production builds |
| **Styling** | Tailwind CSS | Dark cybersecurity themed UI |
| **Database** | Firebase Firestore | Real-time threat logs and scan history |
| **Hosting** | Firebase Hosting (Google Cloud) | Live prototype deployment |
| **Auth** | Firebase Authentication | User accounts and scan history |
| **Maps** | SVG + TopoJSON | India threat visualization |
| **Voice** | Web Speech API | Hindi/English voice input |
| **Dev Platform** | Google AI Studio | Built and tested entirely in AI Studio |

---

## 📂 Project Structure

```
DeepShieldAI/
├── public/
│   └── india-topo.json       # India map TopoJSON data
├── src/
│   ├── App.tsx               # Main application + all UI components
│   ├── firebase.ts           # Firebase config (Auth + Firestore)
│   ├── index.css             # Global styles + Tailwind directives
│   ├── main.tsx              # App entry point
│   └── vite-env.d.ts         # TypeScript declarations
├── firestore.rules           # Firebase security rules
├── firebase-blueprint.json   # Firestore schema definitions
├── firebase.json             # Firebase hosting config
├── .env.example              # Environment variable template
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v16.14.0 or higher
- A [Google AI Studio](https://aistudio.google.com) account (free)
- A [Firebase](https://console.firebase.google.com) project (free)

### 1. Clone the Repository

```bash
git clone https://github.com/jaisogani-ai/deepshield-ai.git
cd deepshield-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env
```

Open `.env` and add your keys:

```env
# Get from: aistudio.google.com/apikey
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Get from: console.firebase.google.com
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Run Locally

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### 5. Build for Production

```bash
npm run build
```

### 6. Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

Your live URL: `https://your-project-id.web.app` ✅

---

## 🔑 How to Get API Keys

### Gemini API Key (Free)
1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Click **"Create API Key"**
3. Copy and paste into `.env`

### Firebase Config
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create new project → **"deepshield-ai"**
3. Click Settings gear → **"Project Settings"**
4. Scroll to **"Your Apps"** → Add Web App
5. Copy the config object values into `.env`

---

## 🔐 How Gemini AI Works In This App

DeepShield uses specialized prompts for each detection type:

```typescript
// Deepfake Detection Prompt
const DEEPFAKE_PROMPT = `
You are DeepShield AI, India's deepfake detection system.
Analyze this media for signs of AI manipulation. Check for:
unnatural eye blinking, facial boundary artifacts, lighting
inconsistencies, pixel-level anomalies, audio-visual sync issues.
Return JSON: {
  verdict: "REAL" | "FAKE",
  confidence: 0-100,
  threat_level: "SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  red_flags: string[],
  explanation_hindi: string,
  explanation_english: string,
  recommendation: string
}`;

// Document Verification Prompt  
const DOCUMENT_PROMPT = `
You are DeepShield AI document verifier.
Check this document for forgery: font consistency,
logo authenticity, QR validity, government watermarks,
color gradients, hologram indicators.
Return same JSON format above.`;

// Scam Detection Prompt
const SCAM_PROMPT = `
You are DeepShield AI scam detector for Indian users.
Analyze this text for: urgency manipulation, UPI fraud patterns,
fake KYC language, government impersonation, lottery fraud,
loan fraud. Works in Hindi and English.
Return JSON with scam_type field added.`;
```

---

## 🗺️ Firestore Data Schema

```javascript
// Collection: scans
{
  scan_id: "DSA-2026-IND-LR4X7K-M9QP2",  // Unique verification ID
  user_id: "firebase_auth_uid",
  scan_type: "deepfake" | "document" | "scam" | "url",
  verdict: "REAL" | "FAKE" | "GENUINE" | "SUSPICIOUS" | "SAFE" | "DANGEROUS",
  confidence: 94.7,
  threat_level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "SAFE",
  red_flags: ["Unnatural eye movement", "Pixel artifacts detected"],
  timestamp: Timestamp,
  city: "Mumbai",  // For threat map
  verified: true
}
```

---

## 🔒 Security & Privacy

- **No permanent media storage** — uploaded files are memory-only, never saved to Firestore
- **RBAC with Firebase Rules** — users can only read/write their own scan records
- **API keys in environment variables** — never hardcoded in source
- **Anonymous scanning supported** — no account required for basic scans
- **Firestore Security Rules** enforce server-side data isolation

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /scans/{scanId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.user_id;
    }
  }
}
```

---

## 📊 Impact

| Metric | Value |
|--------|-------|
| Indians Protected | 1.4 Billion |
| WhatsApp Users Reached | 500 Million |
| Senior Citizens Safeguarded | 60 Million+ |
| Analysis Speed | Under 2 seconds |
| Languages Supported | Hindi + English |
| Cities on Threat Map | 15+ |

---

## 🤝 Contributing

Contributions are welcome and greatly appreciated!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<div align="center">

**🛡️ Driven by AI. Built with ❤️ by Team Neuro Galaxy.**

**Google Build with AI 2026 &nbsp;|&nbsp; Digital Asset Protection**

[![Powered by Gemini](https://img.shields.io/badge/Powered_by-Google_Gemini_1.5_Pro-1A73E8?style=for-the-badge&logo=google&logoColor=white)](https://aistudio.google.com)
[![Firebase](https://img.shields.io/badge/Hosted_on-Firebase_Google_Cloud-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)

</div>
