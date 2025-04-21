import { geminiChatResponse, geminiTemplateResponse } from "@/utils/gemini";
import { nextBasePrompt, reactBasePrompt } from "@/utils/prompts";
import { NextRequest, NextResponse } from "next/server";
const systemPrompt:string= "You are a helpful assistant that recommends the appropriate frontend framework—Next.js or React—based on the user's input describing their project needs. Analyze their input and reply with only one word: either Next or React. Do not include any explanation or any extra later or simble."
export async function POST(req:NextRequest){
    const {userPrompt} = await req.json()
    console.log(userPrompt)
    const response = await geminiTemplateResponse(userPrompt,systemPrompt);
    console.log(response)
    const basePrompt = response?.trim() == "React" ? reactBasePrompt : nextBasePrompt;
    if(basePrompt===reactBasePrompt) {
        console.log("used react base prompt")
    }
    if(basePrompt===nextBasePrompt){
        console.log("used next base prompt")
    }
    
    const chatResponse = await geminiChatResponse(userPrompt,basePrompt);
    console.log("we got response");
    
    
    // Return a success response after processing
    return NextResponse.json({ message: "Request processed successfully", chatResponse, response});
}
    // if(response=="React"){
    //     console.log("we reach here")
    //     const basePrompt = reactBasePrompt;
    //     const chatResponse = await geminiChatResponse(userPrompt,basePrompt);
    //     console.log("react:" , chatResponse)
    //     return;
    // }
    // if(response=="Next"){
    //     const basePrompt = nextBasePrompt;
    //     const chatResponse = await geminiChatResponse(userPrompt,basePrompt);
    //     console.log("next:", chatResponse)
    //     return;

    // }
