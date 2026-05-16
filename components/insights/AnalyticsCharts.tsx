/**
 * Analytics Charts Component
 * 
 * Premium AI-powered charts with intelligent data normalization and insights.
 */

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { AnalyticsSummary } from '@/lib/analytics';
import { formatPercentage, formatDecimal, formatRatio, formatLargeNumber } from '@/lib/formatters';
import { Sparkles } from 'lucide-react';

interface AnalyticsChartsProps {
  summary: AnalyticsSummary;
}

/**
 * Generate AI insight for a chart based on data patterns
 */
function generateChartInsight(type: string, summary: AnalyticsSummary): string {
  switch (type) {
    case 'combat-score':
      const avgKD = summary.killDeathRatio;
      if (avgKD > 2) {
        return "Players with higher kill counts consistently achieve better scores, indicating strong combat-reward correlation.";
      } else if (avgKD < 0.5) {
        return "Low K/D ratio suggests combat difficulty may be impacting player progression and retention.";
      }
      return "Combat performance shows moderate correlation with session scores across player base.";
    
    case 'kills-deaths':
      if (summary.averageDeaths > summary.averageKills * 2) {
        return "High death rate detected. Consider adjusting difficulty or improving player onboarding.";
      } else if (summary.averageKills > summary.averageDeaths * 2) {
        return "Players are dominating combat encounters. Consider increasing challenge for engaged players.";
      }
      return `Balanced combat with ${formatRatio(summary.averageKills, summary.averageDeaths)} K/D ratio across sessions.`;
    
    case 'score-distribution':
      const lowScoreRate = (summary.lowScoreSessions / summary.totalSessions) * 100;
      if (lowScoreRate > 30) {
        return `${formatPercentage(lowScoreRate / 100)} of sessions end with low scores, indicating potential early-game friction.`;
      }
      return "Score distribution shows healthy player progression across difficulty curve.";
    
    case 'time-distribution':
      if (summary.combatTimePercentage > 70) {
        return "Players spend majority of time in combat. Consider adding exploration incentives for variety.";
      } else if (summary.combatTimePercentage < 30) {
        return "Low combat engagement detected. Players may be avoiding encounters or struggling to find action.";
      }
      return `Balanced gameplay with ${formatPercentage(summary.combatTimePercentage / 100)} time in combat encounters.`;
    
    case 'pickup-efficiency':
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
 * Custom tooltip with premium styling
 */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-[#121826] border border-[#1f2937] rounded-lg p-3 shadow-xl">
      {label && (
        <p className="text-sm font-semibold text-[#f8fafc] mb-2">{label}</p>
      )}
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div 
            className="w-3 h-3 rounded-full" 
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
  // Prepare combat vs score scatter data with better normalization
  const combatScoreData = summary.scoreDistribution
    .map((score, index) => ({
      score: score,
      kills: summary.killsDistribution[index] || 0,
      deaths: summary.deathsDistribution[index] || 0,
      combatTime: summary.combatTimeDistribution[index] || 0
    }))
    .filter(d => d.score > 0 || d.kills > 0) // Filter out zero-value sessions
    .slice(0, 150); // Show meaningful sample
  
  // Prepare kills vs deaths comparison
  const killsDeathsData = [
    {
      name: 'Average',
      kills: summary.averageKills,
      deaths: summary.averageDeaths
    }
  ];
  
  // Prepare score histogram with smart bucketing
  const scoreHistogram = createSmartHistogram(summary.scoreDistribution, 10);
  
  // Prepare engagement metrics
  const engagementData = [
    {
      name: 'Combat',
      value: summary.combatTimePercentage,
      fill: '#ef4444'
    },
    {
      name: 'Exploration',
      value: 100 - summary.combatTimePercentage,
      fill: '#3b82f6'
    }
  ];
  
  // Prepare pickup efficiency data
  const pickupData = [
    {
      name: 'Success',
      value: summary.pickupEfficiency,
      fill: '#59c378'
    },
    {
      name: 'Failed',
      value: 100 - summary.pickupEfficiency,
      fill: '#ef4444'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Combat vs Score Scatter */}
      <Card className="card-premium border-[#1f2937] bg-[#121826]">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-[#f8fafc]">
            Combat Performance vs Score
          </CardTitle>
          <CardDescription className="text-[#94a3b8] text-sm">
            Relationship between kills and session scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* AI Insight */}
          <div className="ai-insight mb-4">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-[#59c378] mt-0.5 flex-shrink-0" />
              <p className="text-sm text-[#f8fafc] leading-relaxed">
                {generateChartInsight('combat-score', summary)}
              </p>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.5} />
              <XAxis
                type="number"
                dataKey="kills"
                name="Kills"
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                label={{ value: 'Kills', position: 'insideBottom', offset: -10, fill: '#94a3b8' }}
              />
              <YAxis
                type="number"
                dataKey="score"
                name="Score"
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                label={{ value: 'Score', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                tickFormatter={(value) => formatLargeNumber(value, 0)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter
                name="Sessions"
                data={combatScoreData}
                fill="#59c378"
                fillOpacity={0.6}
                shape="circle"
                r={5}
              />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Kills vs Deaths */}
      <Card className="card-premium border-[#1f2937] bg-[#121826]">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-[#f8fafc]">
            Kills vs Deaths
          </CardTitle>
          <CardDescription className="text-[#94a3b8] text-sm">
            Average combat performance (K/D: {formatRatio(summary.averageKills, summary.averageDeaths)})
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
          
          <ResponsiveContainer width="100%" height={320}>
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
                tickFormatter={(value) => formatDecimal(value, 1)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <Bar dataKey="kills" fill="#59c378" name="Kills" radius={[8, 8, 0, 0]} barSize={100} />
              <Bar dataKey="deaths" fill="#ef4444" name="Deaths" radius={[8, 8, 0, 0]} barSize={100} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Score Distribution */}
      <Card className="card-premium border-[#1f2937] bg-[#121826]">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-[#f8fafc]">
            Score Distribution
          </CardTitle>
          <CardDescription className="text-[#94a3b8] text-sm">
            Distribution of session scores across player base
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* AI Insight */}
          <div className="ai-insight mb-4">
            <div className="flex items-start gap-2">
              <Sparkles className="h-4 w-4 text-[#59c378] mt-0.5 flex-shrink-0" />
              <p className="text-sm text-[#f8fafc] leading-relaxed">
                {generateChartInsight('score-distribution', summary)}
              </p>
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={scoreHistogram} margin={{ top: 10, right: 20, left: 10, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.5} />
              <XAxis
                dataKey="range"
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                label={{ value: 'Sessions', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#59c378" radius={[8, 8, 0, 0]} barSize={50}>
                {scoreHistogram.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`rgba(89, 195, 120, ${0.4 + (index / scoreHistogram.length) * 0.6})`}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Time Distribution */}
      <Card className="card-premium border-[#1f2937] bg-[#121826]">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-[#f8fafc]">
            Time Distribution
          </CardTitle>
          <CardDescription className="text-[#94a3b8] text-sm">
            How players spend their time in-game
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
          
          <ResponsiveContainer width="100%" height={320}>
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
      
      {/* Pickup Efficiency */}
      <Card className="card-premium border-[#1f2937] bg-[#121826] lg:col-span-2">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-[#f8fafc]">
            Pickup Efficiency
          </CardTitle>
          <CardDescription className="text-[#94a3b8] text-sm">
            Success rate of item pickup attempts ({formatPercentage(summary.pickupEfficiency / 100)})
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
            <BarChart
              data={pickupData}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 100, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" opacity={0.5} />
              <XAxis
                type="number"
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                domain={[0, 100]}
                label={{ value: 'Percentage (%)', position: 'insideBottom', offset: -5, fill: '#94a3b8' }}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                width={90}
              />
              <Tooltip 
                content={<CustomTooltip />}
                formatter={(value: any) => `${formatDecimal(value, 1)}%`}
              />
              <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={50}>
                {pickupData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Create smart histogram with better bucketing and labels
 */
function createSmartHistogram(data: number[], bins: number = 10) {
  if (data.length === 0) return [];
  
  const validData = data.filter(v => isFinite(v) && !isNaN(v) && v > 0);
  if (validData.length === 0) return [];
  
  const min = Math.min(...validData);
  const max = Math.max(...validData);
  
  // If all values are the same, create a single bucket
  if (max === min) {
    return [{
      range: formatDecimal(min, 0),
      count: validData.length,
      min,
      max
    }];
  }
  
  const binSize = (max - min) / bins;
  
  const histogram = Array.from({ length: bins }, (_, i) => {
    const rangeMin = min + i * binSize;
    const rangeMax = min + (i + 1) * binSize;
    return {
      range: `${formatLargeNumber(rangeMin, 0)}-${formatLargeNumber(rangeMax, 0)}`,
      count: 0,
      min: rangeMin,
      max: rangeMax
    };
  });
  
  validData.forEach(value => {
    const binIndex = Math.min(Math.floor((value - min) / binSize), bins - 1);
    if (binIndex >= 0 && binIndex < bins) {
      histogram[binIndex].count++;
    }
  });
  
  // Filter out empty buckets for cleaner visualization
  return histogram.filter(h => h.count > 0);
}

// Made with Bob
