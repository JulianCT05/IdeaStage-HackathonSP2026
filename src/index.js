import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

async function chat(userMessage) {
  const result = await model.generateContent(userMessage);
  return result.response.text();
}

// Test it out!
const reply = await chat('Say hello!');
console.log(reply);