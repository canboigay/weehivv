import React from 'react';
import { ShieldCheck, Zap, ArrowRight, Key, Github, Terminal } from 'lucide-react';
import { PublicationSettings, ApiKeys } from '../types';

interface HeroBannerProps {
  onOpenSettings: () => void;
  onOpenStudio: () => void;
  settings: PublicationSettings;
  apiKeys: ApiKeys;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ 
  onOpenSettings, 
  onOpenStudio, 
  settings, 
  apiKeys 
}) => {
  const hasLiveEmailKey = Boolean(
    (settings.activeProvider === 'resend' && apiKeys.resendApiKey) ||
    (settings.activeProvider === 'sendgrid' && apiKeys.sendgridApiKey)
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#1f212c] bg-gradient-to-b from-[#12131a] to-[#0c0d12] p-6 sm:p-8 mb-8 shadow-xl">
      <div className="relative z-10 max-w-4xl space-y-4">
        
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#1b1c28] border border-[#2b2d3d] text-slate-300 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Sovereign Open Source Architecture</span>
          <span className="text-slate-500">•</span>
          <span>Zero SaaS Subscriptions Required</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          Production newsletter infrastructure with Outlook VML, RFC 8058 compliance, and BYOK dispatch.
        </h1>

        {/* Subtitle */}
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl font-normal">
          Designed as an open-source alternative to proprietary newsletter platforms. Manage subscriber lifecycles, preview live merge tags across simulated personas, compile Microsoft Word-compliant email HTML, and send via your own Resend or SendGrid credentials for free.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap gap-3 text-xs">
          <button
            onClick={onOpenStudio}
            className="px-4 py-2.5 rounded-xl font-bold bg-[#ff5a36] hover:bg-[#e04622] text-white flex items-center space-x-2 transition-all shadow-md shadow-orange-500/20"
          >
            <span>Open Email & Post Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenSettings}
            className={`px-4 py-2.5 rounded-xl font-semibold border flex items-center space-x-2 transition-all ${
              hasLiveEmailKey
                ? 'bg-[#181a24] text-emerald-300 border-emerald-500/30'
                : 'bg-[#181a24] text-slate-200 border-[#2a2c3a] hover:bg-[#202230]'
            }`}
          >
            <Key className="w-3.5 h-3.5 text-orange-400" />
            <span>{hasLiveEmailKey ? 'Configure Active Keys' : 'Plug Your Own API Keys (BYOK)'}</span>
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl font-semibold bg-[#12131a] hover:bg-[#1a1b24] text-slate-400 hover:text-white border border-[#232431] flex items-center space-x-1.5 transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>Deploy on Cloudflare Pages</span>
          </a>
        </div>

        {/* Technical specs strip */}
        <div className="pt-4 border-t border-[#1c1e28] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-slate-400">
          <div>
            <span className="block text-slate-500 text-[10px] uppercase">Engine</span>
            <span className="text-white font-medium">Vite + React + Edge</span>
          </div>
          <div>
            <span className="block text-slate-500 text-[10px] uppercase">Outlook Safety</span>
            <span className="text-white font-medium">MSO VML Table Compiler</span>
          </div>
          <div>
            <span className="block text-slate-500 text-[10px] uppercase">DNS Telemetry</span>
            <span className="text-white font-medium">Cloudflare 1.1.1.1 DoH</span>
          </div>
          <div>
            <span className="block text-slate-500 text-[10px] uppercase">Data Privacy</span>
            <span className="text-white font-medium">Client Encrypted Storage</span>
          </div>
        </div>

      </div>
    </div>
  );
};
