/**
 * Achievement-Focused Product Management Heuristics
 * 
 * Domain knowledge and best practices for achievement telemetry,
 * player progression, leaderboard engagement, and seasonal retention
 */

import { PMHeuristic, HeuristicCategory } from '../types';

// ============================================================================
// Retention Heuristics for Achievement Systems
// ============================================================================

export const achievementRetentionHeuristics: PMHeuristic[] = [
  {
    id: 'low-completion-rate',
    category: 'retention',
    title: 'Low Achievement Completion Rate',
    description: 'Players not completing achievements may indicate unclear goals or excessive difficulty',
    priority: 'high',
    applicableMetrics: ['averageCompletionRate', 'averageProgressPercentage'],
    thresholds: {
      averageCompletionRate: 20,
      averageProgressPercentage: 30
    },
    recommendations: [
      'Add progress indicators and milestone notifications',
      'Implement tiered achievement difficulty (bronze/silver/gold)',
      'Provide achievement hints or guidance systems',
      'Celebrate partial progress with micro-rewards'
    ],
    tags: ['progression', 'clarity', 'retention']
  },
  {
    id: 'seasonal-drop-off',
    category: 'retention',
    title: 'Seasonal Participation Decline',
    description: 'Low seasonal engagement suggests rewards are not compelling or system is unclear',
    priority: 'critical',
    applicableMetrics: ['seasonalParticipation', 'seasonalRetention'],
    thresholds: {
      seasonalParticipation: 40,
      seasonalRetention: 50
    },
    recommendations: [
      'Increase seasonal reward value and exclusivity',
      'Add seasonal onboarding tutorial',
      'Implement FOMO mechanics (limited-time rewards)',
      'Create seasonal narrative or theme'
    ],
    tags: ['seasonal', 'engagement', 'retention']
  },
  {
    id: 'low-daily-engagement',
    category: 'retention',
    title: 'Poor Daily Login Habits',
    description: 'Low login streaks indicate lack of daily incentives or compelling content',
    priority: 'high',
    applicableMetrics: ['dailyLoginRate', 'averageStreak'],
    thresholds: {
      dailyLoginRate: 40,
      averageStreak: 3
    },
    recommendations: [
      'Implement daily login rewards with escalating value',
      'Add streak protection mechanics (grace periods)',
      'Create daily challenges with unique rewards',
      'Send push notifications for streak maintenance'
    ],
    tags: ['daily-engagement', 'habits', 'retention']
  },
  {
    id: 'progression-stagnation',
    category: 'retention',
    title: 'Early Progression Stagnation',
    description: 'Players stuck in early progression (0-20%) likely to churn without intervention',
    priority: 'critical',
    applicableMetrics: ['slowProgressors', 'averageProgressPercentage'],
    thresholds: {
      slowProgressors: 100,
      averageProgressPercentage: 25
    },
    recommendations: [
      'Accelerate early progression rewards',
      'Add new player boost period (2x progress)',
      'Implement smart difficulty scaling',
      'Provide clear next-step guidance'
    ],
    tags: ['progression', 'onboarding', 'churn-risk']
  }
];

// ============================================================================
// Engagement & LiveOps Heuristics
// ============================================================================

export const achievementLiveOpsHeuristics: PMHeuristic[] = [
  {
    id: 'leaderboard-opportunity',
    category: 'liveops',
    title: 'High Competitive Engagement',
    description: 'Strong leaderboard participation indicates opportunity for competitive events',
    priority: 'high',
    applicableMetrics: ['leaderboardParticipation', 'topTierPlayers'],
    thresholds: {
      leaderboardParticipation: 40
    },
    recommendations: [
      'Launch ranked tournament with tier-based rewards',
      'Create weekly leaderboard reset events',
      'Implement seasonal leaderboard championships',
      'Add spectator mode for top players'
    ],
    tags: ['competitive', 'leaderboard', 'events']
  },
  {
    id: 'archetype-content-match',
    category: 'liveops',
    title: 'Archetype-Specific Content Opportunity',
    description: 'Dominant player archetype suggests targeted content opportunities',
    priority: 'high',
    applicableMetrics: ['dominantArchetype', 'archetypeDiversity'],
    recommendations: [
      'Achievers: Launch completion challenges and prestige systems',
      'Competitors: Create ranked tournaments and PvP events',
      'Collectors: Add limited-edition collectible series',
      'Explorers: Release discovery-based content and hidden achievements',
      'Socializers: Implement guild achievements and cooperative goals',
      'Casuals: Provide accessible daily quests and quick wins'
    ],
    tags: ['archetypes', 'content', 'personalization']
  },
  {
    id: 'seasonal-refresh-timing',
    category: 'liveops',
    title: 'Seasonal Content Exhaustion',
    description: 'High-level seasonal players approaching max level need new content',
    priority: 'critical',
    applicableMetrics: ['averageSeasonLevel', 'seasonalParticipation'],
    thresholds: {
      averageSeasonLevel: 35
    },
    recommendations: [
      'Prepare next season launch (2-3 weeks notice)',
      'Add bonus tiers or prestige levels',
      'Create end-of-season celebration event',
      'Tease next season content to maintain interest'
    ],
    tags: ['seasonal', 'content-cadence', 'retention']
  },
  {
    id: 'milestone-celebration-event',
    category: 'liveops',
    title: 'Achievement Milestone Opportunity',
    description: 'Players near completion milestones create celebration event opportunity',
    priority: 'medium',
    applicableMetrics: ['averageCompletionRate', 'milestoneCompletionRate'],
    thresholds: {
      averageCompletionRate: 60
    },
    recommendations: [
      'Launch completion challenge with bonus rewards',
      'Create achievement showcase features',
      'Implement prestige system for completionists',
      'Add community completion goals'
    ],
    tags: ['milestones', 'events', 'celebration']
  },
  {
    id: 'casual-reengagement',
    category: 'liveops',
    title: 'Casual Player Re-engagement Window',
    description: 'Large casual segment needs accessible content and comeback incentives',
    priority: 'high',
    applicableMetrics: ['archetypeDistribution'],
    recommendations: [
      'Launch comeback rewards for returning players',
      'Create simplified progression path',
      'Add casual-friendly daily quests',
      'Implement catch-up mechanics for seasonal content'
    ],
    tags: ['casual', 'reengagement', 'accessibility']
  }
];

// ============================================================================
// Monetization Heuristics
// ============================================================================

export const achievementMonetizationHeuristics: PMHeuristic[] = [
  {
    id: 'season-pass-conversion',
    category: 'monetization',
    title: 'Seasonal Pass Conversion Opportunity',
    description: 'High seasonal participation with low pass conversion indicates pricing or value issues',
    priority: 'high',
    applicableMetrics: ['seasonalParticipation', 'seasonPassConversion'],
    thresholds: {
      seasonalParticipation: 50,
      seasonPassConversion: 15
    },
    recommendations: [
      'Increase free track rewards to showcase value',
      'Add mid-season pass purchase option with retroactive rewards',
      'Create limited-time pass discount events',
      'Implement pass gifting for social virality'
    ],
    tags: ['battle-pass', 'conversion', 'pricing']
  },
  {
    id: 'completionist-monetization',
    category: 'monetization',
    title: 'Completionist Segment Monetization',
    description: 'Achievement completionists are high-value segment for exclusive content',
    priority: 'high',
    applicableMetrics: ['averageCompletionRate'],
    thresholds: {
      averageCompletionRate: 70
    },
    recommendations: [
      'Offer premium achievement packs with exclusive rewards',
      'Create prestige cosmetics for 100% completion',
      'Implement achievement boost consumables',
      'Add VIP membership with achievement perks'
    ],
    tags: ['completionists', 'premium-content', 'whales']
  },
  {
    id: 'leaderboard-cosmetics',
    category: 'monetization',
    title: 'Competitive Cosmetic Monetization',
    description: 'High leaderboard engagement creates opportunity for status-symbol cosmetics',
    priority: 'medium',
    applicableMetrics: ['leaderboardParticipation', 'topTierPlayers'],
    thresholds: {
      leaderboardParticipation: 40
    },
    recommendations: [
      'Sell exclusive leaderboard cosmetics and badges',
      'Offer rank-up celebration effects',
      'Create seasonal rank cosmetic rewards',
      'Implement profile customization for top players'
    ],
    tags: ['cosmetics', 'status', 'competitive']
  },
  {
    id: 'progression-accelerators',
    category: 'monetization',
    title: 'Progression Boost Monetization',
    description: 'Slow progressors may pay for convenience without feeling pay-to-win',
    priority: 'medium',
    applicableMetrics: ['slowProgressors', 'progressionVelocity'],
    recommendations: [
      'Offer XP boost consumables (time-limited)',
      'Create achievement progress skip tokens (limited use)',
      'Implement seasonal level bundles',
      'Add convenience features (auto-claim, bulk rewards)'
    ],
    tags: ['convenience', 'time-savers', 'casual-monetization']
  }
];

// ============================================================================
// Friction & Balance Heuristics
// ============================================================================

export const achievementFrictionHeuristics: PMHeuristic[] = [
  {
    id: 'stuck-milestones',
    category: 'friction',
    title: 'Milestone Difficulty Spikes',
    description: 'Players stuck on specific milestones indicate difficulty imbalance',
    priority: 'critical',
    applicableMetrics: ['stuckMilestones', 'milestoneCompletionRate'],
    thresholds: {
      milestoneCompletionRate: 30
    },
    recommendations: [
      'Rebalance stuck milestone requirements',
      'Add milestone hints or guidance',
      'Implement difficulty options for milestones',
      'Provide alternative paths to completion'
    ],
    tags: ['difficulty', 'balance', 'friction']
  },
  {
    id: 'leaderboard-accessibility',
    category: 'friction',
    title: 'Leaderboard Participation Barrier',
    description: 'Low leaderboard participation suggests visibility or accessibility issues',
    priority: 'high',
    applicableMetrics: ['leaderboardParticipation'],
    thresholds: {
      leaderboardParticipation: 30
    },
    recommendations: [
      'Increase leaderboard visibility in UI',
      'Add tier-based leaderboards (not just global)',
      'Implement friend leaderboards for social comparison',
      'Create beginner-friendly leaderboard categories'
    ],
    tags: ['accessibility', 'ux', 'leaderboard']
  },
  {
    id: 'unclear-progression',
    category: 'friction',
    title: 'Unclear Progression Path',
    description: 'Low average progress suggests players don\'t understand how to advance',
    priority: 'high',
    applicableMetrics: ['averageProgressPercentage', 'slowProgressors'],
    thresholds: {
      averageProgressPercentage: 25
    },
    recommendations: [
      'Add clear next-step indicators',
      'Implement progress tracking dashboard',
      'Create achievement roadmap visualization',
      'Provide contextual tips and tutorials'
    ],
    tags: ['clarity', 'ux', 'onboarding']
  },
  {
    id: 'seasonal-complexity',
    category: 'friction',
    title: 'Seasonal System Complexity',
    description: 'Low seasonal participation may indicate system is too complex',
    priority: 'medium',
    applicableMetrics: ['seasonalParticipation'],
    thresholds: {
      seasonalParticipation: 35
    },
    recommendations: [
      'Simplify seasonal progression UI',
      'Add seasonal onboarding tutorial',
      'Create seasonal quick-start guide',
      'Reduce number of seasonal currencies/systems'
    ],
    tags: ['complexity', 'ux', 'seasonal']
  }
];

// ============================================================================
// Segmentation Heuristics
// ============================================================================

export const achievementSegmentationHeuristics: PMHeuristic[] = [
  {
    id: 'archetype-diversity',
    category: 'segmentation',
    title: 'Player Archetype Diversity',
    description: 'Archetype distribution reveals player motivation and content needs',
    priority: 'high',
    applicableMetrics: ['archetypeDistribution', 'archetypeDiversity'],
    recommendations: [
      'Create content for each major archetype (>15% of base)',
      'Implement archetype-specific progression paths',
      'Add archetype identification quiz for personalization',
      'Balance content across archetypes to increase diversity'
    ],
    tags: ['archetypes', 'personalization', 'content-strategy']
  },
  {
    id: 'engagement-tiers',
    category: 'segmentation',
    title: 'Engagement-Based Segmentation',
    description: 'Segment players by engagement level for targeted interventions',
    priority: 'high',
    applicableMetrics: ['dailyLoginRate', 'weeklyActiveRate', 'averageStreak'],
    recommendations: [
      'High Engagement (7+ day streaks): VIP rewards and exclusive content',
      'Medium Engagement (3-6 day streaks): Streak protection and bonus rewards',
      'Low Engagement (<3 day streaks): Re-engagement campaigns and comeback bonuses',
      'Lapsed (no recent activity): Win-back campaigns with generous rewards'
    ],
    tags: ['engagement-tiers', 'retention', 'personalization']
  },
  {
    id: 'progression-speed-segments',
    category: 'segmentation',
    title: 'Progression Speed Segmentation',
    description: 'Fast-trackers and slow progressors need different content pacing',
    priority: 'medium',
    applicableMetrics: ['fastTrackers', 'slowProgressors', 'progressionVelocity'],
    recommendations: [
      'Fast-trackers: Add prestige systems and hard-mode content',
      'Average progressors: Maintain current pacing',
      'Slow progressors: Offer catch-up mechanics and boost events',
      'Implement dynamic difficulty adjustment based on progression speed'
    ],
    tags: ['progression-pacing', 'difficulty', 'personalization']
  },
  {
    id: 'leaderboard-tiers',
    category: 'segmentation',
    title: 'Competitive Tier Segmentation',
    description: 'Segment players by leaderboard engagement for targeted competitive content',
    priority: 'medium',
    applicableMetrics: ['leaderboardParticipation', 'topTierPlayers', 'averageLeaderboardRank'],
    recommendations: [
      'Top Tier (top 10%): Exclusive tournaments and prestige rewards',
      'Active Competitors (top 50%): Tier-based rewards and rank-up incentives',
      'Casual Participants (bottom 50%): Accessible challenges and participation rewards',
      'Non-participants: Onboarding events and beginner leaderboards'
    ],
    tags: ['competitive-tiers', 'leaderboard', 'rewards']
  }
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get all achievement-focused heuristics
 */
export function getAllAchievementHeuristics(): PMHeuristic[] {
  return [
    ...achievementRetentionHeuristics,
    ...achievementLiveOpsHeuristics,
    ...achievementMonetizationHeuristics,
    ...achievementFrictionHeuristics,
    ...achievementSegmentationHeuristics
  ];
}

/**
 * Get heuristics by category for achievement systems
 */
export function getAchievementHeuristicsByCategory(
  category: HeuristicCategory
): PMHeuristic[] {
  const allHeuristics = getAllAchievementHeuristics();
  return allHeuristics.filter(h => h.category === category);
}

/**
 * Get heuristics applicable to specific archetype
 */
export function getHeuristicsForArchetype(archetype: string): PMHeuristic[] {
  const allHeuristics = getAllAchievementHeuristics();
  return allHeuristics.filter(h => 
    h.tags.includes('archetypes') || 
    h.recommendations.some(r => r.toLowerCase().includes(archetype.toLowerCase()))
  );
}

/**
 * Get urgent heuristics based on metrics
 */
export function getUrgentAchievementHeuristics(metrics: any): PMHeuristic[] {
  const allHeuristics = getAllAchievementHeuristics();
  return allHeuristics.filter(h => {
    if (h.priority !== 'critical' && h.priority !== 'high') return false;
    
    // Check if any threshold is violated
    if (!h.thresholds) return false;
    
    return Object.entries(h.thresholds).some(([metric, threshold]) => {
      const value = metrics[metric];
      if (value === undefined) return false;
      return value < threshold;
    });
  });
}

// Made with Bob - Achievement PM Heuristics