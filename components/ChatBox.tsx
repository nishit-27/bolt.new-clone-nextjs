"use client"

import { parseBoltArtifactToFileItems } from "@/utils/parser"
import { useRouter } from "next/navigation"
import { parse } from "path"
import { FormEvent, useState } from "react"
import { useContextProvider } from "./ContextProvider"
import { nextBasePrompt, reactBasePrompt } from "@/utils/prompts"

export default function ChatBox() {
    const [userPrompt, setUserPrompt] = useState('')
    const [parsedData, setParsedData] = useState([])
    const {setTempleteName,templeteName,llmMessage,setLlmMessage,setFinalFiles} = useContextProvider()

    const router = useRouter()
    const submitFunction = async (e: FormEvent) => {
        e.preventDefault();
        try{const response = await fetch("http://localhost:3000/api/template",{
            method:"POST",
            headers:{ "Content-type" : "applicatoin/json" },
            body: JSON.stringify({userPrompt: userPrompt})
        });
        const llmResponse = await response.json()
        const chatResponse = llmResponse.chatResponse;
        const template = llmResponse.response.trim()

        const parseData = parseBoltArtifactToFileItems(chatResponse)
        console.log("this is what i have parsed for you", parseData)
        setFinalFiles(parseData)
        setTempleteName(template)
        if(templeteName=="React"){
              setLlmMessage([...llmMessage, {role: "user", text: reactBasePrompt},{role:"user",text:userPrompt},{role: "model", text: llmResponse.chatResponse}])
            } else {
                setLlmMessage([...llmMessage, {role: "user", text: nextBasePrompt},{role:"user",text:userPrompt},{role: "model", text: llmResponse.chatResponse}])
            }
          
        
        
        router.push("/dashboard")}
        catch(error) {
            console.log("error in sending prompt" + error)
        }

    }
    return (
        <div className="flex items-center justify-center min-h-screen w-full bg-[#111111] px-4">
            <div className="w-full max-w-2xl bg-[#1C1C1C] rounded-2xl shadow-lg p-6">
                <form onSubmit={submitFunction} className="flex flex-col gap-4">
                   
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="e.g. A Twitter clone with Next.js and Tailwind" 
                            value={userPrompt} 
                            onChange={(e) => setUserPrompt(e.target.value)}
                            className="flex-1 bg-[#2C2C2C] text-white placeholder-gray-500 rounded-lg px-4 py-3 font-geist-sans focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button 
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-geist-sans px-6 py-3 rounded-lg transition-colors duration-200"
                        >
                            Build
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}