
import React from 'react';
import { 
  ArrowLeft, 
  Palette, 
  Type, 
  Component, 
  Layout, 
  Shapes,
  Mail,
  Zap,
  ShieldCheck,
  Check,
  ArrowRight,
  Database,
  BarChart3,
  Clock,
  Layers
} from 'lucide-react';

const ColorBlock = ({ color, name, hex }: { color: string, name: string, hex: string }) => (
  <div className="space-y-3">
    <div className={`h-24 w-full rounded-2xl shadow-sm border border-gray-100 ${color}`}></div>
    <div>
      <p className="font-bold text-gray-900 text-sm">{name}</p>
      <p className="text-xs text-gray-400 font-mono">{hex}</p>
    </div>
  </div>
);

const DesignSystem: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-32">
      {/* Design System Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => { window.location.hash = '#/'; }}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-500"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center space-x-3 border-l pl-4 border-gray-100">
              <img src="logo.png" alt="Orderpilot" className="h-6 w-auto" />
              <span className="font-bold text-gray-400">Design System</span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
            v1.0.0 — March 2025
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-16 space-y-24">
        {/* Branding & Logo */}
        <section>
          <div className="flex items-center space-x-3 mb-10">
            <div className="p-2.5 bg-orange-50 rounded-xl text-rb2-orange"><Layout size={24} /></div>
            <h2 className="text-3xl font-extrabold tracking-tight">Brand Identity</h2>
          </div>
          <div className="bg-white rounded-[2.5rem] p-12 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <h3 className="text-xl font-bold">The Primary Logo</h3>
              <p className="text-gray-500 leading-relaxed">
                The Orderpilot logo features two interlocking circles representing the seamless connection between disparate data sources and your core ERP systems.
              </p>
              <div className="flex items-center space-x-4">
                <button className="px-6 py-3 bg-gray-50 text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition">Download PNG</button>
                <button className="px-6 py-3 bg-gray-50 text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-100 transition">Download SVG</button>
              </div>
            </div>
            <div className="flex-1 bg-gray-50 rounded-3xl p-16 flex items-center justify-center border border-gray-100 border-dashed">
              <img src="logo.png" alt="Official Logo" className="h-16 w-auto" />
            </div>
          </div>
        </section>

        {/* Color Palette */}
        <section>
          <div className="flex items-center space-x-3 mb-10">
            <div className="p-2.5 bg-orange-50 rounded-xl text-rb2-orange"><Palette size={24} /></div>
            <h2 className="text-3xl font-extrabold tracking-tight">Color Palette</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            <ColorBlock color="bg-rb2-orange" name="Primary Orange" hex="#FF4500" />
            <ColorBlock color="bg-[#1B2430]" name="Heading Dark" hex="#1B2430" />
            <ColorBlock color="bg-gray-600" name="Body Text" hex="#4B5563" />
            <ColorBlock color="bg-gray-50" name="Subtle Background" hex="#F9FAFB" />
            <ColorBlock color="bg-orange-50" name="Primary Tint" hex="#FFF7ED" />
            <ColorBlock color="bg-green-500" name="Success Green" hex="#22C55E" />
          </div>
        </section>

        {/* Typography */}
        <section>
          <div className="flex items-center space-x-3 mb-10">
            <div className="p-2.5 bg-orange-50 rounded-xl text-rb2-orange"><Type size={24} /></div>
            <h2 className="text-3xl font-extrabold tracking-tight">Typography</h2>
          </div>
          <div className="bg-white rounded-[2.5rem] p-12 border border-gray-100 shadow-sm space-y-12">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-2">Headlines — Inter 800</p>
              <div className="space-y-6">
                <h1 className="text-7xl font-extrabold tracking-tight">The quick brown fox jumps</h1>
                <h2 className="text-5xl font-extrabold tracking-tight">Over the lazy dog</h2>
                <h3 className="text-3xl font-extrabold tracking-tight">A modern supply chain</h3>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-50 pb-2">Body Text — Inter 400 / 600</p>
              <div className="space-y-6 max-w-3xl">
                <p className="text-xl text-gray-600 leading-relaxed">
                  Eliminate manual data entry, reduce errors, and accelerate your order processing with AI-powered automation that keeps humans in control.
                </p>
                <p className="text-base text-gray-500 leading-relaxed">
                  Orderpilot automates the boring stuff so your team can focus on growth. Connect directly with your existing business systems without complex IT projects.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Components */}
        <section>
          <div className="flex items-center space-x-3 mb-10">
            <div className="p-2.5 bg-orange-50 rounded-xl text-rb2-orange"><Component size={24} /></div>
            <h2 className="text-3xl font-extrabold tracking-tight">Common Components</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Buttons */}
            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm space-y-8">
              <h3 className="font-bold text-gray-400 text-xs uppercase tracking-widest">Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-rb2-orange text-white rounded-2xl font-bold text-sm hover:bg-rb2-orange-hover transition flex items-center">
                  Primary Button <ArrowRight size={16} className="ml-2" />
                </button>
                <button className="px-8 py-4 bg-white text-gray-900 border border-gray-200 rounded-2xl font-bold text-sm hover:bg-gray-50 transition">
                  Secondary Button
                </button>
              </div>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-2.5 bg-rb2-orange text-white rounded-full font-bold text-xs hover:bg-rb2-orange-hover transition">
                  Pill Button
                </button>
                <button className="p-3 bg-gray-50 text-gray-400 hover:text-rb2-orange rounded-xl transition">
                  <Mail size={20} />
                </button>
              </div>
            </div>

            {/* Form Elements */}
            <div className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm space-y-8">
              <h3 className="font-bold text-gray-400 text-xs uppercase tracking-widest">Input States</h3>
              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Default state" 
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none" 
                />
                <input 
                  type="text" 
                  placeholder="Focus state" 
                  className="w-full px-5 py-4 bg-gray-50 border border-rb2-orange ring-4 ring-orange-500/10 rounded-2xl focus:outline-none" 
                />
              </div>
            </div>
          </div>
        </section>

        {/* Iconography */}
        <section>
          <div className="flex items-center space-x-3 mb-10">
            <div className="p-2.5 bg-orange-50 rounded-xl text-rb2-orange">
              <Shapes size={24} />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Iconography</h2>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
            {[
              { icon: Mail, name: 'Mail' },
              { icon: Zap, name: 'Zap' },
              { icon: ShieldCheck, name: 'Security' },
              { icon: Check, name: 'Check' },
              { icon: ArrowRight, name: 'Arrow' },
              { icon: Database, name: 'Database' },
              { icon: BarChart3, name: 'Analytics' },
              { icon: Clock, name: 'Time' },
              { icon: Layers, name: 'Integration' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col items-center justify-center space-y-3 shadow-sm hover:border-rb2-orange transition-colors">
                <item.icon size={28} className="text-gray-400" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">{item.name}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer Meta */}
      <footer className="max-w-7xl mx-auto px-6 mt-24 pt-12 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-400">Orderpilot Design System — Designed for High-Performance Supply Chains.</p>
        <p className="text-xs text-gray-300 mt-2">© 2025 Orderpilot by RB2. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default DesignSystem;
