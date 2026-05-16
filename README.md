> **📦 Project Recently Organized** - The codebase has been restructured for better maintainability. See [PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for details.

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
- Drag-and-drop CSV file upload with validation
- Automatic delimiter detection (comma, tab, pipe, semicolon)
- Real-time parsing with progress tracking
- Support for UTF-8 BOM and various encodings
- Handles up to 10MB files with 100k+ rows

### 🤖 AI-Powered Analytics Engine
- **Comprehensive Metrics**: 15+ gameplay metrics computed automatically
- **Behavioral Patterns**: Identifies Combat-Focused, Explorer, Collector segments
- **Anomaly Detection**: Automatic detection of unusual patterns and issues
- **Friction Analysis**: Computes 0-100 friction score with weighted factors
- **Mock AI Insights**: Structured recommendations (ready for IBM Granite integration)

### 📈 Interactive Insights Dashboard
- **6 Insight Categories**: Risks, Friction, Monetization, LiveOps, Players, Overview
- **Visual Analytics**: 5+ interactive charts using Recharts
- **Severity Badges**: High/Medium/Low priority indicators
- **Actionable Recommendations**: Specific steps for each insight
- **Player Segmentation**: Detailed behavioral analysis by segment

### 🎨 Production-Ready UI
- Dark mode optimized for long sessions
- Fully responsive design for all devices
- Clean, modular component architecture
- Accessible shadcn/ui components
- Professional insight cards with categorization

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS v4, shadcn/ui |
| **AI/ML** | IBM Granite (ready), Mock AI Layer |
| **Data Processing** | PapaParse, Custom Analytics Engine |
| **Visualization** | Recharts, Interactive Charts |
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

### Using the Analytics Engine

1. Navigate to `/upload` page
2. Upload a CSV file with gameplay telemetry
3. Click "Generate AI Insights" button
4. Explore insights across 6 categories:
   - **Overview**: Charts and visual analytics
   - **Risks**: Retention risks and churn indicators
   - **Friction**: UX issues and pain points
   - **Revenue**: Monetization opportunities
   - **LiveOps**: Event and content recommendations
   - **Players**: Behavioral segment analysis

For detailed documentation, see [ANALYTICS_ENGINE.md](docs/ANALYTICS_ENGINE.md)

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

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details.

---

## 📄 License

MIT License - see [LICENSE](docs/LICENSE.md) for details.

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

---

## 📁 Project Structure

For a detailed overview of the project structure and organization, see [PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md).

Key directories:
- `/app` - Next.js pages and layouts
- `/components` - React components
- `/lib` - Core business logic and utilities
- `/lib/ai` - New modular AI system (production-ready)
- `/lib/legacy` - Legacy AI implementation (reference)
- `/types` - Shared TypeScript types
- `/docs` - Project documentation

**Built for IBM Bob Hackathon 2026**
