import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Star, 
  ShieldAlert, 
  Fingerprint,
  Download,
  Upload,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  X
} from 'lucide-react';
import { Subscriber } from '../../types';

interface SubscriberCRMProps {
  subscribers: Subscriber[];
  onAddSubscriber: (sub: Subscriber) => void;
  onDeleteSubscriber: (id: string) => void;
}

export const SubscriberCRM: React.FC<SubscriberCRMProps> = ({
  subscribers,
  onAddSubscriber,
  onDeleteSubscriber,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [selectedSubDetail, setSelectedSubDetail] = useState<Subscriber | null>(subscribers[0] || null);

  // Bot click filter demo state
  const [isBotScrubbingActive, setIsBotScrubbingActive] = useState(true);

  // New subscriber modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newTier, setNewTier] = useState<'Free' | 'Scale' | 'Enterprise VIP'>('Free');
  const [newSource, setNewSource] = useState<'Organic Search' | 'Meta Ads' | 'Referral Program' | 'X / Twitter' | 'Beehiiv Recommendations'>('Organic Search');

  const filteredSubscribers = subscribers.filter(sub => {
    const matchesSearch = sub.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          sub.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sub.lastName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = selectedSource === 'All' || sub.source === selectedSource;
    return matchesSearch && matchesSource;
  });

  const handleExportCsv = () => {
    const headers = 'ID,Email,FirstName,LastName,Status,Tier,Source,EngagementScore,OpenRate,ClickRate\n';
    const rows = subscribers.map(s => 
      `"${s.id}","${s.email}","${s.firstName}","${s.lastName}","${s.status}","${s.tier}","${s.source}",${s.engagementScore},${s.openRate},${s.clickRate}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hiveos-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      if (lines.length <= 1) return;

      const newSubs: Subscriber[] = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map(p => p.replace(/^"|"$/g, '').trim());
        if (parts.length >= 2 && parts[1].includes('@')) {
          newSubs.push({
            id: `sub-${Date.now()}-${i}`,
            email: parts[1],
            firstName: parts[2] || 'Reader',
            lastName: parts[3] || '',
            status: 'active',
            tier: (parts[5] as any) || 'Free',
            source: (parts[6] as any) || 'Organic Search',
            engagementScore: 4,
            openRate: 50.0,
            clickRate: 10.0,
            referralCount: 0,
            joinedAt: new Date().toISOString().slice(0, 10),
            isBotSuspect: false,
            engagementHistory: [
              { date: new Date().toISOString().slice(0, 16).replace('T', ' '), action: 'Imported via CSV', details: 'Bulk CSV Ingestion' }
            ]
          });
        }
      }

      newSubs.forEach(sub => onAddSubscriber(sub));
    };
    reader.readAsText(file);
  };

  const handleSaveNewSubscriber = () => {
    if (!newEmail || !newEmail.includes('@')) return;

    // Check disposable
    const domain = newEmail.split('@')[1] || '';
    const isDisposable = ['tempmail.io', 'mailinator.com'].includes(domain);

    const newSub: Subscriber = {
      id: `sub-${Date.now()}`,
      email: newEmail.trim().toLowerCase(),
      firstName: newFirstName.trim() || 'Reader',
      lastName: newLastName.trim(),
      status: isDisposable ? 'suppressed' : 'active',
      tier: newTier,
      source: newSource,
      engagementScore: 5,
      openRate: 0,
      clickRate: 0,
      referralCount: 0,
      joinedAt: new Date().toISOString().slice(0, 10),
      isBotSuspect: isDisposable,
      engagementHistory: [
        { 
          date: new Date().toISOString().slice(0, 16).replace('T', ' '), 
          action: isDisposable ? 'Suppressed (Disposable Domain)' : 'Subscribed Directly', 
          details: `Acquired via ${newSource}` 
        }
      ]
    };

    onAddSubscriber(newSub);
    setIsAddModalOpen(false);
    setNewEmail('');
    setNewFirstName('');
    setNewLastName('');
    setSelectedSubDetail(newSub);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#101117] border border-[#1e202b] p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Audience CRM & Bot-Click Defense</h2>
            <span className="text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
              {subscribers.length} Stored Locally
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Managing subscriber engagement scores, attribution sources, and scrubbing automated security scanner clicks from reporting.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 bg-[#ff5a36] hover:bg-[#e04622] text-white rounded-xl font-bold flex items-center space-x-1.5 transition-all shadow-md shadow-orange-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Subscriber</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-3 py-1.5 rounded-xl bg-[#171822] hover:bg-[#202230] text-slate-300 border border-[#262837] flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <label className="px-3 py-1.5 rounded-xl bg-[#171822] hover:bg-[#202230] text-slate-300 border border-[#262837] flex items-center space-x-1.5 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
            <input type="file" accept=".csv" onChange={handleImportCsv} className="hidden" />
          </label>
        </div>
      </div>

      {/* Bot Click Scrubber Explainer */}
      <div className="bg-[#101117] border border-blue-500/30 p-5 rounded-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Security Scanner Click Defense (Omnivery Engine)
              </span>
              <span className="text-[10px] bg-white/10 text-slate-300 px-2 py-0.5 rounded font-mono">
                Corporate Scanner Shield
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Corporate email security systems (Proofpoint, Barracuda, Microsoft Defender) pre-click all links in inbound messages with &lt; 85ms latency to inspect payloads. Without scrubbing, your reports display fake 14%+ CTRs.
            </p>
          </div>

          <div className="bg-[#0a0b0e] p-3.5 rounded-xl border border-[#1f212f] space-y-2 shrink-0 min-w-[260px] text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Bot Click Scrubbing:</span>
              <button
                onClick={() => setIsBotScrubbingActive(!isBotScrubbingActive)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  isBotScrubbingActive ? 'bg-emerald-500 text-white' : 'bg-red-500/20 text-red-300'
                }`}
              >
                {isBotScrubbingActive ? 'ACTIVE (Clean)' : 'OFF (Raw)'}
              </button>
            </div>
            <div className="flex justify-between text-slate-400 font-mono text-[11px]">
              <span>Reported CTR:</span>
              <strong className={isBotScrubbingActive ? 'text-emerald-400' : 'text-red-400'}>
                {isBotScrubbingActive ? '8.92% (Authentic)' : '14.30% (Distorted)'}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main CRM Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Subscriber List */}
        <div className="lg:col-span-8 bg-[#101117] border border-[#1e202b] p-5 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0a0b0e] border border-[#222432] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400">Source:</span>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="bg-[#171822] text-white border border-[#262837] rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="All">All Sources</option>
                <option value="Beehiiv Recommendations">Beehiiv Recommendations</option>
                <option value="Meta Ads">Meta Ads</option>
                <option value="X / Twitter">X / Twitter</option>
                <option value="Referral Program">Referral Program</option>
                <option value="Organic Search">Organic Search</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#14151e] text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#222432]">
                <tr>
                  <th className="py-2.5 px-3">Subscriber</th>
                  <th className="py-2.5 px-3">Source</th>
                  <th className="py-2.5 px-3">Engagement</th>
                  <th className="py-2.5 px-3">Open / Click</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b1c28]">
                {filteredSubscribers.map((sub) => (
                  <tr 
                    key={sub.id}
                    onClick={() => setSelectedSubDetail(sub)}
                    className={`hover:bg-[#151620] cursor-pointer transition-colors ${
                      selectedSubDetail?.id === sub.id ? 'bg-[#181a24]' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-white">
                        {sub.firstName} {sub.lastName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono truncate max-w-[180px]">
                        {sub.email}
                      </div>
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="text-[11px] px-2 py-0.5 rounded bg-[#171822] text-slate-300 border border-[#252737]">
                        {sub.source}
                      </span>
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="flex items-center space-x-1 text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < sub.engagementScore ? 'fill-yellow-400 text-yellow-400' : 'text-slate-700'}`} 
                          />
                        ))}
                      </div>
                    </td>

                    <td className="py-2.5 px-3 font-mono text-[11px]">
                      <span className="text-emerald-400">{sub.openRate}%</span>
                      <span className="text-slate-500"> / </span>
                      <span className="text-blue-400">{sub.clickRate}%</span>
                    </td>

                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        sub.status === 'active' 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : sub.status === 'bounced' 
                          ? 'bg-yellow-500/20 text-yellow-300' 
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {sub.status}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onDeleteSubscriber(sub.id); }}
                        className="text-slate-500 hover:text-red-400 p-1"
                        title="Delete subscriber"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 360° History Drawer */}
        <div className="lg:col-span-4 bg-[#101117] border border-[#1e202b] p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1c1d29]">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <Fingerprint className="w-3.5 h-3.5 text-blue-400" />
              <span>360° Engagement History</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Audience Profile</span>
          </div>

          {selectedSubDetail ? (
            <div className="space-y-4">
              <div className="p-3.5 bg-[#14151e] rounded-xl border border-[#222432] space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {selectedSubDetail.firstName} {selectedSubDetail.lastName}
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">{selectedSubDetail.email}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 text-xs font-bold">
                    {selectedSubDetail.tier}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#1f202e]">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Acquisition</span>
                    <span className="text-slate-200 font-medium">{selectedSubDetail.source}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Joined</span>
                    <span className="text-slate-200 font-medium">{selectedSubDetail.joinedAt}</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
                  Activity Timeline ({selectedSubDetail.engagementHistory.length} events)
                </span>

                <div className="relative pl-4 border-l border-slate-800 space-y-3.5 text-xs">
                  {selectedSubDetail.engagementHistory.map((item, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-[#101117]" />
                      <div className="text-[10px] font-mono text-slate-500">{item.date}</div>
                      <div className="font-bold text-slate-200">{item.action}</div>
                      <div className="text-[11px] text-slate-400">{item.details}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-xs">
              Select a subscriber to view 360° history
            </div>
          )}
        </div>
      </div>

      {/* Add Subscriber Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#101117] border border-[#232431] w-full max-w-md rounded-2xl p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e1f2b]">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Add Subscriber
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Email Address *</label>
                <input
                  type="email"
                  placeholder="subscriber@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-[#0a0b0e] border border-[#222432] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">First Name</label>
                  <input
                    type="text"
                    placeholder="Alice"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    className="w-full bg-[#0a0b0e] border border-[#222432] rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="Smith"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    className="w-full bg-[#0a0b0e] border border-[#222432] rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Subscriber Tier</label>
                <select
                  value={newTier}
                  onChange={(e) => setNewTier(e.target.value as any)}
                  className="w-full bg-[#0a0b0e] border border-[#222432] rounded-xl px-3 py-1.5 text-white"
                >
                  <option value="Free">Free</option>
                  <option value="Scale">Scale</option>
                  <option value="Enterprise VIP">Enterprise VIP</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Acquisition Source</label>
                <select
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value as any)}
                  className="w-full bg-[#0a0b0e] border border-[#222432] rounded-xl px-3 py-1.5 text-white"
                >
                  <option value="Organic Search">Organic Search</option>
                  <option value="Meta Ads">Meta Ads</option>
                  <option value="X / Twitter">X / Twitter</option>
                  <option value="Referral Program">Referral Program</option>
                  <option value="Beehiiv Recommendations">Beehiiv Recommendations</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2 text-xs">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewSubscriber}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow"
              >
                Save Subscriber
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
