# IBM Granite Quick Start Guide

## 🚀 Get Started in 5 Minutes

This guide will help you quickly set up and test IBM Granite integration in RetainAI.

## Prerequisites

- Node.js 18+ installed
- RetainAI project cloned
- Access to one of: IBM watsonx.ai, Hugging Face, or Ollama

---

## Option 1: Hugging Face (Easiest) ⭐

**Best for:** Quick testing, development, free tier available

### Step 1: Get API Token

1. Sign up at [huggingface.co](https://huggingface.co)
2. Go to [Settings > Access Tokens](https://huggingface.co/settings/tokens)
3. Click "New token" → Select "Read" → Copy token

### Step 2: Configure Environment

Create `.env.local`:

```bash
GRANITE_PROVIDER=huggingface
HUGGINGFACE_API_KEY=hf_your_token_here
HUGGINGFACE_MODEL=ibm-granite/granite-3.0-8b-instruct
```

### Step 3: Install Dependencies

```bash
npm install @huggingface/inference
```

### Step 4: Test Integration

```typescript
import { GraniteProvider } from '@/lib/ai/providers/graniteProvider';

const provider = new GraniteProvider({
  provider: 'huggingface',
  apiKey: process.env.HUGGINGFACE_API_KEY,
});

const response = await provider.generateCompletion(
  'Analyze this game data and provide retention insights.'
);

console.log(response);
```

**Done!** 🎉 You're now using IBM Granite via Hugging Face.

---

## Option 2: Ollama (Local, Free) 💻

**Best for:** Development, privacy, no API costs

### Step 1: Install Ollama

```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows - Download from https://ollama.ai/download
```

### Step 2: Pull Granite Model

```bash
ollama pull granite-code:8b
```

### Step 3: Start Ollama

```bash
ollama serve
```

### Step 4: Configure Environment

Create `.env.local`:

```bash
GRANITE_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=granite-code:8b
```

### Step 5: Install Dependencies

```bash
npm install ollama
```

### Step 6: Test Integration

```typescript
import { GraniteProvider } from '@/lib/ai/providers/graniteProvider';

const provider = new GraniteProvider({
  provider: 'ollama',
  baseUrl: 'http://localhost:11434',
  model: 'granite-code:8b',
});

const response = await provider.generateCompletion(
  'Analyze player retention patterns.'
);

console.log(response);
```

**Done!** 🎉 You're running Granite locally.

---

## Option 3: IBM watsonx.ai (Production) 🏢

**Best for:** Production deployments, enterprise features

### Step 1: Create IBM Cloud Account

1. Sign up at [cloud.ibm.com](https://cloud.ibm.com)
2. Create a watsonx.ai instance
3. Note your Project ID

### Step 2: Get API Key

```bash
# Install IBM Cloud CLI
curl -fsSL https://clis.cloud.ibm.com/install/linux | sh

# Login
ibmcloud login

# Create API key
ibmcloud iam api-key-create granite-api-key
```

### Step 3: Configure Environment

Create `.env.local`:

```bash
GRANITE_PROVIDER=watsonx
WATSONX_API_KEY=your_ibm_cloud_api_key
WATSONX_PROJECT_ID=your_project_id
WATSONX_URL=https://us-south.ml.cloud.ibm.com
WATSONX_MODEL=ibm/granite-13b-chat-v2
```

### Step 4: Install Dependencies

```bash
npm install @ibm-cloud/watsonx-ai
```

### Step 5: Test Integration

```typescript
import { GraniteProvider } from '@/lib/ai/providers/graniteProvider';

const provider = new GraniteProvider({
  provider: 'watsonx',
  apiKey: process.env.WATSONX_API_KEY,
  projectId: process.env.WATSONX_PROJECT_ID,
});

const response = await provider.generateCompletion(
  'Provide monetization recommendations for this game.'
);

console.log(response);
```

**Done!** 🎉 You're using enterprise-grade Granite.

---

## Complete Example

### Full Integration with RetainAI

```typescript
// app/api/analyze/route.ts
import { createOrchestrator } from '@/lib/ai';
import { GraniteProvider } from '@/lib/ai/providers/graniteProvider';
import { MockProvider } from '@/lib/ai/providers/mockProvider';

export async function POST(request: Request) {
  const { analyticsSummary } = await request.json();
  
  // Create Granite provider
  const provider = new GraniteProvider({
    provider: process.env.GRANITE_PROVIDER || 'huggingface',
    apiKey: process.env.HUGGINGFACE_API_KEY,
  });
  
  // Create orchestrator with fallback
  const orchestrator = createOrchestrator({
    aiProvider: provider,
    fallbackProvider: new MockProvider(),
    enabledBuilders: ['retention', 'monetization', 'liveops'],
  });
  
  try {
    // Generate insights
    const result = await orchestrator.generatePrompts(analyticsSummary, {
      gameContext: 'mobile RPG',
      focusAreas: ['retention', 'monetization'],
    });
    
    return Response.json(result);
  } catch (error) {
    console.error('Analysis failed:', error);
    return Response.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
```

---

## Testing Your Setup

### 1. Health Check

```typescript
const provider = new GraniteProvider({ provider: 'huggingface' });
const isHealthy = await provider.healthCheck();
console.log('Provider healthy:', isHealthy);
```

### 2. Simple Completion

```typescript
const response = await provider.generateCompletion('Hello, Granite!');
console.log('Response:', response);
```

### 3. Streaming Response

```typescript
for await (const chunk of provider.generateStream('Tell me about game analytics')) {
  process.stdout.write(chunk);
}
```

### 4. Full Analysis

```typescript
import { generatePrompt } from '@/lib/ai';

const prompt = await generatePrompt('retention', analyticsSummary, {
  gameContext: 'mobile game',
  focusAreas: ['early retention', 'tutorial'],
});

const insights = await provider.generateCompletion(prompt.fullPrompt);
console.log('Insights:', insights);
```

---

## Troubleshooting

### Issue: "API Key Invalid"

**Solution:**
```bash
# Check if environment variable is set
echo $HUGGINGFACE_API_KEY

# Verify .env.local exists
cat .env.local

# Restart dev server
npm run dev
```

### Issue: "Model Not Found"

**Solution:**
```bash
# For Ollama
ollama list
ollama pull granite-code:8b

# For Hugging Face - check model name
# Correct: ibm-granite/granite-3.0-8b-instruct
```

### Issue: "Connection Timeout"

**Solution:**
```typescript
const provider = new GraniteProvider({
  provider: 'huggingface',
  timeout: 60000, // Increase timeout to 60s
});
```

### Issue: "Rate Limited"

**Solution:**
- Wait a few minutes
- Upgrade to paid tier
- Use Ollama locally (no limits)

---

## Next Steps

1. ✅ Choose your provider (Hugging Face recommended for start)
2. ✅ Set up environment variables
3. ✅ Test basic completion
4. ✅ Integrate with RetainAI orchestrator
5. 📚 Read [Full Integration Guide](IBM_GRANITE_INTEGRATION.md)
6. 🏗️ Explore [Provider Guide](AI_PROVIDER_GUIDE.md)
7. 🗺️ Review [Implementation Roadmap](GRANITE_IMPLEMENTATION_ROADMAP.md)

---

## Comparison: Which Option to Choose?

| Feature | Hugging Face | Ollama | watsonx.ai |
|---------|-------------|--------|------------|
| **Setup Time** | 5 min | 10 min | 20 min |
| **Cost** | Free tier | Free | Pay-as-you-go |
| **Speed** | Medium | Fast | Fast |
| **Privacy** | Cloud | Local | Cloud |
| **Best For** | Testing | Development | Production |

**Recommendation:**
- **Start with:** Hugging Face (easiest)
- **Develop with:** Ollama (free, fast)
- **Deploy with:** watsonx.ai (enterprise)

---

## Common Use Cases

### Use Case 1: Analyze Player Retention

```typescript
const prompt = `
Analyze this player retention data:
- Day 1 retention: 45%
- Day 7 retention: 20%
- Day 30 retention: 8%

Provide actionable recommendations to improve retention.
`;

const insights = await provider.generateCompletion(prompt);
```

### Use Case 2: Monetization Strategy

```typescript
const prompt = `
Based on this data:
- ARPPU: $12.50
- Conversion rate: 3.2%
- Whale segment: 0.5% of players, 60% of revenue

Suggest monetization improvements.
`;

const insights = await provider.generateCompletion(prompt);
```

### Use Case 3: LiveOps Planning

```typescript
const prompt = `
Current engagement metrics:
- Daily active users: 10,000
- Session length: 15 minutes
- Peak hours: 6-9 PM

Plan a week of LiveOps events.
`;

const insights = await provider.generateCompletion(prompt);
```

---

## Support

- 📖 [Full Documentation](IBM_GRANITE_INTEGRATION.md)
- 🐛 [Report Issues](https://github.com/your-repo/retain-ai/issues)
- 💬 [Community Discord](#)
- 📧 [Email Support](#)

---

**Last Updated:** 2026-05-16  
**Version:** 1.0.0  
**Estimated Setup Time:** 5-20 minutes depending on provider