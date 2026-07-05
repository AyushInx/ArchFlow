'use client';

import React, { useState, useEffect } from 'react';
import { useDiagramStore, AppNode } from '@/lib/store';
import { X, Send, Plus, Trash2, Link as LinkIcon, Sparkles } from 'lucide-react';
import Button from './Button';

interface NodeModalsProps {
  activeNodeId: string;
  activeModal: 'comments' | 'docs' | 'code' | 'images' | 'ai' | null;
  onClose: () => void;
}

export default function NodeModals({ activeNodeId, activeModal, onClose }: NodeModalsProps) {
  const nodes = useDiagramStore(state => state.nodes);
  const updateNode = useDiagramStore(state => state.updateNode);
  
  const node = nodes.find(n => n.id === activeNodeId);

  // If node is deleted or unselected, close the modal
  useEffect(() => {
    if (!node && activeModal !== null) {
      onClose();
    }
  }, [node, activeModal, onClose]);

  if (!node || !activeModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-lg bg-[var(--cosmic-primary)] border border-[var(--cosmic-border)] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        {activeModal === 'comments' && <CommentsModal node={node} updateNode={updateNode} onClose={onClose} />}
        {activeModal === 'docs' && <DocsModal node={node} updateNode={updateNode} onClose={onClose} />}
        {activeModal === 'code' && <CodeModal node={node} updateNode={updateNode} onClose={onClose} />}
        {activeModal === 'images' && <ImagesModal node={node} updateNode={updateNode} onClose={onClose} />}
        {activeModal === 'ai' && <AiMenuModal node={node} onClose={onClose} />}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// COMMENTS MODAL
// ----------------------------------------------------------------------
function CommentsModal({ node, updateNode, onClose }: any) {
  const [msg, setMsg] = useState('');
  const comments = node.data?.comments || [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;

    const newComment = {
      id: Math.random().toString(36).substr(2, 9),
      author: 'Current User', // In a real app, this comes from auth
      message: msg.trim(),
      timestamp: new Date().toISOString(),
    };

    updateNode(node.id, (n: AppNode) => ({
      ...n,
      data: { ...n.data, comments: [...(n.data.comments || []), newComment] }
    }));
    setMsg('');
  };

  const handleDelete = (id: string) => {
    updateNode(node.id, (n: AppNode) => ({
      ...n,
      data: { ...n.data, comments: n.data.comments.filter((c: any) => c.id !== id) }
    }));
  };

  return (
    <>
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-[var(--text-primary)] font-semibold font-heading">Comments</h3>
        <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white"><X className="w-5 h-5" /></button>
      </div>
      <div className="p-5 flex flex-col gap-4 h-[350px] overflow-y-auto">
        {comments.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-[var(--text-muted)] text-sm">No comments yet.</div>
        ) : (
          comments.map((c: any) => (
            <div key={c.id} className="bg-white/5 rounded-xl p-3 border border-white/5 group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-white">{c.author}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[var(--text-muted)]">{new Date(c.timestamp).toLocaleString()}</span>
                  <button onClick={() => handleDelete(c.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-[var(--text-primary)] whitespace-pre-wrap">{c.message}</p>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSend} className="p-4 border-t border-white/10 flex gap-2">
        <input 
          type="text" 
          value={msg}
          onChange={e => setMsg(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[var(--accent-primary)]"
        />
        <Button type="submit" className="px-3" disabled={!msg.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </>
  );
}

// ----------------------------------------------------------------------
// DOCS MODAL
// ----------------------------------------------------------------------
function DocsModal({ node, updateNode, onClose }: any) {
  const [doc, setDoc] = useState(node.data?.documentation || '');
  
  const handleSave = () => {
    updateNode(node.id, (n: AppNode) => ({
      ...n,
      data: { ...n.data, documentation: doc }
    }));
    onClose();
  };

  return (
    <>
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-[var(--text-primary)] font-semibold font-heading">Documentation</h3>
        <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white"><X className="w-5 h-5" /></button>
      </div>
      <div className="p-5 h-[400px] flex flex-col">
        <textarea
          value={doc}
          onChange={e => setDoc(e.target.value)}
          placeholder="# Node Documentation&#10;Write Markdown here..."
          className="flex-1 w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm text-[var(--text-primary)] placeholder-white/30 font-mono focus:outline-none focus:border-[var(--accent-primary)] resize-none"
        />
      </div>
      <div className="p-4 border-t border-white/10 flex justify-end gap-2">
        <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-muted)] hover:text-white">Cancel</button>
        <Button onClick={handleSave}>Save Docs</Button>
      </div>
    </>
  );
}

// ----------------------------------------------------------------------
// CODE SNIPPETS MODAL
// ----------------------------------------------------------------------
function CodeModal({ node, updateNode, onClose }: any) {
  const snippets = node.data?.snippets || [];
  const [activeId, setActiveId] = useState<string | null>(snippets.length > 0 ? snippets[0].id : null);
  
  const activeSnippet = snippets.find((s: any) => s.id === activeId);

  const addSnippet = () => {
    const id = Math.random().toString(36).substr(2, 9);
    const newSnippet = { id, title: 'New Snippet', language: 'json', code: '' };
    updateNode(node.id, (n: AppNode) => ({
      ...n,
      data: { ...n.data, snippets: [...(n.data.snippets || []), newSnippet] }
    }));
    setActiveId(id);
  };

  const updateSnippet = (id: string, updates: any) => {
    updateNode(node.id, (n: AppNode) => ({
      ...n,
      data: {
        ...n.data,
        snippets: n.data.snippets.map((s: any) => s.id === id ? { ...s, ...updates } : s)
      }
    }));
  };

  const deleteSnippet = (id: string) => {
    updateNode(node.id, (n: AppNode) => {
      const newSnippets = n.data.snippets.filter((s: any) => s.id !== id);
      if (activeId === id) {
        setActiveId(newSnippets.length > 0 ? newSnippets[0].id : null);
      }
      return { ...n, data: { ...n.data, snippets: newSnippets } };
    });
  };

  return (
    <>
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-[var(--text-primary)] font-semibold font-heading flex items-center gap-2">
          Code Snippets 
          <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">{snippets.length}</span>
        </h3>
        <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white"><X className="w-5 h-5" /></button>
      </div>
      <div className="flex h-[400px]">
        {/* Sidebar */}
        <div className="w-1/3 border-r border-white/10 bg-black/10 flex flex-col">
          <div className="p-3">
            <Button onClick={addSnippet} className="w-full text-xs py-1.5" variant="secondary">
              <Plus className="w-3 h-3 mr-1" /> Add Snippet
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {snippets.map((s: any) => (
              <button
                key={s.id}
                onClick={() => setActiveId(s.id)}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between group ${activeId === s.id ? 'bg-[var(--accent-primary)]/20 text-white border-l-2 border-[var(--accent-primary)]' : 'text-[var(--text-muted)] hover:bg-white/5 hover:text-white border-l-2 border-transparent'}`}
              >
                <span className="truncate pr-2">{s.title}</span>
                <Trash2 onClick={(e) => { e.stopPropagation(); deleteSnippet(s.id); }} className="w-3 h-3 opacity-0 group-hover:opacity-100 hover:text-red-400" />
              </button>
            ))}
          </div>
        </div>
        {/* Editor */}
        <div className="w-2/3 p-4 flex flex-col gap-3">
          {activeSnippet ? (
            <>
              <div className="flex gap-2">
                <input
                  value={activeSnippet.title}
                  onChange={e => updateSnippet(activeSnippet.id, { title: e.target.value })}
                  className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[var(--accent-primary)]"
                  placeholder="Snippet Title"
                />
                <select
                  value={activeSnippet.language}
                  onChange={e => updateSnippet(activeSnippet.id, { language: e.target.value })}
                  className="w-28 bg-black/20 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option value="json">JSON</option>
                  <option value="yaml">YAML</option>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="sql">SQL</option>
                  <option value="bash">Bash</option>
                  <option value="text">Text</option>
                </select>
              </div>
              <textarea
                value={activeSnippet.code}
                onChange={e => updateSnippet(activeSnippet.id, { code: e.target.value })}
                className="flex-1 w-full bg-[#0d0d12] border border-white/10 rounded-lg p-3 text-sm text-green-400 font-mono focus:outline-none focus:border-[var(--accent-primary)] resize-none"
                placeholder="// Write your code here..."
              />
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-[var(--text-muted)] text-sm">
              Select or create a snippet.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ----------------------------------------------------------------------
// IMAGES MODAL
// ----------------------------------------------------------------------
function ImagesModal({ node, updateNode, onClose }: any) {
  const [url, setUrl] = useState('');
  const images = node.data?.images || [];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    updateNode(node.id, (n: AppNode) => ({
      ...n,
      data: { ...n.data, images: [...(n.data.images || []), url.trim()] }
    }));
    setUrl('');
  };

  const handleDelete = (index: number) => {
    updateNode(node.id, (n: AppNode) => {
      const newImages = [...n.data.images];
      newImages.splice(index, 1);
      return { ...n, data: { ...n.data, images: newImages } };
    });
  };

  return (
    <>
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-[var(--text-primary)] font-semibold font-heading">Image Gallery</h3>
        <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white"><X className="w-5 h-5" /></button>
      </div>
      <div className="p-5 flex flex-col gap-4 h-[350px] overflow-y-auto">
        <form onSubmit={handleAdd} className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="url" 
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="Paste image URL (https://...)"
              className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[var(--accent-primary)]"
            />
          </div>
          <Button type="submit" disabled={!url.trim()}>Add</Button>
        </form>

        <div className="grid grid-cols-2 gap-3 mt-2">
          {images.map((img: string, idx: number) => (
            <div key={idx} className="relative aspect-video rounded-lg overflow-hidden bg-black/40 border border-white/10 group">
              <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
              <button 
                onClick={() => handleDelete(idx)} 
                className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-md text-white opacity-0 group-hover:opacity-100 hover:bg-red-500/80 transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          {images.length === 0 && (
            <div className="col-span-2 py-10 flex items-center justify-center text-[var(--text-muted)] text-sm border border-dashed border-white/10 rounded-lg">
              No images attached.
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ----------------------------------------------------------------------
// AI EXPLAIN MODAL
// ----------------------------------------------------------------------
function AiMenuModal({ onClose }: any) {
  const actions = [
    "Explain Component",
    "Suggest Improvements",
    "Generate Documentation",
    "Find Architecture Issues"
  ];

  return (
    <>
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
        <h3 className="text-[var(--text-primary)] font-semibold font-heading flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
          AI Assistant
        </h3>
        <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white"><X className="w-5 h-5" /></button>
      </div>
      <div className="p-2 flex flex-col">
        {actions.map((action, idx) => (
          <button 
            key={idx}
            onClick={() => {
              alert(`AI Action Triggered: ${action}`);
              onClose();
            }}
            className="text-left px-4 py-3 text-sm text-[var(--text-primary)] hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)] rounded-lg transition-colors flex items-center gap-3"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]/50" />
            {action}
          </button>
        ))}
      </div>
    </>
  );
}
