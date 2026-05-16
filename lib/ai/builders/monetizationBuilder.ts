/**
 * Monetization Analysis Prompt Builder
 * 
 * Specialized prompt builder for monetization strategy and optimization.
 * Focuses on identifying revenue opportunities and player spending patterns.
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

export class MonetizationPromptBuilder implements IPromptBuilder {
  buildPrompt(context: PromptContext): ComposedPrompt {
    const { summary, gameContext = 'live game', focusAreas = [], outputFormat = 'json' } = context;
    
    // Match relevant monetization heuristics
    const heuristicMatches = matchHeuristics(summary, {
      categories: ['monetization', 'segmentation'],
      minPriority: 'medium'
    });
    
    // Build system context
    const systemContext = createSystemContext(
      'expert monetization strategist and game economist',
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
    return ['monetization', 'segmentation'];
  }
  
  validateContext(context: PromptContext): boolean {
    return context.summary !== undefined;
  }
  
  private buildHeuristicContext(matches: any[]): string {
    if (matches.length === 0) {
      return '## Monetization Strategy Guidelines\n\nAnalyze monetization opportunities using F2P best practices and player psychology principles.';
    }
    
    const formattedHeuristics = formatHeuristicsForPrompt(matches);
    const guidance = getContextualGuidance(matches);
    
    return `${formattedHeuristics}\n\n## Monetization Guidance\n\n${guidance}`;
  }
  
  private buildAnalysisRequest(summary: any): string {
    const playerSegments = this.identifyMonetizationSegments(summary);
    
    return `## Monetization Analysis Request

Based on the telemetry data and PM heuristics provided, conduct a comprehensive monetization analysis focusing on:

### 1. Player Segment Monetization
Identify and analyze monetization opportunities for each player segment:
- **Whales/High Spenders**: Top 10% performers with high engagement
- **Dolphins/Mid Spenders**: Engaged players with moderate spending potential
- **Minnows/Low Spenders**: Casual players with occasional purchase intent
- **Non-Payers**: Free players who may convert with right offers

For each segment, specify:
- Behavioral characteristics and size
- Optimal monetization strategies
- Price points and offer types
- Conversion likelihood and LTV potential

### 2. Monetization Opportunities
Identify specific revenue opportunities based on player behavior:
- **Cosmetic Items**: Skins, customization, collectibles
- **Power Items**: Boosts, upgrades, convenience items
- **Content**: DLC, expansions, premium areas
- **Progression**: Battle passes, VIP memberships, XP boosters
- **Convenience**: Time-savers, quality-of-life improvements

### 3. Pricing Strategy
Recommend optimal pricing and offer structures:
- Entry-level offers for first-time buyers
- Mid-tier value packs for regular spenders
- Premium bundles for high-value players
- Limited-time offers and FOMO mechanics
- Subscription models (battle pass, VIP)

### 4. Monetization Without Harm
Ensure monetization doesn't damage player experience:
- Avoid pay-to-win mechanics that create unfair advantages
- Maintain game balance and competitive integrity
- Provide meaningful free-to-play progression
- Frame purchases as optional enhancements, not requirements
- Consider ethical implications and player sentiment

${playerSegments.length > 0 ? `\n### Identified Player Segments\n${playerSegments.map(s => `- ${s}`).join('\n')}` : ''}

### 5. Implementation Roadmap
Provide a phased implementation plan:
- **Phase 1 (Immediate)**: Quick wins with minimal development
- **Phase 2 (1-2 months)**: Core monetization features
- **Phase 3 (3-6 months)**: Advanced systems and optimization
- A/B testing strategy for validation
- Revenue projections and success metrics`;
  }
  
  private buildOutputFormat(format: 'json' | 'markdown' | 'structured'): string {
    const baseFormat = createOutputFormat(format);
    
    if (format === 'json') {
      const schema = createJSONSchema(['monetization', 'segmentation']);
      return `${baseFormat}

### Expected JSON Structure

${schema}

**Additional Fields:**
- "pricingStrategy": Object with recommended price points
- "implementationRoadmap": Array of phased initiatives
- "revenueProjections": Object with estimated revenue impact
- "ethicalConsiderations": Array of potential concerns`;
    }
    
    return baseFormat;
  }
  
  private identifyMonetizationSegments(summary: any): string[] {
    const segments: string[] = [];
    
    // High performers (potential whales)
    if (summary.averageScore > 1000) {
      segments.push('High Performers: Strong monetization potential through premium content and status items');
    }
    
    // Combat enthusiasts
    const combatBehavior = summary.topBehaviors?.find((b: any) => b.pattern === 'Combat-Focused');
    if (combatBehavior) {
      segments.push(`Combat Enthusiasts (${combatBehavior.frequency.toFixed(1)}%): Monetize through weapon skins and power items`);
    }
    
    // Collectors
    const collectorBehavior = summary.topBehaviors?.find((b: any) => b.pattern === 'Collector');
    if (collectorBehavior && summary.pickupEfficiency > 70) {
      segments.push(`Collectors (${collectorBehavior.frequency.toFixed(1)}%): High conversion on cosmetics and collectibles`);
    }
    
    // Explorers
    const explorerBehavior = summary.topBehaviors?.find((b: any) => b.pattern === 'Explorer');
    if (explorerBehavior) {
      segments.push(`Explorers (${explorerBehavior.frequency.toFixed(1)}%): Monetize through map DLC and discovery content`);
    }
    
    // Struggling players (convenience monetization)
    if (summary.frictionScore > 50) {
      segments.push('Struggling Players: Opportunity for convenience items and assistance features');
    }
    
    return segments;
  }
}

/**
 * Factory function to create monetization prompt builder
 */
export function createMonetizationBuilder(): MonetizationPromptBuilder {
  return new MonetizationPromptBuilder();
}

/**
 * Quick build function for monetization analysis
 */
export function buildMonetizationPrompt(context: PromptContext): ComposedPrompt {
  const builder = new MonetizationPromptBuilder();
  return builder.buildPrompt(context);
}

// Made with Bob
