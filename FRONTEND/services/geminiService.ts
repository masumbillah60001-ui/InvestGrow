import { GoogleGenAI } from "@google/genai";

export const getInvestmentAssistantResponse = async (userMessage: string) => {
  try {
    const apiKey = process.env.API_KEY;

    if (!apiKey || apiKey === 'PLACEHOLDER_API_KEY') {
      console.warn("Gemini API Key is missing or invalid.");
      return "I am currently unable to connect to my brain. Please check the API Key configuration.";
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash', // Updated to stable model name if possible, or keep preview
      contents: userMessage,
      config: {
        systemInstruction: `You are an AI Investment Assistant for "InvestGrow India".
        Your goal is to educate Indian users about investments like SIP, Mutual Funds, and Stocks.
        Rules:
        1. Always be professional and polite.
        2. NEVER promise fixed or guaranteed returns.
        3. Explain that "Mutual fund investments are subject to market risks".
        4. Focus on Indian context (Rupees, Indian Tax laws like ELSS).
        5. Keep responses concise and easy for beginners.
        6. Do not provide specific stock tips; provide general investment education.`,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't process that. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm having trouble connecting to my knowledge base. Please try again later.";
  }
};
