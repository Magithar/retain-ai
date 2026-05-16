/**
 * AI Executive Summary Generator
 * 
 * Generates concise AI-powered executive summaries from analytics data
 */

import { AnalyticsSummary } from '../analytics';

export interface ExecutiveSummary {
  insights: string[];
  keyFindings: {
    label: string;
    value: string;
    trend: 'positive' | 'negative' | 'neutral';
  }[];
}

/**
 * Generate AI executive summary from analytics data
 */
export function generateExecutiveSummary(summary: AnalyticsSummary): ExecutiveSummary {
  const insights: string[] = [];
  const keyFindings: ExecutiveSummary['keyFindings'] = [];
  
  // Analyze combat engagement
  if (summary.combatTimePercentage > 60) {
    insights.push(
      'Combat-focused players show high engagement but may benefit from progression systems to improve retention.'
    );
    keyFindings.push({
      label: 'Combat Engagement',
      value: `${summary.combatTimePercentage.toFixed(1)}%`,
      trend: 'positive'
    });
  } else if (summary.combatTimePercentage < 30) {
    insights.push(
      'Exploration-focused players show lower combat participation, indicating LiveOps opportunities for non-combat content.'
    );
    keyFindings.push({
      label: 'Combat Engagement',
      value: `${summary.combatTimePercentage.toFixed(1)}%`,
      trend: 'neutral'
    });
  }
  
  // Analyze collection behavior
  if (summary.pickupEfficiency > 70) {
    insights.push(
      'Collector players demonstrate strong engagement with item systems, presenting monetization opportunities through cosmetic and progression items.'
    );
    keyFindings.push({
      label: 'Pickup Success',
      value: `${summary.pickupEfficiency.toFixed(1)}%`,
      trend: 'positive'
    });
  } else if (summary.pickupEfficiency < 50) {
    insights.push(
      'Low pickup efficiency indicates potential UX friction in item collection mechanics requiring immediate attention.'
    );
    keyFindings.push({
      label: 'Pickup Success',
      value: `${summary.pickupEfficiency.toFixed(1)}%`,
      trend: 'negative'
    });
  }
  
  // Analyze K/D ratio and difficulty
  if (summary.killDeathRatio < 0.8) {
    insights.push(
      'High death rates suggest difficulty balancing issues that may impact player retention and satisfaction.'
    );
    keyFindings.push({
      label: 'K/D Ratio',
      value: summary.killDeathRatio.toFixed(2),
      trend: 'negative'
    });
  } else if (summary.killDeathRatio > 2.0) {
    insights.push(
      'Strong combat performance indicates well-balanced difficulty, supporting positive player experience and retention.'
    );
    keyFindings.push({
      label: 'K/D Ratio',
      value: summary.killDeathRatio.toFixed(2),
      trend: 'positive'
    });
  }
  
  // Analyze friction score
  if (summary.frictionScore > 60) {
    insights.push(
      'High friction detected across multiple systems. Priority focus on reducing death rates and improving pickup mechanics recommended.'
    );
    keyFindings.push({
      label: 'Friction Score',
      value: `${summary.frictionScore.toFixed(0)}/100`,
      trend: 'negative'
    });
  } else if (summary.frictionScore < 30) {
    insights.push(
      'Low friction scores indicate smooth player experience with minimal pain points across core gameplay loops.'
    );
    keyFindings.push({
      label: 'Friction Score',
      value: `${summary.frictionScore.toFixed(0)}/100`,
      trend: 'positive'
    });
  }
  
  // Analyze behavioral patterns
  const combatFocused = summary.topBehaviors.find(b => b.pattern === 'Combat-Focused');
  const collectors = summary.topBehaviors.find(b => b.pattern === 'Collector');
  const explorers = summary.topBehaviors.find(b => b.pattern === 'Explorer');
  
  if (combatFocused && combatFocused.frequency > 40) {
    insights.push(
      `${combatFocused.frequency.toFixed(0)}% of players are combat-focused, suggesting strong engagement with core combat mechanics.`
    );
  }
  
  if (collectors && collectors.frequency > 25) {
    insights.push(
      `${collectors.frequency.toFixed(0)}% of players show collector behavior, indicating opportunities for item-based monetization strategies.`
    );
  }
  
  if (explorers && explorers.frequency > 25) {
    insights.push(
      `${explorers.frequency.toFixed(0)}% of players are explorers, suggesting demand for expanded world content and discovery mechanics.`
    );
  }
  
  // Add session count
  keyFindings.push({
    label: 'Total Sessions',
    value: summary.totalSessions.toString(),
    trend: 'neutral'
  });
  
  // Default insight if none generated
  if (insights.length === 0) {
    insights.push(
      'Player behavior shows balanced engagement across combat, exploration, and collection systems.'
    );
  }
  
  return {
    insights: insights.slice(0, 4), // Limit to 4 key insights
    keyFindings: keyFindings.slice(0, 4) // Limit to 4 key findings
  };
}

// Made with Bob