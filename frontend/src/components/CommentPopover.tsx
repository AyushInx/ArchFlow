'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import Button from './Button';

interface Comment {
  _id: string;
  text: string;
  createdAt: string;
  userId: { _id: string; name: string };
}

interface CommentPopoverProps {
  projectId: string;
  nodeId: string;
  onClose: () => void;
  style?: React.CSSProperties;
}

export default function CommentPopover({ projectId, nodeId, onClose, style }: CommentPopoverProps) {
  const { token, user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newText, setNewText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [projectId, nodeId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${projectId}/nodes/${nodeId}/comments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim() || !token) return;
    setSubmitting(true);
    
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${projectId}/nodes/${nodeId}/comments`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ text: newText })
      });
      
      if (res.ok) {
        const data = await res.json();
        setComments([...comments, data.comment]);
        setNewText('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="absolute z-50 w-72 rounded-lg border border-[var(--grid-line)] bg-[var(--slate)] shadow-xl overflow-hidden animate-fade-in"
      style={style}
    >
      <div className="flex justify-between items-center bg-[var(--ink)] px-3 py-2 border-b border-[var(--grid-line)]">
        <h3 className="text-white text-xs font-bold font-heading">Comments</h3>
        <button onClick={onClose} className="text-[var(--grid-line)] hover:text-white">✕</button>
      </div>
      
      <div className="p-3 max-h-60 overflow-y-auto space-y-3">
        {loading ? (
          <p className="text-xs text-[var(--grid-line)] text-center">Loading...</p>
        ) : comments.length === 0 ? (
          <p className="text-xs text-[var(--grid-line)] text-center">No comments yet</p>
        ) : (
          comments.map(c => (
            <div key={c._id} className="text-sm">
              <div className="flex items-baseline justify-between mb-1">
                <span className="font-bold text-[var(--teal-circuit)] text-xs">{c.userId?.name || 'User'}</span>
                <span className="text-[10px] text-[var(--grid-line)]">{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-white text-xs leading-relaxed break-words bg-[var(--ink)] p-2 rounded-md border border-[var(--grid-line)]">
                {c.text}
              </p>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-[var(--grid-line)] bg-[var(--ink)]">
        <textarea 
          className="w-full text-xs p-2 rounded border border-[var(--grid-line)] bg-[var(--slate)] text-white outline-none focus:border-[var(--amber-signal)] resize-none"
          placeholder="Add a comment..."
          rows={2}
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
        <div className="flex justify-end mt-2">
          <Button type="submit" size="sm" variant="primary" loading={submitting}>Post</Button>
        </div>
      </form>
      
      {/* Corner marks */}
      <span className="absolute top-1 left-1 text-[var(--grid-line)] text-[8px] font-mono pointer-events-none opacity-40">┼</span>
      <span className="absolute top-1 right-1 text-[var(--grid-line)] text-[8px] font-mono pointer-events-none opacity-40">┼</span>
      <span className="absolute bottom-1 left-1 text-[var(--grid-line)] text-[8px] font-mono pointer-events-none opacity-40">┼</span>
      <span className="absolute bottom-1 right-1 text-[var(--grid-line)] text-[8px] font-mono pointer-events-none opacity-40">┼</span>
    </div>
  );
}
