'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import BlueprintCard from '@/components/BlueprintCard';
import Button from '@/components/Button';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.errors?.[0]?.msg || 'Failed to login');
      }

      login(data.token, data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--paper)] relative">
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[radial-gradient(circle,var(--ink)_1px,transparent_1px)] [background-size:24px_24px]" />
      
      <div className="w-full max-w-md animate-fade-in z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-[var(--amber-signal)] text-[var(--ink)] flex items-center justify-center font-bold text-xl mx-auto mb-4 font-heading">
            AF
          </div>
          <h1 className="text-3xl font-bold text-[var(--charcoal)] font-heading">Welcome back</h1>
          <p className="text-[var(--grid-line)] mt-2">Log in to continue building architectures.</p>
        </div>

        <BlueprintCard variant="light" className="bg-white">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded bg-[var(--coral-alert)]/10 border border-[var(--coral-alert)] text-[var(--coral-alert)] text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[var(--charcoal)] mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-[var(--grid-line)] px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:border-[var(--amber-signal)]"
                placeholder="engineer@archflow.dev"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--charcoal)] mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-[var(--grid-line)] px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:border-[var(--amber-signal)]"
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full mt-2" loading={loading}>
              Log in
            </Button>
          </form>

          <p className="text-center text-sm text-[var(--grid-line)] mt-6">
            Don't have an account?{' '}
            <Link href="/signup" className="text-[var(--amber-signal)] font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </BlueprintCard>
      </div>
    </div>
  );
}
