# Project Structure

## Overview

Retain AI is organized into a clean, modular structure that separates concerns and makes the codebase easy to navigate.

## Directory Structure

```
retain-ai/
├── app/                      # Next.js app directory (pages & layouts)
│   ├── favicon.ico
│   ├── globals.css          # Global styles & theme
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── upload/              # Upload & analytics page
│       └── page.tsx
│
├── components/              # React components
│   ├── nav.tsx             # Navigation component
│   ├── theme-provider.tsx  # Theme context provider
│   ├── theme-toggle.tsx    # Dark/light mode toggle
│   ├── insights/           # Analytics insights components
│   │   ├── AnalyticsCharts.tsx
│   │   ├── InsightCard.tsx
│   │   └── InsightsDashboard.tsx
│   └── ui/                 # shadcn/ui components
│       ├── alert.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── progress.tsx
│       ├── table.tsx
│       └── tabs.tsx
│
├── lib/                    # Core library code
│   ├── analytics.ts        # Analytics engine (main)
│   ├── formatters.ts       # Data formatting utilities
│   ├── theme.ts           # Theme utilities
│   ├── utils.ts           # General utilities
│   ├── ai/                # New AI system (IBM Granite ready)
│   │   ├── index.ts       # Main AI exports
│   │   ├── orchestrator.ts # AI orchestration
│   │   ├── types.ts       # AI type definitions
│   │   ├── README.md      # AI system documentation
│   │   ├── builders/      # Insight builders
│   │   │   ├── frictionBuilder.ts
│   │   │   ├── liveOpsBuilder.ts
│   │   │   ├── monetizationBuilder.ts
│   │   │   ├── retentionBuilder.ts
│   │   │   └── segmentationBuilder.ts
│   │   ├── intelligence/  # PM heuristics
│   │   │   └── pmHeuristics.ts
│   │   ├── utils/         # AI utilities
│   │   │   ├── heuristicMatcher.ts
│   │   │   └── promptComposer.ts
│   │   └── examples/      # Usage examples
│   │       └── usage-example.ts
│   └── legacy/            # Legacy AI implementation
│       ├── aiSummary.ts   # Executive summary generator
│       ├── mockAI.ts      # Mock AI responses
│       └── promptBuilder.ts # Prompt generation
│
├── types/                 # Shared TypeScript types
│   ├── analytics.ts       # Analytics type definitions
│   └── ai.ts             # AI type definitions
│
├── docs/                  # Documentation
│   ├── ANALYTICS_ENGINE.md # Analytics documentation
│   ├── design-system.md   # Design system guide
│   ├── UI_IMPROVEMENTS.md # UI/UX improvements log
│   └── PROJECT_STRUCTURE.md # This file
│
├── config/               # Configuration files (archived)
│   ├── components.json   # shadcn/ui config
│   ├── eslint.config.mjs # ESLint config
│   ├── next.config.ts    # Next.js config
│   └── postcss.config.mjs # PostCSS config
│
├── public/              # Static assets
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── hooks/               # Custom React hooks (empty, ready for use)
│
├── .gitignore          # Git ignore rules
├── components.json     # shadcn/ui configuration
├── eslint.config.mjs   # ESLint configuration
├── next.config.ts      # Next.js configuration
├── package.json        # Dependencies & scripts
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
  - `analytics.ts`: Main analytics engine
  - `/ai`: New modular AI system (production-ready)
  - `/legacy`: Old AI implementation (for reference)

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
- Used in current production
- Files: `mockAI.ts`, `promptBuilder.ts`, `aiSummary.ts`

### New System (`/lib/ai`)
- Modular, production-ready architecture
- IBM Granite integration ready
- Heuristic-based insights
- Structured builders for each insight category

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

---

**Last Updated**: 2026-05-16