/**
 * Analytics Charts Component
 * 
 * Premium AI-powered charts with capability-aware visualization.
 * Only displays charts for available telemetry data.
 */

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { AnalyticsSummary } from '@/lib/analytics';
import { formatPercentage, formatDecimal, formatRatio } from '@/lib/formatters';
import { Sparkles, AlertCircle } from 'lucide-react';

interface AnalyticsChartsProps {
  summary: AnalyticsSummary;
}

/**
 * Generate AI insight for a chart based on data patterns
 */
function generateChartInsight(type: string, summary: AnalyticsSummary): string {
  switch (type) {
    case 'combat':
      const avgKD = summary.killDeathRatio;
      if (avgKD === null) {
        return "Combat telemetry unavailable in uploaded dataset.";
      }
      if (avgKD > 2) {
        return "Players with higher kill counts consistently achieve better scores, indicating strong combat-reward correlation.";
      } else if (avgKD < 0.5) {
        return "Low K/D ratio suggests combat difficulty may be impacting player progression and retention.";
      }
      return "Combat performance shows moderate correlation with session scores across player base.";
    
    case 'kills-deaths':
      if (summary.averageDeaths === null || summary.averageKills === null) {
        return "Combat telemetry unavailable in uploaded dataset.";
      }
      if (summary.averageDeaths > summary.averageKills * 2) {
        return "High death rate detected. Consider adjusting difficulty or improving player onboarding.";
      } else if (summary.averageKills > summary.averageDeaths * 2) {
        return "Players are dominating combat encounters. Consider increasing challenge for engaged players.";
      }
      return `Balanced combat with ${formatRatio(summary.averageKills, summary.averageDeaths)} K/D ratio across sessions.`;
    
    case 'time-distribution':
      if (summary.combatTimePercentage === null) {
        return "Combat time telemetry unavailable in uploaded dataset.";
      }
      if (summary.combatTimePercentage > 70) {
        return "Players spend majority of time in combat. Consider adding exploration incentives for variety.";
      } else if (summary.combatTimePercentage < 30) {
        return "Low combat engagement detected. Players may be avoiding encounters or struggling to find action.";
      }
      return `Balanced gameplay with ${formatPercentage(summary.combatTimePercentage / 100)} time in combat encounters.`;
    
    case 'pickup-efficiency':
      if (summary.pickupEfficiency === null) {
        return "Pickup telemetry unavailable in uploaded dataset.";
      }
      if (summary.pickupEfficiency < 50) {
        return `Only ${formatPercentage(summary.pickupEfficiency / 100)} pickup success rate suggests UI/UX friction in item collection.`;
      } else if (summary.pickupEfficiency > 85) {
        return "Excellent pickup efficiency indicates intuitive item collection mechanics.";
      }
      return `${formatPercentage(summary.pickupEfficiency / 100)} pickup success rate shows room for UX improvement.`;
    
    default:
      return "AI analyzing gameplay patterns for actionable insights.";
  }
}

/**
 * Custom tooltip for charts
 */
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;
  
  return (
    <div className="bg-[#1f2937] border border-[#374151] rounded-lg p-3 shadow-xl">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 mb-1 last:mb-0">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[#94a3b8]">{entry.name}:</span>
          <span className="text-[#f8fafc] font-semibold">
            {typeof entry.value === 'number' ? formatDecimal(entry.value) : entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export function AnalyticsCharts({ summary }: AnalyticsChartsProps) {
  // Check if combat data is available
  const hasCombatData = summary.averageKills !== null && summary.averageDeaths !== null;
  const hasTimeData = summary.combatTimePercentage !== null;
  const hasPickupData = summary.pickupEfficiency !== null;
  
  // Prepare kills vs deaths comparison
  const killsDeathsData = hasCombatData ? [
    {
      name: 'Average',
      kills: summary.averageKills ?? 0,
      deaths: summary.averageDeaths ?? 0
    }
  ] : [];
  
  // Prepare engagement metrics
  const engagementData = hasTimeData ? [
    {
      name: 'Combat',
      value: summary.combatTimePercentage ?? 0,
      fill: '#ef4444'
    },
    {
      name: 'Exploration',
      value: 100 - (summary.combatTimePercentage ?? 0),
      fill: '#3b82f6'
    }
  ] : [];
  
  // Prepare pickup efficiency data
  const pickupData = hasPickupData ? [
    {
      name: 'Success',
      value: summary.pickupEfficiency ?? 0,
      fill: '#59c378'
    },
    {
      name: 'Failed',
      value: 100 - (summary.pickupEfficiency ?? 0),
      fill: '#ef4444'
    }
  ] : [];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Kills vs Deaths */}
      {hasCombatData && (
        <Card className="card-premium border-[#1f2937] bg-[#121826]">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-[#f8fafc]">
              Kills vs Deaths
            </CardTitle>
            <CardDescription className="text-[#94a3b8] text-sm">
              Average combat activity and survival metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* AI Insight */}
            <div className="ai-insight mb-4">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-[#59c378] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#f8fafc] leading-relaxed">
                  {generateChartInsight('kills-deaths', summary)}
                </p>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={killsDeathsData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.5} />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  label={{ value: 'Count', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #1f2937',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar dataKey="kills" fill="#59c378" name="Kills" radius={[8, 8, 0, 0]} barSize={100} />
                <Bar dataKey="deaths" fill="#ef4444" name="Deaths" radius={[8, 8, 0, 0]} barSize={100} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
      
      {/* Time Distribution */}
      {hasTimeData && (
        <Card className="card-premium border-[#1f2937] bg-[#121826]">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-[#f8fafc]">
              Time Distribution
            </CardTitle>
            <CardDescription className="text-[#94a3b8] text-sm">
              Combat vs exploration time allocation
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* AI Insight */}
            <div className="ai-insight mb-4">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-[#59c378] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#f8fafc] leading-relaxed">
                  {generateChartInsight('time-distribution', summary)}
                </p>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={engagementData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.5} />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                  tickFormatter={(value) => `${value.toFixed(0)}%`}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  formatter={(value: any) => `${formatDecimal(value, 1)}%`}
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #1f2937',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={120}>
                  {engagementData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
      
      {/* Pickup Efficiency */}
      {hasPickupData && (
        <Card className="card-premium border-[#1f2937] bg-[#121826] lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-[#f8fafc]">
              Pickup Efficiency
            </CardTitle>
            <CardDescription className="text-[#94a3b8] text-sm">
              Success rate of item pickup attempts ({formatPercentage((summary.pickupEfficiency ?? 0) / 100)})
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* AI Insight */}
            <div className="ai-insight mb-4">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-[#59c378] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#f8fafc] leading-relaxed">
                  {generateChartInsight('pickup-efficiency', summary)}
                </p>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={pickupData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.5} />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                  tickFormatter={(value) => `${value.toFixed(0)}%`}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  formatter={(value: any) => `${formatDecimal(value, 1)}%`}
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #1f2937',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={150}>
                  {pickupData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
      
      {/* No Data Message */}
      {!hasCombatData && !hasTimeData && !hasPickupData && (
        <Card className="card-premium border-[#1f2937] bg-[#121826] lg:col-span-2">
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-[#94a3b8] mx-auto mb-4" />
            <p className="text-[#f8fafc] text-lg font-semibold mb-2">
              No Telemetry Data Available
            </p>
            <p className="text-[#94a3b8] text-sm">
              Upload a dataset with combat, time, or pickup metrics to see visualizations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Made with Bob
