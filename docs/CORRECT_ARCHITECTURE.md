# Retain AI - Actual System Architecture

## Correct Architecture Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        Game Client                          │
│                    (Telemetry Source)                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ CSV Export / Telemetry Data
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js Frontend                          │
│                  (Upload Interface)                         │
│                   /app/upload/page.tsx                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ File Upload
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  CSV Parser (PapaParse)                     │
│              Client-Side Data Processing                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Parsed TelemetryRow[]
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Dataset Analyzer (Capability Detection)        │
│              /lib/telemetry/datasetAnalyzer.ts              │
│                                                             │
│  • Detects available telemetry categories                  │
│  • Combat, Monetization, Session, Achievement, etc.        │
│  • Returns TelemetryCapabilities object                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ TelemetryCapabilities
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Analytics Engine (Metrics Computation)         │
│                  /lib/analytics.ts                          │
│                                                             │
│  • Validates telemetry availability                        │
│  • Computes metrics conditionally                          │
│  • Returns AnalyticsSummary with capabilities              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ AnalyticsSummary + Capabilities
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              AI Orchestrator (Prompt Generation)            │
│                /lib/ai/orchestrator.ts                      │
│                                                             │
│  • Filters builders by telemetry capabilities              │
│  • Coordinates multiple prompt builders                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Filtered Builders
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Prompt Builders (Modular)                  │
│                    /lib/ai/builders/                        │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │  Retention   │  │ Monetization │  │   LiveOps    │    │
│  │   Builder    │  │   Builder    │  │   Builder    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐                       │
│  │   Friction   │  │ Segmentation │                       │
│  │   Builder    │  │   Builder    │                       │
│  └──────────────┘  └──────────────┘                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Validates telemetry requirements
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              PM Heuristics Intelligence Layer               │
│            /lib/ai/intelligence/pmHeuristics.ts             │
│                                                             │
│  • 25+ curated PM best practices                           │
│  • Heuristic matching & relevance scoring                  │
│  • Priority-based selection                                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Matched Heuristics
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Prompt Composer Utilities                  │
│                  /lib/ai/utils/promptComposer.ts            │
│                                                             │
│  • Formats analytics context                               │
│  • Creates system context                                  │
│  • Composes structured prompts                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Structured Prompts
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Mock AI Layer (Current Implementation)         │
│                  /lib/legacy/mockAI.ts                      │
│                                                             │
│  • Generates structured insights                           │
│  • Simulates AI responses                                  │
│  • Ready for IBM Granite integration                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ AI Insights
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Insights Dashboard (UI)                    │
│            /components/insights/InsightsDashboard.tsx       │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Dataset Capability Panel                     │  │
│  │  • Shows available/unavailable telemetry             │  │
│  │  • Data quality indicators                           │  │
│  │  • Recommendations for improvement                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Analytics Charts (Recharts)                  │  │
│  │  • Visual data representation                        │  │
│  │  • Conditional rendering based on capabilities       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Insight Cards (Categorized)                  │  │
│  │  • Risks, Friction, Revenue, LiveOps, Players        │  │
│  │  • Severity badges (High/Medium/Low)                 │  │
│  │  • Actionable recommendations                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Key Differences from README Diagram

### ❌ What the README Shows (Incorrect)
```
Game Client → Retain AI API → Parser Engine + IBM Granite → Dashboard
```

### ✅ What Actually Happens (Correct)
```
Game Client → Next.js Frontend → CSV Parser → Dataset Analyzer → 
Analytics Engine → AI Orchestrator → Prompt Builders → 
PM Heuristics → Prompt Composer → Mock AI → Dashboard
```

## Actual System Components

### 1. **Frontend Layer** (Next.js)
- **Location**: `/app/upload/page.tsx`
- **Purpose**: File upload interface, user interaction
- **Tech**: React 19, Next.js 15

### 2. **Data Processing Layer** (Client-Side)
- **CSV Parser**: PapaParse library
- **Dataset Analyzer**: `/lib/telemetry/datasetAnalyzer.ts`
- **Analytics Engine**: `/lib/analytics.ts`
- **Purpose**: Parse, validate, and compute metrics

### 3. **AI Orchestration Layer**
- **Orchestrator**: `/lib/ai/orchestrator.ts`
- **Builders**: `/lib/ai/builders/` (5 specialized builders)
- **Intelligence**: `/lib/ai/intelligence/pmHeuristics.ts`
- **Purpose**: Generate structured prompts, match heuristics

### 4. **Mock AI Layer** (Current)
- **Location**: `/lib/legacy/mockAI.ts`
- **Purpose**: Simulate AI responses
- **Note**: Ready for IBM Granite integration

### 5. **UI Layer**
- **Dashboard**: `/components/insights/InsightsDashboard.tsx`
- **Capability Panel**: `/components/insights/DatasetCapabilityPanel.tsx`
- **Charts**: `/components/insights/AnalyticsCharts.tsx`
- **Purpose**: Display insights, visualizations, capabilities

## Data Flow Sequence

```
1. User uploads CSV file
   ↓
2. PapaParse parses CSV → TelemetryRow[]
   ↓
3. DatasetAnalyzer detects capabilities → TelemetryCapabilities
   ↓
4. Analytics Engine computes metrics → AnalyticsSummary
   ↓
5. AI Orchestrator filters builders by capabilities
   ↓
6. Prompt Builders generate structured prompts
   ↓
7. PM Heuristics match relevant best practices
   ↓
8. Prompt Composer creates final prompts
   ↓
9. Mock AI generates insights (or IBM Granite in future)
   ↓
10. Dashboard displays insights + capability panel
```

## Important Architectural Notes

### 🔴 No Backend API
- **Everything runs client-side** in the browser
- No server-side API endpoints
- No database (yet)
- CSV processing happens in-browser

### 🔴 No Real-Time Streaming
- Currently file-based upload only
- No WebSocket or streaming telemetry
- Future roadmap item

### 🔴 IBM Granite Integration
- **Not yet integrated** (mock AI currently)
- System is **architected and ready** for integration
- Prompts are generated and structured
- Just needs API connection

### 🟢 Modular Architecture
- Clean separation of concerns
- Each layer is independent
- Easy to swap Mock AI for real AI
- Extensible builder system

## Technology Stack (Actual)

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS v4, shadcn/ui |
| **Data Processing** | PapaParse (CSV), Custom Analytics Engine |
| **AI System** | Modular Orchestrator, Prompt Builders, PM Heuristics |
| **AI Provider** | Mock AI (ready for IBM Granite) |
| **Visualization** | Recharts |
| **Deployment** | Vercel (static/edge) |

## Future Architecture (Planned)

```
┌─────────────────┐
│   Game Client   │
└────────┬────────┘
         │ Real-time WebSocket
         ▼
┌─────────────────┐
│  Streaming API  │ ← New component
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Next.js API    │ ← New backend
│    Routes       │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌──────────┐
│Database│ │ IBM      │ ← Real integration
│(Supabase)│ │ Granite  │
└────┬───┘ └────┬─────┘
     │          │
     ▼          ▼
┌─────────────────┐
│   Dashboard     │
└─────────────────┘
```

## Conclusion

The README diagram is **simplified for marketing purposes** but doesn't reflect the actual implementation. The real system is:

1. **Client-side heavy** (no backend API yet)
2. **Modular and extensible** (clean architecture)
3. **Capability-aware** (telemetry detection system)
4. **Mock AI currently** (ready for IBM Granite)
5. **File-based upload** (no real-time streaming yet)

---

**Last Updated**: 2026-05-16  
**Status**: Production-ready frontend, mock AI, ready for backend integration