"use client"
import { convertToFileSystemStructure } from "@/utils/finalparser"
import { useMergedContextProvider } from "./mergedFileContextProvider"
import { useWebContainer } from "@/utils/webcontainer"
import { useEffect, useState } from "react"
import { WebContainer } from "@webcontainer/api"

export default function PreviewCode({ url }: {url:string} ) {

    return     <div className="h-[calc(100vh-12rem)] w-full max-w-[1200px] mx-auto rounded-lg overflow-hidden border border-[#30363d] bg-[#141414]">

        {!url ? <div>"you are seeing preview of code"</div> : <iframe className="h-full w-full" src={url}></iframe> }

    </div>
}