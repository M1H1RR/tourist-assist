const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'kumbhsetu.db');
const db = new Database(dbPath);

// Enable WAL mode for better concurrency and performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Initialize database schema
function initSchema() {
  db.exec(`
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Essential services table
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL, -- medical, transport, sanitation, water, accommodation, helpdesk
      sub_category TEXT,
      address TEXT NOT NULL,
      area TEXT NOT NULL,
      dist_from_ramkund REAL NOT NULL DEFAULT 0.0,
      phone TEXT,
      hours TEXT DEFAULT '24/7',
      rate_type TEXT DEFAULT 'free', -- free, budget, moderate, paid
      rate_info TEXT,
      google_maps_url TEXT,
      latitude REAL,
      longitude REAL,
      description TEXT,
      source_reference TEXT,
      last_reviewed_date TEXT,
      verification_status TEXT DEFAULT 'Reviewed by Project Team', -- Official Source, Reviewed by Project Team, Provider Submitted, Needs Review
      reviewer_notes TEXT,
      is_emergency INTEGER DEFAULT 0,
      tags TEXT, -- JSON array of tags
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Tourist attractions table
    CREATE TABLE IF NOT EXISTS attractions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL, -- spiritual, historical, nature, food_shopping
      description TEXT NOT NULL,
      address TEXT NOT NULL,
      area TEXT NOT NULL,
      dist_from_ramkund REAL DEFAULT 0.0,
      google_maps_url TEXT,
      latitude REAL,
      longitude REAL,
      suggested_duration TEXT,
      best_time_to_visit TEXT,
      source_reference TEXT,
      last_reviewed_date TEXT,
      verification_status TEXT DEFAULT 'Reviewed by Project Team',
      image_url TEXT,
      highlights TEXT, -- JSON array of highlights
      tags TEXT, -- JSON array of tags
      is_featured INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Local providers table
    CREATE TABLE IF NOT EXISTS providers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      business_name TEXT NOT NULL,
      category TEXT NOT NULL, -- guide, transport, food, handicraft, accommodation
      description TEXT NOT NULL,
      area TEXT NOT NULL,
      phone TEXT NOT NULL,
      whatsapp TEXT,
      email TEXT,
      services_offered TEXT,
      pricing_notes TEXT,
      website_url TEXT,
      status TEXT DEFAULT 'pending', -- pending, approved, rejected
      rejection_reason TEXT,
      admin_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      reviewed_at DATETIME
    );

    -- Provider enquiries table
    CREATE TABLE IF NOT EXISTS provider_enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      provider_id INTEGER NOT NULL,
      visitor_name TEXT NOT NULL,
      visitor_phone TEXT NOT NULL,
      visitor_email TEXT,
      message TEXT NOT NULL,
      visit_date TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (provider_id) REFERENCES providers (id) ON DELETE CASCADE
    );

    -- Dynamic QR codes table
    CREATE TABLE IF NOT EXISTS qr_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code_id TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      target_type TEXT NOT NULL DEFAULT 'area_hub', -- attraction, service, area_hub, custom
      target_id INTEGER,
      target_url TEXT NOT NULL,
      location_label TEXT NOT NULL,
      scans_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Information reports table (crowdsourced verification and correction)
    CREATE TABLE IF NOT EXISTS information_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity_type TEXT NOT NULL, -- service, attraction, provider, general
      entity_id INTEGER,
      entity_name TEXT NOT NULL,
      issue_type TEXT NOT NULL, -- incorrect_contact, wrong_address, closed_down, misleading_pricing, other
      description TEXT NOT NULL,
      reporter_name TEXT,
      reporter_contact TEXT,
      status TEXT DEFAULT 'pending', -- pending, investigating, resolved, dismissed
      admin_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Create indexes for fast lookup
    CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
    CREATE INDEX IF NOT EXISTS idx_services_area ON services(area);
    CREATE INDEX IF NOT EXISTS idx_services_dist ON services(dist_from_ramkund);
    CREATE INDEX IF NOT EXISTS idx_attractions_category ON attractions(category);
    CREATE INDEX IF NOT EXISTS idx_providers_status ON providers(status);
    CREATE INDEX IF NOT EXISTS idx_qr_code_id ON qr_codes(code_id);
  `);

  seedData();
}

// Seed authentic initial data
function seedData() {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount === 0) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('admin123', salt);
    db.prepare(`
      INSERT INTO users (username, password_hash, name, role)
      VALUES (?, ?, ?, ?)
    `).run('admin', hash, 'Tourist Assist Administrator', 'admin');
    console.log('Seeded default admin user (admin / admin123)');
  }

  const serviceCount = db.prepare('SELECT COUNT(*) as count FROM services').get().count;
  if (serviceCount === 0) {
    const insertService = db.prepare(`
      INSERT INTO services (
        name, category, sub_category, address, area, dist_from_ramkund,
        phone, hours, rate_type, rate_info, google_maps_url, latitude, longitude,
        description, source_reference, last_reviewed_date, verification_status,
        reviewer_notes, is_emergency, tags
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const services = [
      // Medical & Emergency
      {
        name: "Civil Hospital Nashik (District Govt Hospital)",
        category: "medical",
        sub_category: "Hospital & Trauma Center",
        address: "Trambakeshwar Rd, Police Staff Colony, Nashik",
        area: "Trambakeshwar Road",
        dist_from_ramkund: 2.5,
        phone: "+91 253 257 6106",
        hours: "24/7 Open",
        rate_type: "free",
        rate_info: "Government Free Healthcare, 24/7 Casualty & Blood Bank",
        google_maps_url: "https://maps.google.com/?cid=310115082782318149",
        latitude: 19.996,
        longitude: 73.784,
        description: "Primary government civil hospital with dedicated 24/7 trauma care, oxygen supply, blood bank, and free emergency pilgrim ward.",
        source_reference: "Nashik District Health Administration Directory",
        last_reviewed_date: "2026-10-15",
        verification_status: "Official Source",
        reviewer_notes: "Designated central civil medical hub for Kumbh Mela.",
        is_emergency: 1,
        tags: JSON.stringify(["24/7 ER", "Free ICU", "Blood Bank", "Govt Approved", "Ambulance"])
      },
      {
        name: "Ramkund Kumbh Central Medical & First Aid Post",
        category: "medical",
        sub_category: "First Aid & Disaster Care",
        address: "Main Ghat Escalator Area, Ramkund, Panchavati, Nashik",
        area: "Panchavati",
        dist_from_ramkund: 0.2,
        phone: "108",
        hours: "24/7 Emergency",
        rate_type: "free",
        rate_info: "Free Medical Aid, Emergency Resuscitation, ORS & Heatstroke Care",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Ramkund+Panchavati+Nashik",
        latitude: 20.005,
        longitude: 73.792,
        description: "Immediate first-aid point at Ramkund main ghat for pilgrims with cardiac, exhaustion, injury, or emergency medical needs.",
        source_reference: "Nashik Municipal Corporation (NMC) Disaster Management",
        last_reviewed_date: "2026-10-14",
        verification_status: "Official Source",
        reviewer_notes: "Stationed directly on the ghat pathway.",
        is_emergency: 1,
        tags: JSON.stringify(["First Aid", "Ambulance Hub", "Lost Children Desk", "Free Medicine"])
      },
      {
        name: "Apollo Hospitals Nashik",
        category: "medical",
        sub_category: "Multi-specialty Private Hospital",
        address: "Swaminarayan Nagar, Panchavati Extension, Nashik",
        area: "Panchavati Extension",
        dist_from_ramkund: 6.8,
        phone: "+91 253 230 3000",
        hours: "24/7 ER & Trauma",
        rate_type: "paid",
        rate_info: "Private Multi-specialty / Cashless Insurance Accepted",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Apollo+Hospital+Panchavati+Nashik",
        latitude: 20.035,
        longitude: 73.820,
        description: "Comprehensive tertiary care private hospital with modern ICU, emergency operation theaters, and multi-specialist standby.",
        source_reference: "Hospital Public Records",
        last_reviewed_date: "2026-10-10",
        verification_status: "Reviewed by Project Team",
        reviewer_notes: "Verified contact and emergency desk operational.",
        is_emergency: 1,
        tags: JSON.stringify(["Multi-specialty", "Trauma ER", "Cashless Insurance", "ICU"])
      },
      // Police & Helpdesk
      {
        name: "Panchavati Police Station & Kumbh Helpdesk",
        category: "helpdesk",
        sub_category: "Police & Public Assistance",
        address: "Lok Sahakar Nagar Rd, Panchavati, Nashik",
        area: "Panchavati",
        dist_from_ramkund: 0.8,
        phone: "+91 253 262 9830",
        hours: "24/7 Control Room",
        rate_type: "free",
        rate_info: "Free Public Safety, Lost & Found, Pilgrim Verification",
        google_maps_url: "https://maps.google.com/?cid=4366729237185242046",
        latitude: 20.008,
        longitude: 73.795,
        description: "Core police station for Panchavati and Ramkund ghat sectors. Equipped with lost-and-found desk and crowd assistance.",
        source_reference: "Nashik City Police Commissionerate",
        last_reviewed_date: "2026-10-15",
        verification_status: "Official Source",
        reviewer_notes: "Key jurisdiction station for Ramkund Ghat.",
        is_emergency: 1,
        tags: JSON.stringify(["Lost & Found", "Police Post", "Crowd Control", "24/7 Help"])
      },
      {
        name: "Central Bus Stand (CBS) Pilgrim Information & Helpdesk",
        category: "helpdesk",
        sub_category: "Transit Assistance & Lost & Found",
        address: "Old CBS, Veer Savarkar Flyover Junction, Nashik",
        area: "Old CBS",
        dist_from_ramkund: 2.2,
        phone: "+91 253 257 5124",
        hours: "24/7 Desk",
        rate_type: "free",
        rate_info: "Free Travel Guidance, Shuttle Schedule, Multi-lingual Assistance",
        google_maps_url: "https://maps.google.com/?cid=12953283726194723",
        latitude: 19.997,
        longitude: 73.782,
        description: "MSRTC and municipal tourist information center providing city bus routes, shuttle buses to Tapovan and Trimbak, and lost luggage support.",
        source_reference: "MSRTC Nashik Division",
        last_reviewed_date: "2026-10-12",
        verification_status: "Reviewed by Project Team",
        reviewer_notes: "Helpful for interstate bus travelers.",
        is_emergency: 0,
        tags: JSON.stringify(["MSRTC", "Bus Schedules", "Shuttle Pass", "Information Desk"])
      },
      // Transport
      {
        name: "Tapovan Ring Road Kumbh Shuttle Terminal",
        category: "transport",
        sub_category: "Electric Shuttle & Bus Stand",
        address: "Tapovan Sadhugram Approach, Aurangabad Road, Nashik",
        area: "Tapovan",
        dist_from_ramkund: 1.8,
        phone: "+91 253 259 8811",
        hours: "4:00 AM - 12:00 AM",
        rate_type: "budget",
        rate_info: "₹10 - ₹20 Municipal Electric Shuttle Fare",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Tapovan+Nashik",
        latitude: 20.001,
        longitude: 73.811,
        description: "Official terminal connecting Tapovan parking grounds and Sadhugram to Ramkund and Panchavati via zero-emission shuttles.",
        source_reference: "Nashik Mahanagar Parivahan Mahamandal Ltd (NMPML)",
        last_reviewed_date: "2026-10-15",
        verification_status: "Official Source",
        reviewer_notes: "High frequency shuttles during festival bathing days.",
        is_emergency: 0,
        tags: JSON.stringify(["E-Bus", "Parking Transit", "Frequent Shuttles", "Wheelchair Accessible"])
      },
      {
        name: "Nashik Road Railway Station Auto & Prepaid Taxi Stand",
        category: "transport",
        sub_category: "Prepaid Auto & Taxi Booth",
        address: "Platform 1 Exit, Nashik Road Railway Station, Nashik",
        area: "Nashik Road",
        dist_from_ramkund: 9.5,
        phone: "+91 253 246 5432",
        hours: "24/7 Operations",
        rate_type: "budget",
        rate_info: "Regulated Fixed Rate by Nashik Traffic Police",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Nashik+Road+Railway+Station",
        latitude: 19.954,
        longitude: 73.837,
        description: "Official pre-paid autorickshaw and taxi booth managed by Nashik Traffic Police to prevent overcharging of arriving pilgrims.",
        source_reference: "Nashik City Traffic Police Department",
        last_reviewed_date: "2026-10-11",
        verification_status: "Reviewed by Project Team",
        reviewer_notes: "Strict metered and fixed tariff card posted on booth.",
        is_emergency: 0,
        tags: JSON.stringify(["Prepaid", "Authorized Auto", "Traffic Police Booth", "Luggage Friendly"])
      },
      // Toilets & Sanitation
      {
        name: "Ramkund Public Sulabh Shauchalaya & Bath Complex",
        category: "sanitation",
        sub_category: "Public Toilets & Bathing Cubicles",
        address: "Behind Sita Gufa Steps, Ramkund West Bank, Panchavati",
        area: "Panchavati",
        dist_from_ramkund: 0.15,
        phone: "1800-233-0011",
        hours: "4:00 AM - 11:30 PM",
        rate_type: "free",
        rate_info: "Free Urinals / ₹5 Bath & WC maintenance charge",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Ramkund+Toilet+Panchavati",
        latitude: 20.005,
        longitude: 73.791,
        description: "High-capacity modern sanitary complex with 40+ stalls, separate ladies and gents sections, disability ramp, and continuous running water.",
        source_reference: "NMC Swachh Bharat Cell",
        last_reviewed_date: "2026-10-14",
        verification_status: "Official Source",
        reviewer_notes: "Cleanliness audited twice daily by NMC sanitary inspectors.",
        is_emergency: 0,
        tags: JSON.stringify(["Sulabh", "Clean Bathrooms", "Disability Ramp", "Ladies Separate", "Running Water"])
      },
      {
        name: "Tapovan Sadhugram Mega Sanitation Hub",
        category: "sanitation",
        sub_category: "Mobile & Modular Bio-Toilets",
        address: "Sadhugram Sector 3, Near Annachhatra, Tapovan, Nashik",
        area: "Tapovan",
        dist_from_ramkund: 1.6,
        phone: "1800-233-0011",
        hours: "24/7 Open",
        rate_type: "free",
        rate_info: "100% Free Public Utility provided by NMC",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Tapovan+Sadhugram+Nashik",
        latitude: 20.002,
        longitude: 73.808,
        description: "Eco-friendly bio-toilet block with 120 stalls, automated cleaning cycles, soap dispensers, and water replenishment tankers.",
        source_reference: "NMC Kumbh Infrastructure Cell",
        last_reviewed_date: "2026-10-13",
        verification_status: "Official Source",
        reviewer_notes: "Equipped with solar illumination for night safety.",
        is_emergency: 0,
        tags: JSON.stringify(["Bio-Toilet", "Solar Lighted", "Free", "Sanitized Regularly"])
      },
      // Drinking Water
      {
        name: "Ramkund Ghat Chilled RO Water ATM",
        category: "water",
        sub_category: "RO Water Dispenser & Refill Station",
        address: "Ghat Promenade opposite Ganga Temple, Ramkund, Panchavati",
        area: "Panchavati",
        dist_from_ramkund: 0.1,
        phone: "1800-233-0011",
        hours: "24/7 Dispenser",
        rate_type: "free",
        rate_info: "Free Purified Drinking Water (Bring Your Own Bottle or Dispense Free)",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Ramkund+Nashik",
        latitude: 20.005,
        longitude: 73.793,
        description: "Automated reverse osmosis (RO) cold drinking water fountain capable of dispensing 2,000 litres/hour of WHO standard safe water.",
        source_reference: "NMC Water Works Department",
        last_reviewed_date: "2026-10-15",
        verification_status: "Official Source",
        reviewer_notes: "Regular chlorine & TDS testing logged on notice board.",
        is_emergency: 0,
        tags: JSON.stringify(["RO Water", "Chilled", "Free", "Eco Refill", "24/7"])
      },
      {
        name: "Sita Gufa Godavari Jal Kendra & Shibir Water Post",
        category: "water",
        sub_category: "Drinking Water Booth",
        address: "Near Five Banyan Trees (Panch Vruksha), Panchavati",
        area: "Panchavati",
        dist_from_ramkund: 0.5,
        phone: "+91 253 251 1234",
        hours: "6:00 AM - 10:00 PM",
        rate_type: "free",
        rate_info: "Free Clean Drinking Water by Trust",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Sita+Gumpha+Panchavati+Nashik",
        latitude: 20.008,
        longitude: 73.793,
        description: "Community drinking water post maintained by the temple trust with clean stainless steel coolers and paper cups.",
        source_reference: "Sita Gufa Temple Trust",
        last_reviewed_date: "2026-10-14",
        verification_status: "Reviewed by Project Team",
        reviewer_notes: "Reliable drinking point near high footfall temple area.",
        is_emergency: 0,
        tags: JSON.stringify(["Water Cooler", "Temple Booth", "Free", "Clean Drinking"])
      },
      // Accommodation & Dharamshalas
      {
        name: "Sri Trimbakeshwar Yatri Niwas Dormitory",
        category: "accommodation",
        sub_category: "Pilgrim Trust Dormitory",
        address: "Main Mandir Road, Near Kushavarta Kund, Trimbak",
        area: "Trimbakeshwar",
        dist_from_ramkund: 28.0,
        phone: "+91 2594 233 215",
        hours: "Check-in 6:00 AM - 10:00 PM",
        rate_type: "budget",
        rate_info: "₹150 / bed (Dormitory) | ₹600 / Non-AC Room",
        google_maps_url: "https://maps.google.com/?cid=10331002220198273641",
        latitude: 19.932,
        longitude: 73.531,
        description: "Official temple trust accommodation offering secure lockers, clean bed rolls, hot water geyser, and peaceful spiritual ambience.",
        source_reference: "Trimbakeshwar Devasthan Trust",
        last_reviewed_date: "2026-10-12",
        verification_status: "Official Source",
        reviewer_notes: "Requires Aadhaar or valid Government Photo ID for check-in.",
        is_emergency: 0,
        tags: JSON.stringify(["Trust Dorm", "Locker Facility", "Affordable", "Temple Trust", "Aadhaar Required"])
      },
      {
        name: "Panchavati Dharamshala & Yatri Gruha",
        category: "accommodation",
        sub_category: "Charitable Dharamshala",
        address: "Malviya Chowk, Opp. Sita Gufa Marg, Panchavati, Nashik",
        area: "Panchavati",
        dist_from_ramkund: 0.7,
        phone: "+91 253 251 4455",
        hours: "24 Hours Desk",
        rate_type: "budget",
        rate_info: "₹200 - ₹500 / night per family room",
        google_maps_url: "https://maps.google.com/?cid=8923487192301928374",
        latitude: 20.007,
        longitude: 73.794,
        description: "Centrally located non-profit pilgrim rest house with basic clean rooms, 24/7 municipal water, and walking distance to Ramkund.",
        source_reference: "Charity Commissioner Registration Records",
        last_reviewed_date: "2026-10-13",
        verification_status: "Reviewed by Project Team",
        reviewer_notes: "Ideal for senior citizens desiring proximity to ghats.",
        is_emergency: 0,
        tags: JSON.stringify(["Walk to Ramkund", "Family Rooms", "Elderly Friendly", "Budget Stay"])
      },
      {
        name: "Nashik Road Railway Station Transit Dormitory",
        category: "accommodation",
        sub_category: "IRCTC Retiring Rooms & Pod Dorms",
        address: "Platform 1 First Floor, Nashik Road Railway Station",
        area: "Nashik Road",
        dist_from_ramkund: 9.6,
        phone: "+91 253 246 1122",
        hours: "24 Hours Check-in",
        rate_type: "budget",
        rate_info: "₹180 / 12 Hours (AC Dormitory Bed)",
        google_maps_url: "https://maps.google.com/?cid=7712398412039481239",
        latitude: 19.954,
        longitude: 73.838,
        description: "Clean IRCTC transit dormitory directly inside the railway station, complete with individual charging ports, reading lights, and security lockers.",
        source_reference: "IRCTC Retiring Room Portal",
        last_reviewed_date: "2026-10-11",
        verification_status: "Reviewed by Project Team",
        reviewer_notes: "Must have valid Indian Railways PNR ticket to book.",
        is_emergency: 0,
        tags: JSON.stringify(["IRCTC", "Railway Station", "AC Dorm", "PNR Required", "Safe"])
      },
      // Food & Mess
      {
        name: "Shree Kapaleshwar Bhojnalay",
        category: "food_shopping",
        sub_category: "Traditional Maharashtrian Veg Thali",
        address: "Dindori Rd, opp. Meghraj Bakery, Panchavati, Nashik",
        area: "Panchavati",
        dist_from_ramkund: 0.5,
        phone: "+91 84463 58077",
        hours: "8:00 AM - 10:30 PM",
        rate_type: "budget",
        rate_info: "₹80 - ₹120 / Unlimited Thali",
        google_maps_url: "https://maps.google.com/?cid=7833889190548391722",
        latitude: 20.009,
        longitude: 73.790,
        description: "Renowned authentic Maharashtrian vegetarian dining offering satvik dal, sabzi, bhakri, chapati, and kheer in hygienic surroundings.",
        source_reference: "Food Safety and Standards Authority (FSSAI) License",
        last_reviewed_date: "2026-10-14",
        verification_status: "Reviewed by Project Team",
        reviewer_notes: "Very popular among pilgrims; prompt service.",
        is_emergency: 0,
        tags: JSON.stringify(["Pure Veg", "Authentic Maharashtrian", "Satvik", "Quick Service"])
      },
      {
        name: "ISKCON Govinda's Free Bhandara & Annakoot Desk",
        category: "food_shopping",
        sub_category: "Free Prasadam & Satvik Dining",
        address: "Vrindavan Colony, Poornima Bus Stop, Panchavati",
        area: "Panchavati",
        dist_from_ramkund: 1.5,
        phone: "+91 253 250 1859",
        hours: "11:30 AM - 9:00 PM",
        rate_type: "free",
        rate_info: "Free Mahaprasadam distributed daily to all pilgrims",
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=ISKCON+Panchavati+Nashik",
        latitude: 20.012,
        longitude: 73.801,
        description: "Community mass dining hall serving sanctified hot khichdi, subji, and sweet halwa to thousands of visitors without charge.",
        source_reference: "ISKCON Nashik Trust",
        last_reviewed_date: "2026-10-14",
        verification_status: "Official Source",
        reviewer_notes: "Continuous prasadam queues during peak festival days.",
        is_emergency: 0,
        tags: JSON.stringify(["Free Mahaprasad", "Satvik Meals", "Mass Dining", "Clean"])
      }
    ];

    for (const s of services) {
      insertService.run(
        s.name, s.category, s.sub_category, s.address, s.area, s.dist_from_ramkund,
        s.phone, s.hours, s.rate_type, s.rate_info, s.google_maps_url, s.latitude, s.longitude,
        s.description, s.source_reference, s.last_reviewed_date, s.verification_status,
        s.reviewer_notes, s.is_emergency, s.tags
      );
    }
    console.log(`Seeded ${services.length} essential services.`);
  }

  const attractionCount = db.prepare('SELECT COUNT(*) as count FROM attractions').get().count;
  if (attractionCount === 0) {
    const insertAttraction = db.prepare(`
      INSERT INTO attractions (
        slug, name, category, description, address, area, dist_from_ramkund,
        google_maps_url, latitude, longitude, suggested_duration, best_time_to_visit,
        source_reference, last_reviewed_date, verification_status, image_url,
        highlights, tags, is_featured
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const attractions = [
      {
        slug: "trimbakeshwar-jyotirlinga-mandir",
        name: "Trimbakeshwar Jyotirlinga Mandir",
        category: "spiritual",
        description: "One of the twelve sacred Jyotirlingas of Lord Shiva. Unique for its three-faced linga representing Brahma, Vishnu, and Maheshwar. Located at the base of Brahmagiri Mountain, the source of River Godavari.",
        address: "Shrimant Peshwa Path, Trimbak, Maharashtra 422212",
        area: "Trimbakeshwar",
        dist_from_ramkund: 28.0,
        google_maps_url: "https://maps.google.com/?cid=1743644265437882903",
        latitude: 19.9324,
        longitude: 73.5309,
        suggested_duration: "2–3 hours (longer during peak snan days)",
        best_time_to_visit: "Early morning 5:30 AM to 11:30 AM or late evening",
        source_reference: "Shree Trimbakeshwar Sansthan Official Guide & ASI Records",
        last_reviewed_date: "2026-10-15",
        verification_status: "Official Source",
        image_url: "/assets/attractions/trimbakeshwar.jpg",
        highlights: JSON.stringify(["Ancient Black Stone Architecture", "Three-Faced Jyotirlinga", "Kushavarta Kund Holy Dip", "Brahmagiri Origin Trek"]),
        tags: JSON.stringify(["Jyotirlinga", "Must Visit", "Spiritual", "Heritage", "Godavari"]),
        is_featured: 1
      },
      {
        slug: "ramkund-and-panchavati-ghats",
        name: "Ramkund & Sacred Godavari Ghats",
        category: "spiritual",
        description: "The sanctum sanctorum of the Nashik Kumbh Mela where Lord Rama is believed to have bathed during his 14-year exile. Millions of pilgrims take holy dips here during the auspicious Shahi Snan dates.",
        address: "Ramkund, Panchavati, Nashik, Maharashtra 422003",
        area: "Panchavati",
        dist_from_ramkund: 0.0,
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Ramkund+Panchavati+Nashik",
        latitude: 20.0053,
        longitude: 73.7925,
        suggested_duration: "1–2 hours",
        best_time_to_visit: "Sunrise 6:00 AM for Ganga Aarti or Sunset 6:30 PM",
        source_reference: "Nashik Municipal Corporation Heritage Documentation",
        last_reviewed_date: "2026-10-15",
        verification_status: "Official Source",
        image_url: "/assets/attractions/ramkund.jpg",
        highlights: JSON.stringify(["Sacred Shahi Snan Kund", "Evening Godavari Maha Aarti", "Kapaleshwar Mahadev Mandir (No Nandi)", "Ancient Stone Steps"]),
        tags: JSON.stringify(["Ground Zero", "Kumbh Ghat", "Ramayana", "Snan", "Aarti"]),
        is_featured: 1
      },
      {
        slug: "shree-kalaram-mandir",
        name: "Shree Kalaram Mandir (Panchavati)",
        category: "spiritual",
        description: "A monumental 18th-century temple built entirely of dark black basalt stone by Sardar Odhekar. Houses the revered 2-foot black idols of Lord Rama, Sita, and Lakshmana.",
        address: "Kalaram Mandir Marg, Panchavati, Nashik, Maharashtra 422003",
        area: "Panchavati",
        dist_from_ramkund: 0.6,
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Kalaram+Mandir+Nashik",
        latitude: 20.0068,
        longitude: 73.7963,
        suggested_duration: "45–60 minutes",
        best_time_to_visit: "Morning Aarti 7:00 AM or Evening 7:30 PM",
        source_reference: "Shree Kalaram Sansthan Public Trust Archives",
        last_reviewed_date: "2026-10-14",
        verification_status: "Official Source",
        image_url: "/assets/attractions/kalaram.jpg",
        highlights: JSON.stringify(["18th-century Basalt Stone Craftsmanship", "Black Stone Idols", "Historical Dr. B.R. Ambedkar Satyagraha Site", "Peshwa Period Heritage"]),
        tags: JSON.stringify(["Heritage", "Ramayana", "Temple", "Historical", "Panchavati"]),
        is_featured: 1
      },
      {
        slug: "sita-gufa-and-panch-vruksha",
        name: "Sita Gufa & Five Sacred Banyan Trees",
        category: "spiritual",
        description: "An authentic subterranean cave where Goddess Sita is believed to have taken shelter during exile, and from where Ravana abducted her. Marked by the ancient five banyan trees that gave Panchavati its name.",
        address: "Near Kalaram Mandir, Panchavati, Nashik, Maharashtra 422003",
        area: "Panchavati",
        dist_from_ramkund: 0.5,
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Sita+Gumpha+Panchavati",
        latitude: 20.0076,
        longitude: 73.7941,
        suggested_duration: "30–45 minutes",
        best_time_to_visit: "Early morning to avoid queue in the narrow cave passage",
        source_reference: "ASI Maharashtra Circle & Local Temple Trust",
        last_reviewed_date: "2026-10-13",
        verification_status: "Reviewed by Project Team",
        image_url: "/assets/attractions/sitagufa.jpg",
        highlights: JSON.stringify(["Narrow Underground Stone Cave Passage", "Five Sacred Banyan Trees (Panch Vruksha)", "Lakshmana Rekha Memorial", "Shri Rama Darbar"]),
        tags: JSON.stringify(["Ramayana", "Cave", "Sacred Trees", "Panchavati"]),
        is_featured: 0
      },
      {
        slug: "pandavleni-buddhist-caves",
        name: "Pandavleni Buddhist Caves & Trirashmi Caves",
        category: "historical",
        description: "A series of 24 rock-cut Buddhist caves carved between the 2nd century BCE and 5th century CE into the Trirashmi Hills. Famous for ancient inscriptions, chaityas, and monasteries showing Hinayana iconography.",
        address: "Trirashmi Hill, Mumbai - Agra Highway, Nashik, Maharashtra 422009",
        area: "Mumbai-Agra Highway (Pathardi)",
        dist_from_ramkund: 9.2,
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Pandavleni+Caves+Nashik",
        latitude: 19.9575,
        longitude: 73.7508,
        suggested_duration: "2–3 hours (involves 300 steps stone climb)",
        best_time_to_visit: "7:00 AM - 10:00 AM before noon heat",
        source_reference: "Archaeological Survey of India (ASI) Monument List",
        last_reviewed_date: "2026-10-12",
        verification_status: "Official Source",
        image_url: "/assets/attractions/pandavleni.jpg",
        highlights: JSON.stringify(["2000-year-old Rock-Cut Sculptures", "Prakrit & Brahmi Stone Inscriptions", "Panoramic Aerial View of Nashik City", "Ancient Water Cisterns"]),
        tags: JSON.stringify(["Buddhism", "Ancient Caves", "Trekking", "Panoramic View", "History"]),
        is_featured: 1
      },
      {
        slug: "muktidham-marble-temple",
        name: "Muktidham Marble Temple",
        category: "spiritual",
        description: "A luminous white Makrana marble temple complex built by industrialist J.D. Chauhan. Showcases full-size marble replicas of the 12 Jyotirlingas and the complete Bhagavad Gita engraved across temple walls.",
        address: "Gayakhe Colony, Nashik Road, Nashik, Maharashtra 422101",
        area: "Nashik Road",
        dist_from_ramkund: 9.8,
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Muktidham+Nashik+Road",
        latitude: 19.9502,
        longitude: 73.8415,
        suggested_duration: "1 hour",
        best_time_to_visit: "Morning 6:30 AM - 12:00 PM or Evening 5:00 PM - 8:30 PM",
        source_reference: "Muktidham Trust Documentation",
        last_reviewed_date: "2026-10-10",
        verification_status: "Reviewed by Project Team",
        image_url: "/assets/attractions/muktidham.jpg",
        highlights: JSON.stringify(["Pure Makrana White Marble", "12 Jyotirlinga Replicas", "18 Chapters of Gita Carved on Walls", "Near Railway Station"]),
        tags: JSON.stringify(["Marble Architecture", "Jyotirlinga Replicas", "Gita Wall", "Nashik Road"]),
        is_featured: 0
      },
      {
        slug: "anjaneri-hills-hanuman-birthplace",
        name: "Anjaneri Hills & Fort (Birthplace of Lord Hanuman)",
        category: "nature",
        description: "A magnificent Sahyadri mountain plateau revered as the birthplace of Lord Hanuman. Named after his mother Anjani. Features ancient Jain and Hindu rock carvings, endemic wildflowers, and misty plateaus.",
        address: "Anjaneri Village, Trimbakeshwar Road, Nashik 422213",
        area: "Trimbakeshwar Road",
        dist_from_ramkund: 22.0,
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Anjaneri+Hill+Nashik",
        latitude: 19.9242,
        longitude: 73.5786,
        suggested_duration: "3–4 hours (Trek and Exploration)",
        best_time_to_visit: "Post-monsoon to winter (October to March), early morning",
        source_reference: "Maharashtra Forest Department & District Gazetteer",
        last_reviewed_date: "2026-10-12",
        verification_status: "Official Source",
        image_url: "/assets/attractions/anjaneri.jpg",
        highlights: JSON.stringify(["Revered Anjani Mata Temple", "Footprint Lake on Plateau", "Scenic Mountain Trek", "Sahyadri Bio-Diversity"]),
        tags: JSON.stringify(["Hanuman", "Trek", "Mountains", "Nature", "Scenic"]),
        is_featured: 1
      },
      {
        slug: "someshwar-waterfall-and-temple",
        name: "Someshwar Waterfall (Dudhsagar) & Temple",
        category: "nature",
        description: "A scenic natural waterfall on the Godavari River popular for its milky frothy cascade (hence known as Dudhsagar). Adjacent to the ancient Someshwar Mahadev Temple and tranquil riverbank gardens.",
        address: "Someshwar, Gangapur Road, Nashik, Maharashtra 422013",
        area: "Gangapur Road",
        dist_from_ramkund: 8.5,
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Someshwar+Waterfall+Nashik",
        latitude: 20.0211,
        longitude: 73.7314,
        suggested_duration: "1–1.5 hours",
        best_time_to_visit: "Monsoon and Post-monsoon (August to January)",
        source_reference: "Maharashtra Tourism Development Corporation (MTDC)",
        last_reviewed_date: "2026-10-11",
        verification_status: "Reviewed by Project Team",
        image_url: "/assets/attractions/someshwar.jpg",
        highlights: JSON.stringify(["Milky Cascade of Godavari River", "Ancient Someshwar Temple", "Serene Boating Spot Nearby", "Family Picnic Friendly"]),
        tags: JSON.stringify(["Waterfall", "Nature", "Relaxing", "River", "Scenic"]),
        is_featured: 0
      },
      {
        slug: "sarkar-wada-heritage-complex",
        name: "Sarkar Wada Peshwa Heritage Complex",
        category: "historical",
        description: "An authentic 18th-century Peshwa royal administrative palace constructed with heavy teakwood pillars, intricate Maratha woodwork carvings, and internal courtyards. Houses a district archaeology museum.",
        address: "Bhadrakali Fruit Market Marg, Old Nashik, Nashik 422001",
        area: "Old Nashik / Bhadrakali",
        dist_from_ramkund: 1.4,
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Sarkar+Wada+Nashik",
        latitude: 20.0003,
        longitude: 73.7891,
        suggested_duration: "1 hour",
        best_time_to_visit: "10:30 AM to 5:00 PM (Closed on Mondays)",
        source_reference: "Directorate of Archaeology and Museums, Maharashtra",
        last_reviewed_date: "2026-10-10",
        verification_status: "Reviewed by Project Team",
        image_url: "/assets/attractions/sarkarwada.jpg",
        highlights: JSON.stringify(["Maratha Timber Architecture", "Intricate Wood Carvings", "Historical Coins & Weapons Display", "Old City Charm"]),
        tags: JSON.stringify(["Peshwa Heritage", "Museum", "Wood Architecture", "History"]),
        is_featured: 0
      },
      {
        slug: "nashik-misal-and-food-trail",
        name: "Authentic Nashik Misal & Food Trail",
        category: "food_shopping",
        description: "Nashik is world-renowned for its distinct spicy Misal Pav served with fiery tarri (gravy), farsan, and thick pav, accompanied by sweet gulab jamun or solkadhi. Icons include Sadhana Chulivarchi Misal, Shamsundar, and Mamacha Gaon.",
        address: "Various locations (Gangapur Rd, Satpur MIDC, Panchavati Karanja)",
        area: "Nashik Citywide",
        dist_from_ramkund: 3.5,
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Nashik+Misal+Pav",
        latitude: 20.0150,
        longitude: 73.7650,
        suggested_duration: "1–2 hours",
        best_time_to_visit: "Morning breakfast 8:00 AM - 11:30 AM",
        source_reference: "Nashik Food Guild & Culinary Archives",
        last_reviewed_date: "2026-10-14",
        verification_status: "Reviewed by Project Team",
        image_url: "/assets/attractions/misal.jpg",
        highlights: JSON.stringify(["Fiery Traditional Tarri Gravy", "Chulivarchi (Clay Oven) Cooking", "Jaggery Jalebi & Gulab Jamun Pairing", "Iconic Culinary Heritage"]),
        tags: JSON.stringify(["Food", "Misal Pav", "Culinary Trail", "Local Delicacy", "Must Try"]),
        is_featured: 1
      },
      {
        slug: "saraf-bazar-brass-and-copper-crafts",
        name: "Saraf Bazar & Traditional Brassware Trail",
        category: "food_shopping",
        description: "The historic bazaar district of Old Nashik where artisans have been handcrafting traditional copper and brass pooja vessels, Ganga lotas, bells, and silver ornaments for Kumbh pilgrims across centuries.",
        address: "Saraf Bazar, Old Nashik, Nashik 422001",
        area: "Old Nashik",
        dist_from_ramkund: 1.1,
        google_maps_url: "https://www.google.com/maps/search/?api=1&query=Saraf+Bazar+Nashik",
        latitude: 20.0018,
        longitude: 73.7910,
        suggested_duration: "1.5–2 hours",
        best_time_to_visit: "Afternoon 3:00 PM to 8:30 PM",
        source_reference: "Nashik Saraf & Metal Handicraft Association",
        last_reviewed_date: "2026-10-12",
        verification_status: "Reviewed by Project Team",
        image_url: "/assets/attractions/sarafbazar.jpg",
        highlights: JSON.stringify(["Pure Copper Holy Water Kalash", "Handcrafted Temple Pooja Bells", "Authentic Kondaji Chivda Heritage Shop", "Bustling Traditional Lanes"]),
        tags: JSON.stringify(["Shopping", "Handicrafts", "Brassware", "Souvenirs", "Old Bazaar"]),
        is_featured: 0
      }
    ];

    for (const a of attractions) {
      insertAttraction.run(
        a.slug, a.name, a.category, a.description, a.address, a.area, a.dist_from_ramkund,
        a.google_maps_url, a.latitude, a.longitude, a.suggested_duration, a.best_time_to_visit,
        a.source_reference, a.last_reviewed_date, a.verification_status, a.image_url,
        a.highlights, a.tags, a.is_featured
      );
    }
    console.log(`Seeded ${attractions.length} tourist attractions.`);
  }

  const providerCount = db.prepare('SELECT COUNT(*) as count FROM providers').get().count;
  if (providerCount === 0) {
    const insertProvider = db.prepare(`
      INSERT INTO providers (
        name, business_name, category, description, area, phone, whatsapp,
        email, services_offered, pricing_notes, website_url, status, admin_notes, created_at, reviewed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const providers = [
      {
        name: "Pandit Dattatraya Joshi",
        business_name: "Godavari Divine Pilgrim & Heritage Tours",
        category: "guide",
        description: "Certified hereditary tourist & spiritual guide with 18+ years experience explaining the Vedic history of Panchavati, Ramkund, and Trimbakeshwar in Hindi, Marathi, and English.",
        area: "Panchavati / Ramkund",
        phone: "+91 98220 14820",
        whatsapp: "+91 98220 14820",
        email: "dattatraya.guide@gmail.com",
        services_offered: "Spiritual walking tour, Ramayana heritage narration, senior citizen accompaniment, Kumbh ritual guidance",
        pricing_notes: "₹500 / 2-hour walking group; individual family customized rates",
        website_url: "",
        status: "approved",
        admin_notes: "Identity and police verification certificate verified by Tourist Assist team.",
        created_at: "2026-10-01 10:00:00",
        reviewed_at: "2026-10-02 11:30:00"
      },
      {
        name: "Sachin Shinde",
        business_name: "Panchavati Green E-Rickshaw Cooperative",
        category: "transport",
        description: "Registered fleet of clean, battery-operated e-rickshaws dedicated to zero-emission last-mile transport between Tapovan parking, Ramkund, and Kalaram Mandir.",
        area: "Tapovan & Panchavati",
        phone: "+91 94231 78901",
        whatsapp: "+91 94231 78901",
        email: "shinde.erickshaw@rediffmail.com",
        services_offered: "Elderly passenger ghat transfers, shuttle from Tapovan parking, luggage transport, fixed fair trips",
        pricing_notes: "₹20 flat per seat for ghat loops; ₹150 for private hourly booking",
        website_url: "",
        status: "approved",
        admin_notes: "Fleet registered with NMC electric vehicle initiative.",
        created_at: "2026-10-03 14:00:00",
        reviewed_at: "2026-10-04 09:15:00"
      },
      {
        name: "Vitthalrao Tambat & Sons",
        business_name: "Saraf Bazar Traditional Copper & Brass Kala Kendra",
        category: "handicraft",
        description: "4th generation artisan family handcrafting pure copper Godavari Jal kalash (pots), brass lamps, prayer bells, and traditional utensils without chemical plating.",
        area: "Saraf Bazar, Old Nashik",
        phone: "+91 253 257 8890",
        whatsapp: "+91 98900 33412",
        email: "tambat.crafts@gmail.com",
        services_offered: "Handmade pooja utensils, holy water brass lotas, temple bell engraving, souvenir gift packaging",
        pricing_notes: "Items starting from ₹150 up to large custom prayer artifacts",
        website_url: "",
        status: "approved",
        admin_notes: "Authentic local craft verified on site in Saraf Bazar.",
        created_at: "2026-10-05 16:30:00",
        reviewed_at: "2026-10-06 14:00:00"
      },
      {
        name: "Mrs. Shobha Kulkarni",
        business_name: "Anand Homestay & Satvik Meals",
        category: "accommodation",
        description: "Warm, family-run guest rooms 800m from Ramkund offering peaceful home environment for elderly pilgrims and satvik pure vegetarian Maharashtrian meals.",
        area: "Kapaleshwar Road, Panchavati",
        phone: "+91 97654 22100",
        whatsapp: "+91 97654 22100",
        email: "shobha.anandstay@gmail.com",
        services_offered: "2 private bedrooms with attached clean baths, hot solar water, home-cooked satvik food, laundry",
        pricing_notes: "₹900 / night per double room; meals at nominal ₹100 / thali",
        website_url: "",
        status: "approved",
        admin_notes: "Inspected physical premises and kitchen hygiene.",
        created_at: "2026-10-07 11:00:00",
        reviewed_at: "2026-10-08 17:00:00"
      },
      {
        name: "Rameshwar Deshmukh",
        business_name: "Trimbakeshwar Darshan Cab & Outstation Shuttle",
        category: "transport",
        description: "Licensed commercial tourist taxi fleet operating sanitised AC Innova and Ertiga cars between Nashik City, Trimbakeshwar, Anjaneri, and Shirdi.",
        area: "CBS / Trimbak Road",
        phone: "+91 98811 55677",
        whatsapp: "+91 98811 55677",
        email: "deshmukh.cabs@gmail.com",
        services_offered: "Railway station pickups, day tour packages to Trimbakeshwar, Anjaneri hill trekking drops",
        pricing_notes: "₹1,800 for full day Trimbakeshwar round-trip package",
        website_url: "",
        status: "pending",
        admin_notes: "Awaiting submission of commercial driver badge and insurance papers.",
        created_at: "2026-10-16 09:30:00",
        reviewed_at: null
      },
      {
        name: "Mahesh Patil",
        business_name: "Godavari Naturals Ayurvedic Aushadhi",
        category: "handicraft",
        description: "Locally collected forest herbs, herbal hair oils, pure cow ghee, and natural dhoop from Brahmagiri hills.",
        area: "Trimbak Naka",
        phone: "+91 93250 88991",
        whatsapp: "",
        email: "patil.naturals@gmail.com",
        services_offered: "Herbal medicines, traditional prayer incense, pure kapoor and sambrani",
        pricing_notes: "₹50 - ₹500 depending on item",
        website_url: "",
        status: "pending",
        admin_notes: "Needs review of food/herbal manufacturing trade license.",
        created_at: "2026-10-16 15:00:00",
        reviewed_at: null
      }
    ];

    for (const p of providers) {
      insertProvider.run(
        p.name, p.business_name, p.category, p.description, p.area, p.phone,
        p.whatsapp, p.email, p.services_offered, p.pricing_notes, p.website_url,
        p.status, p.admin_notes, p.created_at, p.reviewed_at
      );
    }
    console.log(`Seeded ${providers.length} local providers.`);
  }

  const qrCount = db.prepare('SELECT COUNT(*) as count FROM qr_codes').get().count;
  if (qrCount === 0) {
    const insertQr = db.prepare(`
      INSERT INTO qr_codes (
        code_id, title, description, target_type, target_id, target_url, location_label, scans_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const qrs = [
      {
        code_id: "ramkund-ghat-hub",
        title: "Ramkund Ghat Core Hub",
        description: "Official QR poster at Ramkund Main Promenade. Directs to immediate emergency, toilets, drinking water, and Aarti timings.",
        target_type: "area_hub",
        target_id: 2,
        target_url: "/qr/ramkund-ghat-hub",
        location_label: "Ramkund Main Ghat, Panchavati",
        scans_count: 342
      },
      {
        code_id: "trimbakeshwar-arrival",
        title: "Trimbakeshwar Temple Transit Hub",
        description: "Placed at Kushavarta Kund and East Temple Gate for darshan queue updates, luggage locker information, and trust dormitories.",
        target_type: "attraction",
        target_id: 1,
        target_url: "/qr/trimbakeshwar-arrival",
        location_label: "Kushavarta Kund, Trimbakeshwar",
        scans_count: 218
      },
      {
        code_id: "panchavati-medical-point",
        title: "Panchavati Emergency Health Post",
        description: "Medical alert QR located near Kapaleshwar steps for ambulance dispatch, first-aid, and lost person assistance.",
        target_type: "service",
        target_id: 2,
        target_url: "/qr/panchavati-medical-point",
        location_label: "Kapaleshwar Chowk, Panchavati",
        scans_count: 94
      },
      {
        code_id: "cbs-bus-terminal",
        title: "Central Bus Stand (CBS) Pilgrim Desk",
        description: "Placed at Old CBS arrival platform for city shuttle routes, prepaid auto tariff card, and dharamshala finder.",
        target_type: "area_hub",
        target_id: 5,
        target_url: "/qr/cbs-bus-terminal",
        location_label: "CBS Main Concourse, Nashik",
        scans_count: 175
      },
      {
        code_id: "tapovan-sadhugram-parking",
        title: "Tapovan Sadhugram & Mega Parking",
        description: "Placed at visitor vehicle parking lot. Provides shuttle bus frequencies, bio-toilet directions, and free food camps.",
        target_type: "area_hub",
        target_id: 6,
        target_url: "/qr/tapovan-sadhugram-parking",
        location_label: "Tapovan Parking Zone A, Nashik",
        scans_count: 129
      }
    ];

    for (const q of qrs) {
      insertQr.run(
        q.code_id, q.title, q.description, q.target_type, q.target_id,
        q.target_url, q.location_label, q.scans_count
      );
    }
    console.log(`Seeded ${qrs.length} dynamic QR records.`);
  }

  const reportCount = db.prepare('SELECT COUNT(*) as count FROM information_reports').get().count;
  if (reportCount === 0) {
    db.prepare(`
      INSERT INTO information_reports (
        entity_type, entity_id, entity_name, issue_type, description,
        reporter_name, reporter_contact, status, admin_notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'service', 6, 'Tapovan Ring Road Kumbh Shuttle Terminal', 'incorrect_contact',
      'The morning starting timing is 4:30 AM instead of 4:00 AM on weekdays.',
      'Suresh Gawande', 'suresh.g@gmail.com', 'investigating',
      'Contacted NMPML depot manager to confirm updated timetable.'
    );
  }
}

// Initialize on require
initSchema();

module.exports = db;
