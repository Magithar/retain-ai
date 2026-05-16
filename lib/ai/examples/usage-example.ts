/**
 * Usage Examples for AI Prompt Orchestration System
 * 
 * Demonstrates how to use the various components of the system.
 */

import { AnalyticsSummary } from '../../analytics';
import {
  generatePrompt,
  generateAllPrompts,
  createOrchestrator,
  buildRetentionPrompt,
  matchHeuristics,
  validateAnalyticsSummary
} from '../index';

// Example analytics data
const exampleSummary: AnalyticsSummary = {
  totalSessions: 1500,
  averageScore: 850.5,
  averageKills: 12.3,
  averageDeaths: 4.7,
  killDeathRatio: 2.62,
  averageDamageDone: 3450.8,
  averageEnemiesHit: 45.2,
  combatIntensity: 15.3,
  combatTimePercentage: 62.5,
  pickupEfficiency: 73.2,
  explorationEngagement: 6.8,
  averageDistanceTraveled: 4250.0,
  frictionScore: 35.8,
  highDeathSessions: 180,
  lowScoreSessions: 120,
  abandonmentRate: 8.5,
  topBehaviors: [
    {
      pattern: 'Combat-Focused',
      description: 'Players who spend majority of time in combat',
      frequency: 45.2,
      impact: 'positive'
    },
    {
      pattern: 'Collector',
      description: 'Players who actively collect items',
      frequency: 28.7,
      impact: 'positive'
    },
    {
      pattern: 'Explorer',
      description: 'Players who travel extensively',
      frequency: 18.3,
      impact: 'neutral'
    }
  ],
  anomalies: [
    {
      type: 'Combat Avoidance',
      description: 'Some players avoiding combat encounters',
      severity: 'medium',
      affectedSessions: 85
    },
    {
      type: 'Zero Score Sessions',
      description: 'Sessions with no score progression',
      severity: 'high',
      affectedSessions: 45
    }
  ],
  scoreDistribution: [120, 280, 450, 380, 200, 70],
  killsDistribution: [180, 320, 480, 350, 140, 30],
  deathsDistribution: [250, 420, 380, 280, 130, 40],
  combatTimeDistribution: [90, 210, 380, 450, 280, 90]
};

/**
 * Example 1: Generate a single retention analysis prompt
 */
export async function example1_SinglePrompt() {
  console.log('=== Example 1: Single Retention Prompt ===\n');
  
  const prompt = await generatePrompt('retention', exampleSummary, {
    gameContext: 'competitive multiplayer shooter',
    focusAreas: ['early game retention', 'combat balance']
  });
  
  console.log('System Context:', prompt.systemContext.substring(0, 100) + '...');
  console.log('\nData Context Length:', prompt.dataContext.length);
  console.log('Heuristic Context Length:', prompt.heuristicContext.length);
  console.log('Full Prompt Length:', prompt.fullPrompt.length);
  console.log('\n✓ Retention prompt generated successfully\n');
  
  return prompt;
}

/**
 * Example 2: Generate all prompts at once
 */
export async function example2_AllPrompts() {
  console.log('=== Example 2: Generate All Prompts ===\n');
  
  const result = await generateAllPrompts(exampleSummary, {
    gameContext: 'mobile RPG',
    focusAreas: ['monetization', 'player engagement']
  });
  
  console.log('Generated Prompts:');
  Object.keys(result.prompts).forEach(key => {
    console.log(`  - ${key}: ${result.prompts[key].fullPrompt.length} characters`);
  });
  
  console.log('\nMetadata:');
  console.log('  Timestamp:', result.metadata.timestamp);
  console.log('  Session Count:', result.metadata.sessionCount);
  console.log('  Heuristics Applied:', result.metadata.heuristicsApplied);
  console.log('  Builders Used:', result.metadata.buildersUsed.join(', '));
  console.log('\n✓ All prompts generated successfully\n');
  
  return result;
}

/**
 * Example 3: Custom orchestrator configuration
 */
export async function example3_CustomConfig() {
  console.log('=== Example 3: Custom Configuration ===\n');
  
  const orchestrator = createOrchestrator({
    enabledBuilders: ['retention', 'friction'],
    heuristicCategories: ['retention', 'friction'],
    outputFormat: 'json',
    maxRecommendationsPerCategory: 3
  });
  
  const result = await orchestrator.generatePrompts(exampleSummary, {
    gameContext: 'casual puzzle game'
  });
  
  console.log('Custom Config Results:');
  console.log('  Builders Used:', result.metadata.buildersUsed.join(', '));
  console.log('  Prompts Generated:', Object.keys(result.prompts).length);
  console.log('\n✓ Custom configuration applied successfully\n');
  
  return result;
}

/**
 * Example 4: Direct builder usage
 */
export async function example4_DirectBuilder() {
  console.log('=== Example 4: Direct Builder Usage ===\n');
  
  const prompt = await buildRetentionPrompt({
    summary: exampleSummary,
    gameContext: 'action RPG',
    focusAreas: ['tutorial effectiveness', 'difficulty curve'],
    outputFormat: 'markdown'
  });
  
  console.log('Direct Builder Results:');
  console.log('  Output Format: markdown');
  console.log('  Prompt Length:', prompt.fullPrompt.length);
  console.log('\n✓ Direct builder usage successful\n');
  
  return prompt;
}

/**
 * Example 5: Heuristic matching
 */
export async function example5_HeuristicMatching() {
  console.log('=== Example 5: Heuristic Matching ===\n');
  
  const matches = matchHeuristics(exampleSummary, {
    categories: ['retention', 'monetization'],
    minPriority: 'high'
  });
  
  console.log(`Found ${matches.length} relevant heuristics:\n`);
  
  matches.slice(0, 5).forEach((match, idx) => {
    console.log(`${idx + 1}. ${match.heuristic.title}`);
    console.log(`   Priority: ${match.heuristic.priority}`);
    console.log(`   Relevance Score: ${match.relevanceScore}`);
    console.log(`   Triggered By: ${match.triggeredBy.join(', ')}`);
    console.log('');
  });
  
  console.log('✓ Heuristic matching completed\n');
  
  return matches;
}

/**
 * Example 6: Validation
 */
export async function example6_Validation() {
  console.log('=== Example 6: Data Validation ===\n');
  
  const validation = validateAnalyticsSummary(exampleSummary);
  
  console.log('Validation Results:');
  console.log('  Valid:', validation.valid);
  console.log('  Errors:', validation.errors.length);
  
  if (validation.errors.length > 0) {
    console.log('\nValidation Errors:');
    validation.errors.forEach(error => console.log(`  - ${error}`));
  } else {
    console.log('  ✓ All validation checks passed');
  }
  
  console.log('\n✓ Validation completed\n');
  
  return validation;
}

/**
 * Run all examples
 */
export async function runAllExamples() {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  RetainAI - AI Prompt Orchestration System Examples   ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  
  try {
    await example1_SinglePrompt();
    await example2_AllPrompts();
    await example3_CustomConfig();
    await example4_DirectBuilder();
    await example5_HeuristicMatching();
    await example6_Validation();
    
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║  ✓ All examples completed successfully!               ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Export for use in other files
export { exampleSummary };

// Uncomment to run examples directly
// runAllExamples();

// Made with Bob
