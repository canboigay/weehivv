import React, { useState } from 'react';
import { 
  Terminal, 
  Send, 
  Copy, 
  Check, 
  Layers, 
  Code, 
  Bot, 
  Key, 
  CheckCircle2,
  Cpu
} from 'lucide-react';

export const BeehiivAPI: React.FC = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('get_subscribers');
  const [apiKey, setApiKey] = useState('bh_live_99d7f082e4a81c103b44');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const endpoints = [
    {
      id: 'get_subscribers',
      method: 'GET',
      path: '/v2/publications/pub_99a/subscribers',
      description: 'Fetch subscriber directory with 360° engagement history & UTM attribution',
      sampleResponse: {
        data: [
          {
            id: 'sub_001',
            email: 'sarah.connor@sky.net',
            tier: 'Enterprise VIP',
            engagement_score: 5,
            open_rate: 94.2,
            bot_risk_score: 0.01,
            acquisition: {
              source: 'Beehiiv Recommendations',
              referrer: 'https://growthdaily.com'
            }
          }
        ],
        meta: { total: 284590, page: 1, limit: 10 }
      }
    },
    {
      id: 'create_post',
      method: 'POST',
      path: '/v2/publications/pub_99a/posts',
      description: 'Create and dispatch campaign with Subject A/B testing & Outlook VML compilation',
      sampleResponse: {
        post_id: 'post_883a9',
        status: 'scheduled',
        ab_test: {
          variant_a: '🚨 Why 99.3% Deliverability Matters',
          variant_b: 'The $2,480/mo Vibe-Coding Tax Revealed',
          sample_size: 0.20,
          winner_metric: 'opens'
        },
        outlook_vml_compiled: true,
        rfc_8058_headers_injected: true
      }
    },
    {
      id: 'verify_email',
      method: 'POST',
      path: '/v2/deliverability/verify',
      description: '1st & 3rd party email validation, disposable domain filter, and typo check',
      sampleResponse: {
        email: 'alex.rivera@fintechpulse.co',
        is_valid: true,
        is_disposable: false,
        has_mx_record: true,
        inbox_placement_score: 99.2,
        action: 'allow_signup'
      }
    },
    {
      id: 'mcp_tools',
      method: 'GET',
      path: '/v2/mcp/manifest',
      description: 'Model Context Protocol (MCP) tool schema for autonomous AI agents',
      sampleResponse: {
        server: 'beehiiv-enterprise-mcp',
        version: '1.4.0',
        tools: [
          {
            name: 'beehiiv_publish_post',
            description: 'Drafts, compiles Outlook VML, and schedules a newsletter send',
            parameters: { title: 'string', body: 'string', subject_ab_test: 'object' }
          },
          {
            name: 'beehiiv_check_rbl_sentinel',
            description: 'Queries 64 sending IPs against Spamhaus ZEN & Barracuda',
            parameters: {}
          },
          {
            name: 'beehiiv_manage_suppression',
            description: 'Adds or audits email in Global, Publication, or Transactional layers',
            parameters: { email: 'string', layer: 'enum[Global, Publication, Transactional]' }
          }
        ]
      }
    }
  ];

  const activeEp = endpoints.find(e => e.id === selectedEndpoint) || endpoints[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(activeEp.sampleResponse, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateRequest = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-[#14151d] border border-[#232431] p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Developer API & MCP Server</h2>
            <span className="text-xs font-mono bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded">
              REST v2 & Model Context Protocol
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Integrate subscriber ingestion, campaign publishing, automated suppression sync, and AI agent tool calling via MCP.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-[#1b1c27] p-2 rounded-xl border border-[#2b2d3d] text-xs">
          <Key className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-slate-400">API Key:</span>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="bg-[#0e0f14] border border-[#282a3a] rounded px-2 py-0.5 text-white font-mono text-xs w-36"
          />
        </div>
      </div>

      {/* API Explorer Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Endpoint Selector */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Available Endpoints & MCP Tools
          </span>

          {endpoints.map((ep) => (
            <div
              key={ep.id}
              onClick={() => { setSelectedEndpoint(ep.id); handleSimulateRequest(); }}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedEndpoint === ep.id
                  ? 'bg-purple-950/20 border-purple-500 text-white shadow-lg shadow-purple-500/10'
                  : 'bg-[#14151d] border-[#232431] text-slate-300 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  ep.method === 'GET' 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-orange-500/20 text-orange-400'
                }`}>
                  {ep.method}
                </span>
                <span className="font-mono text-xs font-semibold truncate">{ep.path}</span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2">{ep.description}</p>
            </div>
          ))}
        </div>

        {/* Live Response Panel */}
        <div className="lg:col-span-8 bg-[#14151d] border border-[#232431] rounded-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-[#181923] p-4 border-b border-[#232431] flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                activeEp.method === 'GET' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'
              }`}>
                {activeEp.method}
              </span>
              <span className="text-white font-mono font-bold text-xs">{activeEp.path}</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleSimulateRequest}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1 transition-all"
              >
                <Send className="w-3 h-3" />
                <span>Send Request</span>
              </button>

              <button
                onClick={handleCopy}
                className="p-1.5 bg-[#232433] hover:bg-[#2c2e40] text-slate-300 rounded-lg text-xs"
                title="Copy JSON"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Response Meta */}
          <div className="bg-[#111219] px-4 py-2 border-b border-[#1f202d] flex items-center justify-between text-[11px] font-mono text-slate-400">
            <div className="flex items-center space-x-4">
              <span>Status: <strong className="text-emerald-400">200 OK</strong></span>
              <span>Latency: <strong className="text-cyan-400">18ms (Edge Cloudflare Worker)</strong></span>
            </div>
            <span>Content-Type: application/json</span>
          </div>

          {/* JSON Body */}
          <div className="p-4 bg-[#0a0b0e] flex-1 font-mono text-xs text-slate-200 overflow-x-auto">
            {isLoading ? (
              <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center space-y-2">
                <Cpu className="w-6 h-6 animate-spin text-purple-400" />
                <span>Dispatching edge worker request...</span>
              </div>
            ) : (
              <pre className="text-slate-300 leading-relaxed">
                {JSON.stringify(activeEp.sampleResponse, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
