import React, { useState, useEffect } from 'react';
import {
  Server,
  Activity,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Code,
  ShieldCheck,
  Layers,
  ArrowRight,
  Database,
  Play,
  Key,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { JobSourceRecord } from '../types';

interface ProviderConfig {
  id: string;
  name: string;
  type: 'Scraper' | 'ATS_Crawler' | 'Apify_Actor' | 'API_Feed' | 'Search_Grounding';
  status: 'Healthy' | 'Degraded' | 'Idle' | 'Live_Connected';
  configured?: boolean;
  rateLimit: string;
  lastRun: string;
  successRate: string;
  actorId?: string;
  isRetryable: boolean;
  notes?: string;
}

interface ProviderAdaptersViewProps {
  onRunDiscovery?: () => void;
  isDiscovering?: boolean;
}

export const ProviderAdaptersView: React.FC<ProviderAdaptersViewProps> = ({
  onRunDiscovery,
  isDiscovering = false
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string>('apify');
  const [providers, setProviders] = useState<ProviderConfig[]>([
    {
      id: 'apify',
      name: 'Apify Actor Adapter Registry (LinkedIn & Indeed)',
      type: 'Apify_Actor',
      status: 'Live_Connected',
      configured: true,
      rateLimit: 'Actor Pool Concurrency: 4',
      lastRun: '1 min ago',
      successRate: '98.4%',
      actorId: 'apify/linkedin-jobs-scraper',
      isRetryable: true,
      notes: 'Executes Apify cloud actor runs with canonical normalization'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Direct & Scraper Adapter',
      type: 'Scraper',
      status: 'Live_Connected',
      configured: true,
      rateLimit: '12 req / min (Exponential Backoff)',
      lastRun: '5 mins ago',
      successRate: '97.9%',
      actorId: 'apify/linkedin-jobs-scraper',
      isRetryable: true,
      notes: 'Maps LinkedIn Job postings to canonical JobSourceRecord'
    },
    {
      id: 'indeed',
      name: 'Indeed Feed & Search Adapter',
      type: 'API_Feed',
      status: 'Live_Connected',
      configured: true,
      rateLimit: '30 req / min',
      lastRun: '12 mins ago',
      successRate: '99.1%',
      actorId: 'apify/indeed-scraper',
      isRetryable: true,
      notes: 'Ingests Indeed job cards and salary estimates'
    },
    {
      id: 'company_ats',
      name: 'Company ATS Direct Crawler (Greenhouse / Lever / Ashby)',
      type: 'ATS_Crawler',
      status: 'Live_Connected',
      configured: true,
      rateLimit: '45 req / min (Live Public ATS APIs)',
      lastRun: 'Just now',
      successRate: '100%',
      isRetryable: true,
      notes: 'Direct HTTP Harvest from employer boards with verified publication timestamps'
    }
  ]);

  const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(false);
  const [isTestingAdapter, setIsTestingAdapter] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [targetAtsBoard, setTargetAtsBoard] = useState<string>('stripe');
  const [customActorId, setCustomActorId] = useState<string>('apify/linkedin-jobs-scraper');

  // Fetch live provider status from backend
  const fetchProviderStatus = async () => {
    setIsLoadingStatus(true);
    try {
      const res = await fetch('/api/providers/status');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.providers)) {
          setProviders(data.providers);
        }
      }
    } catch (e) {
      console.warn('Could not refresh provider status:', e);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchProviderStatus();
  }, []);

  // Run a live test against the selected adapter
  const handleTestAdapter = async (providerId: string) => {
    setIsTestingAdapter(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/providers/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId,
          actorId: customActorId,
          company: targetAtsBoard,
          input: {
            searchTerms: 'Staff Engineer',
            location: 'United States',
            maxItems: 5
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        setTestResult(data);
      } else {
        const err = await res.json();
        setTestResult({ error: err.error || 'Test failed' });
      }
    } catch (e: any) {
      setTestResult({ error: e.message || 'Network request failed' });
    } finally {
      setIsTestingAdapter(false);
    }
  };

  const selectedProviderConfig = providers.find(p => p.id === selectedProvider) || providers[0];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 border border-[#D1CEC7] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A1A]">Provider Framework & Apify Adapters</h2>
            <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest bg-[#1A1A1A] text-white">
              {providers.length} Adapters Live
            </span>
          </div>
          <p className="text-xs text-[#5E5A54] mt-1 leading-relaxed max-w-2xl">
            Live multi-source job ingestion pipeline integrating Apify Actors (LinkedIn & Indeed), Direct ATS Crawlers (Greenhouse, Lever, Ashby), and Google Search Grounding with canonical normalization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchProviderStatus}
            disabled={isLoadingStatus}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#F4F1ED] hover:bg-[#EAE6E1] text-[#1A1A1A] text-[10px] uppercase font-bold tracking-widest border border-[#D1CEC7] transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isLoadingStatus ? 'animate-spin' : ''}`} />
            Refresh Status
          </button>

          {onRunDiscovery && (
            <button
              onClick={onRunDiscovery}
              disabled={isDiscovering}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] hover:bg-black text-white text-[10px] uppercase font-bold tracking-widest transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {isDiscovering ? 'Crawling Adapters...' : 'Run Live Discovery'}
            </button>
          )}
        </div>
      </div>

      {/* Provider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {providers.map(p => (
          <div
            key={p.id}
            onClick={() => {
              setSelectedProvider(p.id);
              if (p.actorId) setCustomActorId(p.actorId);
            }}
            className={`p-5 bg-white border transition-all cursor-pointer flex flex-col justify-between ${
              selectedProvider === p.id
                ? 'border-[#1A1A1A] ring-1 ring-[#1A1A1A] shadow-sm'
                : 'border-[#D1CEC7] hover:border-[#8A847C]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="p-1.5 bg-[#F4F1ED] text-[#1A1A1A] border border-[#D1CEC7]">
                  <Server className="w-3.5 h-3.5" />
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 bg-[#1A1A1A] text-white">
                  {p.status}
                </span>
              </div>

              <h4 className="text-sm font-serif font-bold text-[#1A1A1A] mt-3 line-clamp-1">{p.name}</h4>
              <p className="text-[10px] text-[#8A847C] mt-0.5 font-mono uppercase tracking-wider">{p.type}</p>

              {p.notes && (
                <p className="text-[11px] text-[#5E5A54] mt-2 line-clamp-2 leading-relaxed">
                  {p.notes}
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-[#D1CEC7] space-y-1.5 text-xs text-[#5E5A54]">
              <div className="flex justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A847C]">Rate Limit:</span>
                <span className="font-mono text-[#1A1A1A] text-[11px]">{p.rateLimit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A847C]">Success:</span>
                <span className="font-mono font-bold text-[#1A1A1A] text-[11px]">{p.successRate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Adapter Test & Inspector Panel */}
      <div className="bg-white border border-[#D1CEC7] shadow-xs p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#D1CEC7]">
          <div>
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-[#1A1A1A]" />
              <h3 className="text-sm font-serif font-bold text-[#1A1A1A]">
                Live Adapter Port Inspector: {selectedProviderConfig?.name}
              </h3>
            </div>
            <p className="text-xs text-[#5E5A54] mt-0.5">
              Execute live test calls to inspect upstream payloads, latency, and canonical mapping.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {selectedProvider === 'company_ats' ? (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A847C]">Board Token:</span>
                <input
                  type="text"
                  value={targetAtsBoard}
                  onChange={e => setTargetAtsBoard(e.target.value)}
                  className="px-2.5 py-1 bg-[#F9F9F7] border border-[#D1CEC7] text-xs font-mono text-[#1A1A1A] w-28"
                  placeholder="stripe"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A847C]">Actor ID:</span>
                <input
                  type="text"
                  value={customActorId}
                  onChange={e => setCustomActorId(e.target.value)}
                  className="px-2.5 py-1 bg-[#F9F9F7] border border-[#D1CEC7] text-xs font-mono text-[#1A1A1A] w-48"
                  placeholder="apify/linkedin-jobs-scraper"
                />
              </div>
            )}

            <button
              onClick={() => handleTestAdapter(selectedProvider)}
              disabled={isTestingAdapter}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1A1A1A] hover:bg-black text-white text-[10px] uppercase font-bold tracking-widest transition-colors cursor-pointer disabled:opacity-50 shadow-xs whitespace-nowrap"
            >
              <Play className={`w-3 h-3 ${isTestingAdapter ? 'animate-spin' : ''}`} />
              {isTestingAdapter ? 'Executing Test...' : 'Test Adapter Live'}
            </button>
          </div>
        </div>

        {/* Test Result Inspector Output */}
        {testResult ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1A1A1A]" />
                Live Response Received • Items Fetched: {testResult.itemsFetched ?? testResult.canonicalJobs?.length ?? 0}
              </span>
              {testResult.latencyMs && (
                <span className="text-[#5E5A54]">Latency: {testResult.latencyMs}ms</span>
              )}
            </div>

            <div className="p-5 bg-[#1A1A1A] text-[#F4F1ED] font-mono text-xs overflow-x-auto leading-relaxed border border-[#1A1A1A] max-h-96">
              <pre>{JSON.stringify(testResult, null, 2)}</pre>
            </div>
          </div>
        ) : (
          <div className="p-5 bg-[#1A1A1A] text-[#F4F1ED] font-mono text-xs overflow-x-auto leading-relaxed border border-[#1A1A1A]">
            <pre>
{JSON.stringify({
  canonical_schema_version: '2.4.0',
  active_adapter: selectedProviderConfig?.id,
  actor_id: selectedProviderConfig?.actorId || 'apify/linkedin-jobs-scraper',
  connection_mode: 'HTTP_REST_CLIENT',
  resilience_policy: {
    retry_attempts: 3,
    backoff_ms: 1500,
    circuit_breaker: 'CLOSED',
    isolated_failure_containment: true
  },
  click_action: 'Click "Test Adapter Live" to execute a live test run against this provider port.'
}, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
