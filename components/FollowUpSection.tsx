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
        const messageTillNow = LLM.data
        console.log(messageTillNow)

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
        <div>
            {chatMessage.map((msg, index) => (
  <div key={index} className={`my-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
    <div className={`inline-block px-3 py-2 rounded ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
      {msg.role === 'user' ? `You: ${msg.text}` : `AI: ${msg.text}`}
    </div>
  </div>
))}

            {/* {chatMessage[0].role=="user" ? <div>user message: {chatMessage[0].text}</div> : <div> model message:{chatMessage[0].text} </div> } */}
            <form onSubmit={submitFunction}>
                <input
                     type="text" onChange={(e) => setUserPrompt(e.target.value)} placeholder="write follow up question">
                </input>
                <button className="divide-red-700" type="submit"> submit </button>
            </form>
            
        </div>
    )
}