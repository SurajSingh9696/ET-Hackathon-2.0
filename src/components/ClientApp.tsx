'use client';

import { useEffect, useRef } from 'react';

/**
 * ClientApp.tsx
 * 
 * The full AirSense IQ single-page application, rendered as a single React
 * client component. All DOM structure is defined here as JSX. All JavaScript
 * logic (maps, charts, real-time data, AI) is initialized in useEffect after
 * hydration, exactly mirroring the vanilla app's DOMContentLoaded flow.
 * 
 * Libraries (Leaflet, Chart.js) are loaded via CDN Script tags in layout.tsx
 * and accessed as window globals here.
 */

export default function ClientApp() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    bootApp();
  }, []);

  return (
    <>
      {/* ─── Loader ─────────────────────────────────────────────────────── */}
      <div id="loader">
        <div className="loader-content">
          <div className="loader-brand">
            <div className="loader-icon-wrap">🌫️</div>
            <div>
              <div className="loader-brand-name">AirSense IQ</div>
              <div className="loader-brand-tagline">Urban Air Quality Intelligence</div>
            </div>
          </div>
          <div className="loader-bar-track">
            <div className="loader-bar-fill"></div>
          </div>
          <div className="loader-status" id="loader-status">
            Connecting to CAAQMS network...
          </div>
        </div>
      </div>

      {/* ─── App Shell ──────────────────────────────────────────────────── */}
      <div id="app">

        {/* ─── Header ─────────────────────────────────────────────────── */}
        <header id="app-header">
          <div className="header-left">
            {/* Hamburger — mobile only */}
            <button
              className="hamburger-btn"
              id="hamburger-btn"
              aria-label="Toggle navigation"
              onClick={() => {
                document.getElementById('sidebar')?.classList.toggle('open');
                document.getElementById('sidebar-overlay')?.classList.toggle('visible');
              }}
            >
              <span></span><span></span><span></span>
            </button>
            <div className="logo">
              <div className="logo-icon">🌫️</div>
              <div>
                <div className="logo-name">AirSense IQ</div>
                <span className="logo-tagline">Smart City Intelligence</span>
              </div>
            </div>
            <div className="header-divider"></div>
            <div className="header-coverage" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Coverage</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600 }}>7 Major Cities · 30 CAAQMS Stations</span>
            </div>
          </div>

          <div className="ticker-wrapper">
            <div className="ticker-label">LIVE AQI</div>
            <div className="ticker-track">
              <div className="ticker-inner" id="ticker-content"></div>
            </div>
          </div>

          <div className="header-right">
            <span className="refresh-countdown" id="refresh-countdown">Next refresh: 5:00</span>
            <button className="manual-refresh-btn" id="manual-refresh-btn" onClick={() => (window as any).__manualRefresh && (window as any).__manualRefresh()}>↻ Refresh Now</button>
            <span className="last-updated" id="last-updated">Loading...</span>
            <div className="live-pill">
              <div className="live-dot"></div>
              LIVE
            </div>
          </div>
        </header>

        {/* ─── Sidebar ────────────────────────────────────────────────── */}
        <aside id="sidebar">
          <div className="sidebar-section-label">Intelligence Modules</div>
          <nav id="main-nav">
            <button className="nav-item active" data-module="dashboard">
              <span className="nav-icon">🗺️</span>
              <span className="nav-label">Live AQI Dashboard</span>
            </button>
            <button className="nav-item" data-module="attribution">
              <span className="nav-icon">📍</span>
              <span className="nav-label">Source Attribution</span>
            </button>
            <button className="nav-item" data-module="forecast">
              <span className="nav-icon">📈</span>
              <span className="nav-label">AQI Forecast</span>
            </button>
            <button className="nav-item" data-module="enforcement">
              <span className="nav-icon">⚡</span>
              <span className="nav-label">Enforcement Intel</span>
              <span className="nav-badge" id="enforcement-badge">12</span>
            </button>
            <button className="nav-item" data-module="comparison">
              <span className="nav-icon">📊</span>
              <span className="nav-label">City Comparison</span>
            </button>
            <button className="nav-item" data-module="advisory">
              <span className="nav-icon">🏥</span>
              <span className="nav-label">Health Advisory</span>
              <span className="nav-badge warning">!</span>
            </button>
          </nav>

          <div className="sidebar-footer">
            <div className="data-source-info">
              <strong>Data Sources</strong>
              CPCB CAAQMS · Open-Meteo API<br />
              Satellite: Sentinel-5P · MODIS<br />
              AI: Groq LLaMA 3.3 70B
            </div>
            <div className="groq-badge" id="groq-badge">
              <span className="groq-badge-dot"></span>
              <span id="groq-badge-label">Groq AI</span>
            </div>
          </div>
        </aside>

        {/* ─── Sidebar Overlay (mobile backdrop) ─────────────────────── */}
        <div
          id="sidebar-overlay"
          className="sidebar-overlay"
          onClick={() => {
            document.getElementById('sidebar')?.classList.remove('open');
            document.getElementById('sidebar-overlay')?.classList.remove('visible');
          }}
        />

        {/* ─── Main Content ────────────────────────────────────────────── */}
        <main id="app-main">

          {/* ══ MODULE 1: Live AQI Dashboard ═══════════════════════════ */}
          <section className="module active" id="mod-dashboard">
            <div className="module-header">
              <div className="module-title-group">
                <div className="module-icon">🗺️</div>
                <div>
                  <h1 className="module-title">Live AQI Intelligence Dashboard</h1>
                  <div className="module-subtitle">Real-time air quality monitoring · CAAQMS + Open-Meteo API</div>
                </div>
              </div>
              <div className="module-controls">
                <span className="data-source-badge">🛰️ Open-Meteo</span>
                <span className="data-source-badge">📡 CAAQMS</span>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="stats-grid">
              <div className="stat-card accent">
                <div className="stat-label">National AQI Avg</div>
                <div className="stat-value" id="stat-nat-aqi">—</div>
                <div id="stat-nat-trend" className="stat-trend-up">Loading...</div>
              </div>
              <div className="stat-card danger">
                <div className="stat-label">Critical Cities</div>
                <div className="stat-value" style={{ color: '#ef4444' }}>2</div>
                <div className="stat-meta">AQI &gt; 300 threshold</div>
              </div>
              <div className="stat-card warning">
                <div className="stat-label">Poor Air Cities</div>
                <div className="stat-value" style={{ color: '#f97316' }}>4</div>
                <div className="stat-meta">AQI 201–300</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Active Stations</div>
                <div className="stat-value">121</div>
                <div className="stat-meta">of 133 total</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Avg PM2.5</div>
                <div className="stat-value" style={{ color: '#f97316' }}>93</div>
                <div className="stat-meta">µg/m³ · WHO limit: 5</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Population at Risk</div>
                <div className="stat-value" style={{ color: '#9333ea' }}>68M</div>
                <div className="stat-meta">AQI &gt; 200 exposure</div>
              </div>
            </div>

            {/* AI Analyst Panel */}
            <div className="glass-card ai-analyst-panel" style={{ marginBottom: '16px', borderRadius: 'var(--radius-lg)' }}>
              <div className="ai-panel-header">
                <span className="ai-panel-logo">🤖</span>
                <div>
                  <div className="ai-panel-title">AI National Analyst</div>
                  <div className="ai-panel-powered">Powered by Groq · LLaMA 3.3 70B</div>
                </div>
                <span className="ai-live-badge">AI LIVE</span>
                <button className="ai-refresh-btn" style={{ marginLeft: '8px' }} id="ai-analyst-refresh" onClick={() => (window as any).__refreshAIAnalyst && (window as any).__refreshAIAnalyst()}>↻ Refresh</button>
              </div>
              <div className="ai-panel-text" id="ai-analyst-text">
                <div id="ai-analyst-content">Loading intelligence analysis...</div>
              </div>
              <div className="ai-panel-footer">
                <span>🕒 Auto-refreshes every 5 minutes</span>
                <span><span className="ai-inline-badge">AI</span> Groq LLaMA 3.3-70B</span>
              </div>
            </div>

            {/* Map + City Panel */}
            <div className="dashboard-layout">
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div className="panel-header">
                  <div>
                    <div className="panel-title">🗺️ National Air Quality Map</div>
                    <div className="panel-subtitle">Real-time AQI · Station data</div>
                  </div>
                  <div className="map-legend-row">
                    {[['#22c55e','Good'],['#eab308','Moderate'],['#f97316','Poor'],['#ef4444','Very Poor'],['#9333ea','Severe']].map(([color, label]) => (
                      <div className="legend-label" key={label}>
                        <span className="legend-dot" style={{ background: color }}></span>
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
                <div id="dashboard-map" className="map-container"></div>
              </div>

              <div className="city-panel">
                <div className="glass-card" style={{ overflow: 'hidden' }}>
                  <div className="panel-header">
                    <div>
                      <div className="panel-title">City Rankings</div>
                      <div className="panel-subtitle">By current AQI</div>
                    </div>
                  </div>
                  <div className="city-list-wrap">
                    <div id="city-list"></div>
                  </div>
                </div>

                <div className="glass-card">
                  <div className="panel-header">
                    <div className="panel-title">📊 Pollutant Breakdown</div>
                    <select className="select-control" id="pollutant-city-select" style={{ fontSize: '11px', padding: '4px 28px 4px 8px' }}>
                      <option value="delhi">Delhi</option>
                      <option value="mumbai">Mumbai</option>
                      <option value="kolkata">Kolkata</option>
                      <option value="bengaluru">Bengaluru</option>
                      <option value="chennai">Chennai</option>
                      <option value="hyderabad">Hyderabad</option>
                      <option value="pune">Pune</option>
                    </select>
                  </div>
                  <div className="chart-wrap" style={{ height: '160px', paddingBottom: '8px' }}>
                    <canvas id="pollutantChart"></canvas>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══ MODULE 2: Source Attribution ════════════════════════════ */}
          <section className="module" id="mod-attribution">
            <div className="module-header">
              <div className="module-title-group">
                <div className="module-icon">📍</div>
                <div>
                  <div className="module-title">Geospatial Source Attribution Engine</div>
                  <div className="module-subtitle">AI-driven pollutant source identification · Ward-level analysis</div>
                </div>
              </div>
              <div className="module-controls">
                <select className="select-control" id="attribution-city-select">
                  <option value="delhi">Delhi</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="kolkata">Kolkata</option>
                  <option value="bengaluru">Bengaluru</option>
                  <option value="chennai">Chennai</option>
                  <option value="hyderabad">Hyderabad</option>
                  <option value="pune">Pune</option>
                </select>
              </div>
            </div>

            <div className="attribution-layout">
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div className="panel-header">
                  <div>
                    <div className="panel-title">🗺️ Attribution Heatmap</div>
                    <div className="panel-subtitle" id="attribution-map-subtitle">Delhi — Ward-level attribution</div>
                  </div>
                  <div id="attribution-layers" className="toggle-group">
                    <button className="layer-btn active" data-layer="heatmap">
                      <span className="layer-dot" style={{ background: '#ef4444' }}></span>Heat Layer
                    </button>
                    <button className="layer-btn active" data-layer="stations">
                      <span className="layer-dot" style={{ background: '#00d4b8' }}></span>Stations
                    </button>
                  </div>
                </div>
                <div id="attribution-map" className="map-container"></div>
              </div>

              <div className="attribution-side">
                <div className="glass-card">
                  <div className="panel-header">
                    <div className="panel-title">Source Distribution — <span id="attr-city-label">Delhi</span></div>
                  </div>
                  <div className="source-chart-wrap">
                    <div style={{ height: '180px', width: '180px', margin: '0 auto' }}>
                      <canvas id="sourcePieChart"></canvas>
                    </div>
                  </div>
                  <div style={{ padding: '0 16px 14px', display: 'flex', flexDirection: 'column', gap: '6px' }} id="source-legend"></div>
                </div>

                <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div className="panel-header">
                    <div className="panel-title">Ward-level Attribution</div>
                    <div className="panel-subtitle">Top contributing wards</div>
                  </div>
                  <div className="ward-table-wrap">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Ward</th><th>AQI</th><th>Top Source</th><th>Confidence</th>
                        </tr>
                      </thead>
                      <tbody id="ward-table-body"></tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══ MODULE 3: Forecast ══════════════════════════════════════ */}
          <section className="module" id="mod-forecast">
            <div className="module-header">
              <div className="module-title-group">
                <div className="module-icon">📈</div>
                <div>
                  <div className="module-title">Hyperlocal AQI Forecast Engine</div>
                  <div className="module-subtitle">72-hour predictive modelling · Open-Meteo + CAAQMS data fusion</div>
                </div>
              </div>
              <div className="module-controls">
                <select className="select-control" id="forecast-city-select">
                  <option value="delhi">Delhi</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="kolkata">Kolkata</option>
                  <option value="bengaluru">Bengaluru</option>
                  <option value="chennai">Chennai</option>
                  <option value="hyderabad">Hyderabad</option>
                  <option value="pune">Pune</option>
                </select>
                <div className="toggle-group">
                  {[['24','24h'],['48','48h'],['72','72h']].map(([val, label], i) => (
                    <button key={val} className={`btn-ghost${i === 0 ? ' active' : ''}`} data-range={val}>{label}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="forecast-metrics-row">
              <div className="stat-card">
                <div className="stat-label">Current AQI</div>
                <div className="stat-value" id="fc-current">—</div>
                <div className="stat-meta" id="fc-current-cat">—</div>
              </div>
              <div className="stat-card warning">
                <div className="stat-label">Predicted Peak</div>
                <div className="stat-value" id="fc-peak">—</div>
                <div className="stat-meta" id="fc-peak-time">—</div>
              </div>
              <div className="stat-card accent">
                <div className="stat-label">Minimum Forecast</div>
                <div className="stat-value" id="fc-min">—</div>
                <div className="stat-meta">Next 24 hours</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Forecast Accuracy</div>
                <div className="stat-value" style={{ color: '#22c55e' }}>91%</div>
                <div className="stat-meta">vs CAAQMS actuals</div>
              </div>
            </div>

            <div className="forecast-layout">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="glass-card">
                  <div className="panel-header">
                    <div className="panel-title">AQI Forecast — 24/48/72h</div>
                    <div className="panel-subtitle">Predictive model + Open-Meteo weather fusion</div>
                  </div>
                  <div className="chart-wrap">
                    <div className="chart-wrap" style={{ height: '200px' }}>
                      <canvas id="forecastChart"></canvas>
                    </div>
                  </div>
                </div>
                <div className="glass-card">
                  <div className="panel-header">
                    <div className="panel-title">PM2.5 Concentration Forecast</div>
                    <div className="panel-subtitle">µg/m³ · WHO guideline: 15 µg/m³ (24h)</div>
                  </div>
                  <div className="chart-wrap">
                    <div className="chart-wrap" style={{ height: '130px' }}>
                      <canvas id="pm25ForecastChart"></canvas>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="glass-card">
                  <div className="panel-header">
                    <div className="panel-title">🌤️ Meteorological Factors</div>
                  </div>
                  <div className="meteo-grid">
                    <div className="meteo-item">
                      <div className="meteo-icon">💨</div>
                      <span className="meteo-val" id="meteo-wind">—</span>
                      <span className="meteo-label">Wind km/h</span>
                    </div>
                    <div className="meteo-item">
                      <div className="meteo-icon">💧</div>
                      <span className="meteo-val" id="meteo-humidity">—</span>
                      <span className="meteo-label">Humidity</span>
                    </div>
                    <div className="meteo-item">
                      <div className="meteo-icon">🌡️</div>
                      <span className="meteo-val" id="meteo-temp">—</span>
                      <span className="meteo-label">Temperature</span>
                    </div>
                    <div className="meteo-item">
                      <div className="meteo-icon">👁️</div>
                      <span className="meteo-val" id="meteo-visibility">—</span>
                      <span className="meteo-label">Visibility km</span>
                    </div>
                  </div>
                </div>
                <div className="glass-card">
                  <div className="panel-header">
                    <div className="panel-title">Model Performance</div>
                  </div>
                  <div className="accuracy-block">
                    {[['24h Accuracy','91.2%'],['48h Accuracy','86.7%'],['72h Accuracy','79.4%'],['RMSE','18.4 AQI'],['Data Coverage','97.8%']].map(([k,v]) => (
                      <div className="accuracy-row" key={k}>
                        <span className="accuracy-key">{k}</span>
                        <span className="accuracy-val">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ══ MODULE 4: Enforcement ═══════════════════════════════════ */}
          <section className="module" id="mod-enforcement">
            <div className="module-header">
              <div className="module-title-group">
                <div className="module-icon">⚡</div>
                <div>
                  <div className="module-title">Enforcement Intelligence Centre</div>
                  <div className="module-subtitle">Automated hotspot detection · Regulatory action prioritisation</div>
                </div>
              </div>
              <div className="module-controls">
                <select className="select-control" id="enforcement-city-select">
                  <option value="all">All Cities</option>
                  <option value="delhi">Delhi</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="kolkata">Kolkata</option>
                  <option value="bengaluru">Bengaluru</option>
                  <option value="chennai">Chennai</option>
                  <option value="hyderabad">Hyderabad</option>
                  <option value="pune">Pune</option>
                </select>
                <select className="select-control" id="enforcement-priority-select">
                  <option value="all">All Priorities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                </select>
              </div>
            </div>

            <div className="enforcement-summary">
              <div className="stat-card danger">
                <div className="stat-label">Critical Hotspots</div>
                <div className="stat-value" id="enf-critical">—</div>
                <div className="stat-meta">Immediate action</div>
              </div>
              <div className="stat-card warning">
                <div className="stat-label">High Priority</div>
                <div className="stat-value" id="enf-high">—</div>
                <div className="stat-meta">Action within 24h</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Medium Priority</div>
                <div className="stat-value" id="enf-medium">—</div>
                <div className="stat-meta">Scheduled review</div>
              </div>
              <div className="stat-card accent">
                <div className="stat-label">Total Hotspots</div>
                <div className="stat-value" id="enf-count-label">—</div>
                <div className="stat-meta">Active enforcement</div>
              </div>
            </div>

            <div className="enforcement-layout">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0, overflow: 'hidden' }} className="glass-card">
                <div className="panel-header">
                  <div className="panel-title">Pollution Hotspot Registry</div>
                </div>
                <div className="filter-bar">
                  {[['all','All'],['Vehicle Emissions','Vehicles'],['Industrial Emission','Industrial'],['Construction Dust','Construction'],['Waste Burning','Waste']].map(([val, label]) => (
                    <button key={val} className={`filter-chip${val === 'all' ? ' active' : ''}`} data-filter={val}>{label}</button>
                  ))}
                </div>
                <div className="hotspot-list-inner">
                  <div id="hotspot-list"></div>
                </div>
              </div>

              <div className="enforcement-right">
                <div className="glass-card" style={{ flex: 1, overflow: 'hidden' }}>
                  <div className="panel-header">
                    <div className="panel-title">⚡ Enforcement Map</div>
                    <div className="panel-subtitle">Active hotspots geolocation</div>
                  </div>
                  <div id="enforcement-map" className="map-container" style={{ minHeight: '260px' }}></div>
                </div>

                <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div className="panel-header">
                    <div className="panel-title">⚡ Priority Action Cards</div>
                    <div className="panel-subtitle">Critical &amp; High priority actions</div>
                  </div>
                  <div className="action-cards-list" id="action-cards"></div>
                </div>
              </div>
            </div>
          </section>

          {/* ══ MODULE 5: Comparison ════════════════════════════════════ */}
          <section className="module" id="mod-comparison">
            <div className="module-header">
              <div className="module-title-group">
                <div className="module-icon">📊</div>
                <div>
                  <div className="module-title">Multi-City Comparative Intelligence</div>
                  <div className="module-subtitle">30-day trend analysis · Cross-city pollution profiling</div>
                </div>
              </div>
              <div className="module-controls">
                <div className="toggle-group" id="view-metric-btns">
                  <button className="btn-ghost active" id="view-aqi-btn">AQI</button>
                  <button className="btn-ghost" id="view-pm25-btn">PM2.5</button>
                  <button className="btn-ghost" id="view-pm10-btn">PM10</button>
                </div>
              </div>
            </div>

            <div className="comparison-layout">
              <div className="glass-card">
                <div className="panel-header">
                  <div className="panel-title">30-Day AQI Comparison</div>
                  <div className="panel-subtitle">Click city list below to toggle</div>
                </div>
                <div className="comparison-chart-wrap">
                  <div className="chart-wrap" style={{ height: '220px' }}>
                    <canvas id="comparisonChart"></canvas>
                  </div>
                </div>
              </div>

              <div className="comparison-bottom">
                <div className="glass-card">
                  <div className="panel-header">
                    <div className="panel-title">City Selector</div>
                  </div>
                  <div className="city-check-list" id="city-checklist"></div>
                </div>

                <div className="glass-card">
                  <div className="panel-header">
                    <div className="panel-title">Radar Profile</div>
                    <select className="select-control" id="radar-city-select" style={{ fontSize: '11px', padding: '4px 28px 4px 8px' }}>
                      <option value="delhi">Delhi</option>
                      <option value="mumbai">Mumbai</option>
                      <option value="kolkata">Kolkata</option>
                      <option value="bengaluru">Bengaluru</option>
                      <option value="chennai">Chennai</option>
                      <option value="hyderabad">Hyderabad</option>
                      <option value="pune">Pune</option>
                    </select>
                  </div>
                  <div className="chart-wrap">
                    <div className="chart-wrap" style={{ height: '220px' }}>
                      <canvas id="radarChart"></canvas>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card">
                <div className="panel-header">
                  <div className="panel-title">Performance Summary</div>
                </div>
                <div className="comparison-table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>City</th><th>Avg AQI (30d)</th><th>Trend</th><th>Best Day</th><th>Status</th>
                      </tr>
                    </thead>
                    <tbody id="comparison-table-body"></tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* ══ MODULE 6: Advisory ══════════════════════════════════════ */}
          <section className="module" id="mod-advisory">
            <div className="module-header">
              <div className="module-title-group">
                <div className="module-icon">🏥</div>
                <div>
                  <div className="module-title">Citizen Health Risk Advisory System</div>
                  <div className="module-subtitle">Multilingual advisories · Vulnerable population protection</div>
                </div>
              </div>
              <div className="module-controls">
                <select className="select-control" id="advisory-city-select">
                  <option value="delhi">Delhi</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="kolkata">Kolkata</option>
                  <option value="bengaluru">Bengaluru</option>
                  <option value="chennai">Chennai</option>
                  <option value="hyderabad">Hyderabad</option>
                  <option value="pune">Pune</option>
                </select>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button className="advisory-mode-btn active" id="advisory-mode-static" onClick={() => (window as any).__setAdvisoryMode && (window as any).__setAdvisoryMode('static')}>📋 Static</button>
                  <button className="advisory-mode-btn" id="advisory-mode-ai" onClick={() => (window as any).__setAdvisoryMode && (window as any).__setAdvisoryMode('ai')}>🤖 AI</button>
                </div>
              </div>
            </div>

            <div className="advisory-layout">
              <div className="advisory-left">
                <div className="glass-card">
                  <div className="panel-header">
                    <div className="panel-title">Advisory Language</div>
                  </div>
                  <div className="lang-toggle">
                    {[['english','English'],['hindi','हिंदी'],['kannada','ಕನ್ನಡ'],['tamil','தமிழ்']].map(([lang, label], i) => (
                      <button key={lang} className={`lang-btn${i === 0 ? ' active' : ''}`} data-lang={lang}>{label}</button>
                    ))}
                  </div>
                  <div className="advisory-message-box moderate" id="advisory-message-box">Loading advisory...</div>
                </div>

                <div className="glass-card">
                  <div className="panel-header">
                    <div className="panel-title">Population Vulnerability</div>
                    <div className="panel-subtitle" id="advisory-risk-city">Delhi — current AQI 218</div>
                  </div>
                  <div className="risk-cards-grid" id="risk-cards-grid"></div>
                </div>

                <div className="glass-card">
                  <div className="panel-header">
                    <div className="panel-title">🏥 Emergency Health Contacts</div>
                  </div>
                  <div style={{ padding: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                    {[['🚑','AIIMS Emergency','011-26588500'],['💊','Poison Control','1800-116-117'],['🏥','SAAOL Heart','011-47414141'],['🌿','CPCB Helpline','1800-11-4503']].map(([icon, name, num]) => (
                      <div key={name} style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                        <div style={{ fontSize: '20px', marginBottom: '4px' }}>{icon}</div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>{name}</div>
                        <div style={{ color: 'var(--accent)', fontWeight: 700 }}>{num}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="advisory-right">
                <div className="glass-card">
                  <div className="panel-header">
                    <div className="panel-title">Ward Vulnerability Map</div>
                    <div className="panel-subtitle" id="advisory-ward-city">Delhi</div>
                  </div>
                  <div className="ward-table-section" id="ward-vulnerability-list"></div>
                </div>

                <div className="glass-card">
                  <div className="panel-header">
                    <div className="panel-title">Health Risk Forecast (24h)</div>
                    <div className="panel-subtitle">Exposure risk by demographic</div>
                  </div>
                  <div className="chart-wrap">
                    <div className="chart-wrap" style={{ height: '200px' }}>
                      <canvas id="healthForecastChart"></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </main>
      </div>

      {/* ─── AI Chat FAB + Drawer ────────────────────────────────────── */}
      <button className="ai-chat-fab" id="ai-chat-fab" onClick={() => (window as any).__toggleChat && (window as any).__toggleChat()}>
        <span className="ai-fab-icon">🤖</span>
        <span className="ai-fab-label">AirSense AI</span>
      </button>

      <div className="ai-chat-drawer" id="ai-chat-drawer">
        <div className="ai-chat-header">
          <div className="ai-chat-header-info">
            <span className="ai-chat-avatar-lg">🤖</span>
            <div>
              <div className="ai-chat-title">AirSense AI Assistant</div>
              <div className="ai-chat-subtitle">Powered by Groq · LLaMA 3.3 70B</div>
            </div>
          </div>
          <button className="ai-chat-close" onClick={() => (window as any).__toggleChat && (window as any).__toggleChat()}>✕</button>
        </div>
        <div className="ai-chat-messages" id="ai-chat-messages">
          <div className="ai-chat-msg">
            <span className="ai-chat-avatar">🤖</span>
            <div className="ai-chat-bubble">
              Hello! I&apos;m AirSense AI. I can help you understand real-time air quality data, health risks, and smart city interventions across Indian cities. What would you like to know?
            </div>
          </div>
        </div>
        <div className="ai-chat-chips" id="ai-chat-chips">
          {['Which city has worst AQI now?', 'What are health risks for Delhi?', 'Explain PM2.5 sources', 'Best time to exercise outdoors?'].map(chip => (
            <button key={chip} className="ai-chat-chip" onClick={() => (window as any).__sendChatChip && (window as any).__sendChatChip(chip)}>{chip}</button>
          ))}
        </div>
        <div className="ai-chat-input-row">
          <input type="text" id="ai-chat-input" className="ai-chat-input" placeholder="Ask about air quality..." />
          <button className="ai-chat-send" id="ai-chat-send" onClick={() => (window as any).__sendChatMessage && (window as any).__sendChatMessage()}>↑</button>
        </div>
      </div>

      {/* ─── AI Memo Modal ───────────────────────────────────────────── */}
      <div className="ai-memo-modal-overlay" id="ai-memo-modal">
        <div className="ai-memo-modal-box">
          <div className="ai-memo-modal-header">
            <div>
              <div className="ai-memo-title">🤖 AI Enforcement Memo</div>
              <div className="ai-memo-subtitle" id="ai-memo-subtitle">Generating enforcement recommendation...</div>
            </div>
            <button className="ai-memo-close" onClick={() => (window as any).__closeMemoModal && (window as any).__closeMemoModal()}>✕</button>
          </div>
          <div className="ai-memo-body">
            <div className="ai-memo-text" id="ai-memo-text"></div>
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Boot logic — called once after hydration
// ─────────────────────────────────────────────────────────────────────────────

async function bootApp() {
  // Show loader animation
  showLoader();

  // Dynamically import all lib modules (avoids SSR issues)
  const [
    { CITIES, HISTORICAL_DATA, FORECAST_DATA, STATIONS },
    { getAQICat, ADVISORIES, getAdvisoryLevel, ENFORCEMENT_HOTSPOTS, SOURCE_ATTRIBUTION, WARDS_VULNERABILITY, CITY_COLORS_CHART },
    { fetchAllCitiesRealtime, REALTIME_CONFIG },
    { getGroqKey, saveGroqKey, generateNationalAnalysis, generateSmartAdvisory, generateEnforcementMemo, sendChatMessage, getStaticAdvisory, buildThinkingUI, buildNoKeyPrompt, buildErrorUI, AI_MODEL },
    { initDashboardMap, initAttributionMap, updateAttributionMap, initEnforcementMap, renderEnforcementMarkers, invalidateAllMaps, refreshDashboardMarkers },
    { initPollutantChart, initForecastChart, initPM25ForecastChart, initSourcePieChart, initComparisonChart, initRadarChart, initHealthForecastChart }
  ] = await Promise.all([
    import('@/lib/store'),
    import('@/lib/data'),
    import('@/lib/realtime'),
    import('@/lib/groq'),
    import('@/lib/mapUtils'),
    import('@/lib/chartUtils')
  ]);

  // ─── State ─────────────────────────────────────────────────────────────────
  let currentModule = 'dashboard';
  const moduleInitialized: Record<string, boolean> = {};
  let selectedComparisonCities = ['delhi', 'mumbai', 'kolkata', 'bengaluru', 'chennai'];
  let comparisonMetric = 'aqi';
  let advisoryLang = 'english';
  let advisoryCityId = 'delhi';
  let advisoryMode: 'static' | 'ai' = 'static';
  let forecastCity = 'delhi';
  let forecastRange = 24;
  let enforcementCityFilter = 'all';
  let enforcementPriorityFilter = 'all';
  let enforcementFilter = 'all';
  let chatHistory: any[] = [];
  let chatDrawerOpen = false;
  let countdownSeconds = 300;
  let countdownTimer: any = null;

  // ─── Ticker ────────────────────────────────────────────────────────────────
  function initTicker() {
    const container = document.getElementById('ticker-content');
    if (!container) return;
    const sorted = [...CITIES].sort((a, b) => b.aqi - a.aqi);
    const items = sorted.map(city => {
      const cat = getAQICat(city.aqi);
      return `<span class="ticker-city">
        <span class="ticker-city-name">${city.name}</span>
        <span class="ticker-aqi-val" style="color:${cat.color};">${city.aqi}</span>
        <span class="ticker-cat" style="background:${cat.bg};color:${cat.color};">${cat.label}</span>
      </span>`;
    }).join('');
    container.innerHTML = items + items;
  }

  function updateTimestamp() {
    const el = document.getElementById('last-updated');
    if (!el) return;
    const now = new Date();
    el.textContent = `Updated ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })} IST`;
  }

  function startCountdown() {
    if (countdownTimer) clearInterval(countdownTimer);
    countdownSeconds = 300;
    const label = document.getElementById('refresh-countdown');
    countdownTimer = setInterval(() => {
      countdownSeconds--;
      if (label) {
        const m = Math.floor(countdownSeconds / 60);
        const s = countdownSeconds % 60;
        label.textContent = `Next refresh: ${m}:${s.toString().padStart(2, '0')}`;
      }
      if (countdownSeconds <= 0) {
        clearInterval(countdownTimer);
        triggerRefresh();
      }
    }, 1000);
  }

  async function triggerRefresh() {
    const btn = document.getElementById('manual-refresh-btn') as HTMLButtonElement;
    if (btn) { btn.disabled = true; btn.textContent = '↻ Fetching...'; }
    try {
      await fetchAllCitiesRealtime();
      onAirQualityUpdate();
    } catch(e) { console.warn('[AirSense] Refresh failed:', e); }
    if (btn) { btn.disabled = false; btn.textContent = '↻ Refresh Now'; }
    startCountdown();
  }

  (window as any).__manualRefresh = triggerRefresh;

  // ─── City List ─────────────────────────────────────────────────────────────
  function initCityList() {
    const listEl = document.getElementById('city-list');
    if (!listEl) return;
    const sorted = [...CITIES].sort((a, b) => b.aqi - a.aqi);
    listEl.innerHTML = sorted.map((city, i) => {
      const cat = getAQICat(city.aqi);
      const barWidth = Math.min((city.aqi / 450) * 100, 100);
      return `<div class="city-row" data-city="${city.id}" id="city-row-${city.id}">
        <div class="city-rank">${i + 1}</div>
        <div class="city-info">
          <div class="city-name">${city.name}</div>
          <div class="city-state">${city.state}</div>
        </div>
        <div class="city-aqi-display">
          <div class="city-aqi-number" style="color:${cat.color};">${city.aqi}</div>
          <div class="city-aqi-bar-wrap">
            <div class="city-aqi-bar-fill" style="width:${barWidth}%;background:${cat.color};"></div>
          </div>
          <div style="font-size:10px;color:${cat.color};font-weight:600;margin-top:2px;">${cat.label}</div>
        </div>
      </div>`;
    }).join('');
    listEl.querySelectorAll('.city-row').forEach(row => {
      row.addEventListener('click', () => {
        listEl.querySelectorAll('.city-row').forEach(r => r.classList.remove('selected'));
        (row as HTMLElement).classList.add('selected');
        const cityId = (row as HTMLElement).dataset.city!;
        const sel = document.getElementById('pollutant-city-select') as HTMLSelectElement;
        if (sel) { sel.value = cityId; initPollutantChart(cityId); }
      });
    });
  }

  // ─── Stat Cards ────────────────────────────────────────────────────────────
  function updateDashboardStats() {
    const avgAqi = Math.round(CITIES.reduce((s, c) => s + c.aqi, 0) / CITIES.length);
    const natEl = document.getElementById('stat-nat-aqi');
    if (natEl) { const cat = getAQICat(avgAqi); natEl.textContent = String(avgAqi); natEl.style.color = cat.color; }
    const trendEl = document.getElementById('stat-nat-trend');
    if (trendEl) {
      const avgTrend = Math.round(CITIES.reduce((s, c) => s + (c.trend || 0), 0) / CITIES.length);
      trendEl.textContent = avgTrend >= 0 ? `▲ ${avgTrend} pts today` : `▼ ${Math.abs(avgTrend)} pts today`;
      trendEl.style.color = avgTrend >= 0 ? '#ef4444' : '#22c55e';
      trendEl.className = avgTrend >= 0 ? 'stat-trend-up' : 'stat-trend-down';
    }
  }

  // ─── Module Navigation ─────────────────────────────────────────────────────
  function showModule(moduleId: string) {
    if (currentModule === moduleId) return;
    const prevSection = document.getElementById(`mod-${currentModule}`);
    const nextSection = document.getElementById(`mod-${moduleId}`);
    if (!nextSection) return;
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', (item as HTMLElement).dataset.module === moduleId);
    });
    if (prevSection) {
      prevSection.style.opacity = '0';
      prevSection.style.transform = 'translateY(8px)';
      setTimeout(() => { prevSection.style.display = 'none'; prevSection.classList.remove('transitioning'); }, 300);
    }
    currentModule = moduleId;
    nextSection.style.display = 'block';
    nextSection.classList.add('transitioning');
    nextSection.style.opacity = '0';
    nextSection.style.transform = 'translateY(10px)';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        nextSection.style.opacity = '1';
        nextSection.style.transform = 'translateY(0)';
        setTimeout(() => {
          nextSection.classList.remove('transitioning');
          nextSection.classList.add('active');
          invalidateAllMaps();
          ensureModuleInit(moduleId);
        }, 280);
      });
    });
    if (prevSection) prevSection.classList.remove('active');
  }

  function ensureModuleInit(moduleId: string) {
    if (moduleInitialized[moduleId]) return;
    moduleInitialized[moduleId] = true;
    if (moduleId === 'attribution') initAttributionModule();
    else if (moduleId === 'forecast') initForecastModule();
    else if (moduleId === 'enforcement') initEnforcementModule();
    else if (moduleId === 'comparison') initComparisonModule();
    else if (moduleId === 'advisory') initAdvisoryModule();
  }

  function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const moduleId = (btn as HTMLElement).dataset.module;
        if (moduleId) showModule(moduleId);
        // Close sidebar on mobile after nav
        document.getElementById('sidebar')?.classList.remove('open');
        document.getElementById('sidebar-overlay')?.classList.remove('visible');
      });
    });
  }

  // ─── onAirQualityUpdate ────────────────────────────────────────────────────
  function onAirQualityUpdate() {
    updateTimestamp();
    initTicker();
    initCityList();
    updateDashboardStats();
    try { refreshDashboardMarkers(); } catch(e) {}
    const badge = document.getElementById('groq-badge-label');
    const key = getGroqKey();
    if (badge) badge.textContent = key ? '✓ Groq AI Active' : 'Groq AI';
    const dot = document.querySelector('.groq-badge-dot') as HTMLElement;
    if (dot) dot.style.background = key ? '#22c55e' : '#f97316';
  }

  // ─── AI Analyst Panel ──────────────────────────────────────────────────────
  async function renderAIAnalystPanel() {
    const content = document.getElementById('ai-analyst-content');
    if (!content) return;
    const key = getGroqKey();
    if (!key) {
      content.innerHTML = buildNoKeyPrompt('dashboard');
      return;
    }
    content.innerHTML = buildThinkingUI('Generating national intelligence analysis...');
    try {
      const text = await generateNationalAnalysis();
      content.innerHTML = `<span>${text}</span>`;
    } catch(e: any) {
      content.innerHTML = buildErrorUI(e.message, 'window.__refreshAIAnalyst()');
    }
  }

  (window as any).__refreshAIAnalyst = renderAIAnalystPanel;

  // ─── Groq Key (env-var only, no runtime modal) ────────────────────────────
  // Key is configured via NEXT_PUBLIC_GROQ_API_KEY in .env.local.

  // ─── Attribution Module ────────────────────────────────────────────────────
  function initAttributionModule() {
    const sel = document.getElementById('attribution-city-select') as HTMLSelectElement;
    if (sel) sel.addEventListener('change', e => {
      const cityId = (e.target as HTMLSelectElement).value;
      renderAttributionModule(cityId);
    });
    initAttributionMap();
    renderAttributionModule('delhi');
  }

  function renderAttributionModule(cityId: string) {
    const city = CITIES.find(c => c.id === cityId) || CITIES[0];
    const subtitleEl = document.getElementById('attribution-map-subtitle');
    const cityLabelEl = document.getElementById('attr-city-label');
    if (subtitleEl) subtitleEl.textContent = `${city.name} — Ward-level attribution`;
    if (cityLabelEl) cityLabelEl.textContent = city.name;
    updateAttributionMap(cityId);
    initSourcePieChart(cityId);
    renderWardTable(cityId);
  }

  function renderWardTable(cityId: string) {
    const attr = SOURCE_ATTRIBUTION[cityId] || SOURCE_ATTRIBUTION['delhi'];
    const tbody = document.getElementById('ward-table-body');
    if (!tbody) return;
    tbody.innerHTML = attr.wards.map((ward: any) => {
      const cat = getAQICat(ward.aqi);
      return `<tr>
        <td style="font-weight:600;color:var(--text-primary);">${ward.name}</td>
        <td>
          <span style="font-weight:700;color:${cat.color};">${ward.aqi}</span>
          <span style="font-size:10px;color:var(--text-muted);margin-left:4px;">${cat.label}</span>
        </td>
        <td>
          <span style="font-size:11px;color:var(--text-primary);">${ward.topSource}</span>
          <span style="font-size:10px;color:var(--text-muted);margin-left:4px;">(${ward.contribution}%)</span>
        </td>
        <td>
          <div class="confidence-bar-wrap">
            <div class="confidence-bar"><div class="confidence-fill" style="width:${ward.confidence}%;"></div></div>
            <span class="confidence-val">${ward.confidence}%</span>
          </div>
        </td>
      </tr>`;
    }).join('');
  }

  // ─── Forecast Module ───────────────────────────────────────────────────────
  function initForecastModule() {
    const sel = document.getElementById('forecast-city-select') as HTMLSelectElement;
    if (sel) sel.addEventListener('change', e => { forecastCity = (e.target as HTMLSelectElement).value; renderForecast(); });
    document.querySelectorAll('[data-range]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-range]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        forecastRange = parseInt((btn as HTMLElement).dataset.range!);
        renderForecast();
      });
    });
    renderForecast();
  }

  function renderForecast() {
    const data = FORECAST_DATA[forecastCity] || FORECAST_DATA['delhi'];
    const city = CITIES.find(c => c.id === forecastCity) || CITIES[0];
    const currentEl = document.getElementById('fc-current');
    const currentCatEl = document.getElementById('fc-current-cat');
    if (currentEl) {
      const cat = getAQICat(city.aqi);
      currentEl.textContent = String(city.aqi);
      currentEl.style.color = cat.color;
      if (currentCatEl) currentCatEl.textContent = cat.label;
    }
    const sliceCount = Math.ceil(forecastRange / 3) + 1;
    const sliced = data.slice(0, sliceCount);
    const aqiValues = sliced.map((d: any) => d.aqi).filter(Boolean);
    const peakAqi = Math.max(...aqiValues);
    const minAqi = Math.min(...aqiValues);
    const peakIdx = aqiValues.indexOf(peakAqi);
    const peakEl = document.getElementById('fc-peak');
    const peakTimeEl = document.getElementById('fc-peak-time');
    const minEl = document.getElementById('fc-min');
    if (peakEl) { const cat = getAQICat(peakAqi); peakEl.textContent = String(peakAqi); peakEl.style.color = cat.color; }
    if (peakTimeEl) peakTimeEl.textContent = sliced[peakIdx]?.label || '—';
    if (minEl) { const cat = getAQICat(minAqi); minEl.textContent = String(minAqi); minEl.style.color = cat.color; }
    const nowData = data[0];
    const windEl = document.getElementById('meteo-wind');
    const humidityEl = document.getElementById('meteo-humidity');
    const tempEl = document.getElementById('meteo-temp');
    const visibilityEl = document.getElementById('meteo-visibility');
    if (windEl) windEl.textContent = nowData?.windSpeed ?? '—';
    if (humidityEl) humidityEl.textContent = nowData ? nowData.humidity + '%' : '—';
    if (tempEl) tempEl.textContent = nowData ? nowData.temperature + '°' : '—';
    if (visibilityEl) visibilityEl.textContent = nowData ? Math.max(1, nowData.visibility).toFixed(1) : '—';
    initForecastChart(forecastCity, forecastRange);
    initPM25ForecastChart(forecastCity, forecastRange);
  }

  // ─── Enforcement Module ────────────────────────────────────────────────────
  function initEnforcementModule() {
    const citySel = document.getElementById('enforcement-city-select') as HTMLSelectElement;
    if (citySel) citySel.addEventListener('change', e => { enforcementCityFilter = (e.target as HTMLSelectElement).value; renderEnforcementModule(); });
    const priorSel = document.getElementById('enforcement-priority-select') as HTMLSelectElement;
    if (priorSel) priorSel.addEventListener('change', e => { enforcementPriorityFilter = (e.target as HTMLSelectElement).value; renderEnforcementModule(); });
    const filterChips = document.querySelectorAll('.filter-chip');
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        enforcementFilter = (chip as HTMLElement).dataset.filter!;
        renderEnforcementModule();
      });
    });
    initEnforcementMap();
    renderEnforcementModule();
  }

  function getFilteredHotspots() {
    return ENFORCEMENT_HOTSPOTS.filter((h: any) => {
      const cityMatch = enforcementCityFilter === 'all' || h.city === enforcementCityFilter;
      const typeMatch = enforcementFilter === 'all' || h.sourceType === enforcementFilter;
      const priorityMatch = enforcementPriorityFilter === 'all' || h.priority === enforcementPriorityFilter;
      return cityMatch && typeMatch && priorityMatch;
    }).sort((a: any, b: any) => {
      const order: any = { Critical: 0, High: 1, Medium: 2 };
      return order[a.priority] - order[b.priority] || b.aqi - a.aqi;
    });
  }

  function renderEnforcementModule() {
    const filtered = getFilteredHotspots();
    const criticalCount = filtered.filter((h: any) => h.priority === 'Critical').length;
    const highCount = filtered.filter((h: any) => h.priority === 'High').length;
    const mediumCount = filtered.filter((h: any) => h.priority === 'Medium').length;
    const critEl = document.getElementById('enf-critical');
    const highEl = document.getElementById('enf-high');
    const medEl = document.getElementById('enf-medium');
    const countLabel = document.getElementById('enf-count-label');
    if (critEl) critEl.textContent = String(criticalCount);
    if (highEl) highEl.textContent = String(highCount);
    if (medEl) medEl.textContent = String(mediumCount);
    if (countLabel) countLabel.textContent = `${filtered.length} hotspot${filtered.length !== 1 ? 's' : ''}`;
    renderHotspotList(filtered);
    renderActionCards(filtered.filter((h: any) => h.priority === 'Critical' || h.priority === 'High').slice(0, 3));
    renderEnforcementMarkers(filtered);
  }

  function renderHotspotList(hotspots: any[]) {
    const listEl = document.getElementById('hotspot-list');
    if (!listEl) return;
    if (hotspots.length === 0) {
      listEl.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🔍</div><div>No hotspots match current filters</div></div>`;
      return;
    }
    listEl.innerHTML = hotspots.map((h, i) => {
      const cat = getAQICat(h.aqi);
      const priorityColors: any = { Critical: '#ef4444', High: '#f97316', Medium: '#eab308' };
      const pColor = priorityColors[h.priority] || '#eab308';
      const statusClass = h.status === 'Active' ? 'active' : h.status === 'Monitoring' ? 'monitoring' : 'review';
      return `<div class="hotspot-row" data-id="${h.id}">
        <div class="hotspot-rank">${i + 1}</div>
        <div style="width:3px;height:36px;background:${pColor};border-radius:2px;flex-shrink:0;"></div>
        <div class="hotspot-info">
          <div class="hotspot-name">${h.sourceIcon} ${h.name}</div>
          <div style="display:flex;align-items:center;gap:6px;margin-top:3px;">
            <span class="priority-badge ${h.priority.toLowerCase()}">${h.priority}</span>
            <span class="status-badge ${statusClass}">${h.status}</span>
            <span style="font-size:10px;color:var(--text-muted);">${h.sourceType}</span>
          </div>
        </div>
        <div style="text-align:right;flex-shrink:0;display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
          <div class="hotspot-aqi" style="color:${cat.color};">${h.aqi}</div>
          <div style="font-size:10px;color:var(--text-muted);">${h.violations} violations</div>
          <button class="ai-memo-trigger-btn" onclick="window.__generateEnfMemo('${h.id}')">🤖 AI Memo</button>
        </div>
      </div>`;
    }).join('');
  }

  function renderActionCards(hotspots: any[]) {
    const container = document.getElementById('action-cards');
    if (!container) return;
    if (hotspots.length === 0) {
      container.innerHTML = `<div class="empty-state"><div class="empty-state-icon">✅</div><div>No critical actions required</div></div>`;
      return;
    }
    container.innerHTML = hotspots.map(h => {
      const cat = getAQICat(h.aqi);
      const pClass = h.priority.toLowerCase();
      return `<div class="action-card ${pClass}">
        <div class="action-card-header">
          <div class="action-card-name">${h.sourceIcon} ${h.name}</div>
          <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
            <span class="aqi-badge" style="background:${cat.bg};color:${cat.color};">${h.aqi} AQI</span>
            <span class="priority-badge ${pClass}">${h.priority}</span>
          </div>
        </div>
        <div class="action-card-body">📋 ${h.action}</div>
        <div class="action-card-footer">
          <span class="action-card-meta">👤 ${h.assignedTo}</span>
          <span class="action-card-meta">📅 Due: ${h.dueDate}</span>
          <span class="action-card-meta" style="color:${h.registered ? '#22c55e' : '#f97316'};">${h.registered ? '✓ Registered' : '⚠ Unregistered'}</span>
        </div>
      </div>`;
    }).join('');
  }

  // Enforcement AI Memo
  (window as any).__generateEnfMemo = async (hotspotId: string) => {
    const hotspot = ENFORCEMENT_HOTSPOTS.find((h: any) => h.id === hotspotId);
    if (!hotspot) return;
    const modal = document.getElementById('ai-memo-modal')!;
    const subtitle = document.getElementById('ai-memo-subtitle')!;
    const text = document.getElementById('ai-memo-text')!;
    modal.style.display = 'flex';
    subtitle.textContent = `${(hotspot as any).name} — ${(hotspot as any).priority} Priority`;
    const key = getGroqKey();
    if (!key) { text.innerHTML = buildNoKeyPrompt('enforcement'); return; }
    text.innerHTML = buildThinkingUI('Generating enforcement memo...', true);
    try {
      const memo = await generateEnforcementMemo(hotspot);
      text.innerHTML = `<div>${memo.replace(/\n\n/g, '</div><div style="margin-top:10px;">').replace(/\n/g, ' ')}</div>`;
    } catch(e: any) {
      text.innerHTML = buildErrorUI(e.message, `window.__generateEnfMemo('${hotspotId}')`);
    }
  };

  (window as any).__closeMemoModal = () => {
    const modal = document.getElementById('ai-memo-modal')!;
    modal.style.display = 'none';
  };
  document.getElementById('ai-memo-modal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('ai-memo-modal')) (window as any).__closeMemoModal();
  });

  // ─── Comparison Module ─────────────────────────────────────────────────────
  function initComparisonModule() {
    selectedComparisonCities = ['delhi', 'mumbai', 'kolkata', 'bengaluru', 'chennai'];
    comparisonMetric = 'aqi';
    const aqiBtn = document.getElementById('view-aqi-btn');
    const pm25Btn = document.getElementById('view-pm25-btn');
    const pm10Btn = document.getElementById('view-pm10-btn');
    const radarCitySelect = document.getElementById('radar-city-select') as HTMLSelectElement;
    if (aqiBtn) aqiBtn.addEventListener('click', () => { comparisonMetric = 'aqi'; updateViewBtns(aqiBtn); renderComparisonModule(); });
    if (pm25Btn) pm25Btn.addEventListener('click', () => { comparisonMetric = 'pm25'; updateViewBtns(pm25Btn); renderComparisonModule(); });
    if (pm10Btn) pm10Btn.addEventListener('click', () => { comparisonMetric = 'pm10'; updateViewBtns(pm10Btn); renderComparisonModule(); });
    if (radarCitySelect) radarCitySelect.addEventListener('change', e => { initRadarChart((e.target as HTMLSelectElement).value); });
    renderComparisonModule();
  }

  function updateViewBtns(activeBtn: HTMLElement) {
    [document.getElementById('view-aqi-btn'), document.getElementById('view-pm25-btn'), document.getElementById('view-pm10-btn')].forEach(b => { if (b) b.classList.remove('active'); });
    activeBtn.classList.add('active');
  }

  function renderComparisonModule() {
    renderCityChecklist();
    initComparisonChart(selectedComparisonCities, comparisonMetric);
    initRadarChart('delhi');
    renderComparisonTable();
  }

  function renderCityChecklist() {
    const container = document.getElementById('city-checklist');
    if (!container) return;
    container.innerHTML = CITIES.map((city, i) => {
      const color = CITY_COLORS_CHART[i % CITY_COLORS_CHART.length];
      const isSelected = selectedComparisonCities.includes(city.id);
      const cat = getAQICat(city.aqi);
      return `<div class="city-check-item" data-city="${city.id}" style="opacity:${isSelected ? 1 : 0.5};">
        <div class="city-check-indicator" style="background:${isSelected ? color : 'transparent'};border:2px solid ${color};"></div>
        <span class="city-check-label">${city.name}</span>
        <span class="city-check-aqi" style="color:${cat.color};">${city.aqi}</span>
      </div>`;
    }).join('');
    container.querySelectorAll('.city-check-item').forEach(item => {
      item.addEventListener('click', () => {
        const cityId = (item as HTMLElement).dataset.city!;
        const idx = selectedComparisonCities.indexOf(cityId);
        const i = CITIES.findIndex(c => c.id === cityId);
        const color = CITY_COLORS_CHART[i % CITY_COLORS_CHART.length];
        const indicator = item.querySelector('.city-check-indicator') as HTMLElement;
        if (idx >= 0) {
          if (selectedComparisonCities.length > 1) {
            selectedComparisonCities.splice(idx, 1);
            (item as HTMLElement).style.opacity = '0.5';
            if (indicator) indicator.style.background = 'transparent';
          }
        } else {
          selectedComparisonCities.push(cityId);
          (item as HTMLElement).style.opacity = '1';
          if (indicator) indicator.style.background = color;
        }
        initComparisonChart(selectedComparisonCities, comparisonMetric);
      });
    });
  }

  function renderComparisonTable() {
    const tbody = document.getElementById('comparison-table-body');
    if (!tbody) return;
    const rows = CITIES.map(city => {
      const hist = HISTORICAL_DATA[city.id] || [];
      const avgAqi = hist.length > 0 ? Math.round(hist.reduce((s: number, d: any) => s + d.aqi, 0) / hist.length) : city.aqi;
      const bestDay = hist.reduce((best: any, d: any) => d.aqi < best.aqi ? d : best, hist[0] || { aqi: city.aqi, label: '—' });
      const cat = getAQICat(avgAqi);
      const trendStr = city.trend > 0
        ? `<span style="color:#ef4444;">▲ ${city.trend}</span>`
        : `<span style="color:#22c55e;">▼ ${Math.abs(city.trend)}</span>`;
      const statusBadge = avgAqi > 200
        ? `<span class="status-badge active">Deteriorating</span>`
        : avgAqi > 100
        ? `<span class="status-badge monitoring">Moderate</span>`
        : `<span class="status-badge review" style="color:#22c55e;background:rgba(34,197,94,0.1);">Good</span>`;
      return `<tr>
        <td style="font-weight:600;color:var(--text-primary);">${city.name}</td>
        <td><span style="font-weight:700;color:${cat.color};">${avgAqi}</span></td>
        <td>${trendStr}</td>
        <td><span style="color:#22c55e;font-weight:600;">${bestDay?.label || '—'} (${bestDay?.aqi || '—'})</span></td>
        <td>${statusBadge}</td>
      </tr>`;
    });
    tbody.innerHTML = rows.join('');
  }

  // ─── Advisory Module ───────────────────────────────────────────────────────
  function initAdvisoryModule() {
    advisoryCityId = 'delhi';
    advisoryLang = 'english';
    const citySelect = document.getElementById('advisory-city-select') as HTMLSelectElement;
    if (citySelect) citySelect.addEventListener('change', e => { advisoryCityId = (e.target as HTMLSelectElement).value; renderAdvisoryModule(); });
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        langBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        advisoryLang = (btn as HTMLElement).dataset.lang!;
        renderAdvisoryMessage();
      });
    });
    renderAdvisoryModule();
  }

  function renderAdvisoryModule() {
    const city = CITIES.find(c => c.id === advisoryCityId) || CITIES[0];
    const wardCityEl = document.getElementById('advisory-ward-city');
    const riskCityEl = document.getElementById('advisory-risk-city');
    if (wardCityEl) wardCityEl.textContent = city.name;
    if (riskCityEl) riskCityEl.textContent = `${city.name} — current AQI ${city.aqi}`;
    renderAdvisoryMessage();
    renderRiskCards(city);
    renderWardVulnerability();
    initHealthForecastChart(advisoryCityId);
  }

  function renderAdvisoryMessage() {
    if (advisoryMode === 'ai') {
      renderSmartAdvisory();
      return;
    }
    const city = CITIES.find(c => c.id === advisoryCityId) || CITIES[0];
    const { level, message } = getStaticAdvisory(city.id, advisoryLang);
    const box = document.getElementById('advisory-message-box');
    if (!box) return;
    box.className = `advisory-message-box ${level}`;
    const levelLabels: any = {
      extreme: '🚨 EXTREME ALERT', very_high: '⚠️ SEVERE WARNING',
      high: '⚡ HIGH ADVISORY', moderate: 'ℹ️ MODERATE NOTICE'
    };
    box.innerHTML = `<div style="font-weight:700;font-size:12px;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px;">${levelLabels[level]}</div>${message}`;
  }

  async function renderSmartAdvisory() {
    const box = document.getElementById('advisory-message-box');
    if (!box) return;
    const key = getGroqKey();
    if (!key) {
      box.className = 'advisory-message-box moderate';
      box.innerHTML = buildNoKeyPrompt('advisory');
      return;
    }
    box.className = 'advisory-message-box moderate';
    box.innerHTML = buildThinkingUI('Generating smart advisory...', true);
    try {
      const text = await generateSmartAdvisory(advisoryCityId, advisoryLang);
      box.innerHTML = `<div style="font-weight:700;font-size:12px;margin-bottom:8px;">🤖 AI SMART ADVISORY</div>${text}`;
    } catch(e: any) {
      box.innerHTML = buildErrorUI(e.message, 'window.__setAdvisoryMode("ai")');
    }
  }

  (window as any).__setAdvisoryMode = (mode: string) => {
    advisoryMode = mode as any;
    document.querySelectorAll('.advisory-mode-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = mode === 'ai'
      ? document.getElementById('advisory-mode-ai')
      : document.getElementById('advisory-mode-static');
    if (activeBtn) activeBtn.classList.add('active');
    renderAdvisoryMessage();
  };

  function renderRiskCards(city: any) {
    const grid = document.getElementById('risk-cards-grid');
    if (!grid) return;
    const riskLevel = getAdvisoryLevel(city.aqi);
    const riskColors: any = { extreme: '#9333ea', very_high: '#ef4444', high: '#f97316', moderate: '#eab308' };
    const riskFillPcts: any = { extreme: 90, very_high: 75, high: 55, moderate: 35 };
    const riskColor = riskColors[riskLevel] || '#eab308';
    const fillPct = riskFillPcts[riskLevel] || 35;
    const cards = [
      { icon: '🏥', title: 'Hospitals & Clinics', count: '12', label: 'Facilities in affected zone', risk: Math.min(fillPct + 15, 98) },
      { icon: '🏫', title: 'Schools & Colleges', count: '87', label: 'Institutions at risk', risk: Math.min(fillPct + 10, 95) },
      { icon: '👷', title: 'Outdoor Workers', count: '24,800', label: 'Persons exposed daily', risk: Math.min(fillPct + 5, 90) },
      { icon: '👴', title: 'Elderly Population', count: '13%', label: 'High-risk demographic', risk: Math.min(fillPct + 20, 99) }
    ];
    grid.innerHTML = cards.map(card => `
      <div class="risk-card">
        <div class="risk-card-icon">${card.icon}</div>
        <div class="risk-card-title">${card.title}</div>
        <div class="risk-card-count">${card.count}</div>
        <div class="risk-card-label">${card.label}</div>
        <div class="risk-level-bar">
          <div class="risk-level-fill" style="width:${card.risk}%;background:${riskColor};"></div>
        </div>
        <div style="font-size:10px;color:${riskColor};font-weight:600;margin-top:4px;">${card.risk}% risk level</div>
      </div>
    `).join('');
  }

  function renderWardVulnerability() {
    const listEl = document.getElementById('ward-vulnerability-list');
    if (!listEl) return;
    const wards = WARDS_VULNERABILITY[advisoryCityId] || WARDS_VULNERABILITY['delhi'];
    const riskColors: any = { Extreme: '#9333ea', 'Very High': '#ef4444', High: '#f97316', Moderate: '#eab308' };
    listEl.innerHTML = wards.map((ward: any) => {
      const cat = getAQICat(ward.aqi);
      const rColor = riskColors[ward.risk] || '#eab308';
      return `<div class="ward-risk-row">
        <div class="ward-risk-name">${ward.name}</div>
        <div class="ward-risk-aqi" style="color:${cat.color};">${ward.aqi}</div>
        <div style="font-size:10px;color:var(--text-muted);">🏥${ward.hospitals} 🏫${ward.schools}</div>
        <div class="ward-risk-badge" style="background:${rColor}22;color:${rColor};">${ward.risk}</div>
      </div>`;
    }).join('');
  }

  // ─── AI Chat ───────────────────────────────────────────────────────────────
  (window as any).__toggleChat = () => {
    chatDrawerOpen = !chatDrawerOpen;
    const drawer = document.getElementById('ai-chat-drawer');
    if (drawer) drawer.classList.toggle('open', chatDrawerOpen);
  };

  (window as any).__sendChatChip = (chip: string) => {
    const input = document.getElementById('ai-chat-input') as HTMLInputElement;
    if (input) { input.value = chip; }
    (window as any).__sendChatMessage();
  };

  (window as any).__sendChatMessage = async () => {
    const input = document.getElementById('ai-chat-input') as HTMLInputElement;
    const sendBtn = document.getElementById('ai-chat-send') as HTMLButtonElement;
    const messagesEl = document.getElementById('ai-chat-messages')!;
    const key = getGroqKey();
    const userMsg = input?.value?.trim();
    if (!userMsg) return;

    if (!key) {
      appendMessage('bot', 'Please connect your Groq API key first. Click the 🔑 button in the sidebar.');
      return;
    }

    input.value = '';
    if (sendBtn) sendBtn.disabled = true;
    appendMessage('user', userMsg);

    const thinkingId = 'chat-thinking-' + Date.now();
    messagesEl.insertAdjacentHTML('beforeend', `
      <div class="ai-chat-msg" id="${thinkingId}">
        <span class="ai-chat-avatar">🤖</span>
        <div class="ai-chat-bubble">
          <div class="ai-typing-dots"><span></span><span></span><span></span></div>
        </div>
      </div>
    `);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    try {
      const { response, newHistory } = await sendChatMessage(userMsg, chatHistory);
      chatHistory = newHistory;
      document.getElementById(thinkingId)?.remove();
      appendMessage('bot', response);
    } catch(e: any) {
      document.getElementById(thinkingId)?.remove();
      appendMessage('bot', e.message === 'NO_KEY' ? 'Please connect your Groq API key first.' : `Error: ${e.message}`);
    } finally {
      if (sendBtn) sendBtn.disabled = false;
    }
  };

  function appendMessage(type: 'user' | 'bot', text: string) {
    const messagesEl = document.getElementById('ai-chat-messages')!;
    const isUser = type === 'user';
    messagesEl.insertAdjacentHTML('beforeend', `
      <div class="ai-chat-msg ${isUser ? 'ai-chat-msg-user' : ''}">
        <span class="ai-chat-avatar">${isUser ? '👤' : '🤖'}</span>
        <div class="ai-chat-bubble ${isUser ? 'user-bubble' : ''}">${text}</div>
      </div>
    `);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  document.getElementById('ai-chat-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') (window as any).__sendChatMessage();
  });

  // ─── Boot Sequence ─────────────────────────────────────────────────────────
  setTimeout(async () => {
    initTicker();
    updateTimestamp();
    initCityList();
    updateDashboardStats();
    initDashboardMap();
    initPollutantChart('delhi');
    moduleInitialized['dashboard'] = true;
    initNavigation();

    // Groq badge — reflects env-var status
    const key = getGroqKey();
    const badge = document.getElementById('groq-badge-label');
    if (badge) badge.textContent = key ? '✓ Groq AI Active' : '⚠ Key Not Set';
    const dot = document.querySelector('.groq-badge-dot') as HTMLElement;
    if (dot) dot.style.background = key ? '#22c55e' : '#f97316';

    // Auto AI analyst if key exists
    if (key) renderAIAnalystPanel();
    else {
      const content = document.getElementById('ai-analyst-content');
      if (content) content.innerHTML = buildNoKeyPrompt('dashboard');
    }

    // Start real-time data fetch
    try {
      await fetchAllCitiesRealtime();
      onAirQualityUpdate();
    } catch(e) {
      console.warn('[AirSense] Initial fetch failed, using seed data:', e);
    }
    startCountdown();
  }, 2600);
}

// ─── Loader Animation ─────────────────────────────────────────────────────────
function showLoader() {
  const loader = document.getElementById('loader');
  const statusEl = document.getElementById('loader-status');
  const messages = [
    'Connecting to CAAQMS network...',
    'Loading satellite imagery...',
    'Calibrating AI attribution model...',
    'Fetching meteorological data...',
    'Initialising geospatial intelligence...'
  ];
  let i = 0;
  const interval = setInterval(() => {
    i = (i + 1) % messages.length;
    if (statusEl) statusEl.textContent = messages[i];
  }, 420);
  setTimeout(() => {
    clearInterval(interval);
    if (statusEl) statusEl.textContent = 'Ready.';
    if (loader) loader.classList.add('hidden');
    setTimeout(() => { if (loader) loader.style.display = 'none'; }, 700);
  }, 2400);
}
