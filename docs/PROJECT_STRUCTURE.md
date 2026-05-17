# Project Structure

## Overview

Retain AI is organized into a clean, modular structure that separates concerns and makes the codebase easy to navigate.

## Directory Structure

```
retain-ai/
├── app/                      # Next.js 16 app directory (pages & layouts)
│   ├── favicon.ico
│   ├── globals.css          # Global styles, theme variables, Tailwind config
│   ├── layout.tsx           # Root layout with theme provider
│   ├── page.tsx             # Landing page with dashboard overview
│   └── upload/              # Upload & analytics page
│       └── page.tsx         # CSV upload and insights generation
│
├── components/              # React components
│   ├── nav.tsx             # Navigation component with theme toggle
│   ├── theme-provider.tsx  # next-themes context provider
│   ├── theme-toggle.tsx    # Dark/light mode toggle button
│   ├── insights/           # Analytics insights components
│   │   ├── AnalyticsCharts.tsx        # Recharts visualizations
│   │   ├── DatasetCapabilityPanel.tsx # Telemetry capability display
│   │   ├── InsightCard.tsx            # Individual insight card
│   │   ├── InsightsDashboard.tsx      # Main insights dashboard
│   │   ├── LiveOpsEventCard.tsx       # LiveOps event recommendation card
│   │   └── LiveOpsRecommendations.tsx # LiveOps recommendations panel
│   └── ui/                 # shadcn/ui components (Radix UI based)
│       ├── alert.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── progress.tsx
│       ├── table.tsx
│       └── tabs.tsx
│
├── lib/                    # Core library code
│   ├── achievement-analytics.ts  # Achievement system analytics
│   ├── analytics.ts        # Main analytics engine with capability detection
│   ├── formatters.ts       # Data formatting utilities
│   ├── theme.ts           # Theme utilities
│   ├── utils.ts           # General utilities (cn, etc.)
│   ├── ai/                # Modular AI system (IBM Granite ready)
│   │   ├── index.ts       # Main AI exports
│   │   ├── orchestrator.ts # AI prompt orchestration
│   │   ├── types.ts       # AI type definitions
│   │   ├── README.md      # AI system documentation
│   │   ├── builders/      # Insight builders (prompt generation)
│   │   │   ├── frictionBuilder.ts
│   │   │   ├── liveOpsBuilder.ts
│   │   │   ├── monetizationBuilder.ts
│   │   │   ├── retentionBuilder.ts
│   │   │   └── segmentationBuilder.ts
│   │   ├── generators/    # Insight generators (heuristic-based)
│   │   │   ├── achievementInsightGenerator.ts
│   │   │   └── liveOpsGenerator.ts
│   │   ├── intelligence/  # PM heuristics and rules
│   │   │   ├── achievementHeuristics.ts
│   │   │   └── pmHeuristics.ts
│   │   ├── utils/         # AI utilities
│   │   │   ├── heuristicMatcher.ts
│   │   │   └── promptComposer.ts
│   │   └── examples/      # Usage examples
│   │       ├── achievement-usage-example.ts
│   │       └── usage-example.ts
│   ├── telemetry/         # Telemetry capability detection
│   │   └── datasetAnalyzer.ts  # Automatic telemetry detection
│   └── legacy/            # Legacy AI implementation (reference)
│       ├── aiSummary.ts   # Executive summary generator
│       ├── mockAI.ts      # Mock AI responses
│       └── promptBuilder.ts # Legacy prompt generation
│
├── types/                 # Shared TypeScript types
│   ├── achievement-analytics.ts  # Achievement system types
│   ├── ai.ts                    # AI insights and recommendation types
│   ├── analytics.ts             # Analytics and telemetry types
│   └── telemetry-capabilities.ts # Telemetry capability types
│
├── docs/                  # Comprehensive documentation
│   ├── README.md                           # Documentation index
│   ├── ACHIEVEMENT_ANALYTICS_GUIDE.md      # Achievement system guide
│   ├── ANALYTICS_ENGINE.md                 # Analytics engine docs
│   ├── CHANGELOG.md                        # Version history
│   ├── CONTRIBUTING.md                     # Contribution guidelines
│   ├── CORRECT_ARCHITECTURE.md             # System architecture
│   ├── design-system.md                    # UI/UX design guidelines
│   ├── IMPLEMENTATION_GUIDE.md             # Development guide
│   ├── IMPLEMENTATION_STATUS.md            # Current progress
│   ├── LICENSE.md                          # MIT License
│   ├── LIVEOPS_RECOMMENDATIONS.md          # LiveOps features
│   ├── PROJECT_STRUCTURE.md                # This file
│   ├── TELEMETRY_ARCHITECTURE_DIAGRAM.md   # Telemetry system design
│   ├── TELEMETRY_CAPABILITY_REFACTOR_PLAN.md # Capability detection plan
│   ├── UI_IMPROVEMENTS.md                  # UI enhancement log
│   └── granite/                            # IBM Granite integration docs
│       ├── README.md                       # Granite overview
│       ├── AI_PROVIDER_GUIDE.md            # Provider architecture
│       ├── GRANITE_IMPLEMENTATION_ROADMAP.md # Implementation plan
│       ├── GRANITE_QUICKSTART.md           # Quick start guide
│       └── IBM_GRANITE_INTEGRATION.md      # Complete integration guide
│
├── public/              # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── .gitignore          # Git ignore rules
├── components.json     # shadcn/ui configuration
├── eslint.config.mjs   # ESLint configuration
├── next.config.ts      # Next.js configuration
├── package.json        # Dependencies & scripts
├── package-lock.json   # Locked dependencies
├── postcss.config.mjs  # PostCSS configuration
├── README.md           # Project README
└── tsconfig.json       # TypeScript configuration
```

## Key Directories

### `/app` - Next.js Application
- **Purpose**: Contains all pages, layouts, and route handlers
- **Key Files**:
  - `page.tsx`: Landing page with dashboard overview
  - `upload/page.tsx`: CSV upload and analytics generation
  - `globals.css`: Global styles, theme variables, and Tailwind config

### `/components` - React Components
- **Purpose**: Reusable UI components
- **Structure**:
  - `/ui`: shadcn/ui components (button, card, table, etc.)
  - `/insights`: Analytics-specific components
  - Root level: App-wide components (nav, theme)

### `/lib` - Core Logic
- **Purpose**: Business logic, utilities, and AI systems
- **Key Modules**:
  - `analytics.ts`: Main analytics engine with capability detection
  - `achievement-analytics.ts`: Achievement system analytics
  - `/ai`: Modular AI system (IBM Granite ready, production-ready)
  - `/telemetry`: Dataset analyzer and capability detection
  - `/legacy`: Legacy AI implementation (for reference)

### `/types` - Type Definitions
- **Purpose**: Shared TypeScript interfaces and types
- **Files**:
  - `analytics.ts`: Analytics and telemetry types
  - `ai.ts`: AI insights and recommendation types

### `/docs` - Documentation
- **Purpose**: Project documentation and guides
- **Files**:
  - `ANALYTICS_ENGINE.md`: Analytics system documentation
  - `design-system.md`: UI/UX design guidelines
  - `UI_IMPROVEMENTS.md`: UI improvement changelog
  - `PROJECT_STRUCTURE.md`: This file

## AI System Architecture

### Legacy System (`/lib/legacy`)
- Simple mock-based AI responses
- Used for backward compatibility
- Files: `mockAI.ts`, `promptBuilder.ts`, `aiSummary.ts`

### Current System (`/lib/ai`)
- **Modular, production-ready architecture**
- **IBM Granite integration ready** (watsonx.ai, HuggingFace, Ollama)
- **Heuristic-based intelligence** - generates insights without LLM calls
- **Structured builders** for each insight category (retention, monetization, liveops, friction, segmentation)
- **AI Orchestrator** - coordinates multiple prompt builders
- **Generators** - heuristic-based insight generation (achievements, liveops)
- **Intelligence Layer** - PM-grade heuristics and rules

### Telemetry System (`/lib/telemetry`)
- **Dataset Analyzer** - automatic telemetry capability detection
- **8 Telemetry Categories** - combat, pickup, movement, session, monetization, achievement, progression, liveops
- **Smart Field Mapping** - recognizes alternative column names
- **Confidence Scoring** - per-category confidence levels
- **Quality Assessment** - dataset completeness evaluation

## Import Paths

The project uses TypeScript path aliases configured in `tsconfig.json`:

```typescript
// Import from lib
import { generateAnalyticsSummary } from '@/lib/analytics';

// Import from components
import { Button } from '@/components/ui/button';

// Import from types
import type { AnalyticsSummary } from '@/types/analytics';

// Import from legacy
import { generateMockInsights } from '@/lib/legacy/mockAI';

// Import from new AI system
import { AIOrchestrator } from '@/lib/ai';
```

## Configuration Files

All configuration files are in the root directory for Next.js compatibility:
- `components.json`: shadcn/ui configuration
- `eslint.config.mjs`: Linting rules
- `next.config.ts`: Next.js settings
- `postcss.config.mjs`: PostCSS/Tailwind config
- `tsconfig.json`: TypeScript compiler options

## Development Workflow

1. **Adding New Features**:
   - Components → `/components`
   - Business logic → `/lib`
   - Types → `/types`
   - Documentation → `/docs`

2. **AI System**:
   - Use `/lib/ai` for new AI features
   - Legacy system in `/lib/legacy` for reference

3. **Styling**:
   - Global styles → `app/globals.css`
   - Component styles → Tailwind classes
   - Theme → CSS variables in `globals.css`

## Best Practices

1. **Imports**: Use `@/` path aliases
2. **Types**: Define in `/types` for reusability
3. **Components**: Keep UI components in `/components/ui`
4. **Documentation**: Update `/docs` when adding features
5. **AI**: Use new `/lib/ai` system for production features

## Migration Notes

- Legacy AI files moved to `/lib/legacy`
- Documentation consolidated in `/docs`
- Configuration files restored to root (Next.js requirement)
- Shared types extracted to `/types`

## Recent Updates

### May 2026 (v1.1.0 → v1.1.1)
- ✅ Telemetry capability detection system (8 categories)
- ✅ Achievement analytics system
- ✅ LiveOps recommendation engine
- ✅ DatasetCapabilityPanel component
- ✅ Framer Motion animations
- ✅ Next.js 16 and React 19
- ✅ Comprehensive documentation
- ✅ Heuristic-based intelligence layer
- ✅ Zero TypeScript errors

---

**Last Updated**: 2026-05-17
**Version**: 1.1.1