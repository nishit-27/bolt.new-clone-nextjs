import { FormEvent, useState } from "react"
import { MessageType, useContextProvider } from "./ContextProvider"
import { extractSummaryFromLLMResponse, parseBoltArtifactToFileItems } from "@/utils/parser"
import { mergeFiles } from "@/utils/merge"
import { useMergedContextProvider } from "./mergedFileContextProvider"

export default function FollowUpSection() {
    const [userPrompt, setUserPrompt] = useState("")
    const {llmMessage,setLlmMessage,setFinalFiles,finalFiles,setChatMessage,chatMessage} = useContextProvider()
    const {setMergedFiles,mergedFiles} = useMergedContextProvider()
    async function submitFunction(e:FormEvent) {
        e.preventDefault()
        const  userMessage : MessageType = {
            role: "user",
            text: userPrompt
        }
        const response = await fetch("http://localhost:3000/api/chat",{
            method: "POST",
            headers: {"Content-type" : "application/json"},
            body: JSON.stringify([...llmMessage,userMessage])
        })
        const LLM = await response.json()
        const llmResponse = LLM.llmResponse
        console.log("LLM RESPONSE::", llmResponse)

        const parseData = parseBoltArtifactToFileItems(llmResponse)
        const chatMessageLlm = extractSummaryFromLLMResponse(llmResponse)
        console.log("this is what i have parsed for you from followup", parseData)
        
        const mergedFFiles = mergeFiles(mergedFiles,parseData)
        console.log("final merged file", mergedFFiles)
        setMergedFiles(mergedFFiles)
        setLlmMessage([...llmMessage, userMessage, {role: "model", text:llmResponse }])
        setChatMessage([...chatMessage, userMessage, {role: "model", text:chatMessageLlm }])
        console.log(chatMessage)
        
    }
    return(
        <div className="flex flex-col h-full w-full bg-[#141414] border border-[#30363d] rounded-xl shadow-lg p-4">
            <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
                {chatMessage.map((msg, index) => (
                    <div key={index} className={`my-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block px-3 py-2 rounded-lg border ${msg.role === 'user' ? 'bg-[#2c2c2c] border-[#363637] text-white' : 'bg-[#181A20] border-[#23262F] text-[#848484]'}`}
                        >
                            {msg.role === 'user' ? `You: ${msg.text}` : `AI: ${msg.text}`}
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={submitFunction} className="w-full flex items-center bg-[#2c2c2c] border border-[#363637] rounded-b-xl px-2 py-2 mt-2">
                <input
                    type="text"
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="How can Bolt help you today?"
                    className="flex-1 bg-transparent outline-none text-white placeholder-[#646464] px-3 py-2 rounded-full"
                />
                <button type="submit" className="ml-2 bg-white text-black rounded-full p-2 transition-colors duration-200 hover:bg-[#f2f2f2] disabled:bg-[#464646] disabled:text-[#848484]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-7.5-15-7.5v6.75l10.5 0-10.5 0v6.75z" />
                    </svg>
                </button>
            </form>
        </div>
    )
}