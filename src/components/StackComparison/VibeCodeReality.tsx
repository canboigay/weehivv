import React, { useState } from 'react';
import { 
  Layers, 
  DollarSign, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { VIBE_CODED_STACK_ITEMS } from '../../data/mockData';

export const VibeCodeReality: React.FC = () => {
  const [items, setItems] = useState(VIBE_CODED_STACK_ITEMS);
  const [engineerHourlyRate, setEngineerHourlyRate] = useState(120);
  const [maintenanceHoursMonthly, setMaintenanceHoursMonthly] = useState(15);

  const totalSaaSCost = items.reduce((acc, item) => acc + item.monthlyCost, 0);
  const totalEngineerCost = engineerHourlyRate * maintenanceHoursMonthly;
  const grandTotalMonthly = totalSaaSCost + totalEngineerCost;
  const hiveOsCost = 0; // Self-hosted BYOK
  const annualSavings = (grandTotalMonthly - hiveOsCost) * 12;

  const handleUpdateCost = (index: number, newCost: number) => {
    const updated = [...items];
    updated[index].monthlyCost = isNaN(newCost) ? 0 : newCost;
    setItems(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border border-[#1e2029] bg-[#0e0f14] p-6 rounded-2xl space-y-2">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
          Economic Architecture Model
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          The Hidden Cost of Stitched Infrastructure
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Stitching 13 separate SaaS tools (SendGrid, Supabase, Inngest, ZeroBounce, Litmus, Omnivery, Datadog) introduces recurring subscription costs and significant engineering maintenance. HiveOS bundles this functionality into a single self-hostable edge application.
        </p>
      </div>

      {/* 3 Metric Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0e0f14] border border-[#1e2029] p-5 rounded-xl">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            DIY Stitched Stack (Monthly)
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            ${grandTotalMonthly.toLocaleString()}
            <span className="text-xs text-slate-400 font-sans font-normal ml-1">/ month</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 space-y-0.5">
            <div>• SaaS Subscriptions: ${totalSaaSCost.toLocaleString()}</div>
            <div>• Dev Time ({maintenanceHoursMonthly}h @ ${engineerHourlyRate}/h): ${totalEngineerCost.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-[#0e0f14] border border-[#1e2029] p-5 rounded-xl">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            HiveOS BYOK (Self-Hosted)
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
            $0
            <span className="text-xs text-slate-400 font-sans font-normal ml-1">/ month</span>
          </div>
          <div className="mt-2 text-xs text-slate-400 space-y-0.5">
            <div>• Zero platform subscription fees</div>
            <div>• Cloudflare Pages free global edge hosting</div>
          </div>
        </div>

        <div className="bg-[#0e0f14] border border-[#1e2029] p-5 rounded-xl">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            Annual Cost Avoidance
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-orange-400 font-mono">
            ${annualSavings.toLocaleString()}
            <span className="text-xs text-slate-400 font-sans font-normal ml-1">/ year</span>
          </div>
          <div className="mt-2 text-xs text-slate-400">
            Immediate ROI with zero vendor lock-in.
          </div>
        </div>
      </div>

      {/* 13-Service Breakdown Table */}
      <div className="bg-[#0e0f14] border border-[#1e2029] p-5 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#181a22]">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Component Cost Breakdown
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Edit any estimated monthly cost below to model your infrastructure requirements.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-400 font-mono">
            <div className="flex items-center space-x-1.5">
              <span>Dev Rate ($/h):</span>
              <input
                type="number"
                value={engineerHourlyRate}
                onChange={(e) => setEngineerHourlyRate(parseInt(e.target.value) || 0)}
                className="w-16 bg-[#14151d] border border-[#232532] rounded px-2 py-1 text-white text-xs"
              />
            </div>
            <div className="flex items-center space-x-1.5">
              <span>Hours/Mo:</span>
              <input
                type="number"
                value={maintenanceHoursMonthly}
                onChange={(e) => setMaintenanceHoursMonthly(parseInt(e.target.value) || 0)}
                className="w-14 bg-[#14151d] border border-[#232532] rounded px-2 py-1 text-white text-xs"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#121319] text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#1e2029]">
              <tr>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">SaaS Service</th>
                <th className="py-2.5 px-3">Role in Stack</th>
                <th className="py-2.5 px-3 text-right">Monthly Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171822]">
              {items.map((item, idx) => (
                <tr key={idx} className="hover:bg-[#121319]/60 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-white whitespace-nowrap">
                    {item.category}
                  </td>
                  <td className="py-2.5 px-3 text-slate-300 font-mono text-[11px]">
                    {item.service}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px] max-w-sm">
                    {item.notes}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono">
                    <div className="inline-flex items-center space-x-1">
                      <span className="text-slate-500">$</span>
                      <input
                        type="number"
                        value={item.monthlyCost}
                        onChange={(e) => handleUpdateCost(idx, parseInt(e.target.value))}
                        className="w-20 text-right bg-[#0a0b0e] border border-[#20222e] rounded px-2 py-0.5 text-white font-mono text-xs focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-[#1e2029] bg-[#121319] font-bold text-xs">
              <tr>
                <td colSpan={3} className="py-3 px-3 text-right uppercase text-slate-400">
                  Total Monthly SaaS Fees:
                </td>
                <td className="py-3 px-3 text-right text-white font-mono text-sm">
                  ${totalSaaSCost.toLocaleString()} / mo
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0e0f14] border border-[#1e2029] p-5 rounded-xl space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase">
            <AlertTriangle className="w-4 h-4 text-slate-400" />
            <span>Fragile Stitched SaaS Architecture</span>
          </div>
          <div className="text-xs text-slate-400 space-y-2">
            <p>• 13 separate billing cycles, accounts, and API version migrations.</p>
            <p>• Webhook delivery failures cause desynchronized subscriber and suppression states.</p>
            <p>• Corporate bot clicks falsely inflate analytics without specialized scrubbing.</p>
          </div>
        </div>

        <div className="bg-[#0e0f14] border border-[#1e2029] p-5 rounded-xl space-y-3">
          <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>HiveOS Unified Sovereign Model</span>
          </div>
          <div className="text-xs text-slate-300 space-y-2">
            <p>• Single open-source codebase deployable on Cloudflare Pages in 1 click.</p>
            <p>• Local client encryption: API keys and subscriber records stay in your control.</p>
            <p>• Native Outlook VML compiler and live DoH DNS validation out-of-the-box.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
