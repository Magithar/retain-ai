/**
 * Shared TypeScript types for analytics and telemetry
 */

import { TelemetryCapabilities, DatasetCapabilitySummary } from './telemetry-capabilities';

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
  // Telemetry capabilities
  capabilities: TelemetryCapabilities;
  capabilitySummary: DatasetCapabilitySummary;
  
  // Core metrics (now nullable when telemetry unavailable)
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
