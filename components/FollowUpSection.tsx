import { FormEvent, useState } from "react"
import { MessageType, useContextProvider } from "./ContextProvider"
import { parseBoltArtifactToFileItems } from "@/utils/parser"
import { mergeFiles } from "@/utils/merge"
import { useMergedContextProvider } from "./mergedFileContextProvider"

export default function FollowUpSection() {
    const [userPrompt, setUserPrompt] = useState("")
    const {llmMessage,setLlmMessage,setFinalFiles,finalFiles} = useContextProvider()
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
        console.log("this is what i have parsed for you from followup", parseData)
        
        const mergedFFiles = mergeFiles(mergedFiles,parseData)
        console.log("final merged file", mergedFFiles)
        setMergedFiles(mergedFFiles)
        setLlmMessage([...llmMessage, userMessage, {role: "model", text:llmResponse }])
    }
    return(
        <div>
            <form onSubmit={submitFunction}>
                <input
                     type="text" onChange={(e) => setUserPrompt(e.target.value)} placeholder="write follow up question">
                </input>
                <button className="divide-red-700" type="submit"> submit </button>
            </form>
            
        </div>
    )
}