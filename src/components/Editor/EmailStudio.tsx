import React, { useState } from 'react';
import { 
  Eye, 
  Code, 
  Sparkles, 
  Volume2, 
  Play, 
  HelpCircle, 
  Monitor, 
  Smartphone, 
  Mail, 
  Globe, 
  Wand2, 
  UserCheck, 
  ExternalLink,
  SplitSquareVertical,
  Layers,
  Send,
  Award,
  Check,
  Copy,
  AlertCircle
} from 'lucide-react';
import { SIMULATED_SUBSCRIBERS } from '../../data/mockData';
import { SimulatedSubscriber, ApiKeys, PublicationSettings } from '../../types';
import { compileToBulletproofEmailHtml } from '../../services/outlookCompiler';
import { generateAiContent } from '../../services/aiGenerator';
import { sendNewsletterEmail, SendResult } from '../../services/emailSender';

interface EmailStudioProps {
  apiKeys: ApiKeys;
  settings: PublicationSettings;
  onOpenSettings: () => void;
}

export const EmailStudio: React.FC<EmailStudioProps> = ({ apiKeys, settings, onOpenSettings }) => {
  // A/B Testing state
  const [subjectA, setSubjectA] = useState('Inside our 3M/min email engine (and what broke first)');
  const [subjectB, setSubjectB] = useState('Why Outlook 2016 still breaks modern email HTML');
  const [abTestSplit, setAbTestSplit] = useState(20);
  const [abMetric, setAbMetric] = useState<'opens' | 'clicks'>('opens');

  // Preview Modes
  const [viewDevice, setViewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [viewEnvironment, setViewEnvironment] = useState<'email' | 'web'>('email');
  const [showOutlookVmlCode, setShowOutlookVmlCode] = useState(false);
  const [vmlCopied, setVmlCopied] = useState(false);

  // Simulated Subscriber for Merge Tags
  const [selectedSub, setSelectedSub] = useState<SimulatedSubscriber>(SIMULATED_SUBSCRIBERS[0]);

  // Content
  const [newsletterTitle, setNewsletterTitle] = useState('The Mechanics of High-Volume Deliverability');
  const [postBody, setPostBody] = useState(
    `Hey {{ subscriber.first_name }},\n\nWhen managing a publication at scale, the real challenge is rarely generating HTML — it is ensuring every major mailbox provider (Gmail, Apple Mail, Yahoo, and Microsoft 365) routes your message directly to the primary inbox.\n\nBetween RFC 8058 one-click unsubscribes, Microsoft Word HTML rendering engines, and anti-spam circuit breakers, here is what our architecture enforces before dispatching a single packet.`
  );

  // Live Test Send
  const [testSendEmail, setTestSendEmail] = useState(settings.senderEmail);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testSendResult, setTestSendResult] = useState<SendResult | null>(null);

  // AI Copilot state
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiOutput, setAiOutput] = useState<string | null>(null);

  // Poll state
  const [pollVotes, setPollVotes] = useState({ option1: 142, option2: 89, option3: 312 });
  const [userVoted, setUserVoted] = useState<string | null>(null);

  // Replace merge tags
  const renderMergeTags = (text: string) => {
    return text
      .replace(/\{\{\s*subscriber\.first_name\s*\}\}/g, selectedSub.name.split(' ')[0])
      .replace(/\{\{\s*subscriber\.email\s*\}\}/g, selectedSub.email)
      .replace(/\{\{\s*subscriber\.tier\s*\}\}/g, selectedSub.tier)
      .replace(/\{\{\s*subscriber\.referral_link\s*\}\}/g, selectedSub.referralLink)
      .replace(/\{\{\s*subscriber\.points\s*\}\}/g, selectedSub.points.toString());
  };

  const compiledHtml = compileToBulletproofEmailHtml({
    title: newsletterTitle,
    bodyHtmlOrText: renderMergeTags(postBody),
    senderName: settings.senderName,
    publicationName: settings.publicationName,
    referralLink: selectedSub.referralLink,
    unsubscribeUrl: `https://${settings.customDomain}/unsub/${selectedSub.id}`,
    buttonText: 'Read Full Post on Web',
    buttonUrl: selectedSub.referralLink,
  });

  const handleCopyVml = () => {
    navigator.clipboard.writeText(compiledHtml);
    setVmlCopied(true);
    setTimeout(() => setVmlCopied(false), 2000);
  };

  const handleGenerateAi = async (type: 'subject_lines' | 'newsletter_hook' | 'polish_copy') => {
    setIsAiGenerating(true);
    setAiOutput(null);
    try {
      const result = await generateAiContent(
        {
          prompt: aiPrompt || newsletterTitle,
          type,
          context: postBody,
        },
        apiKeys
      );
      setAiOutput(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testSendEmail) return;
    setIsSendingTest(true);
    setTestSendResult(null);

    const result = await sendNewsletterEmail(
      {
        to: testSendEmail,
        subject: renderMergeTags(subjectA),
        html: compiledHtml,
      },
      apiKeys,
      settings
    );

    setTestSendResult(result);
    setIsSendingTest(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Studio Controls */}
      <div className="bg-[#101117] border border-[#1e202b] p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <span>Editor & Email Studio</span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1c1d27] text-slate-300 border border-[#2a2c3a]">
              Outlook VML & RFC 8058 Ready
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time preview across email inboxes vs web post, with Word MSO fallback and simulated subscriber merge tags.
          </p>
        </div>

        {/* View Switches */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="bg-[#171822] p-1 rounded-xl border border-[#262837] flex items-center space-x-1">
            <button
              onClick={() => setViewEnvironment('email')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1.5 transition-all ${
                viewEnvironment === 'email'
                  ? 'bg-[#ff5a36] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Inbox View</span>
            </button>
            <button
              onClick={() => setViewEnvironment('web')}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1.5 transition-all ${
                viewEnvironment === 'web'
                  ? 'bg-[#ff5a36] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Web Post View</span>
            </button>
          </div>

          <div className="bg-[#171822] p-1 rounded-xl border border-[#262837] flex items-center space-x-1">
            <button
              onClick={() => setViewDevice('desktop')}
              className={`p-1.5 rounded-lg ${viewDevice === 'desktop' ? 'bg-[#252737] text-white' : 'text-slate-400'}`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewDevice('mobile')}
              className={`p-1.5 rounded-lg ${viewDevice === 'mobile' ? 'bg-[#252737] text-white' : 'text-slate-400'}`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setShowOutlookVmlCode(!showOutlookVmlCode)}
            className={`px-3 py-1.5 rounded-xl border flex items-center space-x-1.5 text-xs transition-all ${
              showOutlookVmlCode 
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
                : 'bg-[#171822] text-slate-300 border-[#262837] hover:bg-[#202230]'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-cyan-400" />
            <span>Outlook VML Inspector</span>
          </button>
        </div>
      </div>

      {/* A/B Testing Header */}
      <div className="bg-[#101117] border border-[#1e202b] p-5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1b1c27] pb-3">
          <div className="flex items-center space-x-2">
            <SplitSquareVertical className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Subject Line A/B Optimization</span>
          </div>

          <div className="flex items-center space-x-4 text-xs text-slate-400 font-mono">
            <span>Test Sample: <strong className="text-white">{abTestSplit}%</strong></span>
            <span>Winner Metric: 
              <select 
                value={abMetric}
                onChange={(e) => setAbMetric(e.target.value as any)}
                className="ml-1.5 bg-[#171823] text-white border border-[#27293a] rounded px-2 py-0.5"
              >
                <option value="opens">Highest Open Rate (4 hrs)</option>
                <option value="clicks">Highest Click Rate (4 hrs)</option>
              </select>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span className="font-semibold text-orange-400">Variant A (50% sample)</span>
              <span className="font-mono">Primary Variant</span>
            </div>
            <input
              type="text"
              value={subjectA}
              onChange={(e) => setSubjectA(e.target.value)}
              className="w-full bg-[#0a0b0e] border border-[#222432] rounded-xl px-3.5 py-2 text-white font-medium focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span className="font-semibold text-amber-400">Variant B (50% sample)</span>
              <span className="font-mono">Experimental Variant</span>
            </div>
            <input
              type="text"
              value={subjectB}
              onChange={(e) => setSubjectB(e.target.value)}
              className="w-full bg-[#0a0b0e] border border-[#222432] rounded-xl px-3.5 py-2 text-white font-medium focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Simulated Subscriber Bar */}
      <div className="bg-[#12131a] border border-[#20222e] p-3 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-white">Simulate As Subscriber:</span>
          <div className="flex items-center space-x-1.5">
            {SIMULATED_SUBSCRIBERS.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSub(sub)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                  selectedSub.id === sub.id
                    ? 'bg-orange-500/20 border-orange-500 text-orange-300 font-semibold'
                    : 'bg-[#181923] border-[#262837] text-slate-400 hover:text-white'
                }`}
              >
                <img src={sub.avatar} alt={sub.name} className="w-4 h-4 rounded-full object-cover" />
                <span>{sub.name.split(' ')[0]} ({sub.tier.split(' ')[0]})</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3 text-[11px] text-slate-400 font-mono">
          <span>Tier: <strong className="text-white">{selectedSub.tier}</strong></span>
          <span>Points: <strong className="text-yellow-400">{selectedSub.points}</strong></span>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Authoring & Actions */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Post Content */}
          <div className="bg-[#101117] border border-[#1e202b] p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white uppercase tracking-wider">Post Editor</span>
              <span className="text-slate-500 font-mono text-[11px]">Markdown + Merge Tags</span>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium block mb-1">Newsletter Title</label>
              <input
                type="text"
                value={newsletterTitle}
                onChange={(e) => setNewsletterTitle(e.target.value)}
                className="w-full bg-[#0a0b0e] border border-[#222432] rounded-xl px-3 py-2 text-sm text-white font-bold focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 font-medium block mb-1">Body Text</label>
              <textarea
                rows={8}
                value={postBody}
                onChange={(e) => setPostBody(e.target.value)}
                className="w-full bg-[#0a0b0e] border border-[#222432] rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-mono leading-relaxed"
              />
            </div>

            {/* Merge Tag Shortcuts */}
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400 font-medium">Insert Merge Tags:</span>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {['{{ subscriber.first_name }}', '{{ subscriber.tier }}', '{{ subscriber.points }}', '{{ subscriber.referral_link }}'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setPostBody(prev => prev + ' ' + tag)}
                    className="px-2 py-0.5 rounded bg-[#181923] text-orange-400 hover:bg-[#202230] font-mono border border-[#262837]"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real Test Email Dispatch Box */}
          <div className="bg-[#101117] border border-[#1e202b] p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Send className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Send Test Email</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Provider: {settings.activeProvider.toUpperCase()}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Dispatches the compiled Outlook VML HTML directly to your inbox to test rendering in real email clients.
            </p>

            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="your.email@company.com"
                value={testSendEmail}
                onChange={(e) => setTestSendEmail(e.target.value)}
                className="flex-1 bg-[#0a0b0e] border border-[#222432] rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleSendTestEmail}
                disabled={isSendingTest}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50"
              >
                {isSendingTest ? 'Sending...' : 'Send Test'}
              </button>
            </div>

            {testSendResult && (
              <div className={`p-3 rounded-xl border text-xs font-mono space-y-1 ${
                testSendResult.success 
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300' 
                  : 'bg-red-950/20 border-red-500/40 text-red-300'
              }`}>
                <div className="flex justify-between font-bold">
                  <span>{testSendResult.success ? '✓ Dispatch Succeeded' : '✗ Dispatch Failed'}</span>
                  <span>{testSendResult.latencyMs}ms</span>
                </div>
                <div>Node: {testSendResult.provider}</div>
                {testSendResult.messageId && <div>Message-ID: {testSendResult.messageId}</div>}
                {testSendResult.error && <div className="text-red-400">{testSendResult.error}</div>}
                {!apiKeys.resendApiKey && settings.activeProvider === 'simulator' && (
                  <div className="text-slate-400 text-[11px] font-sans pt-1">
                    Tip: Plug your real Resend or SendGrid API key in Settings to send to real mailboxes.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* AI Newsletter Copilot */}
          <div className="bg-[#101117] border border-[#1e202b] p-5 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">AI Copilot</h3>
              </div>
              <button 
                onClick={onOpenSettings}
                className="text-[10px] text-orange-400 hover:underline font-mono"
              >
                {apiKeys.groqApiKey ? 'Groq Active' : apiKeys.openaiApiKey ? 'OpenAI Active' : 'Heuristic Mode'}
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Topic or focus (e.g. 'DNS records demystified')..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="flex-1 bg-[#0a0b0e] border border-[#222432] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => handleGenerateAi('subject_lines')}
                disabled={isAiGenerating}
                className="px-2.5 py-1 rounded-lg bg-[#181923] hover:bg-[#202230] border border-[#27293a] text-slate-300 font-medium"
              >
                3 Subject Lines
              </button>
              <button
                onClick={() => handleGenerateAi('newsletter_hook')}
                disabled={isAiGenerating}
                className="px-2.5 py-1 rounded-lg bg-[#181923] hover:bg-[#202230] border border-[#27293a] text-slate-300 font-medium"
              >
                Opening Hook
              </button>
              <button
                onClick={() => handleGenerateAi('polish_copy')}
                disabled={isAiGenerating}
                className="px-2.5 py-1 rounded-lg bg-[#181923] hover:bg-[#202230] border border-[#27293a] text-slate-300 font-medium"
              >
                Polish Body
              </button>
            </div>

            {isAiGenerating && (
              <div className="text-xs text-orange-400 font-mono py-2 animate-pulse">
                Consulting AI model...
              </div>
            )}

            {aiOutput && (
              <div className="p-3 bg-[#0a0b0e] border border-[#222432] rounded-xl text-xs text-slate-200 whitespace-pre-wrap font-sans relative group">
                <div className="text-[10px] text-slate-500 font-mono mb-1 uppercase tracking-wider">AI Generated Suggestion:</div>
                {aiOutput}
                <div className="mt-2 pt-2 border-t border-[#1e1f2b] flex justify-end">
                  <button
                    onClick={() => setPostBody(prev => prev + '\n\n' + aiOutput)}
                    className="text-[11px] text-orange-400 hover:underline font-semibold"
                  >
                    Append to Post Body &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Visual Canvas or VML Inspector */}
        <div className={`lg:col-span-7 ${viewDevice === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
          {showOutlookVmlCode ? (
            /* Outlook VML Inspector */
            <div className="bg-[#0b0c10] border border-cyan-500/30 rounded-2xl p-5 font-mono text-xs text-cyan-300 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-cyan-900/40">
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-white">Compiled Word MSO HTML & VML Output</span>
                </div>
                <button
                  onClick={handleCopyVml}
                  className="px-2.5 py-1 rounded bg-cyan-900/40 hover:bg-cyan-900/70 text-cyan-200 flex items-center space-x-1"
                >
                  {vmlCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{vmlCopied ? 'Copied' : 'Copy HTML'}</span>
                </button>
              </div>
              <p className="text-slate-400 text-[11px] font-sans">
                Full standalone HTML email template ready for production sending. Includes VML vector roundrects for Outlook, inline CSS table styles, and RFC 8058 headers.
              </p>
              <pre className="bg-[#101218] p-3.5 rounded-xl overflow-x-auto text-[11px] text-slate-300 border border-[#1e2230] max-h-[600px] overflow-y-auto">
                {compiledHtml}
              </pre>
            </div>
          ) : (
            /* Normal Visual Canvas */
            <div className="bg-[#101117] border border-[#1e202b] rounded-2xl overflow-hidden shadow-xl">
              {/* Client Chrome Header */}
              <div className="bg-[#151620] px-4 py-3 border-b border-[#1f212f] flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-slate-400 ml-2 font-mono text-[11px]">
                    {viewEnvironment === 'email' ? 'Client: Gmail / Outlook 365' : `Web: ${settings.customDomain}/p/high-volume-engine`}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-[11px] font-mono">
                  <span className="text-emerald-400">DKIM: Pass</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-cyan-400">DMARC: 100%</span>
                </div>
              </div>

              {/* Visual Body */}
              <div className="p-6 sm:p-8 space-y-6 bg-[#0c0d12]">
                
                {/* Subject Header */}
                <div className="border-b border-[#1b1c26] pb-4">
                  <div className="text-xs text-orange-400 font-mono mb-1">
                    Subject: {renderMergeTags(subjectA)}
                  </div>
                  <h1 className="text-2xl font-extrabold text-white tracking-tight">
                    {newsletterTitle}
                  </h1>
                  <div className="flex items-center space-x-3 mt-2 text-xs text-slate-400 font-sans">
                    <span>By {settings.senderName}</span>
                    <span>•</span>
                    <span>{settings.publicationName}</span>
                    <span>•</span>
                    <span className="text-orange-400 font-medium">3 min read</span>
                  </div>
                </div>

                {/* Newsletter Text */}
                <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-line font-sans">
                  {renderMergeTags(postBody)}
                </div>

                {/* Video Media Sanitizer Demonstration */}
                <div className="border border-[#222432] rounded-xl overflow-hidden bg-[#13141d]">
                  {viewEnvironment === 'email' ? (
                    <div className="p-5 text-center space-y-2 bg-[#12131b]">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                        <Play className="w-4 h-4 ml-0.5 fill-orange-400" />
                      </div>
                      <div className="text-xs font-bold text-white">
                        Architecture Video: Distributed Edge Queue Telemetry (12:40)
                      </div>
                      <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                        Inboxes do not support inline HTML5 video tags. HiveOS automatically serves this optimized click-to-play image card linking to your web post.
                      </p>
                      <button 
                        onClick={() => setViewEnvironment('web')}
                        className="text-xs text-orange-400 hover:underline font-semibold"
                      >
                        Watch on Web Post &rarr;
                      </button>
                    </div>
                  ) : (
                    <div className="aspect-video bg-black/60 flex flex-col items-center justify-center p-6 text-center border-b border-[#222432]">
                      <Play className="w-10 h-10 text-white/80 hover:text-orange-400 cursor-pointer" />
                      <span className="text-xs text-slate-400 mt-2 font-mono">Interactive HTML5 Web Video Player</span>
                    </div>
                  )}
                </div>

                {/* Dynamic Content Segmentation Section */}
                <div className="p-4 rounded-xl border border-dashed border-purple-500/30 bg-purple-950/10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-300 flex items-center space-x-1.5">
                      <Layers className="w-3.5 h-3.5 text-purple-400" />
                      <span>Dynamic Content (Subscriber Tier Conditional)</span>
                    </span>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded font-mono">
                      Current Viewer: {selectedSub.tier}
                    </span>
                  </div>

                  {selectedSub.isPremium ? (
                    <div className="p-3 bg-purple-900/20 rounded-lg border border-purple-500/30 text-xs text-purple-200">
                      <strong>VIP Dedicated IP Telemetry:</strong> Welcome {selectedSub.name}. As an {selectedSub.tier} subscriber, your sends are dispatched over our isolated warm IP pool with zero noise from free publications.
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-700/40 text-xs text-slate-300">
                      <strong>Free Subscriber Notice:</strong> Hey {selectedSub.name}, you currently have {selectedSub.points} points. Upgrade to Enterprise VIP to unlock custom DKIM alignment and dedicated sending IP pools.
                    </div>
                  )}
                </div>

                {/* Built-in Poll Widget */}
                <div className="bg-[#13141d] border border-[#222432] p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-orange-400" />
                      <span>Poll: What is your primary newsletter constraint?</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">543 votes</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {[
                      { key: 'option1', label: 'Gmail / Yahoo RFC 8058 Compliance', count: pollVotes.option1 },
                      { key: 'option2', label: 'Spamhaus / Barracuda Blocklist Sentinel', count: pollVotes.option2 },
                      { key: 'option3', label: 'Outlook 2016-2024 VML Table Rendering Glitches', count: pollVotes.option3 }
                    ].map(opt => {
                      const total = pollVotes.option1 + pollVotes.option2 + pollVotes.option3;
                      const pct = Math.round((opt.count / total) * 100);
                      return (
                        <button
                          key={opt.key}
                          onClick={() => {
                            if (!userVoted) {
                              setPollVotes(prev => ({ ...prev, [opt.key]: (prev as any)[opt.key] + 1 }));
                              setUserVoted(opt.key);
                            }
                          }}
                          className={`w-full text-left p-2.5 rounded-lg border transition-all relative overflow-hidden ${
                            userVoted === opt.key 
                              ? 'border-orange-500 bg-orange-500/10 text-white' 
                              : 'border-[#222432] bg-[#0f1016] text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          <div 
                            className="absolute top-0 left-0 bottom-0 bg-orange-500/10 pointer-events-none transition-all"
                            style={{ width: `${pct}%` }}
                          />
                          <div className="relative z-10 flex justify-between items-center text-xs">
                            <span>{opt.label}</span>
                            <span className="font-mono text-slate-400">{pct}% ({opt.count})</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Referral Milestone Reward */}
                <div className="bg-[#14151e] border border-[#262837] p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-orange-400">
                      <Award className="w-4 h-4 text-orange-400" />
                      <span>Referral Program Milestone</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      You have <strong>{selectedSub.points} points</strong>. Share your unique link below to unlock milestone rewards.
                    </p>
                    <div className="font-mono text-[11px] text-slate-400 bg-[#0a0b0e] px-2.5 py-1 rounded inline-block">
                      {selectedSub.referralLink}
                    </div>
                  </div>

                  <a
                    href={selectedSub.referralLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-lg bg-[#ff5a36] hover:bg-[#e04622] text-white font-bold text-xs shadow-md shadow-orange-500/20 inline-flex items-center space-x-1.5 shrink-0"
                  >
                    <span>Share Referral</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Footer */}
                <div className="pt-6 border-t border-[#1b1c26] text-center text-[11px] text-slate-500 space-y-1.5 font-sans">
                  <p>
                    You received this dispatch because you subscribed to <strong>{settings.publicationName}</strong>.
                  </p>
                  <p>
                    <a href="#unsub" className="text-slate-400 underline hover:text-white">
                      One-Click Unsubscribe (RFC 8058)
                    </a>
                  </p>
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
