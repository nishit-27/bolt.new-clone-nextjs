import { FormEvent, useState } from "react"
import { MessageType, useContextProvider } from "./ContextProvider"
import { extractSummaryFromLLMResponse, parseBoltArtifactToFileItems } from "@/utils/parser"
import { mergeFiles } from "@/utils/merge"
import { useMergedContextProvider } from "./mergedFileContextProvider"
import { useRef, useEffect } from "react"

export default function FollowUpSection() {
    const [userPrompt, setUserPrompt] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const {llmMessage,setLlmMessage,setChatMessage,chatMessage} = useContextProvider()
    const {setMergedFiles,mergedFiles} = useMergedContextProvider()
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (chatEndRef.current) {
        chatEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [chatMessage]);

    async function submitFunction(e:FormEvent) {
        e.preventDefault()
        setIsLoading(true)
        const  userMessage : MessageType = {
            role: "user",
            text: userPrompt
        }
        setChatMessage((prev: MessageType[]) => [...prev, userMessage]);
        setUserPrompt("")
        try {
            const response = await fetch("/api/chat",{
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
            setChatMessage((prev: MessageType[]) => [...prev, {role: "model", text:chatMessageLlm }])
        } catch (error) {
            console.error("Error during API request:", error)
            setChatMessage((prev: MessageType[]) => [...prev, {role: "model", text: "Sorry, there was an error processing your request. Please try again." }])
        } finally {
            setIsLoading(false)
        }
    }
    return(
        <div className="flex flex-col h-full w-full bg-[#121212] border border-[#30363d] rounded-xl shadow-lg p-4">
            <div className="flex-1 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
                {chatMessage.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}>
                        <div className={`max-w-[80%] px-6 py-4 rounded-2xl break-words shadow-lg text-sm font-normal
                            ${msg.role === 'user' ? 'bg-[#16181e]  text-gray-100 shadow' : 'bg-[#0d0f12] text-gray-200 shadow'}
                        `}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </div>
            {/** Auto-scroll to bottom on chatMessage change */}
            {isLoading && (
                <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            )}
            <form onSubmit={submitFunction} className="w-full flex items-end bg-transparent mt-2">
                <div className="relative flex-1">
                    <textarea
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                        placeholder="How can Bolt help you today?"
                        rows={1}
                        disabled={isLoading}
                        className={`w-full bg-[#0f1114] text-white placeholder-[#646464] rounded-xl px-4 py-3 text-base resize-none outline-none border border-[#23262F] shadow-sm transition focus:border-blue-500 min-h-[48px] max-h-[160px] pr-12 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        style={{ minHeight: '90px', maxHeight: '160px' }}
                        onInput={e => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                        }}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (userPrompt.trim() && !isLoading) {
                                    submitFunction(e as any);
                                }
                            }
                        }}
                    />
                    {userPrompt.trim() && !isLoading && (
                        <button
                            type="submit"
                            className="absolute right-2 bottom-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition-colors duration-200 shadow-md"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-7.5-15-7.5v6.75l10.5 0-10.5 0v6.75z" />
                            </svg>
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}