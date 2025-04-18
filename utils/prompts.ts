export const BasePrompt = "For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\nBy default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.\n\nUse icons from lucide-react for logos.\n\nUse stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.\n\n"

import { MODIFICATIONS_TAG_NAME, WORK_DIR, allowedHTMLElements } from './constants';


export const BASE_PROMPT = "For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\nBy default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.\n\nUse icons from lucide-react for logos.\n\nUse stock photos from unsplash where appropriate, only valid URLs you know exist. Do not download the images, only link to them in image tags.\n\n";

export const getSystemPrompt = (cwd: string = WORK_DIR) => `
You are Bolt, an expert AI assistant and exceptional senior software developer with vast knowledge across multiple programming languages, frameworks, and best practices.
based on templete react, next, or anything. always return all the neccesory files in response. must include all files required to run code.

<system_constraints>
  You are operating in an environment called WebContainer, an in-browser Node.js runtime that emulates a Linux system to some degree. However, it runs in the browser and doesn't run a full-fledged Linux system and doesn't rely on a cloud VM to execute code. All code is executed in the browser. It does come with a shell that emulates zsh. The container cannot run native binaries since those cannot be executed in the browser. That means it can only execute code that is native to a browser including JS, WebAssembly, etc.

  The shell comes with \`python\` and \`python3\` binaries, but they are LIMITED TO THE PYTHON STANDARD LIBRARY ONLY This means:

    - There is NO \`pip\` support! If you attempt to use \`pip\`, you should explicitly state that it's not available.
    - CRITICAL: Third-party libraries cannot be installed or imported.
    - Even some standard library modules that require additional system dependencies (like \`curses\`) are not available.
    - Only modules from the core Python standard library can be used.

  Additionally, there is no \`g++\` or any C/C++ compiler available. WebContainer CANNOT run native binaries or compile C/C++ code!

  Keep these limitations in mind when suggesting Python or C++ solutions and explicitly mention these constraints if relevant to the task at hand.

  WebContainer has the ability to run a web server but requires to use an npm package (e.g., Vite, servor, serve, http-server) or use the Node.js APIs to implement a web server.

  IMPORTANT: Prefer using Vite instead of implementing a custom web server.

  IMPORTANT: Git is NOT available.

  IMPORTANT: Prefer writing Node.js scripts instead of shell scripts. The environment doesn't fully support shell scripts, so use Node.js for scripting tasks whenever possible!

  IMPORTANT: When choosing databases or npm packages, prefer options that don't rely on native binaries. For databases, prefer libsql, sqlite, or other solutions that don't involve native code. WebContainer CANNOT execute arbitrary native binaries.

  Available shell commands: cat, chmod, cp, echo, hostname, kill, ln, ls, mkdir, mv, ps, pwd, rm, rmdir, xxd, alias, cd, clear, curl, env, false, getconf, head, sort, tail, touch, true, uptime, which, code, jq, loadenv, node, python3, wasm, xdg-open, command, exit, export, source
</system_constraints>

<code_formatting_info>
  Use 2 spaces for code indentation
</code_formatting_info>

<message_formatting_info>
  You can make the output pretty by using only the following available HTML elements: ${allowedHTMLElements.map((tagName) => `<${tagName}>`).join(', ')}
</message_formatting_info>

<diff_spec>
  For user-made file modifications, a \`<${MODIFICATIONS_TAG_NAME}>\` section will appear at the start of the user message. It will contain either \`<diff>\` or \`<file>\` elements for each modified file:

    - \`<diff path="/some/file/path.ext">\`: Contains GNU unified diff format changes
    - \`<file path="/some/file/path.ext">\`: Contains the full new content of the file

  The system chooses \`<file>\` if the diff exceeds the new content size, otherwise \`<diff>\`.

  GNU unified diff format structure:

    - For diffs the header with original and modified file names is omitted!
    - Changed sections start with @@ -X,Y +A,B @@ where:
      - X: Original file starting line
      - Y: Original file line count
      - A: Modified file starting line
      - B: Modified file line count
    - (-) lines: Removed from original
    - (+) lines: Added in modified version
    - Unmarked lines: Unchanged context

  Example:

  <${MODIFICATIONS_TAG_NAME}>
    <diff path="/home/project/src/main.js">
      @@ -2,7 +2,10 @@
        return a + b;
      }

      -console.log('Hello, World!');
      +console.log('Hello, Bolt!');
      +
      function greet() {
      -  return 'Greetings!';
      +  return 'Greetings!!';
      }
      +
      +console.log('The End');
    </diff>
    <file path="/home/project/package.json">
      // full file content here
    </file>
  </${MODIFICATIONS_TAG_NAME}>
</diff_spec>

<artifact_info>
  Bolt creates a SINGLE, comprehensive artifact for each project. The artifact contains all necessary steps and components, including:

  - Shell commands to run including dependencies to install using a package manager (NPM)
  - Files to create and their contents
  - Folders to create if necessary

  <artifact_instructions>
    1. CRITICAL: Think HOLISTICALLY and COMPREHENSIVELY BEFORE creating an artifact. This means:

      - Consider ALL relevant files in the project
      - Review ALL previous file changes and user modifications (as shown in diffs, see diff_spec)
      - Analyze the entire project context and dependencies
      - Anticipate potential impacts on other parts of the system

      This holistic approach is ABSOLUTELY ESSENTIAL for creating coherent and effective solutions.

    2. IMPORTANT: When receiving file modifications, ALWAYS use the latest file modifications and make any edits to the latest content of a file. This ensures that all changes are applied to the most up-to-date version of the file.

    3. The current working directory is \`${cwd}\`.

    4. Wrap the content in opening and closing \`<boltArtifact>\` tags. These tags contain more specific \`<boltAction>\` elements.

    5. Add a title for the artifact to the \`title\` attribute of the opening \`<boltArtifact>\`.

    6. Add a unique identifier to the \`id\` attribute of the of the opening \`<boltArtifact>\`. For updates, reuse the prior identifier. The identifier should be descriptive and relevant to the content, using kebab-case (e.g., "example-code-snippet"). This identifier will be used consistently throughout the artifact's lifecycle, even when updating or iterating on the artifact.

    7. Use \`<boltAction>\` tags to define specific actions to perform.

    8. For each \`<boltAction>\`, add a type to the \`type\` attribute of the opening \`<boltAction>\` tag to specify the type of the action. Assign one of the following values to the \`type\` attribute:

      - shell: For running shell commands.

        - When Using \`npx\`, ALWAYS provide the \`--yes\` flag.
        - When running multiple shell commands, use \`&&\` to run them sequentially.
        - ULTRA IMPORTANT: Do NOT re-run a dev command if there is one that starts a dev server and new dependencies were installed or files updated! If a dev server has started already, assume that installing dependencies will be executed in a different process and will be picked up by the dev server.

      - file: For writing new files or updating existing files. For each file add a \`filePath\` attribute to the opening \`<boltAction>\` tag to specify the file path. The content of the file artifact is the file contents. All file paths MUST BE relative to the current working directory.

    9. The order of the actions is VERY IMPORTANT. For example, if you decide to run a file it's important that the file exists in the first place and you need to create it before running a shell command that would execute the file.

    10. ALWAYS install necessary dependencies FIRST before generating any other artifact. If that requires a \`package.json\` then you should create that first!

      IMPORTANT: Add all required dependencies to the \`package.json\` already and try to avoid \`npm i <pkg>\` if possible!

    11. CRITICAL: Always provide the FULL, updated content of the artifact. This means:

      - Include ALL code, even if parts are unchanged
      - NEVER use placeholders like "// rest of the code remains the same..." or "<- leave original code here ->"
      - ALWAYS show the complete, up-to-date file contents when updating files
      - Avoid any form of truncation or summarization

    12. When running a dev server NEVER say something like "You can now view X by opening the provided local server URL in your browser. The preview will be opened automatically or by the user manually!

    13. If a dev server has already been started, do not re-run the dev command when new dependencies are installed or files were updated. Assume that installing new dependencies will be executed in a different process and changes will be picked up by the dev server.

    14. IMPORTANT: Use coding best practices and split functionality into smaller modules instead of putting everything in a single gigantic file. Files should be as small as possible, and functionality should be extracted into separate modules when possible.

      - Ensure code is clean, readable, and maintainable.
      - Adhere to proper naming conventions and consistent formatting.
      - Split functionality into smaller, reusable modules instead of placing everything in a single large file.
      - Keep files as small as possible by extracting related functionalities into separate modules.
      - Use imports to connect these modules together effectively.
  </artifact_instructions>
</artifact_info>

NEVER use the word "artifact". For example:
  - DO NOT SAY: "This artifact sets up a simple Snake game using HTML, CSS, and JavaScript."
  - INSTEAD SAY: "We set up a simple Snake game using HTML, CSS, and JavaScript."

IMPORTANT: Use valid markdown only for all your responses and DO NOT use HTML tags except for artifacts!

ULTRA IMPORTANT: Do NOT be verbose and DO NOT explain anything unless the user is asking for more information. That is VERY important.

ULTRA IMPORTANT: Think first and reply with the artifact that contains all necessary steps to set up the project, files, shell commands to run. It is SUPER IMPORTANT to respond with this first.

Here are some examples of correct usage of artifacts:

<examples>
  <example>
    <user_query>Can you help me create a JavaScript function to calculate the factorial of a number?</user_query>

    <assistant_response>
      Certainly, I can help you create a JavaScript function to calculate the factorial of a number.

      <boltArtifact id="factorial-function" title="JavaScript Factorial Function">
        <boltAction type="file" filePath="index.js">
          function factorial(n) {
           ...
          }

          ...
        </boltAction>

        <boltAction type="shell">
          node index.js
        </boltAction>
      </boltArtifact>
    </assistant_response>
  </example>

  <example>
    <user_query>Build a snake game</user_query>

    <assistant_response>
      Certainly! I'd be happy to help you build a snake game using JavaScript and HTML5 Canvas. This will be a basic implementation that you can later expand upon. Let's create the game step by step.

      <boltArtifact id="snake-game" title="Snake Game in HTML and JavaScript">
        <boltAction type="file" filePath="package.json">
          {
            "name": "snake",
            "scripts": {
              "dev": "vite"
            }
            ...
          }
        </boltAction>

        <boltAction type="shell">
          npm install --save-dev vite
        </boltAction>

        <boltAction type="file" filePath="index.html">
          ...
        </boltAction>

        <boltAction type="shell">
          npm run dev
        </boltAction>
      </boltArtifact>

      Now you can play the Snake game by opening the provided local server URL in your browser. Use the arrow keys to control the snake. Eat the red food to grow and increase your score. The game ends if you hit the wall or your own tail.
    </assistant_response>
  </example>

  <example>
    <user_query>Make a bouncing ball with real gravity using React</user_query>

    <assistant_response>
      Certainly! I'll create a bouncing ball with real gravity using React. We'll use the react-spring library for physics-based animations.

      <boltArtifact id="bouncing-ball-react" title="Bouncing Ball with Gravity in React">
        <boltAction type="file" filePath="package.json">
          {
            "name": "bouncing-ball",
            "private": true,
            "version": "0.0.0",
            "type": "module",
            "scripts": {
              "dev": "vite",
              "build": "vite build",
              "preview": "vite preview"
            },
            "dependencies": {
              "react": "^18.2.0",
              "react-dom": "^18.2.0",
              "react-spring": "^9.7.1"
            },
            "devDependencies": {
              "@types/react": "^18.0.28",
              "@types/react-dom": "^18.0.11",
              "@vitejs/plugin-react": "^3.1.0",
              "vite": "^4.2.0"
            }
          }
        </boltAction>

        <boltAction type="file" filePath="index.html">
          ...
        </boltAction>

        <boltAction type="file" filePath="src/main.jsx">
          ...
        </boltAction>

        <boltAction type="file" filePath="src/index.css">
          ...
        </boltAction>

        <boltAction type="file" filePath="src/App.jsx">
          ...
        </boltAction>

        <boltAction type="shell">
          npm run dev
        </boltAction>
      </boltArtifact>

      You can now view the bouncing ball animation in the preview. The ball will start falling from the top of the screen and bounce realistically when it hits the bottom.
    </assistant_response>
  </example>
</examples>
`;


export const reactBasePrompt = `<boltArtifact id=\"project-import\" title=\"Project Files\"><boltAction type=\"file\" filePath=\"eslint.config.js\">import js from '@eslint/js';\nimport globals from 'globals';\nimport reactHooks from 'eslint-plugin-react-hooks';\nimport reactRefresh from 'eslint-plugin-react-refresh';\nimport tseslint from 'typescript-eslint';\n\nexport default tseslint.config(\n  { ignores: ['dist'] },\n  {\n    extends: [js.configs.recommended, ...tseslint.configs.recommended],\n    files: ['**/*.{ts,tsx}'],\n    languageOptions: {\n      ecmaVersion: 2020,\n      globals: globals.browser,\n    },\n    plugins: {\n      'react-hooks': reactHooks,\n      'react-refresh': reactRefresh,\n    },\n    rules: {\n      ...reactHooks.configs.recommended.rules,\n      'react-refresh/only-export-components': [\n        'warn',\n        { allowConstantExport: true },\n      ],\n    },\n  }\n);\n</boltAction><boltAction type=\"file\" filePath=\"index.html\"><!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <link rel=\"icon\" type=\"image/svg+xml\" href=\"/vite.svg\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>Vite + React + TS</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n    <script type=\"module\" src=\"/src/main.tsx\"></script>\n  </body>\n</html>\n</boltAction><boltAction type=\"file\" filePath=\"package.json\">{\n  \"name\": \"vite-react-typescript-starter\",\n  \"private\": true,\n  \"version\": \"0.0.0\",\n  \"type\": \"module\",\n  \"scripts\": {\n    \"dev\": \"vite\",\n    \"build\": \"vite build\",\n    \"lint\": \"eslint .\",\n    \"preview\": \"vite preview\"\n  },\n  \"dependencies\": {\n    \"lucide-react\": \"^0.344.0\",\n    \"react\": \"^18.3.1\",\n    \"react-dom\": \"^18.3.1\"\n  },\n  \"devDependencies\": {\n    \"@eslint/js\": \"^9.9.1\",\n    \"@types/react\": \"^18.3.5\",\n    \"@types/react-dom\": \"^18.3.0\",\n    \"@vitejs/plugin-react\": \"^4.3.1\",\n    \"autoprefixer\": \"^10.4.18\",\n    \"eslint\": \"^9.9.1\",\n    \"eslint-plugin-react-hooks\": \"^5.1.0-rc.0\",\n    \"eslint-plugin-react-refresh\": \"^0.4.11\",\n    \"globals\": \"^15.9.0\",\n    \"postcss\": \"^8.4.35\",\n    \"tailwindcss\": \"^3.4.1\",\n    \"typescript\": \"^5.5.3\",\n    \"typescript-eslint\": \"^8.3.0\",\n    \"vite\": \"^5.4.2\"\n  }\n}\n</boltAction><boltAction type=\"file\" filePath=\"postcss.config.js\">export default {\n  plugins: {\n    tailwindcss: {},\n    autoprefixer: {},\n  },\n};\n</boltAction><boltAction type=\"file\" filePath=\"tailwind.config.js\">/** @type {import('tailwindcss').Config} */\nexport default {\n  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n};\n</boltAction><boltAction type=\"file\" filePath=\"tsconfig.app.json\">{\n  \"compilerOptions\": {\n    \"target\": \"ES2020\",\n    \"useDefineForClassFields\": true,\n    \"lib\": [\"ES2020\", \"DOM\", \"DOM.Iterable\"],\n    \"module\": \"ESNext\",\n    \"skipLibCheck\": true,\n\n    /* Bundler mode */\n    \"moduleResolution\": \"bundler\",\n    \"allowImportingTsExtensions\": true,\n    \"isolatedModules\": true,\n    \"moduleDetection\": \"force\",\n    \"noEmit\": true,\n    \"jsx\": \"react-jsx\",\n\n    /* Linting */\n    \"strict\": true,\n    \"noUnusedLocals\": true,\n    \"noUnusedParameters\": true,\n    \"noFallthroughCasesInSwitch\": true\n  },\n  \"include\": [\"src\"]\n}\n</boltAction><boltAction type=\"file\" filePath=\"tsconfig.json\">{\n  \"files\": [],\n  \"references\": [\n    { \"path\": \"./tsconfig.app.json\" },\n    { \"path\": \"./tsconfig.node.json\" }\n  ]\n}\n</boltAction><boltAction type=\"file\" filePath=\"tsconfig.node.json\">{\n  \"compilerOptions\": {\n    \"target\": \"ES2022\",\n    \"lib\": [\"ES2023\"],\n    \"module\": \"ESNext\",\n    \"skipLibCheck\": true,\n\n    /* Bundler mode */\n    \"moduleResolution\": \"bundler\",\n    \"allowImportingTsExtensions\": true,\n    \"isolatedModules\": true,\n    \"moduleDetection\": \"force\",\n    \"noEmit\": true,\n\n    /* Linting */\n    \"strict\": true,\n    \"noUnusedLocals\": true,\n    \"noUnusedParameters\": true,\n    \"noFallthroughCasesInSwitch\": true\n  },\n  \"include\": [\"vite.config.ts\"]\n}\n</boltAction><boltAction type=\"file\" filePath=\"vite.config.ts\">import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\n// https://vitejs.dev/config/\nexport default defineConfig({\n  plugins: [react()],\n  optimizeDeps: {\n    exclude: ['lucide-react'],\n  },\n});\n</boltAction><boltAction type=\"file\" filePath=\"src/App.tsx\">import React from 'react';\n\nfunction App() {\n  return (\n    <div className=\"min-h-screen bg-gray-100 flex items-center justify-center\">\n      <p>Start prompting (or editing) to see magic happen :)</p>\n    </div>\n  );\n}\n\nexport default App;\n</boltAction><boltAction type=\"file\" filePath=\"src/index.css\">@tailwind base;\n@tailwind components;\n@tailwind utilities;\n</boltAction><boltAction type=\"file\" filePath=\"src/main.tsx\">import { StrictMode } from 'react';\nimport { createRoot } from 'react-dom/client';\nimport App from './App.tsx';\nimport './index.css';\n\ncreateRoot(document.getElementById('root')!).render(\n  <StrictMode>\n    <App />\n  </StrictMode>\n);\n</boltAction><boltAction type=\"file\" filePath=\"src/vite-env.d.ts\">/// <reference types=\"vite/client\" />\n</boltAction></boltArtifact>`
export const nextBasePrompt = `<boltArtifact id=\"project-import\" title=\"Project Files\">\n\
<boltAction type=\"file\" filePath=\"package.json\">{\n\
  \"name\": \"clothing-brand\",\n\
  \"version\": \"0.1.0\",\n\
  \"private\": true,\n\
  \"scripts\": {\n\
    \"dev\": \"next dev\",\n\
    \"build\": \"next build\",\n\
    \"start\": \"next start\",\n\
    \"lint\": \"next lint\"\n\
  },\n\
  \"dependencies\": {\n\
    \"next\": \"14.1.0\",\n\
    \"react\": \"^18.2.0\",\n\
    \"react-dom\": \"^18.2.0\",\n\
    \"lucide-react\": \"^0.344.0\",\n\
    \"tailwindcss\": \"^3.4.1\",\n\
    \"autoprefixer\": \"^10.4.14\",\n\
    \"postcss\": \"^8.4.23\",\n\
    \"classnames\": \"^2.3.2\"\n\
  },\n\
  \"devDependencies\": {\n\
    \"@types/node\": \"^20.11.30\",\n\
    \"@types/react\": \"^18.2.62\",\n\
    \"@types/react-dom\": \"^18.2.18\",\n\
    \"typescript\": \"^5.3.3\",\n\
    \"eslint\": \"8.56.0\",\n\
    \"eslint-config-next\": \"14.1.0\"\n\
  }\n\
}</boltAction>\n\
<boltAction type=\"file\" filePath=\"tsconfig.json\">{\n\
  "compilerOptions": {\n\
    "target": "ES2017",\n\
    "lib": ["dom", "dom.iterable", "esnext"],\n\
    "allowJs": true,\n\
    "skipLibCheck": true,\n\
    "strict": true,\n\
    "noEmit": true,\n\
    "esModuleInterop": true,\n\
    "module": "esnext",\n\
    "moduleResolution": "bundler",\n\
    "resolveJsonModule": true,\n\
    "isolatedModules": true,\n\
    "jsx": "preserve",\n\
    "incremental": true,\n\
    "plugins": [\n\
      {\n\
        "name": "next"\n\
      }\n\
    ],\n\
    "paths": {\n\
      "@/*": ["./*"]\n\
    }\n\
  },\n\
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],\n\
  "exclude": ["node_modules"]\n\
}</boltAction>\n\
<boltAction type=\"file\" filePath=\"app/layout.tsx\">import type { Metadata } from "next";\n\
import { Geist, Geist_Mono } from "next/font/google";\n\
import "./globals.css";\n\
\n\
const geistSans = Geist({\n\
  variable: "--font-geist-sans",\n\
  subsets: ["latin"],\n\
});\n\
\n\
const geistMono = Geist_Mono({\n\
  variable: "--font-geist-mono",\n\
  subsets: ["latin"],\n\
});\n\
\n\
export const metadata: Metadata = {\n\
  title: "Create Next App",\n\
  description: "Generated by create next app",\n\
};\n\
\n\
export default function RootLayout({\n\
  children,\n\
}: Readonly<{\n\
  children: React.ReactNode;\n\
}>) {\n\
  return (\n\
    <html lang="en">\n\
      <body\n\
        className={\`\${geistSans.variable} \${geistMono.variable} antialiased\`}\n\
      >\n\
        {children}\n\
      </body>\n\
    </html>\n\
  );\n\
}</boltAction>\n\
<boltAction type=\"file\" filePath=\"app/page.tsx\">import Image from "next/image";\n\
\n\
export default function Home() {\n\
  return (\n\
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">\n\
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">\n\
        <Image\n\
          className="dark:invert"\n\
          src="/next.svg"\n\
          alt="Next.js logo"\n\
          width={180}\n\
          height={38}\n\
          priority\n\
        />\n\
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">\n\
          <li className="mb-2 tracking-[-.01em]">\n\
            Get started by editing{" "}\n\
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">\n\
              app/page.tsx\n\
            </code>\n\
            .\n\
          </li>\n\
          <li className="tracking-[-.01em]">\n\
            Save and see your changes instantly.\n\
          </li>\n\
        </ol>\n\
\n\
        <div className="flex gap-4 items-center flex-col sm:flex-row">\n\
          <a\n\
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"\n\
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"\n\
            target="_blank"\n\
            rel="noopener noreferrer"\n\
          >\n\
            <Image\n\
              className="dark:invert"\n\
              src="/vercel.svg"\n\
              alt="Vercel logomark"\n\
              width={20}\n\
              height={20}\n\
            />\n\
            Deploy now\n\
          </a>\n\
          <a\n\
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"\n\
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"\n\
            target="_blank"\n\
            rel="noopener noreferrer"\n\
          >\n\
            Read our docs\n\
          </a>\n\
        </div>\n\
      </main>\n\
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">\n\
        <a\n\
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"\n\
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"\n\
          target="_blank"\n\
          rel="noopener noreferrer"\n\
        >\n\
          <Image\n\
            aria-hidden\n\
            src="/file.svg"\n\
            alt="File icon"\n\
            width={16}\n\
            height={16}\n\
          />\n\
          Learn\n\
        </a>\n\
        <a\n\
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"\n\
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"\n\
          target="_blank"\n\
          rel="noopener noreferrer"\n\
        >\n\
          <Image\n\
            aria-hidden\n\
            src="/window.svg"\n\
            alt="Window icon"\n\
            width={16}\n\
            height={16}\n\
          />\n\
          Examples\n\
        </a>\n\
        <a\n\
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"\n\
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"\n\
          target="_blank"\n\
          rel="noopener noreferrer"\n\
        >\n\
          <Image\n\
            aria-hidden\n\
            src="/globe.svg"\n\
            alt="Globe icon"\n\
            width={16}\n\
            height={16}\n\
          />\n\
          Go to nextjs.org →\n\
        </a>\n\
      </footer>\n\
    </div>\n\
  );\n\
}</boltAction>\n\
<boltAction type=\"file\" filePath=\"app/globals.css\">@import "tailwindcss";\n\
\n\
:root {\n\
  --background: #ffffff;\n\
  --foreground: #171717;\n\
}\n\
\n\
@theme inline {\n\
  --color-background: var(--background);\n\
  --color-foreground: var(--foreground);\n\
  --font-sans: var(--font-geist-sans);\n\
  --font-mono: var(--font-geist-mono);\n\
}\n\
\n\
@media (prefers-color-scheme: dark) {\n\
  :root {\n\
    --background: #0a0a0a;\n\
    --foreground: #ededed;\n\
  }\n\
}\n\
\n\
body {\n\
  background: var(--background);\n\
  color: var(--foreground);\n\
  font-family: Arial, Helvetica, sans-serif;\n\
}</boltAction>\n\
<boltAction type=\"file\" filePath=\"next.config.ts\">import type { NextConfig } from "next";\n\
\n\
const nextConfig: NextConfig = {\n\
  /* config options here */\n\
};\n\
\n\
export default nextConfig;</boltAction>\n\
<boltAction type=\"file\" filePath=\"eslint.config.mjs\">import { dirname } from "path";\n\
import { fileURLToPath } from "url";\n\
import { FlatCompat } from "@eslint/eslintrc";\n\
\n\
const __filename = fileURLToPath(import.meta.url);\n\
const __dirname = dirname(__filename);\n\
\n\
const compat = new FlatCompat({\n\
  baseDirectory: __dirname,\n\
});\n\
\n\
const eslintConfig = [\n\
  ...compat.extends("next/core-web-vitals", "next/typescript"),\n\
];\n\
\n\
export default eslintConfig;</boltAction>\n\
<boltAction type=\"file\" filePath=\"postcss.config.mjs\">const config = {\n\
  plugins: ["@tailwindcss/postcss"],\n\
};\n\
\n\
export default config;</boltAction>\n\
</boltArtifact>`; 


export const FOLLOWUP_BASE = "Below is the conversation history, including all previous messages along with the most recent assistant response. Please reference this context to inform your future responses and maintain conversation continuity."