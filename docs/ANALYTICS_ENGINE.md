# Gameplay Telemetry Analytics Engine

## Overview

The Retain AI Analytics Engine transforms raw gameplay CSV telemetry into actionable AI-generated product management insights for live games. It provides comprehensive analytics, behavioral pattern detection, and strategic recommendations without requiring backend infrastructure.

## Features

### 📊 Analytics Layer
- **Session Metrics**: Average scores, kills, deaths, K/D ratios
- **Combat Analysis**: Combat intensity, damage metrics, engagement time
- **Player Behavior**: Pickup efficiency, exploration patterns, friction indicators
- **Anomaly Detection**: Automatic identification of unusual patterns and issues
- **Behavioral Segmentation**: Classification of player types and play styles

### 🤖 AI Insights Generation
- **Retention Risk Analysis**: Identifies churn indicators and at-risk player segments
- **Friction Point Detection**: Highlights UX issues and player pain points
- **Monetization Opportunities**: Data-driven revenue strategies by player segment
- **LiveOps Recommendations**: Event and content suggestions based on behavior
- **Player Insights**: Deep behavioral analysis and segment characteristics

### 📈 Visualization
- **Interactive Charts**: Combat vs Score, Kills vs Deaths, Score Distribution
- **Engagement Metrics**: Time distribution, pickup efficiency visualization
- **Responsive Design**: Dark theme support, mobile-friendly layouts
- **Real-time Updates**: Dynamic chart rendering with Recharts

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Upload Page (UI)                         │
│  - CSV Upload & Parsing (PapaParse)                         │
│  - Data Preview Table                                        │
│  - Generate Insights Button                                  │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Analytics Layer (lib/analytics.ts)              │
│  - generateAnalyticsSummary()                               │
│  - computeMetrics() functions                               │
│  - identifyBehaviorPatterns()                               │
│  - detectAnomalies()                                        │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│           AI Prompt Builder (lib/promptBuilder.ts)           │
│  - buildInsightPrompt()                                     │
│  - buildFocusedPrompt()                                     │
│  - extractKeyMetrics()                                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│            Mock AI Layer (lib/mockAI.ts)                     │
│  - generateMockInsights()                                   │
│  - Structured JSON responses                                │
│  - Realistic recommendations                                │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│         Insights Dashboard (components/insights/)            │
│  - InsightsDashboard: Main container with tabs              │
│  - InsightCard: Individual insight display                  │
│  - AnalyticsCharts: Recharts visualizations                 │
└─────────────────────────────────────────────────────────────┘
```

## File Structure

```
retain-ai/
├── lib/
│   ├── analytics.ts          # Core analytics engine
│   ├── promptBuilder.ts      # AI prompt generation
│   └── mockAI.ts            # Mock AI response layer
├── components/
│   └── insights/
│       ├── InsightsDashboard.tsx  # Main dashboard with tabs
│       ├── InsightCard.tsx        # Individual insight cards
│       └── AnalyticsCharts.tsx    # Recharts visualizations
└── app/
    └── upload/
        └── page.tsx          # Main upload & analytics page
```

## Data Flow

1. **CSV Upload**: User uploads telemetry CSV via drag-and-drop or file picker
2. **Parsing**: PapaParse converts CSV to `Record<string, any>[]` format
3. **Analytics**: `generateAnalyticsSummary()` computes all metrics and patterns
4. **AI Generation**: `generateMockInsights()` creates structured recommendations
5. **Visualization**: Dashboard displays insights in categorized tabs with charts

## Telemetry Schema

Expected CSV columns:

```typescript
interface TelemetryRow {
  itemsCollected?: number;
  pickupAttempts?: number;
  timeNearInteractables?: number;
  enemiesHit?: number;
  damageDone?: number;
  timeInCombat?: number;
  distanceTraveled?: number;
  timeOutOfCombat?: number;
  kills?: number;
  deaths?: number;
  score?: number;
  sessionId?: string;
  timestamp?: string;
}
```

## Analytics Metrics

### Session Metrics
- **Average Score**: Mean score across all sessions
- **Average Kills/Deaths**: Combat performance indicators
- **Kill/Death Ratio**: Overall combat effectiveness
- **Total Sessions**: Number of gameplay sessions analyzed

### Combat Metrics
- **Combat Intensity**: Damage per second during combat
- **Average Damage Done**: Total damage output per session
- **Average Enemies Hit**: Hit accuracy indicator
- **Combat Time Percentage**: % of playtime spent in combat

### Engagement Metrics
- **Pickup Efficiency**: Success rate of item pickup attempts (%)
- **Exploration Engagement**: Distance traveled per exploration time
- **Average Distance Traveled**: Total movement per session

### Friction Indicators
- **Friction Score**: 0-100 composite score (higher = more friction)
  - Death friction (40% weight)
  - Pickup failure friction (30% weight)
  - Low score friction (30% weight)
- **High Death Sessions**: Count of sessions with >5 deaths
- **Low Score Sessions**: Sessions below 30% of average score
- **Abandonment Rate**: % of low-engagement sessions

## Behavioral Patterns

The engine automatically identifies:

1. **Combat-Focused**: Players spending >50% time in combat
2. **Explorer**: Players traveling >150% of median distance
3. **Collector**: Players collecting >150% of median items
4. **High Difficulty**: Players with >5 deaths per session
5. **Low Engagement**: Players with <30% of average score

## Anomaly Detection

Automatic detection of:

- **Extreme Death Rate**: Sessions with deaths >2 standard deviations above mean
- **Zero Score Sessions**: Sessions with no progression
- **Low Pickup Success**: <50% pickup efficiency
- **Combat Avoidance**: Sessions with zero combat engagement

## AI Insights Categories

### 1. Retention Risks
Identifies churn indicators:
- High death rates
- Early abandonment patterns
- Excessive friction
- Negative K/D ratios
- Combat avoidance

### 2. Friction Points
Highlights UX issues:
- Item pickup problems
- Slow combat pacing
- Limited exploration incentive
- Score progression failures
- Combat efficiency problems

### 3. Monetization Opportunities
Revenue strategies by segment:
- Cosmetic collections for Collectors
- Power-ups for Combat Enthusiasts
- Progression accelerators for High Performers
- Exploration content for Explorers
- Convenience items for Casual Players

### 4. LiveOps Suggestions
Event and content recommendations:
- Survival challenges for high-death scenarios
- Interaction system overhauls
- Combat tournaments
- Balance patches
- Collection events
- Daily challenge systems

### 5. Player Insights
Behavioral segment analysis:
- Combat Enthusiasts
- Explorers
- Collectors
- Struggling Players
- At-Risk Players
- Balanced Players

## Usage

### Basic Usage

```typescript
import { generateAnalyticsSummary } from '@/lib/analytics';
import { generateMockInsights } from '@/lib/mockAI';

// After parsing CSV
const summary = generateAnalyticsSummary(parsedRows);
const insights = await generateMockInsights(summary);
```

### Component Integration

```tsx
import { InsightsDashboard } from '@/components/insights/InsightsDashboard';

<InsightsDashboard 
  insights={aiInsights}
  summary={analyticsSummary}
  isLoading={isGeneratingInsights}
/>
```

## Customization

### Adding New Metrics

1. Add computation function to `lib/analytics.ts`:
```typescript
export function computeNewMetric(data: TelemetryRow[]): number {
  // Your calculation logic
  return result;
}
```

2. Add to `AnalyticsSummary` interface
3. Include in `generateAnalyticsSummary()`

### Adding New Insight Types

1. Define interface in `lib/mockAI.ts`:
```typescript
export interface NewInsightType {
  title: string;
  description: string;
  // ... other fields
}
```

2. Add generation function
3. Include in `AIInsights` interface
4. Add tab to `InsightsDashboard`

### Customizing Charts

Edit `components/insights/AnalyticsCharts.tsx`:
- Add new chart components
- Modify existing visualizations
- Adjust colors and styling
- Add interactive features

## Performance Considerations

- **Large Files**: Parser handles up to 10MB CSV files
- **Progress Tracking**: Real-time progress updates during parsing
- **Lazy Loading**: Charts render only when visible
- **Memoization**: Analytics computed once per dataset
- **Responsive**: Charts adapt to container size

## Future Enhancements

### Phase 1: Real AI Integration
- Replace mock layer with IBM Granite API
- Implement actual LLM-based insight generation
- Add prompt engineering optimizations

### Phase 2: Advanced Analytics
- Time-series analysis
- Cohort analysis
- A/B test result interpretation
- Predictive churn modeling

### Phase 3: Export & Reporting
- PDF report generation
- Excel export with charts
- Shareable insight links
- Email digest functionality

### Phase 4: Collaboration
- Team comments on insights
- Action item tracking
- Implementation status updates
- Historical comparison

## Best Practices

1. **Data Quality**: Ensure CSV has all expected columns
2. **Sample Size**: Minimum 100 sessions for reliable insights
3. **Regular Analysis**: Upload new data weekly for trend tracking
4. **Action Items**: Prioritize high-severity insights first
5. **Validation**: A/B test recommendations before full rollout

## Troubleshooting

### No Insights Generated
- Check CSV has required columns
- Verify data contains numeric values
- Ensure minimum 10 rows of data

### Charts Not Displaying
- Check browser console for errors
- Verify Recharts is installed
- Ensure data arrays are not empty

### Incorrect Metrics
- Validate CSV column names match expected schema
- Check for null/undefined values in data
- Verify numeric columns are properly typed

## Dependencies

- **Next.js 15**: React framework
- **TypeScript**: Type safety
- **PapaParse**: CSV parsing
- **Recharts**: Chart library
- **shadcn/ui**: UI components
- **Tailwind CSS**: Styling

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
1. Check this documentation
2. Review code comments
3. Open GitHub issue
4. Contact development team

---

