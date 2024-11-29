'use client';
import { useEffect, useRef } from 'react';

interface MathContentProps {
  content: string;
}

const MathContent = ({ content }: MathContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current && (window as any).MathJax) {
      (window as any).MathJax.Hub.Queue(['Typeset', (window as any).MathJax.Hub, contentRef.current]);
    }
  }, [content]);

  return <div ref={contentRef}>{content}</div>;
};

export default MathContent;