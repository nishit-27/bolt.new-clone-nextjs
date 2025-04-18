import { MessageType } from "@/components/ContextProvider";
import { geminiChatResponse, geminiFollowupChatResponse } from "@/utils/gemini";
import { BasePrompt } from "@/utils/prompts";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const data: MessageType[] = await req.json() 
    const llmResponse = await geminiFollowupChatResponse(data)
    console.log("hello after followup is compelete")

   return NextResponse.json({
        message: "request successfull", data, llmResponse
    })
    
}