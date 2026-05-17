# 🎮 Retain AI

**AI-powered copilot for live game operations**

Transform gameplay telemetry into actionable retention, monetization, and LiveOps insights using intelligent analytics and IBM Granite-ready AI workflows.

[![Built with Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![IBM Granite](https://img.shields.io/badge/IBM-Granite_Ready-0f62fe?style=flat&logo=ibm)](https://www.ibm.com/granite)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)

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

### 📊 Intelligent Telemetry Analysis
- **Smart Dataset Detection**: Automatically identifies 8 telemetry categories (combat, pickup, movement, session, monetization, achievement, progression, liveops)
- **Capability-Aware Analytics**: Only computes metrics when relevant data is available
- **Drag-and-Drop Upload**: CSV file upload with automatic delimiter detection
- **Real-time Parsing**: Progress tracking with support for 100k+ rows
- **Data Quality Assessment**: Transparent reporting of dataset completeness

### 🤖 AI-Powered Analytics Engine
- **Comprehensive Metrics**: 20+ gameplay metrics computed conditionally
- **Behavioral Segmentation**: Identifies Combat-Focused, Explorer, Collector, and Casual player types
- **Anomaly Detection**: Automatic detection of unusual patterns and issues
- **Friction Analysis**: 0-100 friction score with weighted factors
- **Heuristic Intelligence**: PM-grade insights without requiring LLM calls
- **IBM Granite Ready**: Modular AI orchestrator prepared for LLM integration

### 📈 Interactive Insights Dashboard
- **6 Insight Categories**: Overview, Risks, Friction, Revenue, LiveOps, Players
- **Visual Analytics**: 8+ interactive charts using Recharts
- **LiveOps Recommendations**: AI-generated event suggestions with timing and targeting
- **Severity Indicators**: High/Medium/Low priority badges
- **Actionable Recommendations**: Specific, implementable steps for each insight
- **Dataset Capability Panel**: Clear visibility into available analytics

### 🎨 Production-Ready UI
- **Dark Mode First**: Optimized for long analytics sessions
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile
- **shadcn/ui Components**: Accessible, customizable UI primitives
- **Framer Motion**: Smooth animations and transitions
- **Professional Design**: Clean, modern interface with excellent UX

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | Next.js 16, React 19, TypeScript 5 |
| **Styling** | Tailwind CSS v4, shadcn/ui, Framer Motion |
| **AI/ML** | IBM Granite (ready), Heuristic Intelligence, Modular AI Orchestrator |
| **Data Processing** | PapaParse, Custom Analytics Engine, Telemetry Capability Detection |
| **Visualization** | Recharts, Interactive Charts |
| **UI Components** | Radix UI, Lucide Icons |
| **Deployment** | Vercel-ready, Edge Functions |

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

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│           CSV Telemetry Upload           │
│   (drag-and-drop, PapaParse, 100k+ rows) │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│         Telemetry Capability Detection   │
│   lib/telemetry/datasetAnalyzer.ts      │
│   (8 categories, smart field mapping)   │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│           Analytics Engine               │
│         lib/analytics.ts                │
│   (20+ nullable metrics, anomaly detect) │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│         AI Orchestrator                  │
│       lib/ai/orchestrator.ts            │
│  Retention │ Friction │ Monetization    │
│  LiveOps   │ Segmentation Builders      │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│         Insights Dashboard               │
│   components/insights/                  │
│   6 tabs • 8+ charts • LiveOps events   │
└─────────────────────────────────────────┘
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

### Phase 1: Core Enhancement (Complete)
- [x] Telemetry capability detection system
- [x] Heuristic-based intelligence layer
- [x] LiveOps recommendation engine
- [x] Achievement analytics system
- [x] Dataset quality assessment
- [x] TypeScript error resolution (zero errors)

### Phase 2: AI Integration
- [ ] IBM Granite LLM integration
- [ ] watsonx.ai provider implementation
- [ ] HuggingFace provider support
- [ ] Ollama local deployment option
- [ ] Advanced prompt engineering

### Phase 3: Advanced Features
- [ ] Real-time telemetry streaming
- [ ] Predictive churn modeling
- [ ] Multi-game portfolio support
- [ ] Custom dashboard builder
- [ ] A/B test analysis automation

### Phase 4: Enterprise
- [ ] Slack/Discord integration for alerts
- [ ] REST API for programmatic access
- [ ] Webhook support for real-time events
- [ ] Role-based access control
- [ ] White-label deployment options

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
- `/app` - Next.js 16 app directory (pages, layouts, routes)
- `/components` - React components (UI primitives & insights)
- `/lib` - Core business logic and utilities
  - `/lib/ai` - Modular AI system with orchestrator (IBM Granite ready)
  - `/lib/telemetry` - Dataset analyzer and capability detection
  - `/lib/legacy` - Legacy AI implementation (reference)
- `/types` - Shared TypeScript type definitions
- `/docs` - Comprehensive project documentation
- `/public` - Static assets

## 📚 Documentation

Complete documentation is available in the `/docs` directory:

- **[Documentation Index](docs/README.md)** - Start here for navigation
- **[Project Structure](docs/PROJECT_STRUCTURE.md)** - Codebase organization
- **[Implementation Status](docs/IMPLEMENTATION_STATUS.md)** - Current progress
- **[Analytics Engine](docs/ANALYTICS_ENGINE.md)** - Analytics system details
- **[IBM Granite Integration](docs/granite/README.md)** - AI integration guides

**Built for IBM Bob Hackathon 2026** 🚀
