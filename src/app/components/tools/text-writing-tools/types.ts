import { ComponentType } from 'react';

export type ToolId = 
  | 'word-counter'
  | 'character-counter'
  | 'case-converter'
  | 'remove-spaces'
  | 'line-break-remover'
  | 'text-sorter'
  | 'duplicate-remover'
  | 'fancy-font'
  | 'text-to-emoji'
  | 'reverse-text';

export interface Tool {
  id: ToolId;
  name: string;
  icon: string;
  component: ComponentType;
  slug: string;
  description: string;
}

export interface ToolCardProps {
  tool: Tool;
  isActive: boolean;
  onClick: () => void;
}

export interface FontConverter {
  name: string;
  convert: (char: string) => string;
}

export interface EmojiMap {
  [key: string]: string;
}