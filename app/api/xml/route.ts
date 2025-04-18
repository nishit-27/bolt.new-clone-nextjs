import { FileItem } from "@/app/codemirroride/page";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest, res: NextResponse) {
    const {chatResponse} = await req.json();
    const stringData = JSON.stringify(chatResponse)
    console.log(stringData)
//     const llmResponse = `<boltArtifact id="todo-app" title="Beautiful Todo App">
//   <boltAction type="file" filePath="package.json">
//     {
//       "name": "vite-react-typescript-starter",
//       "private": true,
//       "version": "0.0.0",
//       "type": "module",
//       "scripts": {
//         "dev": "vite",
//         "build": "vite build",
//         "lint": "eslint .",
//         "preview": "vite preview"
//       },
//       "dependencies": {
//         "lucide-react": "^0.344.0",
//         "react": "^18.3.1",
//         "react-dom": "^18.3.1"
//       },
//       "devDependencies": {
//         "@eslint/js": "^9.9.1",
//         "@types/react": "^18.3.5",
//         "@types/react-dom": "^18.3.0",
//         "@vitejs/plugin-react": "^4.3.1",
//         "autoprefixer": "^10.4.18",
//         "eslint": "^9.9.1",
//         "eslint-plugin-react-hooks": "^5.1.0-rc.0",
//         "eslint-plugin-react-refresh": "^0.4.11",
//         "globals": "^15.9.0",
//         "postcss": "^8.4.35",
//         "tailwindcss": "^3.4.1",
//         "typescript": "^5.5.3",
//         "typescript-eslint": "^8.3.0",
//         "vite": "^5.4.2"
//       }
//     }
//   </boltAction>
//   <boltAction type="file" filePath="index.html">
//     <!doctype html>
//     <html lang="en">
//       <head>
//         <meta charset="UTF-8" />
//         <link rel="icon" type="image/svg+xml" href="/vite.svg" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <title>Todo App</title>
//       </head>
//       <body class="bg-gray-100">
//         <div id="root"></div>
//         <script type="module" src="/src/main.tsx"></script>
//       </body>
//     </html>
//   </boltAction>
//   <boltAction type="file" filePath="src/App.tsx">
//     import React, { useState, useEffect } from 'react';
//     import { CheckCircle, Circle, Plus, Trash2 } from 'lucide-react';

//     interface Todo {
//       id: string;
//       text: string;
//       completed: boolean;
//     }

//     function App() {
//       const [todos, setTodos] = useState<Todo[]>(() => {
//         const storedTodos = localStorage.getItem('todos');
//         return storedTodos ? JSON.parse(storedTodos) : [];
//       });
//       const [newTodo, setNewTodo] = useState('');

//       useEffect(() => {
//         localStorage.setItem('todos', JSON.stringify(todos));
//       }, [todos]);

//       const handleAddTodo = () => {
//         if (newTodo.trim()) {
//           setTodos([...todos, { id: crypto.randomUUID(), text: newTodo, completed: false }]);
//           setNewTodo('');
//         }
//       };

//       const handleCompleteTodo = (id: string) => {
//         setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
//       };

//       const handleDeleteTodo = (id: string) => {
//         setTodos(todos.filter(todo => todo.id !== id));
//       };

//       return (
//         <div className="container mx-auto p-4 max-w-2xl">
//           <header className="flex items-center justify-between mb-6">
//             <h1 className="text-3xl font-semibold text-gray-800">My Todos</h1>
//             <img
//               src="https://images.unsplash.com/photo-1661956602153-2338e541b2b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
//               alt="Abstract background"
//               className="w-12 h-12 rounded-full object-cover"
//             />
//           </header>

//           <div className="flex items-center mb-4">
//             <input
//               type="text"
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               placeholder="Add a new todo"
//               value={newTodo}
//               onChange={e => setNewTodo(e.target.value)}
//             />
//             <button
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2 focus:outline-none focus:shadow-outline"
//               onClick={handleAddTodo}
//             >
//               <Plus className="h-5 w-5" />
//             </button>
//           </div>

//           <ul>
//             {todos.map(todo => (
//               <li
//                 key={todo.id}
//                 className="flex items-center justify-between mb-2 p-3 rounded shadow-sm bg-white"
//               >
//                 <div className="flex items-center">
//                   <button onClick={() => handleCompleteTodo(todo.id)} className="mr-3">
//                     {todo.completed ? (
//                       <CheckCircle className="h-6 w-6 text-green-500" />
//                     ) : (
//                       <Circle className="h-6 w-6 text-gray-400" />
//                     )}
//                   </button>
//                   <span className={todo.completed ? 'line-through text-gray-500' : 'text-gray-700'}>
//                     {todo.text}
//                   </span>
//                 </div>
//                 <button onClick={() => handleDeleteTodo(todo.id)} className="text-red-500 hover:text-red-700">
//                   <Trash2 className="h-5 w-5" />
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       );
//     }

//     export default App;
//   </boltAction>
//   <boltAction type="file" filePath="src/index.css">
//     @tailwind base;
//     @tailwind components;
//     @tailwind utilities;
//   </boltAction>
//   <boltAction type="file" filePath="src/main.tsx">
//     import React from 'react';
//     import ReactDOM from 'react-dom/client';
//     import App from './App';
//     import './index.css';

//     ReactDOM.createRoot(document.getElementById('root')!).render(
//       <React.StrictMode>
//         <App />
//       </React.StrictMode>
//     );
//   </boltAction>
//   <boltAction type="file" filePath="vite.config.ts">
//     import { defineConfig } from 'vite';
//     import react from '@vitejs/plugin-react';

//     // https://vitejs.dev/config/
//     export default defineConfig({
//       plugins: [react()],
//     });
//   </boltAction>
//   <boltAction type="shell">npm install && npm run dev</boltAction>
// </boltArtifact>`
    function parseTextToFileStructure(inputText: string): FileItem[] {
        const result: FileItem[] = [];
        const folderMap: { [path: string]: FileItem } = {};
        
        // Match all boltAction file elements
        const fileRegex = /<boltAction type="file" filePath="([^"]+)">([\s\S]*?)<\/boltAction>/g;
        let match;
        
        while ((match = fileRegex.exec(inputText)) !== null) {
          const filePath = match[1];
          const fileContent = match[2].trim();
          
          // Split the path into parts
          const pathParts = filePath.split('/');
          const fileName = pathParts.pop() || '';
          
          // Create file item
          const fileItem: FileItem = {
            name: fileName,
            type: 'file',
            content: fileContent
          };
          
          if (pathParts.length === 0) {
            // Root level file
            result.push(fileItem);
          } else {
            // Create folder structure if needed
            let currentPath = '';
            let parentFolder: FileItem | null = null;
            
            for (const part of pathParts) {
              const prevPath = currentPath;
              currentPath = currentPath ? `${currentPath}/${part}` : part;
              
              if (!folderMap[currentPath]) {
                // Create new folder
                const folder: FileItem = {
                  name: part,
                  type: 'folder',
                  children: []
                };
                
                folderMap[currentPath] = folder;
                
                if (!prevPath) {
                  // Root level folder
                  result.push(folder);
                } else if (folderMap[prevPath]) {
                  // Add to parent folder
                  folderMap[prevPath].children = folderMap[prevPath].children || [];
                  folderMap[prevPath].children.push(folder);
                }
              }
              
              parentFolder = folderMap[currentPath];
            }
            
            // Add file to parent folder
            if (parentFolder) {
              parentFolder.children = parentFolder.children || [];
              parentFolder.children.push(fileItem);
            }
          }
        }
        console.log("we did it")
        return result;
      }
      const convertedData = parseTextToFileStructure(stringData)
      console.log(JSON.stringify(convertedData))
    return NextResponse.json({message: "converted", convertedData})
}