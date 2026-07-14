/**
 * mapUtils.ts — Leaflet map management (converted from map.js)
 * Uses window.L (loaded via CDN in layout.tsx)
 */

import { CITIES, STATIONS } from './store';
import { ENFORCEMENT_HOTSPOTS } from './data';
import { generateHeatmapPoints, getAQICat } from './data';

declare const L: any;

// ─── Map instances (module-level refs) ────────────────────────────────────────
let dashboardMap: any = null;
let attributionMap: any = null;
let enforcementMap: any = null;
let attributionHeatLayer: any = null;
let dashboardMarkers: any[] = [];
let stationMarkers: any[] = [];
let enforcementMarkers: any[] = [];

function getAQIColor(aqi: number): string {
  if (aqi <= 50)  return '#22c55e';
  if (aqi <= 100) return '#84cc16';
  if (aqi <= 200) return '#eab308';
  if (aqi <= 300) return '#f97316';
  if (aqi <= 400) return '#ef4444';
  return '#9333ea';
}

function createCityMarkerIcon(aqi: number, size = 40) {
  const color = getAQIColor(aqi);
  const pulse = aqi > 300;
  return L.divIcon({
    className: '',
    html: `<div style="
      width:${size}px;height:${size}px;
      background:${color}22;
      border:2px solid ${color};
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-size:${Math.round(size * 0.32)}px;font-weight:800;
      color:${color};
      font-family:Inter,sans-serif;
      box-shadow:0 0 ${pulse ? 16 : 8}px ${color}66;
    ">${aqi}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
}

function createStationMarkerIcon(aqi: number) {
  const color = getAQIColor(aqi);
  return L.divIcon({
    className: '',
    html: `<div style="
      width:12px;height:12px;
      background:${color};
      border:2px solid #080c1a;
      border-radius:50%;
      box-shadow:0 0 6px ${color}88;
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
}

function createEnforcementMarkerIcon(priority: string) {
  const colors: Record<string, string> = { Critical: '#ef4444', High: '#f97316', Medium: '#eab308' };
  const color = colors[priority] || '#eab308';
  return L.divIcon({
    className: '',
    html: `<div style="
      width:20px;height:20px;
      background:${color}33;
      border:2.5px solid ${color};
      border-radius:4px;
      display:flex;align-items:center;justify-content:center;
      box-shadow:0 0 10px ${color}66;
      font-size:10px;
    ">⚡</div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
}

function buildCityPopup(city: any): string {
  const cat = getAQICat(city.aqi);
  return `<div class="popup-aqi-header">
    <div class="aqi-gauge-ring" style="color:${cat.color};border-color:${cat.color};">${city.aqi}</div>
    <div>
      <div class="popup-city-name">${city.name}</div>
      <div style="font-size:12px;color:${cat.color};font-weight:600;">${cat.label}</div>
      <div style="font-size:11px;color:#8a94a8;">${city.state}</div>
    </div>
  </div>
  <div class="popup-grid">
    <div class="popup-metric">
      <div class="popup-metric-label">PM2.5</div>
      <div class="popup-metric-value" style="color:#f97316;">${city.pm25} µg/m³</div>
    </div>
    <div class="popup-metric">
      <div class="popup-metric-label">PM10</div>
      <div class="popup-metric-value" style="color:#eab308;">${city.pm10} µg/m³</div>
    </div>
    <div class="popup-metric">
      <div class="popup-metric-label">NO₂</div>
      <div class="popup-metric-value" style="color:#6366f1;">${city.no2} µg/m³</div>
    </div>
    <div class="popup-metric">
      <div class="popup-metric-label">Stations</div>
      <div class="popup-metric-value" style="color:#00d4b8;">${city.activeStations}/${city.stations}</div>
    </div>
    <div class="popup-metric">
      <div class="popup-metric-label">24h Trend</div>
      <div class="popup-metric-value" style="color:${city.trend > 0 ? '#ef4444' : '#22c55e'};">${city.trend > 0 ? '▲' : '▼'} ${Math.abs(city.trend)}</div>
    </div>
    <div class="popup-metric">
      <div class="popup-metric-label">Population</div>
      <div class="popup-metric-value" style="color:#8a94a8;">${(city.population / 1e6).toFixed(1)}M</div>
    </div>
  </div>`;
}

function buildStationPopup(station: any): string {
  const cat = getAQICat(station.aqi);
  return `<div style="min-width:180px;">
    <div style="font-size:14px;font-weight:700;margin-bottom:6px;color:#e8edf5;">${station.name}</div>
    <div style="font-size:13px;font-weight:800;color:${cat.color};margin-bottom:8px;">AQI ${station.aqi} — ${cat.label}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:11px;">
      <div style="color:#8a94a8;">PM2.5: <span style="color:#f97316;font-weight:700;">${station.pm25}</span></div>
      <div style="color:#8a94a8;">PM10: <span style="color:#eab308;font-weight:700;">${station.pm10}</span></div>
    </div>
  </div>`;
}

function buildEnforcementPopup(hotspot: any): string {
  const cat = getAQICat(hotspot.aqi);
  return `<div style="min-width:200px;">
    <div style="font-size:13px;font-weight:700;margin-bottom:4px;color:#e8edf5;">${hotspot.name}</div>
    <div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap;">
      <span class="priority-badge ${hotspot.priority.toLowerCase()}">${hotspot.priority}</span>
      <span style="font-size:11px;color:${cat.color};font-weight:700;">AQI ${hotspot.aqi}</span>
    </div>
    <div style="font-size:12px;color:#8a94a8;margin-bottom:4px;">Type: ${hotspot.sourceType}</div>
    <div style="font-size:12px;color:#e8edf5;background:rgba(255,255,255,0.05);padding:6px 8px;border-radius:6px;line-height:1.5;">${hotspot.action}</div>
    <div style="font-size:11px;color:#4a5568;margin-top:6px;">Assigned: ${hotspot.assignedTo}</div>
  </div>`;
}

// ─── Public API ───────────────────────────────────────────────────────────────
export function initDashboardMap() {
  const el = document.getElementById('dashboard-map');
  if (!el || dashboardMap) return;

  dashboardMap = L.map('dashboard-map', {
    center: [21.5, 79.0], zoom: 4.5,
    zoomControl: false, attributionControl: false
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19, subdomains: 'abcd'
  }).addTo(dashboardMap);

  L.control.zoom({ position: 'topright' }).addTo(dashboardMap);

  CITIES.forEach(city => {
    const marker = L.marker(city.coords, { icon: createCityMarkerIcon(city.aqi) }).addTo(dashboardMap);
    marker.bindPopup(buildCityPopup(city), { maxWidth: 280, minWidth: 240 });
    dashboardMarkers.push(marker);
  });

  STATIONS.forEach(station => {
    const marker = L.marker(station.coords, { icon: createStationMarkerIcon(station.aqi) }).addTo(dashboardMap);
    marker.bindPopup(buildStationPopup(station), { maxWidth: 220 });
    stationMarkers.push(marker);
  });

  setTimeout(() => dashboardMap.invalidateSize(), 100);
}

export function initAttributionMap() {
  const el = document.getElementById('attribution-map');
  if (!el || attributionMap) return;

  attributionMap = L.map('attribution-map', {
    center: [28.6139, 77.2090], zoom: 11,
    zoomControl: false, attributionControl: false
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19, subdomains: 'abcd'
  }).addTo(attributionMap);

  L.control.zoom({ position: 'topright' }).addTo(attributionMap);

  updateAttributionMap('delhi');
  setTimeout(() => attributionMap.invalidateSize(), 100);
}

export function updateAttributionMap(cityId: string) {
  if (!attributionMap) return;
  const city = CITIES.find(c => c.id === cityId);
  if (!city) return;

  attributionMap.setView(city.coords, 11);

  if (attributionHeatLayer) {
    attributionMap.removeLayer(attributionHeatLayer);
    attributionHeatLayer = null;
  }

  const heatPoints = generateHeatmapPoints(cityId);
  if (typeof L.heatLayer === 'function') {
    attributionHeatLayer = L.heatLayer(heatPoints, {
      radius: 35, blur: 25, maxZoom: 15,
      gradient: { 0.2: '#22c55e', 0.4: '#eab308', 0.6: '#f97316', 0.8: '#ef4444', 1.0: '#9333ea' }
    }).addTo(attributionMap);
  }

  const cityStations = STATIONS.filter(s => s.city === cityId);
  cityStations.forEach(station => {
    L.marker(station.coords, { icon: createStationMarkerIcon(station.aqi) })
      .addTo(attributionMap)
      .bindPopup(buildStationPopup(station), { maxWidth: 220 });
  });
}

export function initEnforcementMap() {
  const el = document.getElementById('enforcement-map');
  if (!el || enforcementMap) return;

  enforcementMap = L.map('enforcement-map', {
    center: [22.0, 78.0], zoom: 5,
    zoomControl: false, attributionControl: false
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19, subdomains: 'abcd'
  }).addTo(enforcementMap);

  L.control.zoom({ position: 'topright' }).addTo(enforcementMap);

  renderEnforcementMarkers(ENFORCEMENT_HOTSPOTS);
  setTimeout(() => enforcementMap.invalidateSize(), 100);
}

export function renderEnforcementMarkers(hotspots: any[]) {
  if (!enforcementMap) return;
  enforcementMarkers.forEach(m => enforcementMap.removeLayer(m));
  enforcementMarkers = [];
  hotspots.forEach(hotspot => {
    const marker = L.marker(hotspot.coords, { icon: createEnforcementMarkerIcon(hotspot.priority) }).addTo(enforcementMap);
    marker.bindPopup(buildEnforcementPopup(hotspot), { maxWidth: 260 });
    enforcementMarkers.push(marker);
  });
}

export function invalidateAllMaps() {
  if (dashboardMap) setTimeout(() => dashboardMap.invalidateSize(), 50);
  if (attributionMap) setTimeout(() => attributionMap.invalidateSize(), 50);
  if (enforcementMap) setTimeout(() => enforcementMap.invalidateSize(), 50);
}

export function refreshDashboardMarkers() {
  if (!dashboardMap) return;
  dashboardMarkers.forEach((marker, i) => {
    const city = CITIES[i];
    if (!city) return;
    marker.setIcon(createCityMarkerIcon(city.aqi));
    marker.setPopupContent(buildCityPopup(city));
  });
}
