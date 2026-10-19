import React from 'react';
import { TabType, PublicationSettings, ApiKeys } from '../types';
import { 
  Key, 
  Send, 
  ShieldCheck, 
  Users, 
  Terminal, 
  Activity, 
  Layers,
  Settings,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onSendSimulation: () => void;
  isSending: boolean;
  onOpenSettings: () => void;
  settings: PublicationSettings;
  apiKeys: ApiKeys;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onSendSimulation,
  isSending,
  onOpenSettings,
  settings,
  apiKeys,
}) => {
  const hasLiveEmailKey = Boolean(
    (settings.activeProvider === 'resend' && apiKeys.resendApiKey) ||
    (settings.activeProvider === 'sendgrid' && apiKeys.sendgridApiKey) ||
    (settings.activeProvider === 'postmark' && apiKeys.postmarkToken)
  );

  return (
    <header className="sticky top-0 z-50 border-b border-[#1c1d27] bg-[#090a0d]/95 backdrop-blur-md">
      {/* Telemetry Status Bar */}
      <div className="bg-[#101117] px-4 sm:px-6 py-1.5 text-xs text-slate-400 border-b border-[#181923] flex items-center justify-between">
        <div className="flex items-center space-x-6 overflow-x-auto text-[11px] font-mono">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-slate-300 font-medium">99.34% SLA Delivery Rate</span>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5">
            <Activity className="w-3 h-3 text-orange-400" />
            <span>Capacity: <strong className="text-white">3.2M msgs/min</strong></span>
          </div>

          <div className="hidden md:flex items-center space-x-1.5">
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            <span>RFC 8058 One-Click: <strong className="text-emerald-400">Strict Active</strong></span>
          </div>

          <div className="hidden lg:flex items-center space-x-1.5">
            <span>Active Sending Node: </span>
            <span className={hasLiveEmailKey ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
              {hasLiveEmailKey ? `${settings.activeProvider.toUpperCase()} (Live)` : 'Cloudflare Edge Simulator'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <button
            onClick={onOpenSettings}
            className={`px-2 py-0.5 rounded font-mono border flex items-center space-x-1 transition-colors ${
              hasLiveEmailKey
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                : 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20'
            }`}
          >
            <Key className="w-3 h-3" />
            <span>{hasLiveEmailKey ? 'BYOK Connected' : 'Plug Your Keys'}</span>
          </button>
          <span className="text-slate-600">|</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-white hidden sm:inline"
          >
            Open Source v1.0
          </a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setActiveTab('overview')}
              className="flex items-center space-x-2.5 focus:outline-none text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-[#ff5a36] flex items-center justify-center font-black text-white text-sm shadow-md shadow-orange-500/20">
                W
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-base font-extrabold tracking-tight text-white font-sans">
                    WeeHivv
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#1d1f2b] text-slate-300 rounded border border-[#2c2f42]">
                    OSS
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono -mt-0.5">
                  {settings.publicationName}
                </div>
              </div>
            </button>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'studio', label: 'Studio & Editor', icon: Sparkles },
              { id: 'deliverability', label: 'Deliverability & DNS', icon: ShieldCheck },
              { id: 'subscribers', label: 'Subscribers & CRM', icon: Users },
              { id: 'stack-comparison', label: 'Stack Economics', icon: Layers },
              { id: 'api-mcp', label: 'API & MCP', icon: Terminal },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                    isActive
                      ? 'bg-[#1e202c] text-white shadow-xs border border-[#2b2e40]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg bg-[#14151d] border border-[#242636] text-slate-300 hover:text-white hover:bg-[#1a1c27] transition-colors"
              title="Configure API Keys & Publication"
            >
              <Settings className="w-4 h-4" />
            </button>

            <button
              onClick={onSendSimulation}
              disabled={isSending}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md ${
                isSending 
                  ? 'bg-orange-600/50 text-orange-200 cursor-not-allowed'
                  : 'bg-[#ff5a36] hover:bg-[#e04622] text-white shadow-orange-500/20 active:scale-95'
              }`}
            >
              <Send className={`w-3.5 h-3.5 ${isSending ? 'animate-spin' : ''}`} />
              <span>{isSending ? 'Dispatching...' : hasLiveEmailKey ? 'Send Live Blast' : 'Test Send'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bar */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 border-t border-[#181923] space-x-2 text-xs">
        {['overview', 'studio', 'deliverability', 'subscribers', 'stack-comparison', 'api-mcp'].map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t as TabType)}
            className={`px-2.5 py-1 rounded capitalize whitespace-nowrap ${activeTab === t ? 'bg-[#222434] text-white font-bold' : 'text-slate-400'}`}
          >
            {t.replace('-', ' ')}
          </button>
        ))}
      </div>
    </header>
  );
};
