/**
 * Telemetry Capability Detection Types
 * 
 * Lightweight type system for detecting and validating available telemetry
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

export interface TelemetryCategoryStatus {
  available: boolean;
  detectedFields: string[];
  missingFields: string[];
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
  available: string[];
  unavailable: string[];
  quality: 'excellent' | 'good' | 'partial' | 'minimal';
  supportedAnalytics: string[];
  unsupportedAnalytics: string[];
  recommendations: string[];
  detectedFieldCount: number;
}

// Made with Bob