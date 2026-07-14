/**
 * realtime.ts — Live data fetching from Open-Meteo Air Quality + Weather APIs
 * Converted from realtime.js
 */

import { CITIES, HISTORICAL_DATA, FORECAST_DATA } from './store';
import { seededRandom } from './data';

export const REALTIME_CONFIG = {
  REFRESH_INTERVAL_MS: 5 * 60 * 1000,
  AQ_BASE_URL: 'https://air-quality-api.open-meteo.com/v1/air-quality',
  WEATHER_BASE_URL: 'https://api.open-meteo.com/v1/forecast',
};

export const CITY_COORDS: Record<string, { lat: number; lon: number }> = {
  delhi:     { lat: 28.6139, lon: 77.2090 },
  mumbai:    { lat: 19.0760, lon: 72.8777 },
  kolkata:   { lat: 22.5726, lon: 88.3639 },
  bengaluru: { lat: 12.9716, lon: 77.5946 },
  chennai:   { lat: 13.0827, lon: 80.2707 },
  hyderabad: { lat: 17.3850, lon: 78.4867 },
  pune:      { lat: 18.5204, lon: 73.8567 }
};

// ─── AQI Computation (CPCB Standard) ─────────────────────────────────────────
export function computeAQI(pm25: number | null, pm10: number | null, no2: number | null, so2: number | null, o3: number | null, co: number | null): number {
  function linearInterp(Cp: number, BPLo: number, BPHi: number, ILo: number, IHi: number) {
    return Math.round(((IHi - ILo) / (BPHi - BPLo)) * (Cp - BPLo) + ILo);
  }
  function pm25AQI(c: number) {
    const bp = [[0,30,0,50],[30,60,51,100],[60,90,101,200],[90,120,201,300],[120,250,301,400],[250,500,401,500]];
    for (const [lo,hi,ilo,ihi] of bp) if (c<=hi) return linearInterp(c,lo,hi,ilo,ihi);
    return 500;
  }
  function pm10AQI(c: number) {
    const bp = [[0,50,0,50],[50,100,51,100],[100,250,101,200],[250,350,201,300],[350,430,301,400],[430,600,401,500]];
    for (const [lo,hi,ilo,ihi] of bp) if (c<=hi) return linearInterp(c,lo,hi,ilo,ihi);
    return 500;
  }
  function no2AQI(c: number) {
    const bp = [[0,40,0,50],[40,80,51,100],[80,180,101,200],[180,280,201,300],[280,400,301,400],[400,800,401,500]];
    for (const [lo,hi,ilo,ihi] of bp) if (c<=hi) return linearInterp(c,lo,hi,ilo,ihi);
    return 500;
  }
  function so2AQI(c: number) {
    const bp = [[0,40,0,50],[40,80,51,100],[80,380,101,200],[380,800,201,300],[800,1600,301,400],[1600,2620,401,500]];
    for (const [lo,hi,ilo,ihi] of bp) if (c<=hi) return linearInterp(c,lo,hi,ilo,ihi);
    return 500;
  }
  function coAQI(c: number) {
    const ppm = c / 1.145;
    const bp = [[0,1,0,50],[1,2,51,100],[2,10,101,200],[10,17,201,300],[17,34,301,400],[34,46,401,500]];
    for (const [lo,hi,ilo,ihi] of bp) if (ppm<=hi) return linearInterp(ppm,lo,hi,ilo,ihi);
    return 500;
  }
  function o3AQI(c: number) {
    const bp = [[0,50,0,50],[50,100,51,100],[100,168,101,200],[168,208,201,300],[208,748,301,400],[748,1000,401,500]];
    for (const [lo,hi,ilo,ihi] of bp) if (c<=hi) return linearInterp(c,lo,hi,ilo,ihi);
    return 500;
  }
  const indices: number[] = [];
  if (pm25 !== null && pm25 >= 0) indices.push(pm25AQI(pm25));
  if (pm10 !== null && pm10 >= 0) indices.push(pm10AQI(pm10));
  if (no2  !== null && no2  >= 0) indices.push(no2AQI(no2));
  if (so2  !== null && so2  >= 0) indices.push(so2AQI(so2));
  if (o3   !== null && o3   >= 0) indices.push(o3AQI(o3));
  if (co   !== null && co   >= 0) indices.push(coAQI(co));
  return indices.length > 0 ? Math.max(...indices) : 0;
}

async function fetchCityAirQuality(cityId: string) {
  const { lat, lon } = CITY_COORDS[cityId];
  const params = new URLSearchParams({
    latitude: String(lat), longitude: String(lon),
    hourly: 'pm2_5,pm10,nitrogen_dioxide,sulphur_dioxide,ozone,carbon_monoxide,european_aqi',
    timezone: 'Asia/Kolkata', forecast_days: '4'
  });
  const res = await fetch(`${REALTIME_CONFIG.AQ_BASE_URL}?${params}`);
  if (!res.ok) throw new Error(`AQ fetch failed for ${cityId}: ${res.status}`);
  return res.json();
}

async function fetchCityWeather(cityId: string) {
  const { lat, lon } = CITY_COORDS[cityId];
  const params = new URLSearchParams({
    latitude: String(lat), longitude: String(lon),
    hourly: 'temperature_2m,relativehumidity_2m,windspeed_10m,visibility',
    timezone: 'Asia/Kolkata', forecast_days: '4'
  });
  const res = await fetch(`${REALTIME_CONFIG.WEATHER_BASE_URL}?${params}`);
  if (!res.ok) throw new Error(`Weather fetch failed for ${cityId}: ${res.status}`);
  return res.json();
}

function getCurrentHourIndex(times: string[]) {
  const now = new Date();
  const nowISO = now.toISOString().slice(0, 13);
  let best = 0;
  for (let i = 0; i < times.length; i++) {
    if (times[i].startsWith(nowISO)) { best = i; break; }
    if (times[i] < nowISO.replace('T', ' ') + ':00') best = i;
  }
  return best;
}

function rebuildForecastData(cityId: string, aqData: any, weatherData: any, startAqIdx: number, startWIdx: number) {
  const forecast: any[] = [];
  for (let h = 0; h <= 72; h += 3) {
    const aqIdx = Math.min(startAqIdx + h, aqData.hourly.pm2_5.length - 1);
    const wIdx  = Math.min(startWIdx + h, weatherData.hourly.temperature_2m.length - 1);
    const pm25 = aqData.hourly.pm2_5[aqIdx] ?? null;
    const pm10 = aqData.hourly.pm10[aqIdx] ?? null;
    const no2  = aqData.hourly.nitrogen_dioxide[aqIdx] ?? null;
    const so2  = aqData.hourly.sulphur_dioxide[aqIdx] ?? null;
    const o3   = aqData.hourly.ozone[aqIdx] ?? null;
    const co   = aqData.hourly.carbon_monoxide[aqIdx] ?? null;
    const euAqi = aqData.hourly.european_aqi[aqIdx] ?? null;
    let aqi = computeAQI(pm25, pm10, no2, so2, o3, co);
    if (aqi === 0 && euAqi !== null) aqi = Math.min(500, Math.round(euAqi * 1.1));
    const temp     = weatherData.hourly.temperature_2m[wIdx] ?? 28;
    const humidity = weatherData.hourly.relativehumidity_2m[wIdx] ?? 60;
    const wind     = weatherData.hourly.windspeed_10m[wIdx] ?? 8;
    const vis      = weatherData.hourly.visibility[wIdx] ?? 8000;
    const label = h === 0 ? 'Now' : (h % 24 === 0 ? `Day ${h / 24}` : `+${h}h`);
    forecast.push({
      hour: h, label,
      aqi: aqi > 0 ? aqi : null,
      pm25: pm25 !== null ? Math.round(pm25 * 10) / 10 : null,
      temperature: Math.round(temp), humidity: Math.round(humidity),
      windSpeed: Math.round(wind * 10) / 10,
      visibility: Math.round(vis / 1000 * 10) / 10
    });
  }
  FORECAST_DATA[cityId] = forecast;
}

function rebuildHistoricalData(cityId: string, aqData: any, nowIdx: number) {
  const times    = aqData.hourly.time;
  const pm25Arr  = aqData.hourly.pm2_5;
  const pm10Arr  = aqData.hourly.pm10;
  const euAqiArr = aqData.hourly.european_aqi;
  const history: any[] = [];
  const city = CITIES.find(c => c.id === cityId);
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const label = date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    const targetTimePrefix = dateStr + 'T' + new Date().toISOString().slice(11, 13);
    const realIdx = times.findIndex((t: string) => t.startsWith(targetTimePrefix));
    let aqi: number;
    if (realIdx >= 0 && realIdx <= nowIdx) {
      const pm25 = pm25Arr[realIdx] ?? null;
      const pm10 = pm10Arr[realIdx] ?? null;
      const euAqi = euAqiArr[realIdx] ?? null;
      aqi = computeAQI(pm25, pm10, null, null, null, null);
      if (aqi === 0 && euAqi !== null) aqi = Math.min(500, Math.round(euAqi * 1.1));
      if (aqi === 0) aqi = city ? city.aqi : 150;
    } else {
      const rand = seededRandom((city ? city.aqi : 150) * 17 + cityId.charCodeAt(0) + i);
      const base = city ? city.aqi : 150;
      aqi = Math.max(25, Math.min(420, Math.round(base + (rand() - 0.46) * 40)));
    }
    history.push({
      date: dateStr, label, aqi,
      pm25: Math.round(aqi * 0.69 * 10) / 10,
      pm10: Math.round(aqi * 1.07 * 10) / 10
    });
  }
  HISTORICAL_DATA[cityId] = history;
}

function applyCityData(cityId: string, aqData: any, weatherData: any) {
  const city = CITIES.find(c => c.id === cityId);
  if (!city) return;
  const aqTimes = aqData.hourly.time;
  const weatherTimes = weatherData.hourly.time;
  const nowIdx = getCurrentHourIndex(aqTimes);
  const wNowIdx = getCurrentHourIndex(weatherTimes);
  const pm25 = aqData.hourly.pm2_5[nowIdx] ?? null;
  const pm10 = aqData.hourly.pm10[nowIdx] ?? null;
  const no2  = aqData.hourly.nitrogen_dioxide[nowIdx] ?? null;
  const so2  = aqData.hourly.sulphur_dioxide[nowIdx] ?? null;
  const o3   = aqData.hourly.ozone[nowIdx] ?? null;
  const co   = aqData.hourly.carbon_monoxide[nowIdx] ?? null;
  const euAqi = aqData.hourly.european_aqi[nowIdx] ?? null;
  const computedAqi = computeAQI(pm25, pm10, no2, so2, o3, co);
  const prevAqi = city.aqi;
  if (pm25 !== null) city.pm25 = Math.round(pm25 * 10) / 10;
  if (pm10 !== null) city.pm10 = Math.round(pm10 * 10) / 10;
  if (no2  !== null) city.no2  = Math.round(no2  * 10) / 10;
  if (so2  !== null) city.so2  = Math.round(so2  * 10) / 10;
  if (o3   !== null) city.o3   = Math.round(o3   * 10) / 10;
  if (co   !== null) city.co   = Math.round(co   * 10) / 10;
  if (computedAqi > 0) {
    city.aqi = computedAqi;
  } else if (euAqi !== null) {
    city.aqi = Math.min(500, Math.round(euAqi * 1.1));
  }
  city.trend = city.aqi - prevAqi;
  city.dataSource = 'live';
  city.lastFetched = new Date().toISOString();
  const temp     = weatherData.hourly.temperature_2m[wNowIdx] ?? null;
  const humidity = weatherData.hourly.relativehumidity_2m[wNowIdx] ?? null;
  const wind     = weatherData.hourly.windspeed_10m[wNowIdx] ?? null;
  const vis      = weatherData.hourly.visibility[wNowIdx] ?? null;
  if (temp !== null)     city.temperature = Math.round(temp);
  if (humidity !== null) city.humidity    = Math.round(humidity);
  if (wind !== null)     city.windSpeed   = Math.round(wind * 10) / 10;
  if (vis !== null)      city.visibility  = Math.round(vis / 1000 * 10) / 10;
  rebuildForecastData(cityId, aqData, weatherData, nowIdx, wNowIdx);
  rebuildHistoricalData(cityId, aqData, nowIdx);
}

export async function fetchAllCitiesRealtime(): Promise<number> {
  const cityIds = Object.keys(CITY_COORDS);
  const results = await Promise.allSettled(
    cityIds.map(async (cityId) => {
      const [aqData, weatherData] = await Promise.all([
        fetchCityAirQuality(cityId),
        fetchCityWeather(cityId)
      ]);
      applyCityData(cityId, aqData, weatherData);
      return cityId;
    })
  );
  let successCount = 0;
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') successCount++;
    else console.warn(`[AirSense] Failed to fetch data for ${cityIds[i]}:`, (r as any).reason);
  });
  console.log(`[AirSense] Real-time data loaded for ${successCount}/${cityIds.length} cities`);
  return successCount;
}
