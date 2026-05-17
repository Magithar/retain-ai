/**
 * Achievement Telemetry Analytics Engine
 * 
 * Analyzes achievement-based player progression, leaderboard engagement,
 * archetype distribution, and seasonal retention patterns.
 */

import {
  AchievementTelemetryRow,
  AchievementAnalyticsSummary,
  ArchetypeDistribution,
  MilestoneData,
  AchievementBehaviorPattern,
  ProgressionAnomaly,
  LiveOpsSignal
} from '@/types/achievement-analytics';

// ============================================================================
// Utility Functions
// ============================================================================

function safeNumber(value: any, fallback: number = 0): number {
  const num = Number(value);
  return isNaN(num) ? fallback : num;
}

function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

function median(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function standardDeviation(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const avg = average(numbers);
  const squareDiffs = numbers.map(n => Math.pow(n - avg, 2));
  return Math.sqrt(average(squareDiffs));
}

function calculatePercentage(part: number, total: number): number {
  return total === 0 ? 0 : (part / total) * 100;
}

// ============================================================================
// Archetype Analysis
// ============================================================================

export function analyzeArchetypeDistribution(data: AchievementTelemetryRow[]): ArchetypeDistribution {
  const distribution: ArchetypeDistribution = {
    achiever: 0,
    explorer: 0,
    socializer: 0,
    competitor: 0,
    collector: 0,
    casual: 0
  };
  
  if (data.length === 0) return distribution;
  
  data.forEach(row => {
    const archetype = row.playerArchetype?.toLowerCase();
    if (archetype && archetype in distribution) {
      distribution[archetype as keyof ArchetypeDistribution]++;
    }
  });
  
  // Convert to percentages
  Object.keys(distribution).forEach(key => {
    distribution[key as keyof ArchetypeDistribution] = 
      calculatePercentage(distribution[key as keyof ArchetypeDistribution], data.length);
  });
  
  return distribution;
}

export function calculateArchetypeDiversity(distribution: ArchetypeDistribution): number {
  // Shannon diversity index adapted for archetypes
  const values = Object.values(distribution).filter(v => v > 0);
  if (values.length === 0) return 0;
  
  const entropy = values.reduce((sum, p) => {
    const proportion = p / 100;
    return sum - (proportion * Math.log(proportion));
  }, 0);
  
  // Normalize to 0-100 scale
  const maxEntropy = Math.log(6); // 6 archetype categories
  return (entropy / maxEntropy) * 100;
}

// ============================================================================
// Leaderboard Analysis
// ============================================================================

export function analyzeLeaderboardEngagement(data: AchievementTelemetryRow[]): {
  participation: number;
  averageRank: number;
  topTierPlayers: number;
  churn: number;
} {
  const playersWithRank = data.filter(row => 
    row.leaderboardRank !== undefined && row.leaderboardRank > 0
  );
  
  const participation = calculatePercentage(playersWithRank.length, data.length);
  
  const ranks = playersWithRank.map(row => safeNumber(row.leaderboardRank));
  const averageRank = average(ranks);
  
  // Top 10% threshold (assuming rank 1 is best)
  const maxRank = Math.max(...ranks, 100);
  const topTierThreshold = maxRank * 0.1;
  const topTierPlayers = playersWithRank.filter(row => 
    safeNumber(row.leaderboardRank) <= topTierThreshold
  ).length;
  
  // Calculate rank volatility (churn)
  const rankChanges = data
    .filter(row => row.rankChange !== undefined)
    .map(row => Math.abs(safeNumber(row.rankChange)));
  const churn = average(rankChanges);
  
  return {
    participation,
    averageRank,
    topTierPlayers,
    churn
  };
}

// ============================================================================
// Milestone Analysis
// ============================================================================

export function analyzeMilestones(data: AchievementTelemetryRow[]): {
  averageCompletion: number;
  completionRate: number;
  stuckMilestones: MilestoneData[];
  popularMilestones: MilestoneData[];
} {
  const milestoneMap = new Map<string, {
    total: number;
    completed: number;
    progress: number[];
    times: number[];
  }>();
  
  data.forEach(row => {
    if (!row.milestoneId) return;
    
    if (!milestoneMap.has(row.milestoneId)) {
      milestoneMap.set(row.milestoneId, {
        total: 0,
        completed: 0,
        progress: [],
        times: []
      });
    }
    
    const milestone = milestoneMap.get(row.milestoneId)!;
    milestone.total++;
    
    if (row.milestoneCompleted) {
      milestone.completed++;
    }
    
    if (row.milestoneProgress !== undefined) {
      milestone.progress.push(safeNumber(row.milestoneProgress));
    }
    
    if (row.completionTime !== undefined) {
      milestone.times.push(safeNumber(row.completionTime));
    }
  });
  
  const milestones: MilestoneData[] = Array.from(milestoneMap.entries()).map(([id, stats]) => ({
    milestoneId: id,
    milestoneName: data.find(r => r.milestoneId === id)?.milestoneName || id,
    completionRate: calculatePercentage(stats.completed, stats.total),
    averageAttempts: stats.total,
    stuckPlayerCount: stats.total - stats.completed,
    averageCompletionTime: average(stats.times)
  }));
  
  const averageCompletion = average(milestones.map(m => m.completionRate));
  const completionRate = calculatePercentage(
    milestones.reduce((sum, m) => sum + m.completionRate, 0),
    milestones.length * 100
  );
  
  // Stuck milestones: low completion rate (<30%)
  const stuckMilestones = milestones
    .filter(m => m.completionRate < 30)
    .sort((a, b) => a.completionRate - b.completionRate)
    .slice(0, 5);
  
  // Popular milestones: high completion rate (>70%)
  const popularMilestones = milestones
    .filter(m => m.completionRate > 70)
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 5);
  
  return {
    averageCompletion,
    completionRate,
    stuckMilestones,
    popularMilestones
  };
}

// ============================================================================
// Seasonal Progression Analysis
// ============================================================================

export function analyzeSeasonalProgression(data: AchievementTelemetryRow[]): {
  participation: number;
  averageLevel: number;
  passConversion: number;
  retention: number;
} {
  const seasonalPlayers = data.filter(row => row.seasonId !== undefined);
  const participation = calculatePercentage(seasonalPlayers.length, data.length);
  
  const levels = seasonalPlayers.map(row => safeNumber(row.seasonLevel));
  const averageLevel = average(levels);
  
  const withPass = seasonalPlayers.filter(row => row.seasonPassActive === true).length;
  const passConversion = calculatePercentage(withPass, seasonalPlayers.length);
  
  // Retention: players with weekly active status
  const activeCount = seasonalPlayers.filter(row => row.weeklyActiveStatus === true).length;
  const retention = calculatePercentage(activeCount, seasonalPlayers.length);
  
  return {
    participation,
    averageLevel,
    passConversion,
    retention
  };
}

// ============================================================================
// Progression Pacing Analysis
// ============================================================================

export function analyzeProgressionPacing(data: AchievementTelemetryRow[]): {
  velocity: number;
  fastTrackers: number;
  slowProgressors: number;
  completionTimes: number[];
} {
  const progressData = data.filter(row => row.progressPercentage !== undefined);
  const progress = progressData.map(row => safeNumber(row.progressPercentage));
  
  const avgProgress = average(progress);
  const velocity = avgProgress; // Progress per session (can be adjusted for time-based)
  
  // Fast trackers: >2x average progress
  const fastTrackers = progressData.filter(row => 
    safeNumber(row.progressPercentage) > avgProgress * 2
  ).length;
  
  // Slow progressors: <0.5x average progress
  const slowProgressors = progressData.filter(row => 
    safeNumber(row.progressPercentage) < avgProgress * 0.5 && 
    safeNumber(row.progressPercentage) > 0
  ).length;
  
  const completionTimes = data
    .filter(row => row.completionTime !== undefined)
    .map(row => safeNumber(row.completionTime));
  
  return {
    velocity,
    fastTrackers,
    slowProgressors,
    completionTimes
  };
}

// ============================================================================
// Engagement Pattern Analysis
// ============================================================================

export function analyzeEngagementPatterns(data: AchievementTelemetryRow[]): {
  dailyLoginRate: number;
  averageStreak: number;
  weeklyActiveRate: number;
  trend: 'increasing' | 'stable' | 'declining';
} {
  const streaks = data
    .filter(row => row.dailyLoginStreak !== undefined)
    .map(row => safeNumber(row.dailyLoginStreak));
  
  const averageStreak = average(streaks);
  const dailyLoginRate = calculatePercentage(
    streaks.filter(s => s > 0).length,
    data.length
  );
  
  const weeklyActive = data.filter(row => row.weeklyActiveStatus === true).length;
  const weeklyActiveRate = calculatePercentage(weeklyActive, data.length);
  
  // Determine trend based on streak distribution
  const highStreaks = streaks.filter(s => s > 7).length;
  const lowStreaks = streaks.filter(s => s > 0 && s <= 3).length;
  
  let trend: 'increasing' | 'stable' | 'declining' = 'stable';
  if (highStreaks > lowStreaks * 1.5) {
    trend = 'increasing';
  } else if (lowStreaks > highStreaks * 1.5) {
    trend = 'declining';
  }
  
  return {
    dailyLoginRate,
    averageStreak,
    weeklyActiveRate,
    trend
  };
}

// ============================================================================
// Behavioral Pattern Detection
// ============================================================================

export function detectBehavioralPatterns(
  data: AchievementTelemetryRow[],
  archetypeDistribution: ArchetypeDistribution
): AchievementBehaviorPattern[] {
  const patterns: AchievementBehaviorPattern[] = [];
  
  // Competitive leaderboard climbers
  const leaderboardActive = data.filter(row => 
    row.leaderboardRank !== undefined && row.leaderboardRank > 0
  ).length;
  const leaderboardPercentage = calculatePercentage(leaderboardActive, data.length);
  
  if (leaderboardPercentage > 40) {
    patterns.push({
      pattern: 'Leaderboard Climbers',
      description: 'High percentage of players actively competing on leaderboards',
      playerPercentage: leaderboardPercentage,
      archetypeAlignment: 'competitor',
      engagementLevel: 'high',
      retentionImpact: 'positive'
    });
  }
  
  // Achievement completionists
  const completionists = data.filter(row => 
    row.progressPercentage !== undefined && safeNumber(row.progressPercentage) > 80
  ).length;
  const completionistPercentage = calculatePercentage(completionists, data.length);
  
  if (completionistPercentage > 25) {
    patterns.push({
      pattern: 'Achievement Completionists',
      description: 'Players focused on 100% achievement completion',
      playerPercentage: completionistPercentage,
      archetypeAlignment: 'achiever',
      engagementLevel: 'high',
      retentionImpact: 'positive'
    });
  }
  
  // Seasonal grinders
  const seasonalActive = data.filter(row => 
    row.seasonLevel !== undefined && safeNumber(row.seasonLevel) > 20
  ).length;
  const seasonalPercentage = calculatePercentage(seasonalActive, data.length);
  
  if (seasonalPercentage > 30) {
    patterns.push({
      pattern: 'Seasonal Grinders',
      description: 'Players heavily invested in seasonal progression systems',
      playerPercentage: seasonalPercentage,
      archetypeAlignment: 'achiever',
      engagementLevel: 'high',
      retentionImpact: 'positive'
    });
  }
  
  // Casual participants
  const casualPlayers = data.filter(row => 
    row.dailyLoginStreak !== undefined && 
    safeNumber(row.dailyLoginStreak) < 3 &&
    safeNumber(row.progressPercentage) < 30
  ).length;
  const casualPercentage = calculatePercentage(casualPlayers, data.length);
  
  if (casualPercentage > 35) {
    patterns.push({
      pattern: 'Casual Participants',
      description: 'Players with low engagement and minimal progression',
      playerPercentage: casualPercentage,
      archetypeAlignment: 'casual',
      engagementLevel: 'low',
      retentionImpact: 'neutral'
    });
  }
  
  // Milestone stuck players
  const stuckPlayers = data.filter(row => 
    row.milestoneProgress !== undefined &&
    safeNumber(row.milestoneProgress) > 0 &&
    safeNumber(row.milestoneProgress) < 50 &&
    !row.milestoneCompleted
  ).length;
  const stuckPercentage = calculatePercentage(stuckPlayers, data.length);
  
  if (stuckPercentage > 20) {
    patterns.push({
      pattern: 'Milestone Blocked',
      description: 'Players stuck on challenging milestones without completion',
      playerPercentage: stuckPercentage,
      archetypeAlignment: 'mixed',
      engagementLevel: 'medium',
      retentionImpact: 'negative'
    });
  }
  
  return patterns.sort((a, b) => b.playerPercentage - a.playerPercentage);
}

// ============================================================================
// Anomaly Detection
// ============================================================================

export function detectProgressionAnomalies(data: AchievementTelemetryRow[]): ProgressionAnomaly[] {
  const anomalies: ProgressionAnomaly[] = [];
  
  // Low completion rates
  const completed = data.filter(row => row.isCompleted === true).length;
  const completionRate = calculatePercentage(completed, data.length);
  
  if (completionRate < 15) {
    anomalies.push({
      type: 'Low Achievement Completion',
      description: `Only ${completionRate.toFixed(1)}% of achievements are being completed`,
      severity: completionRate < 10 ? 'critical' : 'high',
      affectedPlayers: data.length - completed,
      potentialCause: 'Achievements may be too difficult or unclear',
      recommendedAction: 'Review achievement difficulty curve and add progress indicators'
    });
  }
  
  // Leaderboard abandonment
  const leaderboardActive = data.filter(row => row.leaderboardRank !== undefined).length;
  const leaderboardRate = calculatePercentage(leaderboardActive, data.length);
  
  if (leaderboardRate < 30) {
    anomalies.push({
      type: 'Low Leaderboard Participation',
      description: `Only ${leaderboardRate.toFixed(1)}% of players engage with leaderboards`,
      severity: 'medium',
      affectedPlayers: data.length - leaderboardActive,
      potentialCause: 'Leaderboards may not be visible or rewarding enough',
      recommendedAction: 'Increase leaderboard visibility and add tier-based rewards'
    });
  }
  
  // Seasonal drop-off
  const seasonalActive = data.filter(row => row.seasonLevel !== undefined).length;
  const seasonalRate = calculatePercentage(seasonalActive, data.length);
  
  if (seasonalRate < 40) {
    anomalies.push({
      type: 'Seasonal System Underutilization',
      description: `Only ${seasonalRate.toFixed(1)}% of players participate in seasonal content`,
      severity: 'high',
      affectedPlayers: data.length - seasonalActive,
      potentialCause: 'Seasonal rewards may not be compelling or system is unclear',
      recommendedAction: 'Improve seasonal onboarding and increase reward value'
    });
  }
  
  // Streak abandonment
  const streaks = data
    .filter(row => row.dailyLoginStreak !== undefined)
    .map(row => safeNumber(row.dailyLoginStreak));
  const avgStreak = average(streaks);
  
  if (avgStreak < 3) {
    const lowStreakPlayers = streaks.filter(s => s < 3).length;
    anomalies.push({
      type: 'Low Daily Engagement',
      description: `Average login streak is only ${avgStreak.toFixed(1)} days`,
      severity: 'high',
      affectedPlayers: lowStreakPlayers,
      potentialCause: 'Lack of daily incentives or compelling daily content',
      recommendedAction: 'Implement daily rewards and streak bonuses'
    });
  }
  
  // Progress stagnation
  const progress = data
    .filter(row => row.progressPercentage !== undefined)
    .map(row => safeNumber(row.progressPercentage));
  const stagnant = progress.filter(p => p > 0 && p < 20).length;
  const stagnantRate = calculatePercentage(stagnant, progress.length);
  
  if (stagnantRate > 30) {
    anomalies.push({
      type: 'Early Progression Stagnation',
      description: `${stagnantRate.toFixed(1)}% of players stuck in early progression (0-20%)`,
      severity: 'critical',
      affectedPlayers: stagnant,
      potentialCause: 'Early progression may be too slow or unclear',
      recommendedAction: 'Accelerate early progression and add clearer guidance'
    });
  }
  
  return anomalies.sort((a, b) => {
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });
}

// ============================================================================
// LiveOps Signal Detection
// ============================================================================

export function detectLiveOpsSignals(
  data: AchievementTelemetryRow[],
  patterns: AchievementBehaviorPattern[],
  anomalies: ProgressionAnomaly[]
): LiveOpsSignal[] {
  const signals: LiveOpsSignal[] = [];
  
  // Competitive event opportunity
  const competitorPattern = patterns.find(p => p.archetypeAlignment === 'competitor');
  if (competitorPattern && competitorPattern.playerPercentage > 30) {
    signals.push({
      signal: 'High Competitive Engagement',
      description: `${competitorPattern.playerPercentage.toFixed(0)}% of players show competitive behavior`,
      urgency: 'short-term',
      playerSegment: 'Competitors',
      opportunityType: 'event',
      expectedImpact: 'Launch ranked tournament with exclusive leaderboard rewards'
    });
  }
  
  // Seasonal refresh needed
  const seasonalActive = data.filter(row => row.seasonLevel !== undefined).length;
  const highLevelPlayers = data.filter(row => safeNumber(row.seasonLevel) > 40).length;
  if (calculatePercentage(highLevelPlayers, seasonalActive) > 25) {
    signals.push({
      signal: 'Seasonal Content Exhaustion',
      description: '25%+ of seasonal players approaching max level',
      urgency: 'immediate',
      playerSegment: 'Seasonal Grinders',
      opportunityType: 'content',
      expectedImpact: 'Prepare next season or add bonus tiers to retain top players'
    });
  }
  
  // Achievement completion celebration
  const completionists = patterns.find(p => p.pattern === 'Achievement Completionists');
  if (completionists) {
    signals.push({
      signal: 'Achievement Milestone Opportunity',
      description: `${completionists.playerPercentage.toFixed(0)}% of players near completion`,
      urgency: 'short-term',
      playerSegment: 'Achievers',
      opportunityType: 'challenge',
      expectedImpact: 'Launch completion challenge with prestige rewards'
    });
  }
  
  // Re-engagement for casual players
  const casualPattern = patterns.find(p => p.archetypeAlignment === 'casual');
  if (casualPattern && casualPattern.playerPercentage > 30) {
    signals.push({
      signal: 'Casual Player Re-engagement Needed',
      description: `${casualPattern.playerPercentage.toFixed(0)}% of players show low engagement`,
      urgency: 'immediate',
      playerSegment: 'Casual Players',
      opportunityType: 'reward',
      expectedImpact: 'Launch comeback rewards and simplified progression path'
    });
  }
  
  // Milestone difficulty adjustment
  const stuckAnomaly = anomalies.find(a => a.type.includes('Stagnation'));
  if (stuckAnomaly && stuckAnomaly.severity === 'critical') {
    signals.push({
      signal: 'Progression Blocker Detected',
      description: stuckAnomaly.description,
      urgency: 'immediate',
      playerSegment: 'All Players',
      opportunityType: 'balance',
      expectedImpact: 'Adjust milestone difficulty or add progression assistance'
    });
  }
  
  return signals.sort((a, b) => {
    const urgencyOrder = { immediate: 3, 'short-term': 2, 'medium-term': 1 };
    return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
  });
}

// ============================================================================
// Main Analytics Summary Generator
// ============================================================================

export function generateAchievementAnalyticsSummary(
  data: AchievementTelemetryRow[]
): AchievementAnalyticsSummary {
  if (!data || data.length === 0) {
    return createEmptySummary();
  }
  
  // Calculate all metrics
  const archetypeDistribution = analyzeArchetypeDistribution(data);
  const archetypeDiversity = calculateArchetypeDiversity(archetypeDistribution);
  const dominantArchetype = Object.entries(archetypeDistribution)
    .sort(([, a], [, b]) => b - a)[0][0];
  
  const leaderboard = analyzeLeaderboardEngagement(data);
  const milestones = analyzeMilestones(data);
  const seasonal = analyzeSeasonalProgression(data);
  const pacing = analyzeProgressionPacing(data);
  const engagement = analyzeEngagementPatterns(data);
  
  const topBehaviors = detectBehavioralPatterns(data, archetypeDistribution);
  const progressionAnomalies = detectProgressionAnomalies(data);
  const liveOpsSignals = detectLiveOpsSignals(data, topBehaviors, progressionAnomalies);
  
  // Calculate achievement metrics
  const completedAchievements = data.filter(row => row.isCompleted === true).length;
  const averageCompletionRate = calculatePercentage(completedAchievements, data.length);
  
  const progressValues = data
    .filter(row => row.progressPercentage !== undefined)
    .map(row => safeNumber(row.progressPercentage));
  const averageProgressPercentage = average(progressValues);
  
  return {
    totalPlayers: data.length,
    totalAchievements: new Set(data.map(r => r.achievementId).filter(Boolean)).size,
    averageCompletionRate,
    averageProgressPercentage,
    
    leaderboardParticipation: leaderboard.participation,
    averageLeaderboardRank: leaderboard.averageRank,
    topTierPlayers: leaderboard.topTierPlayers,
    leaderboardChurn: leaderboard.churn,
    
    archetypeDistribution,
    dominantArchetype,
    archetypeDiversity,
    
    averageMilestoneCompletion: milestones.averageCompletion,
    milestoneCompletionRate: milestones.completionRate,
    stuckMilestones: milestones.stuckMilestones,
    popularMilestones: milestones.popularMilestones,
    
    seasonalParticipation: seasonal.participation,
    averageSeasonLevel: seasonal.averageLevel,
    seasonPassConversion: seasonal.passConversion,
    seasonalRetention: seasonal.retention,
    
    progressionVelocity: pacing.velocity,
    completionTimeDistribution: pacing.completionTimes,
    fastTrackers: pacing.fastTrackers,
    slowProgressors: pacing.slowProgressors,
    
    dailyLoginRate: engagement.dailyLoginRate,
    averageStreak: engagement.averageStreak,
    weeklyActiveRate: engagement.weeklyActiveRate,
    engagementTrend: engagement.trend,
    
    topBehaviors,
    progressionAnomalies,
    liveOpsSignals
  };
}

function createEmptySummary(): AchievementAnalyticsSummary {
  return {
    totalPlayers: 0,
    totalAchievements: 0,
    averageCompletionRate: 0,
    averageProgressPercentage: 0,
    leaderboardParticipation: 0,
    averageLeaderboardRank: 0,
    topTierPlayers: 0,
    leaderboardChurn: 0,
    archetypeDistribution: {
      achiever: 0,
      explorer: 0,
      socializer: 0,
      competitor: 0,
      collector: 0,
      casual: 0
    },
    dominantArchetype: 'casual',
    archetypeDiversity: 0,
    averageMilestoneCompletion: 0,
    milestoneCompletionRate: 0,
    stuckMilestones: [],
    popularMilestones: [],
    seasonalParticipation: 0,
    averageSeasonLevel: 0,
    seasonPassConversion: 0,
    seasonalRetention: 0,
    progressionVelocity: 0,
    completionTimeDistribution: [],
    fastTrackers: 0,
    slowProgressors: 0,
    dailyLoginRate: 0,
    averageStreak: 0,
    weeklyActiveRate: 0,
    engagementTrend: 'stable',
    topBehaviors: [],
    progressionAnomalies: [],
    liveOpsSignals: []
  };
}

// Made with Bob - Achievement Analytics Engine