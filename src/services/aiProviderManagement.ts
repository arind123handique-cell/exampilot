/**
 * AI PROVIDER MANAGEMENT & GENERATION HISTORY
 *
 * Supports multi-provider architecture:
 * - Google Gemini (Primary Default: gemini-3.8-flash, gemini-3.5-flash, gemini-3.5-flash-lite, gemini-2.5-flash)
 * - OpenAI (gpt-4o-mini, gpt-4o)
 * - Anthropic (claude-3-5-sonnet, claude-3-5-haiku)
 * - OpenRouter
 * - Groq (llama-3.3-70b-versatile)
 * - Local Ollama (qwen2.5-coder:7b)
 *
 * Secure storage: Keys are stored only in admin local session storage with zero leakage to student bundles.
 */

import { MCQQuestion } from '../types';

export type AiProviderType = 'gemini' | 'openai' | 'anthropic' | 'openrouter' | 'groq' | 'ollama';

export interface AiProviderConfig {
  id: AiProviderType;
  name: string;
  defaultModel: string;
  models: string[];
  apiKey: string;
  endpoint?: string;
  isActive: boolean;
  isConfigured: boolean;
  notes?: string;
}

export interface AiGenerationHistoryItem {
  id: string;
  timestamp: string;
  topic: string;
  subject: string;
  branch: string;
  examLevel: string;
  provider: AiProviderType;
  model: string;
  questionCount: number;
  mode: 'AI_GENERATED' | 'HYBRID';
  executionTimeMs: number;
  status: 'SUCCESS' | 'FAILED' | 'PARTIAL';
  errorMessage?: string;
  promptSnippet?: string;
  generatedQuestions: MCQQuestion[];
}

const PROVIDER_CONFIGS_KEY = 'exampilot_admin_ai_providers_v2';
const ACTIVE_PROVIDER_KEY = 'exampilot_admin_active_ai_provider';
const GENERATION_HISTORY_KEY = 'exampilot_admin_ai_generation_history';

export const DEFAULT_AI_PROVIDERS: Record<AiProviderType, AiProviderConfig> = {
  gemini: {
    id: 'gemini',
    name: 'Google Gemini',
    defaultModel: 'gemini-3.5-flash-lite',
    models: ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-2.5-flash', 'gemini-2.0-flash'],
    apiKey: '',
    isActive: true,
    isConfigured: true,
    notes: 'Primary recommended engine. High speed, structured JSON and vision support.'
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    defaultModel: 'gpt-4o-mini',
    models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo'],
    apiKey: '',
    isActive: false,
    isConfigured: false,
    notes: 'Standard OpenAI completion models via api.openai.com'
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic Claude',
    defaultModel: 'claude-3-5-sonnet-latest',
    models: ['claude-3-5-sonnet-latest', 'claude-3-5-haiku-latest'],
    apiKey: '',
    isActive: false,
    isConfigured: false,
    notes: 'Deep reasoning models via api.anthropic.com'
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    defaultModel: 'anthropic/claude-3.5-sonnet',
    models: ['anthropic/claude-3.5-sonnet', 'meta-llama/llama-3.3-70b-instruct', 'google/gemini-flash-1.5'],
    apiKey: '',
    isActive: false,
    isConfigured: false,
    notes: 'Multi-model aggregator with unified API keys'
  },
  groq: {
    id: 'groq',
    name: 'Groq Cloud',
    defaultModel: 'llama-3.3-70b-versatile',
    models: ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768', 'gemma2-9b-it'],
    apiKey: '',
    isActive: false,
    isConfigured: false,
    notes: 'Ultra-fast LPU inference'
  },
  ollama: {
    id: 'ollama',
    name: 'Local Ollama',
    defaultModel: 'qwen2.5-coder:7b',
    models: ['qwen2.5-coder:7b', 'llama3.2:3b', 'mistral:7b'],
    apiKey: '',
    endpoint: 'http://127.0.0.1:11434',
    isActive: true,
    isConfigured: true,
    notes: 'Free, local privacy-first offline engine'
  }
};

/**
 * Retrieve all configured AI providers with admin overrides
 */
export function getAiProviders(): Record<AiProviderType, AiProviderConfig> {
  try {
    const raw = localStorage.getItem(PROVIDER_CONFIGS_KEY);
    const existing = raw ? JSON.parse(raw) : {};
    
    // Seed Gemini API key from environment / existing key if available
    const geminiKey = localStorage.getItem('exampilot_gemini_key') || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';

    const merged = { ...DEFAULT_AI_PROVIDERS };
    for (const key of Object.keys(DEFAULT_AI_PROVIDERS) as AiProviderType[]) {
      merged[key] = {
        ...DEFAULT_AI_PROVIDERS[key],
        ...(existing[key] || {})
      };
      if (key === 'gemini' && !merged[key].apiKey && geminiKey) {
        merged[key].apiKey = geminiKey;
        merged[key].isConfigured = true;
      }
    }
    return merged;
  } catch (err) {
    console.warn('[AiProviderManagement] Error loading providers:', err);
    return DEFAULT_AI_PROVIDERS;
  }
}

/**
 * Save updated AI provider configuration
 */
export function saveAiProviderConfig(provider: AiProviderConfig): void {
  try {
    const all = getAiProviders();
    all[provider.id] = {
      ...provider,
      isConfigured: Boolean(provider.apiKey && provider.apiKey.trim().length > 0) || provider.id === 'ollama'
    };
    localStorage.setItem(PROVIDER_CONFIGS_KEY, JSON.stringify(all));

    // If Gemini, sync to traditional storage key for backward compatibility
    if (provider.id === 'gemini') {
      if (provider.apiKey) {
        localStorage.setItem('exampilot_gemini_key', provider.apiKey);
      }
      if (provider.defaultModel) {
        localStorage.setItem('exampilot_gemini_model', provider.defaultModel);
      }
    }

    window.dispatchEvent(new CustomEvent('exampilot_ai_providers_updated', { detail: all }));
  } catch (err) {
    console.error('[AiProviderManagement] Failed to save provider:', err);
  }
}

/**
 * Get active AI provider ID
 */
export function getActiveAiProviderId(): AiProviderType {
  try {
    const saved = localStorage.getItem(ACTIVE_PROVIDER_KEY);
    if (saved && (saved in DEFAULT_AI_PROVIDERS)) {
      return saved as AiProviderType;
    }
  } catch {}
  return 'gemini';
}

/**
 * Set active AI provider
 */
export function setActiveAiProvider(providerId: AiProviderType): void {
  localStorage.setItem(ACTIVE_PROVIDER_KEY, providerId);
  window.dispatchEvent(new CustomEvent('exampilot_active_provider_changed', { detail: providerId }));
}

/**
 * Get active provider object
 */
export function getActiveAiProvider(): AiProviderConfig {
  const all = getAiProviders();
  const activeId = getActiveAiProviderId();
  return all[activeId] || all.gemini;
}

/**
 * AI Generation History Management
 */
export function getAiGenerationHistory(): AiGenerationHistoryItem[] {
  try {
    const raw = localStorage.getItem(GENERATION_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function logAiGeneration(item: Omit<AiGenerationHistoryItem, 'id' | 'timestamp'>): AiGenerationHistoryItem {
  const record: AiGenerationHistoryItem = {
    ...item,
    id: `ai-gen-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString()
  };

  try {
    const existing = getAiGenerationHistory();
    const updated = [record, ...existing].slice(0, 100); // keep last 100
    localStorage.setItem(GENERATION_HISTORY_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('exampilot_ai_history_updated', { detail: record }));
  } catch (err) {
    console.warn('[AiProviderManagement] Error saving history:', err);
  }

  return record;
}

export function clearAiGenerationHistory(): void {
  localStorage.removeItem(GENERATION_HISTORY_KEY);
  window.dispatchEvent(new CustomEvent('exampilot_ai_history_updated'));
}
