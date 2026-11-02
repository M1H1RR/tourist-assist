# Tourist Assist

**A QR-Based Tourist Information and Essential Facility Platform for Nashik Kumbh Mela 2027 and Nashik Tourism**

*Explore. Discover. Stay Safe.*

---

## 1. Project Overview & Problem Statement

### Problem Statement
During large-scale pilgrimage gatherings such as the **Nashik Maha Kumbh Mela 2027**, millions of pilgrims and tourists face acute logistical and navigation challenges:
- Difficulty locating immediate essential facilities (drinking water, clean public toilets, first aid, police booths, parking) near sacred ghats.
- Inaccurate, conflicting, or unverified information circulating online or via word-of-mouth.
- Congested physical surroundings where traditional signboards are obscured by crowds.
- Overlapping locations where multiple essential amenities are situated within close proximity without clear geospatial distinction.

### Project Objective
**Tourist Assist** addresses these critical challenges through a mobile-first, high-performance web platform accessible instantly via physical on-ground QR code signage stationed across Nashik's key sectors. The platform provides:
1. **Destination-Wise Nearby Essential Facilities**: When a visitor selects a sacred sight (e.g. Sita Gufa, Ramkund, Kalaram Mandir, Trimbakeshwar), the system automatically scans and presents verified nearby amenities within a configurable straight-line radius ($500\text{ m}$, $1\text{ km}$, $2\text{ km}$, $5\text{ km}$).
2. **Interactive Geospatial Proximity Map**: Visual mapping powered by standard OpenStreetMap tiles with dynamic marker clustering, radius boundary circles, and category-coded pins.
3. **Data Provenance & Integrity**: Explicit verification labeling (`Verified Record`, `Verification Pending`, `Needs Verification`) backed by official municipal and police records.
4. **Zero-App-Install QR Touchpoints**: Instant camera-based QR code access on standard smartphones without requiring native mobile application downloads.

---

## 2. Academic Context

- **Academic Program:** Community Engagement Project (CEP), Academic Year 2026–27
- **Institution:** Government College of Engineering & Research, Avasari (Kh.), Pune District, Maharashtra, India
- **Department:** Department of Computer Engineering
- **Focus Area:** Smart City Public Systems, Disaster Preparedness & Heritage Tourism Technology

---

## 3. Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 14 (App Router) with React 18 |
| **Language** | JavaScript (ES6+ / JSX) |
| **Styling** | Tailwind CSS with Glassmorphism Design System |
| **Animation** | Framer Motion (page transitions, spring physics, ambient glows) |
| **Icons** | Lucide React |
| **Mapping Engine** | Leaflet with standard OpenStreetMap tiles & dynamic marker clustering |
| **Database & Auth** | Supabase (PostgreSQL with Row Level Security and RPC functions) + Resilient Local Dataset Fallback |
| **Deployment** | Vercel Serverless Platform |

---

## 4. Key Features

### A. Destination-Wise Nearby Essential Facilities
- Covers **10 Core Nashik Destinations**:
  1. Sita Gufa & Panch Vruksha, Panchavati
  2. Ramkund & Sacred Godavari Ghats, Panchavati
  3. Shree Kalaram Mandir, Panchavati
  4. Tapovan & Lakshman Kund, Nashik
  5. Pandavleni Buddhist Caves, Nashik
  6. Trimbakeshwar Jyotirlinga Mandir, Trimbak
  7. Anjaneri Hills & Fort (Hanuman Janmabhoomi)
  8. Someshwar Temple & Dudhsagar Waterfall
  9. Gangapur Dam & Backwaters
  10. Muktidham Marble Temple, Nashik Road
- **12 Essential Facility Categories**: Hospitals, First Aid, Police, Lost & Found, Public Toilets, Drinking Water (RO), Parking, Bus Stops, Auto Stands, Satvik Dining, Accommodation, Tourist Information.
- **Dynamic Haversine Calculation**: Straight-line distance computed dynamically from the destination coordinates.
- **Contextual Status Engine**:
  - `FOUND NEARBY`: Facilities found inside the selected radius.
  - `NOT FOUND IN DATABASE`: Transparently explains that no municipal records currently exist within the selected radius while displaying the nearest available facility across the district.
  - `NEEDS VERIFICATION`: Highlights unverified community leads.

### B. Interactive Leaflet Proximity Map
- OpenStreetMap standard tiles (`https://tile.openstreetmap.org/{z}/{x}/{y}.png`) with official attribution and zero CARTO API watermarks.
- Visual circular boundary matching the selected radius ($500\text{ m}$ to $5\text{ km}$).
- Distinct custom vector icons and colors for each facility category.
- Marker clustering at lower zoom levels and automatic spiderfying on high zoom to prevent overlapping pins.
- One-click "Reset to Destination" and "Night Tone" filter toggles.

### C. Physical QR Signage Integration
- Simulation of physical weather-proof QR posters stationed at transit terminals, parking grounds, and river ghats.
- Instant deep-linking to destination facility dashboards (`/destination/[slug]`).

### D. Optional "Use My Current Location" (GPS)
- Browser-based geolocation permission allows visitors to compare distances from their current physical location against destination coordinates.

### E. Administrative Facility Management
- Passkey-protected admin panel (`AdminFacilityModal.jsx`) allowing authorized municipal coordinators to add, edit, verify, or deactivate facility records with local and Supabase synchronization.

---

## 5. Project Architecture

```
tourist-assist/
├── app/
│   ├── layout.jsx                     # Root HTML layout, font preconnects, metadata & viewport
│   ├── page.jsx                       # Main homepage composition
│   ├── not-found.jsx                  # Custom 404 error page
│   ├── globals.css                    # Tailwind CSS directives, dark mode tokens & Leaflet custom styles
│   └── destination/
│       ├── page.jsx                   # Redirect to default destination
│       └── [slug]/
│           └── page.jsx               # Destination Details & Nearby Facilities Hub
├── components/
│   ├── Navbar.jsx                     # Glassmorphic navbar with multilingual switcher & emergency bar
│   ├── Hero.jsx                       # Cinematic full-screen Ramkund background with ambient lighting
│   ├── KumbhSection.jsx               # Maha Kumbh Mela 2027 essential dates & ceremonial bathing rituals
│   ├── DestinationGrid.jsx            # Heritage destination grid with category filters
│   ├── DestinationCard.jsx            # Individual destination card with "Nearby Facilities" CTA
│   ├── DestinationHeader.jsx          # Destination details header with switcher & GPS button
│   ├── NearbyFacilitiesDashboard.jsx  # 12-category dashboard with status badges & counts
│   ├── FacilityCategoryCard.jsx       # Individual category summary card
│   ├── FacilityFilters.jsx            # Category filter chips, sorting dropdown & text search
│   ├── FacilityList.jsx               # Responsive list of facility cards & empty state renderer
│   ├── FacilityCard.jsx               # Detailed card with dynamic distance, directions & phone dialer
│   ├── NearbyFacilitiesMap.jsx        # Leaflet map with radius circle, clustering & popups
│   ├── InteractiveMap.jsx             # Citywide interactive geospatial guide
│   ├── RadiusSelector.jsx             # Radius selector (500m, 1km, 2km, 5km)
│   ├── VerificationBadge.jsx          # Verified / Pending / Unverified status tag
│   ├── EmptyState.jsx                 # User-friendly radius empty state with nearest fallback
│   ├── AdminFacilityModal.jsx         # Administrative facility creation & management modal
│   ├── FacilitySection.jsx            # Homepage essential facilities directory
│   ├── QRAssistance.jsx               # Physical QR code demonstration lab & phone simulator
│   ├── EmergencySection.jsx           # 24/7 emergency helplines & ambulance dispatch
│   ├── LocalConnect.jsx               # Community e-rickshaws, satvik dining & artisan showcase
│   ├── Footer.jsx                     # Academic attribution, disclaimers & quick links
│   └── AIAssistant.jsx                # Intelligent tourist guidance assistant
├── lib/
│   ├── facilitiesService.jsx          # Facilities business logic, Haversine formula & Supabase layer
│   ├── data.jsx                       # Authentic Nashik destinations, facilities & QR hubs
│   ├── supabase.jsx                   # Supabase client initializer & config validator
│   └── animations.jsx                 # Framer Motion animation variants
├── supabase/
│   └── schema_nearby_facilities.sql   # SQL tables, indexes, RLS policies, RPC function & seed data
├── public/
│   ├── assets/                        # Authentic photography of Ramkund, Trimbak, Kalaram & logos
│   └── favicon.svg                    # Vector brand favicon
├── .env.example                       # Safe environment variable template
├── tailwind.config.js                 # Design tokens (cyan-electric, coral-neon, saffron, gold)
├── next.config.js                     # Next.js production configuration
└── package.json                       # Dependencies & build scripts
```

---

## 6. Installation & Local Development

### Prerequisites
- Node.js version 18.17.0 or higher (Node 20+ recommended)
- npm version 9+ (or pnpm / yarn)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/tourist-assist.git
cd tourist-assist
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the example environment configuration:
```bash
cp .env.example .env.local
```
*(Optional)* Add your Supabase credentials if you wish to connect to a live Supabase cloud database. If left unset, the platform runs using its pre-packaged, verified municipal dataset.

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### 5. Build for Production
```bash
npm run build
npm run start
```

---

## 7. Supabase Database Configuration (Optional)

If deploying with a live Supabase backend:
1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Paste and run the complete SQL migration located in [supabase/schema_nearby_facilities.sql](supabase/schema_nearby_facilities.sql).
4. Copy your project URL and anonymous public key into `.env.local` or your Vercel Project Settings:
   - `NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key`

---

## 8. Deployment on Vercel

### Deploying via Vercel Dashboard (Recommended)
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New" $\rightarrow$ "Project"**.
3. Import the `tourist-assist` repository.
4. Next.js will be detected automatically. Leave the build settings as default (`npm run build`).
5. (Optional) Add your environment variables under **Environment Variables**.
6. Click **"Deploy"**.

---

## 9. Future Scope

- **Real-Time Shuttle Telemetry**: Live GPS bus arrival timers for Tapovan-to-Ramkund electric shuttles.
- **Multilingual Audio Tours**: Audio narration in Hindi, Marathi, Gujarati, and English for visually impaired pilgrims.
- **Crowd Density Heatmaps**: Municipal sensor integrations providing real-time crowd congestion alerts along narrow river ghat alleys.

---

## 10. License & Disclaimers

- **Academic Project:** Developed as part of the Community Engagement Project, Department of Computer Engineering, Government College of Engineering & Research, Avasari (Kh.).
- **Data Provenance:** Geospatial markers, emergency helplines, and facility locations reflect verified public municipal records from the Nashik Municipal Corporation, District Disaster Management Cell, and Maharashtra Tourism Development Corporation.
