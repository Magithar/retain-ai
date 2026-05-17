# Telemetry Capability Detection - Implementation Guide

## Quick Start

This guide provides step-by-step instructions for implementing the telemetry capability detection system in RetainAI.

## Prerequisites

- TypeScript 5.0+
- Node.js 18+
- Familiarity with RetainAI codebase structure

## Phase 1: Type Definitions (Day 1)

### Step 1.1: Create Telemetry Capability Types

Create `types/telemetry-capabilities.ts`:

```typescript
/**
 * Telemetry Capability Detection Types
 * 
 * Defines types for detecting and validating available telemetry
 * categories in uploaded datasets.
 */

export enum TelemetryCategory {
  COMBAT = 'combat',
  MONETIZATION = 'monetization',
  SESSION = 'session',
  ACHIEVEMENT = 'achievement',
  PROGRESSION = 'progression',
  LIVEOPS = 'liveops',
  MOVEMENT = 'movement',
  PICKUP = 'pickup'
}

export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type DatasetQuality = 'excellent' | 'good' | 'partial' | 'minimal';

export interface TelemetryCategoryStatus {
  available: boolean;
  confidence: ConfidenceLevel;
  detectedFields: string[];
  missingFields: string[];
  requiredFields: string[];
}

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

export interface DatasetCapabilitySummary {
  capabilities: TelemetryCapabilities;
  overallQuality: DatasetQuality;
  supportedAnalytics: string[];
  unsupportedAnalytics: string[];
  recommendations: string[];
  detectedFieldCount: number;
  totalRequiredFields: number;
}

export interface TelemetryFieldMapping {
  category: TelemetryCategory;
  requiredFields: string[];
  optionalFields: string[];
  alternativeNames: Record<string, string[]>;
}
```

### Step 1.2: Update Analytics Types

Update `types/analytics.ts`:

```typescript
import { TelemetryCapabilities, DatasetQuality } from './telemetry-capabilities';

export interface AnalyticsSummary {
  // Existing metrics (now nullable)
  totalSessions: number;
  averageScore: number | null;
  averageKills: number | null;
  averageDeaths: number | null;
  killDeathRatio: number | null;
  combatIntensity: number | null;
  averageDamageDone: number | null;
  averageEnemiesHit: number | null;
  combatTimePercentage: number | null;
  pickupEfficiency: number | null;
  explorationEngagement: number | null;
  averageDistanceTraveled: number | null;
  frictionScore: number;
  highDeathSessions: number;
  lowScoreSessions: number;
  abandonmentRate: number;
  topBehaviors: BehaviorPattern[];
  anomalies: Anomaly[];
  
  // NEW: Capability metadata
  capabilities: TelemetryCapabilities;
  datasetQuality: DatasetQuality;
  metricsAvailable: {
    combat: boolean;
    pickup: boolean;
    movement: boolean;
    monetization: boolean;
    session: boolean;
    achievement: boolean;
    progression: boolean;
    liveops: boolean;
  };
  
  // Distribution data (now optional)
  scoreDistribution?: number[];
  killsDistribution?: number[];
  deathsDistribution?: number[];
  combatTimeDistribution?: number[];
}
```

## Phase 2: Dataset Analyzer (Days 2-3)

### Step 2.1: Create Field Mappings

Create `lib/telemetry/fieldMappings.ts`:

```typescript
import { TelemetryCategory, TelemetryFieldMapping } from '@/types/telemetry-capabilities';

export const TELEMETRY_FIELD_MAPPINGS: TelemetryFieldMapping[] = [
  {
    category: TelemetryCategory.COMBAT,
    requiredFields: ['kills', 'deaths'],
    optionalFields: ['damageDone', 'enemiesHit', 'timeInCombat', 'damageReceived'],
    alternativeNames: {
      kills: ['player_kills', 'total_kills', 'kill_count', 'eliminations'],
      deaths: ['player_deaths', 'total_deaths', 'death_count'],
      damageDone: ['damage_dealt', 'total_damage', 'damage_output'],
      enemiesHit: ['enemies_hit', 'hit_count', 'successful_hits']
    }
  },
  {
    category: TelemetryCategory.PICKUP,
    requiredFields: ['itemsCollected', 'pickupAttempts'],
    optionalFields: ['timeNearInteractables', 'pickupSuccessRate'],
    alternativeNames: {
      itemsCollected: ['items_collected', 'collected_items', 'pickup_count'],
      pickupAttempts: ['pickup_attempts', 'interaction_attempts', 'pickup_tries']
    }
  },
  {
    category: TelemetryCategory.MOVEMENT,
    requiredFields: ['distanceTraveled'],
    optionalFields: ['velocity', 'positionX', 'positionY', 'positionZ', 'timeOutOfCombat'],
    alternativeNames: {
      distanceTraveled: ['distance_traveled', 'total_distance', 'movement_distance']
    }
  },
  {
    category: TelemetryCategory.SESSION,
    requiredFields: ['sessionId'],
    optionalFields: ['timestamp', 'duration', 'score', 'playerId'],
    alternativeNames: {
      sessionId: ['session_id', 'id', 'game_session_id'],
      timestamp: ['time', 'datetime', 'created_at', 'session_start']
    }
  },
  {
    category: TelemetryCategory.MONETIZATION,
    requiredFields: ['revenue', 'purchases'],
    optionalFields: ['currency', 'transactionId', 'itemPurchased'],
    alternativeNames: {
      revenue: ['total_revenue', 'purchase_amount', 'spend'],
      purchases: ['purchase_count', 'transaction_count', 'buy_count']
    }
  },
  {
    category: TelemetryCategory.ACHIEVEMENT,
    requiredFields: ['achievementId'],
    optionalFields: ['achievementName', 'unlockTime', 'progress'],
    alternativeNames: {
      achievementId: ['achievement_id', 'achievement', 'trophy_id']
    }
  },
  {
    category: TelemetryCategory.PROGRESSION,
    requiredFields: ['level'],
    optionalFields: ['xp', 'experience', 'rank', 'unlocks'],
    alternativeNames: {
      level: ['player_level', 'current_level', 'lvl'],
      xp: ['experience', 'experience_points', 'exp']
    }
  },
  {
    category: TelemetryCategory.LIVEOPS,
    requiredFields: ['eventId'],
    optionalFields: ['eventName', 'eventType', 'participation', 'rewards'],
    alternativeNames: {
      eventId: ['event_id', 'challenge_id', 'activity_id']
    }
  }
];

export function findFieldMatch(
  headers: string[],
  fieldName: string,
  alternatives: string[]
): string | null {
  const normalizedHeaders = headers.map(h => h.toLowerCase().trim());
  
  // Check exact match
  if (normalizedHeaders.includes(fieldName.toLowerCase())) {
    return headers[normalizedHeaders.indexOf(fieldName.toLowerCase())];
  }
  
  // Check alternatives
  for (const alt of alternatives) {
    if (normalizedHeaders.includes(alt.toLowerCase())) {
      return headers[normalizedHeaders.indexOf(alt.toLowerCase())];
    }
  }
  
  return null;
}
```

### Step 2.2: Implement Dataset Analyzer

Create `lib/telemetry/datasetAnalyzer.ts`:

```typescript
import { TelemetryRow } from '@/types/analytics';
import {
  TelemetryCapabilities,
  TelemetryCategoryStatus,
  DatasetCapabilitySummary,
  TelemetryCategory,
  DatasetQuality,
  ConfidenceLevel
} from '@/types/telemetry-capabilities';
import { TELEMETRY_FIELD_MAPPINGS, findFieldMatch } from './fieldMappings';

export class DatasetAnalyzer {
  private headers: string[] = [];
  private sampleData: TelemetryRow[] = [];
  
  /**
   * Analyze dataset to detect available telemetry capabilities
   */
  analyzeDataset(data: TelemetryRow[]): TelemetryCapabilities {
    if (!data || data.length === 0) {
      return this.createEmptyCapabilities();
    }
    
    // Extract headers from first row
    this.headers = Object.keys(data[0]);
    this.sampleData = data.slice(0, Math.min(100, data.length));
    
    const capabilities: TelemetryCapabilities = {
      combat: this.analyzeCombatTelemetry(),
      monetization: this.analyzeMonetizationTelemetry(),
      session: this.analyzeSessionTelemetry(),
      achievement: this.analyzeAchievementTelemetry(),
      progression: this.analyzeProgressionTelemetry(),
      liveops: this.analyzeLiveOpsTelemetry(),
      movement: this.analyzeMovementTelemetry(),
      pickup: this.analyzePickupTelemetry()
    };
    
    return capabilities;
  }
  
  /**
   * Analyze specific telemetry category
   */
  private analyzeCategory(category: TelemetryCategory): TelemetryCategoryStatus {
    const mapping = TELEMETRY_FIELD_MAPPINGS.find(m => m.category === category);
    if (!mapping) {
      return this.createUnavailableStatus([]);
    }
    
    const detectedFields: string[] = [];
    const missingFields: string[] = [];
    
    // Check required fields
    for (const field of mapping.requiredFields) {
      const alternatives = mapping.alternativeNames[field] || [];
      const match = findFieldMatch(this.headers, field, alternatives);
      
      if (match) {
        detectedFields.push(match);
      } else {
        missingFields.push(field);
      }
    }
    
    // Check optional fields
    for (const field of mapping.optionalFields) {
      const alternatives = mapping.alternativeNames[field] || [];
      const match = findFieldMatch(this.headers, field, alternatives);
      
      if (match) {
        detectedFields.push(match);
      }
    }
    
    // Determine availability and confidence
    const requiredFieldsFound = mapping.requiredFields.length - missingFields.length;
    const available = requiredFieldsFound > 0;
    const confidence = this.calculateConfidence(
      requiredFieldsFound,
      mapping.requiredFields.length,
      detectedFields.length
    );
    
    return {
      available,
      confidence,
      detectedFields,
      missingFields,
      requiredFields: mapping.requiredFields
    };
  }
  
  private analyzeCombatTelemetry(): TelemetryCategoryStatus {
    return this.analyzeCategory(TelemetryCategory.COMBAT);
  }
  
  private analyzePickupTelemetry(): TelemetryCategoryStatus {
    return this.analyzeCategory(TelemetryCategory.PICKUP);
  }
  
  private analyzeMovementTelemetry(): TelemetryCategoryStatus {
    return this.analyzeCategory(TelemetryCategory.MOVEMENT);
  }
  
  private analyzeSessionTelemetry(): TelemetryCategoryStatus {
    return this.analyzeCategory(TelemetryCategory.SESSION);
  }
  
  private analyzeMonetizationTelemetry(): TelemetryCategoryStatus {
    return this.analyzeCategory(TelemetryCategory.MONETIZATION);
  }
  
  private analyzeAchievementTelemetry(): TelemetryCategoryStatus {
    return this.analyzeCategory(TelemetryCategory.ACHIEVEMENT);
  }
  
  private analyzeProgressionTelemetry(): TelemetryCategoryStatus {
    return this.analyzeCategory(TelemetryCategory.PROGRESSION);
  }
  
  private analyzeLiveOpsTelemetry(): TelemetryCategoryStatus {
    return this.analyzeCategory(TelemetryCategory.LIVEOPS);
  }
  
  /**
   * Calculate confidence level based on detected fields
   */
  private calculateConfidence(
    requiredFound: number,
    requiredTotal: number,
    totalDetected: number
  ): ConfidenceLevel {
    if (requiredFound === requiredTotal && totalDetected >= requiredTotal + 2) {
      return 'high';
    }
    if (requiredFound === requiredTotal) {
      return 'medium';
    }
    if (requiredFound > 0) {
      return 'low';
    }
    return 'low';
  }
  
  /**
   * Generate comprehensive capability summary
   */
  generateCapabilitySummary(capabilities: TelemetryCapabilities): DatasetCapabilitySummary {
    const supportedAnalytics: string[] = [];
    const unsupportedAnalytics: string[] = [];
    let detectedFieldCount = 0;
    let totalRequiredFields = 0;
    
    for (const [category, status] of Object.entries(capabilities)) {
      detectedFieldCount += status.detectedFields.length;
      totalRequiredFields += status.requiredFields.length;
      
      if (status.available) {
        supportedAnalytics.push(category);
      } else {
        unsupportedAnalytics.push(category);
      }
    }
    
    const overallQuality = this.calculateDatasetQuality(capabilities);
    const recommendations = this.generateRecommendations(capabilities);
    
    return {
      capabilities,
      overallQuality,
      supportedAnalytics,
      unsupportedAnalytics,
      recommendations,
      detectedFieldCount,
      totalRequiredFields
    };
  }
  
  /**
   * Calculate overall dataset quality
   */
  private calculateDatasetQuality(capabilities: TelemetryCapabilities): DatasetQuality {
    const categories = Object.values(capabilities);
    const available = categories.filter(c => c.available).length;
    const highConfidence = categories.filter(c => c.confidence === 'high').length;
    
    if (available >= 6 && highConfidence >= 4) return 'excellent';
    if (available >= 4 && highConfidence >= 2) return 'good';
    if (available >= 2) return 'partial';
    return 'minimal';
  }
  
  /**
   * Generate recommendations for improving dataset
   */
  private generateRecommendations(capabilities: TelemetryCapabilities): string[] {
    const recommendations: string[] = [];
    
    if (!capabilities.session.available) {
      recommendations.push('Add session tracking (sessionId, timestamp) for better analytics');
    }
    
    if (!capabilities.combat.available) {
      recommendations.push('Include combat metrics (kills, deaths, damage) for engagement analysis');
    }
    
    if (!capabilities.monetization.available) {
      recommendations.push('Track monetization data (purchases, revenue) for business insights');
    }
    
    if (capabilities.combat.confidence === 'low') {
      recommendations.push('Improve combat telemetry by adding damage and time-in-combat metrics');
    }
    
    return recommendations;
  }
  
  private createEmptyCapabilities(): TelemetryCapabilities {
    const emptyStatus = this.createUnavailableStatus([]);
    return {
      combat: emptyStatus,
      monetization: emptyStatus,
      session: emptyStatus,
      achievement: emptyStatus,
      progression: emptyStatus,
      liveops: emptyStatus,
      movement: emptyStatus,
      pickup: emptyStatus
    };
  }
  
  private createUnavailableStatus(requiredFields: string[]): TelemetryCategoryStatus {
    return {
      available: false,
      confidence: 'low',
      detectedFields: [],
      missingFields: requiredFields,
      requiredFields
    };
  }
}
```

## Phase 3: Analytics Engine Refactoring (Days 4-5)

### Step 3.1: Update Metric Functions

Update `lib/analytics.ts`:

```typescript
import { DatasetAnalyzer } from './telemetry/datasetAnalyzer';
import { TelemetryCapabilities } from '@/types/telemetry-capabilities';

/**
 * Compute K/D ratio with telemetry validation
 */
export function computeKillDeathRatio(
  data: TelemetryRow[],
  capabilities: TelemetryCapabilities
): number | null {
  if (!capabilities.combat.available) {
    return null;
  }
  
  const totalKills = data.reduce((sum, row) => sum + safeNumber(row.kills), 0);
  const totalDeaths = data.reduce((sum, row) => sum + safeNumber(row.deaths), 0);
  return totalDeaths === 0 ? totalKills : totalKills / totalDeaths;
}

/**
 * Compute pickup efficiency with telemetry validation
 */
export function computePickupEfficiency(
  data: TelemetryRow[],
  capabilities: TelemetryCapabilities
): number | null {
  if (!capabilities.pickup.available) {
    return null;
  }
  
  const totalCollected = data.reduce((sum, row) => sum + safeNumber(row.itemsCollected), 0);
  const totalAttempts = data.reduce((sum, row) => sum + safeNumber(row.pickupAttempts), 0);
  
  if (totalAttempts === 0) return null;
  
  const efficiency = (totalCollected / totalAttempts) * 100;
  return Math.min(efficiency, 100);
}

// Update all other metric functions similarly...

/**
 * Generate analytics summary with capability detection
 */
export function generateAnalyticsSummary(data: TelemetryRow[]): AnalyticsSummary {
  if (!data || data.length === 0) {
    return createEmptySummary();
  }
  
  // Step 1: Detect capabilities
  const analyzer = new DatasetAnalyzer();
  const capabilities = analyzer.analyzeDataset(data);
  const capabilitySummary = analyzer.generateCapabilitySummary(capabilities);
  
  // Step 2: Compute metrics conditionally
  const summary: AnalyticsSummary = {
    totalSessions: data.length,
    capabilities,
    datasetQuality: capabilitySummary.overallQuality,
    
    // Conditional metrics
    averageScore: capabilities.session.available ? computeAverageScore(data) : null,
    averageKills: capabilities.combat.available ? computeAverageKills(data) : null,
    averageDeaths: capabilities.combat.available ? computeAverageDeaths(data) : null,
    killDeathRatio: computeKillDeathRatio(data, capabilities),
    combatIntensity: capabilities.combat.available ? computeCombatIntensity(data) : null,
    pickupEfficiency: computePickupEfficiency(data, capabilities),
    explorationEngagement: capabilities.movement.available ? computeExplorationEngagement(data) : null,
    
    // Always compute friction (uses multiple sources)
    frictionScore: computeFrictionScore(data, capabilities),
    
    // Metrics availability flags
    metricsAvailable: {
      combat: capabilities.combat.available,
      pickup: capabilities.pickup.available,
      movement: capabilities.movement.available,
      monetization: capabilities.monetization.available,
      session: capabilities.session.available,
      achievement: capabilities.achievement.available,
      progression: capabilities.progression.available,
      liveops: capabilities.liveops.available
    },
    
    // ... rest of metrics
  };
  
  return summary;
}
```

## Testing Checklist

### Unit Tests
- [ ] Capability detection for each telemetry category
- [ ] Field matching with alternative names
- [ ] Confidence level calculation
- [ ] Dataset quality assessment
- [ ] Metric computation with/without telemetry
- [ ] Null handling in all metric functions

### Integration Tests
- [ ] Full CSV upload → capability detection → insights
- [ ] Combat-only dataset
- [ ] Session-only dataset
- [ ] Full telemetry dataset
- [ ] Empty dataset
- [ ] Malformed dataset

### UI Tests
- [ ] Capability panel rendering
- [ ] Available/unavailable badge display
- [ ] Quality alert messages
- [ ] Conditional chart rendering
- [ ] Executive summary filtering

## Migration Checklist

### Code Changes
- [ ] Create `types/telemetry-capabilities.ts`
- [ ] Update `types/analytics.ts`
- [ ] Create `lib/telemetry/fieldMappings.ts`
- [ ] Create `lib/telemetry/datasetAnalyzer.ts`
- [ ] Update all metric functions in `lib/analytics.ts`
- [ ] Update `generateAnalyticsSummary` function
- [ ] Update `lib/ai/utils/promptComposer.ts`
- [ ] Update `lib/ai/utils/heuristicMatcher.ts`
- [ ] Update all prompt builders
- [ ] Update `lib/ai/orchestrator.ts`
- [ ] Update `lib/legacy/aiSummary.ts`
- [ ] Create `components/insights/DatasetCapabilityPanel.tsx`
- [ ] Update `components/insights/InsightsDashboard.tsx`

### Testing
- [ ] Write unit tests for DatasetAnalyzer
- [ ] Write unit tests for updated metric functions
- [ ] Write integration tests for full pipeline
- [ ] Manual testing with various datasets
- [ ] Performance testing with large datasets

### Documentation
- [ ] Update API documentation
- [ ] Create user guide for capability panel
- [ ] Document field mapping system
- [ ] Create troubleshooting guide
- [ ] Update README with new features

## Rollout Plan

### Phase 1: Internal Testing (Week 1)
- Deploy to staging environment
- Test with internal datasets
- Gather feedback from team
- Fix critical bugs

### Phase 2: Beta Release (Week 2)
- Deploy to beta users
- Monitor error rates
- Collect user feedback
- Iterate on UI/UX

### Phase 3: Production Release (Week 3)
- Deploy to production
- Monitor performance metrics
- Provide user support
- Document lessons learned

## Success Metrics

- [ ] Zero false insights generated
- [ ] 100% transparency on data availability
- [ ] <100ms capability detection time
- [ ] >90% test coverage
- [ ] Positive user feedback on clarity
- [ ] Reduced support tickets about "wrong insights"

## Support Resources

- Technical documentation: `/docs/TELEMETRY_CAPABILITY_REFACTOR_PLAN.md`
- Architecture diagrams: `/docs/TELEMETRY_ARCHITECTURE_DIAGRAM.md`
- Implementation guide: `/docs/IMPLEMENTATION_GUIDE.md` (this file)
- Code examples: `/lib/ai/examples/`