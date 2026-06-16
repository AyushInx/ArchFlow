'use client';

import React, { useState } from 'react';
import BlueprintBackground from '@/components/BlueprintBackground';
import BlueprintCard from '@/components/BlueprintCard';
import Button from '@/components/Button';

const colorTokens = [
  { name: 'ink', hex: '#0F1B2D', usage: 'Canvas background, top nav, dark surfaces' },
  { name: 'slate', hex: '#1B2A41', usage: 'Cards/panels on dark surfaces' },
  { name: 'grid-line', hex: '#2D4A66', usage: 'Dotted canvas grid, dividers, borders' },
  { name: 'paper', hex: '#F6F4EF', usage: 'Dashboard & auth backgrounds (light)' },
  { name: 'charcoal', hex: '#2B2F38', usage: 'Body text on light surfaces' },
  { name: 'amber-signal', hex: '#E8A23D', usage: 'Primary actions (Save, Create)' },
  { name: 'teal-circuit', hex: '#45B8A4', usage: 'Collaboration, success states' },
  { name: 'coral-alert', hex: '#E2614B', usage: 'Delete/destructive actions' },
];

export default function ThemeShowcasePage() {
  const [loadingBtn, setLoadingBtn] = useState<string | null>(null);

  const handleLoadingDemo = (id: string) => {
    setLoadingBtn(id);
    setTimeout(() => setLoadingBtn(null), 2000);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--paper)' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 border-b backdrop-blur-sm"
        style={{
          backgroundColor: 'rgba(15, 27, 45, 0.95)',
          borderColor: 'var(--grid-line)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm"
              style={{
                backgroundColor: 'var(--amber-signal)',
                color: 'var(--ink)',
                fontFamily: 'var(--font-heading)',
              }}
            >
              AF
            </div>
            <h1
              className="text-xl font-bold text-white"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              ArchFlow
            </h1>
            <span
              className="text-xs px-2 py-0.5 rounded-full ml-2"
              style={{
                backgroundColor: 'var(--grid-line)',
                color: 'var(--teal-circuit)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              DESIGN SYSTEM
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* === SECTION: Color Tokens === */}
        <section>
          <SectionTitle>Color Tokens</SectionTitle>
          <p className="text-sm mb-6" style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
            The blueprint palette — designed for technical schematics and architectural interfaces.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {colorTokens.map((token) => (
              <div
                key={token.name}
                className="rounded-lg border overflow-hidden transition-transform hover:scale-[1.02]"
                style={{ borderColor: 'var(--grid-line)' }}
              >
                <div
                  className="h-20 flex items-end px-3 pb-2"
                  style={{ backgroundColor: token.hex }}
                >
                  <span
                    className="text-xs font-mono px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      color: '#fff',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {token.hex}
                  </span>
                </div>
                <div className="p-3" style={{ backgroundColor: 'white' }}>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: 'var(--charcoal)', fontFamily: 'var(--font-mono)' }}
                  >
                    --{token.name}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--charcoal)', opacity: 0.6 }}>
                    {token.usage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* === SECTION: Typography === */}
        <section>
          <SectionTitle>Typography</SectionTitle>
          <div className="grid md:grid-cols-3 gap-6">
            <div
              className="rounded-lg border p-6"
              style={{ borderColor: 'var(--grid-line)', backgroundColor: 'white' }}
            >
              <span
                className="text-xs uppercase tracking-wider mb-3 block"
                style={{ color: 'var(--teal-circuit)', fontFamily: 'var(--font-mono)' }}
              >
                Headings
              </span>
              <p
                className="text-3xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--charcoal)' }}
              >
                Space Grotesk
              </p>
              <p
                className="text-lg"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--charcoal)' }}
              >
                Geometric, technical, drafting-table feel
              </p>
              <div className="mt-4 space-y-1" style={{ fontFamily: 'var(--font-heading)' }}>
                <p className="text-4xl font-bold" style={{ color: 'var(--charcoal)' }}>Aa</p>
                <p className="text-2xl font-semibold" style={{ color: 'var(--charcoal)' }}>
                  H2 Heading
                </p>
                <p className="text-xl" style={{ color: 'var(--charcoal)' }}>H3 Heading</p>
              </div>
            </div>

            <div
              className="rounded-lg border p-6"
              style={{ borderColor: 'var(--grid-line)', backgroundColor: 'white' }}
            >
              <span
                className="text-xs uppercase tracking-wider mb-3 block"
                style={{ color: 'var(--teal-circuit)', fontFamily: 'var(--font-mono)' }}
              >
                Body Text
              </span>
              <p
                className="text-3xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--charcoal)' }}
              >
                Inter
              </p>
              <p
                className="text-lg"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--charcoal)' }}
              >
                Clean and readable for forms and dashboards
              </p>
              <div
                className="mt-4 space-y-1 text-sm leading-relaxed"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--charcoal)' }}
              >
                <p>
                  Design a scalable URL shortener with a load balancer, API gateway, cache layer,
                  and distributed database with read replicas.
                </p>
              </div>
            </div>

            <div
              className="rounded-lg border p-6"
              style={{ borderColor: 'var(--grid-line)', backgroundColor: 'white' }}
            >
              <span
                className="text-xs uppercase tracking-wider mb-3 block"
                style={{ color: 'var(--teal-circuit)', fontFamily: 'var(--font-mono)' }}
              >
                Code / Labels
              </span>
              <p
                className="text-3xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--charcoal)' }}
              >
                JetBrains Mono
              </p>
              <p
                className="text-lg"
                style={{ fontFamily: 'var(--font-mono)', color: 'var(--charcoal)' }}
              >
                Reinforces the &quot;schematic&quot; identity
              </p>
              <div
                className="mt-4 p-3 rounded text-sm"
                style={{
                  backgroundColor: 'var(--ink)',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--teal-circuit)',
                }}
              >
                <p>{'{ "type": "LoadBalancer" }'}</p>
                <p>{'  "connections": 3'}</p>
                <p>{'  "status": "active"'}</p>
              </div>
            </div>
          </div>
        </section>

        {/* === SECTION: Buttons === */}
        <section>
          <SectionTitle>Buttons</SectionTitle>
          <div className="space-y-8">
            {/* Variants */}
            <div>
              <SubTitle>Variants</SubTitle>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="primary">Save Diagram</Button>
                <Button variant="teal">Generate with AI</Button>
                <Button variant="danger">Delete Project</Button>
                <Button variant="ghost">Cancel</Button>
              </div>
            </div>

            {/* Sizes */}
            <div>
              <SubTitle>Sizes</SubTitle>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="primary" size="sm">
                  Small
                </Button>
                <Button variant="primary" size="md">
                  Medium
                </Button>
                <Button variant="primary" size="lg">
                  Large
                </Button>
              </div>
            </div>

            {/* States */}
            <div>
              <SubTitle>States</SubTitle>
              <div className="flex flex-wrap gap-4 items-center">
                <Button variant="primary" disabled>
                  Disabled
                </Button>
                <Button
                  variant="primary"
                  loading={loadingBtn === 'demo'}
                  onClick={() => handleLoadingDemo('demo')}
                >
                  {loadingBtn === 'demo' ? 'Saving...' : 'Click to Load'}
                </Button>
                <Button
                  variant="teal"
                  loading={loadingBtn === 'ai'}
                  onClick={() => handleLoadingDemo('ai')}
                >
                  {loadingBtn === 'ai' ? 'Generating...' : 'AI Generate'}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* === SECTION: Blueprint Background === */}
        <section>
          <SectionTitle>Blueprint Background</SectionTitle>
          <p className="text-sm mb-6" style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
            The canvas background — dark ink with faint dotted grid and corner registration marks.
          </p>
          <BlueprintBackground className="rounded-xl h-80 flex items-center justify-center">
            <div className="text-center">
              <p
                className="text-2xl font-bold text-white mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Canvas Area
              </p>
              <p className="text-sm" style={{ color: 'var(--grid-line)' }}>
                Drag components here to build your architecture
              </p>
            </div>
          </BlueprintBackground>
        </section>

        {/* === SECTION: Cards === */}
        <section>
          <SectionTitle>Blueprint Cards</SectionTitle>
          <div className="grid md:grid-cols-3 gap-6">
            <BlueprintBackground className="rounded-xl p-6">
              <BlueprintCard variant="dark">
                <h3
                  className="text-lg font-bold text-white mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Dark Card
                </h3>
                <p className="text-sm" style={{ color: 'var(--grid-line)' }}>
                  Used on dark canvas surfaces. Slate background with grid-line borders.
                </p>
                <div className="mt-4">
                  <Button variant="primary" size="sm">
                    Action
                  </Button>
                </div>
              </BlueprintCard>
            </BlueprintBackground>

            <div className="rounded-xl p-6 border" style={{ borderColor: 'var(--grid-line)' }}>
              <BlueprintCard variant="light">
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ fontFamily: 'var(--font-heading)', color: 'var(--charcoal)' }}
                >
                  Light Card
                </h3>
                <p className="text-sm" style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
                  Used on paper backgrounds. For auth forms and dashboard panels.
                </p>
                <div className="mt-4">
                  <Button variant="primary" size="sm">
                    Action
                  </Button>
                </div>
              </BlueprintCard>
            </div>

            <BlueprintBackground className="rounded-xl p-6">
              <BlueprintCard variant="dark">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                    style={{ backgroundColor: 'var(--grid-line)', color: 'var(--amber-signal)' }}
                  >
                    ⚙️
                  </div>
                  <div>
                    <h3
                      className="text-sm font-bold text-white"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      Microservice
                    </h3>
                    <p
                      className="text-xs"
                      style={{ color: 'var(--grid-line)', fontFamily: 'var(--font-mono)' }}
                    >
                      auth-service:8080
                    </p>
                  </div>
                </div>
                <p className="text-xs" style={{ color: 'var(--teal-circuit)' }}>
                  ● Connected
                </p>
              </BlueprintCard>
            </BlueprintBackground>
          </div>
        </section>

        {/* === SECTION: Sample Node Preview === */}
        <section>
          <SectionTitle>Sample Node Components</SectionTitle>
          <p className="text-sm mb-6" style={{ color: 'var(--charcoal)', opacity: 0.7 }}>
            Preview of how system-design nodes will look on the canvas.
          </p>
          <BlueprintBackground className="rounded-xl p-8">
            <div className="flex flex-wrap gap-4 justify-center">
              {[
                { icon: '🖥️', label: 'Client', sublabel: 'web-app' },
                { icon: '📱', label: 'Mobile App', sublabel: 'ios-app' },
                { icon: '🚪', label: 'API Gateway', sublabel: 'kong:8000' },
                { icon: '⚖️', label: 'Load Balancer', sublabel: 'nginx' },
                { icon: '⚙️', label: 'Microservice', sublabel: 'user-svc' },
                { icon: '🗄️', label: 'Database', sublabel: 'mongodb' },
                { icon: '⚡', label: 'Cache', sublabel: 'redis:6379' },
                { icon: '📬', label: 'Queue', sublabel: 'rabbitmq' },
                { icon: '🌐', label: 'CDN', sublabel: 'cloudflare' },
                { icon: '💾', label: 'Storage', sublabel: 's3-bucket' },
              ].map((node) => (
                <div
                  key={node.label}
                  className="rounded-lg border px-4 py-3 min-w-[140px] text-center transition-all duration-200 hover:scale-105 hover:border-[var(--amber-signal)] cursor-pointer"
                  style={{
                    backgroundColor: 'var(--slate)',
                    borderColor: 'var(--grid-line)',
                  }}
                >
                  <div className="text-2xl mb-1">{node.icon}</div>
                  <p
                    className="text-sm font-semibold text-white"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {node.label}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{
                      color: 'var(--grid-line)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {node.sublabel}
                  </p>
                </div>
              ))}
            </div>
          </BlueprintBackground>
        </section>

        {/* === SECTION: Input Fields === */}
        <section>
          <SectionTitle>Form Inputs</SectionTitle>
          <div className="max-w-md space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--charcoal)', fontFamily: 'var(--font-body)' }}
              >
                Email Address
              </label>
              <input
                type="email"
                placeholder="engineer@archflow.dev"
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-2"
                style={{
                  borderColor: 'var(--grid-line)',
                  backgroundColor: 'white',
                  color: 'var(--charcoal)',
                  fontFamily: 'var(--font-body)',
                }}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--charcoal)', fontFamily: 'var(--font-body)' }}
              >
                Project Name
              </label>
              <input
                type="text"
                placeholder="URL Shortener System"
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-2"
                style={{
                  borderColor: 'var(--grid-line)',
                  backgroundColor: 'white',
                  color: 'var(--charcoal)',
                  fontFamily: 'var(--font-body)',
                }}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--coral-alert)' }}
              >
                Error State
              </label>
              <input
                type="email"
                defaultValue="invalid-email"
                className="w-full rounded-lg border-2 px-4 py-2.5 text-sm outline-none"
                style={{
                  borderColor: 'var(--coral-alert)',
                  backgroundColor: 'white',
                  color: 'var(--charcoal)',
                  fontFamily: 'var(--font-body)',
                }}
              />
              <p
                className="text-xs mt-1"
                style={{ color: 'var(--coral-alert)', fontFamily: 'var(--font-body)' }}
              >
                Please enter a valid email address
              </p>
            </div>
          </div>
        </section>

        {/* === SECTION: Status Indicators === */}
        <section>
          <SectionTitle>Status Indicators</SectionTitle>
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: 'var(--teal-circuit)' }}
              />
              <span className="text-sm" style={{ color: 'var(--charcoal)' }}>
                Live / Connected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: 'var(--amber-signal)' }}
              />
              <span className="text-sm" style={{ color: 'var(--charcoal)' }}>
                Saving...
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: 'var(--coral-alert)' }}
              />
              <span className="text-sm" style={{ color: 'var(--charcoal)' }}>
                Error / Disconnected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: 'var(--grid-line)' }}
              />
              <span className="text-sm" style={{ color: 'var(--charcoal)' }}>
                Idle
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="border-t mt-20 py-8 text-center"
        style={{ borderColor: 'var(--grid-line)' }}
      >
        <p
          className="text-xs"
          style={{ color: 'var(--charcoal)', opacity: 0.5, fontFamily: 'var(--font-mono)' }}
        >
          ArchFlow Design System v1.0 — Blueprint Theme
        </p>
      </footer>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h2
        className="text-2xl font-bold"
        style={{ fontFamily: 'var(--font-heading)', color: 'var(--charcoal)' }}
      >
        {children}
      </h2>
      <div
        className="mt-2 h-0.5 w-16 rounded-full"
        style={{ backgroundColor: 'var(--amber-signal)' }}
      />
    </div>
  );
}

function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-sm font-medium uppercase tracking-wider mb-3"
      style={{ color: 'var(--charcoal)', opacity: 0.6, fontFamily: 'var(--font-mono)' }}
    >
      {children}
    </h3>
  );
}
