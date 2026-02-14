import { GoogleGenAI } from '@google/genai';

// Initialize Gemini AI with new SDK
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY is not set in environment variables');
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Get Gemini AI instance
export function getGeminiAI() {
    if (!ai) {
        throw new Error('Gemini API key is not configured. Please add GEMINI_API_KEY to .env.local');
    }
    return ai;
}

export default ai;
