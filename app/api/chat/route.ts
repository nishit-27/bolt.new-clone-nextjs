import { MessageType } from "@/components/ContextProvider";
import { geminiFollowupChatResponse } from "@/utils/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const data: MessageType[] = await req.json() 
    console.log("DATA::", data)
    const llmResponse = await geminiFollowupChatResponse(data)
    console.log("hello after followup is compelete")

   return NextResponse.json({
        message: "request successfull", llmResponse
    })
    
}