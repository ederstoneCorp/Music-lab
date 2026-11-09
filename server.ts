import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize GoogleGenAI client with required User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * Health check and app metadata
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    community: 'CodeMtaani',
    anthem: 'Think. Build. Transform.',
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

/**
 * Lyria AI Music Generation Endpoint
 * Supports models: 'lyria-3-clip-preview' (30s) and 'lyria-3-pro-preview' (full tracks)
 */
app.post('/api/lyria/generate', async (req, res) => {
  try {
    const {
      model = 'lyria-3-clip-preview',
      prompt,
      title = 'CodeMtaani Anthem Variation',
    } = req.body;

    // Validate model selection
    const allowedModels = ['lyria-3-clip-preview', 'lyria-3-pro-preview'];
    const selectedModel = allowedModels.includes(model) ? model : 'lyria-3-clip-preview';

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required for music generation.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(400).json({
        error: 'API Key not detected. Please configure GEMINI_API_KEY in the Secrets panel to generate with Lyria.',
        requiresKey: true,
      });
    }

    console.log(`[Lyria] Initiating music generation with model: ${selectedModel}`);
    console.log(`[Lyria] Prompt preview: ${prompt.slice(0, 120)}...`);

    const responseStream = await ai.models.generateContentStream({
      model: selectedModel,
      contents: prompt,
    });

    const audioChunks: Buffer[] = [];
    let lyrics = '';
    let mimeType = 'audio/mpeg';

    for await (const chunk of responseStream) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;
      for (const part of parts) {
        if (part.inlineData?.data) {
          if (audioChunks.length === 0 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioChunks.push(Buffer.from(part.inlineData.data, 'base64'));
        }
        if (part.text) {
          lyrics += part.text;
        }
      }
    }

    if (audioChunks.length === 0) {
      // Model returned text without audio data (rare fallback)
      return res.status(200).json({
        success: true,
        lyrics: lyrics || 'Instrumental Afro-futuristic track generated.',
        title,
        model: selectedModel,
        note: 'Audio stream did not return binary chunks; returned musical score and notes.',
      });
    }

    const audioBase64 = Buffer.concat(audioChunks).toString('base64');
    const audioDataUrl = `data:${mimeType};base64,${audioBase64}`;

    return res.status(200).json({
      success: true,
      audioDataUrl,
      lyrics,
      title,
      model: selectedModel,
      mimeType,
      durationApprox: selectedModel === 'lyria-3-clip-preview' ? '30s' : 'Full Track',
    });
  } catch (error: any) {
    console.error('[Lyria Generation Error]', error);
    const errorMessage = error?.message || 'Failed to generate music with Lyria.';
    const isPaidKeyError =
      errorMessage.includes('RESOURCE_EXHAUSTED') ||
      errorMessage.includes('PERMISSION_DENIED') ||
      errorMessage.includes('403') ||
      errorMessage.includes('quota');

    return res.status(500).json({
      error: errorMessage,
      isPaidKeyError,
      suggestion: isPaidKeyError
        ? 'Lyria preview models require a paid billing-enabled API key or quota in AI Studio.'
        : 'Please try again or select a different preset.',
    });
  }
});

// Setup Vite in Dev or serve static in Prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CodeMtaani Studio Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
