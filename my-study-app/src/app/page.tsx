'use client';
import AlgorithmStudyApp from '@/components/AlgorithmStudyApp';
import MathJaxProvider from '@/components/MathJaxProvider';

export default function Home() {
  return (
    <>
      <MathJaxProvider />
      <AlgorithmStudyApp />
    </>
  );
}