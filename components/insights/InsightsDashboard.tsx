/**
 * Insights Dashboard Component
 *
 * Premium AI-powered dashboard with polished enterprise-grade visual system.
 */

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InsightCard } from './InsightCard';
import { AnalyticsCharts } from './AnalyticsCharts';
import { LiveOpsRecommendations } from './LiveOpsRecommendations';
import { AIInsights } from '@/lib/legacy/mockAI';
import { AnalyticsSummary } from '@/lib/analytics';
import { generateExecutiveSummary } from '@/lib/legacy/aiSummary';
import { generateLiveOpsRecommendations } from '@/lib/ai/generators/liveOpsGenerator';
import { LiveOpsEventRecommendation } from '@/types/ai';
import { formatPercentage, formatLargeNumber } from '@/lib/formatters';
import {
  AlertCircle,
  AlertTriangle,
  TrendingUp,
  Zap,
  Target,
  BarChart3,
  Loader2,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

interface InsightsDashboardProps {
  insights: AIInsights | null;
  summary: AnalyticsSummary;
  isLoading?: boolean;
}

export function InsightsDashboard({ insights, summary, isLoading }: InsightsDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [liveOpsRecommendations, setLiveOpsRecommendations] = useState<LiveOpsEventRecommendation[]>([]);
  
  // Generate LiveOps recommendations when summary is available
  useEffect(() => {
    if (summary && !isLoading) {
      const recommendations = generateLiveOpsRecommendations(summary);
      setLiveOpsRecommendations(recommendations);
    }
  }, [summary, isLoading]);
  
  const loadingMessages = [
    'Analyzing telemetry data...',
    'Identifying player behaviors...',
    'Detecting friction points...',
    'Evaluating retention patterns...',
    'Generating AI recommendations...',
    'Calculating engagement metrics...',
    'Processing gameplay patterns...',
    'Optimizing insights...'
  ];
  
  // Rotate loading messages
  useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isLoading, loadingMessages.length]);
  
  if (isLoading) {
    return (
      <Card className="w-full border-[#1f2937] bg-gradient-to-br from-[#59c378]/5 via-[#121826] to-[#121826]">
        <CardContent className="flex flex-col items-center justify-center py-24">
          <div className="relative mb-8">
            <div className="absolute inset-0 animate-ping">
              <Sparkles className="h-16 w-16 text-[#59c378] opacity-20" />
            </div>
            <Loader2 className="h-16 w-16 animate-spin text-[#59c378] relative z-10" />
          </div>
          <p className="text-2xl font-semibold mb-3 text-gradient-primary">
            {loadingMessages[loadingMessageIndex]}
          </p>
          <p className="text-sm text-[#94a3b8] max-w-md text-center leading-relaxed">
            Our AI is analyzing your gameplay telemetry to generate actionable insights for retention and monetization
          </p>
          <div className="flex gap-2 mt-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-2 w-2 rounded-full bg-[#59c378] animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!insights) {
    return null;
  }
  
  const totalInsights = 
    insights.retentionRisks.length +
    insights.frictionPoints.length +
    insights.monetizationOpportunities.length +
    insights.liveOpsSuggestions.length +
    insights.playerInsights.length;
  
  const criticalIssues = [
    ...insights.retentionRisks.filter(r => r.severity === 'high'),
    ...insights.frictionPoints.filter(f => f.severity === 'high')
  ].length;
  
  return (
    <div className="space-y-8">
      {/* Summary Stats - Premium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-premium metric-card hover-lift border-[#1f2937] bg-[#121826]">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#94a3b8] text-sm">Total Insights</CardDescription>
            <CardTitle className="text-4xl font-bold text-[#f8fafc]">{totalInsights}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-[#64748b]">
              AI-generated recommendations
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-premium metric-card hover-lift border-[#1f2937] bg-[#121826]">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#94a3b8] text-sm">Critical Issues</CardDescription>
            <CardTitle className="text-4xl font-bold text-[#ef4444]">{criticalIssues}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-[#64748b]">
              High-priority items
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-premium metric-card hover-lift border-[#1f2937] bg-[#121826]">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#94a3b8] text-sm">Opportunities</CardDescription>
            <CardTitle className="text-4xl font-bold text-[#59c378]">
              {insights.monetizationOpportunities.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-[#64748b]">
              Monetization strategies
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-premium metric-card hover-lift border-[#1f2937] bg-[#121826]">
          <CardHeader className="pb-3">
            <CardDescription className="text-[#94a3b8] text-sm">Player Segments</CardDescription>
            <CardTitle className="text-4xl font-bold text-[#3b82f6]">
              {insights.playerInsights.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-[#64748b]">
              Identified behaviors
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Insights Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-[#121826] border border-[#1f2937] p-1">
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 data-[state=active]:bg-[#59c378]/10 data-[state=active]:text-[#59c378] transition-smooth"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger 
            value="risks" 
            className="flex items-center gap-2 data-[state=active]:bg-[#ef4444]/10 data-[state=active]:text-[#ef4444] transition-smooth"
          >
            <AlertCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Risks</span>
            {insights.retentionRisks.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#ef4444] text-white rounded-full font-semibold">
                {insights.retentionRisks.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="friction" 
            className="flex items-center gap-2 data-[state=active]:bg-[#f59e0b]/10 data-[state=active]:text-[#f59e0b] transition-smooth"
          >
            <AlertTriangle className="h-4 w-4" />
            <span className="hidden sm:inline">Friction</span>
            {insights.frictionPoints.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-[#f59e0b] text-white rounded-full font-semibold">
                {insights.frictionPoints.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="monetization" 
            className="flex items-center gap-2 data-[state=active]:bg-[#59c378]/10 data-[state=active]:text-[#59c378] transition-smooth"
          >
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Revenue</span>
          </TabsTrigger>
          <TabsTrigger 
            value="liveops" 
            className="flex items-center gap-2 data-[state=active]:bg-[#59c378]/10 data-[state=active]:text-[#59c378] transition-smooth"
          >
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">LiveOps</span>
          </TabsTrigger>
          <TabsTrigger 
            value="players" 
            className="flex items-center gap-2 data-[state=active]:bg-[#3b82f6]/10 data-[state=active]:text-[#3b82f6] transition-smooth"
          >
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Players</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8 mt-8">
          {/* AI Executive Summary */}
          <Card className="card-premium border-[#1f2937] bg-gradient-to-br from-[#59c378]/5 via-[#121826] to-[#121826] glow-primary">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#59c378]/10 border border-[#59c378]/20">
                  <Sparkles className="h-6 w-6 text-[#59c378]" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-[#f8fafc]">AI Executive Summary</CardTitle>
                  <CardDescription className="text-[#94a3b8] mt-1">
                    AI-powered insights from gameplay telemetry analysis
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Insights */}
              <div className="space-y-3">
                {generateExecutiveSummary(summary).insights.map((insight, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-lg bg-[#0b1020]/50 border border-[#1f2937] hover:border-[#59c378]/30 transition-smooth hover-lift"
                  >
                    <div className="mt-1">
                      <div className="h-2 w-2 rounded-full bg-[#59c378] shadow-[0_0_8px_rgba(89,195,120,0.5)]" />
                    </div>
                    <p className="text-sm leading-relaxed text-[#f8fafc]">
                      {insight}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-[#1f2937]">
                {generateExecutiveSummary(summary).keyFindings.map((finding, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 p-4 rounded-lg bg-[#0b1020]/50 border border-[#1f2937] hover:border-[#59c378]/20 transition-smooth"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-[#94a3b8]">
                        {finding.label}
                      </span>
                      {finding.trend === 'positive' && (
                        <ArrowUp className="h-3.5 w-3.5 text-[#59c378]" />
                      )}
                      {finding.trend === 'negative' && (
                        <ArrowDown className="h-3.5 w-3.5 text-[#ef4444]" />
                      )}
                      {finding.trend === 'neutral' && (
                        <Minus className="h-3.5 w-3.5 text-[#94a3b8]" />
                      )}
                    </div>
                    <span className={`text-2xl font-bold ${
                      finding.trend === 'positive' ? 'text-[#59c378]' :
                      finding.trend === 'negative' ? 'text-[#ef4444]' :
                      'text-[#f8fafc]'
                    }`}>
                      {finding.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Analytics Charts */}
          <Card className="card-premium border-[#1f2937] bg-[#121826]">
            <CardHeader className="pb-6">
              <CardTitle className="text-xl font-semibold text-[#f8fafc]">Analytics Overview</CardTitle>
              <CardDescription className="text-[#94a3b8]">
                Visual analysis of gameplay telemetry data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsCharts summary={summary} />
            </CardContent>
          </Card>
          
          {/* Quick Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Priority Items */}
            <Card className="card-premium border-[#1f2937] bg-[#121826]">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-[#f8fafc]">Top Priority Actions</CardTitle>
                <CardDescription className="text-[#94a3b8] text-sm">
                  Most critical items requiring immediate attention
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[...insights.retentionRisks, ...insights.frictionPoints]
                  .filter(item => item.severity === 'high')
                  .slice(0, 3)
                  .map((item, index) => (
                    <div key={index} className="p-4 border border-[#1f2937] rounded-lg hover:border-[#ef4444]/30 transition-smooth bg-[#0b1020]/30">
                      <p className="font-semibold text-sm mb-2 text-[#f8fafc]">{item.title}</p>
                      <p className="text-xs text-[#94a3b8] line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  ))}
                {[...insights.retentionRisks, ...insights.frictionPoints]
                  .filter(item => item.severity === 'high').length === 0 && (
                  <div className="text-center py-8">
                    <div className="inline-flex p-3 rounded-full bg-[#59c378]/10 mb-3">
                      <Sparkles className="h-6 w-6 text-[#59c378]" />
                    </div>
                    <p className="text-sm text-[#94a3b8]">
                      No critical issues detected
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Quick Wins */}
            <Card className="card-premium border-[#1f2937] bg-[#121826]">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-[#f8fafc]">Quick Wins</CardTitle>
                <CardDescription className="text-[#94a3b8] text-sm">
                  High-impact opportunities with low effort
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {insights.monetizationOpportunities
                  .filter(opp => opp.potentialImpact === 'high')
                  .slice(0, 3)
                  .map((opp, index) => (
                    <div key={index} className="p-4 border border-[#1f2937] rounded-lg hover:border-[#59c378]/30 transition-smooth bg-[#0b1020]/30">
                      <p className="font-semibold text-sm mb-2 text-[#f8fafc]">{opp.title}</p>
                      <p className="text-xs text-[#94a3b8] line-clamp-2 leading-relaxed">
                        {opp.description}
                      </p>
                    </div>
                  ))}
                {insights.monetizationOpportunities
                  .filter(opp => opp.potentialImpact === 'high').length === 0 && (
                  <div className="text-center py-8">
                    <div className="inline-flex p-3 rounded-full bg-[#59c378]/10 mb-3">
                      <TrendingUp className="h-6 w-6 text-[#59c378]" />
                    </div>
                    <p className="text-sm text-[#94a3b8]">
                      Review monetization tab for opportunities
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Retention Risks Tab */}
        <TabsContent value="risks" className="space-y-6 mt-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-[#f8fafc] mb-2">Retention Risks</h3>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              Player behaviors and metrics indicating potential churn
            </p>
          </div>
          {insights.retentionRisks.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {insights.retentionRisks.map((risk, index) => (
                <InsightCard
                  key={index}
                  type="risk"
                  title={risk.title}
                  description={risk.description}
                  severity={risk.severity}
                  affectedPlayers={risk.affectedPlayers}
                  recommendation={risk.recommendation}
                />
              ))}
            </div>
          ) : (
            <Card className="card-premium border-[#1f2937] bg-[#121826]">
              <CardContent className="py-16 text-center">
                <div className="inline-flex p-4 rounded-full bg-[#59c378]/10 mb-4">
                  <Sparkles className="h-8 w-8 text-[#59c378]" />
                </div>
                <p className="text-[#94a3b8]">No retention risks detected</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Friction Points Tab */}
        <TabsContent value="friction" className="space-y-6 mt-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-[#f8fafc] mb-2">Friction Points</h3>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              Areas where players struggle or experience poor UX
            </p>
          </div>
          {insights.frictionPoints.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {insights.frictionPoints.map((friction, index) => (
                <InsightCard
                  key={index}
                  type="friction"
                  title={friction.title}
                  description={friction.description}
                  severity={friction.severity}
                  metric={friction.metric}
                  recommendation={friction.recommendation}
                />
              ))}
            </div>
          ) : (
            <Card className="card-premium border-[#1f2937] bg-[#121826]">
              <CardContent className="py-16 text-center">
                <div className="inline-flex p-4 rounded-full bg-[#59c378]/10 mb-4">
                  <Sparkles className="h-8 w-8 text-[#59c378]" />
                </div>
                <p className="text-[#94a3b8]">No friction points detected</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Monetization Tab */}
        <TabsContent value="monetization" className="space-y-6 mt-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-[#f8fafc] mb-2">Monetization Opportunities</h3>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              Data-driven strategies to increase revenue
            </p>
          </div>
          {insights.monetizationOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {insights.monetizationOpportunities.map((opportunity, index) => (
                <InsightCard
                  key={index}
                  type="opportunity"
                  title={opportunity.title}
                  description={opportunity.description}
                  playerSegment={opportunity.playerSegment}
                  potentialImpact={opportunity.potentialImpact}
                  implementation={opportunity.implementation}
                />
              ))}
            </div>
          ) : (
            <Card className="card-premium border-[#1f2937] bg-[#121826]">
              <CardContent className="py-16 text-center">
                <div className="inline-flex p-4 rounded-full bg-[#59c378]/10 mb-4">
                  <TrendingUp className="h-8 w-8 text-[#59c378]" />
                </div>
                <p className="text-[#94a3b8]">No monetization opportunities identified</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* LiveOps Tab - Premium Event Recommendations */}
        <TabsContent value="liveops" className="mt-8">
          <LiveOpsRecommendations
            recommendations={liveOpsRecommendations}
            isLoading={isLoading}
          />
        </TabsContent>
        
        {/* Player Insights Tab */}
        <TabsContent value="players" className="space-y-6 mt-8">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-[#f8fafc] mb-2">Player Insights</h3>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              Behavioral segments and their characteristics
            </p>
          </div>
          {insights.playerInsights.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {insights.playerInsights.map((insight, index) => (
                <InsightCard
                  key={index}
                  type="insight"
                  title={insight.segment}
                  description={insight.description}
                  size={insight.size}
                  behavior={insight.behavior}
                  needs={insight.needs}
                />
              ))}
            </div>
          ) : (
            <Card className="card-premium border-[#1f2937] bg-[#121826]">
              <CardContent className="py-16 text-center">
                <div className="inline-flex p-4 rounded-full bg-[#3b82f6]/10 mb-4">
                  <Target className="h-8 w-8 text-[#3b82f6]" />
                </div>
                <p className="text-[#94a3b8]">No player insights available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Made with Bob
