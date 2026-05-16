/**
 * Shared TypeScript types for analytics and telemetry
 */

export interface TelemetryRow {
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
  [key: string]: any;
}

export interface AnalyticsSummary {
  totalSessions: number;
  averageScore: number;
  averageKills: number;
  averageDeaths: number;
  killDeathRatio: number;
  combatIntensity: number;
  averageDamageDone: number;
  averageEnemiesHit: number;
  combatTimePercentage: number;
  pickupEfficiency: number;
  explorationEngagement: number;
  averageDistanceTraveled: number;
  frictionScore: number;
  highDeathSessions: number;
  lowScoreSessions: number;
  abandonmentRate: number;
  topBehaviors: BehaviorPattern[];
  anomalies: Anomaly[];
}

export interface BehaviorPattern {
  pattern: string;
  description: string;
  frequency: number;
  impact: 'high' | 'medium' | 'low';
}

export interface Anomaly {
  type: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  affectedSessions: number;
}

export interface ExecutiveSummary {
  insights: string[];
  keyFindings: {
    label: string;
    value: string;
    trend: 'positive' | 'negative' | 'neutral';
  }[];
}

// Made with Bob
