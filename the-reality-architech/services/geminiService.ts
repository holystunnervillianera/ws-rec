import axios from "axios";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

/**
 * Core AI Orchestration - Redirects all client requests to the secure backend proxy.
 * This prevents Gemini API key exposure in the browser.
 */
export async function callGemini(messages: Message[], systemInstruction?: string): Promise<string> {
  try {
    const response = await axios.post("/api/ai/chat", {
      messages,
      systemInstruction,
    });
    return response.data.content;
  } catch (error) {
    console.error("AI Proxy Error:", error);
    return "The intelligence node is currently recalibrating. Connection lost.";
  }
}

// 1. Basic Content Analysis
export const fastAnalyze = async (text: string) => {
  return await callGemini([{ role: "user", content: `Analyze and summarize this text briefly for an expert blog: ${text}` }]);
};

// 2. Complex Reasoning
export const deepReason = async (draft: string) => {
  return await callGemini([{ role: "user", content: `As an AI expert, refine this raw draft into a professional, high-value blog post. Maintain a tone that is authoritative yet accessible. Raw draft: ${draft}` }]);
};

// 3. Strategy Generation
export const generateStrategy = async (goal: string) => {
  return await callGemini([{ role: "user", content: `Generate a high-performance business strategy for: ${goal}` }]);
};

// 4. Code Optimization
export const optimizeCode = async (code: string) => {
  return await callGemini([{ role: "user", content: `Optimize this code for performance and security: ${code}` }]);
};
