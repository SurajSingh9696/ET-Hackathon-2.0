# AirSense IQ

<p align="center">
  <img src="./weather.png" alt="AirSense IQ logo" width="220" />
</p>

<p align="center">
  <strong>Urban Air Quality Intelligence Platform for Smart City Intervention</strong>
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-14.2.5-000000?logo=nextdotjs&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" />
  <img alt="AQI" src="https://img.shields.io/badge/AQI-Real%20Time-22c55e" />
  <img alt="Smart City" src="https://img.shields.io/badge/Smart%20City-Intervention-0ea5e9" />
</p>

AirSense IQ is an AI-powered air quality intelligence dashboard designed for cities to monitor, predict, and respond to pollution risk in real time. The platform brings together live AQI data, source attribution, forecast modeling, compliance tracking, and public-health advisory into one operational view for urban decision-makers.

## Why it matters

Air pollution is one of the most urgent urban challenges facing growing cities today. AirSense IQ helps authorities move from reactive monitoring to proactive intervention by combining environmental sensing, geographic intelligence, and predictive AI insights across major Indian metros.

## Key features

- Live AQI monitoring across multiple Indian cities and CAAQMS stations
- Interactive geospatial dashboard with station-level heat mapping and city-wise comparisons
- AI-driven source attribution for identifying likely pollution drivers
- Short-term AQI forecasting for planning interventions and public communication
- Enforcement intelligence to highlight high-risk clusters and compliance hotspots
- Health advisory layers for vulnerable groups and public safety communication
- City-to-city benchmarking to prioritize policy and operational response

## Dashboard modules

The application includes a modern decision-support interface with:

- Live AQI Dashboard
- Source Attribution
- AQI Forecast
- Enforcement Intel
- City Comparison
- Health Advisory

## Technology stack

- Next.js 14
- React + TypeScript
- Tailwind-style component architecture
- Leaflet for map visualization
- Chart.js for trend analysis
- CPCB CAAQMS and Open-Meteo-inspired environmental data flows
- AI-assisted intelligence layer for contextual recommendations

## Project structure

```text
.
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── ...
├── public/
├── package.json
├── next.config.mjs
├── tsconfig.json
├── weather.png
├── README.md
└── .gitignore
```

## Getting started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Data and intelligence model

AirSense IQ is designed around environmental monitoring and operational intelligence by combining:

- Continuous city-level AQI data
- Station-level pollution observations
- Geographic concentration patterns
- Forecasting and anomaly detection
- AI-generated decision support for smart-city actions

## Use cases

- Urban air quality monitoring for civic agencies
- Identifying pollution hotspots and source clusters
- Prioritizing traffic, construction, and industrial interventions
- Proactive public alerts during elevated AQI periods
- Trend analysis for policy and sustainability planning

## Why this project stands out

This platform is built to support the transition from passive monitoring to intelligent city action. Instead of displaying only pollution numbers, it turns environmental data into operational guidance for interventions that protect health, reduce exposure, and improve urban resilience.

## License

This project is for hackathon and demonstration use. Please check the repository owner or organization guidelines for production deployment and reuse policies.

## Acknowledgements

- CPCB CAAQMS network
- Open-Meteo environmental data sources
- Sentinel-5P and MODIS-inspired satellite context
- Groq LLaMA 3.3 model integration for AI intelligence

---

<p align="center">
  <em>Built for smarter, cleaner, healthier cities.</em>
</p>
