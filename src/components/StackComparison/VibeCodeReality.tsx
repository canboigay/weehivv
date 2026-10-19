import React, { useState } from 'react';
import { 
  Layers, 
  DollarSign, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink, 
  HelpCircle,
  Shield,
  Zap,
  TrendingDown
} from 'lucide-react';
import { VIBE_CODED_STACK_ITEMS } from '../../data/mockData';

export const VibeCodeReality: React.FC = () => {
  const [items, setItems] = useState(VIBE_CODED_STACK_ITEMS);
  const [engineerHourlyRate, setEngineerHourlyRate] = useState(120);
  const [maintenanceHoursMonthly, setMaintenanceHoursMonthly] = useState(15);

  const totalSaaSCost = items.reduce((acc, item) => acc + item.monthlyCost, 0);
  const totalEngineerCost = engineerHourlyRate * maintenanceHoursMonthly;
  const grandTotalMonthly = totalSaaSCost + totalEngineerCost;
  const beehiivMonthly = 99;
  const annualSavings = (grandTotalMonthly - beehiivMonthly) * 12;

  const handleUpdateCost = (index: number, newCost: number) => {
    const updated = [...items];
    updated[index].monthlyCost = isNaN(newCost) ? 0 : newCost;
    setItems(updated);
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1b1219] via-[#161421] to-[#11121a] border border-pink-500/30 p-6 sm:p-8 rounded-2xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold">
            <Layers className="w-3.5 h-3.5" />
            <span>The Reality Check: Vibe-Coding vs Production Infrastructure</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            The Hidden <span className="text-pink-400">$34,000+/year</span> "Stitched-SaaS" Tax
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Anyone can prompt an AI to create a signup form and an API route. But maintaining 14 separate third-party subscriptions, handling webhook failures, updating DNS records, and keeping up with Litmus Outlook test matrices quickly becomes a full-time engineering headache.
          </p>
        </div>
      </div>

      {/* Comparison Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1 */}
        <div className="bg-[#14151d] border border-red-500/30 p-5 rounded-2xl relative">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Stitched DIY Stack (Monthly)
          </div>
          <div className="text-3xl font-extrabold text-red-400 font-mono">
            ${grandTotalMonthly.toLocaleString()}
            <span className="text-xs text-slate-400 font-sans font-normal ml-1">/ month</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 space-y-0.5">
            <div>• SaaS Subscriptions: <strong>${totalSaaSCost.toLocaleString()}</strong></div>
            <div>• Maintenance ({maintenanceHoursMonthly}h @ ${engineerHourlyRate}/h): <strong>${totalEngineerCost.toLocaleString()}</strong></div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#14151d] border border-emerald-500/30 p-5 rounded-2xl relative">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Beehiiv All-in-One Engine
          </div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">
            ${beehiivMonthly}
            <span className="text-xs text-slate-400 font-sans font-normal ml-1">/ month</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 space-y-0.5">
            <div>• All 14 services natively integrated</div>
            <div>• Zero maintenance hours & zero glue-code</div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#14151d] border border-orange-500/30 p-5 rounded-2xl relative">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Estimated Annual Savings
          </div>
          <div className="text-3xl font-extrabold text-orange-400 font-mono">
            ${annualSavings.toLocaleString()}
            <span className="text-xs text-slate-400 font-sans font-normal ml-1">/ year</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            <span className="text-emerald-400 font-bold">96.5% cost reduction</span> + immediate time-to-market.
          </div>
        </div>
      </div>

      {/* Interactive 14-Service Breakdown Table */}
      <div className="bg-[#14151d] border border-[#232431] p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span>Tyler Denk's 14-Service Backlog Audit</span>
              <span className="text-[10px] bg-white/10 text-slate-300 px-2 py-0.5 rounded font-mono">
                14 / 14 Cataloged
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Adjust any monthly cost below to model your custom DIY stack economics.
            </p>
          </div>

          <div className="flex items-center space-x-4 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <span>Hourly Dev Rate:</span>
              <input
                type="number"
                value={engineerHourlyRate}
                onChange={(e) => setEngineerHourlyRate(parseInt(e.target.value) || 0)}
                className="w-16 bg-[#1a1b24] border border-[#2a2c3a] rounded px-2 py-1 text-white font-mono text-xs"
              />
            </div>
            <div className="flex items-center space-x-1.5">
              <span>Monthly Dev Hours:</span>
              <input
                type="number"
                value={maintenanceHoursMonthly}
                onChange={(e) => setMaintenanceHoursMonthly(parseInt(e.target.value) || 0)}
                className="w-14 bg-[#1a1b24] border border-[#2a2c3a] rounded px-2 py-1 text-white font-mono text-xs"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#181923] text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#262837]">
              <tr>
                <th className="py-2.5 px-3">Service Category</th>
                <th className="py-2.5 px-3">Substituted Software / SaaS</th>
                <th className="py-2.5 px-3">Architectural Role & Hidden Complexity</th>
                <th className="py-2.5 px-3 text-right">Est. Monthly Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#20222e]">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#181923]/60 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-white whitespace-nowrap">
                    {item.category}
                  </td>
                  <td className="py-2.5 px-3 text-orange-400 font-mono">
                    {item.service}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px] max-w-md">
                    {item.notes}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">
                    <div className="inline-flex items-center space-x-1">
                      <span className="text-slate-500">$</span>
                      <input
                        type="number"
                        value={item.monthlyCost}
                        onChange={(e) => handleUpdateCost(idx, parseInt(e.target.value))}
                        className="w-20 text-right bg-[#0d0e13] border border-[#252737] rounded px-2 py-0.5 text-white font-mono text-xs focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-[#2c2d3d] bg-[#171822] font-bold text-xs">
              <tr>
                <td colSpan={3} className="py-3 px-3 text-right uppercase text-slate-400">
                  Total Monthly SaaS Fees:
                </td>
                <td className="py-3 px-3 text-right text-red-400 font-mono text-sm">
                  ${totalSaaSCost.toLocaleString()} / mo
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Architectural Topology Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fragile Vibe Coded Stack */}
        <div className="bg-[#14151d] border border-red-500/30 p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h3 className="text-sm font-bold text-white">Fragile Stitched DIY Architecture</h3>
          </div>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="p-3 bg-[#191a24] rounded-xl border border-red-500/20">
              <strong className="text-red-300">14 Isolated Vendor Silos:</strong> Webhook retries fail silently between Stripe, Supabase, SendGrid, and Inngest.
            </div>
            <div className="p-3 bg-[#191a24] rounded-xl border border-red-500/20">
              <strong className="text-red-300">Manual IP Reputation Management:</strong> You are on the hook if Barracuda or Spamhaus flags your IP pool on a Friday evening.
            </div>
            <div className="p-3 bg-[#191a24] rounded-xl border border-red-500/20">
              <strong className="text-red-300">Distorted Metrics:</strong> Without Omnivery bot filtering, corporate security scanners will falsely inflate your click reports.
            </div>
          </div>
        </div>

        {/* Unified Beehiiv Engine */}
        <div className="bg-[#14151d] border border-emerald-500/30 p-6 rounded-2xl space-y-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Unified Beehiiv Enterprise Engine</h3>
          </div>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="p-3 bg-[#191a24] rounded-xl border border-emerald-500/20">
              <strong className="text-emerald-300">Single Source of Truth:</strong> One unified database for subscribers, campaigns, dynamic sections, and suppression tiers.
            </div>
            <div className="p-3 bg-[#191a24] rounded-xl border border-emerald-500/20">
              <strong className="text-emerald-300">Autonomous 24/7 Sentinels:</strong> Instant circuit-breaker rotates flagged IPs within 500ms without human intervention.
            </div>
            <div className="p-3 bg-[#191a24] rounded-xl border border-emerald-500/20">
              <strong className="text-emerald-300">Litmus-Grade Email Compiler:</strong> Automatic MSO/VML generation ensures bulletproof layout in Outlook 2016-2024.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
