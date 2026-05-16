/**
 * Core TypeScript interfaces for AI Prompt Orchestration System
 * 
 * Defines strongly-typed interfaces for PM heuristics, prompt builders,
 * and AI analysis outputs.
 */

import { AnalyticsSummary } from '../analytics';

// ============================================================================
// PM Heuristics Types
// ============================================================================

export type HeuristicCategory = 
  | 'retention'
  | 'monetization'
  | 'liveops'
  | 'friction'
  | 'segmentation'
  | 'engagement'
  | 'balance';

export type HeuristicPriority = 'critical' | 'high' | 'medium' | 'low';

export interface PMHeuristic {
  id: string;
  category: HeuristicCategory;
  title: string;
  description: string;
  priority: HeuristicPriority;
  applicableMetrics: string[];
  thresholds?: Record<string, number>;
  recommendations: string[];
  tags: string[];
}

export interface HeuristicSection {
  category: HeuristicCategory;
  heuristics: PMHeuristic[];
  contextualGuidance: string;
}

// ============================================================================
// Prompt Builder Types
// ============================================================================

export interface PromptContext {
  summary: AnalyticsSummary;
  gameContext?: string;
  focusAreas?: string[];
  customInstructions?: string;
  includeHeuristics?: HeuristicCategory[];
  outputFormat?: 'json' | 'markdown' | 'structured';
}

export interface PromptSection {
  title: string;
  content: string;
  priority: number;
}

export interface ComposedPrompt {
  systemContext: string;
  dataContext: string;
  heuristicContext: string;
  analysisRequest: string;
  outputFormat: string;
  fullPrompt: string;
}

// ============================================================================
// Analysis Output Types
// ============================================================================

export interface RetentionRisk {
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  affectedPlayers: string;
  metrics: Record<string, number | string>;
  recommendation: string;
  heuristicBasis?: string[];
}

export interface FrictionPoint {
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  metric: string;
  impactArea: string;
  recommendation: string;
  quickWins?: string[];
}

export interface MonetizationOpportunity {
  title: string;
  description: string;
  playerSegment: string;
  potentialImpact: 'high' | 'medium' | 'low';
  implementation: string;
  estimatedRevenue?: string;
  risks?: string[];
}

export interface LiveOpsRecommendation {
  title: string;
  description: string;
  type: 'event' | 'challenge' | 'content' | 'balance' | 'feature';
  priority: 'critical' | 'high' | 'medium' | 'low';
  timeline: string;
  expectedOutcome: string;
  kpis: string[];
}

export interface PlayerSegment {
  segment: string;
  description: string;
  size: string;
  behavior: string;
  needs: string;
  monetizationPotential: 'high' | 'medium' | 'low';
  retentionRisk: 'high' | 'medium' | 'low';
}

export interface ChurnIndicator {
  indicator: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  affectedSegments: string[];
  preventionStrategy: string;
  earlyWarningMetrics: string[];
}

// ============================================================================
// Comprehensive Analysis Output
// ============================================================================

export interface AIAnalysisOutput {
  retentionRisks: RetentionRisk[];
  frictionPoints: FrictionPoint[];
  monetizationOpportunities: MonetizationOpportunity[];
  liveOpsRecommendations: LiveOpsRecommendation[];
  playerSegments: PlayerSegment[];
  churnIndicators?: ChurnIndicator[];
  executiveSummary: string;
  priorityActions: string[];
}

// ============================================================================
// Prompt Builder Interface
// ============================================================================

export interface IPromptBuilder {
  buildPrompt(context: PromptContext): ComposedPrompt;
  getRequiredHeuristics(): HeuristicCategory[];
  validateContext(context: PromptContext): boolean;
}

// ============================================================================
// Heuristic Matcher Types
// ============================================================================

export interface HeuristicMatch {
  heuristic: PMHeuristic;
  relevanceScore: number;
  triggeredBy: string[];
  applicableRecommendations: string[];
}

export interface HeuristicMatchCriteria {
  categories?: HeuristicCategory[];
  minPriority?: HeuristicPriority;
  requiredTags?: string[];
  metricThresholds?: Record<string, number>;
}

// ============================================================================
// Orchestrator Types
// ============================================================================

export interface OrchestrationConfig {
  enabledBuilders: Array<'retention' | 'monetization' | 'liveops' | 'friction' | 'segmentation'>;
  heuristicCategories: HeuristicCategory[];
  outputFormat: 'json' | 'markdown' | 'structured';
  includeExecutiveSummary: boolean;
  maxRecommendationsPerCategory: number;
}

export interface OrchestrationResult {
  prompts: Record<string, ComposedPrompt>;
  analysis?: AIAnalysisOutput;
  metadata: {
    timestamp: string;
    sessionCount: number;
    heuristicsApplied: number;
    buildersUsed: string[];
  };
}

// Made with Bob
