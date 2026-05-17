/**
 * Dataset Analyzer - Telemetry Capability Detection
 * 
 * Lightweight analyzer that inspects CSV headers to determine
 * which telemetry categories are available in the dataset.
 */

import { TelemetryRow } from '@/types/analytics';
import {
  TelemetryCapabilities,
  TelemetryCategoryStatus,
  DatasetCapabilitySummary,
  TelemetryCategory
} from '@/types/telemetry-capabilities';

// Field mappings for each telemetry category
const FIELD_MAPPINGS = {
  combat: {
    required: ['kills', 'deaths'],
    optional: ['damageDone', 'enemiesHit', 'timeInCombat'],
    alternatives: {
      kills: ['player_kills', 'total_kills', 'kill_count'],
      deaths: ['player_deaths', 'total_deaths', 'death_count'],
      damageDone: ['damage_done', 'damage_dealt', 'total_damage'],
      enemiesHit: ['enemies_hit', 'hit_count']
    }
  },
  pickup: {
    required: ['itemsCollected', 'pickupAttempts'],
    optional: ['timeNearInteractables'],
    alternatives: {
      itemsCollected: ['items_collected', 'collected_items', 'pickup_count'],
      pickupAttempts: ['pickup_attempts', 'interaction_attempts']
    }
  },
  movement: {
    required: ['distanceTraveled'],
    optional: ['timeOutOfCombat', 'velocity'],
    alternatives: {
      distanceTraveled: ['distance_traveled', 'total_distance', 'movement_distance']
    }
  },
  session: {
    required: ['sessionId'],
    optional: ['timestamp', 'score'],
    alternatives: {
      sessionId: ['session_id', 'id', 'game_session_id'],
      timestamp: ['time', 'datetime', 'created_at']
    }
  },
  monetization: {
    required: ['revenue', 'purchases'],
    optional: ['currency', 'transactionId'],
    alternatives: {
      revenue: ['total_revenue', 'purchase_amount', 'spend'],
      purchases: ['purchase_count', 'transaction_count']
    }
  },
  achievement: {
    required: ['achievementId'],
    optional: ['achievementName', 'unlockTime'],
    alternatives: {
      achievementId: ['achievement_id', 'achievement', 'trophy_id']
    }
  },
  progression: {
    required: ['level'],
    optional: ['xp', 'experience', 'rank'],
    alternatives: {
      level: ['player_level', 'current_level', 'lvl'],
      xp: ['experience', 'experience_points', 'exp']
    }
  },
  liveops: {
    required: ['eventId'],
    optional: ['eventName', 'eventType'],
    alternatives: {
      eventId: ['event_id', 'challenge_id', 'activity_id']
    }
  }
};

export class DatasetAnalyzer {
  private headers: string[] = [];
  
  /**
   * Analyze dataset to detect available telemetry capabilities
   */
  analyzeDataset(data: TelemetryRow[]): TelemetryCapabilities {
    if (!data || data.length === 0) {
      return this.createEmptyCapabilities();
    }
    
    // Extract headers from first row
    this.headers = Object.keys(data[0]).map(h => h.toLowerCase().trim());
    
    return {
      combat: this.analyzeCategory('combat'),
      monetization: this.analyzeCategory('monetization'),
      session: this.analyzeCategory('session'),
      achievement: this.analyzeCategory('achievement'),
      progression: this.analyzeCategory('progression'),
      liveops: this.analyzeCategory('liveops'),
      movement: this.analyzeCategory('movement'),
      pickup: this.analyzeCategory('pickup')
    };
  }
  
  /**
   * Analyze specific telemetry category
   */
  private analyzeCategory(category: keyof typeof FIELD_MAPPINGS): TelemetryCategoryStatus {
    const mapping = FIELD_MAPPINGS[category];
    const detectedFields: string[] = [];
    const missingFields: string[] = [];
    
    // Check required fields
    for (const field of mapping.required) {
      const alternatives = (mapping.alternatives as any)[field] || [];
      if (this.hasField(field, alternatives)) {
        detectedFields.push(field);
      } else {
        missingFields.push(field);
      }
    }
    
    // Check optional fields
    for (const field of mapping.optional) {
      const alternatives = (mapping.alternatives as any)[field] || [];
      if (this.hasField(field, alternatives)) {
        detectedFields.push(field);
      }
    }
    
    // Available if at least one required field is found
    const available = detectedFields.some(f => mapping.required.includes(f));
    
    return {
      available,
      detectedFields,
      missingFields
    };
  }
  
  /**
   * Check if field exists in headers (including alternatives)
   */
  private hasField(fieldName: string, alternatives: string[]): boolean {
    const normalized = fieldName.toLowerCase();
    
    // Check exact match
    if (this.headers.includes(normalized)) {
      return true;
    }
    
    // Check alternatives
    for (const alt of alternatives) {
      if (this.headers.includes(alt.toLowerCase())) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Generate capability summary
   */
  generateSummary(capabilities: TelemetryCapabilities): DatasetCapabilitySummary {
    const available: string[] = [];
    const unavailable: string[] = [];
    let detectedFieldCount = 0;
    
    for (const [category, status] of Object.entries(capabilities)) {
      if (status.available) {
        available.push(category);
        detectedFieldCount += status.detectedFields.length;
      } else {
        unavailable.push(category);
      }
    }
    
    // Determine quality
    let quality: 'excellent' | 'good' | 'partial' | 'minimal';
    if (available.length >= 6) quality = 'excellent';
    else if (available.length >= 4) quality = 'good';
    else if (available.length >= 2) quality = 'partial';
    else quality = 'minimal';
    
    // Generate supported/unsupported analytics
    const supportedAnalytics = available.map(cat => `${cat} analytics`);
    const unsupportedAnalytics = unavailable.map(cat => `${cat} analytics`);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(capabilities);
    
    return {
      available,
      unavailable,
      quality,
      supportedAnalytics,
      unsupportedAnalytics,
      recommendations,
      detectedFieldCount
    };
  }
  
  /**
   * Generate recommendations for improving dataset
   */
  private generateRecommendations(capabilities: TelemetryCapabilities): string[] {
    const recommendations: string[] = [];
    
    if (!capabilities.session.available) {
      recommendations.push('Add session tracking (sessionId, timestamp) for better analytics');
    }
    
    if (!capabilities.combat.available) {
      recommendations.push('Include combat metrics (kills, deaths, damage) for engagement analysis');
    }
    
    if (!capabilities.monetization.available) {
      recommendations.push('Track monetization data (purchases, revenue) for business insights');
    }
    
    // Check for low-quality telemetry based on missing fields
    if (capabilities.combat.available && capabilities.combat.missingFields.length > 2) {
      recommendations.push('Improve combat telemetry by adding damage and time-in-combat metrics');
    }
    
    if (capabilities.pickup.available && capabilities.pickup.missingFields.length > 1) {
      recommendations.push('Add more pickup telemetry fields for better collection analysis');
    }
    
    return recommendations;
  }
  
  /**
   * Create empty capabilities (no data)
   */
  private createEmptyCapabilities(): TelemetryCapabilities {
    const emptyStatus: TelemetryCategoryStatus = {
      available: false,
      detectedFields: [],
      missingFields: []
    };
    
    return {
      combat: emptyStatus,
      monetization: emptyStatus,
      session: emptyStatus,
      achievement: emptyStatus,
      progression: emptyStatus,
      liveops: emptyStatus,
      movement: emptyStatus,
      pickup: emptyStatus
    };
  }
}

// Made with Bob