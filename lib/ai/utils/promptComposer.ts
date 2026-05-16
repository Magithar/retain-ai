/**
 * Prompt Composer - Reusable Prompt Building Utilities
 * 
 * Provides helper functions for composing structured prompts
 * with consistent formatting and organization.
 */

import { AnalyticsSummary } from '../../analytics';
import { PromptSection, ComposedPrompt } from '../types';

/**
 * Format analytics data for prompt context
 */
export function formatAnalyticsContext(summary: AnalyticsSummary): string {
  const sections: string[] = [];
  
  sections.push('## Analytics Data Summary\n');
  
  // Session Metrics
  sections.push('### Session Metrics');
  sections.push(`- Total Sessions: ${summary.totalSessions.toLocaleString()}`);
  sections.push(`- Average Score: ${summary.averageScore.toFixed(2)}`);
  sections.push(`- Average Session Duration: ${(summary.averageScore / 100).toFixed(1)} minutes (estimated)`);
  sections.push('');
  
  // Combat Metrics
  sections.push('### Combat Performance');
  sections.push(`- Average Kills: ${summary.averageKills.toFixed(2)}`);
  sections.push(`- Average Deaths: ${summary.averageDeaths.toFixed(2)}`);
  sections.push(`- Kill/Death Ratio: ${summary.killDeathRatio.toFixed(2)}`);
  sections.push(`- Combat Intensity: ${summary.combatIntensity.toFixed(2)} damage/second`);
  sections.push(`- Average Damage Done: ${summary.averageDamageDone.toFixed(2)}`);
  sections.push(`- Average Enemies Hit: ${summary.averageEnemiesHit.toFixed(2)}`);
  sections.push(`- Combat Time: ${summary.combatTimePercentage.toFixed(1)}% of total playtime`);
  sections.push('');
  
  // Engagement Metrics
  sections.push('### Engagement Indicators');
  sections.push(`- Pickup Efficiency: ${summary.pickupEfficiency.toFixed(1)}%`);
  sections.push(`- Exploration Engagement: ${summary.explorationEngagement.toFixed(2)} units/second`);
  sections.push(`- Average Distance Traveled: ${summary.averageDistanceTraveled.toFixed(2)} units`);
  sections.push('');
  
  // Friction Indicators
  sections.push('### Friction & Risk Indicators');
  sections.push(`- Overall Friction Score: ${summary.frictionScore.toFixed(1)}/100`);
  sections.push(`- High Death Sessions: ${summary.highDeathSessions} (${((summary.highDeathSessions / summary.totalSessions) * 100).toFixed(1)}%)`);
  sections.push(`- Low Score Sessions: ${summary.lowScoreSessions} (${((summary.lowScoreSessions / summary.totalSessions) * 100).toFixed(1)}%)`);
  sections.push(`- Abandonment Rate: ${summary.abandonmentRate.toFixed(1)}%`);
  sections.push('');
  
  // Behavioral Patterns
  if (summary.topBehaviors.length > 0) {
    sections.push('### Player Behavioral Patterns');
    summary.topBehaviors.forEach(b => {
      sections.push(`- **${b.pattern}**: ${b.description}`);
      sections.push(`  - Frequency: ${b.frequency.toFixed(1)}% of sessions`);
      sections.push(`  - Impact: ${b.impact}`);
    });
    sections.push('');
  }
  
  // Anomalies
  if (summary.anomalies.length > 0) {
    sections.push('### Detected Anomalies');
    summary.anomalies.forEach(a => {
      sections.push(`- **[${a.severity.toUpperCase()}] ${a.type}**`);
      sections.push(`  - ${a.description}`);
      sections.push(`  - Affected Sessions: ${a.affectedSessions}`);
    });
    sections.push('');
  }
  
  return sections.join('\n');
}

/**
 * Create system context for AI role
 */
export function createSystemContext(
  role: string = 'expert product manager and game analytics specialist',
  gameContext: string = 'live game'
): string {
  return `You are an ${role} analyzing gameplay telemetry data for a ${gameContext}.

Your expertise includes:
- Player retention and churn analysis
- Monetization strategy and optimization
- LiveOps planning and execution
- Game balance and friction identification
- Player segmentation and behavioral analysis

Provide data-driven, actionable insights that directly tie to the metrics provided.`;
}

/**
 * Create output format specification
 */
export function createOutputFormat(format: 'json' | 'markdown' | 'structured' = 'json'): string {
  if (format === 'json') {
    return `## Output Format

Provide your analysis as a valid JSON object. Ensure all recommendations are:
- Specific and actionable
- Directly tied to the data provided
- Prioritized by impact and urgency
- Implementable within 1-2 sprint cycles

Use clear, concise language suitable for both technical and non-technical stakeholders.`;
  } else if (format === 'markdown') {
    return `## Output Format

Provide your analysis in well-structured Markdown format with:
- Clear headings and subheadings
- Bullet points for recommendations
- Bold text for emphasis on critical items
- Code blocks for any technical specifications

Ensure all recommendations are specific, actionable, and prioritized.`;
  } else {
    return `## Output Format

Provide your analysis in a structured format with clear sections for each category.
Use consistent formatting and prioritize recommendations by impact.`;
  }
}

/**
 * Compose sections into a complete prompt
 */
export function composeSections(sections: PromptSection[]): string {
  // Sort sections by priority (higher priority first)
  const sortedSections = [...sections].sort((a, b) => b.priority - a.priority);
  
  return sortedSections
    .map(section => {
      if (section.title) {
        return `${section.title}\n\n${section.content}`;
      }
      return section.content;
    })
    .join('\n\n---\n\n');
}

/**
 * Create a complete composed prompt
 */
export function createComposedPrompt(
  systemContext: string,
  dataContext: string,
  heuristicContext: string,
  analysisRequest: string,
  outputFormat: string
): ComposedPrompt {
  const sections: PromptSection[] = [
    { title: '# System Context', content: systemContext, priority: 100 },
    { title: '', content: dataContext, priority: 90 },
    { title: '', content: heuristicContext, priority: 80 },
    { title: '# Analysis Request', content: analysisRequest, priority: 70 },
    { title: '', content: outputFormat, priority: 60 }
  ];
  
  const fullPrompt = composeSections(sections);
  
  return {
    systemContext,
    dataContext,
    heuristicContext,
    analysisRequest,
    outputFormat,
    fullPrompt
  };
}

/**
 * Add focus areas to analysis request
 */
export function addFocusAreas(baseRequest: string, focusAreas: string[]): string {
  if (focusAreas.length === 0) {
    return baseRequest;
  }
  
  return `${baseRequest}

**Priority Focus Areas:**
${focusAreas.map(area => `- ${area}`).join('\n')}

Pay special attention to these areas in your analysis and recommendations.`;
}

/**
 * Add custom instructions to prompt
 */
export function addCustomInstructions(prompt: string, instructions: string): string {
  return `${prompt}

## Additional Instructions

${instructions}`;
}

/**
 * Format metric thresholds for context
 */
export function formatMetricThresholds(thresholds: Record<string, number>): string {
  const entries = Object.entries(thresholds);
  if (entries.length === 0) {
    return '';
  }
  
  const lines = entries.map(([metric, value]) => {
    const formattedMetric = metric
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
    return `- ${formattedMetric}: ${value}`;
  });
  
  return `### Key Metric Thresholds\n${lines.join('\n')}`;
}

/**
 * Create comparison context for before/after analysis
 */
export function createComparisonContext(
  beforeSummary: AnalyticsSummary,
  afterSummary: AnalyticsSummary,
  changeDescription: string
): string {
  const sections: string[] = [];
  
  sections.push(`## Comparative Analysis: ${changeDescription}\n`);
  
  // Calculate deltas
  const scoreDelta = ((afterSummary.averageScore - beforeSummary.averageScore) / beforeSummary.averageScore) * 100;
  const kdDelta = ((afterSummary.killDeathRatio - beforeSummary.killDeathRatio) / beforeSummary.killDeathRatio) * 100;
  const frictionDelta = afterSummary.frictionScore - beforeSummary.frictionScore;
  const deathDelta = ((afterSummary.averageDeaths - beforeSummary.averageDeaths) / beforeSummary.averageDeaths) * 100;
  
  sections.push('### Before Metrics');
  sections.push(`- Sessions: ${beforeSummary.totalSessions.toLocaleString()}`);
  sections.push(`- Avg Score: ${beforeSummary.averageScore.toFixed(2)}`);
  sections.push(`- K/D Ratio: ${beforeSummary.killDeathRatio.toFixed(2)}`);
  sections.push(`- Avg Deaths: ${beforeSummary.averageDeaths.toFixed(2)}`);
  sections.push(`- Friction: ${beforeSummary.frictionScore.toFixed(1)}/100`);
  sections.push('');
  
  sections.push('### After Metrics');
  sections.push(`- Sessions: ${afterSummary.totalSessions.toLocaleString()}`);
  sections.push(`- Avg Score: ${afterSummary.averageScore.toFixed(2)} (${formatDelta(scoreDelta)})`);
  sections.push(`- K/D Ratio: ${afterSummary.killDeathRatio.toFixed(2)} (${formatDelta(kdDelta)})`);
  sections.push(`- Avg Deaths: ${afterSummary.averageDeaths.toFixed(2)} (${formatDelta(deathDelta)})`);
  sections.push(`- Friction: ${afterSummary.frictionScore.toFixed(1)}/100 (${formatDelta(frictionDelta, false)})`);
  sections.push('');
  
  sections.push('### Analysis Focus');
  sections.push('Analyze the impact of this change and provide:');
  sections.push('1. Key improvements or regressions');
  sections.push('2. Unexpected side effects or correlations');
  sections.push('3. Recommendations for iteration');
  sections.push('4. Metrics to monitor going forward');
  
  return sections.join('\n');
}

/**
 * Format delta with appropriate sign and color coding
 */
function formatDelta(delta: number, higherIsBetter: boolean = true): string {
  const sign = delta > 0 ? '+' : '';
  const value = `${sign}${delta.toFixed(1)}%`;
  
  if (higherIsBetter) {
    return delta > 0 ? `${value} ✓` : `${value} ✗`;
  } else {
    return delta < 0 ? `${value} ✓` : `${value} ✗`;
  }
}

/**
 * Create JSON schema for structured output
 */
export function createJSONSchema(categories: string[]): string {
  const schemas: Record<string, string> = {
    retention: `"retentionRisks": [
    {
      "title": "Risk title",
      "description": "Detailed description",
      "severity": "critical" | "high" | "medium" | "low",
      "affectedPlayers": "percentage or count",
      "metrics": { "metricName": value },
      "recommendation": "Specific action to take"
    }
  ]`,
    friction: `"frictionPoints": [
    {
      "title": "Friction point title",
      "description": "Detailed description",
      "severity": "critical" | "high" | "medium" | "low",
      "metric": "Related metric value",
      "impactArea": "Area of impact",
      "recommendation": "Specific fix or improvement",
      "quickWins": ["Quick win 1", "Quick win 2"]
    }
  ]`,
    monetization: `"monetizationOpportunities": [
    {
      "title": "Opportunity title",
      "description": "Detailed description",
      "playerSegment": "Target player segment",
      "potentialImpact": "high" | "medium" | "low",
      "implementation": "How to implement",
      "estimatedRevenue": "Revenue estimate"
    }
  ]`,
    liveops: `"liveOpsRecommendations": [
    {
      "title": "LiveOps initiative title",
      "description": "Detailed description",
      "type": "event" | "challenge" | "content" | "balance" | "feature",
      "priority": "critical" | "high" | "medium" | "low",
      "timeline": "Implementation timeline",
      "expectedOutcome": "What this will achieve",
      "kpis": ["KPI 1", "KPI 2"]
    }
  ]`,
    segmentation: `"playerSegments": [
    {
      "segment": "Player segment name",
      "description": "Segment characteristics",
      "size": "Percentage of player base",
      "behavior": "Key behavioral traits",
      "needs": "What this segment needs",
      "monetizationPotential": "high" | "medium" | "low",
      "retentionRisk": "high" | "medium" | "low"
    }
  ]`
  };
  
  const selectedSchemas = categories
    .filter(cat => schemas[cat])
    .map(cat => schemas[cat]);
  
  return `{
  ${selectedSchemas.join(',\n  ')},
  "executiveSummary": "Brief executive summary",
  "priorityActions": ["Action 1", "Action 2", "Action 3"]
}`;
}

/**
 * Truncate prompt to maximum token length (approximate)
 */
export function truncatePrompt(prompt: string, maxTokens: number = 4000): string {
  // Rough approximation: 1 token ≈ 4 characters
  const maxChars = maxTokens * 4;
  
  if (prompt.length <= maxChars) {
    return prompt;
  }
  
  return prompt.substring(0, maxChars) + '\n\n[... truncated for length ...]';
}

// Made with Bob
