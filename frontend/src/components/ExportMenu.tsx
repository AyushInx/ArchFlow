'use client';

import React, { useState } from 'react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { useDiagramStore } from '@/lib/store';
import Button from './Button';

export default function ExportMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const nodes = useDiagramStore((state) => state.nodes);
  const edges = useDiagramStore((state) => state.edges);

  const getCanvasElement = () => document.querySelector('.react-flow__viewport') as HTMLElement;

  const exportPNG = async () => {
    const el = getCanvasElement();
    if (!el) return;
    try {
      const dataUrl = await toPng(el, { backgroundColor: '#0F1B2D' });
      const link = document.createElement('a');
      link.download = 'archflow-diagram.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export PNG', err);
    }
    setIsOpen(false);
  };

  const exportPDF = async () => {
    const el = getCanvasElement();
    if (!el) return;
    try {
      const dataUrl = await toPng(el, { backgroundColor: '#0F1B2D' });
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [el.scrollWidth, el.scrollHeight]
      });
      pdf.addImage(dataUrl, 'PNG', 0, 0, el.scrollWidth, el.scrollHeight);
      pdf.save('archflow-diagram.pdf');
    } catch (err) {
      console.error('Failed to export PDF', err);
    }
    setIsOpen(false);
  };

  const exportJSON = () => {
    const data = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'archflow-diagram.json';
    link.click();
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>Export</Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-[var(--slate)] border border-[var(--grid-line)] rounded-md shadow-xl z-50 animate-fade-in overflow-hidden">
          <button 
            onClick={exportPNG}
            className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[var(--ink)] hover:text-[var(--amber-signal)] transition-colors"
          >
            Download PNG
          </button>
          <button 
            onClick={exportPDF}
            className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[var(--ink)] hover:text-[var(--amber-signal)] transition-colors border-y border-[var(--grid-line)]"
          >
            Download PDF
          </button>
          <button 
            onClick={exportJSON}
            className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-[var(--ink)] hover:text-[var(--amber-signal)] transition-colors"
          >
            Export JSON
          </button>
        </div>
      )}
    </div>
  );
}
