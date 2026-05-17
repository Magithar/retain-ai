# Gameplay Telemetry Analytics Engine

## Overview

The Retain AI Analytics Engine transforms raw gameplay CSV telemetry into actionable, heuristic-driven insights for live games. It automatically detects what telemetry is available, computes 20+ nullable metrics, and routes data through a modular AI orchestrator — all without requiring a backend or LLM call.

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                  Upload Page (app/upload/page.tsx)        │
│  - CSV drag-and-drop (PapaParse, 100k+ rows)             │
│  - Auto delimiter detection                               │
│  - Data preview table                                     │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│        Telemetry Capability Detection                     │
│        lib/telemetry/datasetAnalyzer.ts                  │
│  - Scans CSV headers in O(n) single pass                  │
│  - Detects 8 categories: combat, pickup, movement,       │
│    session, monetization, achievement, progression,       │
│    liveops                                                │
│  - Smart field mapping (alternative column names)         │
│  - Confidence scoring per category                        │
│  - Dataset quality assessment (full/partial/minimal)     │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│           Analytics Engine (lib/analytics.ts)             │
│  - generateAnalyticsSummary()                            │
│  - Conditional metric computation (null when unavailable) │
│  - identifyBehaviorPatterns()                            │
│  - detectAnomalies()                                     │
│  - frictionScore computation (0–100)                     │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│         AI Orchestrator (lib/ai/orchestrator.ts)          │
│  Builders:                                               │
│  - retentionBuilder.ts    - churn risk signals           │
│  - monetizationBuilder.ts - revenue opportunities        │
│  - liveOpsBuilder.ts      - event recommendations        │
│  - frictionBuilder.ts     - UX pain points               │
│  - segmentationBuilder.ts - player behavior types        │
│  Generators (heuristic):                                 │
│  - liveOpsGenerator.ts    - AI event cards               │
│  - achievementInsightGenerator.ts                        │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────┐
│         Insights Dashboard (components/insights/)         │
│  - InsightsDashboard.tsx  - 6-tab main container         │
│  - InsightCard.tsx        - severity-badged insight cards │
│  - AnalyticsCharts.tsx    - 8+ Recharts visualizations   │
│  - LiveOpsRecommendations.tsx + LiveOpsEventCard.tsx     │
│  - DatasetCapabilityPanel.tsx - dataset quality display  │
└──────────────────────────────────────────────────────────┘
```

## File Structure

```
retain-ai/
├── lib/
│   ├── analytics.ts                    # Core analytics engine (506 lines)
│   ├── achievement-analytics.ts        # Achievement system analytics
│   ├── formatters.ts                   # Data formatting utilities
│   ├── ai/
│   │   ├── orchestrator.ts            # AI prompt orchestration (292 lines)
│   │   ├── builders/                  # Insight builders (5 files)
│   │   ├── generators/                # Heuristic generators (2 files)
│   │   ├── intelligence/              # PM heuristics and rules
│   │   └── utils/                     # Prompt composition utilities
│   ├── telemetry/
│   │   └── datasetAnalyzer.ts         # Capability detection (260 lines)
│   └── legacy/                        # Reference implementation
│       ├── aiSummary.ts
│       ├── mockAI.ts
│       └── promptBuilder.ts
├── components/
│   └── insights/
│       ├── InsightsDashboard.tsx
│       ├── InsightCard.tsx
│       ├── AnalyticsCharts.tsx
│       ├── LiveOpsRecommendations.tsx
│       ├── LiveOpsEventCard.tsx
│       └── DatasetCapabilityPanel.tsx
└── app/
    └── upload/
        └── page.tsx
```

## Data Flow

1. **CSV Upload** — User uploads telemetry CSV via drag-and-drop or file picker
2. **Parsing** — PapaParse converts CSV to `Record<string, any>[]`, supports 100k+ rows
3. **Capability Detection** — `DatasetAnalyzer` scans headers and returns `TelemetryCapabilities`
4. **Analytics** — `generateAnalyticsSummary()` computes metrics conditionally (null when unavailable)
5. **AI Generation** — Orchestrator runs relevant builders and heuristic generators
6. **Visualization** — Dashboard renders insights in 6 tabs with charts and event cards

## Telemetry Schema

The engine uses flexible field mapping — alternative column names are automatically recognized.

```typescript
// Examples of supported column names per category:
// combat:       kills, player_kills, kill_count | deaths, player_deaths | damageDone
// session:      score, player_score, final_score | sessionId, session_id
// pickup:       itemsCollected, items_collected  | pickupAttempts
// movement:     distanceTraveled, distance_traveled
// monetization: revenue, purchase_amount, spend  | purchaseCount
// achievement:  achievementsEarned, achievements_completed
// progression:  level, player_level, currentLevel
// liveops:      eventParticipation, participated_in_event
```

## Analytics Metrics

All metrics are nullable (`number | null`). A `null` value means the required telemetry category was not detected in the dataset.

### Session Metrics
- **averageScore** — Mean score across all sessions
- **averageKills / averageDeaths** — Combat performance indicators
- **killDeathRatio** — Overall combat effectiveness
- **totalSessions** — Number of gameplay sessions analyzed

### Combat Metrics
- **combatIntensity** — Damage per second during combat
- **averageDamageDone** — Total damage output per session
- **averageEnemiesHit** — Hit accuracy indicator
- **combatTimePercentage** — % of playtime spent in combat

### Engagement Metrics
- **pickupEfficiency** — Success rate of item pickup attempts (%)
- **explorationEngagement** — Distance traveled per exploration time
- **averageDistanceTraveled** — Total movement per session

### Friction Indicators
- **frictionScore** — 0–100 composite score (higher = more friction)
  - Death friction (40% weight)
  - Pickup failure friction (30% weight)
  - Low score friction (30% weight)
- **highDeathSessions** — Sessions with >5 deaths
- **lowScoreSessions** — Sessions below 30% of average score
- **abandonmentRate** — % of low-engagement sessions

## Behavioral Patterns

Automatically detected from available telemetry:

| Pattern | Condition |
|---------|-----------|
| Combat-Focused | >50% playtime in combat |
| Explorer | >150% of median distance traveled |
| Collector | >150% of median items collected |
| High Difficulty | >5 deaths per session average |
| Low Engagement | <30% of average score |

## Anomaly Detection

- **Extreme Death Rate** — Sessions with deaths >2 standard deviations above mean
- **Zero Score Sessions** — Sessions with no progression
- **Low Pickup Success** — <50% pickup efficiency
- **Combat Avoidance** — Sessions with zero combat engagement

## Insight Categories

| Tab | What It Shows |
|-----|--------------|
| Overview | KPI cards, 8+ interactive charts, dataset capability panel |
| Risks | Retention risks, churn indicators, at-risk segments |
| Friction | UX pain points, friction score breakdown |
| Revenue | Monetization opportunities by player segment |
| LiveOps | AI-generated event recommendations with timing & targeting |
| Players | Behavioral segment analysis and characteristics |

## Usage

```typescript
import { generateAnalyticsSummary } from '@/lib/analytics';
import { generateMockInsights } from '@/lib/legacy/mockAI';

// After parsing CSV with PapaParse
const summary = generateAnalyticsSummary(parsedRows);
// summary.capabilities tells you what telemetry was detected
// Metrics like summary.killDeathRatio may be null if combat data is absent

const insights = await generateMockInsights(summary);
```

```tsx
import InsightsDashboard from '@/components/insights/InsightsDashboard';

<InsightsDashboard
  insights={aiInsights}
  summary={analyticsSummary}
  isLoading={isGeneratingInsights}
/>
```

## Adding New Metrics

1. Add a nullable field to `AnalyticsSummary` in `types/analytics.ts`:
```typescript
newMetric: number | null;
```

2. Compute it conditionally in `lib/analytics.ts`:
```typescript
newMetric: capabilities.someCategory.available
  ? computeNewMetric(data)
  : null,
```

3. Add null-safe usage in any builder or generator:
```typescript
if (summary.newMetric !== null && summary.newMetric > threshold) {
  // generate insight
}
```

## Performance

- **CSV Parsing** — Handles up to 10MB files with real-time progress tracking
- **Capability Detection** — O(n) single-pass header scan, negligible overhead
- **Analytics** — Computed once per dataset upload, memoized in component state
- **Charts** — Rendered with Recharts, adapt to container size

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| Next.js | 16 | React framework |
| React | 19 | UI library |
| TypeScript | 5 | Type safety |
| PapaParse | latest | CSV parsing |
| Recharts | latest | Chart library |
| shadcn/ui | latest | UI components |
| Tailwind CSS | v4 | Styling |
| Framer Motion | latest | Animations |

## License

MIT — see [LICENSE.md](LICENSE.md)
