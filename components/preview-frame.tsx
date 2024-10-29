"use client";

import { useEffect, useRef } from 'react';
import Frame from 'react-frame-component';
import { useStore } from '@/lib/store';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export function PreviewFrame() {
  const components = useStore((state) => state.components);
  const framework = useStore((state) => state.framework);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (frameRef.current) {
      const doc = frameRef.current.contentDocument;
      if (doc) {
        const style = doc.createElement('style');
        style.textContent = `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body { 
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
          }
        `;
        doc.head.appendChild(style);
      }
    }
  }, []);

  const renderComponent = (component: any) => {
    const baseProps = {
      className: cn(component.props?.className, 'transition-all duration-200'),
      style: component.props?.style,
      key: component.id,
    };

    switch (component.type) {
      case 'heading':
        return <h1 {...baseProps} className={cn("text-2xl font-bold mb-4", baseProps.className)}>
          {component.props?.text || 'Heading'}
        </h1>;
      case 'paragraph':
        return <p {...baseProps} className={cn("mb-4 leading-relaxed", baseProps.className)}>
          {component.props?.text || 'Paragraph text'}
        </p>;
      case 'button':
        return (
          <button {...baseProps} className={cn("px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600", baseProps.className)}>
            {component.props?.text || 'Button'}
          </button>
        );
      case 'image':
        return (
          <img
            {...baseProps}
            src={component.props?.src || 'https://via.placeholder.com/400x300'}
            alt={component.props?.alt || 'Image'}
            className={cn("max-w-full h-auto rounded", baseProps.className)}
          />
        );
      case 'container':
        return (
          <div {...baseProps} className={cn("p-4 border rounded", baseProps.className)}>
            {component.props?.children?.map((child: any) => renderComponent(child))}
          </div>
        );
      case 'grid':
        return (
          <div {...baseProps} className={cn("grid grid-cols-2 gap-4", baseProps.className)}>
            {component.props?.children?.map((child: any) => renderComponent(child))}
          </div>
        );
      case 'list':
        return (
          <ul {...baseProps} className={cn("list-disc list-inside space-y-2", baseProps.className)}>
            {(component.props?.items || ['List item 1', 'List item 2']).map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        );
      case 'input':
        return (
          <input
            {...baseProps}
            type={component.props?.type || 'text'}
            placeholder={component.props?.placeholder || 'Enter text...'}
            className={cn("w-full px-3 py-2 border rounded focus:outline-none focus:ring-2", baseProps.className)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Frame
      ref={frameRef}
      className={cn(
        "w-full h-full",
        theme === "dark" ? "bg-gray-900" : "bg-white"
      )}
      initialContent={`
        <!DOCTYPE html>
        <html>
          <head>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              body { 
                background: ${theme === "dark" ? "#111" : "#fff"};
                color: ${theme === "dark" ? "#fff" : "#000"};
              }
            </style>
          </head>
          <body>
            <div id="mount"></div>
          </body>
        </html>
      `}
    >
      <div className="p-8">
        {components.map((component) => renderComponent(component))}
      </div>
    </Frame>
  );
}