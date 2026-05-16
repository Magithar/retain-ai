/**
 * RetainAI - AI Prompt Orchestration System
 * 
 * Main entry point for the AI prompt orchestration system.
 * Exports all builders, utilities, and orchestration functions.
 */

// Core Types
export * from './types';

// PM Intelligence Layer
export * from './intelligence/pmHeuristics';

// Utility Functions
export * from './utils/heuristicMatcher';
export * from './utils/promptComposer';

// Prompt Builders
export * from './builders/retentionBuilder';
export * from './builders/monetizationBuilder';
export * from './builders/liveOpsBuilder';
export * from './builders/frictionBuilder';
export * from './builders/segmentationBuilder';

// Orchestrator
export * from './orchestrator';

// Convenience re-exports for common operations
import { createOrchestrator, generateAllPrompts, generatePrompt } from './orchestrator';
import { buildRetentionPrompt } from './builders/retentionBuilder';
import { buildMonetizationPrompt } from './builders/monetizationBuilder';
import { buildLiveOpsPrompt } from './builders/liveOpsBuilder';
import { buildFrictionPrompt } from './builders/frictionBuilder';
import { buildSegmentationPrompt } from './builders/segmentationBuilder';
import { matchHeuristics, getTopHeuristics, formatHeuristicsForPrompt } from './utils/heuristicMatcher';
import { formatAnalyticsContext, createSystemContext, createOutputFormat, createComposedPrompt } from './utils/promptComposer';

export {
  // Orchestration
  createOrchestrator,
  generateAllPrompts,
  generatePrompt,
  
  // Individual Builders
  buildRetentionPrompt,
  buildMonetizationPrompt,
  buildLiveOpsPrompt,
  buildFrictionPrompt,
  buildSegmentationPrompt,
  
  // Heuristic Matching
  matchHeuristics,
  getTopHeuristics,
  formatHeuristicsForPrompt,
  
  // Prompt Composition
  formatAnalyticsContext,
  createSystemContext,
  createOutputFormat,
  createComposedPrompt
};

// Made with Bob
