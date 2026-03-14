import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// ── Feedback prompts ──────────────────────────────────────────────────────────
const prompts = {
  fantastic: (title, category, body) =>
    `You are a visionary creative director who gets genuinely excited about bold ideas.
Review this idea with harsh honesty but also expand on its full potential — push it further, imagine what it could become if taken to the extreme, and challenge the person to think way bigger. Be direct, even blunt, but ultimately inspiring. 2-4 sentences.

Title: ${title}
Category: ${category}
Description: ${body}`,

  constructive: (title, category, body) =>
    `You are a careful, detail-oriented editor. Review this idea and focus on fixing small mistakes, gaps in logic, or weak spots. Be specific about what needs tightening up. Keep it practical and actionable. 2-3 sentences.

Title: ${title}
Category: ${category}
Description: ${body}`,

  friendly: (title, category, body) =>
    `You are a warm, supportive teammate who wants to help this idea succeed. Give encouraging feedback that highlights what's working well. Keep the tone light, positive, and conversational — like a friend cheering them on. 2-3 sentences.

Title: ${title}
Category: ${category}
Description: ${body}`,

  personal: (title, category, body) =>
    `You are a personal mentor who knows this person well and genuinely cares about their growth. Give feedback that connects the idea to the person's potential and journey — make it feel personal, thoughtful, and motivating. Speak directly to them. 2-3 sentences.

Title: ${title}
Category: ${category}
Description: ${body}`,
};

// ── POST /feedback ────────────────────────────────────────────────────────────
app.post('/feedback', async (req, res) => {
  const { title, category, body, feedbackType = 'constructive' } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'title and body are required' });
  const buildPrompt = prompts[feedbackType] || prompts.constructive;
  try {
    const result = await model.generateContent(buildPrompt(title, category, body));
    res.json({ feedback: result.response.text() });
  } catch (err) {
    console.error('Gemini feedback error:', err);
    res.status(500).json({ error: 'Failed to generate feedback' });
  }
});

// ── POST /generate-deck ───────────────────────────────────────────────────────
app.post('/generate-deck', async (req, res) => {
  const { title, category, body } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'title and body are required' });

  const prompt = `You are a startup pitch deck expert. Given the idea below, generate exactly 5 slides for a compelling pitch deck.

Return ONLY valid JSON — no markdown, no backticks, no explanation. The JSON must be an array of exactly 5 slide objects.

Each slide must follow one of these layouts:

Layout "title": { "layout": "title", "bg": "<hex>", "accent": "<hex>", "title": "<text>", "subtitle": "<text>" }
Layout "bullets": { "layout": "bullets", "bg": "<hex>", "accent": "<hex>", "title": "<text>", "bullets": ["<point>", "<point>", "<point>"] }
Layout "metrics": { "layout": "metrics", "bg": "<hex>", "accent": "<hex>", "title": "<text>", "metrics": [{ "label": "<text>", "value": "<text>", "delta": "<text>" }, ...] } — always 4 metrics
Layout "roadmap": { "layout": "roadmap", "bg": "<hex>", "accent": "<hex>", "title": "<text>", "items": [{ "q": "<short label>", "label": "<text>", "done": false }, ...] } — always 4 items

Rules:
- Slide 1 must be layout "title" — the big opening slide with the idea name and a punchy subtitle
- Slide 2 must be layout "bullets" titled "The Problem" — 3 sharp bullet points about the pain this solves
- Slide 3 must be layout "bullets" titled "Our Solution" — 3 bullet points on what the idea does
- Slide 4 must be layout "metrics" titled "The Opportunity" — 4 market/impact metrics with realistic estimates
- Slide 5 must be layout "roadmap" titled "Roadmap" — 4 milestones (all done: false)
- Choose a cohesive color palette. bg and accent must contrast well. Use rich, non-generic colors.
- For dark bg slides use white-ish accent. For white bg slides use a strong color accent.
- Keep all text concise and punchy — this is a pitch deck, not an essay.

Idea:
Title: ${title}
Category: ${category}
Description: ${body}

Return only the JSON array. Nothing else.`;

  try {
    const result = await model.generateContent(prompt);
    let raw = result.response.text().trim();
    raw = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    const slides = JSON.parse(raw);
    if (!Array.isArray(slides) || slides.length === 0) {
      return res.status(500).json({ error: 'Invalid slide data returned' });
    }
    res.json({ slides });
  } catch (err) {
    console.error('Gemini deck error:', err);
    res.status(500).json({ error: 'Failed to generate pitch deck' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});