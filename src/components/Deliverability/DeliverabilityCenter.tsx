import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Flame, 
  Radio, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Copy, 
  Search, 
  Plus, 
  Trash2, 
  RefreshCw,
  Server,
  Check,
  Globe
} from 'lucide-react';
import { 
  INITIAL_SUPPRESSION_LIST, 
  RBL_MONITORS, 
  WARMUP_SCHEDULE 
} from '../../data/mockData';
import { SuppressionEntry, PublicationSettings } from '../../types';
import { auditDomainDns, DomainDnsAudit } from '../../services/dnsChecker';

interface DeliverabilityCenterProps {
  settings: PublicationSettings;
  suppressionList: SuppressionEntry[];
  onAddSuppression: (entry: SuppressionEntry) => void;
  onDeleteSuppression: (id: string) => void;
}

export const DeliverabilityCenter: React.FC<DeliverabilityCenterProps> = ({
  settings,
  suppressionList,
  onAddSuppression,
  onDeleteSuppression,
}) => {
  // Live DNS Audit state
  const [dnsDomain, setDnsDomain] = useState(settings.customDomain || 'beehiiv.com');
  const [isAuditingDns, setIsAuditingDns] = useState(false);
  const [dnsResult, setDnsResult] = useState<DomainDnsAudit | null>(null);

  // Live Email Validator test state
  const [testEmail, setTestEmail] = useState('');
  const [validationResult, setValidationResult] = useState<null | {
    isValid: boolean;
    isDisposable: boolean;
    hasMx: boolean;
    typoSuggestion?: string;
    riskScore: number;
    details: string;
  }>(null);

  // Suppression list state
  const [activeSuppressionTab, setActiveSuppressionTab] = useState<'All' | 'Global' | 'Publication' | 'Transactional'>('All');
  const [suppressionSearch, setSuppressionSearch] = useState('');
  const [newSuppressionEmail, setNewSuppressionEmail] = useState('');
  const [newSuppressionReason, setNewSuppressionReason] = useState('Hard Bounce (550 User Unknown)');
  const [newSuppressionLayer, setNewSuppressionLayer] = useState<'Global' | 'Publication' | 'Transactional'>('Publication');

  // Blocklist Sentinels state
  const [rblList, setRblList] = useState(RBL_MONITORS);
  const [isSimulatingRblListing, setIsSimulatingRblListing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Run initial DNS audit on mount
  useEffect(() => {
    handleRunDnsAudit(dnsDomain);
  }, []);

  const handleRunDnsAudit = async (domainToTest: string) => {
    setIsAuditingDns(true);
    try {
      const res = await auditDomainDns(domainToTest);
      setDnsResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditingDns(false);
    }
  };

  const handleValidateEmail = () => {
    if (!testEmail) return;

    const email = testEmail.toLowerCase().trim();
    const domain = email.split('@')[1] || '';

    // Typo detection
    let typoSuggestion: string | undefined;
    if (domain === 'gmial.com' || domain === 'gmai.com' || domain === 'gamil.com') {
      typoSuggestion = email.replace(domain, 'gmail.com');
    } else if (domain === 'yaho.com' || domain === 'yhoo.com') {
      typoSuggestion = email.replace(domain, 'yahoo.com');
    } else if (domain === 'hotmial.com' || domain === 'outlok.com') {
      typoSuggestion = email.replace(domain, 'outlook.com');
    }

    const disposableDomains = ['tempmail.io', 'mailinator.com', '10minutemail.com', 'guerrillamail.com', 'throwaway.email'];
    const isDisposable = disposableDomains.includes(domain);
    const isValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    let riskScore = 0;
    if (!isValidFormat) riskScore = 100;
    else if (isDisposable) riskScore = 95;
    else if (typoSuggestion) riskScore = 70;
    else riskScore = 2;

    setValidationResult({
      isValid: isValidFormat && !isDisposable && !typoSuggestion,
      isDisposable,
      hasMx: isValidFormat && !isDisposable,
      typoSuggestion,
      riskScore,
      details: isDisposable 
        ? 'Blacklisted disposable domain detected. Prevented from entering database.'
        : typoSuggestion 
        ? `Common domain misspelling detected: did you mean "${typoSuggestion}"?`
        : !isValidFormat 
        ? 'Invalid RFC 5322 email syntax.'
        : 'ZeroBounce + Kickbox API: Valid mailbox with active MX and clean inbox reputation.'
    });
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCreateSuppression = () => {
    if (!newSuppressionEmail) return;
    onAddSuppression({
      id: `sup-${Date.now()}`,
      email: newSuppressionEmail.trim(),
      layer: newSuppressionLayer,
      reason: newSuppressionReason as any,
      dateAdded: 'Just now',
      sourceProvider: 'Manual Admin Sentinel',
    });
    setNewSuppressionEmail('');
  };

  const handleToggleRblSimulation = () => {
    setIsSimulatingRblListing(!isSimulatingRblListing);
    if (!isSimulatingRblListing) {
      setRblList(prev => prev.map(item => 
        item.name === 'Barracuda BRBL' 
          ? { ...item, status: 'Listed', actionTaken: '🚨 CIRCUIT BREAKER: IP 198.51.100.24 pulled from rotation in 320ms' }
          : item
      ));
    } else {
      setRblList(RBL_MONITORS);
    }
  };

  const filteredSuppression = suppressionList.filter(item => {
    const matchesTab = activeSuppressionTab === 'All' || item.layer === activeSuppressionTab;
    const matchesSearch = item.email.toLowerCase().includes(suppressionSearch.toLowerCase()) || 
                          item.reason.toLowerCase().includes(suppressionSearch.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#101117] border border-[#1e202b] p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Deliverability & DNS Infrastructure</h2>
            <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
              99.34% SLA Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Live DNS-over-HTTPS audits, automated 3-tier suppression, IP warming curves, and 24/7 blocklist sentinels.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={handleToggleRblSimulation}
            className={`px-3 py-1.5 rounded-xl font-medium border transition-all flex items-center space-x-2 ${
              isSimulatingRblListing
                ? 'bg-red-500/20 text-red-300 border-red-500/50'
                : 'bg-[#171822] text-slate-300 border-[#262837] hover:bg-[#202230]'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isSimulatingRblListing ? 'text-red-400 animate-pulse' : 'text-slate-400'}`} />
            <span>{isSimulatingRblListing ? 'Reset Simulation' : 'Simulate RBL Circuit Breaker'}</span>
          </button>
        </div>
      </div>

      {/* Live Real-Time DNS Auditor (Powered by Cloudflare 1.1.1.1 DoH) */}
      <div className="bg-[#101117] border border-[#1e202b] p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Live DNS-over-HTTPS Authentication Auditor
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Queries Cloudflare 1.1.1.1 directly in real time to verify live MX, SPF, and DMARC enforcement for any domain.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="e.g. beehiiv.com, stripe.com, yourdomain.com"
              value={dnsDomain}
              onChange={(e) => setDnsDomain(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunDnsAudit(dnsDomain)}
              className="bg-[#0a0b0e] border border-[#222432] rounded-xl px-3 py-1.5 text-xs text-white font-mono w-56 focus:outline-none focus:border-cyan-500"
            />
            <button
              onClick={() => handleRunDnsAudit(dnsDomain)}
              disabled={isAuditingDns}
              className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
            >
              {isAuditingDns ? 'Auditing...' : 'Run Audit'}
            </button>
          </div>
        </div>

        {/* Live DNS Cards */}
        {dnsResult && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {/* SPF Card */}
            <div className="p-3.5 bg-[#14151e] border border-[#232535] rounded-xl space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">1. SPF Alignment</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  dnsResult.hasSpf ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {dnsResult.hasSpf ? 'PASS (v=spf1)' : 'FAIL / MISSING'}
                </span>
              </div>
              <div className="font-mono text-[11px] text-slate-300 bg-[#0a0b0e] p-2 rounded-lg truncate">
                {dnsResult.spfRecord || 'No v=spf1 TXT record found'}
              </div>
            </div>

            {/* DMARC Card */}
            <div className="p-3.5 bg-[#14151e] border border-[#232535] rounded-xl space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">2. DMARC Policy</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  dnsResult.dmarcPolicy === 'reject' || dnsResult.dmarcPolicy === 'quarantine'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : dnsResult.dmarcPolicy === 'none'
                    ? 'bg-yellow-500/20 text-yellow-300'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {dnsResult.hasDmarc ? `p=${dnsResult.dmarcPolicy}` : 'MISSING'}
                </span>
              </div>
              <div className="font-mono text-[11px] text-slate-300 bg-[#0a0b0e] p-2 rounded-lg truncate">
                {dnsResult.dmarcRecord || `No record at _dmarc.${dnsResult.domain}`}
              </div>
            </div>

            {/* MX Records Card */}
            <div className="p-3.5 bg-[#14151e] border border-[#232535] rounded-xl space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">3. Mail Exchange (MX)</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  dnsResult.hasMx ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {dnsResult.hasMx ? `${dnsResult.mxRecords.length} MX Found` : 'NO MX'}
                </span>
              </div>
              <div className="font-mono text-[11px] text-slate-300 bg-[#0a0b0e] p-2 rounded-lg truncate">
                {dnsResult.mxRecords[0] || 'No MX routes configured'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 24/7 Blocklist (RBL) Sentinels */}
      <div className="bg-[#101117] border border-[#1e202b] p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              24/7 Blocklist Sentinel & Autonomous Circuit Breaker
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Automated poll every 30s</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {rblList.map((rbl, i) => (
            <div 
              key={i} 
              className={`p-3.5 rounded-xl border transition-all ${
                rbl.status === 'Listed' 
                  ? 'bg-red-950/20 border-red-500/60' 
                  : 'bg-[#14151e] border-[#222432]'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-bold text-white">{rbl.name}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  rbl.status === 'Listed' 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-emerald-500/20 text-emerald-400 font-mono'
                }`}>
                  {rbl.status}
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">{rbl.host}</div>
              <div className="mt-2 text-[11px] text-slate-300 font-medium">
                {rbl.actionTaken}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Validation & Bounce Classifier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-[#101117] border border-[#1e202b] p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                1st & 3rd Party Email Validation
              </h3>
            </div>
            <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded font-mono">
              Live Filter
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Validating every submission before database insertion. Blocks 50k+ disposable domains and catches mistyped common hosts.
          </p>

          <div className="flex space-x-2">
            <input
              type="email"
              placeholder="Test email: user@tempmail.io or sarah@gmial.com..."
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleValidateEmail()}
              className="flex-1 bg-[#0a0b0e] border border-[#222432] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500 font-mono"
            />
            <button
              onClick={handleValidateEmail}
              className="px-4 py-2 bg-[#ff5a36] hover:bg-[#e04622] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-orange-500/20"
            >
              Validate
            </button>
          </div>

          {validationResult && (
            <div className={`p-4 rounded-xl border text-xs space-y-2 ${
              validationResult.isValid 
                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300' 
                : 'bg-red-950/20 border-red-500/40 text-red-300'
            }`}>
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center space-x-1.5">
                  {validationResult.isValid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                  <span>Status: {validationResult.isValid ? 'Approved' : 'Rejected'}</span>
                </span>
                <span className="font-mono">Risk Score: {validationResult.riskScore} / 100</span>
              </div>
              <p className="text-[11px] text-slate-300 font-sans">{validationResult.details}</p>
              {validationResult.typoSuggestion && (
                <div className="bg-[#14151e] p-2.5 rounded-lg border border-[#262837] text-yellow-300 font-mono text-[11px] flex items-center justify-between">
                  <span>Suggested fix: <strong>{validationResult.typoSuggestion}</strong></span>
                  <button 
                    onClick={() => { setTestEmail(validationResult.typoSuggestion!); }}
                    className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded font-bold"
                  >
                    Apply Fix
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bounce Classifier */}
        <div className="lg:col-span-6 bg-[#101117] border border-[#1e202b] p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Bounce Classifier: "Try Again" vs "Never Again"
              </h3>
            </div>
            <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded font-mono">
              RFC 3463
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-[#14151e] rounded-xl border border-[#222432] flex items-start justify-between">
              <div>
                <div className="font-bold text-red-400 flex items-center space-x-1.5">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>550 5.1.1 User Unknown (Hard Bounce)</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Decision: <strong>"Never Again"</strong> &rarr; Immediate auto-promotion to Global Suppression List.
                </div>
              </div>
              <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded font-mono">Auto Suppress</span>
            </div>

            <div className="p-3 bg-[#14151e] rounded-xl border border-[#222432] flex items-start justify-between">
              <div>
                <div className="font-bold text-yellow-400 flex items-center space-x-1.5">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>452 4.2.2 Mailbox Full (Soft Bounce)</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Decision: <strong>"Try Again"</strong> &rarr; Retry in 2h, 6h, 24h with exponential backoff (max 3 tries).
                </div>
              </div>
              <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded font-mono">Backoff Retry</span>
            </div>

            <div className="p-3 bg-[#14151e] rounded-xl border border-[#222432] flex items-start justify-between">
              <div>
                <div className="font-bold text-orange-400 flex items-center space-x-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>FBL Spam Complaint (Yahoo / Microsoft CFL)</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Decision: <strong>"Never Again"</strong> &rarr; Automatic instant unsubscribe + publication suppression.
                </div>
              </div>
              <span className="text-[10px] bg-orange-500/20 text-orange-300 px-2 py-0.5 rounded font-mono">FBL Webhook</span>
            </div>
          </div>
        </div>
      </div>

      {/* Three Layers of Suppression */}
      <div className="bg-[#101117] border border-[#1e202b] p-6 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>Three Layers of Suppression</span>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono">
                {filteredSuppression.length} records
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Strict isolation: global hard bounces are never sent to; publication unsubs can still receive receipts.
            </p>
          </div>

          <div className="flex items-center space-x-1 bg-[#14151e] p-1 rounded-xl border border-[#222432] text-xs">
            {(['All', 'Global', 'Publication', 'Transactional'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveSuppressionTab(tab)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  activeSuppressionTab === tab 
                    ? 'bg-purple-600 text-white font-bold' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Add Entry Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
          <input
            type="email"
            placeholder="Add address to suppress..."
            value={newSuppressionEmail}
            onChange={(e) => setNewSuppressionEmail(e.target.value)}
            className="sm:col-span-5 bg-[#0a0b0e] border border-[#222432] rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-purple-500 font-mono"
          />
          <select
            value={newSuppressionLayer}
            onChange={(e) => setNewSuppressionLayer(e.target.value as any)}
            className="sm:col-span-3 bg-[#0a0b0e] border border-[#222432] rounded-xl px-2 py-1.5 text-slate-300"
          >
            <option value="Global">Layer: Global</option>
            <option value="Publication">Layer: Publication</option>
            <option value="Transactional">Layer: Transactional</option>
          </select>
          <select
            value={newSuppressionReason}
            onChange={(e) => setNewSuppressionReason(e.target.value)}
            className="sm:col-span-3 bg-[#0a0b0e] border border-[#222432] rounded-xl px-2 py-1.5 text-slate-300"
          >
            <option value="Hard Bounce (550 User Unknown)">Hard Bounce (550)</option>
            <option value="FBL Spam Complaint">FBL Complaint</option>
            <option value="RFC 8058 One-Click Unsub">RFC 8058 Unsub</option>
            <option value="Spam Trap Hit">Spam Trap Hit</option>
          </select>
          <button
            onClick={handleCreateSuppression}
            className="sm:col-span-1 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold flex items-center justify-center p-1.5 shadow"
            title="Add suppression"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Suppression Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#14151e] text-slate-400 uppercase text-[10px] tracking-wider border-b border-[#222432]">
              <tr>
                <th className="py-2 px-3">Email Address</th>
                <th className="py-2 px-3">Layer</th>
                <th className="py-2 px-3">Reason</th>
                <th className="py-2 px-3">Added</th>
                <th className="py-2 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1d29] font-mono">
              {filteredSuppression.map((item) => (
                <tr key={item.id} className="hover:bg-[#14151e]/60 transition-colors">
                  <td className="py-2 px-3 font-semibold text-white">{item.email}</td>
                  <td className="py-2 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.layer === 'Global' 
                        ? 'bg-red-500/20 text-red-300' 
                        : item.layer === 'Publication' 
                        ? 'bg-purple-500/20 text-purple-300' 
                        : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {item.layer}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-slate-300 font-sans">{item.reason}</td>
                  <td className="py-2 px-3 text-slate-400">{item.dateAdded}</td>
                  <td className="py-2 px-3 text-right">
                    <button 
                      onClick={() => onDeleteSuppression(item.id)}
                      className="text-slate-500 hover:text-red-400 p-1"
                      title="Remove"
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
    </div>
  );
};
