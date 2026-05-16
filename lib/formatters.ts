/**
 * Data Formatting Utilities
 * 
 * Utilities for formatting telemetry data for human-readable display.
 * Prevents NaN, Infinity, and ugly decimals in charts and metrics.
 */

/**
 * Format a decimal value as a percentage
 * @param value - Decimal value (0-1) or percentage (0-100)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  if (!isFinite(value) || isNaN(value)) return '0%';
  
  // If value is between 0 and 1, treat as decimal
  const percentage = value <= 1 ? value * 100 : value;
  
  // Clamp between 0 and 100
  const clamped = Math.max(0, Math.min(100, percentage));
  
  return `${clamped.toFixed(decimals)}%`;
}

/**
 * Format a decimal value with specified precision
 * @param value - Number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted decimal string
 */
export function formatDecimal(value: number, decimals: number = 2): string {
  if (!isFinite(value) || isNaN(value)) return '0';
  return value.toFixed(decimals);
}

/**
 * Format a ratio (e.g., K/D ratio)
 * @param numerator - Top value
 * @param denominator - Bottom value
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted ratio string
 */
export function formatRatio(numerator: number, denominator: number, decimals: number = 2): string {
  if (!isFinite(numerator) || isNaN(numerator)) return '0.00';
  if (!isFinite(denominator) || isNaN(denominator) || denominator === 0) {
    // If no deaths, show kills as "Perfect" or just the number
    return numerator > 0 ? 'Perfect' : '0.00';
  }
  
  const ratio = numerator / denominator;
  
  // Cap unrealistic ratios
  if (ratio > 100) return '100+';
  
  return ratio.toFixed(decimals);
}

/**
 * Format large numbers with K/M/B suffixes
 * @param value - Number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted number string
 */
export function formatLargeNumber(value: number, decimals: number = 1): string {
  if (!isFinite(value) || isNaN(value)) return '0';
  
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  
  if (absValue >= 1_000_000_000) {
    return `${sign}${(absValue / 1_000_000_000).toFixed(decimals)}B`;
  }
  if (absValue >= 1_000_000) {
    return `${sign}${(absValue / 1_000_000).toFixed(decimals)}M`;
  }
  if (absValue >= 1_000) {
    return `${sign}${(absValue / 1_000).toFixed(decimals)}K`;
  }
  
  return `${sign}${absValue.toFixed(decimals)}`;
}

/**
 * Format time duration in seconds to human-readable format
 * @param seconds - Duration in seconds
 * @returns Formatted time string
 */
export function formatTime(seconds: number): string {
  if (!isFinite(seconds) || isNaN(seconds) || seconds < 0) return '0s';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

/**
 * Clamp a metric value to a reasonable range
 * @param value - Value to clamp
 * @param min - Minimum value (default: 0)
 * @param max - Maximum value (default: 1000)
 * @returns Clamped value
 */
export function clampMetric(value: number, min: number = 0, max: number = 1000): number {
  if (!isFinite(value) || isNaN(value)) return min;
  return Math.max(min, Math.min(max, value));
}

/**
 * Normalize tiny decimal values to percentage scale (0-100)
 * Useful for chart data that's in 0-1 range
 * @param value - Value to normalize
 * @returns Normalized value (0-100)
 */
export function normalizeToPercentage(value: number): number {
  if (!isFinite(value) || isNaN(value)) return 0;
  
  // If value is already in 0-100 range, return as-is
  if (value > 1) return value;
  
  // Convert 0-1 to 0-100
  return value * 100;
}

/**
 * Normalize array of values to 0-100 scale for better chart visualization
 * @param values - Array of values to normalize
 * @returns Normalized array
 */
export function normalizeArray(values: number[]): number[] {
  if (values.length === 0) return [];
  
  const validValues = values.filter(v => isFinite(v) && !isNaN(v));
  if (validValues.length === 0) return values.map(() => 0);
  
  const min = Math.min(...validValues);
  const max = Math.max(...validValues);
  
  // If all values are the same, return them as-is
  if (max === min) return values.map(() => 50);
  
  // If values are tiny decimals (all < 1), scale to 0-100
  if (max < 1 && min >= 0) {
    return values.map(v => (isFinite(v) && !isNaN(v)) ? v * 100 : 0);
  }
  
  // Otherwise, normalize to 0-100 range
  return values.map(v => {
    if (!isFinite(v) || isNaN(v)) return 0;
    return ((v - min) / (max - min)) * 100;
  });
}

/**
 * Format a metric value intelligently based on its magnitude
 * @param value - Value to format
 * @param type - Type of metric ('number', 'percentage', 'time', 'ratio')
 * @returns Formatted string
 */
export function formatMetric(value: number, type: 'number' | 'percentage' | 'time' | 'ratio' = 'number'): string {
  if (!isFinite(value) || isNaN(value)) return '0';
  
  switch (type) {
    case 'percentage':
      return formatPercentage(value);
    case 'time':
      return formatTime(value);
    case 'ratio':
      return formatDecimal(value, 2);
    case 'number':
    default:
      if (Math.abs(value) >= 1000) {
        return formatLargeNumber(value);
      }
      return formatDecimal(value, value < 10 ? 2 : 1);
  }
}

/**
 * Safe division that handles edge cases
 * @param numerator - Top value
 * @param denominator - Bottom value
 * @param fallback - Fallback value if division fails (default: 0)
 * @returns Result of division or fallback
 */
export function safeDivide(numerator: number, denominator: number, fallback: number = 0): number {
  if (!isFinite(numerator) || isNaN(numerator)) return fallback;
  if (!isFinite(denominator) || isNaN(denominator) || denominator === 0) return fallback;
  
  const result = numerator / denominator;
  return isFinite(result) ? result : fallback;
}

/**
 * Format chart axis value based on data range
 * @param value - Axis value
 * @param dataRange - Range of data [min, max]
 * @returns Formatted axis label
 */
export function formatAxisValue(value: number, dataRange: [number, number]): string {
  if (!isFinite(value) || isNaN(value)) return '0';
  
  const [min, max] = dataRange;
  const range = max - min;
  
  // For tiny decimals, show as percentage
  if (max < 1 && min >= 0) {
    return formatPercentage(value, 0);
  }
  
  // For large numbers, use K/M notation
  if (range > 10000) {
    return formatLargeNumber(value, 0);
  }
  
  // For medium numbers, show with appropriate decimals
  if (range < 10) {
    return formatDecimal(value, 1);
  }
  
  return Math.round(value).toString();
}

/**
 * Create histogram buckets with smart labeling
 * @param min - Minimum value
 * @param max - Maximum value
 * @param buckets - Number of buckets
 * @returns Array of bucket labels
 */
export function createHistogramLabels(min: number, max: number, buckets: number): string[] {
  if (!isFinite(min) || !isFinite(max) || buckets <= 0) {
    return Array(buckets).fill('0-0');
  }
  
  const range = max - min;
  const bucketSize = range / buckets;
  
  // Determine if we should show decimals
  const showDecimals = range < 10 || (max < 1 && min >= 0);
  const decimals = showDecimals ? 1 : 0;
  
  return Array.from({ length: buckets }, (_, i) => {
    const start = min + i * bucketSize;
    const end = min + (i + 1) * bucketSize;
    
    if (max < 1 && min >= 0) {
      // For tiny decimals, show as percentage
      return `${(start * 100).toFixed(0)}-${(end * 100).toFixed(0)}%`;
    }
    
    return `${start.toFixed(decimals)}-${end.toFixed(decimals)}`;
  });
}

// Made with Bob
