"use client";

import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
  Layout,
  Type,
  Image,
  ListOrdered,
  FormInput,
  Square,
  Columns,
} from 'lucide-react';
import { useStore } from '@/lib/store';

const componentTypes = [
  { id: 'heading', icon: Type, label: 'Heading' },
  { id: 'paragraph', icon: Type, label: 'Paragraph' },
  { id: 'image', icon: Image, label: 'Image' },
  { id: 'button', icon: Square, label: 'Button' },
  { id: 'list', icon: ListOrdered, label: 'List' },
  { id: 'input', icon: FormInput, label: 'Input' },
  { id: 'container', icon: Layout, label: 'Container' },
  { id: 'grid', icon: Columns, label: 'Grid' },
];

export function ComponentPalette() {
  const addComponent = useStore((state) => state.addComponent);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const componentType = componentTypes[result.source.index];
    addComponent({
      id: `${componentType.id}-${Date.now()}`,
      type: componentType.id,
      props: {},
    });
  };

  return (
    <div className="w-64 border-r bg-background">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Components</h2>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="palette" isDropDisabled={true}>
          {(provided) => (
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div
                className="p-4 grid gap-2"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {componentTypes.map((component, index) => (
                  <Draggable
                    key={component.id}
                    draggableId={component.id}
                    index={index}
                  >
                    {(provided) => (
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <component.icon className="w-4 h-4 mr-2" />
                        {component.label}
                      </Button>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </ScrollArea>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}