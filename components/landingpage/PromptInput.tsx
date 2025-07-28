"use client";

import { Image, CircleDollarSign, ArrowUp, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { FormEvent, useState, useRef, useEffect } from 'react';
import { extractSummaryFromLLMResponse, parseBoltArtifactToFileItems } from '@/utils/parser';
import { useRouter } from 'next/navigation';
import { useContextProvider } from '../ContextProvider';
import { nextBasePrompt, reactBasePrompt } from '@/utils/prompts';

export default function PromptInput() {
  const [isFocused, setIsFocused] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {setTempleteName,llmMessage,setLlmMessage,setFinalFiles,chatMessage,setChatMessage} = useContextProvider()

  const router = useRouter()

  // Ref for auto-expanding textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [userPrompt]);

  const handleSubmit = async(e:FormEvent) => {
    if (!userPrompt.trim() || isLoading) return;
    // Handle submission here
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/template",{
        method:"POST",
        headers:{ "Content-type" : "applicatoin/json" },
        body: JSON.stringify({userPrompt: userPrompt})
      });
      router.push("/dashboard")
      const llmResponse = await response.json()
      const chatResponse = llmResponse.chatResponse;
      const template = llmResponse.response.trim()

      const parseData = parseBoltArtifactToFileItems(chatResponse)
      const chatMessageLlm = extractSummaryFromLLMResponse(chatResponse)
      console.log("chat message from llm:" , chatMessageLlm)
      console.log("this is what i have parsed for you", parseData)
      setFinalFiles(parseData)
      setTempleteName(template)
      setChatMessage([...chatMessage, {role: "user" ,text: userPrompt}, {role: "model" ,text: chatMessageLlm}])
      if(template=="React"){
        setLlmMessage([...llmMessage, {role: "user", text: "i have attached the sample code of a template that we are using. this is the starting point. make sure you make changes accordingly. This is the code:" + reactBasePrompt},{role:"user",text:userPrompt},{role: "model", text: llmResponse.chatResponse}])
      } else {
        setLlmMessage([...llmMessage, {role: "user", text: "i have attached the sample code of a template that we are using. this is the starting point. make sure you make changes accordingly. This is the code:" + nextBasePrompt},{role:"user",text:userPrompt},{role: "model", text: llmResponse.chatResponse}])
      }
      
      
    } catch(error) {
      console.log("error in sending prompt" + error)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
      <motion.div
        className="flex items-stretch bg-[#2c2c2c] border border-[#363637] rounded-2xl w-full px-2 sm:px-3 py-1 sm:py-2 gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <textarea
          ref={textareaRef}
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="create a"
          disabled={isLoading}
          rows={1}
          className={`flex-1 py-3 sm:py-4 px-4 sm:px-5 bg-transparent border-none outline-none text-white text-sm sm:text-base placeholder:text-[#646464] disabled:opacity-50 disabled:cursor-not-allowed resize-none min-h-[48px] max-h-[200px] overflow-y-auto`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && userPrompt.trim() && !isLoading) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <div className="flex items-center gap-1 sm:gap-2">
          <motion.button
            className="flex items-center gap-0.5 sm:gap-1 text-[#848484] bg-[#232323] rounded-full py-0.5 sm:py-1 px-1.5 sm:px-2 text-[10px] sm:text-xs font-medium border border-[#363637] hover:border-[#848484] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            <CircleDollarSign size={12} className="sm:hidden" />
            <CircleDollarSign size={14} className="hidden sm:inline" />
            <span>Free</span>
          </motion.button>
          <motion.button
            className="text-[#848484] hover:text-white p-0.5 sm:p-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={isLoading}
          >
            <Image size={18} className="sm:hidden" />
            <Image size={20} className="hidden sm:inline" />
          </motion.button>
          <motion.button
            className={`p-2 rounded-full transition-all duration-200 ${
              userPrompt.trim() && !isLoading
                ? 'bg-white text-black hover:bg-[#f2f2f2] cursor-pointer' 
                : 'text-[#464646] cursor-not-allowed'
            }`}
            whileHover={userPrompt.trim() && !isLoading ? { scale: 1.05 } : {}}
            whileTap={userPrompt.trim() && !isLoading ? { scale: 0.95 } : {}}
            onClick={handleSubmit}
            disabled={!userPrompt.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <ArrowUp size={16} className="sm:hidden" />
                <ArrowUp size={18} className="hidden sm:inline" />
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
