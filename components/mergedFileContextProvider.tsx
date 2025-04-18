"use client"
import { FileItem } from "@/app/codemirroride/page";

import { useState } from "react";
import { useContext , createContext} from "react";

type contextType = {
    mergedFiles: FileItem[],
    setMergedFiles: (value: FileItem[]) => void
}

const GlobelMergedContext = createContext<contextType| undefined>(undefined);
export default function MergedContextProvider({children}:{children: React.ReactNode}) {
    const [mergedFiles,setMergedFiles] = useState<FileItem[]>([]);

return ( 
<GlobelMergedContext.Provider value={{mergedFiles,setMergedFiles}}>
    {children}
</GlobelMergedContext.Provider>)
       
}

export function useMergedContextProvider() {
    const context = useContext(GlobelMergedContext);
    if (!context) {
      throw new Error("useContextProvider must be used within ContextProvider");
    }
    return context;
  };