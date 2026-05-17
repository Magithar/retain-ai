# AI Provider Guide

## Overview

RetainAI's AI Provider system is a flexible, provider-agnostic architecture that allows you to use multiple LLM providers interchangeably. This guide explains the provider abstraction layer, how to choose the right provider, and how to implement custom providers.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Available Providers](#available-providers)
3. [Provider Comparison](#provider-comparison)
4. [Implementation Guide](#implementation-guide)
5. [Custom Providers](#custom-providers)
6. [Best Practices](#best-practices)

---

## Architecture Overview

### Provider Abstraction Layer

```
┌─────────────────────────────────────────────────────────────┐
│                    AI Orchestrator                          │
│                  (Business Logic Layer)                     │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Uses AIProvider Interface
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              AI Provider Abstraction Layer                  │
│                  (Provider Interface)                       │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┬──────────────┐
        │                │                │              │
        ▼                ▼                ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Granite    │ │   OpenAI     │ │  Anthropic   │ │    Mock      │
│   Provider   │ │   Provider   │ │   Provider   │ │   Provider   │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
        │                │                │              │
        ▼                ▼                ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  IBM Granite │ │  OpenAI API  │ │ Claude API   │ │ Local Mock   │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

### Key Benefits

- ✅ **Provider Independence:** Switch providers without changing business logic
- ✅ **Fallback Support:** Automatic failover to backup providers
- ✅ **Cost Optimization:** Choose providers based on cost/performance needs
- ✅ **Testing:** Use mock providers for development and testing
- ✅ **Multi-Provider:** Use different providers for different tasks

---

## Available Providers

### 1. Granite Provider (IBM)

**Status:** ✅ Recommended for Production

**Endpoints:**
- IBM watsonx.ai (Enterprise)
- Hugging Face Inference API (Development)
- Ollama (Local)

**Models:**
- `ibm/granite-13b-chat-v2`
- `ibm/granite-13b-instruct-v2`
- `ibm/granite-20b-multilingual`
- `ibm-granite/granite-3.0-8b-instruct`

**Use Cases:**
- Game analytics insights
- Product management recommendations
- Code generation and analysis
- Structured data analysis

**Configuration:**
```typescript
import { GraniteProvider } from '@/lib/ai/providers/graniteProvider';

const provider = new GraniteProvider({
  provider: 'watsonx',
  apiKey: process.env.WATSONX_API_KEY,
  projectId: process.env.WATSONX_PROJECT_ID,
  model: 'ibm/granite-13b-chat-v2',
});
```

### 2. OpenAI Provider

**Status:** 🔄 Optional (Future Implementation)

**Models:**
- GPT-4 Turbo
- GPT-4
- GPT-3.5 Turbo

**Use Cases:**
- General-purpose text generation
- Creative content
- Complex reasoning tasks

**Configuration:**
```typescript
import { OpenAIProvider } from '@/lib/ai/providers/openaiProvider';

const provider = new OpenAIProvider({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4-turbo-preview',
});
```

### 3. Anthropic Provider

**Status:** 🔄 Optional (Future Implementation)

**Models:**
- Claude 3 Opus
- Claude 3 Sonnet
- Claude 3 Haiku

**Use Cases:**
- Long-context analysis
- Detailed reasoning
- Safety-critical applications

**Configuration:**
```typescript
import { AnthropicProvider } from '@/lib/ai/providers/anthropicProvider';

const provider = new AnthropicProvider({
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: 'claude-3-opus-20240229',
});
```

### 4. Mock Provider

**Status:** ✅ Available (Development/Testing)

**Purpose:**
- Development without API costs
- Testing and CI/CD
- Fallback when APIs are unavailable

**Configuration:**
```typescript
import { MockProvider } from '@/lib/ai/providers/mockProvider';

const provider = new MockProvider({
  responseDelay: 1000, // Simulate API latency
  includeMetadata: true,
});
```

---

## Provider Comparison

### Feature Matrix

| Feature | Granite | OpenAI | Anthropic | Mock |
|---------|---------|--------|-----------|------|
| **Cost** | $$ | $$$ | $$$ | Free |
| **Speed** | Fast | Fast | Medium | Instant |
| **Context Length** | 8K-32K | 128K | 200K | Unlimited |
| **Streaming** | ✅ | ✅ | ✅ | ✅ |
| **Fine-tuning** | ✅ | ✅ | ❌ | N/A |
| **Local Deployment** | ✅ (Ollama) | ❌ | ❌ | ✅ |
| **Enterprise Support** | ✅ | ✅ | ✅ | N/A |
| **Code Generation** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Analytics** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **Reasoning** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |

### Cost Comparison (per 1M tokens)

| Provider | Input | Output | Total (avg) |
|----------|-------|--------|-------------|
| **Granite 13B** | $0.50 | $1.50 | ~$1.00 |
| **GPT-4 Turbo** | $10.00 | $30.00 | ~$20.00 |
| **Claude 3 Opus** | $15.00 | $75.00 | ~$45.00 |
| **Mock** | $0 | $0 | $0 |

### Performance Comparison

| Provider | Avg Latency | Throughput | Reliability |
|----------|-------------|------------|-------------|
| **Granite (watsonx)** | 1-2s | High | 99.9% |
| **Granite (HF)** | 2-4s | Medium | 99.5% |
| **Granite (Ollama)** | 0.5-1s | High | 100% |
| **OpenAI** | 1-3s | High | 99.9% |
| **Anthropic** | 2-4s | Medium | 99.9% |
| **Mock** | <0.1s | Unlimited | 100% |

---

## Implementation Guide

### Basic Provider Setup

```typescript
// lib/ai/providers/index.ts
import { GraniteProvider } from './graniteProvider';
import { MockProvider } from './mockProvider';

export class AIProviderFactory {
  static create(providerType: string): AIProvider {
    switch (providerType) {
      case 'watsonx':
      case 'huggingface':
      case 'ollama':
        return new GraniteProvider({ provider: providerType });
      
      case 'mock':
        return new MockProvider();
      
      default:
        throw new Error(`Unknown provider: ${providerType}`);
    }
  }
}
```

### Using Providers in Orchestrator

```typescript
// lib/ai/orchestrator.ts
import { AIProviderFactory } from './providers';

export class AIPromptOrchestrator {
  private provider: AIProvider;
  
  constructor(config: OrchestrationConfig) {
    // Initialize provider from config
    this.provider = AIProviderFactory.create(
      config.providerType || 'watsonx'
    );
  }
  
  async generateInsights(prompt: string): Promise<string> {
    try {
      // Use provider to generate insights
      return await this.provider.generateCompletion(prompt);
    } catch (error) {
      // Fallback to mock if provider fails
      console.error('Provider failed, using fallback:', error);
      const fallback = new MockProvider();
      return await fallback.generateCompletion(prompt);
    }
  }
}
```

### Provider Interface

All providers must implement this interface:

```typescript
// lib/ai/providers/types.ts
export interface AIProvider {
  // Provider identification
  name: string;
  version: string;
  
  // Core methods
  generateCompletion(
    prompt: string,
    options?: CompletionOptions
  ): Promise<string>;
  
  generateStream(
    prompt: string,
    options?: CompletionOptions
  ): AsyncGenerator<string>;
  
  // Configuration
  validateConfig(): boolean;
  getInfo(): ProviderInfo;
  
  // Health check
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
```

---

## Custom Providers

### Creating a Custom Provider

```typescript
// lib/ai/providers/customProvider.ts
import { AIProvider, CompletionOptions, ProviderInfo } from './types';

export class CustomProvider implements AIProvider {
  name = 'custom';
  version = '1.0.0';
  
  private apiKey: string;
  private baseUrl: string;
  
  constructor(config: CustomProviderConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
  }
  
  async generateCompletion(
    prompt: string,
    options?: CompletionOptions
  ): Promise<string> {
    // Implement your API call here
    const response = await fetch(`${this.baseUrl}/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 2048,
      }),
    });
    
    const data = await response.json();
    return data.completion;
  }
  
  async *generateStream(
    prompt: string,
    options?: CompletionOptions
  ): AsyncGenerator<string> {
    // Implement streaming here
    const response = await fetch(`${this.baseUrl}/stream`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, ...options }),
    });
    
    const reader = response.body?.getReader();
    if (!reader) throw new Error('No reader available');
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const text = new TextDecoder().decode(value);
      yield text;
    }
  }
  
  validateConfig(): boolean {
    return !!(this.apiKey && this.baseUrl);
  }
  
  getInfo(): ProviderInfo {
    return {
      name: this.name,
      version: this.version,
      models: ['custom-model-v1'],
      capabilities: ['completion', 'streaming'],
      pricing: {
        inputCost: 0.001,
        outputCost: 0.002,
        currency: 'USD',
      },
    };
  }
  
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}
```

### Registering Custom Provider

```typescript
// lib/ai/providers/index.ts
import { CustomProvider } from './customProvider';

export class AIProviderFactory {
  static create(providerType: string, config?: any): AIProvider {
    switch (providerType) {
      case 'custom':
        return new CustomProvider(config);
      
      // ... other providers
    }
  }
}
```

---

## Best Practices

### 1. Provider Selection Strategy

```typescript
function selectProvider(context: AnalysisContext): AIProvider {
  // Use Granite for game analytics (optimized for this use case)
  if (context.type === 'game-analytics') {
    return new GraniteProvider({ provider: 'watsonx' });
  }
  
  // Use OpenAI for creative content
  if (context.type === 'creative') {
    return new OpenAIProvider();
  }
  
  // Use Anthropic for long-context analysis
  if (context.requiresLongContext) {
    return new AnthropicProvider();
  }
  
  // Default to Granite
  return new GraniteProvider({ provider: 'watsonx' });
}
```

### 2. Fallback Chain

```typescript
const providers = [
  new GraniteProvider({ provider: 'watsonx' }),
  new GraniteProvider({ provider: 'huggingface' }),
  new MockProvider(),
];

async function generateWithFallback(prompt: string): Promise<string> {
  for (const provider of providers) {
    try {
      return await provider.generateCompletion(prompt);
    } catch (error) {
      console.warn(`Provider ${provider.name} failed:`, error);
      continue;
    }
  }
  throw new Error('All providers failed');
}
```

### 3. Caching Strategy

```typescript
class CachedProvider implements AIProvider {
  private cache = new Map<string, string>();
  private provider: AIProvider;
  
  constructor(provider: AIProvider) {
    this.provider = provider;
  }
  
  async generateCompletion(prompt: string): Promise<string> {
    const cacheKey = this.hashPrompt(prompt);
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }
    
    const result = await this.provider.generateCompletion(prompt);
    this.cache.set(cacheKey, result);
    return result;
  }
  
  private hashPrompt(prompt: string): string {
    // Simple hash function
    return Buffer.from(prompt).toString('base64');
  }
}
```

### 4. Rate Limiting

```typescript
class RateLimitedProvider implements AIProvider {
  private provider: AIProvider;
  private requestQueue: Promise<any>[] = [];
  private maxConcurrent = 5;
  
  constructor(provider: AIProvider, maxConcurrent = 5) {
    this.provider = provider;
    this.maxConcurrent = maxConcurrent;
  }
  
  async generateCompletion(prompt: string): Promise<string> {
    // Wait if too many concurrent requests
    while (this.requestQueue.length >= this.maxConcurrent) {
      await Promise.race(this.requestQueue);
    }
    
    const request = this.provider.generateCompletion(prompt);
    this.requestQueue.push(request);
    
    try {
      return await request;
    } finally {
      const index = this.requestQueue.indexOf(request);
      this.requestQueue.splice(index, 1);
    }
  }
}
```

### 5. Monitoring and Logging

```typescript
class MonitoredProvider implements AIProvider {
  private provider: AIProvider;
  private metrics = {
    requests: 0,
    successes: 0,
    failures: 0,
    totalLatency: 0,
  };
  
  async generateCompletion(prompt: string): Promise<string> {
    this.metrics.requests++;
    const startTime = Date.now();
    
    try {
      const result = await this.provider.generateCompletion(prompt);
      this.metrics.successes++;
      return result;
    } catch (error) {
      this.metrics.failures++;
      throw error;
    } finally {
      this.metrics.totalLatency += Date.now() - startTime;
    }
  }
  
  getMetrics() {
    return {
      ...this.metrics,
      avgLatency: this.metrics.totalLatency / this.metrics.requests,
      successRate: this.metrics.successes / this.metrics.requests,
    };
  }
}
```

---

## Migration Guide

### From Mock to Granite

```typescript
// Before (Mock)
const orchestrator = createOrchestrator({
  aiProvider: new MockProvider(),
});

// After (Granite)
const orchestrator = createOrchestrator({
  aiProvider: new GraniteProvider({
    provider: 'watsonx',
    apiKey: process.env.WATSONX_API_KEY,
    projectId: process.env.WATSONX_PROJECT_ID,
  }),
  fallbackProvider: new MockProvider(), // Keep mock as fallback
});
```

### Testing Strategy

```typescript
// Use mock in tests
describe('AI Orchestrator', () => {
  it('should generate insights', async () => {
    const orchestrator = createOrchestrator({
      aiProvider: new MockProvider(),
    });
    
    const result = await orchestrator.generatePrompts(mockData);
    expect(result).toBeDefined();
  });
});

// Use real provider in integration tests
describe('AI Integration', () => {
  it('should work with Granite', async () => {
    const orchestrator = createOrchestrator({
      aiProvider: new GraniteProvider({ provider: 'watsonx' }),
    });
    
    const result = await orchestrator.generatePrompts(realData);
    expect(result.analysis).toContain('retention');
  });
});
```

---

## Conclusion

The AI Provider system gives you flexibility to:
- Choose the best provider for each use case
- Switch providers without code changes
- Test without API costs
- Implement custom providers
- Optimize for cost and performance

**Recommended Setup:**
- **Production:** Granite (watsonx) with Mock fallback
- **Development:** Granite (Ollama) or Mock
- **Testing:** Mock only

---

**Last Updated:** 2026-05-16  
**Version:** 1.0.0  
**Status:** Ready for Implementation