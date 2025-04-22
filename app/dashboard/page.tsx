"use client"
import {
    SandpackProvider,
    SandpackLayout,
    SandpackPreview,
    SandpackCodeEditor,
    SandpackFileExplorer
} from "@codesandbox/sandpack-react";
import { Code, Height } from "@mui/icons-material";
import { useEffect, useState, useRef } from "react";
import CodeMirrorIde, { FileItem } from "../codemirroride/page";
import PreviewCode from "@/components/PreviewCode";
import { getWebContainer } from "@/utils/webcontainer";
import { useMergedContextProvider } from "@/components/mergedFileContextProvider";
import { convertToFileSystemStructure } from "@/utils/finalparser";
import { WebContainer } from "@webcontainer/api";
import FollowUpSection from "@/components/FollowUpSection";



export default function Dashboard() {
    const [state, setstate] = useState("code")
    const {mergedFiles} = useMergedContextProvider()
    const [webContainer, setWebContainer] = useState<WebContainer>()
    const [url, setUrl] = useState("")
    const [isStarted, setIsStarted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const serverReadyListenerRegistered = useRef(false);
 
    function changeStateToCode() {
       setstate("code")
    }

    async function installDependencies(webContainer: WebContainer) {
        const installProcess = await webContainer.spawn("npm", ["install"]);
        installProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              console.log(data);
            },
          }),
        );
        return installProcess.exit;
    }

    async function startDevServer(webContainer: WebContainer) {
        await webContainer.spawn("npm", ["run", "dev"]);
        webContainer.on("server-ready", (port, url) => {
            setUrl(url);
        });
    }

    useEffect(() => {
        if (mergedFiles && mergedFiles.length > 0 && !isStarted && !isLoading) {
            startWebContainer();
            console.log("first useEffect called to set webContainer")
        }
    }, [mergedFiles, isStarted, isLoading]);
    useEffect(() => {
        if (mergedFiles && mergedFiles.length > 0 && isStarted && !isLoading) {
            updateWebContainer();
            console.log("second useEffect called to update webContainer")
        }
    }, [mergedFiles, isStarted]);
      
    async function startWebContainer() {
        if (isStarted || isLoading) return;

        try {
            setIsLoading(true);
            const mergedFilesForContainer = convertToFileSystemStructure(mergedFiles);
            
            console.log('Mounting files:', mergedFilesForContainer);
            
            const webContainer = await getWebContainer();
            setWebContainer(webContainer);

            await webContainer.mount(mergedFilesForContainer);

            const installExit = await installDependencies(webContainer);
            if (installExit !== 0) {
                throw new Error("Installation failed");
            }

            
            if (!serverReadyListenerRegistered.current) {
                webContainer.on("server-ready", (port, url) => {
                    setUrl(url);
                    console.log("Dev server ready at:", url);
                });
                serverReadyListenerRegistered.current = true;
            }

            await webContainer.spawn('npm', ['run', 'dev']);

            setIsStarted(true);
        } catch (error) {
            console.error('Failed to start WebContainer:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }
    async function updateWebContainer() {
        if (!isStarted || isLoading) return;

        try {
            setIsLoading(true);
            const mergedFilesForContainer = convertToFileSystemStructure(mergedFiles);
            
            console.log('Mounting files:', mergedFilesForContainer);
            
            if (!webContainer) {
                throw new Error("WebContainer not initialized");
            }
            await webContainer.mount(mergedFilesForContainer);

            const installExit = await installDependencies(webContainer);
            if (installExit !== 0) {
                throw new Error("Installation failed");
            }

            // await webContainer.spawn('npm', ['run', 'dev']);

            setIsStarted(true);
        } catch (error) {
            console.error('Failed to start WebContainer:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
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
                    <button className={state == "preview" ? "text-blue-400 font-medium px-4 py-2" : "text-gray-400 font-medium px-4 py-2"} onClick={()=> {setstate("preview")}}>Preview</button>
                </div>
                <div className="relative w-full">
                    <div className={`${state === "code" ? "block" : "hidden"}`}>
                        <CodeMirrorIde />
                    </div>
                    <div className={`${state === "preview" ? "block" : "hidden"}`}>
                        {webContainer ? <PreviewCode url={url} /> : <div>"loading preview"</div>}
                    </div>
                </div>

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