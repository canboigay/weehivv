import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Filter, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Server,
  Mail,
  Zap,
  Globe
} from 'lucide-react';
import { TabType } from '../types';

interface OverviewProps {
  onNavigateTab: (tab: TabType) => void;
  isSending: boolean;
}

export const Overview: React.FC<OverviewProps> = ({ onNavigateTab, isSending }) => {
  const [liveThroughput, setLiveThroughput] = useState(3180400);
  const [pipelineEvents] = useState<string[]>([
    '09:04:12 - [Pipeline] Edge Node #08 dispatched 54,000 msgs to Gmail MX (0.01% bounce)',
    '09:04:09 - [Bot Shield] Barracuda Security scanner clicked 4 links in 2ms -> Click filtered from analytics',
    '09:04:06 - [Suppression] 550 User Unknown from oldcorp.net -> Auto-promoted to Global Suppression',
    '09:04:01 - [RFC 8058] Yahoo One-Click POST unsubscribe token verified -> 200 OK recorded',
    '09:03:55 - [RBL Sentinel] Spamhaus ZEN & Barracuda polling cycle: ALL 64 IPs Clean'
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveThroughput(prev => {
        const delta = Math.floor((Math.random() - 0.48) * 12000);
        return Math.max(3050000, Math.min(3450000, prev + delta));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1 */}
        <div className="bg-[#0e0f14] border border-[#1e2029] p-4 rounded-xl">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Delivery Rate</span>
            <span className="text-emerald-400 font-semibold font-mono">SLA Pass</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono tracking-tight">
            99.34%
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dedicated warm IP pools & FBL active
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#0e0f14] border border-[#1e2029] p-4 rounded-xl">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Throughput Capacity</span>
            <span className="text-slate-300 font-mono">Realtime</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono tracking-tight">
            {(liveThroughput / 1000000).toFixed(2)}M <span className="text-xs font-normal text-slate-400 font-sans">/ min</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Distributed edge queue clusters
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#0e0f14] border border-[#1e2029] p-4 rounded-xl">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Filtered Click Rate</span>
            <span className="text-slate-400 font-mono text-[10px]">Omnivery</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono tracking-tight">
            8.92% <span className="text-xs font-normal text-slate-500 line-through">14.3%</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Corporate security bot clicks removed
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#0e0f14] border border-[#1e2029] p-4 rounded-xl">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>Active Audience</span>
            <span className="text-slate-300 font-mono">+14% MoM</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono tracking-tight">
            284,590
          </div>
          <p className="text-xs text-slate-400 mt-1">
            4.8 / 5.0 avg engagement score
          </p>
        </div>
      </div>

      {/* 2-Column: Live Pipeline Stream vs Provider Inbox Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Pipeline Log */}
        <div className="lg:col-span-7 bg-[#0e0f14] border border-[#1e2029] p-5 rounded-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#181a22]">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <h3 className="text-xs font-bold text-white tracking-wider uppercase">
                Sending Pipeline Event Stream
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Latency: 18ms</span>
          </div>

          <div className="bg-[#08090c] border border-[#171821] rounded-lg p-3 font-mono text-[11px] text-slate-300 space-y-1.5 overflow-hidden">
            {pipelineEvents.map((evt, idx) => (
              <div key={idx} className="truncate text-slate-400 hover:text-slate-200 transition-colors">
                {evt}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-xs font-mono text-slate-400 text-center">
            <div className="bg-[#121319] p-2.5 rounded-lg border border-[#1a1c26]">
              <div className="text-white font-bold">RFC 8058</div>
              <div className="text-[10px] text-slate-500 mt-0.5">One-Click Headers</div>
            </div>
            <div className="bg-[#121319] p-2.5 rounded-lg border border-[#1a1c26]">
              <div className="text-white font-bold">Word MSO</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Outlook VML Safe</div>
            </div>
            <div className="bg-[#121319] p-2.5 rounded-lg border border-[#1a1c26]">
              <div className="text-white font-bold">3-Tier Matrix</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Suppression Sync</div>
            </div>
          </div>
        </div>

        {/* Mailbox Provider Health */}
        <div className="lg:col-span-5 bg-[#0e0f14] border border-[#1e2029] p-5 rounded-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#181a22]">
              <h3 className="text-xs font-bold text-white tracking-wider uppercase">
                Mailbox Provider Health
              </h3>
              <span className="text-[11px] font-mono text-emerald-400">100% Reputation</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Google Workspace & Gmail</span>
                  <span className="font-mono text-white">99.6%</span>
                </div>
                <div className="w-full bg-[#181922] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '99.6%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Apple Mail & iCloud</span>
                  <span className="font-mono text-white">99.4%</span>
                </div>
                <div className="w-full bg-[#181922] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '99.4%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Yahoo & AOL (CFL Enrolled)</span>
                  <span className="font-mono text-white">99.1%</span>
                </div>
                <div className="w-full bg-[#181922] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '99.1%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Microsoft Outlook 365 (SNDS)</span>
                  <span className="font-mono text-white">98.9%</span>
                </div>
                <div className="w-full bg-[#181922] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '98.9%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#181a22] flex items-center justify-between text-[11px] text-slate-400">
            <span>DMARC Enforcement:</span>
            <span className="text-white font-mono font-medium">p=reject Active</span>
          </div>
        </div>
      </div>

      {/* Clean 3-Category Architecture Verification */}
      <div className="bg-[#0e0f14] border border-[#1e2029] p-5 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#181a22]">
          <div>
            <h3 className="text-xs font-bold text-white tracking-wider uppercase">
              Engine Pillar Verification
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Structured into Deliverability, Authoring, and Audience workflows.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('studio')}
            className="text-xs text-orange-400 hover:text-orange-300 font-medium flex items-center space-x-1"
          >
            <span>Open Studio Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Section 1 */}
          <div className="p-3.5 bg-[#121319] border border-[#1c1e28] rounded-xl space-y-2.5">
            <div className="text-xs font-bold text-white flex items-center justify-between">
              <span>Deliverability & Protocol</span>
              <span className="text-[10px] font-mono text-slate-500">5 Pillars</span>
            </div>
            <ul className="text-xs text-slate-400 space-y-1.5">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>RFC 8058 One-Click Header & POST</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>3-Layer Granular Suppression Matrix</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>30-Day IP & Domain Warmup Schedule</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>24/7 Blocklist (RBL) Circuit Breaker</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Bounce Matrix (5xx Hard vs 4xx Soft)</span>
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="p-3.5 bg-[#121319] border border-[#1c1e28] rounded-xl space-y-2.5">
            <div className="text-xs font-bold text-white flex items-center justify-between">
              <span>Authoring & Rendering</span>
              <span className="text-[10px] font-mono text-slate-500">5 Pillars</span>
            </div>
            <ul className="text-xs text-slate-400 space-y-1.5">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Outlook Word MSO VML Button Compiler</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Email Video Media Sanitizer with Thumbnail</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Simulated Persona Merge Tag Replacement</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Dynamic Content Segmentation Blocks</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Subject Line A/B Test Optimization Flow</span>
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="p-3.5 bg-[#121319] border border-[#1c1e28] rounded-xl space-y-2.5">
            <div className="text-xs font-bold text-white flex items-center justify-between">
              <span>Audience & Integration</span>
              <span className="text-[10px] font-mono text-slate-500">5 Pillars</span>
            </div>
            <ul className="text-xs text-slate-400 space-y-1.5">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Corporate Security Scanner Click Filter</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>360° Engagement Scoring & UTM History</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Disposable Domain & Typo Detection</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Bidirectional CSV Import & JSON Backups</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>BYOK Support for Resend, Groq, and SendGrid</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
