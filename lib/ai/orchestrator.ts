/**
 * AI Prompt Orchestrator
 * 
 * Central orchestration system that coordinates multiple prompt builders
 * and manages the overall AI analysis workflow.
 */

import { AnalyticsSummary } from '../analytics';
import {
  PromptContext,
  ComposedPrompt,
  OrchestrationConfig,
  OrchestrationResult,
  HeuristicCategory
} from './types';

// Import all builders
import { createRetentionBuilder } from './builders/retentionBuilder';
import { createMonetizationBuilder } from './builders/monetizationBuilder';
import { createLiveOpsBuilder } from './builders/liveOpsBuilder';
import { createFrictionBuilder } from './builders/frictionBuilder';
import { createSegmentationBuilder } from './builders/segmentationBuilder';

/**
 * Main orchestrator class for AI prompt generation
 */
export class AIPromptOrchestrator {
  private config: OrchestrationConfig;
  
  constructor(config?: Partial<OrchestrationConfig>) {
    this.config = {
      enabledBuilders: config?.enabledBuilders || ['retention', 'monetization', 'liveops', 'friction', 'segmentation'],
      heuristicCategories: config?.heuristicCategories || ['retention', 'monetization', 'liveops', 'friction', 'segmentation'],
      outputFormat: config?.outputFormat || 'json',
      includeExecutiveSummary: config?.includeExecutiveSummary ?? true,
      maxRecommendationsPerCategory: config?.maxRecommendationsPerCategory || 5
    };
  }
  
  /**
   * Generate prompts for all enabled builders
   */
  async generatePrompts(
    summary: AnalyticsSummary,
    options?: {
      gameContext?: string;
      focusAreas?: string[];
      customInstructions?: string;
    }
  ): Promise<OrchestrationResult> {
    const context: PromptContext = {
      summary,
      gameContext: options?.gameContext,
      focusAreas: options?.focusAreas,
      customInstructions: options?.customInstructions,
      includeHeuristics: this.config.heuristicCategories,
      outputFormat: this.config.outputFormat
    };
    
    const prompts: Record<string, ComposedPrompt> = {};
    const buildersUsed: string[] = [];
    
    // Generate prompts for each enabled builder
    for (const builderType of this.config.enabledBuilders) {
      try {
        const prompt = await this.buildPrompt(builderType, context);
        prompts[builderType] = prompt;
        buildersUsed.push(builderType);
      } catch (error) {
        console.error(`Error building ${builderType} prompt:`, error);
      }
    }
    
    // Count total heuristics applied
    const heuristicsApplied = this.countHeuristics(prompts);
    
    return {
      prompts,
      metadata: {
        timestamp: new Date().toISOString(),
        sessionCount: summary.totalSessions,
        heuristicsApplied,
        buildersUsed
      }
    };
  }
  
  /**
   * Generate a single prompt for a specific analysis type
   */
  async generateSinglePrompt(
    builderType: 'retention' | 'monetization' | 'liveops' | 'friction' | 'segmentation',
    summary: AnalyticsSummary,
    options?: {
      gameContext?: string;
      focusAreas?: string[];
      customInstructions?: string;
    }
  ): Promise<ComposedPrompt> {
    const context: PromptContext = {
      summary,
      gameContext: options?.gameContext,
      focusAreas: options?.focusAreas,
      customInstructions: options?.customInstructions,
      includeHeuristics: this.getHeuristicsForBuilder(builderType),
      outputFormat: this.config.outputFormat
    };
    
    return this.buildPrompt(builderType, context);
  }
  
  /**
   * Build prompt using appropriate builder
   */
  private async buildPrompt(
    builderType: string,
    context: PromptContext
  ): Promise<ComposedPrompt> {
    switch (builderType) {
      case 'retention':
        return createRetentionBuilder().buildPrompt(context);
      case 'monetization':
        return createMonetizationBuilder().buildPrompt(context);
      case 'liveops':
        return createLiveOpsBuilder().buildPrompt(context);
      case 'friction':
        return createFrictionBuilder().buildPrompt(context);
      case 'segmentation':
        return createSegmentationBuilder().buildPrompt(context);
      default:
        throw new Error(`Unknown builder type: ${builderType}`);
    }
  }
  
  /**
   * Get required heuristics for a specific builder
   */
  private getHeuristicsForBuilder(builderType: string): HeuristicCategory[] {
    const heuristicMap: Record<string, HeuristicCategory[]> = {
      retention: ['retention', 'friction'],
      monetization: ['monetization', 'segmentation'],
      liveops: ['liveops', 'engagement', 'retention'],
      friction: ['friction', 'retention'],
      segmentation: ['segmentation', 'monetization', 'retention']
    };
    
    return heuristicMap[builderType] || [];
  }
  
  /**
   * Count total heuristics applied across all prompts
   */
  private countHeuristics(prompts: Record<string, ComposedPrompt>): number {
    let count = 0;
    for (const prompt of Object.values(prompts)) {
      // Count heuristic sections in the prompt
      const matches = prompt.heuristicContext.match(/###\s+/g);
      count += matches ? matches.length : 0;
    }
    return count;
  }
  
  /**
   * Update orchestrator configuration
   */
  updateConfig(config: Partial<OrchestrationConfig>): void {
    this.config = { ...this.config, ...config };
  }
  
  /**
   * Get current configuration
   */
  getConfig(): OrchestrationConfig {
    return { ...this.config };
  }
}

/**
 * Factory function to create orchestrator with default config
 */
export function createOrchestrator(config?: Partial<OrchestrationConfig>): AIPromptOrchestrator {
  return new AIPromptOrchestrator(config);
}

/**
 * Quick function to generate all prompts
 */
export async function generateAllPrompts(
  summary: AnalyticsSummary,
  options?: {
    gameContext?: string;
    focusAreas?: string[];
    customInstructions?: string;
    config?: Partial<OrchestrationConfig>;
  }
): Promise<OrchestrationResult> {
  const orchestrator = createOrchestrator(options?.config);
  return orchestrator.generatePrompts(summary, options);
}

/**
 * Quick function to generate a single prompt
 */
export async function generatePrompt(
  builderType: 'retention' | 'monetization' | 'liveops' | 'friction' | 'segmentation',
  summary: AnalyticsSummary,
  options?: {
    gameContext?: string;
    focusAreas?: string[];
    customInstructions?: string;
  }
): Promise<ComposedPrompt> {
  const orchestrator = createOrchestrator();
  return orchestrator.generateSinglePrompt(builderType, summary, options);
}

/**
 * Batch generate prompts for multiple analytics summaries
 */
export async function batchGeneratePrompts(
  summaries: AnalyticsSummary[],
  builderType: 'retention' | 'monetization' | 'liveops' | 'friction' | 'segmentation',
  options?: {
    gameContext?: string;
    focusAreas?: string[];
  }
): Promise<ComposedPrompt[]> {
  const orchestrator = createOrchestrator();
  const prompts: ComposedPrompt[] = [];
  
  for (const summary of summaries) {
    const prompt = await orchestrator.generateSinglePrompt(builderType, summary, options);
    prompts.push(prompt);
  }
  
  return prompts;
}

/**
 * Export full prompt text for external use
 */
export function exportPromptText(prompt: ComposedPrompt): string {
  return prompt.fullPrompt;
}

/**
 * Export prompts as JSON for storage or API calls
 */
export function exportPromptsAsJSON(result: OrchestrationResult): string {
  return JSON.stringify(result, null, 2);
}

/**
 * Validate analytics summary before prompt generation
 */
export function validateAnalyticsSummary(summary: AnalyticsSummary): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!summary.totalSessions || summary.totalSessions <= 0) {
    errors.push('Total sessions must be greater than 0');
  }
  
  if (summary.averageScore !== null && summary.averageScore < 0) {
    errors.push('Average score cannot be negative');
  }
  
  if (summary.killDeathRatio !== null && summary.killDeathRatio < 0) {
    errors.push('K/D ratio cannot be negative');
  }
  
  if (summary.frictionScore < 0 || summary.frictionScore > 100) {
    errors.push('Friction score must be between 0 and 100');
  }
  
  if (!summary.topBehaviors || summary.topBehaviors.length === 0) {
    errors.push('Top behaviors array is required');
  }
  
  if (!summary.anomalies || summary.anomalies.length === 0) {
    errors.push('Anomalies array is required');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Made with Bob
