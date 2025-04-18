export interface FileItem {
    name: string;
    type: 'file' | 'folder';
    children?: FileItem[];
    content?: string;
  }
  
  export function mergeFiles(initialFiles: FileItem[], generatedFiles: FileItem[]): FileItem[] {
    const fileMap = new Map<string, FileItem>();
  
    // Add initial files to map
    for (const file of initialFiles) {
      fileMap.set(file.name, file);
    }
  
    for (const genFile of generatedFiles) {
      const existingFile = fileMap.get(genFile.name);
  
      if (!existingFile) {
        // If file/folder doesn't exist, just add it
        fileMap.set(genFile.name, genFile);
      } else if (genFile.type === 'file') {
        // If it's a file, update content
        fileMap.set(genFile.name, {
          ...existingFile,
          content: genFile.content,
        });
      } else if (genFile.type === 'folder') {
        // If it's a folder, recursively merge children
        const mergedChildren = mergeFiles(
          existingFile.children || [],
          genFile.children || []
        );
        fileMap.set(genFile.name, {
          ...existingFile,
          children: mergedChildren,
        });
      }
    }
  
    return Array.from(fileMap.values());
  }
  