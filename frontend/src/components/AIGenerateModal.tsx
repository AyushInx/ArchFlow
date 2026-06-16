'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useDiagramStore } from '@/lib/store';
import Button from './Button';

interface AIGenerateModalProps {
  onClose: () => void;
}

export default function AIGenerateModal({ onClose }: AIGenerateModalProps) {
  const { token } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const setNodes = useDiagramStore((state) => state.setNodes);
  const setEdges = useDiagramStore((state) => state.setEdges);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !token) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/ai/generate-diagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ prompt })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate diagram');
      }

      if (data.nodes && data.edges) {
        setNodes(data.nodes);
        setEdges(data.edges);
        onClose();
      } else {
        throw new Error('Invalid diagram format received');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[var(--slate)] border border-[var(--grid-line)] rounded-xl shadow-2xl overflow-hidden relative">
        <div className="flex justify-between items-center bg-[var(--ink)] px-6 py-4 border-b border-[var(--grid-line)]">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h2 className="text-white font-bold font-heading">AI Generate Diagram</h2>
          </div>
          <button onClick={onClose} className="text-[var(--grid-line)] hover:text-white transition-colors">✕</button>
        </div>

        <form onSubmit={handleGenerate} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded bg-[var(--coral-alert)]/10 border border-[var(--coral-alert)] text-[var(--coral-alert)] text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[var(--grid-line)] mb-2">
              Describe your architecture
            </label>
            <textarea
              className="w-full h-32 rounded-lg border border-[var(--grid-line)] bg-[var(--ink)] text-white p-4 text-sm font-mono outline-none focus:border-[var(--teal-circuit)] resize-none transition-colors"
              placeholder="e.g., A highly available microservices setup with a Next.js Client, an API Gateway, an Auth Service using PostgreSQL, and an Image Processing Service using Redis Cache and S3 Storage..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="teal" loading={loading}>
              Generate
            </Button>
          </div>
        </form>

        {/* Blueprint decorative marks */}
        <span className="absolute top-4 left-4 text-[var(--grid-line)] text-xs font-mono opacity-30 pointer-events-none">┼</span>
        <span className="absolute bottom-4 left-4 text-[var(--grid-line)] text-xs font-mono opacity-30 pointer-events-none">┼</span>
        <span className="absolute bottom-4 right-4 text-[var(--grid-line)] text-xs font-mono opacity-30 pointer-events-none">┼</span>
      </div>
    </div>
  );
}
