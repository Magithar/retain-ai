# 🎮 Retain AI

**AI-powered copilot for live game operations**

Transform gameplay telemetry into actionable retention, monetization, and LiveOps insights using IBM Granite + AI workflows.

[![Built with Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![IBM Granite](https://img.shields.io/badge/IBM-Granite-0f62fe?style=flat&logo=ibm)](https://www.ibm.com/granite)

---

## 🎯 The Problem

Game studios struggle to:
- **Identify churn signals** before players leave
- **Optimize monetization** without hurting retention
- **Plan LiveOps events** based on player behavior patterns
- **Make data-driven decisions** from massive telemetry datasets

Traditional analytics tools show *what happened*. Retain AI tells you *what to do next*.

---

## 💡 Our Solution

Retain AI is an **AI-first analytics platform** that:

✅ **Ingests gameplay telemetry** (CSV, JSON, real-time streams)  
✅ **Analyzes player behavior** using IBM Granite AI models  
✅ **Generates actionable insights** for retention & monetization  
✅ **Recommends LiveOps strategies** based on cohort analysis  
✅ **Predicts churn risk** with ML-powered early warning system  

---

## 🚀 Key Features

### 📊 Smart Telemetry Upload
- Drag-and-drop CSV/JSON file upload
- Automatic schema detection
- Real-time parsing with progress tracking
- Support for custom delimiters and formats

### 🤖 AI-Powered Analysis
- **IBM Granite integration** for natural language insights
- Automated cohort segmentation
- Churn prediction models
- Revenue optimization recommendations

### 📈 Interactive Dashboards
- Real-time KPI tracking
- Player retention funnels
- Monetization analytics
- LiveOps event performance

### 🎨 Modern UX
- Dark mode optimized for long sessions
- Responsive design for all devices
- Fast, server-side rendered pages
- Accessible UI components

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS v4, shadcn/ui |
| **AI/ML** | IBM Granite, Watsonx.ai |
| **Data Processing** | CSV Parser, JSON validation |
| **Deployment** | Vercel, Edge Functions |

---

## 🎬 Quick Start

### Prerequisites
- Node.js 18.17+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/retain-ai.git
cd retain-ai

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

---

## 📸 Screenshots

> **Note:** Add screenshots here once the dashboard is deployed

### Dashboard Overview
![Dashboard](public/dashboard-preview.png)

### Telemetry Upload
![Upload](public/upload-preview.png)

### AI Insights
![Insights](public/insights-preview.png)

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Game Client   │
└────────┬────────┘
         │ Telemetry Events
         ▼
┌─────────────────┐
│  Retain AI API  │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌──────────┐
│ Parser │ │ IBM      │
│ Engine │ │ Granite  │
└────┬───┘ └────┬─────┘
     │          │
     ▼          ▼
┌─────────────────┐
│   Dashboard     │
│   (Next.js)     │
└─────────────────┘
```

---

## 🎯 Use Cases

### 1. **Churn Prevention**
Identify at-risk players 7 days before they leave. Get AI-recommended retention strategies.

### 2. **Monetization Optimization**
Analyze spending patterns and optimize in-game offers for different player segments.

### 3. **LiveOps Planning**
Plan events based on player activity patterns and predicted engagement.

### 4. **A/B Test Analysis**
Compare feature variants and get AI insights on which performs better.

---

## 🔮 Roadmap

- [ ] Real-time telemetry streaming
- [ ] Advanced ML models for churn prediction
- [ ] Multi-game support
- [ ] Custom dashboard builder
- [ ] Slack/Discord integration for alerts
- [ ] API for programmatic access

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgments

Built with:
- [IBM Granite](https://www.ibm.com/granite) - AI foundation models
- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com) - UI components
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

## 📧 Contact

Questions? Reach out at [magithar8@gmail.com](mailto:magithar8@gmail.com)

**Built for IBM Bob Hackathon 2026**
