/**
 * chartUtils.ts — Chart.js chart management (converted from charts.js)
 * Uses window.Chart (loaded via CDN in layout.tsx)
 */

import { CITIES, HISTORICAL_DATA, FORECAST_DATA } from './store';
import { SOURCE_ATTRIBUTION, CITY_COLORS_CHART } from './data';

declare const Chart: any;

// ─── Global Chart defaults (set once when module loads) ───────────────────────
function setChartDefaults() {
  if (typeof Chart === 'undefined') return;
  Chart.defaults.font.family = 'Inter';
  Chart.defaults.color = '#8a94a8';
}

const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1a2035',
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      titleColor: '#e8edf5',
      bodyColor: '#8a94a8',
      cornerRadius: 10,
      padding: 12,
      displayColors: true,
      boxWidth: 10, boxHeight: 10,
      usePointStyle: true
    }
  },
  scales: {
    x: {
      grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
      ticks: { color: '#4a5568', font: { size: 10, family: 'Inter' } }
    },
    y: {
      grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
      ticks: { color: '#4a5568', font: { size: 10, family: 'Inter' } },
      border: { display: false }
    }
  }
};

// ─── Chart instances ──────────────────────────────────────────────────────────
let pollutantChartInstance: any = null;
let forecastChartInstance: any = null;
let pm25ForecastChartInstance: any = null;
let sourcePieChartInstance: any = null;
let comparisonChartInstance: any = null;
let radarChartInstance: any = null;
let healthForecastChartInstance: any = null;

// ─── Chart functions ──────────────────────────────────────────────────────────
export function initPollutantChart(cityId: string) {
  setChartDefaults();
  const city = CITIES.find(c => c.id === cityId) || CITIES[0];
  const ctx = document.getElementById('pollutantChart') as HTMLCanvasElement;
  if (!ctx) return;
  if (pollutantChartInstance) pollutantChartInstance.destroy();

  const maxVals = { pm25: 250, pm10: 400, no2: 150, so2: 80, o3: 100, co: 20 };
  const values = [city.pm25, city.pm10, city.no2, city.so2, city.o3, city.co];
  const labels = ['PM2.5', 'PM10', 'NO₂', 'SO₂', 'O₃', 'CO'];
  const maxes = [maxVals.pm25, maxVals.pm10, maxVals.no2, maxVals.so2, maxVals.o3, maxVals.co];
  const normalized = values.map((v, i) => Math.min((v / maxes[i]) * 100, 100));
  const colors = normalized.map(v => {
    if (v > 80) return '#9333ea';
    if (v > 60) return '#ef4444';
    if (v > 40) return '#f97316';
    if (v > 20) return '#eab308';
    return '#22c55e';
  });

  pollutantChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data: normalized,
        backgroundColor: colors.map(c => c + '33'),
        borderColor: colors,
        borderWidth: 2,
        borderRadius: 6,
        borderSkipped: false
      }]
    },
    options: {
      ...CHART_DEFAULTS,
      plugins: {
        ...CHART_DEFAULTS.plugins,
        tooltip: {
          ...CHART_DEFAULTS.plugins.tooltip,
          callbacks: {
            label: (ctx: any) => {
              const units = [' µg/m³', ' µg/m³', ' µg/m³', ' µg/m³', ' µg/m³', ' mg/m³'];
              return `  ${values[ctx.dataIndex]}${units[ctx.dataIndex]}`;
            }
          }
        }
      },
      scales: {
        x: { ...CHART_DEFAULTS.scales.x },
        y: {
          ...CHART_DEFAULTS.scales.y,
          max: 100,
          ticks: { ...CHART_DEFAULTS.scales.y.ticks, callback: (v: any) => v + '%' }
        }
      }
    }
  });
}

export function initForecastChart(cityId: string, hours: number) {
  const data = FORECAST_DATA[cityId] || FORECAST_DATA['delhi'];
  const sliceCount = Math.ceil(hours / 3) + 1;
  const sliced = data.slice(0, sliceCount);
  const ctx = document.getElementById('forecastChart') as HTMLCanvasElement;
  if (!ctx) return;
  if (forecastChartInstance) forecastChartInstance.destroy();

  const gradient = ctx.getContext('2d')!.createLinearGradient(0, 0, 0, 200);
  gradient.addColorStop(0, 'rgba(0,212,184,0.25)');
  gradient.addColorStop(1, 'rgba(0,212,184,0)');

  forecastChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: sliced.map((d: any) => d.label),
      datasets: [
        {
          label: 'Forecast AQI',
          data: sliced.map((d: any) => d.aqi),
          borderColor: '#00d4b8',
          backgroundColor: gradient,
          borderWidth: 2.5,
          fill: true, tension: 0.4,
          pointRadius: (ctx: any) => ctx.dataIndex % 4 === 0 ? 4 : 0,
          pointBackgroundColor: '#00d4b8',
          pointBorderColor: '#080c1a', pointBorderWidth: 2
        },
        {
          label: 'Poor Threshold',
          data: sliced.map(() => 201),
          borderColor: 'rgba(239,68,68,0.4)',
          borderWidth: 1.5, borderDash: [6, 4],
          fill: false, pointRadius: 0, tension: 0
        }
      ]
    },
    options: {
      ...CHART_DEFAULTS,
      plugins: {
        ...CHART_DEFAULTS.plugins,
        tooltip: {
          ...CHART_DEFAULTS.plugins.tooltip,
          callbacks: { label: (ctx: any) => `  AQI: ${ctx.raw}` }
        }
      },
      scales: {
        x: { ...CHART_DEFAULTS.scales.x, ticks: { ...CHART_DEFAULTS.scales.x.ticks, maxTicksLimit: 12 } },
        y: { ...CHART_DEFAULTS.scales.y, min: 0, max: 420 }
      }
    }
  });
}

export function initPM25ForecastChart(cityId: string, hours: number) {
  const data = FORECAST_DATA[cityId] || FORECAST_DATA['delhi'];
  const sliceCount = Math.ceil(hours / 3) + 1;
  const sliced = data.slice(0, sliceCount);
  const ctx = document.getElementById('pm25ForecastChart') as HTMLCanvasElement;
  if (!ctx) return;
  if (pm25ForecastChartInstance) pm25ForecastChartInstance.destroy();

  const gradient = ctx.getContext('2d')!.createLinearGradient(0, 0, 0, 120);
  gradient.addColorStop(0, 'rgba(99,102,241,0.2)');
  gradient.addColorStop(1, 'rgba(99,102,241,0)');

  pm25ForecastChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: sliced.map((d: any) => d.label),
      datasets: [{
        label: 'PM2.5 µg/m³',
        data: sliced.map((d: any) => d.pm25),
        borderColor: '#6366f1', backgroundColor: gradient,
        borderWidth: 2, fill: true, tension: 0.4, pointRadius: 0
      }]
    },
    options: {
      ...CHART_DEFAULTS,
      scales: {
        x: { ...CHART_DEFAULTS.scales.x, ticks: { ...CHART_DEFAULTS.scales.x.ticks, maxTicksLimit: 10 } },
        y: { ...CHART_DEFAULTS.scales.y, min: 0 }
      }
    }
  });
}

export function initSourcePieChart(cityId: string) {
  const attr = SOURCE_ATTRIBUTION[cityId] || SOURCE_ATTRIBUTION.delhi;
  const ctx = document.getElementById('sourcePieChart') as HTMLCanvasElement;
  if (!ctx) return;
  if (sourcePieChartInstance) sourcePieChartInstance.destroy();

  sourcePieChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: attr.sources.map((s: any) => s.name),
      datasets: [{
        data: attr.sources.map((s: any) => s.value),
        backgroundColor: attr.sources.map((s: any) => s.color + '99'),
        borderColor: attr.sources.map((s: any) => s.color),
        borderWidth: 2, hoverOffset: 8
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: true, cutout: '62%',
      plugins: {
        legend: { display: false },
        tooltip: {
          ...CHART_DEFAULTS.plugins.tooltip,
          callbacks: { label: (ctx: any) => `  ${ctx.label}: ${ctx.raw}%` }
        }
      }
    }
  });

  const legendEl = document.getElementById('source-legend');
  if (legendEl) {
    legendEl.innerHTML = attr.sources.map((s: any) =>
      `<div style="display:flex;align-items:center;gap:8px;font-size:12px;">
        <span style="width:10px;height:10px;border-radius:3px;background:${s.color};flex-shrink:0;"></span>
        <span style="flex:1;color:var(--text-secondary);">${s.name}</span>
        <span style="font-weight:700;color:var(--text-primary);">${s.value}%</span>
      </div>`
    ).join('');
  }
}

export function initComparisonChart(selectedCities: string[], metric: string) {
  const ctx = document.getElementById('comparisonChart') as HTMLCanvasElement;
  if (!ctx) return;
  if (comparisonChartInstance) comparisonChartInstance.destroy();

  const allDates = (HISTORICAL_DATA['delhi'] || []).map((d: any) => d.label);
  const datasets = selectedCities.map((cityId, i) => {
    const city = CITIES.find(c => c.id === cityId);
    const hist = HISTORICAL_DATA[cityId] || [];
    const color = CITY_COLORS_CHART[i % CITY_COLORS_CHART.length];
    return {
      label: city ? city.name : cityId,
      data: hist.map((d: any) => metric === 'aqi' ? d.aqi : metric === 'pm25' ? d.pm25 : d.pm10),
      borderColor: color,
      backgroundColor: color + '15',
      borderWidth: 2, tension: 0.3, pointRadius: 0, fill: false
    };
  });

  comparisonChartInstance = new Chart(ctx, {
    type: 'line',
    data: { labels: allDates, datasets },
    options: {
      ...CHART_DEFAULTS,
      plugins: {
        ...CHART_DEFAULTS.plugins,
        legend: {
          display: true, position: 'top',
          labels: {
            color: '#8a94a8',
            font: { size: 11, family: 'Inter' },
            boxWidth: 24, boxHeight: 2,
            usePointStyle: false, padding: 16
          }
        }
      },
      scales: {
        x: { ...CHART_DEFAULTS.scales.x, ticks: { ...CHART_DEFAULTS.scales.x.ticks, maxTicksLimit: 10 } },
        y: { ...CHART_DEFAULTS.scales.y, min: 0 }
      }
    }
  });
}

export function initRadarChart(cityId: string) {
  const city = CITIES.find(c => c.id === cityId) || CITIES[0];
  const ctx = document.getElementById('radarChart') as HTMLCanvasElement;
  if (!ctx) return;
  if (radarChartInstance) radarChartInstance.destroy();

  const maxes = { pm25: 250, pm10: 400, no2: 150, so2: 80, o3: 100, co: 20 };
  const normalized = [
    Math.min((city.pm25 / maxes.pm25) * 100, 100),
    Math.min((city.pm10 / maxes.pm10) * 100, 100),
    Math.min((city.no2  / maxes.no2)  * 100, 100),
    Math.min((city.so2  / maxes.so2)  * 100, 100),
    Math.min((city.o3   / maxes.o3)   * 100, 100),
    Math.min((city.co   / maxes.co)   * 100, 100)
  ];

  radarChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['PM2.5', 'PM10', 'NO₂', 'SO₂', 'O₃', 'CO'],
      datasets: [{
        label: city.name, data: normalized,
        borderColor: '#00d4b8',
        backgroundColor: 'rgba(0,212,184,0.12)',
        borderWidth: 2,
        pointBackgroundColor: '#00d4b8',
        pointBorderColor: '#080c1a', pointRadius: 4
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          ...CHART_DEFAULTS.plugins.tooltip,
          callbacks: { label: (ctx: any) => `  ${ctx.raw.toFixed(1)}% of max` }
        }
      },
      scales: {
        r: {
          min: 0, max: 100,
          grid: { color: 'rgba(255,255,255,0.06)' },
          angleLines: { color: 'rgba(255,255,255,0.06)' },
          ticks: { color: '#4a5568', font: { size: 9 }, stepSize: 25, showLabelBackdrop: false },
          pointLabels: { color: '#8a94a8', font: { size: 11, family: 'Inter' } }
        }
      }
    }
  });
}

export function initHealthForecastChart(cityId: string) {
  const data = FORECAST_DATA[cityId] || FORECAST_DATA['delhi'];
  const ctx = document.getElementById('healthForecastChart') as HTMLCanvasElement;
  if (!ctx) return;
  if (healthForecastChartInstance) healthForecastChartInstance.destroy();

  const sliced = data.slice(0, 9);
  const hospitalRisk = sliced.map((d: any) => Math.min(((d.aqi - 100) / 300) * 90 + 10, 95));
  const generalRisk  = sliced.map((d: any) => Math.min(((d.aqi - 150) / 300) * 70 + 5, 80));

  const g1 = ctx.getContext('2d')!.createLinearGradient(0, 0, 0, 180);
  g1.addColorStop(0, 'rgba(239,68,68,0.3)');
  g1.addColorStop(1, 'rgba(239,68,68,0)');

  const g2 = ctx.getContext('2d')!.createLinearGradient(0, 0, 0, 180);
  g2.addColorStop(0, 'rgba(245,158,11,0.2)');
  g2.addColorStop(1, 'rgba(245,158,11,0)');

  healthForecastChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: sliced.map((d: any) => d.label),
      datasets: [
        {
          label: 'High-Risk (Hospitals/Elderly)',
          data: hospitalRisk.map((v: number) => Math.round(v)),
          borderColor: '#ef4444', backgroundColor: g1,
          borderWidth: 2, fill: true, tension: 0.4,
          pointRadius: 3, pointBackgroundColor: '#ef4444'
        },
        {
          label: 'General Population',
          data: generalRisk.map((v: number) => Math.max(0, Math.round(v))),
          borderColor: '#f59e0b', backgroundColor: g2,
          borderWidth: 2, fill: true, tension: 0.4,
          pointRadius: 3, pointBackgroundColor: '#f59e0b'
        }
      ]
    },
    options: {
      ...CHART_DEFAULTS,
      plugins: {
        ...CHART_DEFAULTS.plugins,
        legend: {
          display: true, position: 'top',
          labels: { color: '#8a94a8', font: { size: 10, family: 'Inter' }, boxWidth: 16, boxHeight: 2, padding: 12 }
        },
        tooltip: {
          ...CHART_DEFAULTS.plugins.tooltip,
          callbacks: { label: (ctx: any) => `  ${ctx.dataset.label}: ${ctx.raw}% risk` }
        }
      },
      scales: {
        x: { ...CHART_DEFAULTS.scales.x },
        y: {
          ...CHART_DEFAULTS.scales.y,
          min: 0, max: 100,
          ticks: { ...CHART_DEFAULTS.scales.y.ticks, callback: (v: any) => v + '%' }
        }
      }
    }
  });
}
