import { geminiChatResponse } from "@/utils/gemini";
import { reactBasePrompt } from "@/utils/prompts";
import { NextResponse } from "next/server";

 export async function GET() { 
   const chatResponse = await geminiChatResponse("simple todo app",reactBasePrompt);
    return NextResponse.json({chatResponse})
}
