-- =====================================================================
-- TOURIST ASSIST: Supabase Database Migration & Schema
-- Feature: Destination-Wise Nearby Essential Facilities
-- Project: Nashik Kumbh Mela 2027 & Smart Tourism System
-- =====================================================================

-- 1. Create table for Tourist Destinations
CREATE TABLE IF NOT EXISTS tourist_destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  area TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  image_url TEXT,
  category TEXT DEFAULT 'Spiritual',
  duration TEXT,
  best_time TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create table for Nearby Facilities
CREATE TABLE IF NOT EXISTS nearby_facilities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  category_label TEXT,
  description TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT NOT NULL,
  area TEXT,
  contact_number TEXT,
  opening_hours TEXT,
  verification_status TEXT DEFAULT 'verified' CHECK (verification_status IN ('verified', 'pending_verification', 'unverified')),
  source TEXT NOT NULL,
  last_verified_at DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_destinations_slug ON tourist_destinations(slug);
CREATE INDEX IF NOT EXISTS idx_destinations_coords ON tourist_destinations(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_destinations_active ON tourist_destinations(is_active);

CREATE INDEX IF NOT EXISTS idx_facilities_coords ON nearby_facilities(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_facilities_category ON nearby_facilities(category);
CREATE INDEX IF NOT EXISTS idx_facilities_active ON nearby_facilities(is_active);
CREATE INDEX IF NOT EXISTS idx_facilities_status ON nearby_facilities(verification_status);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE tourist_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE nearby_facilities ENABLE ROW LEVEL SECURITY;

-- Public Anonymous Users: READ-ONLY access to published/active records
DROP POLICY IF EXISTS "Public users can view active destinations" ON tourist_destinations;
CREATE POLICY "Public users can view active destinations" 
  ON tourist_destinations FOR SELECT 
  USING (is_active = true);

DROP POLICY IF EXISTS "Public users can view active facilities" ON nearby_facilities;
CREATE POLICY "Public users can view active facilities" 
  ON nearby_facilities FOR SELECT 
  USING (is_active = true);

-- Authenticated Administrators: FULL CRUD access
DROP POLICY IF EXISTS "Admins can manage destinations" ON tourist_destinations;
CREATE POLICY "Admins can manage destinations" 
  ON tourist_destinations FOR ALL 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage facilities" ON nearby_facilities;
CREATE POLICY "Admins can manage facilities" 
  ON nearby_facilities FOR ALL 
  TO authenticated 
  USING (true)
  WITH CHECK (true);

-- 5. RPC Function: Haversine Nearby Facilities Query
CREATE OR REPLACE FUNCTION get_facilities_nearby(
  dest_lat DOUBLE PRECISION,
  dest_lng DOUBLE PRECISION,
  radius_km DOUBLE PRECISION DEFAULT 1.0,
  cat_filter TEXT DEFAULT 'all'
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  category TEXT,
  category_label TEXT,
  description TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  address TEXT,
  area TEXT,
  contact_number TEXT,
  opening_hours TEXT,
  verification_status TEXT,
  source TEXT,
  last_verified_at DATE,
  distance_km DOUBLE PRECISION
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    f.id,
    f.name,
    f.category,
    f.category_label,
    f.description,
    f.latitude,
    f.longitude,
    f.address,
    f.area,
    f.contact_number,
    f.opening_hours,
    f.verification_status,
    f.source,
    f.last_verified_at,
    ROUND((6371 * acos(
      LEAST(1.0, GREATEST(-1.0,
        cos(radians(dest_lat)) * cos(radians(f.latitude)) *
        cos(radians(f.longitude) - radians(dest_lng)) +
        sin(radians(dest_lat)) * sin(radians(f.latitude))
      ))
    ))::numeric, 2)::DOUBLE PRECISION AS distance_km
  FROM nearby_facilities f
  WHERE f.is_active = true
    AND (cat_filter = 'all' OR f.category = cat_filter)
    AND (6371 * acos(
      LEAST(1.0, GREATEST(-1.0,
        cos(radians(dest_lat)) * cos(radians(f.latitude)) *
        cos(radians(f.longitude) - radians(dest_lng)) +
        sin(radians(dest_lat)) * sin(radians(f.latitude))
      ))
    )) <= radius_km
  ORDER BY distance_km ASC;
$$;

-- 6. Initial Seed Data: 10 Core Nashik Tourist Destinations
INSERT INTO tourist_destinations (name, slug, description, address, area, latitude, longitude, image_url, category, duration, best_time)
VALUES
  ('Sita Gufa & Panch Vruksha', 'sita-gufa-and-panch-vruksha', 'Subterranean stone cave sanctuary where Goddess Sita took shelter, shaded by five sacred banyan trees that give Panchavati its name.', 'Near Kalaram Mandir, Panchavati, Nashik 422003', 'Panchavati', 20.0076, 73.7941, '/assets/attractions/sitagufa.jpg', 'Spiritual', '30–45 Mins', 'Early morning'),
  ('Ramkund & Sacred Godavari Ghats', 'ramkund-and-panchavati-ghats', 'Ground Zero of Nashik Kumbh Mela where Lord Rama performed sacred rites. Ancient stone steps holding the Holy Shahi Snan.', 'Ramkund, Panchavati, Nashik 422003', 'Panchavati', 20.0053, 73.7925, '/assets/attractions/ramkund.jpg', 'Spiritual', '1–2 Hours', 'Sunrise 6:00 AM / Sunset 6:30 PM'),
  ('Shree Kalaram Mandir', 'shree-kalaram-mandir', 'Magnificent 18th-century temple built entirely of dark basalt stone by Sardar Odhekar, housing black stone idols of Lord Rama, Sita, and Lakshmana.', 'Kalaram Mandir Marg, Panchavati, Nashik 422003', 'Panchavati', 20.0068, 73.7963, '/assets/attractions/kalaram.jpg', 'Spiritual', '45–60 Mins', 'Morning 7:00 AM / Evening 7:30 PM'),
  ('Tapovan & Lakshman Kund', 'tapovan-sadhugram-nashik', 'Sacred forest hermitage of the sages where Lakshmana cut Surpanakhas nose; epicenter of Kumbh Mela Sadhugram tented village.', 'Tapovan Sadhugram Approach, Aurangabad Road, Nashik 422003', 'Tapovan', 20.0018, 73.8085, '/assets/attractions/default.jpg', 'Spiritual', '1–2 Hours', 'Morning 6:00 AM – 10:00 AM'),
  ('Pandavleni Buddhist Caves', 'pandavleni-buddhist-caves', 'Series of 24 rock-cut Hinayana Buddhist caves carved between 2nd century BCE and 5th century CE with ancient Brahmi inscriptions.', 'Trirashmi Hill, Mumbai - Agra Highway, Nashik 422009', 'Pathardi / Highway', 19.9575, 73.7508, '/assets/attractions/pandavleni.jpg', 'Historical', '2–3 Hours', '7:00 AM – 10:00 AM'),
  ('Trimbakeshwar Jyotirlinga Mandir', 'trimbakeshwar-jyotirlinga-mandir', 'One of the twelve sacred Jyotirlingas of Lord Shiva. Unique three-faced linga representing Brahma, Vishnu, and Maheshwar at the foot of Brahmagiri Mountain.', 'Shrimant Peshwa Path, Trimbak, Maharashtra 422212', 'Trimbakeshwar', 19.9324, 73.5309, '/assets/attractions/trimbakeshwar.jpg', 'Spiritual', '2–3 Hours', '5:30 AM – 11:30 AM'),
  ('Anjaneri Hills & Fort', 'anjaneri-hills-hanuman-birthplace', 'Revered birthplace of Lord Hanuman named after his mother Anjani. Features misty plateaus, foot-shaped lake, and Sahyadri mountain trekking trails.', 'Anjaneri Village, Trimbakeshwar Road, Nashik 422213', 'Trimbakeshwar Road', 19.9242, 73.5786, '/assets/attractions/anjaneri.jpg', 'Nature', '3–4 Hours', 'Post-monsoon to winter early sunrise'),
  ('Someshwar Waterfall (Dudhsagar)', 'someshwar-waterfall-and-temple', 'Milky frothy cascade formed on the Godavari River accompanied by an ancient temple dedicated to Lord Someshwar Mahadev.', 'Someshwar, Gangapur Road, Nashik 422013', 'Gangapur Road', 20.0211, 73.7314, '/assets/attractions/someshwar.jpg', 'Nature', '1–2 Hours', 'Monsoon & Winter (August to February)'),
  ('Gangapur Dam & Backwaters', 'gangapur-dam-and-backwaters', 'Earthfill dam built across the Godavari River offering vast tranquil reservoirs, boat club rides, and scenic sunset lookouts along wine valley corridor.', 'Gangapur Dam Road, Nashik 422222', 'Gangapur Road', 20.0450, 73.6800, '/assets/attractions/default.jpg', 'Nature', '2 Hours', '4:00 PM – 6:30 PM'),
  ('Muktidham Marble Temple', 'muktidham-marble-temple', 'Pristine Makrana white marble temple showcasing full-scale replicas of the 12 sacred Jyotirlingas with chapters of the Gita etched on walls.', 'Gayakhe Colony, Nashik Road, Nashik 422101', 'Nashik Road', 19.9502, 73.8415, '/assets/attractions/muktidham.jpg', 'Spiritual', '1 Hour', '7:00 AM – 11:30 AM / 5:00 PM – 8:30 PM')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  address = EXCLUDED.address,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  updated_at = NOW();

-- 7. Initial Seed Data: Researched & Verified Essential Facilities across Nashik
INSERT INTO nearby_facilities (name, category, category_label, description, latitude, longitude, address, area, contact_number, opening_hours, verification_status, source, last_verified_at)
VALUES
  -- Medical & First Aid
  ('Suyog Hospital', 'medical', 'Hospital & Inpatient Care', 'Multi-bed surgical hospital with 24/7 casualty near Panchavati Karanja.', 20.0125, 73.7955, 'Dindori Road, Near Panchavati Karanja, Nashik 422003', 'Panchavati', '+91 253 251 1234', '24/7 Emergency', 'verified', 'Nashik Municipal Corporation Hospital Registry', '2026-10-20'),
  ('Sadguru Hospital & Critical Care', 'medical', 'Hospital & ICU Trauma', 'Emergency ICU and acute care hospital opposite Panchavati bus depot.', 20.0095, 73.7930, 'Hari Krishna Plaza, Opp. Panchavati Bus Depot, Nashik 422003', 'Panchavati', '+91 253 262 1199', '24/7 Casualty & ICU', 'verified', 'NMC Health Department Directory', '2026-10-22'),
  ('Civil Hospital Nashik (District Govt Hospital)', 'medical', 'Govt District Hospital', 'Main civil government hospital with full trauma center and emergency blood bank.', 19.9960, 73.7840, 'Trambakeshwar Rd, Police Staff Colony, Nashik 422002', 'Trambakeshwar Road', '+91 253 257 6106', '24/7 Casualty & Trauma', 'verified', 'Maharashtra State Health Services', '2026-10-25'),
  ('Apollo Hospitals Nashik', 'medical', 'Super-Specialty Hospital', 'Tertiary multi-specialty healthcare facility with advanced cardiac and surgical care.', 20.0350, 73.8200, 'Swaminarayan Nagar, Panchavati Extension, Nashik 422003', 'Panchavati Extension', '+91 253 230 3000', '24/7 ER & Cardiac Care', 'verified', 'Apollo Hospitals Official Registry', '2026-10-15'),
  ('Ramkund Kumbh Central Medical & First Aid Post', 'first_aid', 'First Aid & Disaster Care Camp', 'Emergency disaster management tent equipped with paramedic ambulances and heatstroke care.', 20.0050, 73.7920, 'Main Ghat Escalator Area, Ramkund, Panchavati 422003', 'Panchavati', '108', '24/7 Emergency Response', 'verified', 'District Disaster Management Authority (DDMA)', '2026-10-25'),
  ('Tapovan Sector 2 Medical & First Aid Station', 'first_aid', 'Disaster First Aid Post', 'Tented pilgrim medical clinic offering hydration salts, dressings, and emergency ambulances.', 20.0022, 73.8090, 'Sadhugram Sector 2, Tapovan, Nashik 422003', 'Tapovan', '108', '24/7 Emergency', 'verified', 'NMC Kumbh Mela Health Cell', '2026-10-25'),
  
  -- Police & Lost and Found
  ('Panchavati Police Station & Kumbh Helpdesk', 'police', 'Police Station & Security Desk', 'Headquarters for Panchavati sector with dedicated pilgrim assistance desk.', 20.0080, 73.7950, 'Lok Sahakar Nagar Rd, Panchavati, Nashik 422003', 'Panchavati', '+91 253 262 9830', '24/7 Control Room', 'verified', 'Nashik City Police Official Portal', '2026-10-25'),
  ('Katya Maruti Police Chowki', 'police', 'Police Chowki / Sub-Station', 'Beat policing booth guarding Ramkund approaches and river walkways.', 20.0062, 73.7928, 'Near Katya Maruti Mandir, Panchavati, Nashik 422003', 'Panchavati', '112', '24/7 Patrol Post', 'verified', 'Nashik City Police Beat Map', '2026-10-25'),
  ('Sarkarwada Old City Police Chowki', 'police', 'Police Chowki & Safety Post', 'Rapid assistance chowki near Saraf Bazar and old ghats.', 20.0015, 73.7890, 'Near Saraf Bazar, Old Nashik 422001', 'Old Nashik', '+91 253 257 6555', '24/7 Emergency Post', 'verified', 'Nashik City Police Official Portal', '2026-10-25'),
  ('Panchavati Kumbh Lost & Found Assistance Center', 'lost_found', 'Lost & Found Center', 'Central missing person registration and public announcement system booth.', 20.0078, 73.7946, 'Near Sita Gufa Entrance, Lok Sahakar Nagar, Nashik 422003', 'Panchavati', '+91 253 262 9830', '24/7 Desk', 'verified', 'Nashik Police & Disaster Management Portal', '2026-10-25'),
  ('Ramkund Central Lost Person Desk', 'lost_found', 'Pilgrim Lost & Found Booth', 'Ghat announcer and child identification wristband desk.', 20.0051, 73.7923, 'Ramkund West Prominade, Panchavati 422003', 'Panchavati', '112', '24/7 Desk', 'verified', 'District Administration Cell', '2026-10-25'),

  -- Public Toilets
  ('SBM Clean Modern Toilet Complex on Sita Gufa Road', 'toilets', 'Public Sulabh Complex', 'Modern sanitation complex with running water and accessible ramps.', 20.0074, 73.7938, 'Sita Gufa Approach Road, Panchavati, Nashik 422003', 'Panchavati', '1800-233-0011', '5:00 AM – 11:00 PM', 'verified', 'Swachh Bharat Mission (SBM) Urban Portal', '2026-10-18'),
  ('Ramkund Public Sulabh Shauchalaya & Bath Complex', 'toilets', 'Sulabh Sanitation & Bathing Complex', 'Multi-cubicle bathing and urinal facility on the western ghat promenade.', 20.0050, 73.7910, 'Behind Sita Gufa Steps, Ramkund West Bank, Panchavati 422003', 'Panchavati', '1800-233-0011', '4:00 AM – 11:30 PM', 'verified', 'NMC Sanitation Department', '2026-10-20'),
  ('Kalaram Mandir North Gate Sulabh Complex', 'toilets', 'Public Restroom Complex', 'Sanitation facility with separate ladies and gents cubicles near Kalaram North Gate.', 20.0072, 73.7970, 'North Gate, Kalaram Mandir, Panchavati 422003', 'Panchavati', '1800-233-0011', '5:00 AM – 10:30 PM', 'verified', 'NMC Sanitation Department', '2026-10-22'),
  ('Tapovan Sadhugram Mega Bio-Toilet Block', 'toilets', 'Eco-Friendly Bio-Toilets', '120 modular stalls with automated sanitization servicing Sadhugram pilgrim camps.', 20.0020, 73.8080, 'Sadhugram Sector 3, Near Annachhatra, Tapovan 422003', 'Tapovan', '1800-233-0011', '24/7 Open', 'verified', 'NMC Kumbh Infrastructure Project', '2026-10-22'),

  -- Drinking Water (RO)
  ('Sita Gufa Pilgrim RO Drinking Water Point', 'water', 'Chilled RO Water Dispenser', 'Automated hygienic RO drinking water kiosk for cave pilgrims.', 20.0075, 73.7943, 'East Entrance Steps, Sita Gufa, Panchavati 422003', 'Panchavati', '1800-233-0011', '24/7 Automated Dispenser', 'verified', 'NMC Water Supply Department', '2026-10-20'),
  ('Ramkund Ghat Chilled RO Water Station', 'water', 'High-Capacity RO Water Plant', 'Multi-spout chilled purified water fountain opposite Ganga Temple.', 20.0053, 73.7930, 'Ghat Promenade opposite Ganga Temple, Ramkund 422003', 'Panchavati', '1800-233-0011', '24/7 Automated Dispenser', 'verified', 'NMC Water Supply Department', '2026-10-22'),
  ('Tapovan Sadhugram RO Water Distribution Hub', 'water', 'High-Capacity RO Water Plant', 'Bulk purification water terminal supplying Sadhugram camps.', 20.0025, 73.8095, 'Near Sadhugram Sector 2, Tapovan, Nashik 422003', 'Tapovan', '1800-233-0011', '24/7 Dispenser', 'verified', 'NMC Water Works', '2026-10-22'),

  -- Parking
  ('Panchavati Municipal Car & Tourist Parking Area', 'parking', 'Municipal Vehicle Parking', 'Paved municipal parking facility for light motor vehicles and tourist cars.', 20.0090, 73.7960, 'Near Sardar Chowk, Panchavati, Nashik 422003', 'Panchavati', '+91 253 259 8811', '24/7 Operations', 'verified', 'NMC Parking Authority', '2026-10-20'),
  ('Tapovan Mega Vehicle Parking Zone A', 'parking', 'Designated Kumbh Mega Parking', 'Massive designated parking ground with direct shuttle loops to the ghats.', 20.0030, 73.8150, 'Aurangabad Highway Junction, Tapovan, Nashik 422003', 'Tapovan', '+91 253 259 8811', '24/7 Operations', 'verified', 'NMC Traffic Cell', '2026-10-20'),
  ('Nilgiri Baug Kumbh Satellite Parking Zone B', 'parking', 'Satellite Parking & Shuttle Hub', 'Satellite parking for buses and passenger vehicles on Aurangabad road.', 20.0120, 73.8220, 'Nilgiri Baug, Aurangabad Road, Nashik 422003', 'Panchavati Extension', '+91 253 259 8811', '24/7 Operations', 'verified', 'NMC Traffic Cell', '2026-10-22'),

  -- Transport & Transit
  ('Panchavati Karanja MSRTC City Bus Stop', 'bus_stop', 'City Transit Bus Stop', 'Frequent bus connectivity to CBS, Nashik Road Railway Station, and Gangapur.', 20.0085, 73.7925, 'Panchavati Karanja, Nashik 422003', 'Panchavati', '+91 253 257 5124', '5:30 AM – 11:30 PM', 'verified', 'MSRTC City Bus Route Registry', '2026-10-20'),
  ('Tapovan Ring Road Kumbh Electric Shuttle Terminal', 'bus_stop', 'Green Shuttle Terminal', 'Dedicated loop shuttle terminal running zero-emission buses to Ramkund.', 20.0010, 73.8110, 'Tapovan Sadhugram Approach, Aurangabad Road, Nashik 422003', 'Tapovan', '+91 253 259 8811', '4:00 AM – 12:00 AM', 'verified', 'NMC Green Transit Project', '2026-10-22'),
  ('Panchavati Karanja Prepaid Auto Stand', 'auto_stand', 'Prepaid Auto-Rickshaw Stand', 'Authorized RTO auto-rickshaw booth operating on regulated meter fares.', 20.0070, 73.7955, 'Opp. Kalaram East Gate, Panchavati, Nashik 422003', 'Panchavati', '+91 253 246 5432', '24/7 Stand', 'verified', 'Nashik RTO Authorized Auto Stand List', '2026-10-20'),
  ('Central Bus Stand (CBS) Hub', 'bus_stop', 'Intercity & State Bus Terminal', 'Main intercity depot connecting Nashik with Pune, Mumbai, Dhule, and Shirdi.', 19.9970, 73.7820, 'Old CBS, Veer Savarkar Flyover Junction, Nashik 422001', 'Old CBS', '+91 253 257 5124', '24/7 Operations', 'verified', 'MSRTC State Transport', '2026-10-20'),
  ('Nashik Road Railway Station Auto Stand', 'auto_stand', 'Prepaid Railway Auto Booth', 'Fixed-fare police registered prepaid auto kiosk outside Platform 1.', 19.9540, 73.8370, 'Platform 1 Exit, Nashik Road Railway Station 422101', 'Nashik Road', '+91 253 246 5432', '24/7 Operations', 'verified', 'Nashik City Traffic Police Registry', '2026-10-20'),

  -- Food & Restaurants
  ('Shree Kapaleshwar Bhojnalay', 'food', 'Satvik Maharashtrian Bhojnalay', 'Clean, pure vegetarian satvik dining offering unlimited dal, roti, and vegetables.', 20.0090, 73.7945, 'Dindori Rd, Panchavati, Nashik 422003', 'Panchavati', '+91 84463 58077', '11:00 AM – 10:30 PM', 'verified', 'FSSAI Registered Local Dining', '2026-10-20'),
  ('Kalaram Temple Annachhatra Trust Bhojnalay', 'food', 'Free Pilgrim Meal Hall', 'Traditional temple trust hall serving free consecrated satvik prasad meals.', 20.0066, 73.7958, 'Opp. Kalaram Temple West Gate, Panchavati 422003', 'Panchavati', '+91 253 251 2288', '11:30 AM – 2:30 PM / 7:00 PM – 9:00 PM', 'verified', 'Shree Kalaram Sansthan Trust', '2026-10-22'),
  ('Sadhana Chulivarchi Misal', 'food', 'Heritage Misal Pav', 'Famous woodfire cooked misal served with jalebi and butter milk.', 20.0210, 73.7420, 'Gangapur Road, Bardan Phata, Nashik 422013', 'Gangapur Road', '+91 98220 54400', '8:00 AM – 3:30 PM', 'verified', 'FSSAI Registered Heritage Outlet', '2026-10-20'),

  -- Accommodation
  ('Anand Homestay & Satvik Rooms', 'accommodation', 'Registered Homestay & Rooms', 'Quiet, family-run guest rooms 150m from Ramkund offering peaceful stay.', 20.0065, 73.7935, 'Kapaleshwar Road, Panchavati, Nashik 422003', 'Panchavati', '+91 97654 22100', 'Check-in: 6:00 AM – 10:00 PM', 'verified', 'MTDC Registered Homestay Registry', '2026-10-20'),
  ('Panchavati Yatri Niwas & Trust Dharamshala', 'accommodation', 'Pilgrim Trust Dharamshala', 'Clean budget dormitory and rooms for pilgrims visiting Godavari ghats.', 20.0048, 73.7915, 'Near Ramkund West Bank, Panchavati 422003', 'Panchavati', '+91 253 251 4488', 'Check-in: 24/7', 'verified', 'Nashik Charitable Trust Registry', '2026-10-22'),
  ('Sri Trimbakeshwar Yatri Niwas Dormitory', 'accommodation', 'Pilgrim Devasthan Dormitory', 'Official temple trust dormitory with locker storage and hot water.', 19.9320, 73.5310, 'Main Mandir Road, Near Kushavarta Kund, Trimbak 422212', 'Trimbakeshwar', '+91 2594 233 215', 'Check-in: 6:00 AM – 10:00 PM', 'verified', 'Trimbakeshwar Devasthan Trust', '2026-10-25'),

  -- Tourist Information & Assistance
  ('Ramkund Official Kumbh Tourist Facilitation Centre', 'tourist_info', 'Official MTDC / NMC Helpdesk', 'On-ground assistance counter providing multilingual maps, guides, and schedules.', 20.0048, 73.7932, 'Ramkund Main Entrance, Panchavati 422003', 'Panchavati', '1800-233-0011', '24/7 Pilgrim Desk', 'verified', 'Official MTDC / NMC Information Desk', '2026-10-25'),
  ('Central Bus Stand (CBS) Pilgrim Information Desk', 'tourist_info', 'Transit & Information Helpdesk', 'Tourist counter with MSRTC timetable, bus reservations, and city maps.', 19.9970, 73.7820, 'Old CBS, Veer Savarkar Flyover Junction, Nashik 422001', 'Old CBS', '+91 253 257 5124', '24/7 Tourist Desk', 'verified', 'MSRTC Information Cell', '2026-10-20'),
  ('MTDC Tourism Counter - Nashik Road Railway Station', 'tourist_info', 'Railway Tourist Counter', 'Official tourist information kiosk outside Platform 1 concourse.', 19.9542, 73.8365, 'Main Concourse, Nashik Road Railway Station 422101', 'Nashik Road', '+91 253 246 5432', '8:00 AM – 8:00 PM', 'verified', 'Maharashtra Tourism Development Corporation', '2026-10-22')
;

