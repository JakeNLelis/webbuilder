import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Component } from './store';

const frameworkConfigs = {
  react: {
    extension: 'tsx',
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      '@types/react': '^18.2.0',
      '@types/react-dom': '^18.2.0',
    },
  },
  vue: {
    extension: 'vue',
    dependencies: {
      vue: '^3.3.0',
      '@vitejs/plugin-vue': '^4.3.0',
    },
  },
  svelte: {
    extension: 'svelte',
    dependencies: {
      svelte: '^4.0.0',
      '@sveltejs/vite-plugin-svelte': '^2.4.0',
    },
  },
};

export async function downloadProject(
  components: Component[],
  framework: string
) {
  const zip = new JSZip();
  const config = frameworkConfigs[framework as keyof typeof frameworkConfigs];

  // Add package.json
  const packageJson = {
    name: 'web-builder-project',
    private: true,
    version: '1.0.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview',
    },
    dependencies: {
      ...config.dependencies,
    },
    devDependencies: {
      vite: '^4.4.9',
      typescript: '^5.0.2',
      tailwindcss: '^3.3.3',
      autoprefixer: '^10.4.15',
      postcss: '^8.4.29',
    },
  };

  zip.file('package.json', JSON.stringify(packageJson, null, 2));

  // Add vite.config.ts
  const viteConfig = generateViteConfig(framework);
  zip.file('vite.config.ts', viteConfig);

  // Add tailwind.config.js
  zip.file('tailwind.config.js', generateTailwindConfig());

  // Add postcss.config.js
  zip.file('postcss.config.js', generatePostcssConfig());

  // Add main entry file
  zip.file(
    `src/main.${config.extension === 'vue' ? 'ts' : config.extension}`,
    generateMainFile(framework)
  );

  // Add app component
  zip.file(
    `src/App.${config.extension}`,
    generateAppCode(components, framework)
  );

  // Add index.html
  zip.file('index.html', generateIndexHtml(framework));

  // Add CSS
  zip.file('src/index.css', generateCssFile());

  // Generate and save zip
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, 'web-builder-project.zip');
}

function generateViteConfig(framework: string): string {
  const plugins = {
    react: "import react from '@vitejs/plugin-react'",
    vue: "import vue from '@vitejs/plugin-vue'",
    svelte: "import { svelte } from '@sveltejs/vite-plugin-svelte'",
  };

  return `
import { defineConfig } from 'vite'
${plugins[framework as keyof typeof plugins]}

export default defineConfig({
  plugins: [${framework}()],
})`;
}

function generateTailwindConfig(): string {
  return `
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue,svelte}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`;
}

function generatePostcssConfig(): string {
  return `
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
}

function generateMainFile(framework: string): string {
  switch (framework) {
    case 'react':
      return `
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;
    case 'vue':
      return `
import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

createApp(App).mount('#app')`;
    case 'svelte':
      return `
import App from './App.svelte'
import './index.css'

const app = new App({
  target: document.getElementById('app'),
})

export default app`;
    default:
      return '';
  }
}

function generateAppCode(components: Component[], framework: string): string {
  switch (framework) {
    case 'react':
      return generateReactCode(components);
    case 'vue':
      return generateVueCode(components);
    case 'svelte':
      return generateSvelteCode(components);
    default:
      return '';
  }
}

function generateReactCode(components: Component[]): string {
  return `
import React from 'react'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      ${components.map(componentToReactJSX).join('\n      ')}
    </div>
  )
}`;
}

function generateVueCode(components: Component[]): string {
  return `
<template>
  <div class="min-h-screen bg-gray-50 p-8">
    ${components.map(componentToVueTemplate).join('\n    ')}
  </div>
</template>

<script setup lang="ts">
// Component logic here
</script>`;
}

function generateSvelteCode(components: Component[]): string {
  return `
<div class="min-h-screen bg-gray-50 p-8">
  ${components.map(componentToSvelteTemplate).join('\n  ')}
</div>

<script lang="ts">
  // Component logic here
</script>`;
}

function componentToReactJSX(component: Component): string {
  switch (component.type) {
    case 'heading':
      return `<h1 className="${
        component.props.className || 'text-2xl font-bold mb-4'
      }">${component.props.text || 'Heading'}</h1>`;
    case 'paragraph':
      return `<p className="${component.props.className || 'mb-4'}">${
        component.props.text || 'Paragraph text'
      }</p>`;
    case 'button':
      return `<button className="${
        component.props.className || 'px-4 py-2 bg-blue-500 text-white rounded'
      }">${component.props.text || 'Button'}</button>`;
    default:
      return '';
  }
}

function componentToVueTemplate(component: Component): string {
  switch (component.type) {
    case 'heading':
      return `<h1 class="${
        component.props.className || 'text-2xl font-bold mb-4'
      }">${component.props.text || 'Heading'}</h1>`;
    case 'paragraph':
      return `<p class="${component.props.className || 'mb-4'}">${
        component.props.text || 'Paragraph text'
      }</p>`;
    case 'button':
      return `<button class="${
        component.props.className || 'px-4 py-2 bg-blue-500 text-white rounded'
      }">${component.props.text || 'Button'}</button>`;
    default:
      return '';
  }
}

function componentToSvelteTemplate(component: Component): string {
  switch (component.type) {
    case 'heading':
      return `<h1 class="${
        component.props.className || 'text-2xl font-bold mb-4'
      }">${component.props.text || 'Heading'}</h1>`;
    case 'paragraph':
      return `<p class="${component.props.className || 'mb-4'}">${
        component.props.text || 'Paragraph text'
      }</p>`;
    case 'button':
      return `<button class="${
        component.props.className || 'px-4 py-2 bg-blue-500 text-white rounded'
      }">${component.props.text || 'Button'}</button>`;
    default:
      return '';
  }
}

function generateIndexHtml(framework: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Web Builder Project</title>
  </head>
  <body>
    <div id="${framework === 'react' ? 'root' : 'app'}"></div>
    <script type="module" src="/src/main.${
      framework === 'vue' ? 'ts' : frameworkConfigs[framework].extension
    }"></script>
  </body>
</html>`;
}

function generateCssFile(): string {
  return `
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}`;
}
