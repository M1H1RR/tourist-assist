import { supabase, isSupabaseConfigured } from './supabase';

// ============================================================================
// 10 Core Nashik Tourist Destinations Configuration
// ============================================================================
export const DESTINATIONS = [
  {
    id: 'sita-gufa',
    slug: 'sita-gufa-and-panch-vruksha',
    aliases: ['sita-gufa', 'sitagufa', 'panch-vruksha'],
    name: 'Sita Gufa & Panch Vruksha',
    nameLocal: 'सीता गुंफा आणि पंचवटी',
    category: 'Spiritual',
    area: 'Panchavati, Nashik',
    address: 'Near Kalaram Mandir, Panchavati, Nashik, Maharashtra 422003',
    lat: 20.0076,
    lng: 73.7941,
    image: '/assets/attractions/sitagufa.jpg',
    duration: '30–45 Mins',
    bestTime: 'Early morning 6:30 AM – 9:00 AM',
    description: 'Ancient sacred subterranean stone cave where Goddess Sita took sanctuary during Lord Rama\'s exile, shaded by five ancient banyan trees that give Panchavati its sacred name.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sita+Gumpha+Panchavati+Nashik',
    tags: ['Ramayana Heritage', 'Panch Vruksha', 'Ancient Cave Sanctuary']
  },
  {
    id: 'ramkund',
    slug: 'ramkund-and-panchavati-ghats',
    aliases: ['ramkund', 'panchavati-ghats', 'godavari-ghat'],
    name: 'Ramkund & Sacred Godavari Ghats',
    nameLocal: 'रामकुंड आणि गोदावरी घाट',
    category: 'Spiritual',
    area: 'Panchavati, Nashik',
    address: 'Ramkund, Godavari Ghat, Panchavati, Nashik, Maharashtra 422003',
    lat: 20.0053,
    lng: 73.7925,
    image: '/assets/attractions/ramkund.jpg',
    duration: '1–2 Hours',
    bestTime: 'Sunrise 6:00 AM (Aarti) / Sunset 6:30 PM (Maha Aarti)',
    description: 'Ground Zero of the Nashik Maha Kumbh Mela where millions take the holy Shahi Snan. Sacred water basin where Lord Rama performed obsequies for his father King Dasharatha.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ramkund+Panchavati+Nashik',
    tags: ['Kumbh Epicenter', 'Shahi Snan', 'Godavari Aarti', 'Ground Zero']
  },
  {
    id: 'kalaram',
    slug: 'shree-kalaram-mandir',
    aliases: ['kalaram', 'kalaram-temple', 'shree-kalaram'],
    name: 'Shree Kalaram Mandir',
    nameLocal: 'श्री काळाराम मंदिर',
    category: 'Spiritual',
    area: 'Panchavati, Nashik',
    address: 'Kalaram Mandir Marg, Panchavati, Nashik, Maharashtra 422003',
    lat: 20.0068,
    lng: 73.7963,
    image: '/assets/attractions/kalaram.jpg',
    duration: '45–60 Mins',
    bestTime: 'Morning 7:00 AM / Evening 7:30 PM',
    description: 'Magnificent 18th-century temple built entirely of carved black basalt stone by Sardar Rangrao Odhekar. Houses revered black stone deities of Lord Rama, Sita, and Lakshmana.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kalaram+Mandir+Nashik',
    tags: ['Black Basalt Stone', 'Peshwa Architecture', 'Ramayana Corridor']
  },
  {
    id: 'tapovan',
    slug: 'tapovan-sadhugram-nashik',
    aliases: ['tapovan', 'sadhugram', 'lakshman-kund'],
    name: 'Tapovan & Lakshman Kund',
    nameLocal: 'तपोवन आणि साधुग्राम',
    category: 'Spiritual',
    area: 'Tapovan, Nashik',
    address: 'Tapovan Sadhugram Approach, Aurangabad Road, Nashik 422003',
    lat: 20.0018,
    lng: 73.8085,
    image: '/assets/attractions/default.jpg',
    duration: '1–2 Hours',
    bestTime: 'Morning 6:00 AM – 10:00 AM',
    description: 'Sacred penance hermitage of ancient rishis where Lakshmana cut Surpanakha\'s nose. During Kumbh Mela, it becomes the sprawling Sadhugram tented township housing thousands of holy sadhus.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tapovan+Nashik',
    tags: ['Sadhugram', 'Lakshman Kund', 'Forest Hermitage', 'Akhada Encampment']
  },
  {
    id: 'pandavleni',
    slug: 'pandavleni-buddhist-caves',
    aliases: ['pandavleni', 'pandavleni-caves', 'trirashmi-caves'],
    name: 'Pandavleni Buddhist Caves',
    nameLocal: 'पांडवलेणी बौद्ध लेणी (त्रिरश्मी)',
    category: 'Historical',
    area: 'Pathardi / Highway, Nashik',
    address: 'Trirashmi Hill, Mumbai - Agra National Highway, Nashik 422009',
    lat: 19.9575,
    lng: 73.7508,
    image: '/assets/attractions/pandavleni.jpg',
    duration: '2–3 Hours',
    bestTime: '7:00 AM – 10:00 AM (Cool morning breeze)',
    description: 'Series of 24 rock-cut Hinayana Buddhist monasteries and chaityas carved into Trirashmi Hill between 2nd century BCE and 5th century CE with ancient Brahmi inscriptions.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pandavleni+Caves+Nashik',
    tags: ['2000-Yr Caves', 'Brahmi Epigraphy', 'Hinayana Buddhism', 'ASI Heritage']
  },
  {
    id: 'trimbakeshwar',
    slug: 'trimbakeshwar-jyotirlinga-mandir',
    aliases: ['trimbakeshwar', 'trimbak', 'jyotirlinga'],
    name: 'Trimbakeshwar Jyotirlinga Mandir',
    nameLocal: 'श्री त्र्यंबकेश्वर ज्योतिर्लिंग मंदिर',
    category: 'Spiritual',
    area: 'Trimbak, Nashik District',
    address: 'Shrimant Peshwa Path, Trimbak, Maharashtra 422212',
    lat: 19.9324,
    lng: 73.5309,
    image: '/assets/attractions/trimbakeshwar.jpg',
    duration: '2–3 Hours',
    bestTime: 'Early morning 5:30 AM – 11:30 AM',
    description: 'One of the twelve sacred Jyotirlingas of Lord Shiva. Unique three-faced linga representing Brahma, Vishnu, and Maheshwar at the foothills of Brahmagiri Mountain, origin of the holy Godavari River.',
    googleMapsUrl: 'https://maps.google.com/?cid=1743644265437882903',
    tags: ['12 Jyotirlinga', 'Godavari Origin', 'Kushavarta Kund', 'Brahmagiri']
  },
  {
    id: 'anjaneri',
    slug: 'anjaneri-hills-hanuman-birthplace',
    aliases: ['anjaneri', 'anjaneri-hills', 'anjaneri-fort'],
    name: 'Anjaneri Hills & Fort',
    nameLocal: 'अंजनेरी टेकडी (हनुमान जन्मस्थान)',
    category: 'Nature',
    area: 'Trimbakeshwar Road, Nashik',
    address: 'Anjaneri Village, Trimbakeshwar Road, Nashik 422213',
    lat: 19.9242,
    lng: 73.5786,
    image: '/assets/attractions/anjaneri.jpg',
    duration: '3–4 Hours',
    bestTime: 'Sunrise 6:00 AM (Post-monsoon to winter)',
    description: 'Revered birthplace of Lord Hanuman named after his mother Mata Anjani. Features misty plateaus, cave shrines, a foot-shaped lake, and panoramic Sahyadri mountain trekking trails.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Anjaneri+Hill+Nashik',
    tags: ['Hanuman Janmabhoomi', 'Sahyadri Trek', 'Misty Plateau', 'Cave Temples']
  },
  {
    id: 'someshwar',
    slug: 'someshwar-waterfall-and-temple',
    aliases: ['someshwar', 'dudhsagar-waterfall', 'someshwar-waterfall'],
    name: 'Someshwar Temple & Dudhsagar Waterfall',
    nameLocal: 'सोमेश्वर धबधबा आणि महादेव मंदिर',
    category: 'Nature',
    area: 'Gangapur Road, Nashik',
    address: 'Someshwar, Gangapur Road, Nashik, Maharashtra 422013',
    lat: 20.0211,
    lng: 73.7314,
    image: '/assets/attractions/someshwar.jpg',
    duration: '1–2 Hours',
    bestTime: 'Monsoon & Winter (August to February)',
    description: 'Milky frothy cascade formed on the Godavari River accompanied by an ancient temple dedicated to Lord Someshwar Mahadev, offering scenic riverside stone ghats.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Someshwar+Waterfall+Nashik',
    tags: ['Dudhsagar Cascade', 'Godavari Waterfall', 'Mahadev Mandir', 'Picnic Spot']
  },
  {
    id: 'gangapur-dam',
    slug: 'gangapur-dam-and-backwaters',
    aliases: ['gangapur', 'gangapur-dam', 'nashik-boat-club'],
    name: 'Gangapur Dam & Backwaters',
    nameLocal: 'गंगापूर धरण आणि बॅकवॉटर',
    category: 'Nature',
    area: 'Gangapur Road, Nashik',
    address: 'Gangapur Dam Road, Nashik, Maharashtra 422222',
    lat: 20.0450,
    lng: 73.6800,
    image: '/assets/attractions/default.jpg',
    duration: '2 Hours',
    bestTime: 'Late afternoon 4:00 PM – 6:30 PM (Sunset)',
    description: 'Massive earthfill dam across the Godavari River forming scenic backwaters with MTDC boat club water sports, migratory birds, and sunset viewpoints along the wine valley.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Gangapur+Dam+Nashik',
    tags: ['Earthfill Dam', 'MTDC Boat Club', 'Sunset Point', 'Wine Valley Corridor']
  },
  {
    id: 'muktidham',
    slug: 'muktidham-marble-temple',
    aliases: ['muktidham', 'muktidham-temple'],
    name: 'Muktidham Marble Temple',
    nameLocal: 'मुक्तिधाम संगमरवरी मंदिर',
    category: 'Spiritual',
    area: 'Nashik Road, Nashik',
    address: 'Gayakhe Colony, Nashik Road, Nashik, Maharashtra 422101',
    lat: 19.9502,
    lng: 73.8415,
    image: '/assets/attractions/muktidham.jpg',
    duration: '1 Hour',
    bestTime: 'Morning 7:00 AM – 11:30 AM / Evening 5:00 PM – 8:30 PM',
    description: 'Pristine Makrana white marble temple showcasing full-scale replicas of the 12 sacred Jyotirlingas with chapters of the Bhagavad Gita meticulously engraved upon its inner walls.',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Muktidham+Nashik+Road',
    tags: ['Makrana White Marble', '12 Jyotirlinga Replicas', 'Gita Engravings', 'Near Railway Station']
  }
];

// ============================================================================
// 12 Essential Facility Categories Configuration
// ============================================================================
export const FACILITY_CATEGORIES = {
  medical: {
    key: 'medical',
    name: 'Hospitals & Medical',
    iconName: 'HeartPulse',
    iconText: '🏥',
    color: '#EF4444', // Red
    bgColor: 'rgba(239, 68, 68, 0.12)',
    borderColor: 'rgba(239, 68, 68, 0.35)',
    description: 'Emergency trauma hospitals, acute ICUs, and 24/7 casualty centers.'
  },
  first_aid: {
    key: 'first_aid',
    name: 'First Aid & Camps',
    iconName: 'PlusCircle',
    iconText: '🩹',
    color: '#F43F5E', // Rose
    bgColor: 'rgba(244, 63, 94, 0.12)',
    borderColor: 'rgba(244, 63, 94, 0.35)',
    description: 'Disaster management medical posts, ORS hydration camps, and dressings.'
  },
  police: {
    key: 'police',
    name: 'Police & Security',
    iconName: 'Shield',
    iconText: '👮',
    color: '#3B82F6', // Blue
    bgColor: 'rgba(59, 130, 246, 0.12)',
    borderColor: 'rgba(59, 130, 246, 0.35)',
    description: 'Police stations, 24/7 pilgrim safety chowkis, and beat patrol desks.'
  },
  lost_found: {
    key: 'lost_found',
    name: 'Lost & Found',
    iconName: 'Search',
    iconText: '📢',
    color: '#EC4899', // Pink
    bgColor: 'rgba(236, 72, 153, 0.12)',
    borderColor: 'rgba(236, 72, 153, 0.35)',
    description: 'Missing person registry, PA system announcements, and child tracking.'
  },
  toilets: {
    key: 'toilets',
    name: 'Public Toilets',
    iconName: 'Sparkles',
    iconText: '🚻',
    color: '#8B5CF6', // Purple
    bgColor: 'rgba(139, 92, 246, 0.12)',
    borderColor: 'rgba(139, 92, 246, 0.35)',
    description: 'Sulabh complexes, clean sanitation stalls, and eco-friendly bio-toilets.'
  },
  water: {
    key: 'water',
    name: 'Drinking Water (RO)',
    iconName: 'Droplets',
    iconText: '🚰',
    color: '#06B6D4', // Cyan
    bgColor: 'rgba(6, 182, 212, 0.12)',
    borderColor: 'rgba(6, 182, 212, 0.35)',
    description: 'Free purified RO drinking water dispensers and chilled water kiosks.'
  },
  parking: {
    key: 'parking',
    name: 'Parking Areas',
    iconName: 'Car',
    iconText: '🅿️',
    color: '#6366F1', // Indigo
    bgColor: 'rgba(99, 102, 241, 0.12)',
    borderColor: 'rgba(99, 102, 241, 0.35)',
    description: 'Designated municipal car parking, bus bays, and satellite parking zones.'
  },
  bus_stop: {
    key: 'bus_stop',
    name: 'Bus Stops',
    iconName: 'Bus',
    iconText: '🚌',
    color: '#F97316', // Orange
    bgColor: 'rgba(249, 115, 22, 0.12)',
    borderColor: 'rgba(249, 115, 22, 0.35)',
    description: 'City MSRTC bus stops, electric shuttle loops, and intercity depots.'
  },
  auto_stand: {
    key: 'auto_stand',
    name: 'Auto Stands',
    iconName: 'Navigation',
    iconText: '🛺',
    color: '#EAB308', // Yellow
    bgColor: 'rgba(234, 179, 8, 0.12)',
    borderColor: 'rgba(234, 179, 8, 0.35)',
    description: 'RTO authorized prepaid auto-rickshaw booths with fixed police tariff cards.'
  },
  food: {
    key: 'food',
    name: 'Restaurants & Food',
    iconName: 'Utensils',
    iconText: '🍲',
    color: '#10B981', // Emerald
    bgColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
    description: 'Satvik dining halls, temple trust annachhatras, and local eateries.'
  },
  accommodation: {
    key: 'accommodation',
    name: 'Hotels & Yatri Niwas',
    iconName: 'Bed',
    iconText: '🛏️',
    color: '#D97706', // Amber
    bgColor: 'rgba(217, 119, 6, 0.12)',
    borderColor: 'rgba(217, 119, 6, 0.35)',
    description: 'Devasthan trust dormitories, registered homestays, and dharamshalas.'
  },
  tourist_info: {
    key: 'tourist_info',
    name: 'Tourist Help Centres',
    iconName: 'Info',
    iconText: 'ℹ️',
    color: '#14B8A6', // Teal
    bgColor: 'rgba(20, 184, 166, 0.12)',
    borderColor: 'rgba(20, 184, 166, 0.35)',
    description: 'Official MTDC and Municipal Corporation tourist guidance desks.'
  }
};

// ============================================================================
// Master Verified Facilities Dataset across Nashik & Trimbakeshwar
// ============================================================================
export const INITIAL_FACILITIES = [
  // --- PANCHAVATI SECTOR (Sita Gufa, Ramkund, Kalaram) ---
  {
    id: 'fac-suyog-hosp',
    name: 'Suyog Hospital',
    category: 'medical',
    categoryLabel: 'Hospital & Inpatient Care',
    description: 'Multi-bed surgical hospital with 24/7 casualty near Panchavati Karanja.',
    latitude: 20.0125,
    longitude: 73.7955,
    address: 'Dindori Road, Near Panchavati Karanja, Nashik 422003',
    area: 'Panchavati',
    contact_number: '+91 253 251 1234',
    opening_hours: '24/7 Emergency',
    verification_status: 'verified',
    source: 'Nashik Municipal Corporation Hospital Registry',
    last_verified_at: '2026-10-20',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Suyog+Hospital+Panchavati+Nashik',
    is_active: true
  },
  {
    id: 'fac-sadguru-hosp',
    name: 'Sadguru Hospital & Critical Care',
    category: 'medical',
    categoryLabel: 'Hospital & ICU Trauma',
    description: 'Emergency ICU and acute care hospital opposite Panchavati bus depot.',
    latitude: 20.0095,
    longitude: 73.7930,
    address: 'Hari Krishna Plaza, Opp. Panchavati Bus Depot, Nashik 422003',
    area: 'Panchavati',
    contact_number: '+91 253 262 1199',
    opening_hours: '24/7 Casualty & ICU',
    verification_status: 'verified',
    source: 'NMC Health Department Directory',
    last_verified_at: '2026-10-22',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sadguru+Hospital+Panchavati+Nashik',
    is_active: true
  },
  {
    id: 'fac-ramkund-first-aid',
    name: 'Ramkund Kumbh Central Medical & First Aid Camp',
    category: 'first_aid',
    categoryLabel: 'Disaster Care & First Aid Camp',
    description: 'Emergency disaster management tent equipped with paramedic ambulances and heatstroke care.',
    latitude: 20.0050,
    longitude: 73.7920,
    address: 'Main Ghat Escalator Area, Ramkund, Panchavati 422003',
    area: 'Panchavati',
    contact_number: '108',
    opening_hours: '24/7 Emergency Camp',
    verification_status: 'verified',
    source: 'District Disaster Management Authority (DDMA)',
    last_verified_at: '2026-10-25',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ramkund+Panchavati+Nashik',
    is_active: true
  },
  {
    id: 'fac-panchavati-police',
    name: 'Panchavati Police Station & Kumbh Helpdesk',
    category: 'police',
    categoryLabel: 'Police Station & Security Desk',
    description: 'Headquarters for Panchavati sector with dedicated pilgrim assistance desk.',
    latitude: 20.0080,
    longitude: 73.7950,
    address: 'Lok Sahakar Nagar Rd, Panchavati, Nashik 422003',
    area: 'Panchavati',
    contact_number: '+91 253 262 9830',
    opening_hours: '24/7 Control Room',
    verification_status: 'verified',
    source: 'Nashik City Police Official Portal',
    last_verified_at: '2026-10-25',
    mapsUrl: 'https://maps.google.com/?cid=4366729237185242046',
    is_active: true
  },
  {
    id: 'fac-katya-maruti-police',
    name: 'Katya Maruti Police Chowki',
    category: 'police',
    categoryLabel: 'Police Chowki / Sub-Station',
    description: 'Beat policing booth guarding Ramkund approaches and river walkways.',
    latitude: 20.0062,
    longitude: 73.7928,
    address: 'Near Katya Maruti Mandir, Panchavati, Nashik 422003',
    area: 'Panchavati',
    contact_number: '112',
    opening_hours: '24/7 Patrol Post',
    verification_status: 'verified',
    source: 'Nashik City Police Beat Map',
    last_verified_at: '2026-10-25',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Katya+Maruti+Panchavati+Nashik',
    is_active: true
  },
  {
    id: 'fac-panchavati-lost-found',
    name: 'Panchavati Kumbh Lost & Found Assistance Center',
    category: 'lost_found',
    categoryLabel: 'Lost & Found Center',
    description: 'Central missing person registration and public announcement system booth.',
    latitude: 20.0078,
    longitude: 73.7946,
    address: 'Near Sita Gufa Entrance, Lok Sahakar Nagar, Nashik 422003',
    area: 'Panchavati',
    contact_number: '+91 253 262 9830',
    opening_hours: '24/7 Desk',
    verification_status: 'verified',
    source: 'Nashik Police & Disaster Management Portal',
    last_verified_at: '2026-10-25',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sita+Gumpha+Panchavati',
    is_active: true
  },
  {
    id: 'fac-sbm-toilet-sitagufa',
    name: 'SBM Clean Modern Toilet Complex on Sita Gufa Road',
    category: 'toilets',
    categoryLabel: 'Public Sulabh Complex',
    description: 'Modern sanitation complex with clean running water and accessible ramps.',
    latitude: 20.0074,
    longitude: 73.7938,
    address: 'Sita Gufa Approach Road, Panchavati, Nashik 422003',
    area: 'Panchavati',
    contact_number: '1800-233-0011',
    opening_hours: '5:00 AM – 11:00 PM',
    verification_status: 'verified',
    source: 'Swachh Bharat Mission (SBM) Urban Portal',
    last_verified_at: '2026-10-18',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sita+Gumpha+Panchavati',
    is_active: true
  },
  {
    id: 'fac-ramkund-toilet',
    name: 'Ramkund Public Sulabh Shauchalaya & Bath Complex',
    category: 'toilets',
    categoryLabel: 'Sulabh Sanitation & Bathing Complex',
    description: 'Multi-cubicle bathing and urinal facility on the western ghat promenade.',
    latitude: 20.0050,
    longitude: 73.7910,
    address: 'Behind Sita Gufa Steps, Ramkund West Bank, Panchavati 422003',
    area: 'Panchavati',
    contact_number: '1800-233-0011',
    opening_hours: '4:00 AM – 11:30 PM',
    verification_status: 'verified',
    source: 'NMC Sanitation Department',
    last_verified_at: '2026-10-20',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ramkund+Toilet+Panchavati',
    is_active: true
  },
  {
    id: 'fac-sitagufa-water',
    name: 'Sita Gufa Pilgrim RO Drinking Water Point',
    category: 'water',
    categoryLabel: 'Chilled RO Water Dispenser',
    description: 'Automated hygienic RO drinking water kiosk for cave pilgrims.',
    latitude: 20.0075,
    longitude: 73.7943,
    address: 'East Entrance Steps, Sita Gufa, Panchavati 422003',
    area: 'Panchavati',
    contact_number: '1800-233-0011',
    opening_hours: '24/7 Automated Dispenser',
    verification_status: 'verified',
    source: 'NMC Water Supply Department',
    last_verified_at: '2026-10-20',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sita+Gumpha+Panchavati',
    is_active: true
  },
  {
    id: 'fac-ramkund-water',
    name: 'Ramkund Ghat Chilled RO Water Station',
    category: 'water',
    categoryLabel: 'High-Capacity RO Water Plant',
    description: 'Multi-spout chilled purified water fountain opposite Ganga Temple.',
    latitude: 20.0053,
    longitude: 73.7930,
    address: 'Ghat Promenade opposite Ganga Temple, Ramkund 422003',
    area: 'Panchavati',
    contact_number: '1800-233-0011',
    opening_hours: '24/7 Automated Dispenser',
    verification_status: 'verified',
    source: 'NMC Water Supply Department',
    last_verified_at: '2026-10-22',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ramkund+Nashik',
    is_active: true
  },
  {
    id: 'fac-panchavati-parking',
    name: 'Panchavati Municipal Car & Tourist Parking Area',
    category: 'parking',
    categoryLabel: 'Municipal Vehicle Parking',
    description: 'Paved municipal parking facility for light motor vehicles and tourist cars.',
    latitude: 20.0090,
    longitude: 73.7960,
    address: 'Near Sardar Chowk, Panchavati, Nashik 422003',
    area: 'Panchavati',
    contact_number: '+91 253 259 8811',
    opening_hours: '24/7 Operations',
    verification_status: 'verified',
    source: 'NMC Parking Authority',
    last_verified_at: '2026-10-20',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Panchavati+Parking+Nashik',
    is_active: true
  },
  {
    id: 'fac-panchavati-bus',
    name: 'Panchavati Karanja MSRTC City Bus Stop',
    category: 'bus_stop',
    categoryLabel: 'City Transit Bus Stop',
    description: 'Frequent bus connectivity to CBS, Nashik Road Railway Station, and Gangapur.',
    latitude: 20.0085,
    longitude: 73.7925,
    address: 'Panchavati Karanja, Nashik 422003',
    area: 'Panchavati',
    contact_number: '+91 253 257 5124',
    opening_hours: '5:30 AM – 11:30 PM',
    verification_status: 'verified',
    source: 'MSRTC City Bus Route Registry',
    last_verified_at: '2026-10-20',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Panchavati+Karanja+Nashik',
    is_active: true
  },
  {
    id: 'fac-panchavati-auto',
    name: 'Panchavati Karanja Prepaid Auto Stand',
    category: 'auto_stand',
    categoryLabel: 'Prepaid Auto-Rickshaw Stand',
    description: 'Authorized RTO auto-rickshaw booth operating on regulated meter fares.',
    latitude: 20.0070,
    longitude: 73.7955,
    address: 'Opp. Kalaram East Gate, Panchavati, Nashik 422003',
    area: 'Panchavati',
    contact_number: '+91 253 246 5432',
    opening_hours: '24/7 Registered Stand',
    verification_status: 'verified',
    source: 'Nashik RTO Authorized Auto Stand List',
    last_verified_at: '2026-10-20',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kalaram+Mandir+Nashik',
    is_active: true
  },
  {
    id: 'fac-kapaleshwar-food',
    name: 'Shree Kapaleshwar Bhojnalay',
    category: 'food',
    categoryLabel: 'Satvik Maharashtrian Bhojnalay',
    description: 'Clean, pure vegetarian satvik dining offering unlimited dal, roti, and vegetables.',
    latitude: 20.0090,
    longitude: 73.7945,
    address: 'Dindori Rd, Panchavati, Nashik 422003',
    area: 'Panchavati',
    contact_number: '+91 84463 58077',
    opening_hours: '11:00 AM – 10:30 PM',
    verification_status: 'verified',
    source: 'FSSAI Registered Local Dining',
    last_verified_at: '2026-10-20',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kapaleshwar+Bhojnalay+Panchavati',
    is_active: true
  },
  {
    id: 'fac-anand-homestay',
    name: 'Anand Homestay & Satvik Rooms',
    category: 'accommodation',
    categoryLabel: 'Registered Homestay & Rooms',
    description: 'Quiet, family-run guest rooms 150m from Ramkund offering peaceful stay.',
    latitude: 20.0065,
    longitude: 73.7935,
    address: 'Kapaleshwar Road, Panchavati, Nashik 422003',
    area: 'Panchavati',
    contact_number: '+91 97654 22100',
    opening_hours: 'Check-in: 6:00 AM – 10:00 PM',
    verification_status: 'verified',
    source: 'MTDC Registered Homestay Registry',
    last_verified_at: '2026-10-20',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ramkund+Panchavati+Nashik',
    is_active: true
  },
  {
    id: 'fac-ramkund-info',
    name: 'Ramkund Official Kumbh Tourist Facilitation Centre',
    category: 'tourist_info',
    categoryLabel: 'Official MTDC / NMC Helpdesk',
    description: 'On-ground assistance counter providing multilingual maps, guides, and schedules.',
    latitude: 20.0048,
    longitude: 73.7932,
    address: 'Ramkund Main Entrance, Panchavati 422003',
    area: 'Panchavati',
    contact_number: '1800-233-0011',
    opening_hours: '24/7 Pilgrim Desk',
    verification_status: 'verified',
    source: 'Official MTDC / NMC Information Desk',
    last_verified_at: '2026-10-25',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ramkund+Panchavati+Nashik',
    is_active: true
  },

  // --- TAPOVAN SECTOR ---
  {
    id: 'fac-tapovan-first-aid',
    name: 'Tapovan Sector 2 Medical & First Aid Station',
    category: 'first_aid',
    categoryLabel: 'Disaster Care First Aid Post',
    description: 'Tented pilgrim medical clinic offering hydration salts, dressings, and emergency ambulances.',
    latitude: 20.0022,
    longitude: 73.8090,
    address: 'Sadhugram Sector 2, Tapovan, Nashik 422003',
    area: 'Tapovan',
    contact_number: '108',
    opening_hours: '24/7 Emergency',
    verification_status: 'verified',
    source: 'NMC Kumbh Mela Health Cell',
    last_verified_at: '2026-10-25',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tapovan+Sadhugram+Nashik',
    is_active: true
  },
  {
    id: 'fac-tapovan-toilet',
    name: 'Tapovan Sadhugram Mega Bio-Toilet Block',
    category: 'toilets',
    categoryLabel: 'Eco-Friendly Bio-Toilets',
    description: '120 modular stalls with automated sanitization servicing Sadhugram pilgrim camps.',
    latitude: 20.0020,
    longitude: 73.8080,
    address: 'Sadhugram Sector 3, Near Annachhatra, Tapovan 422003',
    area: 'Tapovan',
    contact_number: '1800-233-0011',
    opening_hours: '24/7 Open',
    verification_status: 'verified',
    source: 'NMC Kumbh Infrastructure Project',
    last_verified_at: '2026-10-22',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tapovan+Sadhugram+Nashik',
    is_active: true
  },
  {
    id: 'fac-tapovan-water',
    name: 'Tapovan Sadhugram RO Water Distribution Hub',
    category: 'water',
    categoryLabel: 'High-Capacity RO Water Plant',
    description: 'Bulk purification water terminal supplying Sadhugram camps.',
    latitude: 20.0025,
    longitude: 73.8095,
    address: 'Near Sadhugram Sector 2, Tapovan, Nashik 422003',
    area: 'Tapovan',
    contact_number: '1800-233-0011',
    opening_hours: '24/7 Dispenser',
    verification_status: 'verified',
    source: 'NMC Water Works',
    last_verified_at: '2026-10-22',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tapovan+Nashik',
    is_active: true
  },
  {
    id: 'fac-tapovan-parking-a',
    name: 'Tapovan Mega Vehicle Parking Zone A',
    category: 'parking',
    categoryLabel: 'Designated Kumbh Mega Parking',
    description: 'Massive designated parking ground with direct shuttle loops to the ghats.',
    latitude: 20.0030,
    longitude: 73.8150,
    address: 'Aurangabad Highway Junction, Tapovan, Nashik 422003',
    area: 'Tapovan',
    contact_number: '+91 253 259 8811',
    opening_hours: '24/7 Operations',
    verification_status: 'verified',
    source: 'NMC Traffic Cell',
    last_verified_at: '2026-10-20',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tapovan+Parking+Nashik',
    is_active: true
  },
  {
    id: 'fac-tapovan-shuttle',
    name: 'Tapovan Ring Road Kumbh Electric Shuttle Terminal',
    category: 'bus_stop',
    categoryLabel: 'Green Shuttle Terminal',
    description: 'Dedicated loop shuttle terminal running zero-emission buses to Ramkund.',
    latitude: 20.0010,
    longitude: 73.8110,
    address: 'Tapovan Sadhugram Approach, Aurangabad Road, Nashik 422003',
    area: 'Tapovan',
    contact_number: '+91 253 259 8811',
    opening_hours: '4:00 AM – 12:00 AM',
    verification_status: 'verified',
    source: 'NMC Green Transit Project',
    last_verified_at: '2026-10-22',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tapovan+Nashik',
    is_active: true
  },

  // --- TRIMBAKESHWAR & ANJANERI SECTOR ---
  {
    id: 'fac-trimbak-rural-hosp',
    name: 'Trimbakeshwar Rural Hospital & Emergency Center',
    category: 'medical',
    categoryLabel: 'Govt Rural Hospital & ER',
    description: 'Government 30-bed healthcare center with 24/7 emergency casualty for Trimbak pilgrims.',
    latitude: 19.9315,
    longitude: 73.5305,
    address: 'Kushavarta Road, Trimbak, Nashik 422212',
    area: 'Trimbakeshwar',
    contact_number: '+91 2594 233 222',
    opening_hours: '24/7 Emergency',
    verification_status: 'verified',
    source: 'District Health Office Nashik',
    last_verified_at: '2026-10-25',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Trimbakeshwar+Hospital',
    is_active: true
  },
  {
    id: 'fac-trimbak-police',
    name: 'Trimbakeshwar Police Station',
    category: 'police',
    categoryLabel: 'Police Station',
    description: 'Main temple precinct police headquarters and lost-and-found registry.',
    latitude: 19.9330,
    longitude: 73.5315,
    address: 'Main Mandir Road, Trimbak 422212',
    area: 'Trimbakeshwar',
    contact_number: '+91 2594 233 133',
    opening_hours: '24/7 Operations',
    verification_status: 'verified',
    source: 'Maharashtra Police Directory',
    last_verified_at: '2026-10-25',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Trimbakeshwar+Police+Station',
    is_active: true
  },
  {
    id: 'fac-trimbak-yatri-niwas',
    name: 'Sri Trimbakeshwar Sansthan Yatri Niwas Dormitory',
    category: 'accommodation',
    categoryLabel: 'Pilgrim Devasthan Dormitory',
    description: 'Official temple trust dormitory with locker storage and hot water.',
    latitude: 19.9320,
    longitude: 73.5310,
    address: 'Main Mandir Road, Near Kushavarta Kund, Trimbak 422212',
    area: 'Trimbakeshwar',
    contact_number: '+91 2594 233 215',
    opening_hours: 'Check-in: 6:00 AM – 10:00 PM',
    verification_status: 'verified',
    source: 'Trimbakeshwar Devasthan Trust',
    last_verified_at: '2026-10-25',
    mapsUrl: 'https://maps.google.com/?cid=10331002220198273641',
    is_active: true
  },
  {
    id: 'fac-trimbak-bus-stand',
    name: 'Trimbakeshwar MSRTC Bus Stand',
    category: 'bus_stop',
    categoryLabel: 'Intercity Pilgrim Bus Depot',
    description: 'Connecting buses every 15 minutes to Nashik CBS and Mumbai.',
    latitude: 19.9350,
    longitude: 73.5340,
    address: 'Jawahar Road Junction, Trimbak 422212',
    area: 'Trimbakeshwar',
    contact_number: '+91 2594 233 121',
    opening_hours: '5:00 AM – 11:30 PM',
    verification_status: 'verified',
    source: 'MSRTC Bus Timetable',
    last_verified_at: '2026-10-20',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Trimbakeshwar+Bus+Stand',
    is_active: true
  },
  {
    id: 'fac-anjaneri-checkpost',
    name: 'Anjaneri Forest Checkpost & First Aid Booth',
    category: 'first_aid',
    categoryLabel: 'Trekker Safety & First Aid Post',
    description: 'Forest department registry and first aid desk for Anjaneri trekkers.',
    latitude: 19.9230,
    longitude: 73.5790,
    address: 'Anjaneri Trek Starting Point, Anjaneri Village 422213',
    area: 'Anjaneri',
    contact_number: '112',
    opening_hours: '6:00 AM – 6:00 PM',
    verification_status: 'verified',
    source: 'Maharashtra Forest Department',
    last_verified_at: '2026-10-20',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Anjaneri+Trek+Nashik',
    is_active: true
  },

  // --- PANDAVLENI & HIGHWAY SECTOR ---
  {
    id: 'fac-smbt-hosp',
    name: 'SMBT Hospital & Medical College Care Center',
    category: 'medical',
    categoryLabel: 'Multi-Specialty Hospital',
    description: 'Tertiary medical emergency center with ambulance fleet on highway near Pandavleni.',
    latitude: 19.9520,
    longitude: 73.7530,
    address: 'Mumbai-Agra National Highway, Near Pandavleni, Nashik 422009',
    area: 'Pathardi / Highway',
    contact_number: '+91 253 249 9000',
    opening_hours: '24/7 Emergency',
    verification_status: 'verified',
    source: 'NMC Hospital Registry',
    last_verified_at: '2026-10-22',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=SMBT+Hospital+Nashik',
    is_active: true
  },
  {
    id: 'fac-pandavleni-toilet',
    name: 'Pandavleni Foot-Hill ASI Toilet Complex',
    category: 'toilets',
    categoryLabel: 'ASI Clean Sanitation Facility',
    description: 'Archaeological Survey of India maintained public toilets at cave base.',
    latitude: 19.9585,
    longitude: 73.7515,
    address: 'Base Steps, Pandavleni Caves, Mumbai-Agra Highway 422009',
    area: 'Pathardi',
    contact_number: '1800-233-0011',
    opening_hours: '8:00 AM – 6:00 PM',
    verification_status: 'verified',
    source: 'ASI Western Circle Directory',
    last_verified_at: '2026-10-18',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pandavleni+Caves+Nashik',
    is_active: true
  },
  {
    id: 'fac-pandavleni-bus',
    name: 'Pandavleni Phata Highway Bus Stop',
    category: 'bus_stop',
    categoryLabel: 'Highway Transit Bus Stop',
    description: 'MSRTC express and city buses connecting to CBS and Pathardi Phata.',
    latitude: 19.9590,
    longitude: 73.7525,
    address: 'Trirashmi Phata, NH3, Nashik 422009',
    area: 'Pathardi',
    contact_number: '+91 253 257 5124',
    opening_hours: '5:30 AM – 11:00 PM',
    verification_status: 'verified',
    source: 'MSRTC Route Map',
    last_verified_at: '2026-10-20',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pandavleni+Bus+Stop',
    is_active: true
  },

  // --- SOMESHWAR & GANGAPUR DAM SECTOR ---
  {
    id: 'fac-six-sigma-hosp',
    name: 'Six Sigma Multi-Specialty Hospital',
    category: 'medical',
    categoryLabel: 'Hospital & Cardiac Care',
    description: 'Full-service acute hospital with 24/7 ICU along Gangapur Road corridor.',
    latitude: 20.0160,
    longitude: 73.7480,
    address: 'Gangapur Road, Near Mahatma Nagar, Nashik 422013',
    area: 'Gangapur Road',
    contact_number: '+91 253 234 5600',
    opening_hours: '24/7 Casualty',
    verification_status: 'verified',
    source: 'NMC Hospital Registry',
    last_verified_at: '2026-10-20',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Six+Sigma+Hospital+Nashik',
    is_active: true
  },
  {
    id: 'fac-gangapur-police',
    name: 'Gangapur Police Station',
    category: 'police',
    categoryLabel: 'Police Station',
    description: 'Covers Gangapur Dam, Someshwar waterfall, and agricultural vineyard corridors.',
    latitude: 20.0240,
    longitude: 73.7410,
    address: 'Gangapur Road, Near Someshwar Phata, Nashik 422013',
    area: 'Gangapur Road',
    contact_number: '+91 253 230 5233',
    opening_hours: '24/7 Control Room',
    verification_status: 'verified',
    source: 'Nashik City Police Directory',
    last_verified_at: '2026-10-25',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Gangapur+Police+Station+Nashik',
    is_active: true
  },
  {
    id: 'fac-someshwar-parking',
    name: 'Someshwar Waterfall Municipal Parking & Plaza',
    category: 'parking',
    categoryLabel: 'Paved Tourist Parking',
    description: 'Paved municipal parking with tea stalls and shade trees near Someshwar temple.',
    latitude: 20.0205,
    longitude: 73.7310,
    address: 'Someshwar Mandir Road, Gangapur Road, Nashik 422013',
    area: 'Gangapur Road',
    contact_number: '+91 253 259 8811',
    opening_hours: '6:00 AM – 7:30 PM',
    verification_status: 'verified',
    source: 'NMC Tourism Infrastructure',
    last_verified_at: '2026-10-20',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Someshwar+Waterfall+Nashik',
    is_active: true
  },
  {
    id: 'fac-mtdc-boat-club-info',
    name: 'MTDC Boat Club Tourist Information & Facilitation Center',
    category: 'tourist_info',
    categoryLabel: 'MTDC Tourist Facilitation Center',
    description: 'Official Maharashtra Tourism information and watersport booking counter.',
    latitude: 20.0440,
    longitude: 73.6815,
    address: 'Gangapur Dam Reservoir, Gangapur Road, Nashik 422222',
    area: 'Gangapur Dam',
    contact_number: '+91 253 223 0090',
    opening_hours: '9:00 AM – 6:30 PM',
    verification_status: 'verified',
    source: 'Maharashtra Tourism Development Corporation (MTDC)',
    last_verified_at: '2026-10-22',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=MTDC+Boat+Club+Nashik',
    is_active: true
  },

  // --- MUKTIDHAM & NASHIK ROAD SECTOR ---
  {
    id: 'fac-jankalyan-hosp',
    name: 'Jankalyan Multi-Specialty Hospital',
    category: 'medical',
    categoryLabel: 'Emergency Hospital',
    description: 'Multi-bed hospital 400m from Muktidham temple with round-the-clock emergency care.',
    latitude: 19.9520,
    longitude: 73.8360,
    address: 'Near Bytco Point, Nashik Road, Nashik 422101',
    area: 'Nashik Road',
    contact_number: '+91 253 246 1122',
    opening_hours: '24/7 Casualty',
    verification_status: 'verified',
    source: 'NMC Health Department Directory',
    last_verified_at: '2026-10-22',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Jankalyan+Hospital+Nashik+Road',
    is_active: true
  },
  {
    id: 'fac-upnagar-police',
    name: 'Upnagar Police Station',
    category: 'police',
    categoryLabel: 'Police Station',
    description: 'Jurisdiction covering Muktidham, Nashik Road market, and railway concourse.',
    latitude: 19.9620,
    longitude: 73.8290,
    address: 'Pune Road, Upnagar, Nashik 422006',
    area: 'Nashik Road',
    contact_number: '+91 253 241 1233',
    opening_hours: '24/7 Operations',
    verification_status: 'verified',
    source: 'Nashik City Police Portal',
    last_verified_at: '2026-10-25',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Upnagar+Police+Station+Nashik',
    is_active: true
  },
  {
    id: 'fac-nashik-road-auto',
    name: 'Nashik Road Railway Station Auto Stand',
    category: 'auto_stand',
    categoryLabel: 'Prepaid Railway Auto Booth',
    description: 'Fixed-fare police registered prepaid auto kiosk outside Platform 1.',
    latitude: 19.9540,
    longitude: 73.8370,
    address: 'Platform 1 Exit, Nashik Road Railway Station 422101',
    area: 'Nashik Road',
    contact_number: '+91 253 246 5432',
    opening_hours: '24/7 Operations',
    verification_status: 'verified',
    source: 'Nashik City Traffic Police Registry',
    last_verified_at: '2026-10-20',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Nashik+Road+Railway+Station',
    is_active: true
  },
  {
    id: 'fac-muktidham-dharamshala',
    name: 'Muktidham Trust Bhakt Niwas & Dharamshala',
    category: 'accommodation',
    categoryLabel: 'Pilgrim Trust Dharamshala',
    description: 'Affordable pilgrim accommodation operated by the Muktidham Temple Trust.',
    latitude: 19.9495,
    longitude: 73.8410,
    address: 'Opp. Muktidham Gate, Gayakhe Colony, Nashik Road 422101',
    area: 'Nashik Road',
    contact_number: '+91 253 246 1234',
    opening_hours: 'Check-in: 6:00 AM – 10:00 PM',
    verification_status: 'verified',
    source: 'Muktidham Temple Trust',
    last_verified_at: '2026-10-20',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Muktidham+Nashik+Road',
    is_active: true
  }
];

// ============================================================================
// Haversine Distance Calculation Formula (Accurate straight-line distance in km)
// ============================================================================
export function calculateHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  if (
    lat1 === undefined || lon1 === undefined ||
    lat2 === undefined || lon2 === undefined ||
    isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)
  ) {
    return 0;
  }

  const R = 6371; // Earth's mean radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 100) / 100; // 2 decimal places
}

export function formatDistance(distanceKm) {
  if (distanceKm === undefined || isNaN(distanceKm)) return 'N/A';
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
}

// ============================================================================
// Destination Lookup by Slug or Alias
// ============================================================================
export function getDestinationBySlug(slug) {
  if (!slug) return DESTINATIONS[0];
  const normalized = slug.trim().toLowerCase();
  
  const found = DESTINATIONS.find(d => 
    d.slug.toLowerCase() === normalized || 
    d.id.toLowerCase() === normalized ||
    (d.aliases && d.aliases.some(a => a.toLowerCase() === normalized))
  );

  return found || DESTINATIONS[0];
}

// In-memory facility store (allows admin additions/edits during session)
let localFacilitiesStore = [...INITIAL_FACILITIES];

// Load any stored admin facilities from browser localStorage if available
if (typeof window !== 'undefined') {
  try {
    const saved = localStorage.getItem('tourist_assist_admin_facilities');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        localFacilitiesStore = parsed;
      }
    }
  } catch (e) {
    // Graceful fallback
  }
}

// ============================================================================
// Destination-Wise Nearby Facilities Query Engine
// ============================================================================
export async function getDestinationFacilities(destination, options = {}) {
  const {
    radiusKm = 1.0,
    category = 'all',
    sortBy = 'nearest',
    searchQuery = '',
    customUserCoords = null
  } = options;

  let allFacilities = [...localFacilitiesStore];

  // Attempt to fetch fresh records from Supabase if configured
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('nearby_facilities')
        .select('*')
        .eq('is_active', true);

      if (!error && data && data.length > 0) {
        allFacilities = data.map(row => ({
          id: row.id,
          name: row.name,
          category: row.category,
          categoryLabel: row.category_label || (FACILITY_CATEGORIES[row.category]?.name || row.category),
          description: row.description,
          latitude: row.latitude,
          longitude: row.longitude,
          address: row.address,
          area: row.area,
          contact_number: row.contact_number,
          opening_hours: row.opening_hours,
          verification_status: row.verification_status || 'verified',
          source: row.source || 'Official Database',
          last_verified_at: row.last_verified_at || '2026-10-20',
          mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(row.name + ' ' + (row.area || 'Nashik'))}`,
          is_active: row.is_active
        }));
      }
    } catch (e) {
      console.warn('Supabase query failed, falling back to verified local dataset:', e.message);
    }
  }

  const baseLat = customUserCoords ? customUserCoords.lat : destination.lat;
  const baseLng = customUserCoords ? customUserCoords.lng : destination.lng;

  // Calculate straight-line distance for every facility from base coordinates
  const facilitiesWithDistance = allFacilities.map(f => {
    const distKm = calculateHaversineDistanceKm(baseLat, baseLng, f.latitude, f.longitude);
    return {
      ...f,
      distanceKm: distKm,
      distanceText: formatDistance(distKm),
      categoryInfo: FACILITY_CATEGORIES[f.category] || FACILITY_CATEGORIES.tourist_info
    };
  });

  // Build the 12 Categories Summary Dashboard
  const categoriesSummary = {};
  Object.keys(FACILITY_CATEGORIES).forEach(catKey => {
    const catConfig = FACILITY_CATEGORIES[catKey];
    const catFacilitiesAll = facilitiesWithDistance.filter(f => f.category === catKey);
    const catFacilitiesInRadius = catFacilitiesAll.filter(f => f.distanceKm <= radiusKm);

    // Nearest facility of this category regardless of radius
    const sortedAll = [...catFacilitiesAll].sort((a, b) => a.distanceKm - b.distanceKm);
    const nearestAny = sortedAll[0] || null;

    let status = 'NOT_FOUND_IN_DB';
    if (catFacilitiesInRadius.length > 0) {
      const hasUnverified = catFacilitiesInRadius.some(f => f.verification_status !== 'verified');
      status = hasUnverified ? 'NEEDS_VERIFICATION' : 'FOUND_NEARBY';
    }

    categoriesSummary[catKey] = {
      ...catConfig,
      count: catFacilitiesInRadius.length,
      status: status,
      facilitiesInRadius: catFacilitiesInRadius,
      nearestDistanceKm: nearestAny ? nearestAny.distanceKm : null,
      nearestDistanceText: nearestAny ? nearestAny.distanceText : null,
      nearestFacilityName: nearestAny ? nearestAny.name : null,
    };
  });

  // Filter facilities within chosen radius
  let filtered = facilitiesWithDistance.filter(f => f.distanceKm <= radiusKm);

  // Category Filter
  if (category && category !== 'all') {
    filtered = filtered.filter(f => f.category === category);
  }

  // Search Query Filter
  if (searchQuery && searchQuery.trim() !== '') {
    const q = searchQuery.trim().toLowerCase();
    filtered = filtered.filter(f => 
      f.name.toLowerCase().includes(q) ||
      (f.address && f.address.toLowerCase().includes(q)) ||
      (f.area && f.area.toLowerCase().includes(q)) ||
      (f.description && f.description.toLowerCase().includes(q)) ||
      (f.categoryLabel && f.categoryLabel.toLowerCase().includes(q))
    );
  }

  // Sorting
  if (sortBy === 'nearest') {
    filtered.sort((a, b) => a.distanceKm - b.distanceKm);
  } else if (sortBy === 'farthest') {
    filtered.sort((a, b) => b.distanceKm - a.distanceKm);
  } else if (sortBy === 'alphabetical') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  return {
    destination,
    baseLat,
    baseLng,
    radiusKm,
    totalInRadius: filtered.length,
    facilities: filtered,
    categoriesSummary,
    allFacilitiesWithDistance: facilitiesWithDistance
  };
}

// ============================================================================
// Admin Management API (Add, Edit, Update Status, Delete)
// ============================================================================
export async function adminSaveFacility(facilityData) {
  const isNew = !facilityData.id;
  const id = isNew ? `fac-custom-${Date.now()}` : facilityData.id;

  const newRecord = {
    ...facilityData,
    id,
    latitude: parseFloat(facilityData.latitude),
    longitude: parseFloat(facilityData.longitude),
    is_active: facilityData.is_active !== undefined ? facilityData.is_active : true,
    last_verified_at: new Date().toISOString().split('T')[0],
    mapsUrl: facilityData.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facilityData.name + ' ' + (facilityData.area || 'Nashik'))}`,
  };

  // Update in-memory store
  if (isNew) {
    localFacilitiesStore = [newRecord, ...localFacilitiesStore];
  } else {
    localFacilitiesStore = localFacilitiesStore.map(f => f.id === id ? newRecord : f);
  }

  // Persist to localStorage for persistence across page reloads
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('tourist_assist_admin_facilities', JSON.stringify(localFacilitiesStore));
    } catch (e) {}
  }

  // If Supabase is configured, upsert into database table
  if (isSupabaseConfigured()) {
    try {
      const payload = {
        name: newRecord.name,
        category: newRecord.category,
        category_label: newRecord.categoryLabel,
        description: newRecord.description,
        latitude: newRecord.latitude,
        longitude: newRecord.longitude,
        address: newRecord.address,
        area: newRecord.area,
        contact_number: newRecord.contact_number,
        opening_hours: newRecord.opening_hours,
        verification_status: newRecord.verification_status,
        source: newRecord.source,
        last_verified_at: newRecord.last_verified_at,
        is_active: newRecord.is_active
      };

      if (!isNew && !id.startsWith('fac-custom-')) {
        await supabase.from('nearby_facilities').update(payload).eq('id', id);
      } else {
        await supabase.from('nearby_facilities').insert([payload]);
      }
    } catch (e) {
      console.warn('Supabase admin save error:', e.message);
    }
  }

  return newRecord;
}

export async function adminDeleteFacility(id) {
  localFacilitiesStore = localFacilitiesStore.filter(f => f.id !== id);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('tourist_assist_admin_facilities', JSON.stringify(localFacilitiesStore));
    } catch (e) {}
  }

  if (isSupabaseConfigured()) {
    try {
      await supabase.from('nearby_facilities').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase admin delete error:', e.message);
    }
  }

  return true;
}

