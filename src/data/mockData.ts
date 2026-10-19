import { Subscriber, SuppressionEntry, RBLStatus, WarmupDay, SimulatedSubscriber } from '../types';

export const SIMULATED_SUBSCRIBERS: SimulatedSubscriber[] = [
  {
    id: 'sub_1',
    name: 'Alice Henderson',
    email: 'alice.henderson@stripe.com',
    tier: 'Enterprise VIP',
    referralLink: 'https://mail.growthdaily.com?ref=alice_h',
    points: 1420,
    isPremium: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'sub_2',
    name: 'Marcus Vance',
    email: 'marcus.v@buildfaster.io',
    tier: 'Scale Member',
    referralLink: 'https://mail.growthdaily.com?ref=mvance99',
    points: 340,
    isPremium: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'sub_3',
    name: 'Elena Rostova',
    email: 'elena@novacapital.vc',
    tier: 'Enterprise VIP',
    referralLink: 'https://mail.growthdaily.com?ref=elena_vc',
    points: 2890,
    isPremium: true,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80',
  },
  {
    id: 'sub_4',
    name: 'Devon Miles',
    email: 'devon@earlystage.dev',
    tier: 'Free Subscriber',
    referralLink: 'https://mail.growthdaily.com?ref=devon_free',
    points: 50,
    isPremium: false,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
  }
];

export const INITIAL_SUBSCRIBERS: Subscriber[] = [
  {
    id: 'sub-001',
    email: 'sarah.connor@sky.net',
    firstName: 'Sarah',
    lastName: 'Connor',
    status: 'active',
    tier: 'Enterprise VIP',
    source: 'Beehiiv Recommendations',
    engagementScore: 5,
    openRate: 94.2,
    clickRate: 31.8,
    referralCount: 18,
    joinedAt: '2026-01-14',
    isBotSuspect: false,
    engagementHistory: [
      { date: '2026-10-18 09:12', action: 'Opened Post', details: 'Edition #142: Future of Distributed Edge AI' },
      { date: '2026-10-18 09:14', action: 'Clicked Link', details: 'https://beehiiv.com/enterprise-deliverability' },
      { date: '2026-10-12 14:02', action: 'Referral Generated', details: 'Invited john.doe@sky.net (+1 reward)' },
      { date: '2026-09-28 11:30', action: 'Survey Submitted', details: 'Rated newsletter 5/5' }
    ]
  },
  {
    id: 'sub-002',
    email: 'alex.rivera@fintechpulse.co',
    firstName: 'Alex',
    lastName: 'Rivera',
    status: 'active',
    tier: 'Scale',
    source: 'Meta Ads',
    engagementScore: 4,
    openRate: 78.5,
    clickRate: 14.2,
    referralCount: 4,
    joinedAt: '2026-03-02',
    isBotSuspect: false,
    engagementHistory: [
      { date: '2026-10-18 10:45', action: 'Opened Post', details: 'Edition #142: Future of Distributed Edge AI' },
      { date: '2026-10-15 16:20', action: 'Upgraded Tier', details: 'Switched from Free to Scale Annual Plan' }
    ]
  },
  {
    id: 'sub-003',
    email: 'bot-crawler-992@tempmail.io',
    firstName: 'Spam',
    lastName: 'Bot',
    status: 'suppressed',
    tier: 'Free',
    source: 'Organic Search',
    engagementScore: 1,
    openRate: 0,
    clickRate: 0,
    referralCount: 0,
    joinedAt: '2026-10-18',
    isBotSuspect: true,
    engagementHistory: [
      { date: '2026-10-18 03:22', action: 'Signup Blocked', details: 'Triggered honeypot field + disposable domain tempmail.io' }
    ]
  },
  {
    id: 'sub-004',
    email: 'jordan.lee@venturecap.org',
    firstName: 'Jordan',
    lastName: 'Lee',
    status: 'active',
    tier: 'Enterprise VIP',
    source: 'X / Twitter',
    engagementScore: 5,
    openRate: 98.1,
    clickRate: 42.0,
    referralCount: 32,
    joinedAt: '2025-11-20',
    isBotSuspect: false,
    engagementHistory: [
      { date: '2026-10-18 09:05', action: 'Opened Post', details: 'Edition #142 (Mobile Client: Apple Mail)' },
      { date: '2026-10-18 09:08', action: 'Clicked Ad Slot', details: 'Sponsored by Cloudflare Workers' }
    ]
  },
  {
    id: 'sub-005',
    email: 'invalid.mailbox@oldcompanydomain.org',
    firstName: 'Marcus',
    lastName: 'Old',
    status: 'bounced',
    tier: 'Free',
    source: 'Referral Program',
    engagementScore: 1,
    openRate: 12.0,
    clickRate: 0,
    referralCount: 0,
    joinedAt: '2026-05-11',
    isBotSuspect: false,
    engagementHistory: [
      { date: '2026-10-18 09:01', action: 'Hard Bounce 550', details: 'Remote server: 550 5.1.1 User unknown. Added to suppression.' }
    ]
  }
];

export const INITIAL_SUPPRESSION_LIST: SuppressionEntry[] = [
  {
    id: 'sup-1',
    email: 'bounced.lead@discontinuedcorp.com',
    layer: 'Global',
    reason: 'Hard Bounce (550 User Unknown)',
    dateAdded: '2026-10-18 08:30',
    sourceProvider: 'SendGrid Engine Node 4'
  },
  {
    id: 'sup-2',
    email: 'complaint.user@yahoo.com',
    layer: 'Publication',
    reason: 'FBL Spam Complaint',
    dateAdded: '2026-10-17 19:15',
    sourceProvider: 'Yahoo CFL (Feedback Loop)'
  },
  {
    id: 'sup-3',
    email: 'quickexit@gmail.com',
    layer: 'Publication',
    reason: 'RFC 8058 One-Click Unsub',
    dateAdded: '2026-10-16 14:02',
    sourceProvider: 'Gmail List-Unsubscribe Header POST'
  },
  {
    id: 'sup-4',
    email: 'honeypot-trap@spamsieve-rbl.net',
    layer: 'Global',
    reason: 'Spam Trap Hit',
    dateAdded: '2026-10-15 11:45',
    sourceProvider: 'Spamhaus Automated Audit Sentinel'
  },
  {
    id: 'sup-5',
    email: 'billing-error@clientdomain.com',
    layer: 'Transactional',
    reason: 'Hard Bounce (550 User Unknown)',
    dateAdded: '2026-10-14 21:00',
    sourceProvider: 'Stripe Webhook Delivery Service'
  }
];

export const RBL_MONITORS: RBLStatus[] = [
  { name: 'Spamhaus ZEN', host: 'zen.spamhaus.org', status: 'Clean', lastChecked: '12s ago', actionTaken: 'Pool Rotation Normal' },
  { name: 'Barracuda BRBL', host: 'bbl.barracudacentral.org', status: 'Clean', lastChecked: '45s ago', actionTaken: 'Pool Rotation Normal' },
  { name: 'SpamCop SCBL', host: 'bl.spamcop.net', status: 'Clean', lastChecked: '1m ago', actionTaken: 'Pool Rotation Normal' },
  { name: 'SORBS Combined', host: 'dnsbl.sorbs.net', status: 'Clean', lastChecked: '2m ago', actionTaken: 'Pool Rotation Normal' },
  { name: 'Invaluement URI', host: 'ivmURI.invaluement.com', status: 'Clean', lastChecked: '30s ago', actionTaken: 'Pool Rotation Normal' },
  { name: 'Microsoft SNDS', host: 'postmaster.live.com', status: 'Clean', lastChecked: '4m ago', actionTaken: 'Green Status (100% IP Health)' }
];

export const WARMUP_SCHEDULE: WarmupDay[] = [
  { day: 1, maxDailyVolume: 500, sentVolume: 500, gmailLimit: 250, yahooLimit: 150, microsoftLimit: 100, status: 'completed' },
  { day: 2, maxDailyVolume: 1000, sentVolume: 1000, gmailLimit: 500, yahooLimit: 300, microsoftLimit: 200, status: 'completed' },
  { day: 3, maxDailyVolume: 2500, sentVolume: 2500, gmailLimit: 1250, yahooLimit: 750, microsoftLimit: 500, status: 'completed' },
  { day: 4, maxDailyVolume: 5000, sentVolume: 5000, gmailLimit: 2500, yahooLimit: 1500, microsoftLimit: 1000, status: 'completed' },
  { day: 5, maxDailyVolume: 10000, sentVolume: 10000, gmailLimit: 5000, yahooLimit: 3000, microsoftLimit: 2000, status: 'completed' },
  { day: 6, maxDailyVolume: 25000, sentVolume: 18450, gmailLimit: 12500, yahooLimit: 7500, microsoftLimit: 5000, status: 'in-progress' },
  { day: 7, maxDailyVolume: 50000, sentVolume: 0, gmailLimit: 25000, yahooLimit: 15000, microsoftLimit: 10000, status: 'scheduled' },
  { day: 14, maxDailyVolume: 250000, sentVolume: 0, gmailLimit: 125000, yahooLimit: 75000, microsoftLimit: 50000, status: 'scheduled' },
  { day: 21, maxDailyVolume: 1000000, sentVolume: 0, gmailLimit: 500000, yahooLimit: 300000, microsoftLimit: 200000, status: 'scheduled' },
  { day: 30, maxDailyVolume: 5000000, sentVolume: 0, gmailLimit: 2500000, yahooLimit: 1500000, microsoftLimit: 1000000, status: 'scheduled' }
];

export const VIBE_CODED_STACK_ITEMS = [
  { category: 'Email Sending', service: 'SendGrid / AWS SES / Postmark', monthlyCost: 450, notes: 'Requires dedicated IPs, IP warming pools, and FBL registration' },
  { category: 'Hosting & Edge', service: 'Cloudflare Pages & Workers / Vercel Enterprise', monthlyCost: 120, notes: 'Global low latency CDN with Edge SSR' },
  { category: 'Database & Queue', service: 'Supabase / Neon RDS + Upstash BullMQ', monthlyCost: 280, notes: '3M/min queue throughput with backpressure' },
  { category: 'Payments & Billing', service: 'Stripe Connect + Billing Engine', monthlyCost: 190, notes: 'Tiered subscriptions, taxes, currency conversion' },
  { category: 'Auth & RBAC', service: 'Clerk / Auth0 Multi-tenant', monthlyCost: 150, notes: 'Session security, magic links, user roles' },
  { category: 'Monitoring & Alerting', service: 'Datadog / Sentry / PagerDuty', monthlyCost: 340, notes: '24/7 RBL alerts, bounce spikes, latency monitors' },
  { category: 'Workflows & Orchestration', service: 'Inngest / Temporal Serverless', monthlyCost: 200, notes: 'Drip campaigns, dynamic segmentation triggers' },
  { category: 'Bot Protection & WAF', service: 'Cloudflare Turnstile + Rate Limiter', monthlyCost: 80, notes: 'Honeypots, automated IP token buckets' },
  { category: 'Email Validation APIs', service: 'ZeroBounce + Kickbox Enterprise', monthlyCost: 320, notes: '1st & 3rd party syntax, MX, and disposable checks' },
  { category: 'Rendering Tests', service: 'Litmus / Email on Acid Matrix', monthlyCost: 199, notes: 'Outlook 2016-2024 VML, MSO tables, dark mode checks' },
  { category: 'Bot Click Filtering', service: 'Omnivery / Barracuda Defense Scrubbing', monthlyCost: 450, notes: 'Filters security scanner prefetching from open/click telemetry' },
  { category: 'Storage & CDN Media', service: 'Cloudflare R2 / AWS S3 + Image Resizing', monthlyCost: 95, notes: 'Audio newsletters, high-res images, email asset hosting' },
  { category: 'Analytics & Product', service: 'PostHog / Mixpanel Custom Events', monthlyCost: 260, notes: 'Per-subscriber engagement score & cohort retention' },
];
