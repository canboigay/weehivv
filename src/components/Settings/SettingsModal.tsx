import React, { useState } from 'react';
import { 
  Key, 
  ShieldCheck, 
  Check, 
  Download, 
  Upload, 
  ExternalLink, 
  Lock, 
  Server, 
  AlertCircle,
  X,
  Sparkles
} from 'lucide-react';
import { ApiKeys, PublicationSettings } from '../../types';
import { exportDatabaseJson, importDatabaseJson } from '../../services/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKeys: ApiKeys;
  onSaveKeys: (keys: ApiKeys) => void;
  settings: PublicationSettings;
  onSaveSettings: (settings: PublicationSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKeys,
  onSaveKeys,
  settings,
  onSaveSettings,
}) => {
  const [keysState, setKeysState] = useState<ApiKeys>(apiKeys);
  const [settingsState, setSettingsState] = useState<PublicationSettings>(settings);
  const [savedNotice, setSavedNotice] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKeys(keysState);
    onSaveSettings(settingsState);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 800);
  };

  const handleExportBackup = () => {
    const dataStr = exportDatabaseJson();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hiveos-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDatabaseJson(content);
      if (success) {
        setImportNotice('Database restored successfully.');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setImportNotice('Failed to import database. Check file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#101116] border border-[#232431] w-full max-w-2xl rounded-2xl p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#212230]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Bring Your Own Key (BYOK) & Publication Settings
              </h2>
              <p className="text-xs text-slate-400">
                Plug your own provider keys to dispatch real emails and run AI workflows for free.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Callout */}
        <div className="p-3.5 bg-[#141620] border border-[#23263a] rounded-xl flex items-start space-x-3 text-xs text-slate-300">
          <Lock className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
          <div>
            <strong className="text-white block font-medium">Local-Only Security Architecture</strong>
            <span>
              All API keys are stored exclusively in your browser's encrypted <code className="font-mono text-slate-200">localStorage</code>. Requests are sent directly from your client to Resend, SendGrid, Groq, or OpenAI without intermediary proxies.
            </span>
          </div>
        </div>

        {/* Sending Provider Selection */}
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            1. Email Dispatch Provider
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              { id: 'resend', label: 'Resend API', tag: 'Recommended' },
              { id: 'sendgrid', label: 'SendGrid', tag: 'High Vol' },
              { id: 'postmark', label: 'Postmark', tag: 'Transactional' },
              { id: 'simulator', label: 'Edge Simulator', tag: 'No Key Needed' },
            ].map(prov => (
              <button
                key={prov.id}
                onClick={() => setSettingsState({ ...settingsState, activeProvider: prov.id as any })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  settingsState.activeProvider === prov.id
                    ? 'bg-orange-500/10 border-orange-500 text-white font-semibold'
                    : 'bg-[#15161f] border-[#222434] text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="text-xs font-bold">{prov.label}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">{prov.tag}</div>
              </button>
            ))}
          </div>

          {/* Email Key Inputs */}
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">Resend API Key</span>
                <a 
                  href="https://resend.com/api-keys" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-orange-400 text-[11px] hover:underline flex items-center space-x-1"
                >
                  <span>Get Resend Key (Free tier 3k/mo)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="password"
                placeholder="re_123456789..."
                value={keysState.resendApiKey}
                onChange={(e) => setKeysState({ ...keysState, resendApiKey: e.target.value })}
                className="w-full bg-[#0d0e13] border border-[#262837] rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 font-medium">SendGrid API Key (Optional)</span>
                <span className="text-[11px] text-slate-500 font-mono">SG.xxxxxxxx</span>
              </div>
              <input
                type="password"
                placeholder="SG.xxxxxxxx..."
                value={keysState.sendgridApiKey}
                onChange={(e) => setKeysState({ ...keysState, sendgridApiKey: e.target.value })}
                className="w-full bg-[#0d0e13] border border-[#262837] rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* AI Provider Section */}
        <div className="space-y-4 pt-2 border-t border-[#1e1f2b]">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            2. AI Copilot Provider
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">Groq API Key (Ultra-Fast & Free)</span>
                <a 
                  href="https://console.groq.com/keys" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-orange-400 text-[11px] hover:underline flex items-center space-x-1"
                >
                  <span>Get Groq Key (Free)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="password"
                placeholder="gsk_xxxxxxxx..."
                value={keysState.groqApiKey}
                onChange={(e) => setKeysState({ ...keysState, groqApiKey: e.target.value })}
                className="w-full bg-[#0d0e13] border border-[#262837] rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-300 font-medium">OpenAI API Key (Optional)</span>
                <span className="text-[11px] text-slate-500 font-mono">sk-...</span>
              </div>
              <input
                type="password"
                placeholder="sk-proj-xxxxxxxx..."
                value={keysState.openaiApiKey}
                onChange={(e) => setKeysState({ ...keysState, openaiApiKey: e.target.value })}
                className="w-full bg-[#0d0e13] border border-[#262837] rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Sender Identity Section */}
        <div className="space-y-3 pt-2 border-t border-[#1e1f2b]">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            3. Publication & Sender Identity
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-400 text-[11px] block mb-1">Publication Name</label>
              <input
                type="text"
                value={settingsState.publicationName}
                onChange={(e) => setSettingsState({ ...settingsState, publicationName: e.target.value })}
                className="w-full bg-[#0d0e13] border border-[#262837] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-slate-400 text-[11px] block mb-1">Sender Email</label>
              <input
                type="email"
                value={settingsState.senderEmail}
                onChange={(e) => setSettingsState({ ...settingsState, senderEmail: e.target.value })}
                className="w-full bg-[#0d0e13] border border-[#262837] rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-slate-400 text-[11px] block mb-1">Custom Sending Domain</label>
              <input
                type="text"
                value={settingsState.customDomain}
                onChange={(e) => setSettingsState({ ...settingsState, customDomain: e.target.value })}
                className="w-full bg-[#0d0e13] border border-[#262837] rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Backup / Export Section */}
        <div className="pt-2 border-t border-[#1e1f2b] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportBackup}
              className="px-3 py-1.5 rounded-lg bg-[#181923] hover:bg-[#202230] text-slate-300 border border-[#2a2c3a] flex items-center space-x-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export Database JSON</span>
            </button>

            <label className="px-3 py-1.5 rounded-lg bg-[#181923] hover:bg-[#202230] text-slate-300 border border-[#2a2c3a] flex items-center space-x-1.5 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-slate-400" />
              <span>Import JSON</span>
              <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
            </label>
          </div>

          {importNotice && (
            <span className="text-xs text-emerald-400 font-medium">{importNotice}</span>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#212230] flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 flex items-center space-x-1.5 transition-all"
          >
            {savedNotice ? <Check className="w-4 h-4" /> : null}
            <span>{savedNotice ? 'Saved Locally' : 'Save Configuration'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
