# RetainAI - AI Prompt Orchestration System

A modular, scalable AI prompt orchestration system for game analytics and product management insights.

## Overview

The AI Prompt Orchestration System dynamically generates specialized prompts for analyzing gameplay telemetry data. It leverages a centralized PM intelligence layer with industry best practices and heuristics to provide data-driven, actionable insights.

## Architecture

```
lib/ai/
├── types.ts                    # TypeScript interfaces and types
├── index.ts                    # Main entry point
├── orchestrator.ts             # Central orchestration system
├── intelligence/
│   └── pmHeuristics.ts        # PM best practices database
├── builders/
│   ├── retentionBuilder.ts    # Retention analysis prompts
│   ├── monetizationBuilder.ts # Monetization strategy prompts
│   ├── liveOpsBuilder.ts      # LiveOps recommendations prompts
│   ├── frictionBuilder.ts     # Friction/churn analysis prompts
│   └── segmentationBuilder.ts # Player segmentation prompts
└── utils/
    ├── heuristicMatcher.ts    # Intelligent heuristic matching
    └── promptComposer.ts      # Reusable prompt composition utilities
```

## Features

### 🎯 Specialized Prompt Builders

- **Retention Analysis**: Identifies churn risks and retention drivers
- **Monetization Strategy**: Discovers revenue opportunities by player segment
- **LiveOps Recommendations**: Plans events, content updates, and engagement initiatives
- **Friction Analysis**: Pinpoints UX issues and player pain points
- **Player Segmentation**: Analyzes behavioral patterns and player types

### 🧠 PM Intelligence Layer

- 25+ curated PM heuristics based on industry best practices
- Automatic relevance scoring and matching to analytics data
- Priority-based heuristic selection (critical, high, medium, low)
- Tag-based filtering for specific analysis needs

### 🔧 Modular & Extensible

- Clean separation of concerns
- Strongly typed TypeScript interfaces
- Reusable utility functions
- Easy to add new builders or heuristics

## Quick Start

### Basic Usage

```typescript
import { generatePrompt } from '@/lib/ai';
import { AnalyticsSummary } from '@/lib/analytics';

// Your analytics data
const summary: AnalyticsSummary = {
  totalSessions: 1000,
  averageScore: 850,
  // ... other metrics
};

// Generate a retention analysis prompt
const prompt = await generatePrompt('retention', summary, {
  gameContext: 'mobile RPG',
  focusAreas: ['early game retention', 'tutorial effectiveness']
});

console.log(prompt.fullPrompt);
```

### Generate All Prompts

```typescript
import { generateAllPrompts } from '@/lib/ai';

const result = await generateAllPrompts(summary, {
  gameContext: 'competitive shooter',
  focusAreas: ['combat balance', 'matchmaking']
});

// Access individual prompts
console.log(result.prompts.retention.fullPrompt);
console.log(result.prompts.monetization.fullPrompt);
console.log(result.prompts.liveops.fullPrompt);

// View metadata
console.log(result.metadata);
// {
//   timestamp: "2024-05-16T00:00:00.000Z",
//   sessionCount: 1000,
//   heuristicsApplied: 12,
//   buildersUsed: ["retention", "monetization", "liveops", "friction", "segmentation"]
// }
```

### Custom Configuration

```typescript
import { createOrchestrator } from '@/lib/ai';

const orchestrator = createOrchestrator({
  enabledBuilders: ['retention', 'friction'], // Only these builders
  heuristicCategories: ['retention', 'friction'],
  outputFormat: 'json',
  includeExecutiveSummary: true,
  maxRecommendationsPerCategory: 5
});

const result = await orchestrator.generatePrompts(summary);
```

## Prompt Builders

### Retention Builder

Analyzes player retention and churn risks.

```typescript
import { buildRetentionPrompt } from '@/lib/ai';

const prompt = await buildRetentionPrompt({
  summary,
  gameContext: 'casual puzzle game',
  focusAreas: ['D1 retention', 'tutorial completion']
});
```

**Focus Areas:**
- Churn risk identification
- Retention drivers
- Critical intervention points
- Success metrics

### Monetization Builder

Identifies revenue opportunities by player segment.

```typescript
import { buildMonetizationPrompt } from '@/lib/ai';

const prompt = await buildMonetizationPrompt({
  summary,
  gameContext: 'F2P strategy game',
  focusAreas: ['battle pass', 'whale segment']
});
```

**Focus Areas:**
- Player segment monetization
- Pricing strategy
- Ethical monetization
- Implementation roadmap

### LiveOps Builder

Plans events, content updates, and engagement initiatives.

```typescript
import { buildLiveOpsPrompt } from '@/lib/ai';

const prompt = await buildLiveOpsPrompt({
  summary,
  gameContext: 'live service game',
  focusAreas: ['seasonal events', 'daily challenges']
});
```

**Focus Areas:**
- Immediate actions
- Short-term content
- Medium-term strategy
- Event types & cadence

### Friction Builder

Identifies UX issues and player pain points.

```typescript
import { buildFrictionPrompt } from '@/lib/ai';

const prompt = await buildFrictionPrompt({
  summary,
  gameContext: 'action RPG',
  focusAreas: ['combat feel', 'navigation']
});
```

**Focus Areas:**
- Friction point identification
- Churn indicator analysis
- Root cause analysis
- Quick wins vs. long-term fixes

### Segmentation Builder

Analyzes player behavioral patterns and segments.

```typescript
import { buildSegmentationPrompt } from '@/lib/ai';

const prompt = await buildSegmentationPrompt({
  summary,
  gameContext: 'multiplayer shooter',
  focusAreas: ['competitive players', 'casual segment']
});
```

**Focus Areas:**
- Behavioral segmentation
- Segment characteristics
- Segment needs & opportunities
- Cross-segment analysis

## PM Heuristics

The system includes 25+ PM heuristics across categories:

### Retention Heuristics (5)
- High death rate churn risk
- Early abandonment pattern
- Negative K/D ratio impact
- Session length optimization
- Combat avoidance behavior

### Monetization Heuristics (5)
- Collector segment monetization
- Combat enthusiast monetization
- Convenience monetization
- High performer progression
- Explorer content monetization

### LiveOps Heuristics (5)
- Daily engagement optimization
- Limited-time events
- Balance patch cadence
- Seasonal content strategy
- Community event engagement

### Friction Heuristics (5)
- Pickup interaction friction
- Combat pacing issues
- Navigation and wayfinding
- Zero progress sessions
- Combat efficiency gap

### Segmentation Heuristics (5)
- Combat enthusiast identification
- Collector archetype
- Explorer persona
- At-risk player detection
- Whale identification

## Utility Functions

### Heuristic Matching

```typescript
import { matchHeuristics, getTopHeuristics } from '@/lib/ai';

// Match relevant heuristics
const matches = matchHeuristics(summary, {
  categories: ['retention', 'friction'],
  minPriority: 'high'
});

// Get top 5 most relevant
const topMatches = getTopHeuristics(matches, 5);
```

### Prompt Composition

```typescript
import { 
  formatAnalyticsContext,
  createSystemContext,
  createComposedPrompt 
} from '@/lib/ai';

// Format analytics data
const dataContext = formatAnalyticsContext(summary);

// Create system context
const systemContext = createSystemContext(
  'expert retention specialist',
  'mobile game'
);

// Compose full prompt
const prompt = createComposedPrompt(
  systemContext,
  dataContext,
  heuristicContext,
  analysisRequest,
  outputFormat
);
```

## Advanced Usage

### Batch Processing

```typescript
import { batchGeneratePrompts } from '@/lib/ai';

const summaries = [summary1, summary2, summary3];
const prompts = await batchGeneratePrompts(
  summaries,
  'retention',
  { gameContext: 'mobile game' }
);
```

### Custom Heuristics

```typescript
import { PM_HEURISTICS_DB } from '@/lib/ai';

// Add custom heuristic
PM_HEURISTICS_DB.retention.push({
  id: 'custom-001',
  category: 'retention',
  title: 'Custom Retention Heuristic',
  description: 'Your custom heuristic description',
  priority: 'high',
  applicableMetrics: ['customMetric'],
  thresholds: { customMetric: 50 },
  recommendations: ['Do this', 'Do that'],
  tags: ['custom', 'retention']
});
```

### Validation

```typescript
import { validateAnalyticsSummary } from '@/lib/ai';

const validation = validateAnalyticsSummary(summary);
if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
}
```

## Output Formats

### JSON (Default)

Structured JSON output with typed fields for programmatic processing.

### Markdown

Human-readable markdown format for documentation and reports.

### Structured

Custom structured format with clear sections.

## Best Practices

1. **Always validate analytics data** before generating prompts
2. **Use specific focus areas** to get targeted insights
3. **Match heuristic priority** to your analysis needs
4. **Combine multiple builders** for comprehensive analysis
5. **Review heuristic matches** to understand AI reasoning

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import type {
  PromptContext,
  ComposedPrompt,
  PMHeuristic,
  HeuristicMatch,
  OrchestrationResult
} from '@/lib/ai';
```

## Contributing

To add a new prompt builder:

1. Create a new file in `builders/`
2. Implement the `IPromptBuilder` interface
3. Add relevant heuristics to `intelligence/pmHeuristics.ts`
4. Register the builder in `orchestrator.ts`
5. Export from `index.ts`

## License

Part of the RetainAI project.

---

**Made with ❤️ by Bob**