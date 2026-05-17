# IBM Granite Integration Guide

## Overview

This guide provides comprehensive instructions for integrating IBM Granite language models into RetainAI's AI orchestration system. IBM Granite models are enterprise-grade LLMs optimized for code generation, reasoning, and instruction-following tasks.

## Table of Contents

1. [Integration Options](#integration-options)
2. [Prerequisites](#prerequisites)
3. [Setup Instructions](#setup-instructions)
4. [Configuration](#configuration)
5. [Usage Examples](#usage-examples)
6. [API Reference](#api-reference)
7. [Troubleshooting](#troubleshooting)
8. [Cost Estimation](#cost-estimation)

---

## Integration Options

RetainAI supports three methods for accessing IBM Granite models:

### Option 1: IBM watsonx.ai (Recommended for Production)

**Pros:**
- Enterprise-grade reliability and support
- Full feature set and model access
- Advanced monitoring and governance
- SLA guarantees

**Cons:**
- Requires IBM Cloud account
- Pay-as-you-go pricing
- More complex setup

**Best For:** Production deployments, enterprise applications

### Option 2: Hugging Face Inference API (Recommended for Development)

**Pros:**
- Easy setup and quick start
- Free tier available
- Good for prototyping
- Simple API

**Cons:**
- Rate limits on free tier
- Limited model selection
- Less enterprise features

**Best For:** Development, testing, proof-of-concept

### Option 3: Ollama (Local Deployment)

**Pros:**
- No API costs
- Complete privacy (data stays local)
- No rate limits
- Offline capability

**Cons:**
- Requires local compute resources
- Manual model management
- No cloud scaling

**Best For:** Development, privacy-sensitive data, offline scenarios

---

## Prerequisites

### For IBM watsonx.ai

1. **IBM Cloud Account**
   - Sign up at [cloud.ibm.com](https://cloud.ibm.com)
   - Create a watsonx.ai instance

2. **API Credentials**
   - IBM Cloud API Key
   - Project ID
   - Service URL

3. **Billing Setup**
   - Configure payment method
   - Review pricing at [IBM watsonx Pricing](https://www.ibm.com/products/watsonx-ai/pricing)

### For Hugging Face

1. **Hugging Face Account**
   - Sign up at [huggingface.co](https://huggingface.co)

2. **API Token**
   - Generate at [Settings > Access Tokens](https://huggingface.co/settings/tokens)
   - Select "Read" permissions

3. **Model Access**
   - Verify access to IBM Granite models
   - Accept model license agreements if required

### For Ollama

1. **Install Ollama**
   ```bash
   # macOS
   brew install ollama
   
   # Linux
   curl -fsSL https://ollama.ai/install.sh | sh
   
   # Windows
   # Download from https://ollama.ai/download
   ```

2. **Pull Granite Model**
   ```bash
   ollama pull granite-code:8b
   ```

---

## Setup Instructions

### Step 1: Install Dependencies

```bash
npm install @ibm-cloud/watsonx-ai @huggingface/inference ollama
```

### Step 2: Create Environment Configuration

Create a `.env.local` file in your project root:

```bash
# IBM Granite Configuration
GRANITE_PROVIDER=watsonx  # Options: 'watsonx', 'huggingface', 'ollama'

# === IBM watsonx.ai Configuration ===
WATSONX_API_KEY=your_ibm_cloud_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com
WATSONX_MODEL=ibm/granite-13b-chat-v2

# === Hugging Face Configuration ===
HUGGINGFACE_API_KEY=your_hf_token_here
HUGGINGFACE_MODEL=ibm-granite/granite-3.0-8b-instruct

# === Ollama Configuration ===
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=granite-code:8b

# === General AI Configuration ===
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=2048
AI_TIMEOUT=30000
ENABLE_AI_FALLBACK=true
```

### Step 3: Update Next.js Configuration

Add environment variables to `next.config.ts`:

```typescript
const nextConfig = {
  env: {
    GRANITE_PROVIDER: process.env.GRANITE_PROVIDER,
    WATSONX_API_KEY: process.env.WATSONX_API_KEY,
    WATSONX_PROJECT_ID: process.env.WATSONX_PROJECT_ID,
    WATSONX_URL: process.env.WATSONX_URL,
    HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
    OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL,
  },
};
```

### Step 4: Verify Installation

Run the verification script:

```bash
npm run verify-granite
```

---

## Configuration

### IBM watsonx.ai Setup

1. **Get API Key:**
   ```bash
   # Login to IBM Cloud
   ibmcloud login
   
   # Create API key
   ibmcloud iam api-key-create granite-api-key -d "API key for Granite integration"
   ```

2. **Get Project ID:**
   - Navigate to watsonx.ai console
   - Select your project
   - Copy Project ID from project settings

3. **Configure Model:**
   ```typescript
   const config = {
     provider: 'watsonx',
     apiKey: process.env.WATSONX_API_KEY,
     projectId: process.env.WATSONX_PROJECT_ID,
     model: 'ibm/granite-13b-chat-v2',
     parameters: {
       temperature: 0.7,
       max_tokens: 2048,
       top_p: 0.9,
     }
   };
   ```

### Hugging Face Setup

1. **Get API Token:**
   - Visit [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
   - Click "New token"
   - Select "Read" access
   - Copy token

2. **Configure Model:**
   ```typescript
   const config = {
     provider: 'huggingface',
     apiKey: process.env.HUGGINGFACE_API_KEY,
     model: 'ibm-granite/granite-3.0-8b-instruct',
     parameters: {
       temperature: 0.7,
       max_new_tokens: 2048,
     }
   };
   ```

### Ollama Setup

1. **Start Ollama Service:**
   ```bash
   ollama serve
   ```

2. **Pull Model:**
   ```bash
   ollama pull granite-code:8b
   ```

3. **Configure:**
   ```typescript
   const config = {
     provider: 'ollama',
     baseUrl: 'http://localhost:11434',
     model: 'granite-code:8b',
     parameters: {
       temperature: 0.7,
       num_predict: 2048,
     }
   };
   ```

---

## Usage Examples

### Basic Usage

```typescript
import { createOrchestrator } from '@/lib/ai';
import { GraniteProvider } from '@/lib/ai/providers/graniteProvider';

// Initialize provider
const provider = new GraniteProvider({
  provider: 'watsonx',
  apiKey: process.env.WATSONX_API_KEY,
  projectId: process.env.WATSONX_PROJECT_ID,
});

// Create orchestrator with Granite
const orchestrator = createOrchestrator({
  aiProvider: provider,
  enabledBuilders: ['retention', 'monetization', 'liveops'],
});

// Generate insights
const result = await orchestrator.generatePrompts(analyticsSummary, {
  gameContext: 'mobile RPG',
  focusAreas: ['retention', 'monetization'],
});

console.log(result.analysis);
```

### Streaming Responses

```typescript
import { GraniteProvider } from '@/lib/ai/providers/graniteProvider';

const provider = new GraniteProvider({ provider: 'watsonx' });

// Stream insights in real-time
for await (const chunk of provider.generateStream(prompt)) {
  console.log(chunk);
  // Update UI with streaming content
}
```

### With Fallback

```typescript
import { createOrchestrator } from '@/lib/ai';
import { GraniteProvider } from '@/lib/ai/providers/graniteProvider';
import { MockProvider } from '@/lib/ai/providers/mockProvider';

const orchestrator = createOrchestrator({
  aiProvider: new GraniteProvider({ provider: 'watsonx' }),
  fallbackProvider: new MockProvider(), // Fallback if API fails
  enableFallback: true,
});
```

### Multiple Providers

```typescript
import { AIProviderFactory } from '@/lib/ai/providers';

// Create provider based on environment
const provider = AIProviderFactory.create(
  process.env.GRANITE_PROVIDER || 'watsonx'
);

// Use provider
const response = await provider.generateCompletion(prompt);
```

---

## API Reference

### GraniteProvider Class

```typescript
class GraniteProvider implements AIProvider {
  constructor(config: GraniteConfig);
  
  // Generate completion
  async generateCompletion(
    prompt: string,
    options?: CompletionOptions
  ): Promise<string>;
  
  // Generate streaming response
  async *generateStream(
    prompt: string,
    options?: CompletionOptions
  ): AsyncGenerator<string>;
  
  // Validate configuration
  validateConfig(): boolean;
  
  // Get provider info
  getInfo(): ProviderInfo;
}
```

### Configuration Types

```typescript
interface GraniteConfig {
  provider: 'watsonx' | 'huggingface' | 'ollama';
  apiKey?: string;
  projectId?: string;
  baseUrl?: string;
  model?: string;
  parameters?: ModelParameters;
}

interface CompletionOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stopSequences?: string[];
  stream?: boolean;
}
```

---

## Troubleshooting

### Common Issues

#### 1. Authentication Errors

**Problem:** `401 Unauthorized` or `Invalid API key`

**Solution:**
```bash
# Verify API key is set
echo $WATSONX_API_KEY

# Check .env.local file exists
cat .env.local

# Regenerate API key if needed
ibmcloud iam api-key-create granite-api-key-new
```

#### 2. Rate Limiting

**Problem:** `429 Too Many Requests`

**Solution:**
- Implement exponential backoff
- Use caching for repeated prompts
- Upgrade to higher tier plan
- Enable fallback to mock AI

#### 3. Timeout Errors

**Problem:** Request times out

**Solution:**
```typescript
const config = {
  timeout: 60000, // Increase timeout to 60s
  retries: 3,     // Add retry logic
};
```

#### 4. Model Not Found

**Problem:** `Model not available`

**Solution:**
- Verify model name spelling
- Check model availability in your region
- Ensure proper access permissions

#### 5. Ollama Connection Failed

**Problem:** Cannot connect to Ollama

**Solution:**
```bash
# Check if Ollama is running
ollama list

# Start Ollama service
ollama serve

# Verify model is pulled
ollama pull granite-code:8b
```

### Debug Mode

Enable debug logging:

```typescript
const provider = new GraniteProvider({
  provider: 'watsonx',
  debug: true, // Enable debug logs
});
```

---

## Cost Estimation

### IBM watsonx.ai Pricing

| Model | Input (per 1K tokens) | Output (per 1K tokens) |
|-------|----------------------|------------------------|
| Granite 13B Chat | $0.0005 | $0.0015 |
| Granite 13B Instruct | $0.0005 | $0.0015 |
| Granite 20B | $0.001 | $0.003 |

**Estimated Monthly Costs:**
- **Low usage** (10K prompts/month): ~$15-30
- **Medium usage** (100K prompts/month): ~$150-300
- **High usage** (1M prompts/month): ~$1,500-3,000

### Hugging Face Pricing

| Tier | Requests/month | Cost |
|------|---------------|------|
| Free | 30K | $0 |
| Pro | 300K | $9/month |
| Enterprise | Unlimited | Custom |

### Ollama (Local)

- **Cost:** $0 (uses local compute)
- **Requirements:** 8GB+ RAM, modern CPU/GPU
- **Electricity:** ~$5-20/month depending on usage

---

## Best Practices

1. **Use Caching:** Cache repeated prompts to reduce API calls
2. **Implement Fallbacks:** Always have a fallback provider
3. **Monitor Usage:** Track API calls and costs
4. **Optimize Prompts:** Shorter prompts = lower costs
5. **Batch Requests:** Process multiple analyses together
6. **Set Timeouts:** Prevent hanging requests
7. **Handle Errors:** Graceful degradation on failures
8. **Test Locally:** Use Ollama for development

---

## Next Steps

1. Choose your integration method (watsonx, Hugging Face, or Ollama)
2. Set up API credentials
3. Configure environment variables
4. Test with sample data
5. Monitor performance and costs
6. Optimize based on usage patterns

---

## Support

- **IBM watsonx Support:** [IBM Support Portal](https://www.ibm.com/support)
- **Hugging Face Support:** [HF Community Forum](https://discuss.huggingface.co)
- **Ollama Support:** [GitHub Issues](https://github.com/ollama/ollama/issues)
- **RetainAI Issues:** [GitHub Issues](https://github.com/your-repo/retain-ai/issues)

---

**Last Updated:** 2026-05-16  
**Version:** 1.0.0  
**Status:** Ready for Implementation