"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LiveOpsEventCard } from "./LiveOpsEventCard";
import { LiveOpsEventRecommendation } from "@/types/ai";
import { Sparkles, TrendingUp, Calendar } from "lucide-react";

interface LiveOpsRecommendationsProps {
  recommendations: LiveOpsEventRecommendation[];
  isLoading?: boolean;
}

export function LiveOpsRecommendations({ 
  recommendations, 
  isLoading = false 
}: LiveOpsRecommendationsProps) {
  if (isLoading) {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20 animate-pulse">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">LiveOps Event Recommendations</CardTitle>
              <CardDescription>Generating AI-powered event strategies...</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 rounded-lg bg-muted/50 animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card className="border-muted-foreground/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">LiveOps Event Recommendations</CardTitle>
              <CardDescription>No recommendations available</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Upload telemetry data to generate AI-powered LiveOps event recommendations.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate summary stats
  const criticalCount = recommendations.filter(r => r.priority === 'critical').length;
  const highCount = recommendations.filter(r => r.priority === 'high').length;
  const highRevenueCount = recommendations.filter(
    r => r.monetizationConsiderations.revenueOpportunity === 'high'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header Card with Summary */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/20">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">LiveOps Event Recommendations</CardTitle>
              <CardDescription>
                AI-powered event strategies based on telemetry insights and PM heuristics
              </CardDescription>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 rounded-lg bg-background/50 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Total Events</span>
              </div>
              <p className="text-3xl font-bold">{recommendations.length}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {criticalCount} critical, {highCount} high priority
              </p>
            </div>

            <div className="p-4 rounded-lg bg-background/50 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-sm font-medium text-muted-foreground">High Revenue</span>
              </div>
              <p className="text-3xl font-bold text-green-400">{highRevenueCount}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Events with high monetization potential
              </p>
            </div>

            <div className="p-4 rounded-lg bg-background/50 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-muted-foreground">Avg. Impact</span>
              </div>
              <p className="text-3xl font-bold text-blue-400">+15%</p>
              <p className="text-xs text-muted-foreground mt-1">
                Expected D7 retention lift
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Priority Events Section */}
      {criticalCount > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-red-500 animate-pulse" />
            <h3 className="text-lg font-semibold text-red-400">Critical Priority Events</h3>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {recommendations
              .filter(r => r.priority === 'critical')
              .map((event, idx) => (
                <LiveOpsEventCard key={idx} event={event} />
              ))}
          </div>
        </div>
      )}

      {/* High Priority Events */}
      {highCount > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-orange-500" />
            <h3 className="text-lg font-semibold text-orange-400">High Priority Events</h3>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {recommendations
              .filter(r => r.priority === 'high')
              .map((event, idx) => (
                <LiveOpsEventCard key={idx} event={event} />
              ))}
          </div>
        </div>
      )}

      {/* Medium Priority Events */}
      {recommendations.filter(r => r.priority === 'medium').length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-yellow-500" />
            <h3 className="text-lg font-semibold text-yellow-400">Medium Priority Events</h3>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {recommendations
              .filter(r => r.priority === 'medium')
              .map((event, idx) => (
                <LiveOpsEventCard key={idx} event={event} />
              ))}
          </div>
        </div>
      )}

      {/* Low Priority Events */}
      {recommendations.filter(r => r.priority === 'low').length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-gray-500" />
            <h3 className="text-lg font-semibold text-gray-400">Additional Opportunities</h3>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {recommendations
              .filter(r => r.priority === 'low')
              .map((event, idx) => (
                <LiveOpsEventCard key={idx} event={event} />
              ))}
          </div>
        </div>
      )}

      {/* Implementation Timeline Suggestion */}
      <Card className="border-muted-foreground/20 bg-muted/5">
        <CardHeader>
          <CardTitle className="text-lg">Recommended Implementation Timeline</CardTitle>
          <CardDescription>
            Suggested rollout schedule based on priority and resource requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-red-500/20">
              <div className="font-semibold text-red-400 min-w-[80px]">Week 1-2</div>
              <div className="text-sm text-muted-foreground">
                Deploy critical priority events immediately to address urgent retention issues
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-orange-500/20">
              <div className="font-semibold text-orange-400 min-w-[80px]">Week 3-6</div>
              <div className="text-sm text-muted-foreground">
                Launch high priority events to capitalize on engagement opportunities
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-yellow-500/20">
              <div className="font-semibold text-yellow-400 min-w-[80px]">Month 2-3</div>
              <div className="text-sm text-muted-foreground">
                Roll out medium priority events and establish regular cadence
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-blue-500/20">
              <div className="font-semibold text-blue-400 min-w-[80px]">Ongoing</div>
              <div className="text-sm text-muted-foreground">
                Monitor KPIs, iterate based on performance, and maintain event calendar
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Made with Bob
