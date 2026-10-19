export type TabType = 
  | 'overview' 
  | 'studio' 
  | 'deliverability' 
  | 'subscribers' 
  | 'settings'
  | 'stack-comparison' 
  | 'api-mcp';

export interface ApiKeys {
  resendApiKey: string;
  sendgridApiKey: string;
  postmarkToken: string;
  openaiApiKey: string;
  groqApiKey: string;
  anthropicApiKey: string;
  zerobounceApiKey: string;
}

export interface PublicationSettings {
  publicationName: string;
  senderName: string;
  senderEmail: string;
  replyToEmail: string;
  customDomain: string;
  activeProvider: 'resend' | 'sendgrid' | 'postmark' | 'simulator';
  activeAiProvider: 'groq' | 'openai' | 'anthropic' | 'builtin';
}

export interface Subscriber {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: 'active' | 'unsubscribed' | 'bounced' | 'suppressed';
  tier: 'Free' | 'Scale' | 'Enterprise VIP';
  source: 'Meta Ads' | 'Referral Program' | 'Organic Search' | 'X / Twitter' | 'Beehiiv Recommendations';
  engagementScore: number; // 1 to 5
  openRate: number;
  clickRate: number;
  referralCount: number;
  joinedAt: string;
  isBotSuspect: boolean;
  engagementHistory: {
    date: string;
    action: string;
    details: string;
  }[];
}

export interface SuppressionEntry {
  id: string;
  email: string;
  layer: 'Global' | 'Publication' | 'Transactional';
  reason: 'Hard Bounce (550 User Unknown)' | 'FBL Spam Complaint' | 'RFC 8058 One-Click Unsub' | 'Spam Trap Hit';
  dateAdded: string;
  sourceProvider: string;
}

export interface RBLStatus {
  name: string;
  host: string;
  status: 'Clean' | 'Listed' | 'Checking';
  lastChecked: string;
  actionTaken: string;
}

export interface WarmupDay {
  day: number;
  maxDailyVolume: number;
  sentVolume: number;
  gmailLimit: number;
  yahooLimit: number;
  microsoftLimit: number;
  status: 'completed' | 'in-progress' | 'scheduled';
}

export interface SimulatedSubscriber {
  id: string;
  name: string;
  email: string;
  tier: string;
  referralLink: string;
  points: number;
  isPremium: boolean;
  avatar: string;
}

export interface PostDraft {
  id: string;
  title: string;
  subjectA: string;
  subjectB: string;
  abTestSplit: number;
  body: string;
  audioUrl?: string;
  updatedAt: string;
}
