"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LiveOpsEventRecommendation } from "@/types/ai";
import { 
  Calendar, 
  Target, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Zap,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Trophy,
  Sparkles
} from "lucide-react";

interface LiveOpsEventCardProps {
  event: LiveOpsEventRecommendation;
}

const eventTypeConfig = {
  combat: {
  icon: Trophy,
  border: "border-blue-500/10",
  badge: "bg-blue-500/10 text-blue-400 border-blue-500/20"
},
  collection: { 
    icon: Sparkles, 
    gradient: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/30",
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/30"
  },
  social: { 
    icon: Users, 
    gradient: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/30",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/30"
  },
  progression: { 
    icon: TrendingUp, 
    gradient: "from-green-500/20 to-emerald-500/20",
    border: "border-green-500/30",
    badge: "bg-green-500/10 text-green-400 border-green-500/30"
  },
  seasonal: { 
    icon: Calendar, 
    gradient: "from-amber-500/20 to-yellow-500/20",
    border: "border-amber-500/30",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/30"
  },
  challenge: { 
    icon: Zap, 
    gradient: "from-violet-500/20 to-fuchsia-500/20",
    border: "border-violet-500/30",
    badge: "bg-violet-500/10 text-violet-400 border-violet-500/30"
  }
};

const priorityConfig = {
  critical: { color: "bg-red-500/10 text-red-400 border-red-500/30", label: "Critical" },
  high: { color: "bg-orange-500/10 text-orange-400 border-orange-500/30", label: "High" },
  medium: { color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30", label: "Medium" },
  low: { color: "bg-gray-500/10 text-gray-400 border-gray-500/30", label: "Low" }
};

const complexityConfig = {
  low: { color: "text-green-400", label: "Low complexity" },
  medium: { color: "text-yellow-400", label: "Medium complexity" },
  high: { color: "text-red-400", label: "High complexity" }
};

const revenueConfig = {
  high: { color: "text-green-400", icon: "💰💰💰" },
  medium: { color: "text-yellow-400", icon: "💰💰" },
  low: { color: "text-gray-400", icon: "💰" }
};

export function LiveOpsEventCard({ event }: LiveOpsEventCardProps) {
  const typeConfig = eventTypeConfig[event.eventType];
  const TypeIcon = typeConfig.icon;
  const priorityStyle = priorityConfig[event.priority];
  const complexityStyle = complexityConfig[event.implementationComplexity];
  const revenueStyle = revenueConfig[event.monetizationConsiderations.revenueOpportunity];

  return (
<Card
  className={`
    relative overflow-hidden
    border ${typeConfig.border}
    bg-[#0B1020]
    backdrop-blur-sm
    transition-all duration-300
    shadow-[0_0_25px_rgba(59,130,246,0.03)]
    before:absolute
    before:inset-0
    before:bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.05),transparent_22%)]
    before:pointer-events-none
  `}
>      {/* Priority Badge - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <Badge className={`${priorityStyle.color} border font-semibold`}>
          {priorityStyle.label}
        </Badge>
      </div>

      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
<div className={`p-3 rounded-xl bg-blue-500/5 ring-1 ${typeConfig.border}`}>            <TypeIcon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold mb-2 pr-24">
              {event.eventName}
            </CardTitle>
            <CardDescription className="text-base">
              {event.engagementObjective}
            </CardDescription>
          </div>
        </div>

        {/* Event Type Badge */}
        <div className="flex gap-2 mt-3">
          <Badge className={`${typeConfig.badge} border`}>
            {event.eventType.charAt(0).toUpperCase() + event.eventType.slice(1)} event
          </Badge>
          <Badge variant="outline" className="border-muted-foreground/30">
            <Clock className="h-3 w-3 mr-1" />
            {event.duration}
          </Badge>
          <Badge variant="outline" className="border-muted-foreground/30">
            <Calendar className="h-3 w-3 mr-1" />
            {event.recommendedCadence}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Target Segment */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Target className="h-4 w-4" />
            Target segment
          </div>
          <div className="pl-6">
            <p className="font-medium text-foreground">{event.targetSegment}</p>
            <p className="text-sm text-muted-foreground mt-1">
              <Users className="h-3 w-3 inline mr-1" />
              {event.segmentSize}
            </p>
          </div>
        </div>

        {/* Reward Structure */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Trophy className="h-4 w-4" />
            Reward structure
          </div>
          <div className="pl-6 space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Primary: {event.rewardStructure.primary}</p>
              </div>
            </div>
            {event.rewardStructure.secondary.map((reward, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">{reward}</p>
              </div>
            ))}
            <div className="pt-1 border-t border-muted-foreground/20">
              <p className="text-sm text-muted-foreground">
                <TrendingUp className="h-3 w-3 inline mr-1" />
                {event.rewardStructure.progression}
              </p>
            </div>
          </div>
        </div>

        {/* Retention Impact */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            Expected retention impact
          </div>
          <div className="pl-6 grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-background/50 border border-muted-foreground/20">
              <p className="text-xs text-muted-foreground mb-1">D1 Retention</p>
              <p className="text-lg font-bold text-green-400">{event.retentionImpact.expectedD1Lift}</p>
            </div>
            <div className="p-3 rounded-lg bg-background/50 border border-muted-foreground/20">
              <p className="text-xs text-muted-foreground mb-1">D7 Retention</p>
              <p className="text-lg font-bold text-green-400">{event.retentionImpact.expectedD7Lift}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground pl-6 pt-1">
            Target: {event.retentionImpact.targetMetric}
          </p>
        </div>

        {/* Monetization */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <DollarSign className="h-4 w-4" />
            Monetization opportunity
          </div>
          <div className="pl-6 space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-muted-foreground/20">
              <span className="text-sm font-medium">Revenue potential</span>
              <span className={`text-lg font-bold ${revenueStyle.color}`}>
                {revenueStyle.icon}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-background/50 border border-muted-foreground/20">
              <p className="text-xs text-muted-foreground mb-1">Estimated ARPU impact</p>
              <p className="text-base font-bold">{event.monetizationConsiderations.estimatedARPU}</p>
            </div>
            <div className="space-y-1">
              {event.monetizationConsiderations.monetizationMechanics.map((mechanic, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <span className="text-muted-foreground">{mechanic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Implementation */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Zap className="h-4 w-4" />
            Implementation
          </div>
          <div className="pl-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Complexity</span>
              <span className={`text-sm font-semibold ${complexityStyle.color}`}>
                {complexityStyle.label}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded bg-background/50 border border-muted-foreground/20">
                <p className="text-muted-foreground mb-1">Dev</p>
                <p className="font-medium">{event.resourceRequirements.development}</p>
              </div>
              <div className="p-2 rounded bg-background/50 border border-muted-foreground/20">
                <p className="text-muted-foreground mb-1">Art</p>
                <p className="font-medium">{event.resourceRequirements.art}</p>
              </div>
              <div className="p-2 rounded bg-background/50 border border-muted-foreground/20">
                <p className="text-muted-foreground mb-1">QA</p>
                <p className="font-medium">{event.resourceRequirements.qa}</p>
              </div>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <Target className="h-4 w-4" />
            Success metrics
          </div>
          <div className="pl-6 flex flex-wrap gap-2">
            {event.kpis.map((kpi, idx) => (
              <Badge key={idx} variant="outline" className="border-primary/30 bg-primary/5">
                {kpi}
              </Badge>
            ))}
          </div>
        </div>

        {/* Risks */}
        {event.risks.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              Risk considerations
            </div>
            <div className="pl-6 space-y-1">
              {event.risks.map((risk, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="h-3 w-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{risk}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Made with Bob
