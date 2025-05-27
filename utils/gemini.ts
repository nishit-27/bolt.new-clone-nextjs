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
  console.log(response);
  return response.text;
}
export async function geminiTest(userPrompt:string, systemPrompt:string) {
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
    contents: [{role:"user", text: BASE_PROMPT},{role:"user",text:"i have attached the sample code of a template that we are using. this is the starting point. make sure you make changes accordingly. This is the code:"+basePrompt},{role:"user",text:userPrompt}
    ],
    config: {
      systemInstruction: getSystemPrompt(),
    },
  });
  console.log(response.text)
  
  return response.text;
  
}
export async function geminiChatResponse2(userPrompt:string, basePrompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [{role:"user", text: BASE_PROMPT},{role:"user",text:"i have attached the sample code of a template that we are using. make sure you make changes accordingly. This is the code:"+basePrompt},{role:"user",text:userPrompt}
    ],
    config: {
      systemInstruction: getSystemPrompt(),
    },
  });
  console.log(response)
  
  return response;
  
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

