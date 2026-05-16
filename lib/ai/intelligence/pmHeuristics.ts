/**
 * Product Management Heuristics
 * 
 * Domain knowledge and best practices for game analytics and player retention
 */

import { PMHeuristic, HeuristicCategory, HeuristicPriority } from '../types';

/**
 * Retention heuristics based on industry best practices
 */
export const retentionHeuristics: PMHeuristic[] = [
  {
    id: 'high-death-rate',
    category: 'retention',
    title: 'High Player Death Rate',
    description: 'Players dying frequently indicates difficulty spikes or unclear mechanics',
    priority: 'high',
    applicableMetrics: ['averageDeaths', 'highDeathSessionsPercent'],
    thresholds: {
      averageDeaths: 5,
      highDeathSessionsPercent: 30
    },
    recommendations: [
      'Implement difficulty scaling based on player performance',
      'Add tutorial checkpoints for complex mechanics',
      'Introduce resurrection mechanics or continue systems',
      'A/B test easier early-game encounters'
    ],
    tags: ['difficulty', 'churn-risk', 'ux']
  },
  {
    id: 'negative-kd',
    category: 'retention',
    title: 'Negative Kill/Death Ratio',
    description: 'Players dying more than killing creates sense of failure',
    priority: 'high',
    applicableMetrics: ['killDeathRatio'],
    thresholds: {
      killDeathRatio: 1.0
    },
    recommendations: [
      'Rebalance enemy difficulty and health pools',
      'Increase player damage output',
      'Add more health pickups or regeneration',
      'Improve hit detection and combat feedback'
    ],
    tags: ['balance', 'combat', 'churn-risk']
  },
  {
    id: 'high-abandonment',
    category: 'retention',
    title: 'High Early Abandonment',
    description: 'Players leaving early suggests poor onboarding or engagement',
    priority: 'critical',
    applicableMetrics: ['abandonmentRate', 'lowScoreSessions'],
    thresholds: {
      abandonmentRate: 20
    },
    recommendations: [
      'Improve onboarding flow and first-time user experience',
      'Add early-game rewards and progression hooks',
      'Ensure first 5 minutes are engaging',
      'Implement new player protection period'
    ],
    tags: ['onboarding', 'churn-risk', 'engagement']
  }
];

/**
 * Monetization heuristics
 */
export const monetizationHeuristics: PMHeuristic[] = [
  {
    id: 'collector-segment',
    category: 'monetization',
    title: 'Strong Collector Behavior',
    description: 'Players showing collection tendencies are ideal for cosmetic monetization',
    priority: 'high',
    applicableMetrics: ['pickupEfficiency'],
    thresholds: {
      pickupEfficiency: 70
    },
    recommendations: [
      'Introduce battle pass with exclusive collectibles',
      'Add limited-time cosmetic items',
      'Implement collection completion rewards',
      'Add showcase features for collected items'
    ],
    tags: ['cosmetics', 'battle-pass', 'collectors']
  },
  {
    id: 'combat-enthusiasts',
    category: 'monetization',
    title: 'Combat-Focused Players',
    description: 'High combat engagement indicates opportunity for power-up monetization',
    priority: 'medium',
    applicableMetrics: ['combatTimePercentage'],
    thresholds: {
      combatTimePercentage: 60
    },
    recommendations: [
      'Offer weapon skin bundles',
      'Sell combat boost consumables',
      'Add premium character abilities',
      'Ensure items feel powerful but balanced'
    ],
    tags: ['combat', 'power-ups', 'weapons']
  }
];

/**
 * Friction heuristics
 */
export const frictionHeuristics: PMHeuristic[] = [
  {
    id: 'low-pickup-efficiency',
    category: 'friction',
    title: 'Item Pickup Issues',
    description: 'Low pickup success rate indicates UX problems with interactions',
    priority: 'high',
    applicableMetrics: ['pickupEfficiency'],
    thresholds: {
      pickupEfficiency: 60
    },
    recommendations: [
      'Increase pickup interaction radius',
      'Add clearer visual feedback for pickups',
      'Implement auto-pickup for nearby items',
      'Add haptic feedback on successful pickups'
    ],
    tags: ['ux', 'interactions', 'friction']
  },
  {
    id: 'high-friction-score',
    category: 'friction',
    title: 'Excessive Player Friction',
    description: 'High friction score indicates multiple pain points in experience',
    priority: 'critical',
    applicableMetrics: ['frictionScore'],
    thresholds: {
      frictionScore: 60
    },
    recommendations: [
      'Conduct comprehensive UX audit',
      'Focus on interaction clarity and feedback',
      'Improve combat responsiveness',
      'Prioritize quick wins that reduce immediate friction'
    ],
    tags: ['ux', 'friction', 'pain-points']
  }
];

/**
 * LiveOps heuristics for event recommendations
 */
export const liveOpsHeuristics: PMHeuristic[] = [
  {
    id: 'combat-event-opportunity',
    category: 'liveops',
    title: 'Combat Event Opportunity',
    description: 'High combat engagement indicates strong opportunity for combat-focused events',
    priority: 'high',
    applicableMetrics: ['combatTimePercentage', 'killDeathRatio'],
    thresholds: {
      combatTimePercentage: 50
    },
    recommendations: [
      'Launch Arena Tournament with leaderboard rewards',
      'Create Boss Rush challenge event',
      'Implement PvP combat events with exclusive rewards',
      'Add combat mastery challenges with progression rewards'
    ],
    tags: ['combat', 'events', 'engagement']
  },
  {
    id: 'collection-event-opportunity',
    category: 'liveops',
    title: 'Collection Event Opportunity',
    description: 'Strong collector behavior suggests treasure hunt and collection events',
    priority: 'high',
    applicableMetrics: ['pickupEfficiency'],
    thresholds: {
      pickupEfficiency: 70
    },
    recommendations: [
      'Launch limited-time treasure hunt event',
      'Create seasonal collectible series',
      'Implement collection completion rewards',
      'Add rare item discovery challenges'
    ],
    tags: ['collection', 'events', 'collectors']
  },
  {
    id: 'retention-boost-event',
    category: 'liveops',
    title: 'Retention Boost Event',
    description: 'High abandonment rate requires immediate retention intervention',
    priority: 'critical',
    applicableMetrics: ['abandonmentRate'],
    thresholds: {
      abandonmentRate: 20
    },
    recommendations: [
      'Launch comeback rewards event for returning players',
      'Create daily login bonus campaign',
      'Implement new player welcome event',
      'Add progression acceleration event'
    ],
    tags: ['retention', 'events', 'churn-prevention']
  },
  {
    id: 'social-event-opportunity',
    category: 'liveops',
    title: 'Community Event Opportunity',
    description: 'Large active player base suitable for server-wide social events',
    priority: 'medium',
    applicableMetrics: ['totalSessions'],
    thresholds: {
      totalSessions: 1000
    },
    recommendations: [
      'Launch server-wide community goal event',
      'Create guild vs guild competition',
      'Implement cooperative raid events',
      'Add social sharing reward campaigns'
    ],
    tags: ['social', 'events', 'community']
  },
  {
    id: 'difficulty-challenge-event',
    category: 'liveops',
    title: 'Difficulty Challenge Event',
    description: 'High death rate can be reframed as challenge event opportunity',
    priority: 'medium',
    applicableMetrics: ['averageDeaths'],
    thresholds: {
      averageDeaths: 4
    },
    recommendations: [
      'Launch hardcore survival challenge',
      'Create permadeath tournament mode',
      'Implement difficulty tier rewards',
      'Add mastery challenge events'
    ],
    tags: ['difficulty', 'events', 'challenge']
  },
  {
    id: 'seasonal-content-cadence',
    category: 'liveops',
    title: 'Seasonal Content Strategy',
    description: 'Establish regular seasonal content cadence for sustained engagement',
    priority: 'high',
    applicableMetrics: ['totalSessions'],
    thresholds: {
      totalSessions: 500
    },
    recommendations: [
      'Implement quarterly seasonal battle pass',
      'Create monthly themed events',
      'Add weekly rotating challenges',
      'Establish daily quest system'
    ],
    tags: ['seasonal', 'cadence', 'engagement']
  }
];

/**
 * Get all heuristics
 */
export function getAllHeuristics(): PMHeuristic[] {
  return [
    ...retentionHeuristics,
    ...monetizationHeuristics,
    ...frictionHeuristics,
    ...liveOpsHeuristics
  ];
}

/**
 * Get heuristics by category
 */
export function getHeuristicsByCategory(
  metrics: any,
  category: HeuristicCategory
): PMHeuristic[] {
  const allHeuristics = getAllHeuristics();
  return allHeuristics.filter(h => h.category === category);
}

/**
 * Get heuristics by priority
 */
export function getHeuristicsByPriority(
  categories: HeuristicCategory[],
  minPriority: HeuristicPriority
): PMHeuristic[] {
  const priorityOrder: Record<HeuristicPriority, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1
  };
  
  const minLevel = priorityOrder[minPriority];
  const allHeuristics = getAllHeuristics();
  
  return allHeuristics.filter(h => 
    categories.includes(h.category) && 
    priorityOrder[h.priority] >= minLevel
  );
}

// Made with Bob
