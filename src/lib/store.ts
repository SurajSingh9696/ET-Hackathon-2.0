/**
 * store.ts — Mutable shared state (replaces global variables from vanilla JS)
 * This module-level object is shared across all lib files.
 */

import { INITIAL_CITIES, STATIONS, generateHistoricalData, generateForecastData } from './data';

// Mutable city data (updated by realtime.ts)
export const CITIES: any[] = INITIAL_CITIES.map(c => ({ ...c }));

// Historical and forecast data caches
export const HISTORICAL_DATA: Record<string, any[]> = {};
export const FORECAST_DATA: Record<string, any[]> = {};

// Initialize with seeded data
CITIES.forEach(city => {
  HISTORICAL_DATA[city.id] = generateHistoricalData(city.aqi, city.id);
  FORECAST_DATA[city.id] = generateForecastData(city.aqi, city.id);
});

// Groq API key state
export let groqApiKey: string | null = null;
export function setGroqApiKey(key: string | null) { groqApiKey = key; }

// Re-export STATIONS for convenience
export { STATIONS };
