import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "AirSense IQ — Urban Air Quality Intelligence Platform",
  description:
    "AirSense IQ — AI-powered Urban Air Quality Intelligence Platform for Smart City Intervention. Real-time AQI monitoring, predictive forecasting, source attribution, and enforcement intelligence across Indian cities.",
  keywords:
    "AQI, air quality, India, smart city, pollution monitoring, CAAQMS, CPCB, environmental intelligence",
  openGraph: {
    title: "AirSense IQ — Urban Air Quality Intelligence",
    description:
      "AI-powered platform for proactive air quality intervention across Indian cities",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
        <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
      </head>
      <body>
        {children}
        {/* External libraries loaded via CDN for SSR compatibility */}
        <Script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/leaflet.heat@0.2.0/dist/leaflet-heat.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
