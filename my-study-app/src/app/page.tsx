'use client';
import { useEffect } from 'react';
import AlgorithmStudyApp from '@/components/AlgorithmStudyApp';

export default function Home() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.9/MathJax.js?config=TeX-AMS-MML_HTMLorMML";
    script.async = true;
    script.onload = () => {
      (window as any).MathJax.Hub.Config({
        tex2jax: {
          inlineMath: [['$', '$']],
          displayMath: [['$$', '$$']],
          processEscapes: true
        }
      });
    };
    document.head.appendChild(script);
  }, []);

  return <AlgorithmStudyApp />;
}