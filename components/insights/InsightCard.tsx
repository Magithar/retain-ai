/**
 * Insight Card Component
 * 
 * Premium AI-powered insight cards with polished visual design.
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, AlertTriangle, Info, TrendingUp, Zap, Target } from 'lucide-react';

export type InsightSeverity = 'high' | 'medium' | 'low';
export type InsightType = 'risk' | 'friction' | 'opportunity' | 'suggestion' | 'insight';

interface InsightCardProps {
  title: string;
  description: string;
  severity?: InsightSeverity;
  type: InsightType;
  metric?: string;
  recommendation?: string;
  affectedPlayers?: string;
  playerSegment?: string;
  potentialImpact?: InsightSeverity;
  implementation?: string;
  priority?: InsightSeverity;
  expectedOutcome?: string;
  size?: string;
  behavior?: string;
  needs?: string;
}

const severityConfig = {
  high: {
    color: 'text-[#ef4444]',
    bg: 'bg-[#ef4444]/10',
    border: 'border-[#ef4444]/30',
    label: 'High',
    accent: 'border-l-[#ef4444]',
    badgeBg: 'bg-[#ef4444]',
    badgeText: 'text-white'
  },
  medium: {
    color: 'text-[#f59e0b]',
    bg: 'bg-[#f59e0b]/10',
    border: 'border-[#f59e0b]/30',
    label: 'Medium',
    accent: 'border-l-[#f59e0b]',
    badgeBg: 'bg-[#f59e0b]',
    badgeText: 'text-white'
  },
  low: {
    color: 'text-[#59c378]',
    bg: 'bg-[#59c378]/10',
    border: 'border-[#59c378]/30',
    label: 'Low',
    accent: 'border-l-[#59c378]',
    badgeBg: 'bg-[#59c378]',
    badgeText: 'text-white'
  }
};

const typeConfig = {
  risk: {
    icon: AlertCircle,
    color: 'text-[#ef4444]',
    bg: 'bg-[#ef4444]/10',
    label: 'Retention Risk'
  },
  friction: {
    icon: AlertTriangle,
    color: 'text-[#f59e0b]',
    bg: 'bg-[#f59e0b]/10',
    label: 'Friction Point'
  },
  opportunity: {
    icon: TrendingUp,
    color: 'text-[#59c378]',
    bg: 'bg-[#59c378]/10',
    label: 'Monetization'
  },
  suggestion: {
    icon: Zap,
    color: 'text-[#59c378]',
    bg: 'bg-[#59c378]/10',
    label: 'LiveOps'
  },
  insight: {
    icon: Target,
    color: 'text-[#3b82f6]',
    bg: 'bg-[#3b82f6]/10',
    label: 'Player Insight'
  }
};

export function InsightCard({
  title,
  description,
  severity,
  type,
  metric,
  recommendation,
  affectedPlayers,
  playerSegment,
  potentialImpact,
  implementation,
  priority,
  expectedOutcome,
  size,
  behavior,
  needs
}: InsightCardProps) {
  const Icon = typeConfig[type].icon;
  const displaySeverity = severity || priority || potentialImpact;
  
  return (
    <Card className={`
      card-premium hover-lift border-[#1f2937] bg-[#121826]
      ${displaySeverity ? `border-l-4 ${severityConfig[displaySeverity].accent}` : ''}
    `}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className={`p-2.5 rounded-lg ${typeConfig[type].bg} border border-[#1f2937]`}>
              <Icon className={`h-5 w-5 ${typeConfig[type].color}`} />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg mb-1.5 font-semibold text-[#f8fafc]">{title}</CardTitle>
              <CardDescription className="text-xs text-[#94a3b8] font-medium">
                {typeConfig[type].label}
              </CardDescription>
            </div>
          </div>
          {displaySeverity && (
            <div className={`
              px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide
              ${severityConfig[displaySeverity].badgeBg}
              ${severityConfig[displaySeverity].badgeText}
              shadow-sm
            `}>
              {severityConfig[displaySeverity].label}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <p className="text-sm text-[#f8fafc]/90 leading-relaxed">
          {description}
        </p>
        
        {/* Metrics Section */}
        {(metric || affectedPlayers || playerSegment || size) && (
          <div className="flex flex-wrap gap-2 pt-2">
            {metric && (
              <div className="px-3 py-1.5 bg-[#0b1020]/50 rounded-md text-xs border border-[#1f2937]">
                <span className="font-semibold text-[#f8fafc]">Metric:</span>{' '}
                <span className="text-[#94a3b8]">{metric}</span>
              </div>
            )}
            {affectedPlayers && (
              <div className="px-3 py-1.5 bg-[#0b1020]/50 rounded-md text-xs border border-[#1f2937]">
                <span className="font-semibold text-[#f8fafc]">Affected:</span>{' '}
                <span className="text-[#94a3b8]">{affectedPlayers}</span>
              </div>
            )}
            {playerSegment && (
              <div className="px-3 py-1.5 bg-[#0b1020]/50 rounded-md text-xs border border-[#1f2937]">
                <span className="font-semibold text-[#f8fafc]">Segment:</span>{' '}
                <span className="text-[#94a3b8]">{playerSegment}</span>
              </div>
            )}
            {size && (
              <div className="px-3 py-1.5 bg-[#0b1020]/50 rounded-md text-xs border border-[#1f2937]">
                <span className="font-semibold text-[#f8fafc]">Size:</span>{' '}
                <span className="text-[#94a3b8]">{size}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Behavior Section (for player insights) */}
        {behavior && (
          <div className="p-3.5 bg-[#0b1020]/50 rounded-lg border border-[#1f2937]">
            <p className="text-xs font-bold mb-1.5 text-[#f8fafc] uppercase tracking-wide">Behavior Pattern</p>
            <p className="text-sm text-[#94a3b8] leading-relaxed">{behavior}</p>
          </div>
        )}
        
        {/* Needs Section (for player insights) */}
        {needs && (
          <div className="p-3.5 bg-[#0b1020]/50 rounded-lg border border-[#1f2937]">
            <p className="text-xs font-bold mb-1.5 text-[#f8fafc] uppercase tracking-wide">Player Needs</p>
            <p className="text-sm text-[#94a3b8] leading-relaxed">{needs}</p>
          </div>
        )}
        
        {/* Recommendation Section */}
        {recommendation && (
          <div className="p-3.5 bg-[#59c378]/5 rounded-lg border border-[#59c378]/20 shadow-sm">
            <p className="text-xs font-bold mb-1.5 text-[#59c378] uppercase tracking-wide">💡 Recommendation</p>
            <p className="text-sm text-[#f8fafc]/90 leading-relaxed">{recommendation}</p>
          </div>
        )}
        
        {/* Implementation Section (for monetization) */}
        {implementation && (
          <div className="p-3.5 bg-[#59c378]/5 rounded-lg border border-[#59c378]/20 shadow-sm">
            <p className="text-xs font-bold mb-1.5 text-[#59c378] uppercase tracking-wide">
              🚀 Implementation
            </p>
            <p className="text-sm text-[#f8fafc]/90 leading-relaxed">{implementation}</p>
          </div>
        )}
        
        {/* Expected Outcome Section (for LiveOps) */}
        {expectedOutcome && (
          <div className="p-3.5 bg-[#59c378]/5 rounded-lg border border-[#59c378]/20 shadow-sm">
            <p className="text-xs font-bold mb-1.5 text-[#59c378] uppercase tracking-wide">
              🎯 Expected Outcome
            </p>
            <p className="text-sm text-[#f8fafc]/90 leading-relaxed">{expectedOutcome}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Made with Bob
