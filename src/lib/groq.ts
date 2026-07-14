

/**
 * groq.ts — Groq AI API calls (converted from ai.js)
 */

import { CITIES, FORECAST_DATA } from './store';
import { getAQICat, ADVISORIES, getAdvisoryLevel } from './data';

const AI_CONFIG = {
  API_URL: 'https://api.groq.com/openai/v1/chat/completions',
  MODEL: 'llama-3.3-70b-versatile',
  MAX_TOKENS: 512,
  TEMPERATURE: 0.7
};

// ─── Key Management ───────────────────────────────────────────────────────────
export function getGroqKey(): string | null {
  const stored = localStorage.getItem('airsense_groq_key');
  return stored || null;
}

export function saveGroqKey(key: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('airsense_groq_key', key.trim());
}

export function clearGroqKey() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('airsense_groq_key');
}

// ─── Core Groq API Call ───────────────────────────────────────────────────────
export async function askGroq(systemPrompt: string, userMessage: string, maxTokens = AI_CONFIG.MAX_TOKENS): Promise<string> {
  const key = getGroqKey();
  if (!key) throw new Error('NO_KEY');

  const body = {
    model: AI_CONFIG.MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    max_tokens: maxTokens,
    temperature: AI_CONFIG.TEMPERATURE
  };

  const res = await fetch(AI_CONFIG.API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as any;
    throw new Error(err.error?.message || `Groq API error ${res.status}`);
  }

  const data = await res.json() as any;
  return data.choices?.[0]?.message?.content?.trim() || '';
}

export async function askGroqChat(messages: any[], maxTokens = 400): Promise<string> {
  const key = getGroqKey();
  if (!key) throw new Error('NO_KEY');

  const body = {
    model: AI_CONFIG.MODEL,
    messages,
    max_tokens: maxTokens,
    temperature: 0.6
  };

  const res = await fetch(AI_CONFIG.API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as any;
    throw new Error(err.error?.message || `Groq API error ${res.status}`);
  }

  const data = await res.json() as any;
  return data.choices?.[0]?.message?.content?.trim() || '';
}

// ─── AI Features ──────────────────────────────────────────────────────────────
export async function generateNationalAnalysis(): Promise<string> {
  const cityLines = CITIES.map(c => {
    const cat = getAQICat(c.aqi);
    return `${c.name}: AQI ${c.aqi} (${cat.label}), PM2.5=${c.pm25}µg/m³, trend ${c.trend > 0 ? '+' : ''}${c.trend}`;
  }).join('\n');

  const system = `You are AirSense IQ, an expert AI environmental analyst specialising in Indian urban air quality. 
Be concise, data-driven, and actionable. Write in crisp, authoritative English. No markdown, no bullet points — just clear prose.`;

  const user = `Current AQI readings across 7 major Indian cities (${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST):\n${cityLines}\n\nWrite a 3-sentence expert analysis: (1) Overall national air quality status, (2) Most concerning city/trend and why, (3) One specific actionable recommendation for city administrators.`;

  return askGroq(system, user, 300);
}

export async function generateSmartAdvisory(cityId: string, lang = 'english'): Promise<string> {
  const city = CITIES.find(c => c.id === cityId) || CITIES[0];
  const cat = getAQICat(city.aqi);

  const langInstructions: Record<string, string> = {
    english: 'Write in clear, formal English.',
    hindi: 'Write entirely in Hindi (Devanagari script). Use formal language.',
    kannada: 'Write entirely in Kannada (Kannada script). Use formal language.',
    tamil: 'Write entirely in Tamil (Tamil script). Use formal language.'
  };

  const system = `You are AirSense IQ, an AI health advisory system for Indian cities. ${langInstructions[lang] || langInstructions.english}
Generate a clear, actionable health advisory for citizens. Keep it to 3-4 sentences. No markdown formatting.`;

  const user = `City: ${city.name} | Current AQI: ${city.aqi} (${cat.label}) | PM2.5: ${city.pm25}µg/m³ | PM10: ${city.pm10}µg/m³ | NO2: ${city.no2}µg/m³
Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
Generate a health advisory appropriate for this pollution level, mentioning specific risks and protective measures.`;

  return askGroq(system, user, 250);
}

export async function generateEnforcementMemo(hotspot: any): Promise<string> {
  const city = CITIES.find(c => c.id === hotspot.city);
  const system = `You are an AI environmental enforcement advisor for Indian Pollution Control Boards. 
Write concise, legally sound enforcement recommendations. Use formal administrative language. No markdown — plain paragraphs only.`;

  const user = `Pollution Hotspot Report:
- Location: ${hotspot.name}, ${hotspot.city.charAt(0).toUpperCase() + hotspot.city.slice(1)}
- Source Type: ${hotspot.sourceType}
- Current AQI: ${hotspot.aqi}
- Priority: ${hotspot.priority}
- Violations recorded: ${hotspot.violations}
- Registered Source: ${hotspot.registered ? 'Yes' : 'No — UNREGISTERED'}
- Last Inspected: ${hotspot.lastInspected}
- Current City AQI: ${city ? city.aqi : 'N/A'}

Write a 3-sentence enforcement memo: (1) Immediate action required, (2) Legal basis and regulatory section to invoke, (3) Follow-up timeline and escalation path.`;

  return askGroq(system, user, 280);
}

// ─── Chat ─────────────────────────────────────────────────────────────────────
export function getChatSystemPrompt(): string {
  const cityLines = CITIES.map(c => {
    const cat = getAQICat(c.aqi);
    return `${c.name}: AQI ${c.aqi} (${cat.label}), PM2.5=${c.pm25}µg/m³`;
  }).join(', ');

  return `You are AirSense IQ Assistant, an expert AI on Indian urban air quality. 
Current live data (${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST): ${cityLines}
Answer questions about air quality, AQI, health impacts, pollutant sources, and smart city interventions. 
Be concise (max 3 sentences), factual, and helpful. You have access to CPCB/CAAQMS data for 7 major cities.`;
}

export async function sendChatMessage(userMessage: string, history: any[]): Promise<{ response: string; newHistory: any[] }> {
  const systemPrompt = getChatSystemPrompt();
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-8),
    { role: 'user', content: userMessage }
  ];

  const response = await askGroqChat(messages, 350);
  const newHistory = [
    ...history,
    { role: 'user', content: userMessage },
    { role: 'assistant', content: response }
  ];
  return { response, newHistory };
}

// ─── UI helpers ───────────────────────────────────────────────────────────────
export const AI_MODEL = AI_CONFIG.MODEL;

export function buildThinkingUI(message: string, compact = false): string {
  return `
    <div class="ai-thinking ${compact ? 'compact' : ''}">
      <span class="ai-thinking-dots">
        <span></span><span></span><span></span>
      </span>
      <span class="ai-thinking-text">${message}</span>
    </div>
  `;
}

export function buildNoKeyPrompt(context: string): string {
  return `
    <div class="ai-no-key-prompt">
      <div style="font-size:32px;margin-bottom:8px;">🤖</div>
      <div class="ai-no-key-title">AI Intelligence Available</div>
      <div class="ai-no-key-desc">Connect your Groq API key to unlock AI-powered national analysis, smart advisories, and enforcement memos.</div>
      <button class="ai-connect-btn" onclick="window.__showKeyModal('${context}')">🔑 Connect Groq AI</button>
      <div style="font-size:10px;color:var(--text-muted);margin-top:8px;">Free at console.groq.com</div>
    </div>
  `;
}

export function buildErrorUI(message: string, retryFn: string): string {
  const isNoKey = message === 'NO_KEY';
  return `
    <div class="ai-error-state">
      <div style="font-size:20px;margin-bottom:6px;">${isNoKey ? '🔑' : '⚠️'}</div>
      <div style="font-size:12px;color:var(--text-secondary);margin-bottom:8px;">
        ${isNoKey ? 'Groq API key required.' : `AI error: ${message}`}
      </div>
      ${isNoKey
        ? `<button class="ai-connect-btn" onclick="window.__showKeyModal('dashboard')" style="font-size:11px;padding:6px 14px;">Connect API Key</button>`
        : `<button class="ai-refresh-btn" onclick="${retryFn}">↻ Retry</button>`
      }
    </div>
  `;
}

// Static advisory fallback
export function getStaticAdvisory(cityId: string, lang: string): { level: string; message: string } {
  const city = CITIES.find(c => c.id === cityId) || CITIES[0];
  const level = getAdvisoryLevel(city.aqi);
  const msgs = ADVISORIES[lang] || ADVISORIES.english;
  const message = msgs[level] || msgs.moderate;
  return { level, message };
}
