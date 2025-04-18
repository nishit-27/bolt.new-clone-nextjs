import { GoogleGenAI } from "@google/genai";
import { BASE_PROMPT, BasePrompt, FOLLOWUP_BASE, getSystemPrompt } from "./prompts";
import { MessageType } from "@/components/ContextProvider";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function geminiTemplateResponse(userPrompt:string, systemPrompt:string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
    },
  });
  console.log(response.text);
  return response.text;
}

export async function geminiChatResponse(userPrompt:string, basePrompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [{role:"user", text: BASE_PROMPT},{role:"user",text: basePrompt},{role:"user",text:userPrompt}
    ],
    config: {
      systemInstruction: getSystemPrompt(),
    },
  });
  
  return response.text;
}

export async function geminiFollowupChatResponse(llmMessage: MessageType[]) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: llmMessage,
    config: {
      systemInstruction: getSystemPrompt(),
    },
  });
  return response.text;
}

