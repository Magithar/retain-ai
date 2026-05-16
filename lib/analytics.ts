/**
 * Gameplay Telemetry Analytics Engine
 * 
 * Provides comprehensive analytics functions for gameplay telemetry data.
 * Computes metrics, patterns, and insights from parsed CSV telemetry.
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
  [key: string]: any; // Allow additional fields
}

export interface AnalyticsSummary {
  // Basic metrics
  totalSessions: number;
  averageScore: number;
  averageKills: number;
  averageDeaths: number;
  killDeathRatio: number;
  
  // Combat metrics
  combatIntensity: number;
  averageDamageDone: number;
  averageEnemiesHit: number;
  combatTimePercentage: number;
  
  // Engagement metrics
  pickupEfficiency: number;
  explorationEngagement: number;
  averageDistanceTraveled: number;
  
  // Friction indicators
  frictionScore: number;
  highDeathSessions: number;
  lowScoreSessions: number;
  abandonmentRate: number;
  
  // Behavioral patterns
  topBehaviors: BehaviorPattern[];
  anomalies: Anomaly[];
  
  // Distribution data for charts
  scoreDistribution: number[];
  killsDistribution: number[];
  deathsDistribution: number[];
  combatTimeDistribution: number[];
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
 */
function safeNumber(value: any, fallback: number = 0): number {
  const num = Number(value);
  return isNaN(num) ? fallback : num;
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
 * Compute average session score
 */
export function computeAverageScore(data: TelemetryRow[]): number {
  const scores = data.map(row => safeNumber(row.score));
  return average(scores);
}

/**
 * Compute average kills per session
 */
export function computeAverageKills(data: TelemetryRow[]): number {
  const kills = data.map(row => safeNumber(row.kills));
  return average(kills);
}

/**
 * Compute average deaths per session
 */
export function computeAverageDeaths(data: TelemetryRow[]): number {
  const deaths = data.map(row => safeNumber(row.deaths));
  return average(deaths);
}

/**
 * Compute kill/death ratio
 */
export function computeKillDeathRatio(data: TelemetryRow[]): number {
  const totalKills = data.reduce((sum, row) => sum + safeNumber(row.kills), 0);
  const totalDeaths = data.reduce((sum, row) => sum + safeNumber(row.deaths), 0);
  return totalDeaths === 0 ? totalKills : totalKills / totalDeaths;
}

/**
 * Compute combat intensity (damage per combat time)
 */
export function computeCombatIntensity(data: TelemetryRow[]): number {
  const combatData = data.filter(row => safeNumber(row.timeInCombat) > 0);
  if (combatData.length === 0) return 0;
  
  const intensities = combatData.map(row => {
    const damage = safeNumber(row.damageDone);
    const time = safeNumber(row.timeInCombat);
    return time > 0 ? damage / time : 0;
  });
  
  return average(intensities);
}

/**
 * Compute pickup efficiency (items collected / pickup attempts)
 * Returns percentage between 0-100, capped at 100%
 */
export function computePickupEfficiency(data: TelemetryRow[]): number {
  const totalCollected = data.reduce((sum, row) => sum + safeNumber(row.itemsCollected), 0);
  const totalAttempts = data.reduce((sum, row) => sum + safeNumber(row.pickupAttempts), 0);
  
  if (totalAttempts === 0) return 0;
  
  const efficiency = (totalCollected / totalAttempts) * 100;
  return Math.min(efficiency, 100);
}

/**
 * Compute exploration engagement (distance traveled / time out of combat)
 */
export function computeExplorationEngagement(data: TelemetryRow[]): number {
  const explorationData = data.filter(row => safeNumber(row.timeOutOfCombat) > 0);
  if (explorationData.length === 0) return 0;
  
  const engagements = explorationData.map(row => {
    const distance = safeNumber(row.distanceTraveled);
    const time = safeNumber(row.timeOutOfCombat);
    return time > 0 ? distance / time : 0;
  });
  
  return average(engagements);
}

/**
 * Compute combat time percentage
 */
export function computeCombatTimePercentage(data: TelemetryRow[]): number {
  const totalCombatTime = data.reduce((sum, row) => sum + safeNumber(row.timeInCombat), 0);
  const totalTime = data.reduce((sum, row) => 
    sum + safeNumber(row.timeInCombat) + safeNumber(row.timeOutOfCombat), 0
  );
  
  return totalTime === 0 ? 0 : (totalCombatTime / totalTime) * 100;
}

/**
 * Compute friction score (0-100, higher = more friction)
 */
export function computeFrictionScore(data: TelemetryRow[]): number {
  const deaths = data.map(row => safeNumber(row.deaths));
  const avgDeaths = average(deaths);
  
  const pickupAttempts = data.map(row => safeNumber(row.pickupAttempts));
  const itemsCollected = data.map(row => safeNumber(row.itemsCollected));
  const failedPickups = pickupAttempts.map((attempts, i) => 
    Math.max(0, attempts - itemsCollected[i])
  );
  const avgFailedPickups = average(failedPickups);
  
  const scores = data.map(row => safeNumber(row.score));
  const lowScoreCount = scores.filter(s => s < average(scores) * 0.5).length;
  const lowScoreRate = (lowScoreCount / scores.length) * 100;
  
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
  const highCombatSessions = data.filter(row => 
    safeNumber(row.timeInCombat) > safeNumber(row.timeOutOfCombat)
  ).length;
  if (highCombatSessions > data.length * 0.3) {
    patterns.push({
      pattern: 'Combat-Focused',
      description: 'Players spend majority of time in combat encounters',
      frequency: (highCombatSessions / data.length) * 100,
      impact: 'positive'
    });
  }
  
  // Exploration-heavy
  const highExplorationSessions = data.filter(row => 
    safeNumber(row.distanceTraveled) > median(data.map(r => safeNumber(r.distanceTraveled))) * 1.5
  ).length;
  if (highExplorationSessions > data.length * 0.25) {
    patterns.push({
      pattern: 'Explorer',
      description: 'Players travel significantly more than average',
      frequency: (highExplorationSessions / data.length) * 100,
      impact: 'positive'
    });
  }
  
  // Item collectors
  const highCollectionSessions = data.filter(row => 
    safeNumber(row.itemsCollected) > median(data.map(r => safeNumber(r.itemsCollected))) * 1.5
  ).length;
  if (highCollectionSessions > data.length * 0.25) {
    patterns.push({
      pattern: 'Collector',
      description: 'Players actively collect items above average',
      frequency: (highCollectionSessions / data.length) * 100,
      impact: 'positive'
    });
  }
  
  // Struggling players
  const highDeathSessions = data.filter(row => safeNumber(row.deaths) > 5).length;
  if (highDeathSessions > data.length * 0.2) {
    patterns.push({
      pattern: 'High Difficulty',
      description: 'Significant portion of players experiencing frequent deaths',
      frequency: (highDeathSessions / data.length) * 100,
      impact: 'negative'
    });
  }
  
  // Low engagement
  const lowEngagementSessions = data.filter(row => 
    safeNumber(row.score) < average(data.map(r => safeNumber(r.score))) * 0.3
  ).length;
  if (lowEngagementSessions > data.length * 0.15) {
    patterns.push({
      pattern: 'Low Engagement',
      description: 'Players achieving significantly below average scores',
      frequency: (lowEngagementSessions / data.length) * 100,
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
      description: `${extremeDeaths} sessions with unusually high death counts`,
      severity: extremeDeaths > data.length * 0.15 ? 'high' : 'medium',
      affectedSessions: extremeDeaths
    });
  }
  
  // Zero engagement sessions
  const zeroScoreSessions = data.filter(row => safeNumber(row.score) === 0).length;
  if (zeroScoreSessions > data.length * 0.1) {
    anomalies.push({
      type: 'Zero Score Sessions',
      description: `${zeroScoreSessions} sessions with no score progression`,
      severity: 'high',
      affectedSessions: zeroScoreSessions
    });
  }
  
  // Pickup failure anomaly
  const pickupEfficiency = computePickupEfficiency(data);
  if (pickupEfficiency < 50) {
    const failedPickupSessions = data.filter(row => {
      const attempts = safeNumber(row.pickupAttempts);
      const collected = safeNumber(row.itemsCollected);
      return attempts > 0 && (collected / attempts) < 0.5;
    }).length;
    
    anomalies.push({
      type: 'Low Pickup Success',
      description: `${pickupEfficiency.toFixed(1)}% pickup efficiency indicates UI/UX issues`,
      severity: pickupEfficiency < 30 ? 'high' : 'medium',
      affectedSessions: failedPickupSessions
    });
  }
  
  // Combat avoidance
  const noCombatSessions = data.filter(row => 
    safeNumber(row.timeInCombat) === 0 && safeNumber(row.kills) === 0
  ).length;
  if (noCombatSessions > data.length * 0.2) {
    anomalies.push({
      type: 'Combat Avoidance',
      description: `${noCombatSessions} sessions with no combat engagement`,
      severity: 'medium',
      affectedSessions: noCombatSessions
    });
  }
  
  return anomalies.sort((a, b) => {
    const severityOrder = { high: 3, medium: 2, low: 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });
}

/**
 * Generate comprehensive analytics summary
 */
export function generateAnalyticsSummary(data: TelemetryRow[]): AnalyticsSummary {
  if (!data || data.length === 0) {
    return {
      totalSessions: 0,
      averageScore: 0,
      averageKills: 0,
      averageDeaths: 0,
      killDeathRatio: 0,
      combatIntensity: 0,
      averageDamageDone: 0,
      averageEnemiesHit: 0,
      combatTimePercentage: 0,
      pickupEfficiency: 0,
      explorationEngagement: 0,
      averageDistanceTraveled: 0,
      frictionScore: 0,
      highDeathSessions: 0,
      lowScoreSessions: 0,
      abandonmentRate: 0,
      topBehaviors: [],
      anomalies: [],
      scoreDistribution: [],
      killsDistribution: [],
      deathsDistribution: [],
      combatTimeDistribution: []
    };
  }
  
  const scores = data.map(row => safeNumber(row.score));
  const kills = data.map(row => safeNumber(row.kills));
  const deaths = data.map(row => safeNumber(row.deaths));
  const combatTimes = data.map(row => safeNumber(row.timeInCombat));
  
  const avgScore = average(scores);
  const highDeathSessions = data.filter(row => safeNumber(row.deaths) > 5).length;
  const lowScoreSessions = data.filter(row => safeNumber(row.score) < avgScore * 0.3).length;
  
  return {
    totalSessions: data.length,
    averageScore: avgScore,
    averageKills: computeAverageKills(data),
    averageDeaths: computeAverageDeaths(data),
    killDeathRatio: computeKillDeathRatio(data),
    combatIntensity: computeCombatIntensity(data),
    averageDamageDone: average(data.map(row => safeNumber(row.damageDone))),
    averageEnemiesHit: average(data.map(row => safeNumber(row.enemiesHit))),
    combatTimePercentage: computeCombatTimePercentage(data),
    pickupEfficiency: computePickupEfficiency(data),
    explorationEngagement: computeExplorationEngagement(data),
    averageDistanceTraveled: average(data.map(row => safeNumber(row.distanceTraveled))),
    frictionScore: computeFrictionScore(data),
    highDeathSessions,
    lowScoreSessions,
    abandonmentRate: (lowScoreSessions / data.length) * 100,
    topBehaviors: identifyBehaviorPatterns(data),
    anomalies: detectAnomalies(data),
    scoreDistribution: scores,
    killsDistribution: kills,
    deathsDistribution: deaths,
    combatTimeDistribution: combatTimes
  };
}

// Made with Bob
