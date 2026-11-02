import './globals.css';

export const viewport = {
  themeColor: '#0F172A',
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: 'Tourist Assist | Nashik Kumbh Mela 2027 & Smart Tourism Discovery',
  description: 'QR-based tourist information and essential facility platform for Nashik Kumbh Mela 2027 and Nashik tourism. Discover sacred destinations, locate verified emergency care, Sulabh sanitation, drinking water, and local opportunities.',
  icons: {
    icon: '/favicon.svg',
    apple: '/icons/icon-192.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="bg-background text-primaryText antialiased selection:bg-cyan-electric selection:text-slate-900 font-sans">
        {children}
      </body>
    </html>
  );
}
