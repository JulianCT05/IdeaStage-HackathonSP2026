import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

app.post('/feedback', async (req, res) => {
  const { title, category, body } = req.body;

  const prompt = `You are a helpful team assistant. Give brief, constructive feedback (2-3 sentences) on this idea:
  Title: ${title}
  Category: ${category}
  Description: ${body}`;

  const result = await model.generateContent(prompt);
  res.json({ feedback: result.response.text() });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});