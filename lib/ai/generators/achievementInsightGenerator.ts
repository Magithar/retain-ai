/**
 * Achievement Insight Generator
 * 
 * Generates PM-style behavioral insights from achievement telemetry data.
 * Uses safe analytical language and focuses on data-backed observations.
 */

import {
  AchievementAnalyticsSummary,
  AchievementInsight,
  PlayerArchetypeProfile,
  SeasonalHealthMetrics,
  LeaderboardAnalysis
} from '@/types/achievement-analytics';

// ============================================================================
// Insight Generation
// ============================================================================

export function generateAchievementInsights(
  summary: AchievementAnalyticsSummary
): AchievementInsight[] {
  const insights: AchievementInsight[] = [];
  
  // Generate insights from different categories
  insights.push(...generateProgressionInsights(summary));
  insights.push(...generateLeaderboardInsights(summary));
  insights.push(...generateArchetypeInsights(summary));
  insights.push(...generateSeasonalInsights(summary));
  insights.push(...generateEngagementInsights(summary));
  
  // Sort by priority and risk level
  return insights.sort((a, b) => {
    const riskOrder = { critical: 5, high: 4, medium: 3, low: 2, opportunity: 1 };
    if (riskOrder[a.riskLevel] !== riskOrder[b.riskLevel]) {
      return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
    }
    return b.priority - a.priority;
  }).slice(0, 12); // Top 12 insights
}

// ============================================================================
// Progression Insights
// ============================================================================

function generateProgressionInsights(summary: AchievementAnalyticsSummary): AchievementInsight[] {
  const insights: AchievementInsight[] = [];
  
  // Low completion rate insight
  if (summary.averageCompletionRate < 20) {
    insights.push({
      title: 'Achievement Completion Barrier Detected',
      category: 'progression',
      riskLevel: summary.averageCompletionRate < 10 ? 'critical' : 'high',
      observation: `Only ${summary.averageCompletionRate.toFixed(1)}% of achievements are being completed by players`,
      supportingMetrics: {
        completionRate: `${summary.averageCompletionRate.toFixed(1)}%`,
        averageProgress: `${summary.averageProgressPercentage.toFixed(1)}%`,
        totalPlayers: summary.totalPlayers
      },
      interpretation: 'This completion rate suggests achievements may be too difficult, unclear, or not properly incentivized. Players may not understand requirements or feel rewards are insufficient for effort required.',
      playerSegmentAffected: 'All players, particularly casual and new players',
      pmRecommendation: 'Implement tiered achievement difficulty (bronze/silver/gold) with clear progress indicators. Add micro-rewards for partial completion to maintain motivation. Consider A/B testing reduced requirements for underperforming achievements.',
      liveOpsAction: 'Launch "Achievement Boost Week" event with 2x progress and bonus rewards to re-engage players with achievement system. Add achievement hints and guidance tooltips.',
      priority: 9,
      expectedOutcome: 'Increase completion rate to 25-30% within 2 weeks, improve player satisfaction with progression systems',
      kpis: ['Achievement completion rate', 'Average progress percentage', 'Daily active users'],
      timeline: '1-2 sprints for system changes, immediate for event'
    });
  }
  
  // Progression stagnation insight
  if (summary.slowProgressors > summary.totalPlayers * 0.3) {
    const stagnationRate = (summary.slowProgressors / summary.totalPlayers) * 100;
    insights.push({
      title: 'Early Progression Stagnation Risk',
      category: 'retention',
      riskLevel: 'high',
      observation: `${stagnationRate.toFixed(0)}% of players show slow progression patterns (<50% of average velocity)`,
      supportingMetrics: {
        slowProgressors: summary.slowProgressors,
        progressionVelocity: summary.progressionVelocity.toFixed(2),
        averageProgress: `${summary.averageProgressPercentage.toFixed(1)}%`
      },
      interpretation: 'Slow progression in early stages is a strong churn indicator. These players may not understand mechanics, lack clear goals, or find difficulty curve too steep.',
      playerSegmentAffected: 'New and casual players in first 7 days',
      pmRecommendation: 'Implement new player boost period (2x progress for first 7 days). Add contextual tutorials and clear next-step indicators. Consider dynamic difficulty adjustment based on player performance.',
      liveOpsAction: 'Create "Catch-Up Campaign" with accelerated progression rewards for players below 30% completion. Send targeted push notifications with helpful tips.',
      priority: 8,
      expectedOutcome: 'Reduce slow progressor segment by 40%, improve D7 retention by 15%',
      kpis: ['Slow progressor percentage', 'D7 retention', 'Average progression velocity'],
      timeline: '2-3 sprints for permanent systems, 1 week for campaign'
    });
  }
  
  // Stuck milestones insight
  if (summary.stuckMilestones.length > 0) {
    const worstMilestone = summary.stuckMilestones[0];
    insights.push({
      title: 'Milestone Difficulty Spike Identified',
      category: 'progression',
      riskLevel: worstMilestone.completionRate < 15 ? 'critical' : 'high',
      observation: `Milestone "${worstMilestone.milestoneName}" has only ${worstMilestone.completionRate.toFixed(1)}% completion rate with ${worstMilestone.stuckPlayerCount} players unable to progress`,
      supportingMetrics: {
        milestoneName: worstMilestone.milestoneName,
        completionRate: `${worstMilestone.completionRate.toFixed(1)}%`,
        stuckPlayers: worstMilestone.stuckPlayerCount || 0,
        averageAttempts: worstMilestone.averageAttempts
      },
      interpretation: 'This milestone represents a significant progression blocker. Players repeatedly attempting but failing suggests difficulty imbalance or unclear requirements rather than lack of engagement.',
      playerSegmentAffected: `${worstMilestone.stuckPlayerCount} players currently blocked`,
      pmRecommendation: 'Immediate rebalancing required. Reduce milestone requirements by 30-40% or add alternative completion paths. Implement milestone hints system showing what players need to do.',
      liveOpsAction: 'Deploy hotfix to adjust milestone difficulty. Launch "Milestone Mastery" event with temporary boost to help stuck players complete. Add in-game tips for this specific milestone.',
      priority: 10,
      expectedOutcome: 'Increase milestone completion rate to 40%+, unblock stuck players, reduce frustration-based churn',
      kpis: ['Milestone completion rate', 'Player progression velocity', 'Support tickets related to milestone'],
      timeline: 'Immediate hotfix (1-3 days), event launch within 1 week'
    });
  }
  
  return insights;
}

// ============================================================================
// Leaderboard Insights
// ============================================================================

function generateLeaderboardInsights(summary: AchievementAnalyticsSummary): AchievementInsight[] {
  const insights: AchievementInsight[] = [];
  
  // Low leaderboard participation
  if (summary.leaderboardParticipation < 35) {
    insights.push({
      title: 'Leaderboard Engagement Opportunity',
      category: 'engagement',
      riskLevel: 'medium',
      observation: `Only ${summary.leaderboardParticipation.toFixed(1)}% of players engage with leaderboard systems`,
      supportingMetrics: {
        participation: `${summary.leaderboardParticipation.toFixed(1)}%`,
        topTierPlayers: summary.topTierPlayers,
        averageRank: summary.averageLeaderboardRank.toFixed(0)
      },
      interpretation: 'Low leaderboard participation suggests visibility issues, lack of compelling rewards, or perception that leaderboards are only for hardcore players. This represents untapped competitive engagement potential.',
      playerSegmentAffected: 'Competitor and achiever archetypes not engaging with competitive features',
      pmRecommendation: 'Increase leaderboard visibility in main UI. Implement tier-based leaderboards (Bronze/Silver/Gold) so all players can compete at their level. Add friend leaderboards for social comparison.',
      liveOpsAction: 'Launch "Leaderboard Season" event with tier-specific rewards. Create beginner-friendly leaderboard categories. Add weekly leaderboard reset with exclusive rewards.',
      priority: 6,
      expectedOutcome: 'Increase leaderboard participation to 50%+, boost competitive engagement and session frequency',
      kpis: ['Leaderboard participation rate', 'Daily active users', 'Session frequency'],
      timeline: '2 sprints for UI changes, 1 week for event launch'
    });
  }
  
  // High competitive engagement opportunity
  if (summary.leaderboardParticipation > 45) {
    insights.push({
      title: 'Strong Competitive Community Detected',
      category: 'liveops',
      riskLevel: 'opportunity',
      observation: `${summary.leaderboardParticipation.toFixed(0)}% of players actively compete on leaderboards, with ${summary.topTierPlayers} in top tier`,
      supportingMetrics: {
        participation: `${summary.leaderboardParticipation.toFixed(1)}%`,
        topTierPlayers: summary.topTierPlayers,
        churnRate: summary.leaderboardChurn.toFixed(2)
      },
      interpretation: 'High leaderboard engagement indicates strong competitive player base. This segment typically shows higher retention and monetization potential through status-driven purchases.',
      playerSegmentAffected: 'Competitor archetype (45%+ of active base)',
      pmRecommendation: 'Capitalize on competitive engagement with ranked tournament system. Implement seasonal championships with prestige rewards. Add spectator mode for top players to build community.',
      liveOpsAction: 'Launch "Grand Championship" tournament with exclusive cosmetic rewards for top performers. Create content creator program for top leaderboard players. Add rank-up celebration effects.',
      priority: 7,
      expectedOutcome: 'Increase competitive player retention by 20%, drive cosmetic monetization through status symbols',
      kpis: ['Tournament participation', 'Competitive segment retention', 'Cosmetic purchase rate'],
      timeline: '3-4 sprints for tournament system, 2 weeks for initial event'
    });
  }
  
  return insights;
}

// ============================================================================
// Archetype Insights
// ============================================================================

function generateArchetypeInsights(summary: AchievementAnalyticsSummary): AchievementInsight[] {
  const insights: AchievementInsight[] = [];
  
  // Dominant archetype opportunity
  const dominantPercentage = summary.archetypeDistribution[
    summary.dominantArchetype as keyof typeof summary.archetypeDistribution
  ];
  
  if (dominantPercentage > 35) {
    const archetypeRecommendations: Record<string, {
      content: string;
      liveOps: string;
      monetization: string;
    }> = {
      achiever: {
        content: 'Prestige systems, hard-mode challenges, completion tracking dashboards',
        liveOps: 'Launch "Ultimate Challenge" event with extreme difficulty tiers and exclusive rewards',
        monetization: 'Premium achievement packs, completion boost consumables, prestige cosmetics'
      },
      competitor: {
        content: 'Ranked tournaments, seasonal championships, spectator features',
        liveOps: 'Create weekly ranked tournaments with tier-based rewards and leaderboard resets',
        monetization: 'Exclusive rank cosmetics, tournament entry passes, profile customization'
      },
      collector: {
        content: 'Limited-edition collectibles, completion rewards, showcase features',
        liveOps: 'Launch seasonal collection events with exclusive items and FOMO mechanics',
        monetization: 'Collectible bundles, storage expansions, premium collection series'
      },
      explorer: {
        content: 'Hidden achievements, discovery challenges, secret areas',
        liveOps: 'Create "Treasure Hunt" event with hidden achievements and discovery rewards',
        monetization: 'Exploration content packs, discovery boost items, exclusive areas'
      },
      socializer: {
        content: 'Guild achievements, cooperative goals, social sharing features',
        liveOps: 'Launch community-wide goals and guild vs guild competitions',
        monetization: 'Social cosmetics, guild perks, gifting features'
      },
      casual: {
        content: 'Accessible daily quests, quick wins, simplified progression',
        liveOps: 'Create casual-friendly events with low time commitment and guaranteed rewards',
        monetization: 'Convenience items, time-savers, optional difficulty reducers'
      }
    };
    
    const archetype = summary.dominantArchetype;
    const recs = archetypeRecommendations[archetype] || archetypeRecommendations.casual;
    
    insights.push({
      title: `${archetype.charAt(0).toUpperCase() + archetype.slice(1)} Archetype Dominance`,
      category: 'liveops',
      riskLevel: 'opportunity',
      observation: `${dominantPercentage.toFixed(0)}% of player base exhibits ${archetype} behavioral patterns`,
      supportingMetrics: {
        dominantArchetype: archetype,
        percentage: `${dominantPercentage.toFixed(1)}%`,
        diversity: summary.archetypeDiversity.toFixed(1)
      },
      interpretation: `Strong ${archetype} presence indicates clear player motivation patterns. This concentration suggests targeted content will have high engagement and retention impact.`,
      playerSegmentAffected: `${archetype.charAt(0).toUpperCase() + archetype.slice(1)} segment (${dominantPercentage.toFixed(0)}% of base)`,
      pmRecommendation: `Prioritize ${archetype}-focused content: ${recs.content}. Balance with content for other archetypes to increase diversity.`,
      liveOpsAction: recs.liveOps,
      priority: 7,
      expectedOutcome: `Increase ${archetype} segment retention by 25%, improve overall engagement metrics`,
      kpis: [`${archetype} segment retention`, 'Content engagement rate', 'Session frequency'],
      timeline: '2-3 sprints for permanent features, 1-2 weeks for events'
    });
  }
  
  // Low archetype diversity
  if (summary.archetypeDiversity < 50) {
    insights.push({
      title: 'Limited Player Archetype Diversity',
      category: 'engagement',
      riskLevel: 'medium',
      observation: `Archetype diversity score of ${summary.archetypeDiversity.toFixed(0)}/100 indicates homogeneous player base`,
      supportingMetrics: {
        diversityScore: summary.archetypeDiversity.toFixed(1),
        dominantArchetype: summary.dominantArchetype,
        dominantPercentage: `${dominantPercentage.toFixed(1)}%`
      },
      interpretation: 'Low diversity suggests content appeals primarily to one player type. This limits growth potential and makes game vulnerable to market shifts. Diverse player base is more stable and monetizes better.',
      playerSegmentAffected: 'Underrepresented archetypes not finding engaging content',
      pmRecommendation: 'Expand content variety to appeal to multiple archetypes. Add social features for socializers, exploration content for explorers, casual modes for casual players. Use archetype quiz to personalize onboarding.',
      liveOpsAction: 'Launch "Play Your Way" campaign with content for each archetype. Create archetype-specific progression paths and rewards. Add personalization features.',
      priority: 5,
      expectedOutcome: 'Increase archetype diversity to 65+, expand addressable market, improve retention across segments',
      kpis: ['Archetype diversity score', 'New player retention', 'Content engagement across archetypes'],
      timeline: '4-6 sprints for diverse content pipeline'
    });
  }
  
  return insights;
}

// ============================================================================
// Seasonal Insights
// ============================================================================

function generateSeasonalInsights(summary: AchievementAnalyticsSummary): AchievementInsight[] {
  const insights: AchievementInsight[] = [];
  
  // Low seasonal participation
  if (summary.seasonalParticipation < 45) {
    insights.push({
      title: 'Seasonal System Underutilization',
      category: 'retention',
      riskLevel: 'high',
      observation: `Only ${summary.seasonalParticipation.toFixed(1)}% of players engage with seasonal content`,
      supportingMetrics: {
        participation: `${summary.seasonalParticipation.toFixed(1)}%`,
        averageLevel: summary.averageSeasonLevel.toFixed(1),
        passConversion: `${summary.seasonPassConversion.toFixed(1)}%`
      },
      interpretation: 'Low seasonal participation suggests rewards are not compelling, system is unclear, or onboarding is insufficient. Seasonal systems are proven retention drivers when properly implemented.',
      playerSegmentAffected: `${(summary.totalPlayers * (1 - summary.seasonalParticipation / 100)).toFixed(0)} players not engaging with seasonal content`,
      pmRecommendation: 'Increase free track reward value to showcase system benefits. Add seasonal onboarding tutorial. Implement FOMO mechanics with limited-time exclusive rewards. Simplify seasonal UI.',
      liveOpsAction: 'Launch "Season Kickoff" event with bonus XP and free rewards. Create seasonal quick-start guide. Add mid-season catch-up mechanics for late joiners.',
      priority: 8,
      expectedOutcome: 'Increase seasonal participation to 60%+, improve long-term retention and monetization',
      kpis: ['Seasonal participation rate', 'Season pass conversion', 'D30 retention'],
      timeline: '2 sprints for system improvements, immediate for event'
    });
  }
  
  // Season pass conversion opportunity
  if (summary.seasonalParticipation > 50 && summary.seasonPassConversion < 20) {
    insights.push({
      title: 'Season Pass Conversion Gap',
      category: 'monetization',
      riskLevel: 'opportunity',
      observation: `${summary.seasonalParticipation.toFixed(0)}% participate in seasons but only ${summary.seasonPassConversion.toFixed(1)}% purchase pass`,
      supportingMetrics: {
        participation: `${summary.seasonalParticipation.toFixed(1)}%`,
        passConversion: `${summary.seasonPassConversion.toFixed(1)}%`,
        conversionGap: `${(summary.seasonalParticipation - summary.seasonPassConversion).toFixed(1)}%`
      },
      interpretation: 'High participation with low conversion indicates pricing concerns or insufficient perceived value. Players engage with system but don\'t see pass as worth purchase.',
      playerSegmentAffected: `~${((summary.seasonalParticipation - summary.seasonPassConversion) / 100 * summary.totalPlayers).toFixed(0)} engaged players not converting`,
      pmRecommendation: 'Increase free track rewards to better showcase pass value. Add mid-season purchase option with retroactive rewards. Test limited-time pass discounts. Implement pass gifting for social virality.',
      liveOpsAction: 'Run "Pass Preview" event showing premium rewards. Create comparison UI highlighting pass value. Offer first-time buyer discount. Add pass trial period.',
      priority: 7,
      expectedOutcome: 'Increase pass conversion to 25-30%, significant revenue increase from engaged player base',
      kpis: ['Season pass conversion rate', 'ARPU', 'Pass purchase timing'],
      timeline: '1-2 sprints for pricing/value changes, 1 week for promotional event'
    });
  }
  
  // Seasonal content exhaustion
  if (summary.averageSeasonLevel > 35) {
    insights.push({
      title: 'Seasonal Content Exhaustion Warning',
      category: 'liveops',
      riskLevel: 'high',
      observation: `Average season level of ${summary.averageSeasonLevel.toFixed(1)} indicates players approaching max level`,
      supportingMetrics: {
        averageLevel: summary.averageSeasonLevel.toFixed(1),
        participation: `${summary.seasonalParticipation.toFixed(1)}%`,
        retention: `${summary.seasonalRetention.toFixed(1)}%`
      },
      interpretation: 'Players nearing season completion will churn without new content. This is critical retention moment requiring immediate action to maintain engagement.',
      playerSegmentAffected: 'High-engagement seasonal players (top 25% of base)',
      pmRecommendation: 'Prepare next season launch with 2-3 weeks notice. Add bonus prestige tiers for max-level players. Create end-of-season celebration event. Tease next season content to maintain interest.',
      liveOpsAction: 'Announce next season immediately with teaser content. Launch "Season Finale" event with exclusive rewards. Add prestige levels or bonus tiers. Create season recap and player highlights.',
      priority: 9,
      expectedOutcome: 'Maintain seasonal player retention through transition, build anticipation for next season',
      kpis: ['Seasonal retention rate', 'Season-to-season carryover', 'Pre-registration for next season'],
      timeline: 'Immediate announcement, 2-3 weeks to next season launch'
    });
  }
  
  return insights;
}

// ============================================================================
// Engagement Insights
// ============================================================================

function generateEngagementInsights(summary: AchievementAnalyticsSummary): AchievementInsight[] {
  const insights: AchievementInsight[] = [];
  
  // Low daily engagement
  if (summary.dailyLoginRate < 40 || summary.averageStreak < 3) {
    insights.push({
      title: 'Daily Engagement Habit Formation Failure',
      category: 'retention',
      riskLevel: 'critical',
      observation: `Daily login rate of ${summary.dailyLoginRate.toFixed(1)}% with average streak of ${summary.averageStreak.toFixed(1)} days`,
      supportingMetrics: {
        dailyLoginRate: `${summary.dailyLoginRate.toFixed(1)}%`,
        averageStreak: summary.averageStreak.toFixed(1),
        weeklyActiveRate: `${summary.weeklyActiveRate.toFixed(1)}%`
      },
      interpretation: 'Low daily engagement indicates lack of compelling daily content or insufficient incentives for habit formation. Daily habits are strongest retention driver in F2P games.',
      playerSegmentAffected: 'All players, particularly casual segment',
      pmRecommendation: 'Implement escalating daily login rewards (days 1-7 with increasing value). Add streak protection mechanics (1-day grace period). Create daily challenges with unique rewards. Send push notifications for streak maintenance.',
      liveOpsAction: 'Launch "Daily Rewards Overhaul" with significantly increased reward value. Add streak milestone celebrations. Create "Comeback Bonus" for lapsed players. Implement smart notification timing.',
      priority: 10,
      expectedOutcome: 'Increase daily login rate to 55%+, average streak to 5+ days, improve D7 and D30 retention by 20%',
      kpis: ['Daily login rate', 'Average streak length', 'D7/D30 retention'],
      timeline: '1-2 sprints for system changes, immediate for reward increases'
    });
  }
  
  // Declining engagement trend
  if (summary.engagementTrend === 'declining') {
    insights.push({
      title: 'Engagement Trend Decline Detected',
      category: 'retention',
      riskLevel: 'critical',
      observation: 'Player engagement shows declining trend with increasing low-streak players',
      supportingMetrics: {
        trend: summary.engagementTrend,
        weeklyActiveRate: `${summary.weeklyActiveRate.toFixed(1)}%`,
        averageStreak: summary.averageStreak.toFixed(1)
      },
      interpretation: 'Declining engagement is early warning signal for retention crisis. Immediate intervention required to reverse trend before it impacts revenue and DAU.',
      playerSegmentAffected: 'All player segments showing engagement decline',
      pmRecommendation: 'Emergency content injection required. Launch high-value event immediately. Audit recent changes for negative impacts. Increase reward frequency and value. Add re-engagement campaigns for at-risk players.',
      liveOpsAction: 'Launch "Player Appreciation" event with generous rewards. Create win-back campaign for declining players. Add bonus content and limited-time offers. Increase communication frequency.',
      priority: 10,
      expectedOutcome: 'Reverse engagement trend within 2 weeks, stabilize retention metrics',
      kpis: ['Engagement trend direction', 'DAU', 'Session frequency', 'Retention rates'],
      timeline: 'Immediate event launch (1-3 days), ongoing monitoring'
    });
  }
  
  // Positive engagement trend opportunity
  if (summary.engagementTrend === 'increasing' && summary.averageStreak > 5) {
    insights.push({
      title: 'Strong Engagement Momentum Detected',
      category: 'liveops',
      riskLevel: 'opportunity',
      observation: `Engagement trending upward with ${summary.averageStreak.toFixed(1)}-day average streak`,
      supportingMetrics: {
        trend: summary.engagementTrend,
        averageStreak: summary.averageStreak.toFixed(1),
        weeklyActiveRate: `${summary.weeklyActiveRate.toFixed(1)}%`
      },
      interpretation: 'Positive engagement trend indicates recent changes are working. This is optimal time to introduce monetization features and premium content while player sentiment is high.',
      playerSegmentAffected: 'Highly engaged player segment (40%+ of base)',
      pmRecommendation: 'Capitalize on positive momentum with premium content launch. Introduce new monetization features while sentiment is high. Expand successful content types. Prepare for scale (server capacity, support).',
      liveOpsAction: 'Launch premium content pack or new season. Create limited-time offers for engaged players. Add VIP membership tier. Increase content cadence to maintain momentum.',
      priority: 6,
      expectedOutcome: 'Maintain engagement growth, increase monetization from engaged segment, build long-term retention',
      kpis: ['Engagement trend maintenance', 'ARPU growth', 'Content engagement rate'],
      timeline: '2-3 sprints for premium content, 1 week for offers'
    });
  }
  
  return insights;
}

// ============================================================================
// Archetype Profile Generation
// ============================================================================

export function generateArchetypeProfiles(
  summary: AchievementAnalyticsSummary
): PlayerArchetypeProfile[] {
  const profiles: PlayerArchetypeProfile[] = [];
  
  Object.entries(summary.archetypeDistribution).forEach(([archetype, percentage]) => {
    if (percentage < 5) return; // Skip insignificant segments
    
    const profileData: Record<string, Omit<PlayerArchetypeProfile, 'archetype' | 'percentage'>> = {
      achiever: {
        description: 'Goal-oriented players focused on completing all achievements and reaching 100%',
        characteristics: ['High completion rates', 'Systematic progression', 'Perfectionist tendencies', 'Long-term commitment'],
        motivations: ['Mastery', 'Completion', 'Recognition', 'Personal achievement'],
        retentionRisk: percentage > 30 ? 'low' : 'medium',
        monetizationPotential: 'high',
        recommendedContent: ['Prestige systems', 'Hard-mode challenges', 'Completion tracking', 'Exclusive rewards for 100%'],
        liveOpsOpportunities: ['Ultimate challenge events', 'Completion celebrations', 'Leaderboards for completionists', 'Time-limited perfect runs']
      },
      competitor: {
        description: 'Competitive players driven by leaderboard rankings and PvP performance',
        characteristics: ['High leaderboard engagement', 'Rank-focused behavior', 'Frequent play sessions', 'Status-conscious'],
        motivations: ['Competition', 'Status', 'Recognition', 'Dominance'],
        retentionRisk: 'low',
        monetizationPotential: 'high',
        recommendedContent: ['Ranked tournaments', 'Seasonal championships', 'Exclusive rank cosmetics', 'Spectator features'],
        liveOpsOpportunities: ['Weekly tournaments', 'Seasonal rank resets', 'Championship events', 'Esports integration']
      },
      collector: {
        description: 'Players motivated by collecting all items, cosmetics, and achievements',
        characteristics: ['High collection rates', 'Completionist mindset', 'Values exclusivity', 'FOMO-driven'],
        motivations: ['Collection', 'Exclusivity', 'Showcase', 'Completeness'],
        retentionRisk: 'medium',
        monetizationPotential: 'high',
        recommendedContent: ['Limited-edition items', 'Collection showcases', 'Seasonal collectibles', 'Trading systems'],
        liveOpsOpportunities: ['Collection events', 'Limited-time items', 'Seasonal series', 'Exclusive drops']
      },
      explorer: {
        description: 'Players who enjoy discovering hidden content and exploring all game areas',
        characteristics: ['High exploration metrics', 'Discovery-focused', 'Curious behavior', 'Thorough gameplay'],
        motivations: ['Discovery', 'Curiosity', 'Secrets', 'Exploration'],
        retentionRisk: 'medium',
        monetizationPotential: 'medium',
        recommendedContent: ['Hidden achievements', 'Secret areas', 'Discovery challenges', 'Exploration rewards'],
        liveOpsOpportunities: ['Treasure hunt events', 'New area releases', 'Mystery challenges', 'Discovery competitions']
      },
      socializer: {
        description: 'Players motivated by social interaction, cooperation, and community',
        characteristics: ['High social engagement', 'Cooperative behavior', 'Community-focused', 'Sharing tendencies'],
        motivations: ['Social connection', 'Cooperation', 'Community', 'Helping others'],
        retentionRisk: 'low',
        monetizationPotential: 'medium',
        recommendedContent: ['Guild systems', 'Cooperative achievements', 'Social features', 'Community goals'],
        liveOpsOpportunities: ['Guild events', 'Community challenges', 'Social competitions', 'Cooperative raids']
      },
      casual: {
        description: 'Players with low time commitment seeking accessible, low-pressure experiences',
        characteristics: ['Short sessions', 'Low progression velocity', 'Accessibility-focused', 'Flexible engagement'],
        motivations: ['Entertainment', 'Relaxation', 'Accessibility', 'Convenience'],
        retentionRisk: 'high',
        monetizationPotential: 'low',
        recommendedContent: ['Daily quests', 'Quick wins', 'Simplified modes', 'Convenience features'],
        liveOpsOpportunities: ['Casual-friendly events', 'Low-commitment challenges', 'Guaranteed rewards', 'Time-limited bonuses']
      }
    };
    
    const data = profileData[archetype];
    if (data) {
      profiles.push({
        archetype: archetype.charAt(0).toUpperCase() + archetype.slice(1),
        percentage,
        ...data
      });
    }
  });
  
  return profiles.sort((a, b) => b.percentage - a.percentage);
}

// ============================================================================
// Seasonal Health Analysis
// ============================================================================

export function generateSeasonalHealth(
  summary: AchievementAnalyticsSummary
): SeasonalHealthMetrics {
  const healthScore = calculateSeasonalHealthScore(summary);
  const concerns: string[] = [];
  const opportunities: string[] = [];
  
  // Identify concerns
  if (summary.seasonalParticipation < 45) {
    concerns.push(`Low participation rate (${summary.seasonalParticipation.toFixed(1)}%)`);
  }
  if (summary.seasonPassConversion < 15) {
    concerns.push(`Poor pass conversion (${summary.seasonPassConversion.toFixed(1)}%)`);
  }
  if (summary.seasonalRetention < 50) {
    concerns.push(`Low retention (${summary.seasonalRetention.toFixed(1)}%)`);
  }
  if (summary.averageSeasonLevel > 35) {
    concerns.push('Content exhaustion approaching');
  }
  
  // Identify opportunities
  if (summary.seasonalParticipation > 50 && summary.seasonPassConversion < 20) {
    opportunities.push('High participation with conversion gap - pricing/value optimization opportunity');
  }
  if (summary.averageSeasonLevel < 20) {
    opportunities.push('Early season - optimal time for mid-season content injection');
  }
  if (summary.seasonalRetention > 60) {
    opportunities.push('Strong retention - good foundation for premium features');
  }
  
  return {
    seasonId: 'current',
    participationRate: summary.seasonalParticipation,
    averageProgression: summary.averageSeasonLevel,
    completionRate: (summary.averageSeasonLevel / 50) * 100, // Assuming 50 max level
    passConversionRate: summary.seasonPassConversion,
    retentionImpact: summary.seasonalRetention,
    revenueImpact: `Estimated ${(summary.seasonPassConversion * 0.1).toFixed(1)}% of revenue`,
    healthScore,
    concerns,
    opportunities
  };
}

function calculateSeasonalHealthScore(summary: AchievementAnalyticsSummary): number {
  let score = 0;
  
  // Participation (0-30 points)
  score += Math.min((summary.seasonalParticipation / 60) * 30, 30);
  
  // Pass conversion (0-25 points)
  score += Math.min((summary.seasonPassConversion / 25) * 25, 25);
  
  // Retention (0-25 points)
  score += Math.min((summary.seasonalRetention / 70) * 25, 25);
  
  // Progression health (0-20 points)
  const progressionHealth = summary.averageSeasonLevel > 40 ? 10 : 20;
  score += progressionHealth;
  
  return Math.round(score);
}

// ============================================================================
// Leaderboard Analysis
// ============================================================================

export function generateLeaderboardAnalysis(
  summary: AchievementAnalyticsSummary
): LeaderboardAnalysis {
  const competitiveIntensity = calculateCompetitiveIntensity(summary);
  const recommendedActions: string[] = [];
  
  if (summary.leaderboardParticipation < 35) {
    recommendedActions.push('Increase leaderboard visibility in main UI');
    recommendedActions.push('Add tier-based leaderboards for accessibility');
    recommendedActions.push('Implement friend leaderboards');
  }
  
  if (summary.leaderboardChurn > 10) {
    recommendedActions.push('High rank volatility - consider more stable ranking algorithm');
    recommendedActions.push('Add rank protection mechanics');
  }
  
  if (summary.topTierPlayers < summary.totalPlayers * 0.05) {
    recommendedActions.push('Low top-tier representation - increase aspirational rewards');
    recommendedActions.push('Add progression path to top tier');
  }
  
  if (summary.leaderboardParticipation > 45) {
    recommendedActions.push('Strong engagement - launch competitive tournament system');
    recommendedActions.push('Add seasonal championships');
    recommendedActions.push('Implement spectator features');
  }
  
  return {
    totalParticipants: Math.round(summary.totalPlayers * (summary.leaderboardParticipation / 100)),
    participationRate: summary.leaderboardParticipation,
    competitiveIntensity,
    rankVolatility: summary.leaderboardChurn,
    topPlayerRetention: summary.topTierPlayers > 0 ? 85 : 0, // Estimated
    casualPlayerEngagement: Math.max(0, summary.leaderboardParticipation - 20),
    recommendedActions
  };
}

function calculateCompetitiveIntensity(summary: AchievementAnalyticsSummary): number {
  let intensity = 0;
  
  // Participation factor (0-40 points)
  intensity += Math.min((summary.leaderboardParticipation / 60) * 40, 40);
  
  // Top tier factor (0-30 points)
  const topTierPercentage = (summary.topTierPlayers / summary.totalPlayers) * 100;
  intensity += Math.min((topTierPercentage / 15) * 30, 30);
  
  // Churn/volatility factor (0-30 points)
  intensity += Math.min((summary.leaderboardChurn / 15) * 30, 30);
  
  return Math.round(intensity);
}

// Made with Bob - Achievement Insight Generator