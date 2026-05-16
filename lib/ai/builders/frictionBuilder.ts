/**
 * Friction & Churn Analysis Prompt Builder
 * 
 * Specialized prompt builder for identifying and analyzing friction points
 * and churn indicators in player experience.
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

export class FrictionPromptBuilder implements IPromptBuilder {
  buildPrompt(context: PromptContext): ComposedPrompt {
    const { summary, gameContext = 'live game', focusAreas = [], outputFormat = 'json' } = context;
    
    // Match relevant friction and churn heuristics
    const heuristicMatches = matchHeuristics(summary, {
      categories: ['friction', 'retention'],
      minPriority: 'medium'
    });
    
    // Build system context
    const systemContext = createSystemContext(
      'expert UX analyst and player experience specialist',
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
    return ['friction', 'retention'];
  }
  
  validateContext(context: PromptContext): boolean {
    return context.summary !== undefined;
  }
  
  private buildHeuristicContext(matches: any[]): string {
    if (matches.length === 0) {
      return '## Friction Analysis Guidelines\n\nAnalyze player friction using UX best practices and behavioral psychology principles.';
    }
    
    const formattedHeuristics = formatHeuristicsForPrompt(matches);
    const guidance = getContextualGuidance(matches);
    
    return `${formattedHeuristics}\n\n## Friction Analysis Guidance\n\n${guidance}`;
  }
  
  private buildAnalysisRequest(summary: any): string {
    const frictionAreas = this.identifyFrictionAreas(summary);
    const churnSignals = this.identifyChurnSignals(summary);
    
    return `## Friction & Churn Analysis Request

Based on the telemetry data and PM heuristics provided, conduct a comprehensive friction and churn analysis focusing on:

### 1. Friction Point Identification
Identify specific areas where players experience frustration or difficulty:

**Interaction Friction:**
- Pickup/collection mechanics (success rates, feedback clarity)
- Combat controls and responsiveness
- Navigation and wayfinding
- UI/UX clarity and intuitiveness

**Progression Friction:**
- Difficulty spikes or walls
- Unclear objectives or goals
- Slow or unrewarding progression
- Gating or artificial barriers

**Technical Friction:**
- Performance issues or lag
- Loading times
- Bugs or glitches
- Inconsistent behavior

**Cognitive Friction:**
- Complex or confusing mechanics
- Information overload
- Unclear feedback or consequences
- Steep learning curves

${frictionAreas.length > 0 ? `\n**Detected Friction Areas:**\n${frictionAreas.map(f => `- ${f}`).join('\n')}\n` : ''}

### 2. Churn Indicator Analysis
Identify early warning signs and patterns that predict player churn:

**Behavioral Indicators:**
- Session frequency decline
- Session length reduction
- Engagement drop-off patterns
- Abandonment of core loops

**Performance Indicators:**
- Repeated failures or deaths
- Low score progression
- Lack of achievement unlocks
- Minimal social interaction

**Sentiment Indicators:**
- Frustration signals (rage quits)
- Disengagement patterns
- Avoidance of certain content
- Reduced exploration or experimentation

${churnSignals.length > 0 ? `\n**Churn Warning Signals:**\n${churnSignals.map(s => `- ${s}`).join('\n')}\n` : ''}

### 3. Root Cause Analysis
For each friction point, identify the underlying causes:
- Is it a design issue, technical issue, or communication issue?
- Is it affecting all players or specific segments?
- Is it a new issue or long-standing problem?
- What is the severity and urgency of addressing it?

### 4. Impact Assessment
Quantify the impact of each friction point:
- **Player Impact**: Percentage of players affected
- **Severity**: How badly it affects player experience
- **Churn Risk**: Likelihood of causing player churn
- **Revenue Impact**: Effect on monetization potential
- **Viral Impact**: Effect on word-of-mouth and acquisition

### 5. Quick Wins vs. Long-Term Fixes
Categorize solutions by implementation complexity:

**Quick Wins (1-2 weeks):**
- Parameter adjustments (damage, health, timers)
- UI tweaks and feedback improvements
- Tooltip or tutorial additions
- Simple balance changes

**Medium-Term (1-2 months):**
- Feature additions or modifications
- Substantial UX improvements
- Content additions
- System redesigns

**Long-Term (3+ months):**
- Major feature overhauls
- Engine or technical improvements
- Fundamental game design changes
- New systems or modes

### 6. Prioritization Framework
Recommend prioritization based on:
- **Impact**: High/Medium/Low player experience improvement
- **Effort**: Development time and resources required
- **Risk**: Potential negative side effects
- **Dependencies**: Prerequisites or blockers
- **ROI**: Expected return on investment

### 7. Validation Strategy
Suggest methods to validate friction fixes:
- A/B testing approaches
- Metrics to monitor
- Success criteria
- Rollback plans if issues arise`;
  }
  
  private buildOutputFormat(format: 'json' | 'markdown' | 'structured'): string {
    const baseFormat = createOutputFormat(format);
    
    if (format === 'json') {
      const schema = createJSONSchema(['friction', 'retention']);
      return `${baseFormat}

### Expected JSON Structure

${schema}

**Additional Fields:**
- "churnIndicators": Array of early warning signs with detection methods
- "rootCauses": Object mapping friction points to underlying causes
- "impactAssessment": Object with quantified impact metrics
- "prioritizedFixes": Array of solutions ordered by priority
- "validationPlan": Object with testing and monitoring strategy`;
    }
    
    return baseFormat;
  }
  
  private identifyFrictionAreas(summary: any): string[] {
    const areas: string[] = [];
    
    if (summary.pickupEfficiency < 70) {
      areas.push(`Pickup Interaction: ${summary.pickupEfficiency.toFixed(1)}% success rate (target: >80%)`);
    }
    
    if (summary.combatIntensity < 10) {
      areas.push(`Combat Pacing: ${summary.combatIntensity.toFixed(2)} DPS indicates slow combat`);
    }
    
    if (summary.explorationEngagement < 5) {
      areas.push(`Navigation: ${summary.explorationEngagement.toFixed(2)} units/sec suggests wayfinding issues`);
    }
    
    if (summary.averageDeaths > 4) {
      areas.push(`Difficulty Balance: ${summary.averageDeaths.toFixed(1)} deaths/session indicates frustration`);
    }
    
    if (summary.frictionScore > 60) {
      areas.push(`Overall Experience: Friction score of ${summary.frictionScore.toFixed(1)}/100 is critically high`);
    }
    
    const zeroScoreAnomaly = summary.anomalies?.find((a: any) => a.type === 'Zero Score Sessions');
    if (zeroScoreAnomaly) {
      areas.push(`Progression Failure: ${zeroScoreAnomaly.affectedSessions} sessions with zero score`);
    }
    
    if (summary.combatTimePercentage > 60 && summary.averageKills < 5) {
      areas.push(`Combat Efficiency: High combat time but low kills suggests hit detection issues`);
    }
    
    return areas;
  }
  
  private identifyChurnSignals(summary: any): string[] {
    const signals: string[] = [];
    
    if (summary.abandonmentRate > 15) {
      signals.push(`Early Abandonment: ${summary.abandonmentRate.toFixed(1)}% of sessions show early quit patterns`);
    }
    
    if (summary.highDeathSessions > summary.totalSessions * 0.3) {
      signals.push(`Death Frustration: ${((summary.highDeathSessions / summary.totalSessions) * 100).toFixed(1)}% of sessions have excessive deaths`);
    }
    
    if (summary.killDeathRatio < 0.8) {
      signals.push(`Powerlessness: K/D ratio of ${summary.killDeathRatio.toFixed(2)} creates sense of failure`);
    }
    
    if (summary.lowScoreSessions > summary.totalSessions * 0.25) {
      signals.push(`Low Achievement: ${((summary.lowScoreSessions / summary.totalSessions) * 100).toFixed(1)}% of sessions have minimal progression`);
    }
    
    const combatAvoidance = summary.anomalies?.find((a: any) => a.type === 'Combat Avoidance');
    if (combatAvoidance) {
      signals.push(`System Avoidance: ${combatAvoidance.affectedSessions} sessions show combat avoidance behavior`);
    }
    
    const highSeverityAnomalies = summary.anomalies?.filter((a: any) => a.severity === 'high') || [];
    if (highSeverityAnomalies.length > 0) {
      signals.push(`Critical Issues: ${highSeverityAnomalies.length} high-severity anomalies detected`);
    }
    
    return signals;
  }
}

/**
 * Factory function to create friction prompt builder
 */
export function createFrictionBuilder(): FrictionPromptBuilder {
  return new FrictionPromptBuilder();
}

/**
 * Quick build function for friction analysis
 */
export function buildFrictionPrompt(context: PromptContext): ComposedPrompt {
  const builder = new FrictionPromptBuilder();
  return builder.buildPrompt(context);
}

// Made with Bob
