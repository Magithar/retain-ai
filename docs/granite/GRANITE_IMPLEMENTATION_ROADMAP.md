# IBM Granite Implementation Roadmap

## Overview

This document outlines the step-by-step implementation plan for integrating IBM Granite language models into RetainAI. The roadmap is divided into phases, each with specific deliverables and success criteria.

## Current Status

- ✅ **Phase 0:** Research and Planning (Complete)
- 🔄 **Phase 1:** Provider Abstraction Layer (Ready to Start)
- ⏳ **Phase 2:** Granite Integration (Pending)
- ⏳ **Phase 3:** Testing and Optimization (Pending)
- ⏳ **Phase 4:** Production Deployment (Pending)

---

## Phase 0: Research and Planning ✅

**Status:** Complete  
**Duration:** Completed  
**Owner:** Planning Team

### Deliverables

- [x] Research IBM Granite API options
- [x] Evaluate integration approaches (watsonx, HuggingFace, Ollama)
- [x] Create comprehensive documentation
- [x] Define architecture and interfaces
- [x] Identify API key requirements

### Documentation Created

- [`docs/IBM_GRANITE_INTEGRATION.md`](IBM_GRANITE_INTEGRATION.md) - Complete integration guide
- [`docs/AI_PROVIDER_GUIDE.md`](AI_PROVIDER_GUIDE.md) - Provider abstraction documentation
- [`docs/GRANITE_IMPLEMENTATION_ROADMAP.md`](GRANITE_IMPLEMENTATION_ROADMAP.md) - This document

---

## Phase 1: Provider Abstraction Layer 🔄

**Status:** Ready to Start  
**Duration:** 1-2 weeks  
**Owner:** Backend Team  
**Priority:** High

### Objectives

Create a flexible, provider-agnostic AI system that supports multiple LLM providers with seamless switching and fallback capabilities.

### Tasks

#### 1.1 Create Provider Interface and Types

**Files to Create:**
- `lib/ai/providers/types.ts`
- `lib/ai/providers/baseProvider.ts`

**Implementation:**
```typescript
// lib/ai/providers/types.ts
export interface AIProvider {
  name: string;
  version: string;
  generateCompletion(prompt: string, options?: CompletionOptions): Promise<string>;
  generateStream(prompt: string, options?: CompletionOptions): AsyncGenerator<string>;
  validateConfig(): boolean;
  getInfo(): ProviderInfo;
  healthCheck(): Promise<boolean>;
}

export interface CompletionOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stopSequences?: string[];
  stream?: boolean;
  timeout?: number;
}

export interface ProviderInfo {
  name: string;
  version: string;
  models: string[];
  capabilities: string[];
  pricing: PricingInfo;
}

export interface PricingInfo {
  inputCost: number;
  outputCost: number;
  currency: string;
}
```

**Success Criteria:**
- [ ] All interfaces defined with TypeScript
- [ ] Documentation comments added
- [ ] Type exports working correctly

#### 1.2 Implement Base Provider Class

**File:** `lib/ai/providers/baseProvider.ts`

**Implementation:**
```typescript
export abstract class BaseProvider implements AIProvider {
  abstract name: string;
  abstract version: string;
  
  protected config: ProviderConfig;
  protected metrics: ProviderMetrics;
  
  constructor(config: ProviderConfig) {
    this.config = config;
    this.metrics = this.initializeMetrics();
  }
  
  abstract generateCompletion(prompt: string, options?: CompletionOptions): Promise<string>;
  abstract generateStream(prompt: string, options?: CompletionOptions): AsyncGenerator<string>;
  abstract validateConfig(): boolean;
  abstract getInfo(): ProviderInfo;
  
  async healthCheck(): Promise<boolean> {
    try {
      await this.generateCompletion('test', { maxTokens: 10 });
      return true;
    } catch {
      return false;
    }
  }
  
  protected trackRequest(success: boolean, latency: number): void {
    this.metrics.requests++;
    if (success) this.metrics.successes++;
    else this.metrics.failures++;
    this.metrics.totalLatency += latency;
  }
  
  getMetrics(): ProviderMetrics {
    return { ...this.metrics };
  }
}
```

**Success Criteria:**
- [ ] Base class implements common functionality
- [ ] Metrics tracking implemented
- [ ] Error handling patterns established

#### 1.3 Implement Mock Provider

**File:** `lib/ai/providers/mockProvider.ts`

**Implementation:**
```typescript
export class MockProvider extends BaseProvider {
  name = 'mock';
  version = '1.0.0';
  
  async generateCompletion(prompt: string, options?: CompletionOptions): Promise<string> {
    // Simulate API latency
    await this.delay(this.config.responseDelay || 1000);
    
    // Return mock insights based on prompt
    return this.generateMockResponse(prompt);
  }
  
  async *generateStream(prompt: string, options?: CompletionOptions): AsyncGenerator<string> {
    const response = await this.generateCompletion(prompt, options);
    const words = response.split(' ');
    
    for (const word of words) {
      await this.delay(50);
      yield word + ' ';
    }
  }
  
  validateConfig(): boolean {
    return true; // Mock always valid
  }
  
  getInfo(): ProviderInfo {
    return {
      name: this.name,
      version: this.version,
      models: ['mock-v1'],
      capabilities: ['completion', 'streaming'],
      pricing: { inputCost: 0, outputCost: 0, currency: 'USD' },
    };
  }
}
```

**Success Criteria:**
- [ ] Mock provider fully functional
- [ ] Simulates realistic API behavior
- [ ] Can be used for testing

#### 1.4 Create Provider Factory

**File:** `lib/ai/providers/index.ts`

**Implementation:**
```typescript
export class AIProviderFactory {
  static create(providerType: string, config?: any): AIProvider {
    switch (providerType.toLowerCase()) {
      case 'mock':
        return new MockProvider(config);
      
      case 'granite':
      case 'watsonx':
      case 'huggingface':
      case 'ollama':
        return new GraniteProvider({ ...config, provider: providerType });
      
      default:
        throw new Error(`Unknown provider type: ${providerType}`);
    }
  }
  
  static createWithFallback(
    primaryType: string,
    fallbackType: string,
    config?: any
  ): AIProvider {
    const primary = this.create(primaryType, config);
    const fallback = this.create(fallbackType, config);
    return new FallbackProvider(primary, fallback);
  }
}
```

**Success Criteria:**
- [ ] Factory creates all provider types
- [ ] Fallback provider support
- [ ] Error handling for unknown types

### Deliverables

- [ ] Provider interface and types defined
- [ ] Base provider class implemented
- [ ] Mock provider fully functional
- [ ] Provider factory created
- [ ] Unit tests for all components
- [ ] Documentation updated

### Testing

```typescript
describe('Provider Abstraction Layer', () => {
  it('should create mock provider', () => {
    const provider = AIProviderFactory.create('mock');
    expect(provider.name).toBe('mock');
  });
  
  it('should generate completion', async () => {
    const provider = new MockProvider({});
    const result = await provider.generateCompletion('test prompt');
    expect(result).toBeDefined();
  });
  
  it('should stream responses', async () => {
    const provider = new MockProvider({});
    const chunks: string[] = [];
    
    for await (const chunk of provider.generateStream('test')) {
      chunks.push(chunk);
    }
    
    expect(chunks.length).toBeGreaterThan(0);
  });
});
```

---

## Phase 2: Granite Integration 🔄

**Status:** Pending Phase 1  
**Duration:** 2-3 weeks  
**Owner:** Backend Team  
**Priority:** High

### Objectives

Implement IBM Granite provider with support for watsonx.ai, Hugging Face, and Ollama endpoints.

### Tasks

#### 2.1 Install Dependencies

```bash
npm install @ibm-cloud/watsonx-ai @huggingface/inference ollama
npm install --save-dev @types/node
```

**Success Criteria:**
- [ ] All dependencies installed
- [ ] No version conflicts
- [ ] TypeScript types available

#### 2.2 Implement Granite Provider

**File:** `lib/ai/providers/graniteProvider.ts`

**Implementation Structure:**
```typescript
export class GraniteProvider extends BaseProvider {
  name = 'granite';
  version = '1.0.0';
  
  private client: WatsonXClient | HuggingFaceClient | OllamaClient;
  
  constructor(config: GraniteConfig) {
    super(config);
    this.client = this.initializeClient(config.provider);
  }
  
  async generateCompletion(prompt: string, options?: CompletionOptions): Promise<string> {
    const startTime = Date.now();
    
    try {
      const response = await this.client.generate({
        prompt,
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 2048,
      });
      
      this.trackRequest(true, Date.now() - startTime);
      return response.text;
    } catch (error) {
      this.trackRequest(false, Date.now() - startTime);
      throw error;
    }
  }
  
  async *generateStream(prompt: string, options?: CompletionOptions): AsyncGenerator<string> {
    const stream = await this.client.generateStream({
      prompt,
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 2048,
    });
    
    for await (const chunk of stream) {
      yield chunk.text;
    }
  }
}
```

**Success Criteria:**
- [ ] watsonx.ai integration working
- [ ] Hugging Face integration working
- [ ] Ollama integration working
- [ ] Streaming support implemented
- [ ] Error handling robust

#### 2.3 Environment Configuration

**File:** `.env.local.example`

```bash
# IBM Granite Configuration
GRANITE_PROVIDER=watsonx

# watsonx.ai
WATSONX_API_KEY=your_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com
WATSONX_MODEL=ibm/granite-13b-chat-v2

# Hugging Face
HUGGINGFACE_API_KEY=your_hf_token_here
HUGGINGFACE_MODEL=ibm-granite/granite-3.0-8b-instruct

# Ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=granite-code:8b

# General
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=2048
AI_TIMEOUT=30000
ENABLE_AI_FALLBACK=true
```

**Success Criteria:**
- [ ] Environment variables documented
- [ ] Example file created
- [ ] Validation logic implemented

#### 2.4 Update Orchestrator

**File:** `lib/ai/orchestrator.ts`

**Changes:**
```typescript
export class AIPromptOrchestrator {
  private provider: AIProvider;
  private fallbackProvider?: AIProvider;
  
  constructor(config: OrchestrationConfig) {
    // Initialize primary provider
    this.provider = AIProviderFactory.create(
      config.providerType || process.env.GRANITE_PROVIDER || 'mock',
      config.providerConfig
    );
    
    // Initialize fallback if enabled
    if (config.enableFallback) {
      this.fallbackProvider = new MockProvider({});
    }
  }
  
  async generateInsights(prompt: ComposedPrompt): Promise<AIAnalysisOutput> {
    try {
      const response = await this.provider.generateCompletion(prompt.fullPrompt);
      return this.parseResponse(response);
    } catch (error) {
      console.error('Primary provider failed:', error);
      
      if (this.fallbackProvider) {
        console.log('Using fallback provider');
        const response = await this.fallbackProvider.generateCompletion(prompt.fullPrompt);
        return this.parseResponse(response);
      }
      
      throw error;
    }
  }
}
```

**Success Criteria:**
- [ ] Orchestrator uses provider abstraction
- [ ] Fallback mechanism working
- [ ] Error handling comprehensive

### Deliverables

- [ ] Granite provider implemented
- [ ] All three endpoints working (watsonx, HF, Ollama)
- [ ] Environment configuration complete
- [ ] Orchestrator updated
- [ ] Integration tests passing
- [ ] Documentation updated

### Testing

```typescript
describe('Granite Integration', () => {
  it('should connect to watsonx', async () => {
    const provider = new GraniteProvider({
      provider: 'watsonx',
      apiKey: process.env.WATSONX_API_KEY,
      projectId: process.env.WATSONX_PROJECT_ID,
    });
    
    const result = await provider.generateCompletion('Hello');
    expect(result).toBeDefined();
  });
  
  it('should fallback on error', async () => {
    const orchestrator = new AIPromptOrchestrator({
      providerType: 'watsonx',
      enableFallback: true,
    });
    
    // Should not throw even if API fails
    const result = await orchestrator.generateInsights(mockPrompt);
    expect(result).toBeDefined();
  });
});
```

---

## Phase 3: Testing and Optimization ⏳

**Status:** Pending Phase 2  
**Duration:** 1-2 weeks  
**Owner:** QA Team  
**Priority:** Medium

### Objectives

Ensure reliability, performance, and cost-effectiveness of the Granite integration.

### Tasks

#### 3.1 Unit Testing

**Coverage Goals:**
- [ ] Provider abstraction: 100%
- [ ] Granite provider: 95%
- [ ] Orchestrator: 90%
- [ ] Error handling: 100%

**Test Files:**
- `lib/ai/providers/__tests__/mockProvider.test.ts`
- `lib/ai/providers/__tests__/graniteProvider.test.ts`
- `lib/ai/__tests__/orchestrator.test.ts`

#### 3.2 Integration Testing

**Test Scenarios:**
- [ ] End-to-end prompt generation and response
- [ ] Fallback mechanism activation
- [ ] Streaming responses
- [ ] Error recovery
- [ ] Rate limiting
- [ ] Timeout handling

#### 3.3 Performance Testing

**Metrics to Measure:**
- [ ] Average response latency
- [ ] Throughput (requests/second)
- [ ] Token usage per request
- [ ] Cost per 1000 requests
- [ ] Cache hit rate

**Performance Goals:**
- Response time: < 3 seconds (p95)
- Throughput: > 10 req/sec
- Error rate: < 1%
- Cache hit rate: > 30%

#### 3.4 Cost Optimization

**Strategies:**
- [ ] Implement prompt caching
- [ ] Optimize prompt length
- [ ] Use appropriate model sizes
- [ ] Batch similar requests
- [ ] Monitor and alert on costs

### Deliverables

- [ ] Comprehensive test suite
- [ ] Performance benchmarks
- [ ] Cost analysis report
- [ ] Optimization recommendations
- [ ] Monitoring dashboard

---

## Phase 4: Production Deployment 🚀

**Status:** Pending Phase 3  
**Duration:** 1 week  
**Owner:** DevOps Team  
**Priority:** High

### Objectives

Deploy Granite integration to production with proper monitoring, alerting, and rollback capabilities.

### Tasks

#### 4.1 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Documentation complete
- [ ] Environment variables configured
- [ ] API keys secured
- [ ] Monitoring setup
- [ ] Alerting configured
- [ ] Rollback plan ready

#### 4.2 Deployment Strategy

**Approach:** Gradual rollout with feature flags

1. **Week 1:** 10% of traffic to Granite
2. **Week 2:** 50% of traffic to Granite
3. **Week 3:** 100% of traffic to Granite

**Feature Flag:**
```typescript
const useGranite = featureFlags.isEnabled('granite-integration', userId);
const provider = useGranite 
  ? new GraniteProvider(config)
  : new MockProvider(config);
```

#### 4.3 Monitoring and Alerting

**Metrics to Monitor:**
- Request count and rate
- Success/failure rate
- Response latency (p50, p95, p99)
- Token usage
- Cost per day
- Error types and frequency

**Alerts:**
- Error rate > 5%
- Latency p95 > 5 seconds
- Daily cost > $100
- API quota exceeded

#### 4.4 Documentation

**Production Docs:**
- [ ] Deployment guide
- [ ] Runbook for incidents
- [ ] API key rotation procedure
- [ ] Cost monitoring guide
- [ ] Troubleshooting guide

### Deliverables

- [ ] Production deployment complete
- [ ] Monitoring active
- [ ] Alerts configured
- [ ] Documentation published
- [ ] Team trained

---

## Success Metrics

### Technical Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Test Coverage | > 90% | TBD |
| Response Time (p95) | < 3s | TBD |
| Error Rate | < 1% | TBD |
| Uptime | > 99.9% | TBD |

### Business Metrics

| Metric | Target | Current |
|--------|--------|---------|
| Cost per 1K requests | < $0.50 | TBD |
| User satisfaction | > 4.5/5 | TBD |
| Insight quality | > 4/5 | TBD |

---

## Risk Management

### Identified Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| API rate limits | High | Medium | Implement caching, rate limiting |
| High costs | High | Medium | Monitor usage, set budgets |
| API downtime | High | Low | Fallback to mock provider |
| Poor insight quality | Medium | Low | Extensive testing, feedback loop |
| Security breach | High | Low | Secure API keys, audit access |

### Contingency Plans

1. **API Failure:** Automatic fallback to mock provider
2. **Cost Overrun:** Circuit breaker to stop requests
3. **Quality Issues:** Rollback to previous version
4. **Security Incident:** Rotate keys, audit logs

---

## Timeline

```
Phase 0: Research & Planning          [✅ Complete]
Phase 1: Provider Abstraction         [🔄 2 weeks]
Phase 2: Granite Integration          [⏳ 3 weeks]
Phase 3: Testing & Optimization       [⏳ 2 weeks]
Phase 4: Production Deployment        [⏳ 1 week]
                                      ─────────────
                                      Total: 8 weeks
```

**Estimated Completion:** 8 weeks from Phase 1 start

---

## Next Steps

### Immediate Actions (This Week)

1. ✅ Complete documentation (this document)
2. 🔄 Review and approve roadmap
3. ⏳ Set up development environment
4. ⏳ Create GitHub issues for Phase 1 tasks
5. ⏳ Assign team members to tasks

### Phase 1 Kickoff (Next Week)

1. Begin provider abstraction implementation
2. Set up testing infrastructure
3. Create mock provider
4. Weekly progress reviews

---

## Resources

### Documentation
- [IBM Granite Integration Guide](IBM_GRANITE_INTEGRATION.md)
- [AI Provider Guide](AI_PROVIDER_GUIDE.md)
- [Project Structure](PROJECT_STRUCTURE.md)
- [Correct Architecture](CORRECT_ARCHITECTURE.md)

### External Resources
- [IBM watsonx.ai Documentation](https://www.ibm.com/docs/en/watsonx-as-a-service)
- [Hugging Face Inference API](https://huggingface.co/docs/api-inference)
- [Ollama Documentation](https://github.com/ollama/ollama)

### Team Contacts
- **Project Lead:** TBD
- **Backend Team:** TBD
- **QA Team:** TBD
- **DevOps Team:** TBD

---

**Document Version:** 1.0.0  
**Last Updated:** 2026-05-16  
**Status:** Active Planning Document  
**Next Review:** After Phase 1 completion