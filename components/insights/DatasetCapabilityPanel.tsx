/**
 * Dataset Capability Panel
 * 
 * Displays available telemetry categories, dataset quality,
 * and recommendations for improving data collection.
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TelemetryCapabilities, 
  DatasetCapabilitySummary 
} from '@/types/telemetry-capabilities';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Info,
  TrendingUp,
  Database
} from 'lucide-react';

interface DatasetCapabilityPanelProps {
  capabilities: TelemetryCapabilities;
  summary: DatasetCapabilitySummary;
}

export function DatasetCapabilityPanel({ 
  capabilities, 
  summary 
}: DatasetCapabilityPanelProps) {
  
  // Quality badge styling
  const getQualityBadge = () => {
    const qualityConfig = {
      excellent: { variant: 'default' as const, icon: CheckCircle2, color: 'text-green-600' },
      good: { variant: 'secondary' as const, icon: TrendingUp, color: 'text-blue-600' },
      partial: { variant: 'outline' as const, icon: AlertTriangle, color: 'text-yellow-600' },
      minimal: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' }
    };
    
    const config = qualityConfig[summary.quality];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {summary.quality.charAt(0).toUpperCase() + summary.quality.slice(1)} Quality
      </Badge>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Dataset Capabilities</CardTitle>
          </div>
          {getQualityBadge()}
        </div>
        <CardDescription>
          Detected telemetry systems and analytics coverage
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Available Telemetry */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Available Telemetry ({summary.available.length}/8)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {summary.available.map((category) => {
              const status = capabilities[category as keyof TelemetryCapabilities];
              return (
                <div 
                  key={category}
                  className="p-2 rounded-md bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800"
                >
                  <div className="text-xs font-medium text-green-900 dark:text-green-100 capitalize">
                    {category}
                  </div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {status.detectedFields.length} fields
                  </div>
                </div>
              );
            })}
          </div>
          {summary.available.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              No telemetry categories detected
            </p>
          )}
        </div>

        {/* Unavailable Telemetry */}
        {summary.unavailable.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              Unavailable Telemetry ({summary.unavailable.length}/8)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {summary.unavailable.map((category) => (
                <div 
                  key={category}
                  className="p-2 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
                >
                  <div className="text-xs font-medium text-gray-500 dark:text-gray-400 capitalize">
                    {category}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                    Not detected
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Supported Analytics */}
        <div>
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            Supported Analytics
          </h3>
          <div className="flex flex-wrap gap-2">
            {summary.supportedAnalytics.map((analytic) => (
              <Badge key={analytic} variant="secondary" className="text-xs">
                {analytic}
              </Badge>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {summary.recommendations.length > 0 && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="font-semibold mb-2">Recommendations</div>
              <ul className="space-y-1 text-sm">
                {summary.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Dataset Stats */}
        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Detected Fields</div>
              <div className="font-semibold text-lg">{summary.detectedFieldCount}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Coverage</div>
              <div className="font-semibold text-lg">
                {Math.round((summary.available.length / 8) * 100)}%
              </div>
            </div>
          </div>
        </div>

        {/* Confidence Notice */}
        {summary.quality === 'minimal' && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Low Data Quality:</strong> Limited telemetry detected. 
              AI insights may be incomplete or unavailable for some analytics categories.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

// Made with Bob