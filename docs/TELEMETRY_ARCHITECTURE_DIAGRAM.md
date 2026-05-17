# Telemetry Capability Detection Architecture

## System Flow Diagram

```mermaid
graph TD
    A[CSV Upload] --> B[DatasetAnalyzer]
    B --> C{Detect Telemetry Categories}
    
    C --> D[Combat Detection]
    C --> E[Pickup Detection]
    C --> F[Movement Detection]
    C --> G[Session Detection]
    C --> H[Monetization Detection]
    C --> I[Achievement Detection]
    C --> J[Progression Detection]
    C --> K[LiveOps Detection]
    
    D --> L[TelemetryCapabilities Object]
    E --> L
    F --> L
    G --> L
    H --> L
    I --> L
    J --> L
    K --> L
    
    L --> M[Analytics Engine]
    M --> N{Validate Telemetry}
    
    N -->|Available| O[Compute Metrics]
    N -->|Unavailable| P[Return null]
    
    O --> Q[AnalyticsSummary with Capabilities]
    P --> Q
    
    Q --> R[AI Orchestrator]
    R --> S{Filter Builders}
    
    S -->|Has Combat| T[Retention Builder]
    S -->|Has Monetization| U[Monetization Builder]
    S -->|Has Session| V[LiveOps Builder]
    S -->|Has Combat/Pickup| W[Friction Builder]
    S -->|Has Session| X[Segmentation Builder]
    
    T --> Y[Heuristic Matcher]
    U --> Y
    V --> Y
    W --> Y
    X --> Y
    
    Y --> Z{Filter by Telemetry}
    Z -->|Applicable| AA[Generate Prompts]
    Z -->|Not Applicable| AB[Skip Heuristic]
    
    AA --> AC[Prompt Composer]
    AC --> AD[Add Capability Context]
    AD --> AE[Final Prompts]
    
    AE --> AF[AI Insight Generation]
    AF --> AG[Executive Summary]
    
    Q --> AH[UI Dashboard]
    AH --> AI[DatasetCapabilityPanel]
    AI --> AJ[Show Available/Unavailable]
    
    AG --> AK[InsightsDashboard]
    AK --> AL[Display Verified Insights Only]
```

## Data Flow Architecture

```mermaid
sequenceDiagram
    participant User
    participant Upload
    participant Analyzer
    participant Analytics
    participant Orchestrator
    participant Builders
    participant UI
    
    User->>Upload: Upload CSV
    Upload->>Analyzer: Parse & Analyze
    Analyzer->>Analyzer: Detect Telemetry Categories
    Analyzer->>Analytics: Return TelemetryCapabilities
    
    Analytics->>Analytics: Validate Each Metric
    alt Telemetry Available
        Analytics->>Analytics: Compute Metric
    else Telemetry Unavailable
        Analytics->>Analytics: Return null
    end
    
    Analytics->>Orchestrator: AnalyticsSummary + Capabilities
    Orchestrator->>Orchestrator: Filter Applicable Builders
    
    loop For Each Builder
        Orchestrator->>Builders: Generate Prompt
        Builders->>Builders: Validate Telemetry Requirements
        alt Requirements Met
            Builders->>Builders: Build Full Prompt
        else Requirements Not Met
            Builders->>Builders: Build Limited Prompt
        end
        Builders->>Orchestrator: Return Prompt
    end
    
    Orchestrator->>UI: Prompts + Capability Summary
    UI->>User: Display Insights + Capability Panel
```

## Telemetry Detection Logic

```mermaid
graph LR
    A[Dataset Headers] --> B{Check Combat Fields}
    B -->|kills OR deaths OR damageDone| C[Combat: Available]
    B -->|None found| D[Combat: Unavailable]
    
    A --> E{Check Pickup Fields}
    E -->|itemsCollected OR pickupAttempts| F[Pickup: Available]
    E -->|None found| G[Pickup: Unavailable]
    
    A --> H{Check Movement Fields}
    H -->|distanceTraveled| I[Movement: Available]
    H -->|None found| J[Movement: Unavailable]
    
    A --> K{Check Session Fields}
    K -->|sessionId OR timestamp| L[Session: Available]
    K -->|None found| M[Session: Unavailable]
    
    C --> N[Confidence: High if 2+ fields]
    F --> O[Confidence: High if both fields]
    I --> P[Confidence: Medium if only distance]
    L --> Q[Confidence: High if both fields]
```

## Capability-Aware Metric Computation

```mermaid
flowchart TD
    A[Metric Request] --> B{Check Capability}
    B -->|Available| C[Validate Data Quality]
    B -->|Unavailable| D[Return null]
    
    C --> E{Sufficient Data?}
    E -->|Yes| F[Compute Metric]
    E -->|No| G[Return null with Warning]
    
    F --> H[Return Computed Value]
    
    D --> I[Mark as Unavailable in Summary]
    G --> I
    H --> J[Mark as Available in Summary]
```

## Builder Filtering Logic

```mermaid
graph TD
    A[Orchestrator] --> B{Check Retention Builder}
    B -->|Session Available| C[Enable Retention]
    B -->|Session Unavailable| D[Disable Retention]
    
    A --> E{Check Monetization Builder}
    E -->|Monetization Available| F[Enable Monetization]
    E -->|Monetization Unavailable| G[Disable Monetization]
    
    A --> H{Check Friction Builder}
    H -->|Combat OR Pickup Available| I[Enable Friction]
    H -->|Both Unavailable| J[Disable Friction]
    
    A --> K{Check LiveOps Builder}
    K -->|LiveOps OR Session Available| L[Enable LiveOps]
    K -->|Both Unavailable| M[Disable LiveOps]
    
    C --> N[Generate Prompts]
    F --> N
    I --> N
    L --> N
```

## UI Component Hierarchy

```mermaid
graph TD
    A[InsightsDashboard] --> B[DatasetCapabilityPanel]
    A --> C[ExecutiveSummary]
    A --> D[AnalyticsCharts]
    A --> E[InsightCards]
    
    B --> F[Available Telemetry Badges]
    B --> G[Unavailable Telemetry Badges]
    B --> H[Data Quality Alert]
    B --> I[Recommendations]
    
    C --> J{Filter by Capabilities}
    J -->|Combat Available| K[Combat Insights]
    J -->|Pickup Available| L[Pickup Insights]
    J -->|Combat Unavailable| M[Skip Combat Insights]
    
    D --> N{Render Charts}
    N -->|Data Available| O[Show Chart]
    N -->|Data Unavailable| P[Show Unavailable Message]
```

## Confidence Scoring System

```mermaid
graph LR
    A[Detected Fields] --> B{Count Required Fields}
    B -->|All Required| C[High Confidence]
    B -->|Some Required| D[Medium Confidence]
    B -->|Minimal Required| E[Low Confidence]
    
    C --> F[100% Reliable Insights]
    D --> G[Partial Insights with Caveats]
    E --> H[Limited Insights Only]
```

## Error Handling Flow

```mermaid
flowchart TD
    A[Metric Computation] --> B{Telemetry Available?}
    B -->|No| C[Return null]
    B -->|Yes| D{Data Valid?}
    
    D -->|No| E[Log Warning]
    D -->|Yes| F[Compute]
    
    C --> G[UI: Show Unavailable]
    E --> H[UI: Show Warning]
    F --> I[UI: Show Result]
    
    G --> J[Executive Summary: Skip]
    H --> K[Executive Summary: Add Caveat]
    I --> L[Executive Summary: Include]
```

## Type System Architecture

```typescript
// Core Types Hierarchy
interface TelemetryCapabilities {
  combat: TelemetryCategoryStatus
  pickup: TelemetryCategoryStatus
  movement: TelemetryCategoryStatus
  session: TelemetryCategoryStatus
  monetization: TelemetryCategoryStatus
  achievement: TelemetryCategoryStatus
  progression: TelemetryCategoryStatus
  liveops: TelemetryCategoryStatus
}

interface TelemetryCategoryStatus {
  available: boolean
  confidence: 'high' | 'medium' | 'low'
  detectedFields: string[]
  missingFields: string[]
  requiredFields: string[]
}

interface AnalyticsSummary {
  // Existing metrics (now nullable)
  killDeathRatio: number | null
  pickupEfficiency: number | null
  // ... etc
  
  // New capability metadata
  capabilities: TelemetryCapabilities
  datasetQuality: 'excellent' | 'good' | 'partial' | 'minimal'
  metricsAvailable: Record<string, boolean>
}
```

## Integration Points

### 1. CSV Upload → Capability Detection
```typescript
// app/upload/page.tsx
const handleFileUpload = async (file: File) => {
  const data = await parseCSV(file);
  const analyzer = new DatasetAnalyzer();
  const capabilities = analyzer.analyzeDataset(data);
  const summary = generateAnalyticsSummary(data, capabilities);
  // ... continue with insights generation
};
```

### 2. Analytics Engine → Conditional Computation
```typescript
// lib/analytics.ts
export function generateAnalyticsSummary(
  data: TelemetryRow[],
  capabilities: TelemetryCapabilities
): AnalyticsSummary {
  return {
    capabilities,
    killDeathRatio: capabilities.combat.available 
      ? computeKillDeathRatio(data) 
      : null,
    // ... other metrics
  };
}
```

### 3. Orchestrator → Builder Filtering
```typescript
// lib/ai/orchestrator.ts
private filterBuildersByCapabilities(
  builders: string[],
  capabilities: TelemetryCapabilities
): string[] {
  return builders.filter(builder => 
    this.hasRequiredTelemetry(builder, capabilities)
  );
}
```

### 4. UI → Capability Display
```tsx
// components/insights/DatasetCapabilityPanel.tsx
export function DatasetCapabilityPanel({ capabilities }) {
  const available = getAvailableCategories(capabilities);
  const unavailable = getUnavailableCategories(capabilities);
  
  return (
    <Card>
      <AvailableBadges categories={available} />
      <UnavailableBadges categories={unavailable} />
      <QualityAlert quality={getDatasetQuality(capabilities)} />
    </Card>
  );
}
```

## Key Design Decisions

### 1. Null vs Zero
- **Decision**: Use `null` for unavailable metrics, not `0`
- **Rationale**: Distinguishes "no data" from "zero value"
- **Impact**: Requires null checks throughout codebase

### 2. Confidence Levels
- **High**: All required fields present
- **Medium**: Some required fields present
- **Low**: Minimal fields present
- **Impact**: Affects insight generation and UI messaging

### 3. Builder Filtering
- **Decision**: Disable builders without required telemetry
- **Rationale**: Prevents generating invalid insights
- **Impact**: Fewer prompts generated, but higher quality

### 4. UI Transparency
- **Decision**: Always show capability panel
- **Rationale**: Users need to understand data limitations
- **Impact**: More UI space, but better user trust

## Performance Considerations

1. **Capability Detection**: O(n) scan of dataset headers (fast)
2. **Metric Computation**: Only compute available metrics (faster)
3. **Builder Filtering**: Early filtering reduces prompt generation (faster)
4. **UI Rendering**: Conditional rendering based on capabilities (efficient)

## Testing Strategy

### Unit Tests
- Capability detection for each telemetry category
- Metric computation with/without telemetry
- Builder filtering logic
- UI component rendering with various capabilities

### Integration Tests
- End-to-end flow from upload to insights
- Multiple dataset types (full, partial, minimal)
- Edge cases (empty, single-column, malformed)

### Test Coverage Goals
- Capability detection: 100%
- Metric computation: 95%
- Builder filtering: 100%
- UI components: 90%