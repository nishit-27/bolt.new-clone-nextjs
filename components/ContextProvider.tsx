"use client"
import { FileItem } from "@/app/codemirroride/page";
import { BASE_PROMPT, FOLLOWUP_BASE } from "@/utils/prompts";

import { useState } from "react";
import { useContext , createContext} from "react";

export type MessageType = {role:"user" | "model", text: string}

import type { Dispatch, SetStateAction } from "react";

type contextType = {
    finalFiles: FileItem[],
    setFinalFiles: (value: FileItem[]) => void
    templeteName: string,
    setTempleteName: (value: string) => void
    llmMessage: MessageType[],
    setLlmMessage: Dispatch<SetStateAction<MessageType[]>>
    chatMessage: MessageType[],
    setChatMessage: Dispatch<SetStateAction<MessageType[]>>
}

const GlobelContext = createContext<contextType| undefined>(undefined);
export default function ContextProvider({children}:{children: React.ReactNode}) {
    const [finalFiles,setFinalFiles] = useState<FileItem[]>([]);
    const [templeteName,setTempleteName] = useState<string>("")
    const [llmMessage,setLlmMessage] = useState<MessageType[]>([{role:"user", text: FOLLOWUP_BASE},{role:"user", text: BASE_PROMPT}])
    const [chatMessage, setChatMessage] = useState<MessageType[]>([])
return ( 
<GlobelContext.Provider value={{finalFiles,setFinalFiles,templeteName,setTempleteName,llmMessage, setLlmMessage,chatMessage,setChatMessage}}>
    {children}
</GlobelContext.Provider>)
       
}

export function useContextProvider() {
    const context = useContext(GlobelContext);
    if (!context) {
      throw new Error("useContextProvider must be used within ContextProvider");
    }
    return context;
  };