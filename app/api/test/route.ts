import { geminiChatResponse, geminiChatResponse2, geminiTest } from "@/utils/gemini";
import { reactBasePrompt } from "@/utils/prompts";
import { NextResponse } from "next/server";

 export async function GET() { 
   const chatResponse = await geminiChatResponse2("simple todo app",reactBasePrompt);
    return NextResponse.json({chatResponse})
}
