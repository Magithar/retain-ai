/**
 * Gameplay Telemetry Analytics Engine
 *
 * Provides comprehensive analytics functions for gameplay telemetry data.
 * Computes metrics, patterns, and insights from parsed CSV telemetry.
 */

import { DatasetAnalyzer } from './telemetry/datasetAnalyzer';
import { TelemetryCapabilities, DatasetCapabilitySummary } from '@/types/telemetry-capabilities';

export interface TelemetryRow {
  // Normalized ML features (0-1 scale)
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
  
  // Raw gameplay values (preferred when available)
  'rawJson.kills'?: number;
  'rawJson.damage_done'?: number;
  'rawJson.enemies_hit'?: number;
  'rawJson.time_in_combat'?: number;
  'rawJson.distance_traveled'?: number;
  'rawJson.items_collected'?: number;
  'rawJson.pickup_attempts'?: number;
  'rawJson.died'?: boolean;
  
  [key: string]: any; // Allow additional fields
}

export interface AnalyticsSummary {
  // Telemetry capabilities
  capabilities: TelemetryCapabilities;
  capabilitySummary: DatasetCapabilitySummary;
  
  // Basic metrics (nullable when telemetry unavailable)
  totalSessions: number;
  averageScore: number | null;
  averageKills: number | null;
  averageDeaths: number | null;
  killDeathRatio: number | null;
  
  // Combat metrics
  combatIntensity: number | null;
  averageDamageDone: number | null;
  averageEnemiesHit: number | null;
  combatTimePercentage: number | null;
  
  // Engagement metrics
  pickupEfficiency: number | null;
  explorationEngagement: number | null;
  averageDistanceTraveled: number | null;
  
  // Friction indicators
  frictionScore: number;
  highDeathSessions: number;
  lowScoreSessions: number;
  abandonmentRate: number;
  
  // Behavioral patterns
  topBehaviors: BehaviorPattern[];
  anomalies: Anomaly[];
}

export interface BehaviorPattern {
  pattern: string;
  description: string;
  frequency: number;
  impact: 'positive' | 'negative' | 'neutral';
}

export interface Anomaly {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  affectedSessions: number;
}

/**
 * Safe number extraction with fallback
 * Prioritizes rawJson.* columns over normalized features
 */
function safeNumber(value: any, fallback: number = 0): number {
  const num = Number(value);
  return isNaN(num) ? fallback : num;
}

/**
 * Get value from row, prioritizing rawJson columns
 */
function getValue(row: TelemetryRow, normalizedKey: string, rawJsonKey: string): number {
  // Check if rawJson column exists and has a valid value
  if (row[rawJsonKey] !== undefined && row[rawJsonKey] !== null) {
    return safeNumber(row[rawJsonKey]);
  }
  // Fall back to normalized column
  return safeNumber(row[normalizedKey]);
}

/**
 * Calculate average of an array of numbers
 */
function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

/**
 * Calculate median of an array of numbers
 */
function median(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/**
 * Calculate standard deviation
 */
function standardDeviation(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const avg = average(numbers);
  const squareDiffs = numbers.map(n => Math.pow(n - avg, 2));
  return Math.sqrt(average(squareDiffs));
}

/**
 * Compute average telemetry entry score
 */
export function computeAverageScore(data: TelemetryRow[]): number {
  const scores = data.map(row => safeNumber(row.score));
  return average(scores);
}

/**
 * Compute average kills per telemetry entry
 * Uses rawJson.kills if available, falls back to normalized kills
 */
export function computeAverageKills(data: TelemetryRow[]): number {
  const kills = data.map(row => getValue(row, 'kills', 'rawJson.kills'));
  return average(kills);
}

/**
 * Compute average deaths per telemetry entry
 * Uses rawJson.died if available, falls back to normalized deaths
 */
export function computeAverageDeaths(data: TelemetryRow[]): number {
  const deaths = data.map(row => {
    // rawJson.died is boolean, convert to 1 or 0
    if (row['rawJson.died'] !== undefined && row['rawJson.died'] !== null) {
      return row['rawJson.died'] ? 1 : 0;
    }
    return safeNumber(row.deaths);
  });
  return average(deaths);
}

/**
 * Compute kill/death ratio
 * Handles edge cases where deaths are near-zero to prevent inflated ratios
 * Caps maximum K/D at 10.0 for sane display ranges
 */
export function computeKillDeathRatio(data: TelemetryRow[]): number {
  const totalKills = data.reduce((sum, row) => sum + getValue(row, 'kills', 'rawJson.kills'), 0);
  const totalDeaths = data.reduce((sum, row) => {
    if (row['rawJson.died'] !== undefined && row['rawJson.died'] !== null) {
      return sum + (row['rawJson.died'] ? 1 : 0);
    }
    return sum + safeNumber(row.deaths);
  }, 0);
  
  // Clamp death denominator to minimum of 1 to prevent division inflation
  const effectiveDeaths = Math.max(totalDeaths, 1);
  
  // Calculate K/D and cap at 10.0 for sane display ranges
  const kd = totalKills / effectiveDeaths;
  return Math.min(kd, 10);
}

/**
 * Compute combat intensity (damage per combat time)
 * Uses rawJson values when available
 */
export function computeCombatIntensity(data: TelemetryRow[]): number {
  const combatData = data.filter(row => getValue(row, 'timeInCombat', 'rawJson.time_in_combat') > 0);
  if (combatData.length === 0) return 0;
  
  const intensities = combatData.map(row => {
    const damage = getValue(row, 'damageDone', 'rawJson.damage_done');
    const time = getValue(row, 'timeInCombat', 'rawJson.time_in_combat');
    return time > 0 ? damage / time : 0;
  });
  
  return average(intensities);
}

/**
 * Compute pickup efficiency (items collected / pickup attempts)
 * Returns percentage between 0-100, capped at 100%
 * Uses rawJson values when available
 */
export function computePickupEfficiency(data: TelemetryRow[]): number {
  const totalCollected = data.reduce((sum, row) => sum + getValue(row, 'itemsCollected', 'rawJson.items_collected'), 0);
  const totalAttempts = data.reduce((sum, row) => sum + getValue(row, 'pickupAttempts', 'rawJson.pickup_attempts'), 0);
  
  if (totalAttempts === 0) return 0;
  
  const efficiency = (totalCollected / totalAttempts) * 100;
  return Math.min(efficiency, 100);
}

/**
 * Compute exploration engagement (distance traveled / time out of combat)
 * Uses rawJson values when available
 */
export function computeExplorationEngagement(data: TelemetryRow[]): number {
  const explorationData = data.filter(row => safeNumber(row.timeOutOfCombat) > 0);
  if (explorationData.length === 0) return 0;
  
  const engagements = explorationData.map(row => {
    const distance = getValue(row, 'distanceTraveled', 'rawJson.distance_traveled');
    const time = safeNumber(row.timeOutOfCombat);
    return time > 0 ? distance / time : 0;
  });
  
  return average(engagements);
}

/**
 * Compute combat time percentage
 * Uses rawJson values when available
 */
export function computeCombatTimePercentage(data: TelemetryRow[]): number {
  const totalCombatTime = data.reduce((sum, row) => sum + getValue(row, 'timeInCombat', 'rawJson.time_in_combat'), 0);
  const totalTime = data.reduce((sum, row) =>
    sum + getValue(row, 'timeInCombat', 'rawJson.time_in_combat') + safeNumber(row.timeOutOfCombat), 0
  );
  
  return totalTime === 0 ? 0 : (totalCombatTime / totalTime) * 100;
}

/**
 * Compute friction score (0-100, higher = more friction)
 * Uses rawJson values when available
 */
export function computeFrictionScore(data: TelemetryRow[]): number {
  // Use getValue to prioritize rawJson columns
  const deaths = data.map(row => {
    if (row['rawJson.died'] !== undefined && row['rawJson.died'] !== null) {
      return row['rawJson.died'] ? 1 : 0;
    }
    return safeNumber(row.deaths);
  });
  const avgDeaths = average(deaths);
  
  const pickupAttempts = data.map(row => getValue(row, 'pickupAttempts', 'rawJson.pickup_attempts'));
  const itemsCollected = data.map(row => getValue(row, 'itemsCollected', 'rawJson.items_collected'));
  const failedPickups = pickupAttempts.map((attempts, i) =>
    Math.max(0, attempts - itemsCollected[i])
  );
  const avgFailedPickups = average(failedPickups);
  
  const scores = data.map(row => safeNumber(row.score));
  const avgScore = average(scores);
  const lowScoreCount = scores.filter(s => s < avgScore * 0.5).length;
  const lowScoreRate = scores.length > 0 ? (lowScoreCount / scores.length) * 100 : 0;
  
  // Weighted friction score
  const deathFriction = Math.min(avgDeaths * 10, 40);
  const pickupFriction = Math.min(avgFailedPickups * 5, 30);
  const scoreFriction = Math.min(lowScoreRate * 0.3, 30);
  
  return Math.min(deathFriction + pickupFriction + scoreFriction, 100);
}

/**
 * Identify top behavioral patterns
 */
export function identifyBehaviorPatterns(data: TelemetryRow[]): BehaviorPattern[] {
  const patterns: BehaviorPattern[] = [];
  
  // High combat engagement
  const highCombatEntries = data.filter(row =>
    safeNumber(row.timeInCombat) > safeNumber(row.timeOutOfCombat)
  ).length;
  if (highCombatEntries > data.length * 0.3) {
    patterns.push({
      pattern: 'Combat-Focused',
      description: 'Players spend majority of time in combat encounters',
      frequency: (highCombatEntries / data.length) * 100,
      impact: 'positive'
    });
  }
  
  // Exploration-heavy
  const highExplorationEntries = data.filter(row =>
    safeNumber(row.distanceTraveled) > median(data.map(r => safeNumber(r.distanceTraveled))) * 1.5
  ).length;
  if (highExplorationEntries > data.length * 0.25) {
    patterns.push({
      pattern: 'Explorer',
      description: 'Players travel significantly more than average',
      frequency: (highExplorationEntries / data.length) * 100,
      impact: 'positive'
    });
  }
  
  // Item collectors
  const highCollectionEntries = data.filter(row =>
    safeNumber(row.itemsCollected) > median(data.map(r => safeNumber(r.itemsCollected))) * 1.5
  ).length;
  if (highCollectionEntries > data.length * 0.25) {
    patterns.push({
      pattern: 'Collector',
      description: 'Players actively collect items above average',
      frequency: (highCollectionEntries / data.length) * 100,
      impact: 'positive'
    });
  }
  
  // Struggling players
  const highDeathEntries = data.filter(row => safeNumber(row.deaths) > 5).length;
  if (highDeathEntries > data.length * 0.2) {
    patterns.push({
      pattern: 'High Difficulty',
      description: 'Significant portion of players experiencing frequent deaths',
      frequency: (highDeathEntries / data.length) * 100,
      impact: 'negative'
    });
  }
  
  // Low engagement
  const lowEngagementEntries = data.filter(row =>
    safeNumber(row.score) < average(data.map(r => safeNumber(r.score))) * 0.3
  ).length;
  if (lowEngagementEntries > data.length * 0.15) {
    patterns.push({
      pattern: 'Low Engagement',
      description: 'Players achieving significantly below average scores',
      frequency: (lowEngagementEntries / data.length) * 100,
      impact: 'negative'
    });
  }
  
  return patterns.sort((a, b) => b.frequency - a.frequency);
}

/**
 * Detect anomalies in telemetry data
 */
export function detectAnomalies(data: TelemetryRow[]): Anomaly[] {
  const anomalies: Anomaly[] = [];
  
  // Extreme death rates
  const deaths = data.map(row => safeNumber(row.deaths));
  const avgDeaths = average(deaths);
  const stdDeaths = standardDeviation(deaths);
  const extremeDeaths = data.filter(row => 
    safeNumber(row.deaths) > avgDeaths + (2 * stdDeaths)
  ).length;
  
  if (extremeDeaths > data.length * 0.05) {
    anomalies.push({
      type: 'Extreme Death Rate',
      description: `${extremeDeaths} telemetry entries with unusually high death counts`,
      severity: extremeDeaths > data.length * 0.15 ? 'high' : 'medium',
      affectedSessions: extremeDeaths
    });
  }
  
  // Zero engagement sessions
  const zeroScoreEntries = data.filter(row => safeNumber(row.score) === 0).length;
  if (zeroScoreEntries > data.length * 0.1) {
    anomalies.push({
      type: 'Zero Score Sessions',
      description: `${zeroScoreEntries} telemetry entries with no score progression`,
      severity: 'high',
      affectedSessions: zeroScoreEntries
    });
  }
  
  // Pickup failure anomaly
  const pickupEfficiency = computePickupEfficiency(data);
  if (pickupEfficiency < 50) {
    const failedPickupEntries = data.filter(row => {
      const attempts = safeNumber(row.pickupAttempts);
      const collected = safeNumber(row.itemsCollected);
      return attempts > 0 && (collected / attempts) < 0.5;
    }).length;
    
    anomalies.push({
      type: 'Low Pickup Success',
      description: `${pickupEfficiency.toFixed(1)}% pickup efficiency indicates UI/UX issues`,
      severity: pickupEfficiency < 30 ? 'high' : 'medium',
      affectedSessions: failedPickupEntries
    });
  }
  
  // Combat avoidance
  const noCombatEntries = data.filter(row =>
    safeNumber(row.timeInCombat) === 0 && safeNumber(row.kills) === 0
  ).length;
  if (noCombatEntries > data.length * 0.2) {
    anomalies.push({
      type: 'Combat Avoidance',
      description: `${noCombatEntries} telemetry entries with no combat engagement`,
      severity: 'medium',
      affectedSessions: noCombatEntries
    });
  }
  
  return anomalies.sort((a, b) => {
    const severityOrder = { high: 3, medium: 2, low: 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });
}

/**
 * Generate comprehensive analytics summary with capability detection
 */
export function generateAnalyticsSummary(data: TelemetryRow[]): AnalyticsSummary {
  // Detect telemetry capabilities
  const analyzer = new DatasetAnalyzer();
  const capabilities = analyzer.analyzeDataset(data);
  const capabilitySummary = analyzer.generateSummary(capabilities);
  
  if (!data || data.length === 0) {
    return {
      capabilities,
      capabilitySummary,
      totalSessions: 0, // Note: totalSessions represents total telemetry entries
      averageScore: null,
      averageKills: null,
      averageDeaths: null,
      killDeathRatio: null,
      combatIntensity: null,
      averageDamageDone: null,
      averageEnemiesHit: null,
      combatTimePercentage: null,
      pickupEfficiency: null,
      explorationEngagement: null,
      averageDistanceTraveled: null,
      frictionScore: 0,
      highDeathSessions: 0, // High death telemetry entries
      lowScoreSessions: 0, // Low score telemetry entries
      abandonmentRate: 0,
      topBehaviors: [],
      anomalies: []
    };
  }
  
  const scores = data.map(row => safeNumber(row.score));
  const kills = data.map(row => safeNumber(row.kills));
  const deaths = data.map(row => safeNumber(row.deaths));
  const combatTimes = data.map(row => safeNumber(row.timeInCombat));
  
  const avgScore = average(scores);
  const highDeathEntries = capabilities.combat.available
    ? data.filter(row => safeNumber(row.deaths) > 5).length
    : 0;
  const lowScoreEntries = capabilities.session.available
    ? data.filter(row => safeNumber(row.score) < avgScore * 0.3).length
    : 0;
  
  return {
    capabilities,
    capabilitySummary,
    totalSessions: data.length, // Total telemetry entries
    
    // Conditional metrics based on telemetry availability (using rawJson when available)
    averageScore: capabilities.session.available ? avgScore : null,
    averageKills: capabilities.combat.available ? computeAverageKills(data) : null,
    averageDeaths: capabilities.combat.available ? computeAverageDeaths(data) : null,
    killDeathRatio: capabilities.combat.available ? computeKillDeathRatio(data) : null,
    combatIntensity: capabilities.combat.available ? computeCombatIntensity(data) : null,
    averageDamageDone: capabilities.combat.available ? average(data.map(row => getValue(row, 'damageDone', 'rawJson.damage_done'))) : null,
    averageEnemiesHit: capabilities.combat.available ? average(data.map(row => getValue(row, 'enemiesHit', 'rawJson.enemies_hit'))) : null,
    combatTimePercentage: capabilities.combat.available ? computeCombatTimePercentage(data) : null,
    pickupEfficiency: capabilities.pickup.available ? computePickupEfficiency(data) : null,
    explorationEngagement: capabilities.movement.available ? computeExplorationEngagement(data) : null,
    averageDistanceTraveled: capabilities.movement.available ? average(data.map(row => getValue(row, 'distanceTraveled', 'rawJson.distance_traveled'))) : null,
    
    // Friction score uses multiple sources
    frictionScore: computeFrictionScore(data),
    highDeathSessions: highDeathEntries,
    lowScoreSessions: lowScoreEntries,
    abandonmentRate: data.length > 0 ? (lowScoreEntries / data.length) * 100 : 0,
    topBehaviors: identifyBehaviorPatterns(data),
    anomalies: detectAnomalies(data)
  };
}

// Made with Bob
