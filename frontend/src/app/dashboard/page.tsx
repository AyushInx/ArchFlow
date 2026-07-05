'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import Button from '@/components/Button';
import { Search, Plus, MoreVertical, Pencil, Copy, Share2, Trash2, LogOut, Layers, Clock, Check, Component, Blocks } from 'lucide-react';
import BlueprintCard from '@/components/BlueprintCard';

interface Project {
  _id: string;
  title: string;
  updatedAt: string;
  ownerId: string;
}

export default function DashboardPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [contextMenuOpenId, setContextMenuOpenId] = useState<string | null>(null);

  const profileRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user && token) {
      fetchProjects();
    }
  }, [user, loading, token, search]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setContextMenuOpenId(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchProjects = async () => {
    try {
      const url = new URL('http://localhost:5000/api/projects');
      if (search) url.searchParams.append('search', search);

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Failed to fetch projects', error);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;
    setCreating(true);

    try {
      const res = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: newProjectTitle }),
      });

      if (res.ok) {
        const data = await res.json();
        setIsModalOpen(false);
        setNewProjectTitle('');
        router.push(`/project/${data.project._id}`);
      }
    } catch (error) {
      console.error('Failed to create project', error);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    setContextMenuOpenId(null);
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error('Failed to delete project', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('archflow_token');
    window.location.href = '/login';
  };

  if (loading || (!user && token)) return (
    <div className="min-h-screen bg-[var(--cosmic-primary)] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[var(--accent-purple)]/20 border-t-[var(--accent-purple)] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--cosmic-primary)] text-[var(--text-primary)]">
      {/* Top Nav */}
      <nav className="sticky top-0 z-40 bg-[var(--cosmic-primary)]/80 backdrop-blur-xl border-b border-[var(--cosmic-border)] px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-pink)] flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-[15px] font-semibold text-white tracking-tight">ArchFlow</h1>
            <span className="text-[var(--text-muted)] text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--accent-purple)]/10 border border-[var(--accent-purple)]/20 font-medium">Beta</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--accent-purple)] to-[var(--accent-pink)] text-white font-medium text-xs shadow-sm ring-2 ring-transparent hover:ring-[var(--accent-purple)]/30 transition-all outline-none"
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </button>
            
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl cosmic-panel shadow-2xl py-1 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-[var(--cosmic-border)] mb-1">
                  <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{user?.email}</p>
                </div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-white/5 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-[var(--text-muted)]" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-white tracking-tight mb-1">Projects</h2>
            <p className="text-sm text-[var(--text-muted)]">Manage and collaborate on your architecture diagrams.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative group flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--text-primary)] transition-colors" />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[var(--cosmic-secondary)] border border-[var(--cosmic-border)] rounded-xl pl-9 pr-4 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-all focus:border-[var(--accent-purple)]/40 focus:ring-1 focus:ring-[var(--accent-purple)]/20 shadow-sm"
              />
            </div>
            <Button variant="primary" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </div>
        </div>

        {projects.length === 0 ? (
          /* Premium Empty State */
          <div className="mt-12 p-12 rounded-2xl border border-[var(--cosmic-border)] bg-gradient-to-b from-[var(--cosmic-secondary)] to-[var(--cosmic-primary)] flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:24px_24px] opacity-50"></div>
            
            <div className="relative z-10 w-24 h-24 mb-6 rounded-3xl bg-[var(--accent-purple)]/5 border border-[var(--accent-purple)]/10 flex items-center justify-center shadow-2xl backdrop-blur-xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent-purple)]/20 to-[var(--accent-pink)]/20 rounded-3xl blur-xl"></div>
              <Component className="w-10 h-10 text-[var(--text-secondary)] relative z-10" />
            </div>
            
            <h3 className="text-xl font-semibold text-white mb-2 relative z-10">No projects found</h3>
            <p className="text-[var(--text-muted)] max-w-sm mb-8 relative z-10 text-sm">
              Create your first system architecture diagram and start collaborating in real-time.
            </p>
            <Button variant="primary" size="lg" onClick={() => setIsModalOpen(true)} className="relative z-10">
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        ) : (
          /* Project Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => (
              <div key={project._id} className="group relative rounded-xl border border-[var(--cosmic-border)] bg-[var(--cosmic-secondary)] hover:bg-[var(--cosmic-card)] transition-all duration-300 hover:border-[var(--accent-purple)]/20 hover:shadow-2xl hover:shadow-purple-500/5 overflow-hidden flex flex-col">
                {/* Thumbnail Area */}
                <div className="h-32 bg-[var(--cosmic-primary)] border-b border-[var(--cosmic-border)] relative overflow-hidden p-4 flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  
                  {/* Decorative Elements */}
                  <div className="flex gap-4 items-center opacity-40 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105 transform">
                    <div className="w-10 h-10 rounded-lg border border-[var(--cosmic-border)] bg-[var(--cosmic-secondary)] shadow-lg flex items-center justify-center">
                       <Component className="w-5 h-5 text-[var(--accent-teal)]" />
                    </div>
                    <div className="w-8 h-px bg-[var(--cosmic-border)]"></div>
                    <div className="w-10 h-10 rounded-lg border border-[var(--cosmic-border)] bg-[var(--cosmic-secondary)] shadow-lg flex items-center justify-center">
                       <Blocks className="w-5 h-5 text-[var(--accent-purple)]" />
                    </div>
                  </div>
                </div>
                
                {/* Content Area */}
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <Link href={`/project/${project._id}`} className="flex-1 min-w-0 pr-4 outline-none">
                      <h3 className="font-semibold text-[15px] text-white truncate group-hover:text-[var(--accent-purple)] transition-colors">
                        {project.title}
                      </h3>
                    </Link>
                    
                    {/* Context Menu */}
                    <div className="relative">
                      <button 
                        onClick={(e) => { e.preventDefault(); setContextMenuOpenId(contextMenuOpenId === project._id ? null : project._id); }}
                        className="w-7 h-7 flex items-center justify-center rounded-md text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {contextMenuOpenId === project._id && (
                        <div ref={menuRef} className="absolute right-0 top-8 w-40 rounded-xl cosmic-panel shadow-2xl py-1 z-20 animate-fade-in">
                          <button className="w-full text-left px-3 py-1.5 text-xs text-[var(--text-primary)] hover:bg-white/5 transition-colors flex items-center gap-2">
                            <Pencil className="w-3.5 h-3.5 text-[var(--text-muted)]" /> Rename
                          </button>
                          <button className="w-full text-left px-3 py-1.5 text-xs text-[var(--text-primary)] hover:bg-white/5 transition-colors flex items-center gap-2">
                            <Copy className="w-3.5 h-3.5 text-[var(--text-muted)]" /> Duplicate
                          </button>
                          <button className="w-full text-left px-3 py-1.5 text-xs text-[var(--text-primary)] hover:bg-white/5 transition-colors flex items-center gap-2">
                            <Share2 className="w-3.5 h-3.5 text-[var(--text-muted)]" /> Share
                          </button>
                          <div className="h-px bg-[var(--cosmic-border)] my-1" />
                          <button 
                            onClick={(e) => { e.preventDefault(); handleDeleteProject(project._id); }}
                            className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-3">
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(project.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    {/* Owner Indicator */}
                    <div className="flex -space-x-1">
                      <div className="w-5 h-5 rounded-full border border-[var(--cosmic-secondary)] bg-gradient-to-tr from-[var(--accent-purple)] to-[var(--accent-pink)] text-[8px] flex items-center justify-center text-white font-bold" title="Owner">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    </div>
                  </div>
                </div>

                <Link href={`/project/${project._id}`} className="absolute inset-0 z-0" aria-label={`Open ${project.title}`} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[var(--cosmic-secondary)] border border-[var(--cosmic-border)] rounded-2xl shadow-2xl overflow-hidden animate-slide-in-up" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-white mb-1">Create New Project</h2>
              <p className="text-sm text-[var(--text-muted)] mb-5">Give your new architecture diagram a name.</p>
              
              <form onSubmit={handleCreateProject}>
                <div className="mb-6">
                  <label className="block text-xs font-medium text-[var(--text-muted)] mb-2 uppercase tracking-wider">Project Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Scalable Microservices"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    autoFocus
                    required
                    className="w-full rounded-xl border border-[var(--cosmic-border)] px-4 py-2.5 text-sm outline-none transition-all focus:ring-1 focus:border-[var(--accent-purple)]/40 focus:ring-[var(--accent-purple)]/20 bg-[var(--cosmic-primary)] text-white shadow-inner"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" variant="primary" loading={creating}>Create Project</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
