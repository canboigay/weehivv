import { ApiKeys, PublicationSettings, Subscriber, SuppressionEntry, PostDraft } from '../types';
import { INITIAL_SUBSCRIBERS, INITIAL_SUPPRESSION_LIST } from '../data/mockData';

const KEYS_STORAGE_KEY = 'hiveos_api_keys_v1';
const SETTINGS_STORAGE_KEY = 'hiveos_settings_v1';
const SUBSCRIBERS_STORAGE_KEY = 'hiveos_subscribers_v1';
const SUPPRESSIONS_STORAGE_KEY = 'hiveos_suppressions_v1';
const DRAFT_STORAGE_KEY = 'hiveos_draft_v1';

export const DEFAULT_API_KEYS: ApiKeys = {
  resendApiKey: '',
  sendgridApiKey: '',
  postmarkToken: '',
  openaiApiKey: '',
  groqApiKey: '',
  anthropicApiKey: '',
  zerobounceApiKey: '',
};

export const DEFAULT_SETTINGS: PublicationSettings = {
  publicationName: 'The Edge Dispatch',
  senderName: 'Editor in Chief',
  senderEmail: 'newsletter@yourdomain.com',
  replyToEmail: 'support@yourdomain.com',
  customDomain: 'yourdomain.com',
  activeProvider: 'simulator',
  activeAiProvider: 'builtin',
};

export function loadApiKeys(): ApiKeys {
  try {
    const raw = localStorage.getItem(KEYS_STORAGE_KEY);
    return raw ? { ...DEFAULT_API_KEYS, ...JSON.parse(raw) } : DEFAULT_API_KEYS;
  } catch {
    return DEFAULT_API_KEYS;
  }
}

export function saveApiKeys(keys: ApiKeys): void {
  try {
    localStorage.setItem(KEYS_STORAGE_KEY, JSON.stringify(keys));
  } catch (e) {
    console.error('Failed to save API keys to localStorage', e);
  }
}

export function loadPublicationSettings(): PublicationSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function savePublicationSettings(settings: PublicationSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function loadSubscribers(): Subscriber[] {
  try {
    const raw = localStorage.getItem(SUBSCRIBERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_SUBSCRIBERS;
  } catch {
    return INITIAL_SUBSCRIBERS;
  }
}

export function saveSubscribers(subs: Subscriber[]): void {
  try {
    localStorage.setItem(SUBSCRIBERS_STORAGE_KEY, JSON.stringify(subs));
  } catch (e) {
    console.error('Failed to save subscribers', e);
  }
}

export function loadSuppressions(): SuppressionEntry[] {
  try {
    const raw = localStorage.getItem(SUPPRESSIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_SUPPRESSION_LIST;
  } catch {
    return INITIAL_SUPPRESSION_LIST;
  }
}

export function saveSuppressions(entries: SuppressionEntry[]): void {
  try {
    localStorage.setItem(SUPPRESSIONS_STORAGE_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error('Failed to save suppressions', e);
  }
}

export function exportDatabaseJson(): string {
  const payload = {
    exportDate: new Date().toISOString(),
    settings: loadPublicationSettings(),
    subscribers: loadSubscribers(),
    suppressions: loadSuppressions(),
  };
  return JSON.stringify(payload, null, 2);
}

export function importDatabaseJson(jsonStr: string): boolean {
  try {
    const parsed = JSON.parse(jsonStr);
    if (parsed.subscribers) saveSubscribers(parsed.subscribers);
    if (parsed.suppressions) saveSuppressions(parsed.suppressions);
    if (parsed.settings) savePublicationSettings(parsed.settings);
    return true;
  } catch (e) {
    console.error('Invalid database JSON format', e);
    return false;
  }
}
