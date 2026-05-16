/**
 * Mock AI Response Layer
 * 
 * Provides realistic mock responses for AI-generated insights
 * without requiring actual API integration.
 */

import { AnalyticsSummary } from '../analytics';

export interface RetentionRisk {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  affectedPlayers: string;
  recommendation: string;
}

export interface FrictionPoint {
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  metric: string;
  recommendation: string;
}

export interface MonetizationOpportunity {
  title: string;
  description: string;
  playerSegment: string;
  potentialImpact: 'high' | 'medium' | 'low';
  implementation: string;
}

export interface LiveOpsSuggestion {
  title: string;
  description: string;
  type: 'event' | 'challenge' | 'content' | 'balance';
  priority: 'high' | 'medium' | 'low';
  expectedOutcome: string;
}

export interface PlayerInsight {
  segment: string;
  description: string;
  size: string;
  behavior: string;
  needs: string;
}

export interface AIInsights {
  retentionRisks: RetentionRisk[];
  frictionPoints: FrictionPoint[];
  monetizationOpportunities: MonetizationOpportunity[];
  liveOpsSuggestions: LiveOpsSuggestion[];
  playerInsights: PlayerInsight[];
}

/**
 * Generate mock AI insights based on analytics summary
 */
export async function generateMockInsights(summary: AnalyticsSummary): Promise<AIInsights> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const insights: AIInsights = {
    retentionRisks: generateRetentionRisks(summary),
    frictionPoints: generateFrictionPoints(summary),
    monetizationOpportunities: generateMonetizationOpportunities(summary),
    liveOpsSuggestions: generateLiveOpsSuggestions(summary),
    playerInsights: generatePlayerInsights(summary)
  };
  
  return insights;
}

function generateRetentionRisks(summary: AnalyticsSummary): RetentionRisk[] {
  const risks: RetentionRisk[] = [];
  
  // High death rate risk
  if (summary.averageDeaths > 3) {
    risks.push({
      title: 'High Player Death Rate',
      description: `Players are dying an average of ${summary.averageDeaths.toFixed(1)} times per session, which is significantly above healthy benchmarks. This indicates difficulty spikes or unclear game mechanics that frustrate players.`,
      severity: summary.averageDeaths > 5 ? 'high' : 'medium',
      affectedPlayers: `${((summary.highDeathSessions / summary.totalSessions) * 100).toFixed(1)}% of sessions`,
      recommendation: 'Implement difficulty scaling, add tutorial checkpoints, or introduce resurrection mechanics to reduce frustration. Consider A/B testing easier early-game encounters.'
    });
  }
  
  // Low engagement risk
  if (summary.abandonmentRate > 15) {
    risks.push({
      title: 'High Early Abandonment',
      description: `${summary.abandonmentRate.toFixed(1)}% of players are achieving very low scores, suggesting they abandon sessions early or fail to engage with core mechanics.`,
      severity: summary.abandonmentRate > 25 ? 'high' : 'medium',
      affectedPlayers: `${summary.lowScoreSessions} sessions`,
      recommendation: 'Improve onboarding flow, add early-game rewards, and ensure first 5 minutes are engaging. Consider implementing a "new player protection" period.'
    });
  }
  
  // Friction score risk
  if (summary.frictionScore > 60) {
    risks.push({
      title: 'Excessive Player Friction',
      description: `Friction score of ${summary.frictionScore.toFixed(1)}/100 indicates multiple pain points in the player experience. This combines high deaths, failed interactions, and low performance.`,
      severity: 'high',
      affectedPlayers: 'Affects overall player base',
      recommendation: 'Conduct UX audit focusing on interaction clarity, combat feedback, and progression pacing. Prioritize quick wins that reduce immediate friction.'
    });
  }
  
  // Low K/D ratio risk
  if (summary.killDeathRatio < 1) {
    risks.push({
      title: 'Negative Kill/Death Ratio',
      description: `Players are dying more than they're killing (K/D: ${summary.killDeathRatio.toFixed(2)}). This creates a sense of failure and powerlessness that drives churn.`,
      severity: 'medium',
      affectedPlayers: 'Majority of player base',
      recommendation: 'Rebalance enemy difficulty, increase player damage output, or add more health pickups. Players should feel powerful and successful.'
    });
  }
  
  // Combat avoidance
  const combatAvoidanceAnomaly = summary.anomalies.find(a => a.type === 'Combat Avoidance');
  if (combatAvoidanceAnomaly) {
    risks.push({
      title: 'Combat System Avoidance',
      description: combatAvoidanceAnomaly.description,
      severity: combatAvoidanceAnomaly.severity,
      affectedPlayers: `${combatAvoidanceAnomaly.affectedSessions} sessions`,
      recommendation: 'Combat may be too punishing or unrewarding. Add better combat feedback, increase rewards for combat engagement, and ensure combat is fun rather than frustrating.'
    });
  }
  
  return risks.slice(0, 5); // Return top 5 risks
}

function generateFrictionPoints(summary: AnalyticsSummary): FrictionPoint[] {
  const frictions: FrictionPoint[] = [];
  
  // Pickup efficiency friction
  if (summary.pickupEfficiency < 70) {
    frictions.push({
      title: 'Item Pickup Interaction Issues',
      description: `Only ${summary.pickupEfficiency.toFixed(1)}% of pickup attempts succeed. This suggests unclear interaction prompts, small hitboxes, or confusing UI feedback.`,
      severity: summary.pickupEfficiency < 50 ? 'high' : 'medium',
      metric: `${summary.pickupEfficiency.toFixed(1)}% success rate`,
      recommendation: 'Increase pickup interaction radius, add clearer visual feedback, implement auto-pickup for nearby items, or add haptic feedback on successful pickups.'
    });
  }
  
  // Low combat intensity
  if (summary.combatIntensity < 10) {
    frictions.push({
      title: 'Slow Combat Pacing',
      description: `Combat intensity of ${summary.combatIntensity.toFixed(2)} damage/second indicates slow, drawn-out fights that may feel tedious rather than exciting.`,
      severity: 'medium',
      metric: `${summary.combatIntensity.toFixed(2)} DPS`,
      recommendation: 'Increase player damage output, reduce enemy health pools, or add combo mechanics to make combat feel more impactful and fast-paced.'
    });
  }
  
  // Low exploration engagement
  if (summary.explorationEngagement < 5) {
    frictions.push({
      title: 'Limited Exploration Incentive',
      description: `Players are moving slowly during exploration (${summary.explorationEngagement.toFixed(2)} units/sec), suggesting lack of interesting content or unclear navigation.`,
      severity: 'low',
      metric: `${summary.explorationEngagement.toFixed(2)} units/sec`,
      recommendation: 'Add more points of interest, improve minimap clarity, place collectibles along exploration paths, or add movement speed boosts.'
    });
  }
  
  // Zero score anomaly
  const zeroScoreAnomaly = summary.anomalies.find(a => a.type === 'Zero Score Sessions');
  if (zeroScoreAnomaly) {
    frictions.push({
      title: 'Score Progression Failure',
      description: zeroScoreAnomaly.description,
      severity: zeroScoreAnomaly.severity,
      metric: `${zeroScoreAnomaly.affectedSessions} sessions`,
      recommendation: 'Ensure score is awarded for all player actions, not just kills. Add score for exploration, survival time, and item collection to prevent zero-score scenarios.'
    });
  }
  
  // High combat time but low kills
  if (summary.combatTimePercentage > 60 && summary.averageKills < 5) {
    frictions.push({
      title: 'Combat Efficiency Problem',
      description: `Players spend ${summary.combatTimePercentage.toFixed(1)}% of time in combat but average only ${summary.averageKills.toFixed(1)} kills, indicating difficulty landing hits or defeating enemies.`,
      severity: 'medium',
      metric: `${summary.combatTimePercentage.toFixed(1)}% combat time, ${summary.averageKills.toFixed(1)} avg kills`,
      recommendation: 'Improve hit detection, add aim assist, reduce enemy dodge frequency, or provide better targeting feedback to help players land hits.'
    });
  }
  
  return frictions.slice(0, 5);
}

function generateMonetizationOpportunities(summary: AnalyticsSummary): MonetizationOpportunity[] {
  const opportunities: MonetizationOpportunity[] = [];
  
  // Collector segment
  const collectorBehavior = summary.topBehaviors.find(b => b.pattern === 'Collector');
  if (collectorBehavior) {
    opportunities.push({
      title: 'Cosmetic Item Collection System',
      description: `${collectorBehavior.frequency.toFixed(1)}% of players show strong collection behavior. This segment is ideal for cosmetic items, skins, and collectible content.`,
      playerSegment: 'Collectors',
      potentialImpact: 'high',
      implementation: 'Introduce battle pass with exclusive collectibles, limited-time cosmetic items, and collection completion rewards. Add showcase features for collected items.'
    });
  }
  
  // Combat-focused segment
  const combatBehavior = summary.topBehaviors.find(b => b.pattern === 'Combat-Focused');
  if (combatBehavior) {
    opportunities.push({
      title: 'Power-Up and Weapon Packs',
      description: `${combatBehavior.frequency.toFixed(1)}% of players are combat-focused. They would value items that enhance combat effectiveness and provide competitive advantages.`,
      playerSegment: 'Combat Enthusiasts',
      potentialImpact: 'high',
      implementation: 'Offer weapon skin bundles, combat boost consumables, and premium character abilities. Ensure items feel powerful but maintain game balance.'
    });
  }
  
  // High engagement players
  if (summary.averageScore > 1000) {
    opportunities.push({
      title: 'Premium Progression Accelerators',
      description: `High average scores indicate engaged players who invest time. They may pay to progress faster or access exclusive content.`,
      playerSegment: 'High Performers',
      potentialImpact: 'medium',
      implementation: 'Offer XP boosters, premium currency for faster unlocks, and VIP membership with exclusive perks. Focus on time-saving rather than pay-to-win.'
    });
  }
  
  // Explorer segment
  const explorerBehavior = summary.topBehaviors.find(b => b.pattern === 'Explorer');
  if (explorerBehavior) {
    opportunities.push({
      title: 'Exploration Content Packs',
      description: `${explorerBehavior.frequency.toFixed(1)}% of players show exploration tendencies. They would value new areas, maps, and discovery-based content.`,
      playerSegment: 'Explorers',
      potentialImpact: 'medium',
      implementation: 'Release paid DLC maps, exclusive exploration zones, and treasure hunt events. Add cosmetic rewards for discovering hidden areas.'
    });
  }
  
  // Struggling players
  if (summary.frictionScore > 50) {
    opportunities.push({
      title: 'Convenience and Assistance Items',
      description: `High friction score suggests players struggle with difficulty. Offer optional assistance items that reduce frustration without breaking game balance.`,
      playerSegment: 'Casual Players',
      potentialImpact: 'medium',
      implementation: 'Sell revive tokens, temporary shields, or difficulty modifiers. Frame as "accessibility options" rather than pay-to-win to maintain positive perception.'
    });
  }
  
  return opportunities.slice(0, 5);
}

function generateLiveOpsSuggestions(summary: AnalyticsSummary): LiveOpsSuggestion[] {
  const suggestions: LiveOpsSuggestion[] = [];
  
  // High death rate - balance event
  if (summary.averageDeaths > 4) {
    suggestions.push({
      title: 'Survival Challenge Event',
      description: 'Launch a limited-time event that rewards players for surviving longer and dying less. This reframes the difficulty as a challenge rather than a problem.',
      type: 'event',
      priority: 'high',
      expectedOutcome: 'Reduces perceived difficulty frustration, provides practice opportunity, and rewards improvement with exclusive items.'
    });
  }
  
  // Low pickup efficiency - content update
  if (summary.pickupEfficiency < 70) {
    suggestions.push({
      title: 'Interaction System Overhaul',
      description: 'Deploy a quality-of-life update focused on improving item pickup mechanics, interaction feedback, and UI clarity.',
      type: 'content',
      priority: 'high',
      expectedOutcome: 'Immediate improvement in player satisfaction and reduction in friction. Should see pickup efficiency increase by 20-30%.'
    });
  }
  
  // Combat-focused players
  const combatBehavior = summary.topBehaviors.find(b => b.pattern === 'Combat-Focused');
  if (combatBehavior) {
    suggestions.push({
      title: 'Combat Arena Tournament',
      description: 'Host a competitive combat event with leaderboards, exclusive rewards, and daily challenges focused on combat mastery.',
      type: 'event',
      priority: 'medium',
      expectedOutcome: 'Engages combat-focused segment, increases daily active users, and provides content for streamers/content creators.'
    });
  }
  
  // Low K/D ratio - balance patch
  if (summary.killDeathRatio < 1) {
    suggestions.push({
      title: 'Player Empowerment Balance Patch',
      description: 'Release a balance update that increases player power: +15% damage, +20% health, and improved hit detection. Make players feel more capable.',
      type: 'balance',
      priority: 'high',
      expectedOutcome: 'Improved K/D ratio, reduced frustration, and better player retention. Monitor for over-correction.'
    });
  }
  
  // Collector behavior
  const collectorBehavior = summary.topBehaviors.find(b => b.pattern === 'Collector');
  if (collectorBehavior) {
    suggestions.push({
      title: 'Seasonal Collection Event',
      description: 'Launch a time-limited collection event with exclusive items, completion rewards, and showcase features for collectors.',
      type: 'event',
      priority: 'medium',
      expectedOutcome: 'Drives engagement among collector segment, creates FOMO, and provides monetization opportunity through premium collection items.'
    });
  }
  
  // General engagement
  suggestions.push({
    title: 'Daily Challenge System',
    description: 'Implement rotating daily challenges that reward different play styles: combat, exploration, collection, and survival.',
    type: 'challenge',
    priority: 'medium',
    expectedOutcome: 'Increases daily login rate, provides variety, and helps players discover different aspects of the game.'
  });
  
  return suggestions.slice(0, 5);
}

function generatePlayerInsights(summary: AnalyticsSummary): PlayerInsight[] {
  const insights: PlayerInsight[] = [];
  
  // Analyze top behaviors for segments
  summary.topBehaviors.forEach(behavior => {
    let segment: PlayerInsight | null = null;
    
    switch (behavior.pattern) {
      case 'Combat-Focused':
        segment = {
          segment: 'Combat Enthusiasts',
          description: 'Players who prioritize combat encounters and spend majority of time fighting enemies',
          size: `${behavior.frequency.toFixed(1)}% of player base`,
          behavior: 'High combat time, aggressive playstyle, seeks out enemy encounters',
          needs: 'Challenging combat, powerful weapons, competitive features, and combat-focused rewards'
        };
        break;
        
      case 'Explorer':
        segment = {
          segment: 'Explorers',
          description: 'Players who travel extensively and prioritize discovering new areas',
          size: `${behavior.frequency.toFixed(1)}% of player base`,
          behavior: 'High distance traveled, thorough map coverage, seeks hidden areas',
          needs: 'New maps, secret areas, discovery rewards, and exploration-based progression'
        };
        break;
        
      case 'Collector':
        segment = {
          segment: 'Collectors',
          description: 'Players who actively collect items and complete collections',
          size: `${behavior.frequency.toFixed(1)}% of player base`,
          behavior: 'High item collection rate, completionist mindset, values cosmetics',
          needs: 'Collectible items, completion tracking, showcase features, and exclusive cosmetics'
        };
        break;
        
      case 'High Difficulty':
        segment = {
          segment: 'Struggling Players',
          description: 'Players experiencing frequent deaths and difficulty progression',
          size: `${behavior.frequency.toFixed(1)}% of player base`,
          behavior: 'High death count, low scores, may be new or casual players',
          needs: 'Better tutorials, difficulty options, assistance items, and clearer feedback'
        };
        break;
        
      case 'Low Engagement':
        segment = {
          segment: 'At-Risk Players',
          description: 'Players with very low engagement and poor performance metrics',
          size: `${behavior.frequency.toFixed(1)}% of player base`,
          behavior: 'Low scores, minimal progression, likely to churn',
          needs: 'Improved onboarding, early rewards, easier difficulty curve, and engagement hooks'
        };
        break;
    }
    
    if (segment) {
      insights.push(segment);
    }
  });
  
  // Add balanced players segment if we have room
  if (insights.length < 5) {
    const accountedPercentage = insights.reduce((sum, i) => {
      const match = i.size.match(/(\d+\.?\d*)/);
      return sum + (match ? parseFloat(match[1]) : 0);
    }, 0);
    
    if (accountedPercentage < 90) {
      insights.push({
        segment: 'Balanced Players',
        description: 'Players who engage with multiple game systems without strong specialization',
        size: `${(100 - accountedPercentage).toFixed(1)}% of player base`,
        behavior: 'Moderate engagement across combat, exploration, and collection',
        needs: 'Varied content, balanced progression, and options to specialize over time'
      });
    }
  }
  
  return insights.slice(0, 5);
}

// Made with Bob
