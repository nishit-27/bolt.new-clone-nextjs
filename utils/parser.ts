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

export function extractSummaryFromLLMResponse(input: string): string {
  // Remove all <boltArtifact>...</boltArtifact>, <boltAction>...</boltAction>, and code blocks
  let cleaned = input
    .replace(/<boltArtifact[\s\S]*?<\/boltArtifact>/g, '')
    .replace(/<boltAction[\s\S]*?<\/boltAction>/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .trim();

  if (cleaned) return cleaned;

  // If not, try to find any text outside artifacts/code blocks
  const parts = input.split(/<boltArtifact[\s\S]*?<\/boltArtifact>|<boltAction[\s\S]*?<\/boltAction>|```[\s\S]*?```/g);
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed) return trimmed;
  }

  return '';
}
