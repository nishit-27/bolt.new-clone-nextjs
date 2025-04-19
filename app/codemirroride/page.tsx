"use client"


import React, { useContext, useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, File, Folder, Settings, Terminal, X } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';

import { useContextProvider } from '@/components/ContextProvider';
import { nextBasePrompt, reactBasePrompt } from '@/utils/prompts';
import { parseBoltArtifactToFileItems } from '@/utils/parser';
import { init } from 'next/dist/compiled/webpack/webpack';
import { mergeFiles } from '@/utils/merge';
import { getWebContainer } from '@/utils/webcontainer';
import { convertToFileSystemStructure } from '@/utils/finalparser';
import { useMergedContextProvider } from '@/components/mergedFileContextProvider';

export interface FileItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  content?: string;
}



function FileExplorer({ files, onFileSelect }: { files: FileItem[], onFileSelect: (file: FileItem) => void }) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src']));

  const toggleFolder = (folderName: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderName)) {
      newExpanded.delete(folderName);
    } else {
      newExpanded.add(folderName);
    }
    setExpandedFolders(newExpanded);
  };

  const renderItem = (item: FileItem, depth: number = 0) => {
    const isExpanded = expandedFolders.has(item.name);

    return (
      <div key={item.name}>
        <div
          className={`file-item flex items-center px-2 py-1 cursor-pointer text-[#cccccc] text-[13px] hover:bg-[#2a2d2e]`}
          style={{ paddingLeft: `${depth * 12}px` }}
          onClick={() => {
            if (item.type === 'folder') {
              toggleFolder(item.name);
            } else {
              onFileSelect(item);
            }
          }}
        >
          {item.type === 'folder' ? (
            <>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 mr-1 text-[#cccccc]" />
              ) : (
                <ChevronRight className="w-4 h-4 mr-1 text-[#cccccc]" />
              )}
              <Folder className="w-4 h-4 mr-2 text-[#4d8ff9]" />
            </>
          ) : (
            <>
              <span className="w-4 mr-1" />
              <File className="w-4 h-4 mr-2 text-[#cccccc]" />
            </>
          )}
          {item.name}
        </div>
        {item.type === 'folder' && isExpanded && item.children?.map(child => renderItem(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="text-sm">
      {files.map(file => renderItem(file))}
    </div>
  );
}

function findFileByName(files: FileItem[], name: string): FileItem | null {
  for (const file of files) {
    if (file.name === name) return file;
    if (file.children) {
      const found = findFileByName(file.children, name);
      if (found) return found;
    }
  }
  return null;
}

export default function CodeMirrorIde() {
  const {finalFiles} = useContextProvider()
  const {templeteName} = useContextProvider()
  const {setMergedFiles,mergedFiles} = useMergedContextProvider()
  const [selectedTab, setSelectedTab] = useState('package.json');
  const filesOnly: FileItem[] = [
    {
      name: "README.md",
      type: "file",
      content: "# Welcome to the project"
    },
    {
      name: "index.js",
      type: "file",
      content: "console.log('Hello World');"
    },
    {
      name: "style.css",
      type: "file",
      content: "body { font-family: sans-serif; }"
    },
    {
      name: "app.config.json",
      type: "file",
      content: '{ "theme": "dark" }'
    }
  ];
  const [sampleFiles, setSampleFiles] = useState<FileItem[]>(filesOnly)
  useEffect(() => {
    const initialFiles = parseBoltArtifactToFileItems(templeteName === "React" ? reactBasePrompt : nextBasePrompt)
    const mergedFiles = mergeFiles(initialFiles,finalFiles)
    setMergedFiles(mergedFiles)
    
    console.log("use effect called")
  },[])
  useEffect(() => {
    setSampleFiles(mergedFiles)
    console.log("merged file updated",sampleFiles)
  },[mergedFiles])

  // useEffect(() => {
  //   const mergedFollowUpFiles = mergeFiles(mergedFiles,finalFiles)
  //   setMergedFiles(mergedFollowUpFiles)
  //   setSampleFiles(mergedFollowUpFiles)
  // },[finalFiles])
  

  const [openFiles, setOpenFiles] = useState<FileItem[]>(() => {
    const initialFile = findFileByName(sampleFiles, 'package.json');
    return initialFile ? [initialFile] : [];
  });
  const [activeFile, setActiveFile] = useState<FileItem>(openFiles[0]);

  const handleFileSelect = (file: FileItem) => {
    if (file.type === 'file') {
      setSelectedTab(file.name);
      if (!openFiles.find(f => f.name === file.name)) {
        setOpenFiles([...openFiles, file]);
      }
      setActiveFile(file);
    }
  };

  const handleCloseTab = (fileName: string) => {
    const newOpenFiles = openFiles.filter(f => f.name !== fileName);
    setOpenFiles(newOpenFiles);
    if (selectedTab === fileName && newOpenFiles.length > 0) {
      setSelectedTab(newOpenFiles[0].name);
      setActiveFile(newOpenFiles[0]);
    }
  };

  const handleCodeChange = (value: string) => {
    const updatedFile = { ...activeFile, content: value };
    setActiveFile(updatedFile);
    setOpenFiles(openFiles.map(f => f.name === updatedFile.name ? updatedFile : f));
  };

  return (
    <div className="h-[calc(100vh-12rem)] w-full max-w-[1200px] mx-auto rounded-lg overflow-hidden border border-[#30363d] bg-[#141414]">
      {/* Top Bar */}
      <div className="h-10 bg-[#141414] border-b border-[#30363d] flex items-center px-4">
        <div className="flex space-x-2">
          <button className="text-[13px] px-3 py-1 rounded text-white hover:bg-[#1e1e1e]">Code</button>
          <button className="text-[13px] px-3 py-1 rounded text-[#8b8b8b] hover:bg-[#1e1e1e]">Preview</button>
        </div>
      </div>

      <div className="flex h-[calc(100%-2.5rem)]">
        {/* Sidebar - Fixed width */}
        <div className="w-[240px] min-w-[240px] max-w-[240px] bg-[#141414] border-r border-[#30363d] flex flex-col">
          <div className="p-2 text-[11px] font-medium text-[#8b8b8b] uppercase tracking-wide">Files</div>
          <div className="overflow-y-auto flex-1">
            <FileExplorer files={sampleFiles} onFileSelect={handleFileSelect} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-[#141414] min-w-0">
          {/* Tabs */}
          <div className="bg-[#141414] flex items-center border-b border-[#30363d] h-9 min-h-[2.25rem] overflow-x-auto">
            {openFiles.filter(Boolean).map(file => (
              <div
                key={file.name}
                className={`flex items-center h-full px-3 border-r border-[#30363d] cursor-pointer shrink-0 ${
                  selectedTab === file.name ? 'bg-[#141414] text-white' : 'bg-[#1e1e1e] text-[#8b8b8b]'
                }`}
                onClick={() => {
                  setSelectedTab(file.name);
                  setActiveFile(file);
                }}
              >
                <File className="w-4 h-4 mr-2 shrink-0" />
                <span className="text-[13px] whitespace-nowrap">{file.name}</span>
                <X
                  className="w-4 h-4 ml-2 hover:text-white shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCloseTab(file.name);
                  }}
                />
              </div>
            ))}
          </div>

          {/* Editor Area with horizontal scroll */}
          <div className="flex-1 overflow-hidden bg-[#141414]">
            {activeFile && (
              <div className="h-full overflow-auto bg-[#141414]">
                <CodeMirror
                  value={activeFile.content || ''}
                  height="100%"
                  width="100%"
                  theme={oneDark}
                  extensions={[javascript({ jsx: true, typescript: true })]}
                  onChange={handleCodeChange}
                  className="min-w-full h-full [&_.cm-editor]:bg-[#141414] [&_.cm-scroller]:bg-[#141414]"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}