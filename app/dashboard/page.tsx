"use client"
import {
    SandpackProvider,
    SandpackLayout,
    SandpackPreview,
    SandpackCodeEditor,
    SandpackFileExplorer
} from "@codesandbox/sandpack-react";
import { Code, Height } from "@mui/icons-material";
import { useState } from "react";
import CodeMirrorIde, { FileItem } from "../codemirroride/page";
import PreviewCode from "@/components/PreviewCode";
import { getWebContainer } from "@/utils/webcontainer";
import { useMergedContextProvider } from "@/components/mergedFileContextProvider";
import { convertToFileSystemStructure } from "@/utils/finalparser";
import { WebContainer } from "@webcontainer/api";
import FollowUpSection from "@/components/FollowUpSection";



export default function Dashboard() {
    const [state,setstate] = useState("code")
    const {mergedFiles} = useMergedContextProvider()
    const mergedFilesForContainer = convertToFileSystemStructure(mergedFiles)
    const [webContainer,setWebContainer] = useState<WebContainer>()
    const [url, setUrl] = useState("")
   

    function changeStateToCode() {
       setstate("code")
    }
    async function installDependencies(webContainer:WebContainer) {
        // Install dependencies
        const installProcess = await webContainer.spawn("npm", ["install"]);
        installProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              console.log(data);
            },
          }),
        );
        
          // Wait for install command to exit
  return installProcess.exit;
}
async function startDevServer(webContainer:WebContainer) {
    // Run `npm run start` to start the Express app
    await webContainer.spawn("npm", ["run", "dev"]);
  
    // Wait for `server-ready` event
    webContainer.on("server-ready", (port, url) => {
      setUrl(url);
    });
  }
    async function changeStateToPreview() {
        setstate("preview")
        const webContainer = await getWebContainer();
        setWebContainer(webContainer)
        await webContainer.mount(mergedFilesForContainer);
        const exitCode = await installDependencies(webContainer);
        if (exitCode !== 0) {
          throw new Error("Installation failed");
        }
        startDevServer(webContainer)
    }

    return (
        <div className="flex fixed w-screen h-screen">
            <div className="w-[30%] ">
                <div className="">hello</div>
                <FollowUpSection></FollowUpSection>
                chat
            </div>
            
            <div className="w-[70%]">
                <div className="bg-black rounded-full p-1 inline-flex">
                    <button className={state == "code" ? "text-blue-400 font-medium px-4 py-2" : "text-gray-400 font-medium px-4 py-2"} onClick={changeStateToCode}>Code</button>
                    <button className={state == "preview" ? "text-blue-400 font-medium px-4 py-2" : "text-gray-400 font-medium px-4 py-2"} onClick={changeStateToPreview}>Preview</button>
                </div>
                {state=="code"  ? <CodeMirrorIde></CodeMirrorIde> : webContainer?  <PreviewCode url={url}></PreviewCode> : <div>"loading preview"</div>}

                {/* <SandpackProvider template="react" theme="dark">
                    <SandpackLayout >

                        {state == "code" ? <><SandpackFileExplorer style={{height:"70vh"}}/>
                            <SandpackCodeEditor style={{height:"70vh"}} /></> : <SandpackPreview style={{height:"70vh"}}/>}


                    </SandpackLayout>
                </SandpackProvider> */}

            </div>
        </div>

    )
}