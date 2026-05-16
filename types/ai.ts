/**
 * Shared TypeScript types for AI insights and recommendations
 */

export interface RetentionRisk {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  affectedPlayers: string;
  recommendation: string;
}

export interface FrictionPoint {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  metric: string;
  recommendation: string;
}

export interface MonetizationOpportunity {
  title: string;
  description: string;
  playerSegment: string;
  potentialImpact: 'high' | 'medium' | 'low';
  implementation: string;
}

export interface LiveOpsSuggestion {
  title: string;
  description: string;
  type: 'event' | 'challenge' | 'content' | 'balance';
  priority: 'high' | 'medium' | 'low';
  expectedOutcome: string;
}

export interface LiveOpsEventRecommendation {
  eventName: string;
  eventType: 'combat' | 'collection' | 'social' | 'progression' | 'seasonal' | 'challenge';
  targetSegment: string;
  segmentSize: string;
  rewardStructure: {
    primary: string;
    secondary: string[];
    progression: string;
  };
  engagementObjective: string;
  retentionImpact: {
    expectedD1Lift: string;
    expectedD7Lift: string;
    targetMetric: string;
  };
  recommendedCadence: 'daily' | 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly' | 'one-time';
  duration: string;
  monetizationConsiderations: {
    revenueOpportunity: 'high' | 'medium' | 'low';
    monetizationMechanics: string[];
    estimatedARPU: string;
  };
  implementationComplexity: 'low' | 'medium' | 'high';
  resourceRequirements: {
    development: string;
    art: string;
    qa: string;
  };
  kpis: string[];
  risks: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface PlayerInsight {
  segment: string;
  description: string;
  size: string;
  behavior: string;
  needs: string;
}

export interface AIInsights {
  retentionRisks: RetentionRisk[];
  frictionPoints: FrictionPoint[];
  monetizationOpportunities: MonetizationOpportunity[];
  liveOpsSuggestions: LiveOpsSuggestion[];
  playerInsights: PlayerInsight[];
}

export interface AIPromptContext {
  summary: any;
  gameContext?: string;
  focusAreas?: string[];
}

// Made with Bob
