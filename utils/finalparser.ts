export interface FileItem {
    name: string;
    type: 'file' | 'folder';
    children?: FileItem[];
    content?: string;
  }
  
  export type FileSystemFormat = {
    [key: string]: 
      | { file: { contents: string } }
      | { directory: FileSystemFormat };
  };
  
  export function convertToFileSystemStructure(files: FileItem[]): FileSystemFormat {
    const result: FileSystemFormat = {};
  
    for (const item of files) {
      if (item.type === 'file') {
        result[item.name] = {
          file: {
            contents: item.content || '',
          },
        };
      } else if (item.type === 'folder') {
        result[item.name] = {
          directory: convertToFileSystemStructure(item.children || []),
        };
      }
    }
  
    return result;
  }
  