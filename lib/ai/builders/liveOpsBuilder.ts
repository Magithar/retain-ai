/**
 * LiveOps Recommendations Prompt Builder
 * 
 * Specialized prompt builder for live operations planning and execution.
 * Focuses on events, content updates, and ongoing engagement strategies.
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

export class LiveOpsPromptBuilder implements IPromptBuilder {
  buildPrompt(context: PromptContext): ComposedPrompt {
    const { summary, gameContext = 'live game', focusAreas = [], outputFormat = 'json' } = context;
    
    // Match relevant LiveOps heuristics
    const heuristicMatches = matchHeuristics(summary, {
      categories: ['liveops', 'engagement', 'retention'],
      minPriority: 'medium'
    });
    
    // Build system context
    const systemContext = createSystemContext(
      'expert LiveOps manager and content strategist',
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
    return ['liveops', 'engagement', 'retention'];
  }
  
  validateContext(context: PromptContext): boolean {
    return context.summary !== undefined;
  }
  
  private buildHeuristicContext(matches: any[]): string {
    if (matches.length === 0) {
      return '## LiveOps Strategy Guidelines\n\nDevelop LiveOps recommendations using industry best practices for live service games.';
    }
    
    const formattedHeuristics = formatHeuristicsForPrompt(matches);
    const guidance = getContextualGuidance(matches);
    
    return `${formattedHeuristics}\n\n## LiveOps Planning Guidance\n\n${guidance}`;
  }
  
  private buildAnalysisRequest(summary: any): string {
    const urgentIssues = this.identifyUrgentIssues(summary);
    const contentOpportunities = this.identifyContentOpportunities(summary);
    
    return `## LiveOps Recommendations Request

Based on the telemetry data and PM heuristics provided, develop a comprehensive LiveOps strategy focusing on:

### 1. Immediate Actions (Week 1-2)
Identify urgent LiveOps initiatives that can be deployed quickly:
- **Hotfixes**: Critical balance or friction issues requiring immediate patches
- **Quick Events**: Simple events that can be configured with existing content
- **Communication**: Player messaging about known issues or upcoming content
- **Emergency Retention**: Interventions for at-risk player segments

${urgentIssues.length > 0 ? `\n**Urgent Issues Detected:**\n${urgentIssues.map(i => `- ${i}`).join('\n')}\n` : ''}

### 2. Short-Term Content (Weeks 3-8)
Plan near-term content and events:
- **Weekly Events**: Rotating challenges and limited-time modes
- **Seasonal Content**: Themed events tied to calendar or game lore
- **Balance Patches**: Data-driven adjustments to game systems
- **Quality of Life**: UX improvements and player-requested features

### 3. Medium-Term Strategy (Months 2-4)
Develop substantial content initiatives:
- **Major Events**: Large-scale events with unique mechanics
- **Content Drops**: New maps, modes, or gameplay features
- **Battle Pass/Season**: Seasonal progression systems
- **Community Events**: Social features and community goals

### 4. Event Types & Cadence
Recommend specific event types based on player behavior:
- **Combat Events**: Tournaments, arena challenges, boss fights
- **Collection Events**: Limited-time collectibles, treasure hunts
- **Exploration Events**: New areas, discovery challenges
- **Social Events**: Cooperative goals, guild competitions
- **Progression Events**: Double XP, special rewards

Specify optimal cadence (daily, weekly, monthly) for each type.

${contentOpportunities.length > 0 ? `\n**Content Opportunities:**\n${contentOpportunities.map(o => `- ${o}`).join('\n')}\n` : ''}

### 5. Success Metrics & KPIs
Define measurable goals for each initiative:
- **Engagement**: DAU, session length, session frequency
- **Retention**: D1, D7, D30 retention rates
- **Monetization**: Conversion rate, ARPU, revenue per event
- **Community**: Social shares, content creation, player sentiment
- **Technical**: Server stability, bug reports, performance

### 6. Resource Requirements
Estimate resources needed for implementation:
- Development time and team allocation
- Art and design requirements
- QA and testing needs
- Community management and support
- Marketing and communication plans

### 7. Risk Mitigation
Identify potential risks and mitigation strategies:
- Player backlash or negative sentiment
- Technical issues or server load
- Balance disruption or exploits
- Cannibalization of existing content
- Team burnout or resource constraints`;
  }
  
  private buildOutputFormat(format: 'json' | 'markdown' | 'structured'): string {
    const baseFormat = createOutputFormat(format);
    
    if (format === 'json') {
      const schema = createJSONSchema(['liveops']);
      return `${baseFormat}

### Expected JSON Structure

${schema}

**Additional Fields:**
- "contentCalendar": Array of scheduled initiatives with dates
- "resourceRequirements": Object with team and time estimates
- "riskAssessment": Array of potential risks and mitigations
- "successMetrics": Object with KPI targets for each initiative`;
    }
    
    return baseFormat;
  }
  
  private identifyUrgentIssues(summary: any): string[] {
    const urgent: string[] = [];
    
    if (summary.frictionScore > 70) {
      urgent.push('CRITICAL: Excessive friction requires immediate UX improvements');
    }
    
    if (summary.averageDeaths > 5) {
      urgent.push('HIGH: Death rate spike needs emergency balance patch');
    }
    
    if (summary.abandonmentRate > 25) {
      urgent.push('CRITICAL: High abandonment requires retention intervention');
    }
    
    if (summary.pickupEfficiency < 50) {
      urgent.push('HIGH: Pickup interaction issues need immediate fix');
    }
    
    const criticalAnomalies = summary.anomalies?.filter((a: any) => a.severity === 'high') || [];
    if (criticalAnomalies.length > 0) {
      urgent.push(`HIGH: ${criticalAnomalies.length} critical anomalies detected requiring investigation`);
    }
    
    return urgent;
  }
  
  private identifyContentOpportunities(summary: any): string[] {
    const opportunities: string[] = [];
    
    // Combat-focused content
    const combatBehavior = summary.topBehaviors?.find((b: any) => b.pattern === 'Combat-Focused');
    if (combatBehavior && combatBehavior.frequency > 40) {
      opportunities.push(`Combat Events: ${combatBehavior.frequency.toFixed(0)}% of players are combat-focused`);
    }
    
    // Collection content
    const collectorBehavior = summary.topBehaviors?.find((b: any) => b.pattern === 'Collector');
    if (collectorBehavior && summary.pickupEfficiency > 70) {
      opportunities.push(`Collection Events: ${collectorBehavior.frequency.toFixed(0)}% of players show collector behavior`);
    }
    
    // Exploration content
    const explorerBehavior = summary.topBehaviors?.find((b: any) => b.pattern === 'Explorer');
    if (explorerBehavior) {
      opportunities.push(`Exploration Content: ${explorerBehavior.frequency.toFixed(0)}% of players are explorers`);
    }
    
    // Difficulty events for struggling players
    if (summary.averageDeaths > 4) {
      opportunities.push('Survival Challenge: Reframe difficulty as challenge event with rewards');
    }
    
    // Social/community events
    if (summary.totalSessions > 1000) {
      opportunities.push('Community Goals: Large player base suitable for server-wide events');
    }
    
    return opportunities;
  }
}

/**
 * Factory function to create LiveOps prompt builder
 */
export function createLiveOpsBuilder(): LiveOpsPromptBuilder {
  return new LiveOpsPromptBuilder();
}

/**
 * Quick build function for LiveOps analysis
 */
export function buildLiveOpsPrompt(context: PromptContext): ComposedPrompt {
  const builder = new LiveOpsPromptBuilder();
  return builder.buildPrompt(context);
}

// Made with Bob
