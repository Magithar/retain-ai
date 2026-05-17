/**
 * Heuristic Matcher - Intelligent Heuristic Selection
 * 
 * Matches relevant PM heuristics to analytics data based on
 * metric thresholds, priorities, and contextual relevance.
 */

import { AnalyticsSummary } from '../../analytics';
import {
  PMHeuristic,
  HeuristicCategory,
  HeuristicMatch,
  HeuristicMatchCriteria
} from '../types';
import { getHeuristicsByCategory, getHeuristicsByPriority } from '../intelligence/pmHeuristics';

/**
 * Match heuristics to analytics data
 */
export function matchHeuristics(
  summary: AnalyticsSummary,
  criteria: HeuristicMatchCriteria
): HeuristicMatch[] {
  const { categories, minPriority = 'medium', requiredTags = [] } = criteria;
  
  // Get candidate heuristics
  let heuristics: PMHeuristic[];
  if (categories) {
    heuristics = minPriority
      ? getHeuristicsByPriority(categories, minPriority)
      : categories.flatMap(cat => getHeuristicsByCategory(summary, cat));
  } else {
    heuristics = getHeuristicsByPriority(['retention', 'monetization', 'liveops', 'friction', 'segmentation'], minPriority);
  }
  
  // Filter by required tags
  if (requiredTags.length > 0) {
    heuristics = heuristics.filter(h =>
      requiredTags.some(tag => h.tags.includes(tag))
    );
  }
  
  // Match and score each heuristic
  const matches: HeuristicMatch[] = [];
  
  for (const heuristic of heuristics) {
    const match = evaluateHeuristic(heuristic, summary);
    if (match.relevanceScore > 0) {
      matches.push(match);
    }
  }
  
  // Sort by relevance score (descending)
  return matches.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * Evaluate a single heuristic against analytics data
 */
function evaluateHeuristic(
  heuristic: PMHeuristic,
  summary: AnalyticsSummary
): HeuristicMatch {
  let relevanceScore = 0;
  const triggeredBy: string[] = [];
  const applicableRecommendations: string[] = [];
  
  // Check each applicable metric
  for (const metric of heuristic.applicableMetrics) {
    const metricValue = getMetricValue(summary, metric);
    const threshold = heuristic.thresholds?.[metric];
    
    if (metricValue !== null && threshold !== undefined) {
      const triggered = checkThreshold(metric, metricValue, threshold);
      if (triggered) {
        relevanceScore += getPriorityWeight(heuristic.priority);
        triggeredBy.push(metric);
      }
    }
  }
  
  // Add recommendations if heuristic is relevant
  if (relevanceScore > 0) {
    applicableRecommendations.push(...heuristic.recommendations);
  }
  
  return {
    heuristic,
    relevanceScore,
    triggeredBy,
    applicableRecommendations
  };
}

/**
 * Get metric value from analytics summary
 */
function getMetricValue(summary: AnalyticsSummary, metric: string): number | null {
  const metricMap: Record<string, number | null> = {
    averageDeaths: summary.averageDeaths ?? null,
    highDeathSessions: summary.highDeathSessions, // High death telemetry entries
    highDeathSessionsPercent: (summary.highDeathSessions / summary.totalSessions) * 100,
    lowScoreSessions: summary.lowScoreSessions, // Low score telemetry entries
    abandonmentRate: summary.abandonmentRate,
    killDeathRatio: summary.killDeathRatio ?? null,
    pickupEfficiency: summary.pickupEfficiency ?? null,
    combatTimePercentage: summary.combatTimePercentage ?? null,
    combatIntensity: summary.combatIntensity ?? null,
    explorationEngagement: summary.explorationEngagement ?? null,
    frictionScore: summary.frictionScore,
    averageScore: summary.averageScore ?? null,
    averageKills: summary.averageKills ?? null,
    averageDistanceTraveled: summary.averageDistanceTraveled ?? null,
    zeroScoreSessions: summary.anomalies.find(a => a.type === 'Zero Score Sessions')?.affectedSessions || 0, // Zero score telemetry entries
    zeroScoreSessionsPercent: ((summary.anomalies.find(a => a.type === 'Zero Score Sessions')?.affectedSessions || 0) / summary.totalSessions) * 100
  };
  
  return metricMap[metric] ?? null;
}

/**
 * Check if metric value triggers threshold
 */
function checkThreshold(metric: string, value: number, threshold: number): boolean {
  // Metrics where lower is worse
  const lowerIsBad = [
    'killDeathRatio',
    'pickupEfficiency',
    'combatTimePercentage',
    'combatIntensity',
    'explorationEngagement',
    'averageScore',
    'averageKills'
  ];
  
  // Metrics where higher is worse
  const higherIsBad = [
    'averageDeaths',
    'highDeathSessions',
    'highDeathSessionsPercent',
    'abandonmentRate',
    'frictionScore',
    'zeroScoreSessions',
    'zeroScoreSessionsPercent'
  ];
  
  if (lowerIsBad.includes(metric)) {
    return value < threshold;
  } else if (higherIsBad.includes(metric)) {
    return value > threshold;
  }
  
  return false;
}

/**
 * Get priority weight for scoring
 */
function getPriorityWeight(priority: string): number {
  const weights = {
    critical: 100,
    high: 50,
    medium: 25,
    low: 10
  };
  return weights[priority as keyof typeof weights] || 10;
}

/**
 * Get top N most relevant heuristics
 */
export function getTopHeuristics(
  matches: HeuristicMatch[],
  count: number = 5
): HeuristicMatch[] {
  return matches.slice(0, count);
}

/**
 * Group heuristics by category
 */
export function groupHeuristicsByCategory(
  matches: HeuristicMatch[]
): Record<HeuristicCategory, HeuristicMatch[]> {
  const grouped: Record<string, HeuristicMatch[]> = {};
  
  for (const match of matches) {
    const category = match.heuristic.category;
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(match);
  }
  
  return grouped as Record<HeuristicCategory, HeuristicMatch[]>;
}

/**
 * Format heuristics for prompt injection
 */
export function formatHeuristicsForPrompt(matches: HeuristicMatch[]): string {
  if (matches.length === 0) {
    return 'No specific heuristics triggered for this dataset.';
  }
  
  const sections: string[] = [];
  
  sections.push('## Relevant PM Heuristics\n');
  sections.push('The following product management heuristics are relevant based on the analytics data:\n');
  
  for (const match of matches) {
    const h = match.heuristic;
    sections.push(`### ${h.title} [${h.priority.toUpperCase()} PRIORITY]`);
    sections.push(`**Category:** ${h.category}`);
    sections.push(`**Description:** ${h.description}`);
    sections.push(`**Triggered by:** ${match.triggeredBy.join(', ')}`);
    sections.push(`**Relevance Score:** ${match.relevanceScore}`);
    sections.push('\n**Recommended Actions:**');
    match.applicableRecommendations.forEach((rec, idx) => {
      sections.push(`${idx + 1}. ${rec}`);
    });
    sections.push('');
  }
  
  return sections.join('\n');
}

/**
 * Get contextual guidance based on matched heuristics
 */
export function getContextualGuidance(matches: HeuristicMatch[]): string {
  if (matches.length === 0) {
    return 'Analyze the data holistically and provide insights based on general PM best practices.';
  }
  
  const criticalMatches = matches.filter(m => m.heuristic.priority === 'critical');
  const highMatches = matches.filter(m => m.heuristic.priority === 'high');
  
  const guidance: string[] = [];
  
  if (criticalMatches.length > 0) {
    guidance.push(`⚠️ CRITICAL: ${criticalMatches.length} critical issue(s) detected requiring immediate attention.`);
    guidance.push('Focus your analysis on these high-severity problems first.');
  }
  
  if (highMatches.length > 0) {
    guidance.push(`⚡ HIGH PRIORITY: ${highMatches.length} high-priority issue(s) identified.`);
    guidance.push('These should be addressed in the next sprint or update cycle.');
  }
  
  // Extract common themes
  const allTags = matches.flatMap(m => m.heuristic.tags);
  const tagCounts = allTags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([tag]) => tag);
  
  if (topTags.length > 0) {
    guidance.push(`\n📊 Key themes in the data: ${topTags.join(', ')}`);
    guidance.push('Consider these themes when formulating recommendations.');
  }
  
  return guidance.join('\n');
}

/**
 * Filter heuristics by specific criteria
 */
export function filterHeuristics(
  matches: HeuristicMatch[],
  filter: {
    minScore?: number;
    categories?: HeuristicCategory[];
    priorities?: string[];
    tags?: string[];
  }
): HeuristicMatch[] {
  let filtered = matches;
  
  if (filter.minScore !== undefined) {
    filtered = filtered.filter(m => m.relevanceScore >= filter.minScore!);
  }
  
  if (filter.categories) {
    filtered = filtered.filter(m => 
      filter.categories!.includes(m.heuristic.category)
    );
  }
  
  if (filter.priorities) {
    filtered = filtered.filter(m => 
      filter.priorities!.includes(m.heuristic.priority)
    );
  }
  
  if (filter.tags) {
    filtered = filtered.filter(m =>
      filter.tags!.some(tag => m.heuristic.tags.includes(tag))
    );
  }
  
  return filtered;
}

// Made with Bob
