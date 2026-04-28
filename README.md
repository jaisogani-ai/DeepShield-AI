<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/shield-alert.svg" width="80" alt="Shield Icon" />
  
  <h1>🛡️ DeepShield AI</h1>
  <p><strong>A Comprehensive Threat Intelligence & AI Deception Detection Dashboard</strong></p>

  <p>
    <a href="#about-the-project">About</a> •
    <a href="#core-features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#project-structure">Architecture</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#security--privacy">Security & Privacy</a> •
    <a href="#contributing">Contributing</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-18.0-blue?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  </p>
</div>

---

## 🔎 About The Project

**DeepShield AI** is an advanced, real-time cyber threat intelligence platform engineered to protect users and organizations against next-generation threats. As AI-generated deception (deepfakes, synthetic voice clones) and complex social engineering attacks become more prevalent, DeepShield AI acts as a vital frontline defense.

Powered by Google's Gemini AI, the platform performs deep semantic and structural analysis to detect synthetic media, forged documents, and sophisticated scams before they cause financial or reputational harm.

---

## ✨ Core Features Explained

### 🎥 Media Scan & Deepfake Analysis
* **Pixel Artifact Detection**: Analyzes media files for synthetic blending, irregular border artifacts, and illogical light sources common in AI-generated imagery.
* **Audio Waveform Analysis**: Detects synthetic voice clones and TTS (Text-To-Speech) voice-overs in video media.
* **Confidence Scoring**: Returns a percentage-based confidence interval with localized visual feedback on where the manipulation exists.

### 📄 Document Verification (Anti-Forgery)
* **Digital Tamper Detection**: Analyzes uploaded PDFs and images for fraudulent alterations (e.g., manipulated bank statements, fake ID cards).
* **Metadata Integrity**: Flags inconsistent file creation dates, missing metadata layers, and forged signatures.
* **OCR + NLP Evaluation**: Extracts document text and uses LLMs to look for institutional formatting inconsistencies and typographic errors common in fakes.

### 💬 Social Engineering & Scam Detection
* **Linguistic Urgency Analysis**: Evaluates raw text, emails, and SMS messages for coercive language, artificial time constraints, and manipulation tactics.
* **Impersonation Recognition**: Detects attempts to impersonate authority figures, family members, or standard institutional organizations (e.g., banks, government agencies).
* **Bilingual Support (🇬🇧/🇮🇳)**: First-class pattern matching in both English and Hindi.

### 🔗 Zero-Day URL Scanning
* **Payload Inference**: Analyzes the structural path, query parameters, and obfuscated string patterns to detect zero-day phishing architecture.
* **Typo-Squatting Detection**: Flags domains trying to imitate high-trust institutions (`g00gle.com`, `paypal-security-update.net`).

### 📊 Threat Operations Dashboard
* **Real-Time Topological Mapping**: Uses D3.js and TopoJSON to render an interactive map of India, visualizing localized cyber threats as they emerge globally.
* **Live Ticker & Counters**: Animated metric tracking reflecting real-time attack vectors and blocked threats.

---

## 🛠️ Tech Stack & Architecture

| Category | Technologies Used |
|----------|-------------------|
| **Frontend Framework** | React 18, TypeScript, Vite |
| **UI & Styling** | Tailwind CSS, Framer Motion, Radix UI Concepts |
| **Data Visualization** | D3.js, React Simple Maps, TopoJSON |
| **Icons & Assets** | Lucide React |
| **Artificial Intelligence** | Google Gemini API (`@google/genai`) |
| **Backend & Auth** | Firebase Authentication (Google OAuth) |
| **Database** | Cloud Firestore (Enterprise Edition) |

---

## 📂 Project Structure

```text
DeepShieldAI/
├── public/                 # Static assets
│   └── india-topo.json     # TopoJSON raw data for Threat Map
├── src/                    # Source code
│   ├── App.tsx             # Main Application Logic & UI Components
│   ├── firebase.ts         # Firebase App, Auth, and Firestore config
│   ├── index.css           # Global Styles & Tailwind Directives
│   ├── main.tsx            # Application Entry Point
│   └── vite-env.d.ts       # TypeScript declarations
├── firestore.rules         # Security framework for Firebase Database
├── firebase-blueprint.json # NoSQL schema definitions
├── package.json            # Dependencies & Scripts
└── .env.example            # Environment Variable templates
```

---

## 🚀 Getting Started

Follow these steps to set up DeepShield AI locally.

### 1. Prerequisites
Ensure you have the following installed on your target machine:
* [Node.js](https://nodejs.org/) (v16.14.0 or higher)
* `npm` or `yarn`

### 2. Installation Setup

Clone the repository to your local machine:
```bash
git clone https://github.com/yourusername/DeepShieldAI.git
cd DeepShieldAI
```

Install the dependencies:
```bash
npm install
```

### 3. Environment Configuration

DeepShield AI requires API keys for its AI capabilities.

Copy the example environment file:
```bash
cp .env.example .env
```

Open the `.env` file and populate your Google Gemini API Key:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

*(Note: Never commit your `.env` file to version control. It is already added to `.gitignore`.)*

### 4. Firebase Database Initialization

DeepShield AI supports persistent scan history securely attached to specific user accounts.
The repository contains `firebase-applet-config.json` and `src/firebase.ts`. 

Ensure your Firebase project supports:
* **Google Authentication** (Sign-in provider)
* **Firestore Database** (With appropriate rules matching `firestore.rules`)

### 5. Running the Application

Run the development server natively:
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your web browser.

To build the application for production:
```bash
npm run build
```

---

## 🔒 Security & Privacy

Protecting user telemetry and sensitive payloads is our highest priority:

* **No Permanent Storage of Sensitive Media**: Uploaded media and documents remain strictly memory-bound during analysis and are discarded immediately. They are **not** persisted to Firestore.
* **RBAC & Zero Trust Data Isolation**: All historical scan results stored in Cloud Firestore are guarded by strict Server-Side Security Rules (`firestore.rules`). Users can exclusively read/write their own records, verified via Firebase Auth claims.
* **Anonymity Support**: Users can safely leverage AI threat classification anonymously without securely linking payloads to personal profiles.

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p><strong>Driven by AI. Built with ❤️ by Team Neuro Galaxy.</strong></p>
</div>
