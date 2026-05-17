# Telemetry Capability Detection & Dataset-Aware Analytics Refactoring Plan

## Executive Summary

This document outlines the comprehensive refactoring plan to transform RetainAI's analytics pipeline into a **telemetry-aware system** that detects available data signals, validates metric computations, and generates insights only from verified telemetry categories.

## Problem Statement

### Current Issues
1. **Blind Metric Computation**: Analytics engine computes all metrics regardless of data availability
2. **Unreliable Insights**: AI generates insights for metrics that don't exist in uploaded datasets
3. **Credibility Gap**: Executive summaries reference K/D ratios, pickup efficiency, and DPS without verifying data presence
4. **No Validation Layer**: Missing telemetry categories are treated as zero values rather than "unavailable"

### Examples of Current Problems
- Generates K/D ratio insights when `kills`/`deaths` columns don't exist
- Computes pickup efficiency analysis without `itemsCollected` or `pickupAttempts` data
- Creates DPS recommendations without `damageDone` or `timeInCombat` telemetry
- Executive summaries claim "high combat engagement" when combat data is missing

## Solution Architecture

### Core Principles
1. **Detect Before Compute**: Analyze dataset schema before calculating metrics
2. **Validate Before Generate**: Check telemetry availability before AI insight generation
3. **Transparent Reporting**: Show users exactly what telemetry is available vs. missing
4. **Graceful Degradation**: Replace unsupported metrics with clear "unavailable" messages

### Telemetry Categories

```typescript
enum TelemetryCategory {
  COMBAT = 'combat',           // kills, deaths, damageDone, enemiesHit, timeInCombat
  MONETIZATION = 'monetization', // purchases, revenue, currency, transactions
  SESSION = 'session',          // sessionId, timestamp, duration, score
  ACHIEVEMENT = 'achievement',  // achievements, milestones, progression
  PROGRESSION = 'progression',  // level, xp, unlocks, upgrades
  LIVEOPS = 'liveops',         // events, challenges, seasonal content
  MOVEMENT = 'movement',        // distanceTraveled, velocity, positions
  PICKUP = 'pickup'            // itemsCollected, pickupAttempts, timeNearInteractables
}
```

## Implementation Plan

### Phase 1: Type System & Capability Detection

#### 1.1 Create Telemetry Capability Types
**File**: `types/telemetry-capabilities.ts`

```typescript
export interface TelemetryCapabilities {
  combat: TelemetryCategoryStatus;
  monetization: TelemetryCategoryStatus;
  session: TelemetryCategoryStatus;
  achievement: TelemetryCategoryStatus;
  progression: TelemetryCategoryStatus;
  liveops: TelemetryCategoryStatus;
  movement: TelemetryCategoryStatus;
  pickup: TelemetryCategoryStatus;
}

export interface TelemetryCategoryStatus {
  available: boolean;
  confidence: 'high' | 'medium' | 'low';
  detectedFields: string[];
  missingFields: string[];
  requiredFields: string[];
}

export interface DatasetCapabilitySummary {
  capabilities: TelemetryCapabilities;
  overallQuality: 'excellent' | 'good' | 'partial' | 'minimal';
  supportedAnalytics: string[];
  unsupportedAnalytics: string[];
  recommendations: string[];
}
```

#### 1.2 Implement Dataset Analyzer
**File**: `lib/telemetry/datasetAnalyzer.ts`

```typescript
export class DatasetAnalyzer {
  /**
   * Analyze CSV headers and sample data to detect telemetry capabilities
   */
  analyzeDataset(data: TelemetryRow[]): TelemetryCapabilities;
  
  /**
   * Check if specific telemetry category is available
   */
  hasCapability(category: TelemetryCategory): boolean;
  
  /**
   * Get confidence level for a telemetry category
   */
  getConfidence(category: TelemetryCategory): 'high' | 'medium' | 'low';
  
  /**
   * Generate human-readable capability summary
   */
  generateCapabilitySummary(): DatasetCapabilitySummary;
}
```

**Detection Logic**:
- **Combat**: Requires `kills` OR `deaths` OR `damageDone` (high confidence if 2+)
- **Pickup**: Requires `itemsCollected` OR `pickupAttempts` (high confidence if both)
- **Movement**: Requires `distanceTraveled` (high confidence if also has velocity/position)
- **Session**: Requires `sessionId` OR `timestamp` (high confidence if both)

### Phase 2: Analytics Engine Refactoring

#### 2.1 Update AnalyticsSummary Type
**File**: `types/analytics.ts`

```typescript
export interface AnalyticsSummary {
  // Existing metrics...
  
  // NEW: Capability metadata
  capabilities: TelemetryCapabilities;
  datasetQuality: 'excellent' | 'good' | 'partial' | 'minimal';
  
  // NEW: Metric availability flags
  metricsAvailable: {
    combat: boolean;
    pickup: boolean;
    movement: boolean;
    monetization: boolean;
    // ... etc
  };
}
```

#### 2.2 Refactor Metric Computation Functions
**File**: `lib/analytics.ts`

**Before**:
```typescript
export function computeKillDeathRatio(data: TelemetryRow[]): number {
  const totalKills = data.reduce((sum, row) => sum + safeNumber(row.kills), 0);
  const totalDeaths = data.reduce((sum, row) => sum + safeNumber(row.deaths), 0);
  return totalDeaths === 0 ? totalKills : totalKills / totalDeaths;
}
```

**After**:
```typescript
export function computeKillDeathRatio(
  data: TelemetryRow[], 
  capabilities: TelemetryCapabilities
): number | null {
  // Validate telemetry availability
  if (!capabilities.combat.available) {
    return null; // Explicitly return null for unavailable metrics
  }
  
  const totalKills = data.reduce((sum, row) => sum + safeNumber(row.kills), 0);
  const totalDeaths = data.reduce((sum, row) => sum + safeNumber(row.deaths), 0);
  return totalDeaths === 0 ? totalKills : totalKills / totalDeaths;
}
```

#### 2.3 Update generateAnalyticsSummary
```typescript
export function generateAnalyticsSummary(data: TelemetryRow[]): AnalyticsSummary {
  // Step 1: Detect capabilities
  const analyzer = new DatasetAnalyzer();
  const capabilities = analyzer.analyzeDataset(data);
  
  // Step 2: Compute only available metrics
  const summary = {
    capabilities,
    datasetQuality: analyzer.getDatasetQuality(),
    
    // Conditional computation
    killDeathRatio: capabilities.combat.available 
      ? computeKillDeathRatio(data, capabilities)
      : null,
    
    pickupEfficiency: capabilities.pickup.available
      ? computePickupEfficiency(data, capabilities)
      : null,
    
    // ... etc
  };
  
  return summary;
}
```

### Phase 3: AI Prompt System Updates

#### 3.1 Update Prompt Composer
**File**: `lib/ai/utils/promptComposer.ts`

```typescript
export function formatAnalyticsContext(
  summary: AnalyticsSummary,
  capabilities: TelemetryCapabilities
): string {
  const sections: string[] = [];
  
  // Add capability summary at the top
  sections.push('## Dataset Capabilities\n');
  sections.push(formatCapabilitySummary(capabilities));
  sections.push('');
  
  // Only include available metrics
  if (capabilities.combat.available) {
    sections.push('### Combat Performance');
    sections.push(`- K/D Ratio: ${summary.killDeathRatio?.toFixed(2) ?? 'N/A'}`);
    // ... other combat metrics
  } else {
    sections.push('### Combat Performance');
    sections.push('⚠️ Combat telemetry unavailable in uploaded dataset');
  }
  
  // ... similar for other categories
  
  return sections.join('\n');
}

function formatCapabilitySummary(capabilities: TelemetryCapabilities): string {
  const available = Object.entries(capabilities)
    .filter(([_, status]) => status.available)
    .map(([category, _]) => category);
  
  const unavailable = Object.entries(capabilities)
    .filter(([_, status]) => !status.available)
    .map(([category, _]) => category);
  
  return `
**Available Telemetry**: ${available.join(', ') || 'None'}
**Unavailable Telemetry**: ${unavailable.join(', ') || 'None'}
**Dataset Quality**: ${getDatasetQuality(capabilities)}

⚠️ **IMPORTANT**: Only generate insights for available telemetry categories. 
Do NOT reference metrics from unavailable categories.
  `.trim();
}
```

#### 3.2 Update Heuristic Matcher
**File**: `lib/ai/utils/heuristicMatcher.ts`

```typescript
export function matchHeuristics(
  summary: AnalyticsSummary,
  criteria: HeuristicMatchCriteria,
  capabilities: TelemetryCapabilities // NEW parameter
): HeuristicMatch[] {
  // Filter heuristics based on available telemetry
  let heuristics = getHeuristicsByCategory(summary, criteria.categories);
  
  // NEW: Filter out heuristics requiring unavailable telemetry
  heuristics = heuristics.filter(h => 
    isHeuristicApplicable(h, capabilities)
  );
  
  // ... rest of matching logic
}

function isHeuristicApplicable(
  heuristic: PMHeuristic,
  capabilities: TelemetryCapabilities
): boolean {
  // Check if heuristic's required metrics are available
  for (const metric of heuristic.applicableMetrics) {
    const category = getMetricCategory(metric);
    if (!capabilities[category]?.available) {
      return false;
    }
  }
  return true;
}
```

#### 3.3 Update Prompt Builders
**File**: `lib/ai/builders/retentionBuilder.ts`

```typescript
export class RetentionPromptBuilder implements IPromptBuilder {
  buildPrompt(context: PromptContext): ComposedPrompt {
    const { summary, capabilities } = context;
    
    // Validate telemetry requirements
    if (!this.validateTelemetryRequirements(capabilities)) {
      return this.buildLimitedPrompt(context);
    }
    
    // ... normal prompt building
  }
  
  private validateTelemetryRequirements(
    capabilities: TelemetryCapabilities
  ): boolean {
    // Retention analysis requires at least session + one engagement metric
    return capabilities.session.available && (
      capabilities.combat.available ||
      capabilities.pickup.available ||
      capabilities.movement.available
    );
  }
  
  private buildLimitedPrompt(context: PromptContext): ComposedPrompt {
    // Build prompt that acknowledges limited data
    const analysisRequest = `
## Limited Data Analysis

The uploaded dataset has limited telemetry. Available categories:
${formatAvailableCategories(context.capabilities)}

Provide retention analysis based ONLY on available data. 
Clearly state which insights cannot be generated due to missing telemetry.
    `;
    
    // ... build rest of prompt
  }
}
```

### Phase 4: Executive Summary Enhancement

#### 4.1 Update Executive Summary Generator
**File**: `lib/legacy/aiSummary.ts`

```typescript
export function generateExecutiveSummary(
  summary: AnalyticsSummary,
  capabilities: TelemetryCapabilities
): ExecutiveSummary {
  const insights: string[] = [];
  const keyFindings: ExecutiveSummary['keyFindings'] = [];
  
  // Only analyze available telemetry
  if (capabilities.combat.available) {
    if (summary.combatTimePercentage > 60) {
      insights.push(
        'Combat-focused players show high engagement...'
      );
      keyFindings.push({
        label: 'Combat Engagement',
        value: `${summary.combatTimePercentage.toFixed(1)}%`,
        trend: 'positive'
      });
    }
  }
  
  if (capabilities.pickup.available) {
    if (summary.pickupEfficiency > 70) {
      insights.push(
        'Collector players demonstrate strong engagement...'
      );
    }
  }
  
  // Add data quality notice if limited
  if (capabilities.datasetQuality === 'partial' || capabilities.datasetQuality === 'minimal') {
    insights.unshift(
      `⚠️ Analysis based on ${capabilities.datasetQuality} dataset. Some insights may be limited due to missing telemetry categories.`
    );
  }
  
  return { insights, keyFindings };
}
```

### Phase 5: UI Components

#### 5.1 Create Dataset Capability Panel
**File**: `components/insights/DatasetCapabilityPanel.tsx`

```tsx
export function DatasetCapabilityPanel({ 
  capabilities 
}: { 
  capabilities: TelemetryCapabilities 
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dataset Capabilities</CardTitle>
        <CardDescription>
          Available telemetry systems in your uploaded data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Available Telemetry */}
          <div>
            <h4 className="font-semibold mb-2">✅ Available Analytics</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(capabilities)
                .filter(([_, status]) => status.available)
                .map(([category, status]) => (
                  <Badge key={category} variant="success">
                    {category} ({status.confidence} confidence)
                  </Badge>
                ))}
            </div>
          </div>
          
          {/* Unavailable Telemetry */}
          <div>
            <h4 className="font-semibold mb-2">⚠️ Unsupported Analytics</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(capabilities)
                .filter(([_, status]) => !status.available)
                .map(([category, _]) => (
                  <Badge key={category} variant="secondary">
                    {category}
                  </Badge>
                ))}
            </div>
          </div>
          
          {/* Recommendations */}
          <Alert>
            <AlertTitle>Data Quality: {getDatasetQuality(capabilities)}</AlertTitle>
            <AlertDescription>
              {getDatasetRecommendations(capabilities)}
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
}
```

#### 5.2 Update InsightsDashboard
**File**: `components/insights/InsightsDashboard.tsx`

Add capability panel at the top:
```tsx
<DatasetCapabilityPanel capabilities={summary.capabilities} />
```

### Phase 6: Orchestrator Updates

#### 6.1 Update Orchestrator
**File**: `lib/ai/orchestrator.ts`

```typescript
export class AIPromptOrchestrator {
  async generatePrompts(
    summary: AnalyticsSummary,
    options?: OrchestrationOptions
  ): Promise<OrchestrationResult> {
    const { capabilities } = summary;
    
    // Validate minimum telemetry requirements
    if (!this.hasMinimumTelemetry(capabilities)) {
      throw new Error(
        'Insufficient telemetry data. At least session data is required for analysis.'
      );
    }
    
    // Filter builders based on available telemetry
    const applicableBuilders = this.filterBuildersByCapabilities(
      this.config.enabledBuilders,
      capabilities
    );
    
    // Generate prompts only for applicable builders
    const prompts: Record<string, ComposedPrompt> = {};
    for (const builderType of applicableBuilders) {
      const prompt = await this.buildPrompt(builderType, {
        ...context,
        capabilities // Pass capabilities to builders
      });
      prompts[builderType] = prompt;
    }
    
    return {
      prompts,
      metadata: {
        ...metadata,
        capabilitySummary: this.generateCapabilitySummary(capabilities)
      }
    };
  }
  
  private filterBuildersByCapabilities(
    builders: string[],
    capabilities: TelemetryCapabilities
  ): string[] {
    return builders.filter(builder => {
      switch (builder) {
        case 'retention':
          return capabilities.session.available;
        case 'monetization':
          return capabilities.monetization.available;
        case 'liveops':
          return capabilities.liveops.available || capabilities.session.available;
        case 'friction':
          return capabilities.combat.available || capabilities.pickup.available;
        case 'segmentation':
          return capabilities.session.available;
        default:
          return true;
      }
    });
  }
}
```

## Implementation Sequence

### Week 1: Foundation
1. ✅ Create type definitions (`types/telemetry-capabilities.ts`)
2. ✅ Implement `DatasetAnalyzer` class
3. ✅ Add unit tests for capability detection
4. ✅ Update `AnalyticsSummary` type

### Week 2: Analytics Engine
5. ✅ Refactor all metric computation functions
6. ✅ Update `generateAnalyticsSummary` with capability detection
7. ✅ Add validation layer
8. ✅ Update tests for conditional metrics

### Week 3: AI Prompt System
9. ✅ Update `promptComposer` with capability awareness
10. ✅ Refactor `heuristicMatcher` to filter by telemetry
11. ✅ Update all prompt builders
12. ✅ Update orchestrator with capability validation

### Week 4: UI & Polish
13. ✅ Create `DatasetCapabilityPanel` component
14. ✅ Update `InsightsDashboard` integration
15. ✅ Update executive summary generation
16. ✅ Add comprehensive error messages
17. ✅ Documentation and migration guide

## Testing Strategy

### Unit Tests
- Capability detection for various dataset schemas
- Metric computation with/without telemetry
- Heuristic filtering based on capabilities
- Prompt generation with limited data

### Integration Tests
- End-to-end CSV upload → capability detection → insights
- Multiple dataset types (combat-only, exploration-only, full)
- Edge cases (empty datasets, single-column datasets)

### Test Datasets
1. **Full Telemetry**: All categories present
2. **Combat Only**: Only kills, deaths, damage
3. **Session Only**: Only sessionId, timestamp, score
4. **Minimal**: Just sessionId
5. **Empty**: No recognizable columns

## Migration Guide

### For Existing Code
1. Update all `generateAnalyticsSummary` calls to handle new structure
2. Update UI components to display capability information
3. Update tests to mock `TelemetryCapabilities`

### Breaking Changes
- `AnalyticsSummary` now includes `capabilities` field
- Metric functions may return `null` instead of `0`
- Prompt builders require `capabilities` in context

## Success Metrics

### Credibility Improvements
- ✅ Zero false insights (no K/D analysis without combat data)
- ✅ 100% transparency on data availability
- ✅ Clear "unavailable" messages for unsupported metrics

### User Experience
- ✅ Users understand what analytics are possible with their data
- ✅ Clear recommendations for improving dataset quality
- ✅ Professional, data-aware executive summaries

### Technical Quality
- ✅ Type-safe capability detection
- ✅ Graceful degradation for partial datasets
- ✅ Comprehensive test coverage (>90%)

## Future Enhancements

1. **Smart Field Mapping**: Auto-detect alternative column names (e.g., "player_kills" → "kills")
2. **Confidence Scoring**: Provide confidence levels for each insight
3. **Dataset Recommendations**: Suggest additional telemetry to collect
4. **Comparative Analysis**: Compare dataset quality across uploads
5. **Custom Telemetry Categories**: Allow users to define custom categories

## Conclusion

This refactoring transforms RetainAI from a blind analytics engine into an **intelligent, data-aware system** that:
- Detects available telemetry before computing metrics
- Validates data availability before generating insights
- Provides transparent reporting on dataset capabilities
- Maintains professional credibility through verified analysis

The result is a more trustworthy, reliable analytics platform that users can confidently use for data-driven decision making.