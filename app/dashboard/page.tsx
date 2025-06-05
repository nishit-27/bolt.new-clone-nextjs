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
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

export default function Dashboard() {
    const [state, setstate] = useState("code")
    const {mergedFiles} = useMergedContextProvider()
    const [webContainer, setWebContainer] = useState<WebContainer>()
    const [url, setUrl] = useState("")
    const [isStarted, setIsStarted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const serverReadyListenerRegistered = useRef(false);
    
    // Terminal related state
    const terminalRef = useRef<HTMLDivElement>(null);
    const [terminal, setTerminal] = useState<Terminal | null>(null);
    const [shellProcess, setShellProcess] = useState<any>(null);
    const [terminalReady, setTerminalReady] = useState(false);
 
    function changeStateToCode() {
       setstate("code")
    }

    // Initialize terminal when switching to terminal tab
    useEffect(() => {
        if (state === "terminal" && webContainer && !terminal && terminalRef.current) {
            initializeTerminal();
        }
    }, [state, webContainer, terminal]);

    // Cleanup terminal on unmount
    useEffect(() => {
        return () => {
            if (terminal) {
                terminal.dispose();
            }
            if (shellProcess) {
                shellProcess.kill?.();
            }
        };
    }, [terminal, shellProcess]);

    const initializeTerminal = async () => {
        if (!terminalRef.current || !webContainer || terminal) return;

        try {
            // Create terminal instance
            const fitAddon = new FitAddon();
            const terminalInstance = new Terminal({
                convertEol: true,
                theme: {
                    background: '#1e1e1e',
                    foreground: '#d4d4d4',
                    cursor: '#ffffff',
                },
                fontSize: 14,
                fontFamily: 'Menlo, Monaco, "Courier New", monospace',
                cursorBlink: true,
            });

            terminalInstance.loadAddon(fitAddon);
            terminalInstance.open(terminalRef.current);
            fitAddon.fit();

            // Welcome message
            terminalInstance.writeln('🚀 WebContainer Terminal Ready!');
            terminalInstance.writeln('💡 You can run commands like: npm install, npm run dev, ls, etc.');
            terminalInstance.writeln('');

            // Start shell
            const shellProc = await startShell(terminalInstance, webContainer);

            // Set up resize handler
            const handleResize = () => {
                fitAddon.fit();
                if (shellProc) {
                    shellProc.resize({
                        cols: terminalInstance.cols,
                        rows: terminalInstance.rows,
                    });
                }
            };

            window.addEventListener('resize', handleResize);

            setTerminal(terminalInstance);
            setShellProcess(shellProc);
            setTerminalReady(true);

            // Cleanup function
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        } catch (error) {
            console.error('Failed to initialize terminal:', error);
        }
    };

    const startShell = async (terminal: Terminal, webContainer: WebContainer) => {
        try {
            const shellProcess = await webContainer.spawn('jsh', {
                terminal: {
                    cols: terminal.cols,
                    rows: terminal.rows,
                },
            });

            // Pipe output from shell to terminal
            shellProcess.output.pipeTo(
                new WritableStream({
                    write(data) {
                        terminal.write(data);
                    },
                })
            );

            // Pipe input from terminal to shell
            const input = shellProcess.input.getWriter();
            terminal.onData((data) => {
                input.write(data);
            });

            return shellProcess;
        } catch (error) {
            console.error('Failed to start shell:', error);
            terminal.writeln(`❌ Failed to start shell: ${error}`);
            throw error;
        }
    };

    async function installDependencies(webContainer: WebContainer, terminal?: Terminal) {
        const installProcess = await webContainer.spawn("npm", ["install"]);
        
        if (terminal) {
            // If terminal is available, pipe output to terminal
            installProcess.output.pipeTo(
                new WritableStream({
                    write(data) {
                        terminal.write(data);
                    },
                }),
            );
        } else {
            // Fallback to console
            installProcess.output.pipeTo(
                new WritableStream({
                    write(data) {
                        console.log(data);
                    },
                }),
            );
        }
        
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

            // Pass terminal to installDependencies if available
            const installExit = await installDependencies(webContainer, terminal || undefined);
            if (installExit !== 0) {
                throw new Error("Installation failed");
            }

            if (!serverReadyListenerRegistered.current) {
                webContainer.on("server-ready", (port, url) => {
                    setUrl(url);
                    console.log("Dev server ready at:", url);
                    
                    // Log to terminal if available
                    if (terminal) {
                        terminal.writeln(`🌐 Server ready at: ${url}`);
                    }
                });
                serverReadyListenerRegistered.current = true;
            }

            await webContainer.spawn('npm', ['run', 'dev']);

            setIsStarted(true);
        } catch (error) {
            console.error('Failed to start WebContainer:', error);
            
            // Log error to terminal if available
            if (terminal) {
                terminal.writeln(`❌ Error: ${error}`);
            }
            
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

            const installExit = await installDependencies(webContainer, terminal || undefined);
            if (installExit !== 0) {
                throw new Error("Installation failed");
            }

            setIsStarted(true);
        } catch (error) {
            console.error('Failed to start WebContainer:', error);
            
            // Log error to terminal if available
            if (terminal) {
                terminal.writeln(`❌ Error: ${error}`);
            }
            
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex fixed w-screen h-screen">
            <div className="w-[30%] h-full flex flex-col p-4">
                <FollowUpSection />
            </div>
            
            <div className="w-[70%]">
                <div className="flex items-center justify-center mb-6 pt-6">
                    <div className="inline-flex rounded-lg border border-[#23262F] bg-[#18181A] shadow-sm overflow-hidden">
                        <button
                            className={`transition-all duration-200 px-6 py-2 font-medium text-base focus:outline-none ${state === "code" ? "bg-[#23262F] text-blue-400" : "text-gray-400 hover:text-blue-400"}`}
                            onClick={changeStateToCode}
                        >
                            Code
                        </button>
                        <button
                            className={`transition-all duration-200 px-6 py-2 font-medium text-base focus:outline-none ${state === "preview" ? "bg-[#23262F] text-blue-400" : "text-gray-400 hover:text-blue-400"}`}
                            onClick={() => setstate("preview")}
                        >
                            Preview
                        </button>
                        <button
                            className={`transition-all duration-200 px-6 py-2 font-medium text-base focus:outline-none ${state === "terminal" ? "bg-[#23262F] text-blue-400" : "text-gray-400 hover:text-blue-400"}`}
                            onClick={() => setstate("terminal")}
                        >
                            Terminal
                        </button>
                    </div>
                </div>
                
                <div className="relative w-full h-[calc(100vh-120px)]">
                    <div className={`${state === "code" ? "block" : "hidden"} h-full`}>
                        <CodeMirrorIde />
                    </div>
                    
                    <div className={`${state === "preview" ? "block" : "hidden"} h-full`}>
                        {webContainer ? <PreviewCode url={url} /> : <div className="flex items-center justify-center h-full text-gray-400">Loading preview...</div>}
                    </div>
                    
                    <div className={`${state === "terminal" ? "block" : "hidden"} h-full`}>
                        {!webContainer ? (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p>Initializing WebContainer...</p>
                                </div>
                            </div>
                        ) : (
                                <div className="flex flex-col h-[calc(100vh-12rem)] w-full max-w-[1200px] mx-auto rounded-lg border border-[#30363d] bg-[#141414]">
                                    {/* Terminal Top Bar */}
                                    <div className="bg-[#2d2d2d] px-4 py-2 border-b border-gray-700">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                            <span className="text-gray-400 text-sm ml-4">Terminal</span>
                                        </div>
                                    </div>

                                    {/* Terminal Output Area */}
                                    <div className="flex-1 overflow-hidden">
                                        <div
                                            ref={terminalRef}
                                            className="w-full h-full px-4 py-2 overflow-y-auto bg-[#1e1e1e]"
                                        />
                                    </div>
                                </div>



                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}