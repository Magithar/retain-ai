/**
 * Player Segmentation Prompt Builder
 * 
 * Specialized prompt builder for player segmentation and behavioral analysis.
 * Focuses on identifying distinct player types and their unique needs.
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

export class SegmentationPromptBuilder implements IPromptBuilder {
  buildPrompt(context: PromptContext): ComposedPrompt {
    const { summary, gameContext = 'live game', focusAreas = [], outputFormat = 'json' } = context;
    
    // Match relevant segmentation heuristics
    const heuristicMatches = matchHeuristics(summary, {
      categories: ['segmentation', 'monetization', 'retention'],
      minPriority: 'medium'
    });
    
    // Build system context
    const systemContext = createSystemContext(
      'expert player psychologist and behavioral analyst',
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
    return ['segmentation', 'monetization', 'retention'];
  }
  
  validateContext(context: PromptContext): boolean {
    return context.summary !== undefined;
  }
  
  private buildHeuristicContext(matches: any[]): string {
    if (matches.length === 0) {
      return '## Player Segmentation Guidelines\n\nAnalyze player segments using behavioral psychology and player motivation theory.';
    }
    
    const formattedHeuristics = formatHeuristicsForPrompt(matches);
    const guidance = getContextualGuidance(matches);
    
    return `${formattedHeuristics}\n\n## Segmentation Analysis Guidance\n\n${guidance}`;
  }
  
  private buildAnalysisRequest(summary: any): string {
    const detectedBehaviors = this.summarizeDetectedBehaviors(summary);
    
    return `## Player Segmentation Analysis Request

Based on the telemetry data and PM heuristics provided, conduct a comprehensive player segmentation analysis focusing on:

### 1. Behavioral Segmentation
Identify distinct player segments based on behavioral patterns:

**Play Style Segments:**
- **Combat Enthusiasts**: Players who prioritize combat and competitive play
- **Collectors**: Players focused on gathering items and completing collections
- **Explorers**: Players who enjoy discovery and world exploration
- **Achievers**: Players driven by progression and goal completion
- **Socializers**: Players motivated by community and cooperation

**Engagement Segments:**
- **Core Players**: High engagement, frequent sessions, long playtime
- **Casual Players**: Moderate engagement, shorter sessions, less frequent
- **Lapsed Players**: Previously engaged but showing decline
- **At-Risk Players**: Low engagement with churn indicators

**Skill Segments:**
- **Veterans**: High skill, strong performance metrics
- **Intermediate**: Moderate skill, average performance
- **Novices**: Low skill, struggling with mechanics
- **Improving**: Showing positive skill progression

${detectedBehaviors.length > 0 ? `\n**Detected Behavioral Patterns:**\n${detectedBehaviors.map(b => `- ${b}`).join('\n')}\n` : ''}

### 2. Segment Characteristics
For each identified segment, provide:

**Demographics:**
- Estimated size (percentage of player base)
- Growth trend (growing, stable, declining)
- Overlap with other segments

**Behavioral Traits:**
- Primary motivations and goals
- Typical play patterns and session characteristics
- Preferred content and activities
- Social behavior and community engagement

**Performance Metrics:**
- Average score and progression rate
- Combat performance (K/D, damage, etc.)
- Engagement metrics (session length, frequency)
- Friction and satisfaction indicators

**Psychographic Profile:**
- Player motivations (Bartle taxonomy: Achiever, Explorer, Socializer, Killer)
- Risk tolerance and challenge preference
- Spending propensity and monetization potential
- Retention risk level

### 3. Segment Needs & Opportunities
Identify what each segment needs to thrive:

**Content Needs:**
- What type of content appeals to this segment?
- What features or modes would increase engagement?
- What pain points need addressing?

**Monetization Opportunities:**
- What would this segment pay for?
- Optimal price points and offer types
- Conversion likelihood and LTV potential

**Retention Strategies:**
- What keeps this segment engaged?
- What causes this segment to churn?
- How to re-engage lapsed members?

**Communication Approach:**
- What messaging resonates with this segment?
- Preferred communication channels
- Optimal notification frequency

### 4. Segment Prioritization
Rank segments by strategic importance:

**High Priority Segments:**
- Large size with high monetization potential
- At-risk segments requiring intervention
- Growth segments to nurture

**Medium Priority Segments:**
- Stable segments with optimization opportunities
- Niche segments with specific needs

**Low Priority Segments:**
- Small segments with limited impact
- Segments with conflicting needs

### 5. Cross-Segment Analysis
Identify patterns across segments:
- Common pain points affecting multiple segments
- Opportunities that benefit multiple segments
- Conflicts between segment needs
- Segment migration patterns (how players move between segments)

### 6. Actionable Recommendations
Provide segment-specific recommendations:
- Content and feature priorities for each segment
- Monetization strategies tailored to each segment
- Retention initiatives for at-risk segments
- Communication and marketing approaches
- A/B testing opportunities to validate segment hypotheses

### 7. Measurement Framework
Define how to track and measure segments:
- Key metrics for each segment
- Segment health indicators
- Migration tracking (segment movement)
- Success criteria for segment-focused initiatives`;
  }
  
  private buildOutputFormat(format: 'json' | 'markdown' | 'structured'): string {
    const baseFormat = createOutputFormat(format);
    
    if (format === 'json') {
      const schema = createJSONSchema(['segmentation']);
      return `${baseFormat}

### Expected JSON Structure

${schema}

**Additional Fields:**
- "segmentPriorities": Array of segments ordered by strategic importance
- "crossSegmentInsights": Object with patterns affecting multiple segments
- "migrationPatterns": Array describing how players move between segments
- "measurementFramework": Object with tracking metrics for each segment`;
    }
    
    return baseFormat;
  }
  
  private summarizeDetectedBehaviors(summary: any): string[] {
    const behaviors: string[] = [];
    
    if (summary.topBehaviors && summary.topBehaviors.length > 0) {
      summary.topBehaviors.forEach((b: any) => {
        behaviors.push(`${b.pattern}: ${b.frequency.toFixed(1)}% of sessions - ${b.description}`);
      });
    }
    
    // Add derived insights
    if (summary.combatTimePercentage > 60) {
      behaviors.push(`High Combat Focus: ${summary.combatTimePercentage.toFixed(1)}% of playtime in combat`);
    }
    
    if (summary.pickupEfficiency > 70) {
      behaviors.push(`Strong Collection Behavior: ${summary.pickupEfficiency.toFixed(1)}% pickup success rate`);
    }
    
    if (summary.explorationEngagement > 8) {
      behaviors.push(`Active Exploration: ${summary.explorationEngagement.toFixed(2)} units/sec movement during exploration`);
    }
    
    if (summary.averageDeaths > 4) {
      behaviors.push(`Struggling Players: ${summary.averageDeaths.toFixed(1)} deaths/session indicates difficulty`);
    }
    
    if (summary.averageScore > 1000) {
      behaviors.push(`High Performers: Average score of ${summary.averageScore.toFixed(0)} indicates skilled players`);
    }
    
    return behaviors;
  }
}

/**
 * Factory function to create segmentation prompt builder
 */
export function createSegmentationBuilder(): SegmentationPromptBuilder {
  return new SegmentationPromptBuilder();
}

/**
 * Quick build function for segmentation analysis
 */
export function buildSegmentationPrompt(context: PromptContext): ComposedPrompt {
  const builder = new SegmentationPromptBuilder();
  return builder.buildPrompt(context);
}

// Made with Bob
