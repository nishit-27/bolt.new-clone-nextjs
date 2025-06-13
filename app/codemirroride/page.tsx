"use client"


import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, File, Folder, X } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

import { vscodeDark } from '@uiw/codemirror-theme-vscode'

import { useContextProvider } from '@/components/ContextProvider';
import { nextBasePrompt, reactBasePrompt } from '@/utils/prompts';
import { parseBoltArtifactToFileItems } from '@/utils/parser';

import { mergeFiles } from '@/utils/merge';


import { useMergedContextProvider } from '@/components/mergedFileContextProvider';
import { EditorView } from '@codemirror/view';

// const customTheme = EditorView.theme({
//   '&': {
//     fontSize: '12px',
//   },
//   '&.cm-editor': {
//     height: '100%',
//     background: 'var(--cm-backgroundColor)',
//     color: 'var(--cm-textColor)',
//   },
//   '.cm-cursor': {
//     borderLeft: 'var(--cm-cursor-width) solid var(--cm-cursor-backgroundColor)',
//   },
//   '.cm-scroller': {
//     lineHeight: '1.5',
//     '&:focus-visible': {
//       outline: 'none',
//     },
//   },
//   '.cm-line': {
//     padding: '0 0 0 4px',
//   },
//   '&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground': {
//     backgroundColor: 'var(--cm-selection-backgroundColorFocused) !important',
//     opacity: 'var(--cm-selection-backgroundOpacityFocused, 0.3)',
//   },
//   '&:not(.cm-focused) > .cm-scroller > .cm-selectionLayer .cm-selectionBackground': {
//     backgroundColor: 'var(--cm-selection-backgroundColorBlured)',
//     opacity: 'var(--cm-selection-backgroundOpacityBlured, 0.3)',
//   },
//   '&.cm-focused > .cm-scroller .cm-matchingBracket': {
//     backgroundColor: 'var(--cm-matching-bracket)',
//   },
//   '.cm-activeLine': {
//     background: 'var(--cm-activeLineBackgroundColor)',
//   },
//   '.cm-gutters': {
//     background: 'var(--cm-gutter-backgroundColor)',
//     borderRight: 0,
//     color: 'var(--cm-gutter-textColor)',
//   },
//   '.cm-gutter': {
//     '&.cm-lineNumbers': {
//       fontFamily: 'Roboto Mono, monospace',
//       fontSize: '12px',
//       minWidth: '40px',
//     },
//     '& .cm-activeLineGutter': {
//       background: 'transparent',
//       color: 'var(--cm-gutter-activeLineTextColor)',
//     },
//     '&.cm-foldGutter .cm-gutterElement > .fold-icon': {
//       cursor: 'pointer',
//       color: 'var(--cm-foldGutter-textColor)',
//       transform: 'translateY(2px)',
//       '&:hover': {
//         color: 'var(--cm-foldGutter-textColorHover)',
//       },
//     },
//   },
//   '.cm-foldGutter .cm-gutterElement': {
//     padding: '0 4px',
//   },
//   '.cm-tooltip-autocomplete > ul > li': {
//     minHeight: '18px',
//   },
//   '.cm-panel.cm-search label': {
//     marginLeft: '2px',
//     fontSize: '12px',
//   },
//   '.cm-panel.cm-search .cm-button': {
//     fontSize: '12px',
//   },
//   '.cm-panel.cm-search .cm-textfield': {
//     fontSize: '12px',
//   },
//   '.cm-panel.cm-search input[type=checkbox]': {
//     position: 'relative',
//     transform: 'translateY(2px)',
//     marginRight: '4px',
//   },
//   '.cm-panels': {
//     borderColor: 'var(--cm-panels-borderColor)',
//   },
//   '.cm-panels-bottom': {
//     borderTop: '1px solid var(--cm-panels-borderColor)',
//     backgroundColor: 'transparent',
//   },
//   '.cm-panel.cm-search': {
//     background: 'var(--cm-search-backgroundColor)',
//     color: 'var(--cm-search-textColor)',
//     padding: '8px',
//   },
//   '.cm-search .cm-button': {
//     background: 'var(--cm-search-button-backgroundColor)',
//     borderColor: 'var(--cm-search-button-borderColor)',
//     color: 'var(--cm-search-button-textColor)',
//     borderRadius: '4px',
//     '&:hover': {
//       color: 'var(--cm-search-button-textColorHover)',
//     },
//     '&:focus-visible': {
//       outline: 'none',
//       borderColor: 'var(--cm-search-button-borderColorFocused)',
//     },
//     '&:hover:not(:focus-visible)': {
//       background: 'var(--cm-search-button-backgroundColorHover)',
//       borderColor: 'var(--cm-search-button-borderColorHover)',
//     },
//     '&:hover:focus-visible': {
//       background: 'var(--cm-search-button-backgroundColorHover)',
//       borderColor: 'var(--cm-search-button-borderColorFocused)',
//     },
//   },
//   '.cm-panel.cm-search [name=close]': {
//     top: '6px',
//     right: '6px',
//     padding: '0 6px',
//     fontSize: '1rem',
//     backgroundColor: 'var(--cm-search-closeButton-backgroundColor)',
//     color: 'var(--cm-search-closeButton-textColor)',
//     '&:hover': {
//       'border-radius': '6px',
//       color: 'var(--cm-search-closeButton-textColorHover)',
//       backgroundColor: 'var(--cm-search-closeButton-backgroundColorHover)',
//     },
//   },
//   '.cm-search input': {
//     background: 'var(--cm-search-input-backgroundColor)',
//     borderColor: 'var(--cm-search-input-borderColor)',
//     color: 'var(--cm-search-input-textColor)',
//     outline: 'none',
//     borderRadius: '4px',
//     '&:focus-visible': {
//       borderColor: 'var(--cm-search-input-borderColorFocused)',
//     },
//   },
//   '.cm-tooltip': {
//     background: 'var(--cm-tooltip-backgroundColor)',
//     border: '1px solid transparent',
//     borderColor: 'var(--cm-tooltip-borderColor)',
//     color: 'var(--cm-tooltip-textColor)',
//   },
//   '.cm-tooltip.cm-tooltip-autocomplete ul li[aria-selected]': {
//     background: 'var(--cm-tooltip-backgroundColorSelected)',
//     color: 'var(--cm-tooltip-textColorSelected)',
//   },
//   '.cm-searchMatch': {
//     backgroundColor: 'var(--cm-searchMatch-backgroundColor)',
//   },
//   '.cm-tooltip.cm-readonly-tooltip': {
//     padding: '4px',
//     whiteSpace: 'nowrap',
//     backgroundColor: 'var(--bolt-elements-bg-depth-2)',
//     borderColor: 'var(--bolt-elements-borderColorActive)',
//     '& .cm-tooltip-arrow:before': {
//       borderTopColor: 'var(--bolt-elements-borderColorActive)',
//     },
//     '& .cm-tooltip-arrow:after': {
//       borderTopColor: 'transparent',
//     },
//   },
// });
const getFontSizeTheme = (size: number) =>
  EditorView.theme({
    '.cm-scroller': {
      fontSize: `${size}px`,
    },
  });
export interface FileItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  content?: string;
}

// Helper to recursively update file content in the FileItem structure
const updateFileContentRecursive = (files: FileItem[], fileName: string, newContent: string): FileItem[] => {
  return files.map(file => {
    if (file.type === 'file' && file.name === fileName) {
      return { ...file, content: newContent };
    } else if (file.type === 'folder' && file.children) {
      const updatedChildren = updateFileContentRecursive(file.children, fileName, newContent);
      // Only return a new folder object if its children actually changed
      if (updatedChildren !== file.children) {
        return { ...file, children: updatedChildren };
      }
    }
    return file;
  });
};

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
  const [hasInitialized, setHasInitialized] = useState(false);
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
  
  // First useEffect - runs only once for initialization
  useEffect(() => {
    if (!hasInitialized && templeteName && finalFiles && finalFiles.length > 0) {
      const initialFiles = parseBoltArtifactToFileItems(templeteName === "React" ? reactBasePrompt : nextBasePrompt)
      const mergedFiles = mergeFiles(initialFiles, finalFiles)
      setMergedFiles(mergedFiles)
      setSampleFiles(mergedFiles)
      setHasInitialized(true)
      console.log("first useEffect called")
    }
  }, []) // Empty dependency array ensures it runs only once

  // Second useEffect - runs whenever mergedFiles changes
  useEffect(() => {
    if (mergedFiles && mergedFiles.length > 0) {
      setSampleFiles(mergedFiles)
      console.log("second useEffect called")
    }
  }, [mergedFiles]) // This will run every time mergedFiles changes

  function updateMergedFileOnChangeOfSampleFile(){
    setMergedFiles(sampleFiles)
    console.log("save function called")
    setIsChangeInCode(false)
  }

  const [openFiles, setOpenFiles] = useState<FileItem[]>(() => {
    const initialFile = findFileByName(filesOnly, 'package.json');
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
const [isChangeInCode,setIsChangeInCode] = useState<boolean>(false)
  const handleCodeChange = (value: string) => {
    const updatedFile = { ...activeFile, content: value };
    setActiveFile(updatedFile);
    setOpenFiles(openFiles.map(f => f.name === updatedFile.name ? updatedFile : f));


    // Update the sampleFiles as well, ensuring the latest changes are persisted
    setSampleFiles(prevSampleFiles => updateFileContentRecursive(prevSampleFiles, updatedFile.name, value));
    setIsChangeInCode(true)
  };

  return (
    <div className="h-[calc(100vh-12rem)] w-full max-w-[1200px] mx-auto rounded-lg overflow-hidden border border-[#30363d] bg-[#141414]">
      {/* Top Bar */}
      {/* <div className="h-10 bg-[#141414] border-b border-[#30363d] flex items-center px-4">
        <div className="flex space-x-2">
          <button className="text-[13px] px-3 py-1 rounded text-white hover:bg-[#1e1e1e]">Code</button>
          <button className="text-[13px] px-3 py-1 rounded text-[#8b8b8b] hover:bg-[#1e1e1e]">Preview</button>
        </div>
      </div> */}
      {/* <button className={`${isChangeInCode ? "block" : "hidden"} border`} onClick={updateMergedFileOnChangeOfSampleFile}> Save </button> */}
      <div className="flex h-[calc(100%-2.5rem)]">
        {/* Sidebar - Fixed width */}
        <div className="w-[200px] min-w-[200px] max-w-[200px] bg-[#141414] border-r border-[#30363d] flex flex-col">
          <div className='flex justify-between'>
            <div className="p-2 text-[11px] font-medium text-[#8b8b8b] uppercase tracking-wide">Files</div>
            <button className={`${isChangeInCode ? "block" : "hidden"} border rounded-4xl p-2 text-[11px] font-medium text-[#8b8b8b] uppercase tracking-wide`} onClick={updateMergedFileOnChangeOfSampleFile}> Apply Changes </button>
          </div>
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
                  // theme={oneDark}
                 theme={vscodeDark}
                  basicSetup={{
                    lineNumbers: true,
                    foldGutter: true,
                  }}
                  extensions={[javascript({ jsx: true, typescript: true }),getFontSizeTheme(12)]}
                  onChange={handleCodeChange}
                  // className="min-w-full h-full [&_.cm-editor]:bg-[#141414] [&_.cm-scroller]:bg-[#141414] [&_.cm-gutters]:bg-transparent [&_.cm-gutters]:border-0.3 [&_.cm-gutter]:!text-[#8b8b8b] [&_.cm-gutterElement]:bg-transparent"

                 
                
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}