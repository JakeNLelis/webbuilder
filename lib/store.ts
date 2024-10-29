"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Component {
  id: string;
  type: string;
  props: Record<string, any>;
  children?: Component[];
}

interface Store {
  components: Component[];
  framework: string;
  selectedComponent: string | null;
  setFramework: (framework: string) => void;
  addComponent: (component: Component) => void;
  updateComponent: (id: string, updates: Partial<Component>) => void;
  removeComponent: (id: string) => void;
  moveComponent: (dragIndex: number, hoverIndex: number) => void;
  selectComponent: (id: string | null) => void;
  updateCode: (code: string) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      components: [],
      framework: 'react',
      selectedComponent: null,
      setFramework: (framework) => set({ framework }),
      addComponent: (component) =>
        set((state) => ({ components: [...state.components, component] })),
      updateComponent: (id, updates) =>
        set((state) => ({
          components: state.components.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      removeComponent: (id) =>
        set((state) => ({
          components: state.components.filter((c) => c.id !== id),
          selectedComponent: state.selectedComponent === id ? null : state.selectedComponent,
        })),
      moveComponent: (dragIndex, hoverIndex) =>
        set((state) => {
          const newComponents = [...state.components];
          const dragComponent = newComponents[dragIndex];
          newComponents.splice(dragIndex, 1);
          newComponents.splice(hoverIndex, 0, dragComponent);
          return { components: newComponents };
        }),
      selectComponent: (id) => set({ selectedComponent: id }),
      updateCode: (code) => {
        try {
          const components = JSON.parse(code);
          if (Array.isArray(components)) {
            set({ components });
          }
        } catch (e) {
          console.error('Invalid JSON:', e);
        }
      },
    }),
    {
      name: 'web-builder-storage',
    }
  )
);