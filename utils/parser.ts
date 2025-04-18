interface FileItem {
  name: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  content?: string;
}

export function parseBoltArtifactToFileItems(input: string): FileItem[] {
  const root: Map<string, FileItem> = new Map();

  function ensurePath(pathParts: string[], content?: string): void {
    let currentLevel = root;
    let parent: FileItem | undefined;

    pathParts.forEach((part, index) => {
      const isFile = index === pathParts.length - 1;
      let node: FileItem | undefined = currentLevel.get(part);

      if (!node) {
        node = {
          name: part,
          type: isFile ? 'file' : 'folder',
          ...(isFile && content !== undefined ? { content } : {}),
          ...(isFile ? {} : { children: [] }),
        };
        currentLevel.set(part, node);

        if (parent && parent.children) {
          parent.children.push(node);
        }
      }

      if (!isFile) {
        parent = node;
        const childMap = new Map<string, FileItem>();
        node.children!.forEach(child => childMap.set(child.name, child));
        currentLevel = childMap;
      }
    });
  }

  // Use regex instead of DOMParser to preserve JSX and other angle-bracket syntax
  const boltFileRegex = /<boltAction\s+type="file"\s+filePath="([^"]+)">([\s\S]*?)<\/boltAction>/g;
  let match: RegExpExecArray | null;

  while ((match = boltFileRegex.exec(input)) !== null) {
    const filePath = match[1];
    const content = match[2].trim();
    const pathParts = filePath.split('/');
    ensurePath(pathParts, content);
  }

  return Array.from(root.values());
}
