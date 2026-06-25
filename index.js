import 'dotenv/config';
import express from 'express';
import { GoogleGenAI } from '@google/genai';

const app = express();
const port = process.env.PORT || 3000;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.use(express.json());
app.use(express.static('public'));

app.post('/rewrite', async (req, res) => {
  const { text, tone } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'text is required' });
  }

  const toneInstruction = tone ? `Rewrite the following text in a ${tone} tone.` : 'Rewrite the following text to improve clarity and flow.';

  const prompt = `${toneInstruction} Return only the rewritten text, no commentary.\n\nText:\n${text}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    res.json({ result: response.text });
  } catch (err) {
    console.error('Gemini error:', err);
    res.status(500).json({ error: 'Failed to rewrite text. Check your API key and try again.' });
  }
});

app.listen(port, () => {
  console.log(`Text Rewriter running at http://localhost:${port}`);
});
