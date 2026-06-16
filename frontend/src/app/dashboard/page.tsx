'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import BlueprintBackground from '@/components/BlueprintBackground';
import BlueprintCard from '@/components/BlueprintCard';
import Button from '@/components/Button';

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

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    } else if (user && token) {
      fetchProjects();
    }
  }, [user, loading, token, search]);

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

  if (loading) return null; // Or a loading spinner

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      {/* Top Nav */}
      <nav className="sticky top-0 z-40 bg-[var(--ink)] border-b border-[var(--grid-line)] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[var(--amber-signal)] text-[var(--ink)] flex items-center justify-center font-bold text-sm font-heading">
            AF
          </div>
          <h1 className="text-xl font-bold text-white font-heading">Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[var(--grid-line)]">{user?.name}</span>
          <Button variant="ghost" size="sm" onClick={() => {
            localStorage.removeItem('archflow_token');
            window.location.href = '/login';
          }}>
            Log out
          </Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <h2 className="text-3xl font-bold text-[var(--charcoal)] font-heading">Your Projects</h2>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 md:w-64 rounded-lg border border-[var(--grid-line)] px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:border-[var(--amber-signal)] bg-white"
            />
            <Button onClick={() => setIsModalOpen(true)}>New Project</Button>
          </div>
        </div>

        {projects.length === 0 ? (
          /* Empty State */
          <BlueprintBackground className="rounded-xl p-12 text-center" showCornerMarks={false}>
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 opacity-80 text-6xl">📐</div>
              <h3 className="text-2xl font-bold text-white font-heading mb-3">No projects yet</h3>
              <p className="text-[var(--grid-line)] mb-8">
                Create your first system architecture diagram and start collaborating in real-time.
              </p>
              <Button size="lg" onClick={() => setIsModalOpen(true)}>Create Project</Button>
            </div>
          </BlueprintBackground>
        ) : (
          /* Project Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <BlueprintCard key={project._id} variant="light" className="flex flex-col bg-white" hover>
                <div className="aspect-[4/3] bg-[var(--ink)] rounded-t-sm -mx-6 -mt-6 mb-4 relative overflow-hidden flex items-center justify-center bg-[radial-gradient(circle,var(--grid-line)_1px,transparent_1px)] [background-size:12px_12px]">
                   <span className="text-[var(--grid-line)] opacity-50 text-sm font-mono tracking-widest">DIAGRAM</span>
                </div>
                
                <h3 className="font-bold text-lg text-[var(--charcoal)] font-heading truncate mb-1">
                  {project.title}
                </h3>
                <p className="text-xs text-[var(--charcoal)] opacity-60 mb-4">
                  Updated {new Date(project.updatedAt).toLocaleDateString()}
                </p>
                
                <div className="mt-auto flex gap-2">
                  <Link href={`/project/${project._id}`} className="flex-1">
                    <Button variant="ghost" className="w-full text-[var(--ink)] border-[var(--grid-line)] hover:bg-[var(--ink)]">Open</Button>
                  </Link>
                  {project.ownerId === user?._id && (
                    <Button variant="danger" onClick={() => handleDeleteProject(project._id)} title="Delete">
                      🗑️
                    </Button>
                  )}
                </div>
              </BlueprintCard>
            ))}
          </div>
        )}
      </main>

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="animate-fade-in w-full max-w-md relative">
            <BlueprintCard variant="dark">
              <h2 className="text-xl font-bold text-white font-heading mb-4">New Project</h2>
              <form onSubmit={handleCreateProject}>
                <input
                  type="text"
                  placeholder="e.g. Scalable Auth Service"
                  value={newProjectTitle}
                  onChange={(e) => setNewProjectTitle(e.target.value)}
                  autoFocus
                  required
                  className="w-full rounded-lg border border-[var(--grid-line)] px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:border-[var(--amber-signal)] bg-[var(--ink)] text-white font-mono mb-6"
                />
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button type="submit" loading={creating}>Create</Button>
                </div>
              </form>
            </BlueprintCard>
          </div>
        </div>
      )}
    </div>
  );
}
