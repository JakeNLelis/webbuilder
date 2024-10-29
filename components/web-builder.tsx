"use client";

import { useState } from 'react';
import { Code2, Layout, Play, Download, Moon, Sun } from 'lucide-react';
import { Editor } from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComponentPalette } from '@/components/component-palette';
import { PreviewFrame } from '@/components/preview-frame';
import { useStore } from '@/lib/store';
import { downloadProject } from '@/lib/download';
import { useTheme } from 'next-themes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

export function WebBuilder() {
  const [activeTab, setActiveTab] = useState('visual');
  const { components, updateCode, framework, setFramework } = useStore();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      await downloadProject(components, framework);
      toast({
        title: "Success!",
        description: "Your project has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download project. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Web Builder</h1>
          <Select value={framework} onValueChange={setFramework}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select framework" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="react">React</SelectItem>
              <SelectItem value="vue">Vue</SelectItem>
              <SelectItem value="svelte">Svelte</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button variant="default" size="sm">
            <Play className="w-4 h-4 mr-2" />
            Deploy
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <ComponentPalette />
        
        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b">
              <TabsTrigger value="visual" className="gap-2">
                <Layout className="w-4 h-4" />
                Visual Editor
              </TabsTrigger>
              <TabsTrigger value="code" className="gap-2">
                <Code2 className="w-4 h-4" />
                Code Editor
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="visual" className="flex-1 p-0 m-0 overflow-auto">
              <PreviewFrame />
            </TabsContent>
            
            <TabsContent value="code" className="flex-1 p-0 m-0">
              <div className="h-full">
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  theme={theme === "light" ? "vs-light" : "vs-dark"}
                  value={JSON.stringify(components, null, 2)}
                  onChange={(value) => updateCode(value || '')}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    wordWrap: 'on',
                    formatOnPaste: true,
                    formatOnType: true,
                  }}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Toaster />
    </div>
  );
}