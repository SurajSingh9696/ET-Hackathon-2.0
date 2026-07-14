// ─── AQI Categories ──────────────────────────────────────────────────────────
export const AQI_CATEGORIES = [
  { label: 'Good', min: 0, max: 50, color: '#22c55e', bg: 'rgba(34,197,94,0.15)' },
  { label: 'Satisfactory', min: 51, max: 100, color: '#84cc16', bg: 'rgba(132,204,22,0.15)' },
  { label: 'Moderate', min: 101, max: 200, color: '#eab308', bg: 'rgba(234,179,8,0.15)' },
  { label: 'Poor', min: 201, max: 300, color: '#f97316', bg: 'rgba(249,115,22,0.15)' },
  { label: 'Very Poor', min: 301, max: 400, color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  { label: 'Severe', min: 401, max: 9999, color: '#9333ea', bg: 'rgba(147,51,234,0.15)' }
];

export function getAQICat(aqi: number) {
  return AQI_CATEGORIES.find(c => aqi >= c.min && aqi <= c.max) || AQI_CATEGORIES[5];
}

// ─── City Data ────────────────────────────────────────────────────────────────
export const INITIAL_CITIES = [
  { id: 'delhi', name: 'Delhi', state: 'NCT of Delhi', coords: [28.6139, 77.2090] as [number,number], aqi: 218, pm25: 156.4, pm10: 234.7, no2: 89.3, so2: 34.2, o3: 45.8, co: 12.3, trend: +12, population: 32941000, area: 1484, stations: 38, activeStations: 35 },
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', coords: [19.0760, 72.8777] as [number,number], aqi: 147, pm25: 89.2, pm10: 142.6, no2: 67.4, so2: 18.9, o3: 52.3, co: 8.7, trend: -5, population: 20667656, area: 603, stations: 24, activeStations: 22 },
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', coords: [22.5726, 88.3639] as [number,number], aqi: 186, pm25: 112.8, pm10: 178.3, no2: 74.6, so2: 28.4, o3: 38.9, co: 10.2, trend: +8, population: 14850000, area: 1886, stations: 19, activeStations: 17 },
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', coords: [12.9716, 77.5946] as [number,number], aqi: 98, pm25: 52.3, pm10: 87.4, no2: 45.8, so2: 12.3, o3: 48.6, co: 5.4, trend: -3, population: 12765000, area: 741, stations: 16, activeStations: 14 },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', coords: [13.0827, 80.2707] as [number,number], aqi: 112, pm25: 64.7, pm10: 98.3, no2: 52.4, so2: 16.7, o3: 43.2, co: 6.8, trend: +2, population: 10971108, area: 1189, stations: 14, activeStations: 13 },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', coords: [17.3850, 78.4867] as [number,number], aqi: 134, pm25: 78.4, pm10: 124.6, no2: 58.3, so2: 21.4, o3: 46.7, co: 7.6, trend: -8, population: 10006000, area: 650, stations: 12, activeStations: 11 },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', coords: [18.5204, 73.8567] as [number,number], aqi: 108, pm25: 61.2, pm10: 94.7, no2: 48.6, so2: 14.8, o3: 51.2, co: 6.2, trend: +4, population: 7700000, area: 518, stations: 10, activeStations: 9 }
];

export const STATIONS = [
  { id: 's1', city: 'delhi', name: 'Anand Vihar', coords: [28.6469, 77.3151] as [number,number], aqi: 287, pm25: 198.4, pm10: 312.6 },
  { id: 's2', city: 'delhi', name: 'ITO', coords: [28.6289, 77.2411] as [number,number], aqi: 234, pm25: 164.8, pm10: 256.3 },
  { id: 's3', city: 'delhi', name: 'Dwarka Sec 8', coords: [28.5922, 77.0463] as [number,number], aqi: 198, pm25: 138.2, pm10: 218.7 },
  { id: 's4', city: 'delhi', name: 'Rohini', coords: [28.7495, 77.0664] as [number,number], aqi: 256, pm25: 178.4, pm10: 289.3 },
  { id: 's5', city: 'delhi', name: 'Lodhi Road', coords: [28.5931, 77.2210] as [number,number], aqi: 178, pm25: 112.6, pm10: 178.4 },
  { id: 's6', city: 'delhi', name: 'Okhla Phase 2', coords: [28.5355, 77.2700] as [number,number], aqi: 312, pm25: 218.9, pm10: 334.6 },
  { id: 's7', city: 'delhi', name: 'Bawana', coords: [28.7943, 77.0378] as [number,number], aqi: 268, pm25: 187.4, pm10: 298.2 },
  { id: 's8', city: 'delhi', name: 'Punjabi Bagh', coords: [28.6689, 77.1318] as [number,number], aqi: 224, pm25: 156.3, pm10: 246.8 },
  { id: 's9', city: 'mumbai', name: 'Bandra', coords: [19.0596, 72.8295] as [number,number], aqi: 142, pm25: 87.4, pm10: 138.6 },
  { id: 's10', city: 'mumbai', name: 'Andheri', coords: [19.1136, 72.8697] as [number,number], aqi: 163, pm25: 98.4, pm10: 154.2 },
  { id: 's11', city: 'mumbai', name: 'Chembur', coords: [19.0622, 72.9005] as [number,number], aqi: 189, pm25: 118.6, pm10: 182.4 },
  { id: 's12', city: 'mumbai', name: 'Colaba', coords: [18.9067, 72.8147] as [number,number], aqi: 128, pm25: 76.3, pm10: 118.9 },
  { id: 's13', city: 'mumbai', name: 'Kurla', coords: [19.0726, 72.8820] as [number,number], aqi: 156, pm25: 94.2, pm10: 148.7 },
  { id: 's14', city: 'kolkata', name: 'Ballygunge', coords: [22.5357, 88.3689] as [number,number], aqi: 179, pm25: 108.4, pm10: 172.6 },
  { id: 's15', city: 'kolkata', name: 'Jadavpur', coords: [22.4982, 88.3717] as [number,number], aqi: 198, pm25: 122.4, pm10: 192.8 },
  { id: 's16', city: 'kolkata', name: 'Rabindra Sarani', coords: [22.5726, 88.3534] as [number,number], aqi: 212, pm25: 134.6, pm10: 208.4 },
  { id: 's17', city: 'kolkata', name: 'Beliaghata', coords: [22.5674, 88.3897] as [number,number], aqi: 186, pm25: 114.8, pm10: 178.2 },
  { id: 's18', city: 'bengaluru', name: 'BTM Layout', coords: [12.9166, 77.6101] as [number,number], aqi: 104, pm25: 56.4, pm10: 92.8 },
  { id: 's19', city: 'bengaluru', name: 'Peenya', coords: [13.0244, 77.5183] as [number,number], aqi: 132, pm25: 78.4, pm10: 124.6 },
  { id: 's20', city: 'bengaluru', name: 'Silk Board', coords: [12.9174, 77.6228] as [number,number], aqi: 118, pm25: 68.2, pm10: 104.8 },
  { id: 's21', city: 'bengaluru', name: 'Hebbal', coords: [13.0358, 77.5971] as [number,number], aqi: 88, pm25: 46.4, pm10: 78.6 },
  { id: 's22', city: 'chennai', name: 'Alandur', coords: [13.0006, 80.2065] as [number,number], aqi: 124, pm25: 72.4, pm10: 112.8 },
  { id: 's23', city: 'chennai', name: 'Manali', coords: [13.1728, 80.2560] as [number,number], aqi: 142, pm25: 84.6, pm10: 128.4 },
  { id: 's24', city: 'chennai', name: 'T. Nagar', coords: [13.0418, 80.2341] as [number,number], aqi: 108, pm25: 62.8, pm10: 96.4 },
  { id: 's25', city: 'hyderabad', name: 'Nacharam', coords: [17.4062, 78.5567] as [number,number], aqi: 156, pm25: 92.4, pm10: 148.6 },
  { id: 's26', city: 'hyderabad', name: 'Sanathnagar', coords: [17.4500, 78.4300] as [number,number], aqi: 128, pm25: 74.8, pm10: 118.4 },
  { id: 's27', city: 'hyderabad', name: 'Bollaram', coords: [17.4900, 78.3800] as [number,number], aqi: 118, pm25: 68.4, pm10: 108.6 },
  { id: 's28', city: 'pune', name: 'Hadapsar', coords: [18.5089, 73.9258] as [number,number], aqi: 124, pm25: 72.6, pm10: 112.4 },
  { id: 's29', city: 'pune', name: 'Pimpri', coords: [18.6298, 73.7997] as [number,number], aqi: 132, pm25: 76.8, pm10: 118.6 },
  { id: 's30', city: 'pune', name: 'Shivajinagar', coords: [18.5308, 73.8474] as [number,number], aqi: 94, pm25: 52.4, pm10: 84.2 }
];

export function seededRandom(seed: number) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export function generateHistoricalData(baseAqi: number, cityId: string) {
  const rand = seededRandom(baseAqi * 17 + cityId.charCodeAt(0));
  const data: any[] = [];
  let current = baseAqi;
  const today = new Date('2026-07-09');
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const variation = (rand() - 0.46) * 32;
    current = Math.max(25, Math.min(420, current + variation));
    const aqi = Math.round(current);
    data.push({
      date: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      aqi,
      pm25: Math.round(aqi * 0.69 * 10) / 10,
      pm10: Math.round(aqi * 1.07 * 10) / 10
    });
  }
  return data;
}

export function generateForecastData(currentAqi: number, cityId: string) {
  const rand = seededRandom(currentAqi * 31 + cityId.charCodeAt(1));
  const data: any[] = [];
  let current = currentAqi;
  const now = new Date('2026-07-09T11:00:00');
  for (let i = 0; i <= 72; i += 3) {
    const time = new Date(now);
    time.setHours(time.getHours() + i);
    const hour = time.getHours();
    const nightBias = (hour >= 22 || hour <= 6) ? 18 : 0;
    const dayBias = (hour >= 10 && hour <= 17) ? -12 : 0;
    const variation = (rand() - 0.46) * 18 + nightBias + dayBias;
    current = Math.max(25, Math.min(420, current + variation));
    const label = i === 0 ? 'Now' : (i % 24 === 0 ? `Day ${i / 24}` : `+${i}h`);
    data.push({
      hour: i, label,
      aqi: Math.round(current),
      pm25: Math.round(current * 0.68 * 10) / 10,
      temperature: Math.round(28 + Math.sin(i * 0.26) * 7),
      humidity: Math.round(62 + Math.sin(i * 0.26 + 1.6) * 16),
      windSpeed: Math.round((5 + rand() * 9) * 10) / 10,
      visibility: Math.round((8 - current / 80) * 10) / 10
    });
  }
  return data;
}

export function generateHeatmapPoints(cityId: string) {
  const cityStations = STATIONS.filter(s => s.city === cityId);
  const points: [number, number, number][] = [];
  cityStations.forEach(station => {
    const weight = Math.min(station.aqi / 350, 1.0);
    const count = Math.floor(weight * 20) + 5;
    for (let i = 0; i < count; i++) {
      points.push([
        station.coords[0] + (Math.random() - 0.5) * 0.12,
        station.coords[1] + (Math.random() - 0.5) * 0.12,
        weight
      ]);
    }
  });
  return points;
}

export const SOURCE_ATTRIBUTION: Record<string, any> = {
  delhi: {
    sources: [
      { name: 'Vehicles & Traffic', value: 38, color: '#ef4444' },
      { name: 'Industrial Stacks', value: 26, color: '#f97316' },
      { name: 'Construction Dust', value: 18, color: '#eab308' },
      { name: 'Waste Burning', value: 12, color: '#9333ea' },
      { name: 'Other', value: 6, color: '#6366f1' }
    ],
    wards: [
      { name: 'Anand Vihar', aqi: 287, topSource: 'Vehicles', contribution: 52, confidence: 91 },
      { name: 'Okhla Phase 2', aqi: 312, topSource: 'Industrial', contribution: 48, confidence: 87 },
      { name: 'Bawana', aqi: 268, topSource: 'Industrial', contribution: 44, confidence: 84 },
      { name: 'Rohini', aqi: 256, topSource: 'Construction', contribution: 38, confidence: 79 },
      { name: 'Punjabi Bagh', aqi: 224, topSource: 'Vehicles', contribution: 46, confidence: 82 }
    ]
  },
  mumbai: {
    sources: [
      { name: 'Vehicles & Traffic', value: 42, color: '#ef4444' },
      { name: 'Industrial Stacks', value: 22, color: '#f97316' },
      { name: 'Construction Dust', value: 16, color: '#eab308' },
      { name: 'Waste Burning', value: 8, color: '#9333ea' },
      { name: 'Other', value: 12, color: '#6366f1' }
    ],
    wards: [
      { name: 'Chembur', aqi: 189, topSource: 'Industrial', contribution: 44, confidence: 88 },
      { name: 'Andheri East', aqi: 163, topSource: 'Vehicles', contribution: 48, confidence: 86 },
      { name: 'Kurla', aqi: 156, topSource: 'Vehicles', contribution: 42, confidence: 83 },
      { name: 'Bandra East', aqi: 142, topSource: 'Vehicles', contribution: 38, confidence: 81 },
      { name: 'Dharavi', aqi: 178, topSource: 'Industrial', contribution: 46, confidence: 85 }
    ]
  },
  kolkata: {
    sources: [
      { name: 'Vehicles & Traffic', value: 34, color: '#ef4444' },
      { name: 'Industrial Stacks', value: 28, color: '#f97316' },
      { name: 'Construction Dust', value: 16, color: '#eab308' },
      { name: 'Waste Burning', value: 16, color: '#9333ea' },
      { name: 'Other', value: 6, color: '#6366f1' }
    ],
    wards: [
      { name: 'Rabindra Sarani', aqi: 212, topSource: 'Vehicles', contribution: 44, confidence: 83 },
      { name: 'Beliaghata', aqi: 186, topSource: 'Waste Burning', contribution: 38, confidence: 76 },
      { name: 'Jadavpur', aqi: 198, topSource: 'Industrial', contribution: 41, confidence: 80 },
      { name: 'Tangra', aqi: 228, topSource: 'Industrial', contribution: 52, confidence: 89 },
      { name: 'Ballygunge', aqi: 179, topSource: 'Vehicles', contribution: 36, confidence: 77 }
    ]
  },
  bengaluru: {
    sources: [
      { name: 'Vehicles & Traffic', value: 48, color: '#ef4444' },
      { name: 'Industrial Stacks', value: 18, color: '#f97316' },
      { name: 'Construction Dust', value: 22, color: '#eab308' },
      { name: 'Waste Burning', value: 6, color: '#9333ea' },
      { name: 'Other', value: 6, color: '#6366f1' }
    ],
    wards: [
      { name: 'Peenya', aqi: 132, topSource: 'Industrial', contribution: 46, confidence: 85 },
      { name: 'BTM Layout', aqi: 104, topSource: 'Vehicles', contribution: 52, confidence: 88 },
      { name: 'Silk Board', aqi: 118, topSource: 'Vehicles', contribution: 48, confidence: 86 },
      { name: 'Hebbal', aqi: 88, topSource: 'Vehicles', contribution: 44, confidence: 82 },
      { name: 'Whitefield', aqi: 96, topSource: 'Construction', contribution: 38, confidence: 79 }
    ]
  },
  chennai: {
    sources: [
      { name: 'Vehicles & Traffic', value: 44, color: '#ef4444' },
      { name: 'Industrial Stacks', value: 24, color: '#f97316' },
      { name: 'Construction Dust', value: 14, color: '#eab308' },
      { name: 'Waste Burning', value: 10, color: '#9333ea' },
      { name: 'Other', value: 8, color: '#6366f1' }
    ],
    wards: [
      { name: 'Manali', aqi: 142, topSource: 'Industrial', contribution: 56, confidence: 92 },
      { name: 'Alandur', aqi: 124, topSource: 'Vehicles', contribution: 44, confidence: 84 },
      { name: 'T. Nagar', aqi: 108, topSource: 'Vehicles', contribution: 48, confidence: 87 },
      { name: 'Royapuram', aqi: 118, topSource: 'Industrial', contribution: 42, confidence: 81 },
      { name: 'Ambattur', aqi: 132, topSource: 'Industrial', contribution: 48, confidence: 85 }
    ]
  },
  hyderabad: {
    sources: [
      { name: 'Vehicles & Traffic', value: 40, color: '#ef4444' },
      { name: 'Industrial Stacks', value: 24, color: '#f97316' },
      { name: 'Construction Dust', value: 20, color: '#eab308' },
      { name: 'Waste Burning', value: 9, color: '#9333ea' },
      { name: 'Other', value: 7, color: '#6366f1' }
    ],
    wards: [
      { name: 'Nacharam', aqi: 156, topSource: 'Industrial', contribution: 48, confidence: 86 },
      { name: 'Sanathnagar', aqi: 128, topSource: 'Vehicles', contribution: 44, confidence: 83 },
      { name: 'Bollaram', aqi: 118, topSource: 'Industrial', contribution: 42, confidence: 80 },
      { name: 'Uppal', aqi: 144, topSource: 'Industrial', contribution: 46, confidence: 84 },
      { name: 'HITEC City', aqi: 112, topSource: 'Vehicles', contribution: 50, confidence: 88 }
    ]
  },
  pune: {
    sources: [
      { name: 'Vehicles & Traffic', value: 45, color: '#ef4444' },
      { name: 'Industrial Stacks', value: 20, color: '#f97316' },
      { name: 'Construction Dust', value: 22, color: '#eab308' },
      { name: 'Waste Burning', value: 7, color: '#9333ea' },
      { name: 'Other', value: 6, color: '#6366f1' }
    ],
    wards: [
      { name: 'Pimpri', aqi: 132, topSource: 'Industrial', contribution: 44, confidence: 84 },
      { name: 'Hadapsar', aqi: 124, topSource: 'Vehicles', contribution: 48, confidence: 86 },
      { name: 'Shivajinagar', aqi: 94, topSource: 'Vehicles', contribution: 52, confidence: 89 },
      { name: 'Chinchwad', aqi: 118, topSource: 'Industrial', contribution: 42, confidence: 82 },
      { name: 'Katraj', aqi: 108, topSource: 'Vehicles', contribution: 46, confidence: 83 }
    ]
  }
};

export const ENFORCEMENT_HOTSPOTS = [
  { id: 'e1', city: 'delhi', name: 'Anand Vihar Bus Terminal', coords: [28.6469, 77.3151] as [number,number], sourceType: 'Vehicle Emissions', sourceIcon: '🚌', priority: 'Critical', aqi: 287, status: 'Active', action: 'Deploy emission testing unit immediately', assignedTo: 'DPCC Team Alpha', dueDate: '2026-07-10', registered: true, violations: 14, lastInspected: '2026-06-28' },
  { id: 'e2', city: 'delhi', name: 'Okhla Industrial Zone', coords: [28.5355, 77.2700] as [number,number], sourceType: 'Industrial Emission', sourceIcon: '🏭', priority: 'Critical', aqi: 312, status: 'Active', action: 'Conduct emergency stack emission audit', assignedTo: 'CPCB Inspector', dueDate: '2026-07-09', registered: true, violations: 22, lastInspected: '2026-06-15' },
  { id: 'e3', city: 'delhi', name: 'Bawana Industrial Area', coords: [28.7943, 77.0378] as [number,number], sourceType: 'Industrial Emission', sourceIcon: '🏭', priority: 'High', aqi: 268, status: 'Under Review', action: 'Issue production halt notice', assignedTo: 'DPCC Team Beta', dueDate: '2026-07-12', registered: true, violations: 18, lastInspected: '2026-06-30' },
  { id: 'e4', city: 'delhi', name: 'Seemapuri Construction Site', coords: [28.7049, 77.3090] as [number,number], sourceType: 'Construction Dust', sourceIcon: '🏗️', priority: 'High', aqi: 241, status: 'Active', action: 'Enforce dust suppression barriers', assignedTo: 'MCD Enforcement', dueDate: '2026-07-11', registered: false, violations: 7, lastInspected: '2026-07-01' },
  { id: 'e5', city: 'delhi', name: 'Badarpur Waste Dump', coords: [28.5000, 77.3000] as [number,number], sourceType: 'Waste Burning', sourceIcon: '🔥', priority: 'High', aqi: 258, status: 'Active', action: 'Immediate fire suppression and fencing', assignedTo: 'SDMC Team', dueDate: '2026-07-10', registered: false, violations: 5, lastInspected: '2026-07-04' },
  { id: 'e6', city: 'mumbai', name: 'Dharavi Industrial Cluster', coords: [19.0406, 72.8520] as [number,number], sourceType: 'Industrial Emission', sourceIcon: '🏭', priority: 'High', aqi: 198, status: 'Active', action: 'Surprise inspection — no prior notice', assignedTo: 'MPCB Team A', dueDate: '2026-07-10', registered: true, violations: 11, lastInspected: '2026-06-25' },
  { id: 'e7', city: 'mumbai', name: 'Turbhe MIDC', coords: [19.0758, 73.0282] as [number,number], sourceType: 'Industrial Emission', sourceIcon: '🏭', priority: 'Medium', aqi: 172, status: 'Monitoring', action: 'Enhanced continuous monitoring', assignedTo: 'MPCB Team B', dueDate: '2026-07-15', registered: true, violations: 6, lastInspected: '2026-07-02' },
  { id: 'e8', city: 'kolkata', name: 'Tangra Industrial Area', coords: [22.5619, 88.3904] as [number,number], sourceType: 'Industrial Emission', sourceIcon: '🏭', priority: 'High', aqi: 228, status: 'Active', action: 'Effluent treatment & stack audit', assignedTo: 'WBPCB Team', dueDate: '2026-07-11', registered: true, violations: 9, lastInspected: '2026-06-28' },
  { id: 'e9', city: 'kolkata', name: 'Belgachia Waste Site', coords: [22.6034, 88.3728] as [number,number], sourceType: 'Waste Burning', sourceIcon: '🔥', priority: 'Critical', aqi: 246, status: 'Active', action: 'Immediate stop-work order & FIR', assignedTo: 'KMC Enforcement', dueDate: '2026-07-09', registered: false, violations: 3, lastInspected: '2026-07-05' },
  { id: 'e10', city: 'chennai', name: 'Manali Refinery Zone', coords: [13.1728, 80.2560] as [number,number], sourceType: 'Industrial Emission', sourceIcon: '🏭', priority: 'Critical', aqi: 142, status: 'Active', action: 'Emergency stack audit — TNPCB directive', assignedTo: 'TNPCB Team A', dueDate: '2026-07-10', registered: true, violations: 16, lastInspected: '2026-06-20' },
  { id: 'e11', city: 'bengaluru', name: 'Peenya Industrial Estate', coords: [13.0244, 77.5183] as [number,number], sourceType: 'Industrial Emission', sourceIcon: '🏭', priority: 'Medium', aqi: 132, status: 'Monitoring', action: 'Scheduled quarterly inspection', assignedTo: 'KSPCB Team', dueDate: '2026-07-20', registered: true, violations: 4, lastInspected: '2026-07-01' },
  { id: 'e12', city: 'hyderabad', name: 'Nacharam MIDC', coords: [17.4062, 78.5567] as [number,number], sourceType: 'Industrial Emission', sourceIcon: '🏭', priority: 'High', aqi: 156, status: 'Active', action: 'Stack emission parameter verification', assignedTo: 'TSPCB Team', dueDate: '2026-07-13', registered: true, violations: 8, lastInspected: '2026-06-26' }
];

export const WARDS_VULNERABILITY: Record<string, any[]> = {
  delhi: [
    { name: 'Okhla', aqi: 312, hospitals: 2, schools: 5, elderlyPct: 9, outdoorWorkers: 3200, risk: 'Extreme' },
    { name: 'Anand Vihar', aqi: 287, hospitals: 3, schools: 8, elderlyPct: 12, outdoorWorkers: 2400, risk: 'Very High' },
    { name: 'Bawana', aqi: 268, hospitals: 1, schools: 6, elderlyPct: 11, outdoorWorkers: 1800, risk: 'Very High' },
    { name: 'Rohini', aqi: 256, hospitals: 4, schools: 12, elderlyPct: 14, outdoorWorkers: 1400, risk: 'High' },
    { name: 'Punjabi Bagh', aqi: 224, hospitals: 5, schools: 9, elderlyPct: 16, outdoorWorkers: 980, risk: 'High' },
    { name: 'Dwarka', aqi: 198, hospitals: 3, schools: 14, elderlyPct: 12, outdoorWorkers: 1100, risk: 'High' },
    { name: 'Lodhi Road', aqi: 178, hospitals: 6, schools: 7, elderlyPct: 13, outdoorWorkers: 640, risk: 'Moderate' }
  ]
};

export const ADVISORIES: Record<string, Record<string, string>> = {
  english: {
    extreme: 'EXTREME AIR QUALITY ALERT — AQI exceeds 300. Avoid all outdoor activities. Schools and outdoor recreational facilities must close immediately. People with respiratory and cardiac conditions, elderly citizens, and children must remain indoors with windows sealed. Use N95/P100 respirators if outdoor exposure is unavoidable.',
    very_high: 'SEVERE AIR QUALITY WARNING — AQI between 200–300. Minimise all outdoor activities. Vulnerable groups (children, elderly, people with asthma or heart disease) must stay indoors. All others should limit outdoor exertion to essentials only. Wear N95 masks outdoors.',
    high: 'HIGH POLLUTION ADVISORY — AQI between 150–200. Reduce prolonged outdoor activities. Sensitive individuals should avoid strenuous outdoor exercise. Consider wearing masks when outdoors. Keep windows closed during peak traffic hours (8–10 AM, 6–9 PM).',
    moderate: 'MODERATE AIR QUALITY — AQI between 100–150. Air quality is currently acceptable. Sensitive individuals may experience minor respiratory discomfort. Limit extended outdoor exertion. Monitor AQI updates regularly via official CPCB channels.'
  },
  hindi: {
    extreme: 'अत्यंत वायु प्रदूषण चेतावनी — AQI 300 से अधिक। सभी बाहरी गतिविधियों से तुरंत बचें। स्कूल और बाहरी मनोरंजन स्थल तत्काल बंद होने चाहिए। श्वसन और हृदय रोगियों, वृद्धों और बच्चों को खिड़कियां बंद करके घर के अंदर रहना अनिवार्य है। अपरिहार्य स्थिति में N95 मास्क पहनें।',
    very_high: 'गंभीर वायु प्रदूषण चेतावनी — AQI 200-300। बाहरी गतिविधियां न्यूनतम करें। कमजोर वर्ग — बच्चे, बुजुर्ग, अस्थमा और हृदय रोगी — घर के अंदर रहें। बाहर जाने पर N95 मास्क अवश्य पहनें।',
    high: 'उच्च प्रदूषण सलाह — AQI 150-200। लंबी बाहरी गतिविधियां कम करें। संवेदनशील व्यक्ति कठोर व्यायाम से बचें। बाहर जाते समय मास्क पहनें। व्यस्त यातायात समय में खिड़कियां बंद रखें।',
    moderate: 'मध्यम वायु गुणवत्ता — AQI 100-150। वायु गुणवत्ता स्वीकार्य है। CPCB पोर्टल पर नियमित रूप से AQI अपडेट देखते रहें।'
  },
  kannada: {
    extreme: 'ತೀವ್ರ ವಾಯು ಮಾಲಿನ್ಯ ಎಚ್ಚರಿಕೆ — AQI 300 ಮೀರಿದೆ. ಎಲ್ಲಾ ಹೊರಾಂಗಣ ಚಟುವಟಿಕೆಗಳನ್ನು ತಕ್ಷಣ ನಿಲ್ಲಿಸಿ. ಶ್ವಾಸಕೋಶ ಮತ್ತು ಹೃದಯ ಸಮಸ್ಯೆಗಳಿರುವವರು, ಹಿರಿಯ ನಾಗರಿಕರು ಮತ್ತು ಮಕ್ಕಳು ಮನೆಯಲ್ಲೇ ಇರಬೇಕು.',
    very_high: 'ತೀವ್ರ ವಾಯು ಮಾಲಿನ್ಯ ಎಚ್ಚರಿಕೆ — AQI 200-300. ಹೊರಾಂಗಣ ಚಟುವಟಿಕೆಗಳನ್ನು ಕಡಿಮೆ ಮಾಡಿ. ದುರ್ಬಲ ವರ್ಗಗಳು ಮನೆಯಲ್ಲೇ ಉಳಿಯಬೇಕು. ಹೊರಗೆ ಹೋಗುವಾಗ N95 ಮಾಸ್ಕ್ ಧರಿಸಿ.',
    high: 'ಹೆಚ್ಚಿನ ಮಾಲಿನ್ಯ ಸಲಹೆ — AQI 150-200. ದೀರ್ಘ ಹೊರಾಂಗಣ ಚಟುವಟಿಕೆಗಳನ್ನು ಕಡಿಮೆ ಮಾಡಿ. ಸೂಕ್ಷ್ಮ ವ್ಯಕ್ತಿಗಳು ತೀವ್ರ ವ್ಯಾಯಾಮ ತಪ್ಪಿಸಬೇಕು.',
    moderate: 'ಮಧ್ಯಮ ವಾಯು ಗುಣಮಟ್ಟ — AQI 100-150. CPCB ಪೋರ್ಟಲ್ ಮೂಲಕ AQI ನವೀಕರಣಗಳನ್ನು ನಿಯಮಿತವಾಗಿ ಪರಿಶೀಲಿಸಿ.'
  },
  tamil: {
    extreme: 'மிகவும் மோசமான காற்று தர எச்சரிக்கை — AQI 300ஐ தாண்டியுள்ளது. அனைத்து வெளி நடவடிக்கைகளையும் உடனடியாக நிறுத்துங்கள். சுவாசம் மற்றும் இதய நோயாளிகள், முதியோர் மற்றும் குழந்தைகள் வீட்டிலேயே இருக்க வேண்டும்.',
    very_high: 'கடுமையான காற்று மாசு எச்சரிக்கை — AQI 200-300. வெளி நடவடிக்கைகளைக் குறைக்கவும். பாதிக்கப்படக்கூடிய குழுக்கள் வீட்டிலேயே இருக்க வேண்டும். வெளியில் செல்லும்போது N95 முகக்கவசம் அணியவும்.',
    high: 'அதிக மாசு ஆலோசனை — AQI 150-200. நீண்ட வெளி நடவடிக்கைகளைக் குறைக்கவும். உணர்திறன் உடையவர்கள் கடுமையான உடற்பயிற்சியைத் தவிர்க்கவும்.',
    moderate: 'மிதமான காற்று தரம் — AQI 100-150. காற்று தரம் ஏற்றுக்கொள்ளக்கூடியதாக உள்ளது. CPCB போர்டல் வழியாக AQI புதுப்பிப்புகளை தொடர்ந்து கண்காணிக்கவும்.'
  }
};

export function getAdvisoryLevel(aqi: number) {
  if (aqi > 300) return 'extreme';
  if (aqi > 200) return 'very_high';
  if (aqi > 150) return 'high';
  return 'moderate';
}

export const CITY_COLORS_CHART = ['#00d4b8', '#6366f1', '#f59e0b', '#22c55e', '#ef4444', '#ec4899', '#0ea5e9'];
