import { GoogleGenAI, Chat, GenerateContentStreamResult } from "@google/genai";
import { SYSTEM_INSTRUCTION } from '../constants';

let chatSession: Chat | null = null;

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set process.env.API_KEY");
  }
  return new GoogleGenAI({ apiKey });
};

export const initializeChat = async (): Promise<Chat> => {
  const ai = getAIClient();
  
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.2, // Low temperature for more deterministic, professional output
      topK: 40,
      topP: 0.95,
    },
  });

  return chatSession;
};

export const sendMessageToAI = async (message: string): Promise<GenerateContentStreamResult> => {
  if (!chatSession) {
    await initializeChat();
  }
  
  if (!chatSession) {
    throw new Error("Failed to initialize chat session");
  }

  // We use sendMessageStream for a better user experience
  return chatSession.sendMessageStream({ message });
};
