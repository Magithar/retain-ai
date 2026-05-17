/**
 * AI Prompt Builder for IBM Granite
 * 
 * Generates structured prompts for AI-powered product management insights
 * based on gameplay telemetry analytics.
 */

import { AnalyticsSummary } from '../analytics';

export interface AIPromptContext {
  summary: AnalyticsSummary;
  gameContext?: string;
  focusAreas?: string[];
}

/**
 * Build a comprehensive prompt for AI insight generation
 */
export function buildInsightPrompt(context: AIPromptContext): string {
  const { summary, gameContext = 'live game', focusAreas = [] } = context;
  
  const prompt = `You are an expert product manager and game analytics specialist analyzing gameplay telemetry data for a ${gameContext}.

## Telemetry Summary

**Dataset Quality:** ${summary.capabilitySummary.quality}
**Available Telemetry:** ${summary.capabilitySummary.available.join(', ') || 'None'}

**Telemetry Entry Metrics:**
- Total Telemetry Entries: ${summary.totalSessions.toLocaleString()}
- Average Score: ${summary.averageScore?.toFixed(2) ?? 'N/A'}
- Average Kills: ${summary.averageKills?.toFixed(2) ?? 'N/A'}
- Average Deaths: ${summary.averageDeaths?.toFixed(2) ?? 'N/A'}
- Kill/Death Ratio: ${summary.killDeathRatio?.toFixed(2) ?? 'N/A'}

**Combat Metrics:**
${summary.capabilities.combat.available ? `
- Combat Intensity: ${summary.combatIntensity?.toFixed(2) ?? 'N/A'} damage/second
- Average Damage Done: ${summary.averageDamageDone?.toFixed(2) ?? 'N/A'}
- Average Enemies Hit: ${summary.averageEnemiesHit?.toFixed(2) ?? 'N/A'}
- Combat Time: ${summary.combatTimePercentage?.toFixed(1) ?? 'N/A'}% of total playtime
` : '- Combat telemetry unavailable in uploaded dataset'}

**Engagement Metrics:**
${summary.capabilities.pickup.available ? `- Pickup Efficiency: ${summary.pickupEfficiency?.toFixed(1) ?? 'N/A'}%` : '- Pickup telemetry unavailable'}
${summary.capabilities.movement.available ? `
- Exploration Engagement: ${summary.explorationEngagement?.toFixed(2) ?? 'N/A'} units/second
- Average Distance Traveled: ${summary.averageDistanceTraveled?.toFixed(2) ?? 'N/A'} units
` : '- Movement telemetry unavailable'}

**Friction Indicators:**
- Friction Score: ${summary.frictionScore.toFixed(1)}/100
- High Death Telemetry Entries: ${summary.highDeathSessions} (${((summary.highDeathSessions / summary.totalSessions) * 100).toFixed(1)}%)
- Low Score Telemetry Entries: ${summary.lowScoreSessions} (${((summary.lowScoreSessions / summary.totalSessions) * 100).toFixed(1)}%)
- Abandonment Rate: ${summary.abandonmentRate.toFixed(1)}%

**Behavioral Patterns:**
${summary.topBehaviors.map(b => `- ${b.pattern}: ${b.description} (${b.frequency.toFixed(1)}% of telemetry entries, ${b.impact} impact)`).join('\n')}

**Detected Anomalies:**
${summary.anomalies.map(a => `- [${a.severity.toUpperCase()}] ${a.type}: ${a.description} (${a.affectedSessions} telemetry entries)`).join('\n')}

## Analysis Request

Based on this telemetry data, provide actionable product management insights in the following categories:

1. **Retention Risks**: Identify specific player behaviors or metrics that indicate churn risk. Focus on patterns that suggest players may stop playing.

2. **Friction Points**: Highlight areas where players are struggling or experiencing poor UX. Include specific metrics that indicate friction.

3. **Monetization Opportunities**: Suggest data-driven monetization strategies based on player behavior patterns. Consider engagement levels and player segments.

4. **LiveOps Recommendations**: Propose specific live operations initiatives (events, challenges, content updates) that would address the identified issues and capitalize on positive behaviors.

5. **Player Behavior Insights**: Provide deep analysis of player segments and their behaviors. Identify distinct player types and their needs.

${focusAreas.length > 0 ? `\n**Priority Focus Areas:** ${focusAreas.join(', ')}\n` : ''}

## Output Format

Provide your analysis as a structured JSON object with the following schema:

{
  "retentionRisks": [
    {
      "title": "Risk title",
      "description": "Detailed description",
      "severity": "high" | "medium" | "low",
      "affectedPlayers": "percentage or count",
      "recommendation": "Specific action to take"
    }
  ],
  "frictionPoints": [
    {
      "title": "Friction point title",
      "description": "Detailed description",
      "severity": "high" | "medium" | "low",
      "metric": "Related metric value",
      "recommendation": "Specific fix or improvement"
    }
  ],
  "monetizationOpportunities": [
    {
      "title": "Opportunity title",
      "description": "Detailed description",
      "playerSegment": "Target player segment",
      "potentialImpact": "high" | "medium" | "low",
      "implementation": "How to implement"
    }
  ],
  "liveOpsSuggestions": [
    {
      "title": "LiveOps initiative title",
      "description": "Detailed description",
      "type": "event" | "challenge" | "content" | "balance",
      "priority": "high" | "medium" | "low",
      "expectedOutcome": "What this will achieve"
    }
  ],
  "playerInsights": [
    {
      "segment": "Player segment name",
      "description": "Segment characteristics",
      "size": "Percentage of player base",
      "behavior": "Key behavioral traits",
      "needs": "What this segment needs"
    }
  ]
}

Ensure all recommendations are specific, actionable, and directly tied to the telemetry data provided.`;

  return prompt;
}

/**
 * Build a focused prompt for specific analysis areas
 */
export function buildFocusedPrompt(
  context: AIPromptContext,
  focusArea: 'retention' | 'monetization' | 'engagement' | 'balance'
): string {
  const { summary } = context;
  
  const baseContext = `Analyzing gameplay telemetry for ${summary.totalSessions} telemetry entries with:
- Average Score: ${summary.averageScore?.toFixed(2) ?? 'N/A'}
- K/D Ratio: ${summary.killDeathRatio?.toFixed(2) ?? 'N/A'}
- Friction Score: ${summary.frictionScore.toFixed(1)}/100
- Pickup Efficiency: ${summary.pickupEfficiency?.toFixed(1) ?? 'N/A'}%`;

  switch (focusArea) {
    case 'retention':
      return `${baseContext}

Focus: Player Retention Analysis

Key Concerns:
- ${summary.highDeathSessions} telemetry entries with high death counts
- ${summary.abandonmentRate.toFixed(1)}% abandonment rate
- ${summary.anomalies.filter(a => a.severity === 'high').length} high-severity anomalies

Provide 3-5 specific retention risks with actionable recommendations.`;

    case 'monetization':
      return `${baseContext}

Focus: Monetization Strategy

Player Behaviors:
${summary.topBehaviors.slice(0, 3).map(b => `- ${b.pattern}: ${b.frequency.toFixed(1)}%`).join('\n')}

Provide 3-5 monetization opportunities that align with observed player behaviors.`;

    case 'engagement':
      return `${baseContext}

Focus: Player Engagement

Metrics:
- Combat Time: ${summary.combatTimePercentage?.toFixed(1) ?? 'N/A'}%
- Exploration: ${summary.explorationEngagement?.toFixed(2) ?? 'N/A'} units/sec
- Collection: ${summary.pickupEfficiency?.toFixed(1) ?? 'N/A'}% efficiency

Provide 3-5 engagement improvement recommendations.`;

    case 'balance':
      return `${baseContext}

Focus: Game Balance

Combat Metrics:
- Combat Intensity: ${summary.combatIntensity?.toFixed(2) ?? 'N/A'}
- Average Deaths: ${summary.averageDeaths?.toFixed(2) ?? 'N/A'}
- K/D Ratio: ${summary.killDeathRatio?.toFixed(2) ?? 'N/A'}

Anomalies:
${summary.anomalies.slice(0, 3).map(a => `- ${a.type}: ${a.description}`).join('\n')}

Provide 3-5 balance adjustments to improve player experience.`;

    default:
      return buildInsightPrompt(context);
  }
}

/**
 * Build a prompt for comparative analysis (e.g., before/after updates)
 */
export function buildComparativePrompt(
  beforeSummary: AnalyticsSummary,
  afterSummary: AnalyticsSummary,
  changeDescription: string
): string {
  const scoreDelta = (afterSummary.averageScore !== null && beforeSummary.averageScore !== null)
    ? ((afterSummary.averageScore - beforeSummary.averageScore) / beforeSummary.averageScore) * 100
    : 0;
  const kdDelta = (afterSummary.killDeathRatio !== null && beforeSummary.killDeathRatio !== null)
    ? ((afterSummary.killDeathRatio - beforeSummary.killDeathRatio) / beforeSummary.killDeathRatio) * 100
    : 0;
  const frictionDelta = afterSummary.frictionScore - beforeSummary.frictionScore;
  
  return `Comparative Analysis: ${changeDescription}

## Before Metrics
- Telemetry Entries: ${beforeSummary.totalSessions}
- Avg Score: ${beforeSummary.averageScore?.toFixed(2) ?? 'N/A'}
- K/D Ratio: ${beforeSummary.killDeathRatio?.toFixed(2) ?? 'N/A'}
- Friction: ${beforeSummary.frictionScore.toFixed(1)}/100

## After Metrics
- Telemetry Entries: ${afterSummary.totalSessions}
- Avg Score: ${afterSummary.averageScore?.toFixed(2) ?? 'N/A'} (${scoreDelta > 0 ? '+' : ''}${scoreDelta.toFixed(1)}%)
- K/D Ratio: ${afterSummary.killDeathRatio?.toFixed(2) ?? 'N/A'} (${kdDelta > 0 ? '+' : ''}${kdDelta.toFixed(1)}%)
- Friction: ${afterSummary.frictionScore.toFixed(1)}/100 (${frictionDelta > 0 ? '+' : ''}${frictionDelta.toFixed(1)})

Analyze the impact of this change and provide:
1. Key improvements or regressions
2. Unexpected side effects
3. Recommendations for iteration
4. Metrics to monitor going forward`;
}

/**
 * Extract key metrics for quick summary
 */
export function extractKeyMetrics(summary: AnalyticsSummary): Record<string, string | number | null> {
  return {
    totalSessions: summary.totalSessions,
    averageScore: summary.averageScore !== null ? parseFloat(summary.averageScore.toFixed(2)) : null,
    killDeathRatio: summary.killDeathRatio !== null ? parseFloat(summary.killDeathRatio.toFixed(2)) : null,
    frictionScore: parseFloat(summary.frictionScore.toFixed(1)),
    pickupEfficiency: summary.pickupEfficiency !== null ? parseFloat(summary.pickupEfficiency.toFixed(1)) : null,
    combatTimePercentage: summary.combatTimePercentage !== null ? parseFloat(summary.combatTimePercentage.toFixed(1)) : null,
    topBehavior: summary.topBehaviors[0]?.pattern || 'None',
    criticalAnomalies: summary.anomalies.filter(a => a.severity === 'high').length
  };
}

// Made with Bob
