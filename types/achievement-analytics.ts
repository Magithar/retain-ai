/**
 * Achievement Telemetry Analytics Types
 * 
 * Defines types for achievement-based player progression and engagement analysis
 */

// ============================================================================
// Core Achievement Telemetry Types
// ============================================================================

export interface AchievementTelemetryRow {
  playerId?: string;
  sessionId?: string;
  timestamp?: string;
  
  // Achievement Progression
  achievementId?: string;
  achievementName?: string;
  achievementTier?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  achievementCategory?: string;
  progressPercentage?: number;
  isCompleted?: boolean;
  completionTime?: number; // Time to complete in seconds
  
  // Leaderboard Metrics
  leaderboardRank?: number;
  leaderboardScore?: number;
  leaderboardTier?: string;
  rankChange?: number; // Change from previous period
  
  // Player Archetype
  playerArchetype?: 'achiever' | 'explorer' | 'socializer' | 'competitor' | 'collector' | 'casual';
  archetypeScore?: number;
  
  // Milestone Completion
  milestoneId?: string;
  milestoneName?: string;
  milestoneProgress?: number;
  milestoneCompleted?: boolean;
  
  // Seasonal Progression
  seasonId?: string;
  seasonLevel?: number;
  seasonXP?: number;
  seasonTier?: string;
  seasonPassActive?: boolean;
  
  // Engagement Indicators
  dailyLoginStreak?: number;
  weeklyActiveStatus?: boolean;
  totalPlayTime?: number;
  lastActiveDate?: string;
  
  [key: string]: any; // Allow additional fields
}

// ============================================================================
// Achievement Analytics Summary
// ============================================================================

export interface AchievementAnalyticsSummary {
  // Basic Metrics
  totalPlayers: number;
  totalAchievements: number;
  averageCompletionRate: number;
  averageProgressPercentage: number;
  
  // Leaderboard Engagement
  leaderboardParticipation: number; // Percentage of players on leaderboards
  averageLeaderboardRank: number;
  topTierPlayers: number; // Players in top 10%
  leaderboardChurn: number; // Rank volatility
  
  // Archetype Distribution
  archetypeDistribution: ArchetypeDistribution;
  dominantArchetype: string;
  archetypeDiversity: number; // 0-100, higher = more diverse
  
  // Milestone Progression
  averageMilestoneCompletion: number;
  milestoneCompletionRate: number;
  stuckMilestones: MilestoneData[];
  popularMilestones: MilestoneData[];
  
  // Seasonal Engagement
  seasonalParticipation: number;
  averageSeasonLevel: number;
  seasonPassConversion: number; // Percentage with active pass
  seasonalRetention: number;
  
  // Progression Pacing
  progressionVelocity: number; // Average progress per day
  completionTimeDistribution: number[];
  fastTrackers: number; // Players progressing >2x average
  slowProgressors: number; // Players progressing <0.5x average
  
  // Engagement Patterns
  dailyLoginRate: number;
  averageStreak: number;
  weeklyActiveRate: number;
  engagementTrend: 'increasing' | 'stable' | 'declining';
  
  // Behavioral Insights
  topBehaviors: AchievementBehaviorPattern[];
  progressionAnomalies: ProgressionAnomaly[];
  
  // LiveOps Opportunities
  liveOpsSignals: LiveOpsSignal[];
}

// ============================================================================
// Supporting Types
// ============================================================================

export interface ArchetypeDistribution {
  achiever: number;
  explorer: number;
  socializer: number;
  competitor: number;
  collector: number;
  casual: number;
}

export interface MilestoneData {
  milestoneId: string;
  milestoneName: string;
  completionRate: number;
  averageAttempts: number;
  stuckPlayerCount?: number;
  averageCompletionTime?: number;
}

export interface AchievementBehaviorPattern {
  pattern: string;
  description: string;
  playerPercentage: number;
  archetypeAlignment: string;
  engagementLevel: 'high' | 'medium' | 'low';
  retentionImpact: 'positive' | 'neutral' | 'negative';
}

export interface ProgressionAnomaly {
  type: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  affectedPlayers: number;
  potentialCause: string;
  recommendedAction: string;
}

export interface LiveOpsSignal {
  signal: string;
  description: string;
  urgency: 'immediate' | 'short-term' | 'medium-term';
  playerSegment: string;
  opportunityType: 'event' | 'challenge' | 'reward' | 'content' | 'balance';
  expectedImpact: string;
}

// ============================================================================
// PM Insight Types
// ============================================================================

export interface AchievementInsight {
  title: string;
  category: 'retention' | 'engagement' | 'monetization' | 'liveops' | 'progression';
  riskLevel: 'critical' | 'high' | 'medium' | 'low' | 'opportunity';
  
  // Data-backed observation
  observation: string;
  supportingMetrics: Record<string, number | string>;
  
  // Interpretation
  interpretation: string;
  playerSegmentAffected: string;
  
  // Recommendations
  pmRecommendation: string;
  liveOpsAction: string;
  priority: number; // 1-10
  
  // Expected outcomes
  expectedOutcome: string;
  kpis: string[];
  timeline: string;
}

export interface PlayerArchetypeProfile {
  archetype: string;
  description: string;
  percentage: number;
  characteristics: string[];
  motivations: string[];
  retentionRisk: 'high' | 'medium' | 'low';
  monetizationPotential: 'high' | 'medium' | 'low';
  recommendedContent: string[];
  liveOpsOpportunities: string[];
}

export interface SeasonalHealthMetrics {
  seasonId: string;
  participationRate: number;
  averageProgression: number;
  completionRate: number;
  passConversionRate: number;
  retentionImpact: number;
  revenueImpact: string;
  healthScore: number; // 0-100
  concerns: string[];
  opportunities: string[];
}

export interface LeaderboardAnalysis {
  totalParticipants: number;
  participationRate: number;
  competitiveIntensity: number; // 0-100
  rankVolatility: number; // How much ranks change
  topPlayerRetention: number;
  casualPlayerEngagement: number;
  recommendedActions: string[];
}

// ============================================================================
// Dashboard Output Types
// ============================================================================

export interface AchievementDashboardData {
  summary: AchievementAnalyticsSummary;
  insights: AchievementInsight[];
  archetypeProfiles: PlayerArchetypeProfile[];
  seasonalHealth: SeasonalHealthMetrics;
  leaderboardAnalysis: LeaderboardAnalysis;
  priorityActions: PriorityAction[];
}

export interface PriorityAction {
  rank: number;
  title: string;
  description: string;
  category: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  timeline: string;
  kpis: string[];
}

// Made with Bob - Achievement Analytics System