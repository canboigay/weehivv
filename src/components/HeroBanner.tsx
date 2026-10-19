import React from 'react';
import { ArrowRight, Key, Github, Sparkles, ShieldCheck, Send } from 'lucide-react';
import { PublicationSettings, ApiKeys, TabType } from '../types';

interface HeroBannerProps {
  onOpenSettings: () => void;
  onOpenStudio: () => void;
  onNavigateTab: (tab: TabType) => void;
  settings: PublicationSettings;
  apiKeys: ApiKeys;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ 
  onOpenSettings, 
  onOpenStudio, 
  onNavigateTab,
  settings, 
  apiKeys 
}) => {
  const hasLiveEmailKey = Boolean(
    (settings.activeProvider === 'resend' && apiKeys.resendApiKey) ||
    (settings.activeProvider === 'sendgrid' && apiKeys.sendgridApiKey)
  );

  return (
    <div className="border border-[#1e2029] bg-[#0d0e12] rounded-2xl p-6 sm:p-8 mb-8 space-y-6">
      {/* Top Meta Tag */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-4 border-b border-[#181a22]">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-slate-300 font-medium">Sovereign Newsletter Infrastructure</span>
        </div>
        <div className="text-slate-500 hidden sm:block">
          Open-Source Alternative to Beehiiv
        </div>
      </div>

      {/* Main Pitch */}
      <div className="max-w-3xl space-y-3">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          High-deliverability newsletters without SaaS vendor lock-in.
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
          WeeHivv gives you the complete deliverability engine — Microsoft Word-safe Outlook VML compilation, RFC 8058 one-click headers, 3-tier suppression, and live DNS-over-HTTPS audits. Plug in your own Resend or SendGrid key and send for free.
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
        <button
          onClick={onOpenStudio}
          className="px-4 py-2.5 rounded-xl font-semibold bg-[#ff5a36] hover:bg-[#e04622] text-white flex items-center space-x-2 transition-colors shadow-sm"
        >
          <span>Open Email Studio</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onOpenSettings}
          className="px-4 py-2.5 rounded-xl font-medium bg-[#14151c] hover:bg-[#1a1b24] text-slate-200 border border-[#232532] flex items-center space-x-2 transition-colors"
        >
          <Key className="w-3.5 h-3.5 text-slate-400" />
          <span>{hasLiveEmailKey ? 'Manage API Keys' : 'Plug Your Own Keys (BYOK)'}</span>
        </button>

        <a
          href="https://github.com/canboigay/weehivv"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2.5 rounded-xl font-medium text-slate-400 hover:text-white border border-transparent hover:border-[#232532] flex items-center space-x-1.5 transition-colors"
        >
          <Github className="w-3.5 h-3.5" />
          <span>Source Code</span>
        </a>
      </div>

      {/* Simple 3-Step Pathing Workflow */}
      <div className="pt-4 border-t border-[#181a22]">
        <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-3">
          Platform Pipeline & Navigation
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Step 1 */}
          <div 
            onClick={() => onNavigateTab('studio')}
            className="p-3.5 bg-[#121319] hover:bg-[#161720] border border-[#1e2029] hover:border-[#2f3242] rounded-xl cursor-pointer transition-all group"
          >
            <div className="flex items-center space-x-2 text-xs font-bold text-white mb-1">
              <span className="w-5 h-5 rounded-md bg-[#1a1c25] border border-[#262836] flex items-center justify-center text-[10px] font-mono text-orange-400">
                1
              </span>
              <span className="group-hover:text-orange-400 transition-colors">Compose & Compile</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Markdown editor, simulated subscriber merge tags, and automatic Outlook VML table compilation.
            </p>
          </div>

          {/* Step 2 */}
          <div 
            onClick={() => onNavigateTab('deliverability')}
            className="p-3.5 bg-[#121319] hover:bg-[#161720] border border-[#1e2029] hover:border-[#2f3242] rounded-xl cursor-pointer transition-all group"
          >
            <div className="flex items-center space-x-2 text-xs font-bold text-white mb-1">
              <span className="w-5 h-5 rounded-md bg-[#1a1c25] border border-[#262836] flex items-center justify-center text-[10px] font-mono text-cyan-400">
                2
              </span>
              <span className="group-hover:text-cyan-400 transition-colors">Audit & Sanitize</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Live Cloudflare DoH check for SPF/DMARC, disposable email blockers, and 3-layer suppression.
            </p>
          </div>

          {/* Step 3 */}
          <div 
            onClick={() => onNavigateTab('subscribers')}
            className="p-3.5 bg-[#121319] hover:bg-[#161720] border border-[#1e2029] hover:border-[#2f3242] rounded-xl cursor-pointer transition-all group"
          >
            <div className="flex items-center space-x-2 text-xs font-bold text-white mb-1">
              <span className="w-5 h-5 rounded-md bg-[#1a1c25] border border-[#262836] flex items-center justify-center text-[10px] font-mono text-emerald-400">
                3
              </span>
              <span className="group-hover:text-emerald-400 transition-colors">Audience & Dispatch</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              CSV import/export, 360° subscriber engagement history, and corporate scanner bot click filtering.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
