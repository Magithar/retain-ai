# LiveOps Event Recommendations

## Overview

The LiveOps Recommendation system is a premium AI-powered feature that generates comprehensive event recommendations based on telemetry insights and product management heuristics. It provides executive-ready event cards with detailed implementation plans, monetization strategies, and retention impact projections.

## Features

### 🎯 AI-Powered Event Generation

The system analyzes gameplay telemetry and automatically generates event recommendations across multiple categories:

- **Combat Events**: Arena tournaments, boss rushes, PvP competitions
- **Collection Events**: Treasure hunts, seasonal collectibles, discovery challenges
- **Social Events**: Server-wide goals, guild competitions, cooperative raids
- **Progression Events**: Battle passes, seasonal content, daily login rewards
- **Challenge Events**: Hardcore survival, difficulty tiers, mastery challenges

### 📊 Comprehensive Event Details

Each event recommendation includes:

- **Event Name**: Descriptive, engaging title
- **Target Segment**: Specific player demographic with size estimates
- **Reward Structure**: Primary, secondary, and progression rewards
- **Engagement Objective**: Clear goal and expected player behavior
- **Retention Impact**: Projected D1 and D7 retention lifts
- **Recommended Cadence**: Daily, weekly, monthly, quarterly, or one-time
- **Duration**: Event length and timing recommendations
- **Monetization Considerations**:
  - Revenue opportunity rating (high/medium/low)
  - Specific monetization mechanics
  - Estimated ARPU impact
- **Implementation Complexity**: Low, medium, or high
- **Resource Requirements**: Development, art, and QA estimates
- **Success Metrics (KPIs)**: Measurable goals for tracking
- **Risk Considerations**: Potential issues and mitigation strategies
- **Priority Level**: Critical, high, medium, or low

### 🎨 Premium Dark SaaS UI

The event cards feature a polished, executive-ready design:

- **Color-coded by event type**: Each event type has unique gradient and border colors
- **Priority badges**: Visual indicators for urgency
- **Complexity indicators**: Clear resource requirement displays
- **Revenue potential icons**: Visual monetization opportunity ratings
- **Responsive layout**: Optimized for desktop and mobile viewing
- **Hover effects**: Smooth transitions and interactive elements
- **Dark theme optimized**: Professional SaaS aesthetic

## Architecture

### Components

#### `LiveOpsEventCard.tsx`
Premium card component for displaying individual event recommendations with:
- Event type-specific styling and icons
- Comprehensive information sections
- Visual hierarchy for quick scanning
- Interactive hover states

#### `LiveOpsRecommendations.tsx`
Dashboard component that:
- Displays all event recommendations
- Groups events by priority
- Shows summary statistics
- Provides implementation timeline
- Handles loading and empty states

#### `liveOpsGenerator.ts`
AI-powered generator that:
- Analyzes telemetry data
- Applies PM heuristics
- Generates contextual recommendations
- Calculates impact projections
- Prioritizes events based on urgency

### Data Flow

```
Telemetry Data (CSV Upload)
    ↓
Analytics Summary Generation
    ↓
LiveOps Generator (AI + Heuristics)
    ↓
Event Recommendations Array
    ↓
LiveOpsRecommendations Component
    ↓
Individual LiveOpsEventCard Components
```

## PM Heuristics

The system uses six core heuristics to generate recommendations:

1. **Combat Event Opportunity**: Triggered when combat engagement > 50%
2. **Collection Event Opportunity**: Triggered when pickup efficiency > 70%
3. **Retention Boost Event**: Triggered when abandonment rate > 20% (Critical)
4. **Social Event Opportunity**: Triggered when total sessions > 1000
5. **Difficulty Challenge Event**: Triggered when average deaths > 4
6. **Seasonal Content Cadence**: Triggered when total sessions > 500

## Usage

### In the Dashboard

1. Upload telemetry CSV data
2. Generate AI insights
3. Navigate to the "LiveOps" tab
4. View prioritized event recommendations
5. Review implementation timeline

### Programmatic Usage

```typescript
import { generateLiveOpsRecommendations } from '@/lib/ai/generators/liveOpsGenerator';
import { AnalyticsSummary } from '@/lib/analytics';

// Generate recommendations from analytics summary
const recommendations = generateLiveOpsRecommendations(summary);

// Filter by priority
const criticalEvents = recommendations.filter(r => r.priority === 'critical');

// Filter by revenue opportunity
const highRevenueEvents = recommendations.filter(
  r => r.monetizationConsiderations.revenueOpportunity === 'high'
);
```

## Event Types Configuration

Each event type has specific visual styling:

```typescript
const eventTypeConfig = {
  combat: { 
    icon: Trophy, 
    gradient: "from-red-500/20 to-orange-500/20",
    border: "border-red-500/30"
  },
  collection: { 
    icon: Sparkles, 
    gradient: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/30"
  },
  social: { 
    icon: Users, 
    gradient: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30"
  },
  // ... more types
};
```

## Customization

### Adding New Event Types

1. Add type to `LiveOpsEventRecommendation` interface in `types/ai.ts`
2. Add configuration to `eventTypeConfig` in `LiveOpsEventCard.tsx`
3. Create generation logic in `liveOpsGenerator.ts`
4. Add corresponding PM heuristic in `pmHeuristics.ts`

### Modifying Heuristics

Edit `lib/ai/intelligence/pmHeuristics.ts`:

```typescript
export const liveOpsHeuristics: PMHeuristic[] = [
  {
    id: 'your-heuristic-id',
    category: 'liveops',
    title: 'Your Heuristic Title',
    description: 'Description of when this applies',
    priority: 'high',
    applicableMetrics: ['metric1', 'metric2'],
    thresholds: {
      metric1: 50
    },
    recommendations: [
      'Recommendation 1',
      'Recommendation 2'
    ],
    tags: ['tag1', 'tag2']
  }
];
```

## Best Practices

### For Product Managers

1. **Review Priority Events First**: Focus on critical and high-priority recommendations
2. **Consider Resource Constraints**: Balance impact with implementation complexity
3. **Validate Assumptions**: Use the telemetry data to verify recommendations
4. **Iterate Based on Results**: Track KPIs and adjust future events

### For Developers

1. **Maintain Type Safety**: Use TypeScript interfaces for all event data
2. **Keep Components Modular**: Separate concerns between card, list, and generator
3. **Optimize Performance**: Memoize expensive calculations
4. **Test Edge Cases**: Handle empty states, loading states, and errors

### For Designers

1. **Maintain Visual Hierarchy**: Priority should be immediately clear
2. **Use Consistent Spacing**: Follow the established design system
3. **Ensure Accessibility**: Maintain proper contrast ratios
4. **Test Responsiveness**: Verify layout on all screen sizes

## Metrics & KPIs

Track these metrics to measure LiveOps effectiveness:

- **Event Participation Rate**: % of active players engaging with events
- **Retention Lift**: Actual vs. projected D1/D7 retention improvements
- **Revenue Impact**: ARPU increase during and after events
- **Completion Rate**: % of players completing event objectives
- **Player Sentiment**: Feedback and satisfaction scores

## Future Enhancements

Potential improvements for the LiveOps system:

- [ ] A/B testing framework for event variations
- [ ] Historical event performance tracking
- [ ] Automated event scheduling and calendar
- [ ] Player segment-specific event recommendations
- [ ] Real-time event performance monitoring
- [ ] Integration with analytics platforms
- [ ] Export recommendations to project management tools
- [ ] Machine learning for impact prediction refinement

## Support

For questions or issues:
- Review the main [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)
- Check [ANALYTICS_ENGINE.md](./ANALYTICS_ENGINE.md) for data processing
- See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines

---

