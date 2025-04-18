"use client"
import { convertToFileSystemStructure } from "@/utils/finalparser"
import { useMergedContextProvider } from "./mergedFileContextProvider"
import { useWebContainer } from "@/utils/webcontainer"
import { useEffect, useState } from "react"
import { WebContainer } from "@webcontainer/api"

export default function PreviewCode({ url }: {url:string} ) {

    return <div className="h-screen">
        {!url ? <div>"you are seeing preview of code"</div> : <iframe className="h-[80%] w-[97%]" src={url}></iframe> }

    </div>
}