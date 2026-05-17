/**
 * Retention Analysis Prompt Builder
 * 
 * Specialized prompt builder for player retention and churn analysis.
 * Focuses on identifying retention risks and churn prevention strategies.
 */

import { IPromptBuilder, PromptContext, ComposedPrompt, HeuristicCategory } from '../types';
import { matchHeuristics, formatHeuristicsForPrompt, getContextualGuidance } from '../utils/heuristicMatcher';
import {
  createSystemContext,
  formatAnalyticsContext,
  createOutputFormat,
  createComposedPrompt,
  addFocusAreas,
  createJSONSchema
} from '../utils/promptComposer';

export class RetentionPromptBuilder implements IPromptBuilder {
  buildPrompt(context: PromptContext): ComposedPrompt {
    const { summary, gameContext = 'live game', focusAreas = [], outputFormat = 'json' } = context;
    
    // Match relevant retention heuristics
    const heuristicMatches = matchHeuristics(summary, {
      categories: ['retention', 'friction'],
      minPriority: 'medium'
    });
    
    // Build system context
    const systemContext = createSystemContext(
      'expert player retention specialist and churn analyst',
      gameContext
    );
    
    // Build data context
    const dataContext = formatAnalyticsContext(summary);
    
    // Build heuristic context
    const heuristicContext = this.buildHeuristicContext(heuristicMatches);
    
    // Build analysis request
    let analysisRequest = this.buildAnalysisRequest(summary);
    if (focusAreas.length > 0) {
      analysisRequest = addFocusAreas(analysisRequest, focusAreas);
    }
    
    // Build output format
    const outputSpec = this.buildOutputFormat(outputFormat);
    
    return createComposedPrompt(
      systemContext,
      dataContext,
      heuristicContext,
      analysisRequest,
      outputSpec
    );
  }
  
  getRequiredHeuristics(): HeuristicCategory[] {
    return ['retention', 'friction'];
  }
  
  validateContext(context: PromptContext): boolean {
    return context.summary !== undefined;
  }
  
  private buildHeuristicContext(matches: any[]): string {
    if (matches.length === 0) {
      return '## Retention Analysis Guidelines\n\nAnalyze player retention using industry best practices and behavioral psychology principles.';
    }
    
    const formattedHeuristics = formatHeuristicsForPrompt(matches);
    const guidance = getContextualGuidance(matches);
    
    return `${formattedHeuristics}\n\n## Analysis Guidance\n\n${guidance}`;
  }
  
  private buildAnalysisRequest(summary: any): string {
    const criticalMetrics = this.identifyCriticalMetrics(summary);
    
    return `## Retention Analysis Request

Based on the telemetry data and PM heuristics provided, conduct a comprehensive retention analysis focusing on:

### 1. Churn Risk Identification
Identify specific player behaviors, metrics, or patterns that indicate high churn risk:
- Analyze death rates, abandonment patterns, and friction indicators
- Identify early warning signs of player disengagement
- Segment players by churn risk level (critical, high, medium, low)
- Quantify the percentage of players affected by each risk

### 2. Retention Drivers
Identify what keeps players engaged and coming back:
- Positive behavioral patterns that correlate with retention
- Successful player journeys and progression paths
- Engagement hooks that drive repeat sessions
- Social or competitive elements that increase stickiness

### 3. Critical Intervention Points
Pinpoint specific moments where intervention can prevent churn:
- First session experience (FTUE)
- Early game progression (Days 1-7)
- Mid-game plateau points
- Re-engagement opportunities for lapsed players

### 4. Actionable Recommendations
Provide specific, prioritized recommendations to improve retention:
- Quick wins that can be implemented immediately
- Medium-term improvements (1-2 sprints)
- Long-term strategic initiatives
- A/B test suggestions for validation

${criticalMetrics.length > 0 ? `\n### Critical Metrics Requiring Attention\n${criticalMetrics.map(m => `- ${m}`).join('\n')}` : ''}

### 5. Success Metrics
Define KPIs to measure retention improvement:
- Day 1, Day 7, Day 30 retention targets
- Session frequency and length goals
- Churn rate reduction targets
- Engagement score improvements`;
  }
  
  private buildOutputFormat(format: 'json' | 'markdown' | 'structured'): string {
    const baseFormat = createOutputFormat(format);
    
    if (format === 'json') {
      const schema = createJSONSchema(['retention']);
      return `${baseFormat}

### Expected JSON Structure

${schema}

**Additional Fields:**
- "churnIndicators": Array of early warning signs
- "retentionDrivers": Array of positive engagement factors
- "interventionPoints": Array of critical moments for intervention
- "successMetrics": Object with KPI targets`;
    }
    
    return baseFormat;
  }
  
  private identifyCriticalMetrics(summary: any): string[] {
    const critical: string[] = [];
    
    if (summary.averageDeaths > 4) {
      critical.push(`High death rate: ${summary.averageDeaths.toFixed(1)} deaths/entry (target: <3)`);
    }
    
    if (summary.abandonmentRate > 15) {
      critical.push(`High abandonment: ${summary.abandonmentRate.toFixed(1)}% (target: <10%)`);
    }
    
    if (summary.frictionScore > 60) {
      critical.push(`Excessive friction: ${summary.frictionScore.toFixed(1)}/100 (target: <40)`);
    }
    
    if (summary.killDeathRatio < 1) {
      critical.push(`Negative K/D ratio: ${summary.killDeathRatio.toFixed(2)} (target: >1.2)`);
    }
    
    if (summary.lowScoreSessions > summary.totalSessions * 0.2) {
      critical.push(`High low-score entries: ${((summary.lowScoreSessions / summary.totalSessions) * 100).toFixed(1)}% (target: <15%)`);
    }
    
    return critical;
  }
}

/**
 * Factory function to create retention prompt builder
 */
export function createRetentionBuilder(): RetentionPromptBuilder {
  return new RetentionPromptBuilder();
}

/**
 * Quick build function for retention analysis
 */
export function buildRetentionPrompt(context: PromptContext): ComposedPrompt {
  const builder = new RetentionPromptBuilder();
  return builder.buildPrompt(context);
}

// Made with Bob
