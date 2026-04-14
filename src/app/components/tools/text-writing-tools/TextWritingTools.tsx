'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './TextWritingTools.module.css';
import ToolCard from './ToolCard';
import WordCounter from './WordCounter';
import CharacterCounter from './CharacterCounter';
import CaseConverter from './CaseConverter';
import RemoveSpaces from './RemoveSpaces';
import LineBreakRemover from './LineBreakRemover';
import TextSorter from './TextSorter';
import DuplicateRemover from './DuplicateRemover';
import FancyFontGenerator from './FancyFontGenerator';
import TextToEmoji from './TextToEmoji';
import ReverseText from './ReverseText';
import { Tool, ToolId } from './types';

interface TextWritingToolsProps {
  defaultTool?: ToolId;
}

export default function TextWritingTools({ defaultTool }: TextWritingToolsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toolParam = searchParams.get('tool') as ToolId;

  const tools: Tool[] = [
    { 
      id: 'word-counter', 
      name: 'Word Counter', 
      icon: '📝', 
      component: WordCounter,
      slug: 'word-counter',
      description: 'Count words, characters, and more'
    },
    { 
      id: 'character-counter', 
      name: 'Character Counter', 
      icon: '🔤', 
      component: CharacterCounter,
      slug: 'character-counter',
      description: 'Analyze character details'
    },
    { 
      id: 'case-converter', 
      name: 'Case Converter', 
      icon: '🔄', 
      component: CaseConverter,
      slug: 'case-converter',
      description: 'Convert text case'
    },
    { 
      id: 'remove-spaces', 
      name: 'Remove Spaces', 
      icon: '🧹', 
      component: RemoveSpaces,
      slug: 'remove-extra-spaces',
      description: 'Clean extra spaces'
    },
    { 
      id: 'line-break-remover', 
      name: 'Line Break Remover', 
      icon: '📄', 
      component: LineBreakRemover,
      slug: 'line-break-remover',
      description: 'Remove line breaks'
    },
    { 
      id: 'text-sorter', 
      name: 'Text Sorter', 
      icon: '🔡', 
      component: TextSorter,
      slug: 'text-sorter',
      description: 'Sort text A→Z'
    },
    { 
      id: 'duplicate-remover', 
      name: 'Duplicate Remover', 
      icon: '🗑️', 
      component: DuplicateRemover,
      slug: 'duplicate-remover',
      description: 'Remove duplicates'
    },
    { 
      id: 'fancy-font', 
      name: 'Fancy Font Generator', 
      icon: '🔥', 
      component: FancyFontGenerator,
      slug: 'fancy-font-generator',
      description: 'Generate fancy fonts'
    },
    { 
      id: 'text-to-emoji', 
      name: 'Text to Emoji', 
      icon: '😊', 
      component: TextToEmoji,
      slug: 'text-to-emoji',
      description: 'Convert to emoji'
    },
    { 
      id: 'reverse-text', 
      name: 'Reverse Text', 
      icon: '↩️', 
      component: ReverseText,
      slug: 'reverse-text-generator',
      description: 'Reverse your text'
    },
  ];

  const initialTool = defaultTool || toolParam || 'word-counter';
  const [activeTool, setActiveTool] = useState<ToolId>(initialTool);

  useEffect(() => {
    if (toolParam && toolParam !== activeTool) {
      setActiveTool(toolParam);
    }
  }, [toolParam]);

  const handleToolChange = (toolId: ToolId) => {
    setActiveTool(toolId);
    
    // Update URL without page reload
    const params = new URLSearchParams(searchParams.toString());
    params.set('tool', toolId);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const ActiveComponent = tools.find(tool => tool.id === activeTool)?.component || WordCounter;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>✨ Text & Writing Tools</h1>
          <p className={styles.subtitle}>All-in-one text manipulation toolkit - Free & Easy to Use</p>
        </div>

        {/* Tool Cards Grid */}
        <div className={styles.toolsGrid}>
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isActive={activeTool === tool.id}
              onClick={() => handleToolChange(tool.id)}
            />
          ))}
        </div>

        {/* Active Tool Component */}
        <div className={styles.toolContent}>
          <ActiveComponent />
        </div>

        {/* Info Section */}
        <div className={styles.infoSection}>
          <h2 className={styles.infoTitle}>About Text & Writing Tools</h2>
          <p className={styles.infoText}>
            Our comprehensive suite of text tools helps you manipulate, analyze, and transform text effortlessly. 
            Whether you&apos;re a writer tracking word count, a student formatting essays, or a social media manager 
            creating eye-catching posts, we&apos;ve got you covered. All tools work instantly in your browser with 
            complete privacy - no data is ever stored or transmitted.
          </p>
        </div>
      </div>
    </div>
  );
}