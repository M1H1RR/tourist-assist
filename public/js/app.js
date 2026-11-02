/**
 * Tourist Assist Main Application Controller
 * Handles SPA navigation, data fetching, offline state, filtering, itinerary builder,
 * provider workflows, QR management, and admin dashboard operations.
 */

const App = {
  // Application State
  state: {
    currentView: 'home',
    currentLang: 'en',
    services: [],
    attractions: [],
    providers: [],
    stats: {},
    qrs: [],
    reports: [],
    // Filter states
    servicesFilter: {
      category: 'all',
      search: '',
      area: 'all',
      maxDist: 30.0,
      verificationStatus: 'all'
    },
    attractionsCategory: 'all',
    providerCategory: 'all',
    adminActiveTab: 'providers',
    isOffline: !navigator.onLine
  },

  // Multi-lingual Translation Dictionary
  i18n: {
    en: {
      nav_home: 'Home',
      nav_services: 'Pilgrim Assistance',
      nav_explore: 'Explore Nashik',
      nav_connect: 'Local Connect',
      nav_qr: 'QR Hub',
      hero_cta_services: 'Find Essential Services',
      hero_cta_explore: 'Explore Nashik',
      heading_quick_services: 'Essential Services for Pilgrims',
      btn_call: 'Call Helpline',
      btn_directions: 'Directions',
      btn_report: 'Report Info'
    },
    mr: {
      nav_home: 'मुख्यपृष्ठ',
      nav_services: 'भाविक साहाय्य',
      nav_explore: 'नाशिक दर्शन',
      nav_connect: 'स्थानिक सेवा',
      nav_qr: 'क्यूआर केंद्र',
      hero_cta_services: 'तातडीच्या सेवा शोधा',
      hero_cta_explore: 'नाशिक फिरा',
      heading_quick_services: 'भाविकांसाठी आवश्यक सेवा',
      btn_call: 'कॉल करा',
      btn_directions: 'मार्ग',
      btn_report: 'माहिती कळवा'
    }
  },

  // Initialization
  async init() {
    // Purge any stale legacy service worker caches immediately
    if ('caches' in window) {
      caches.keys().then(keys => {
        keys.forEach(k => {
          if (k.includes('kumbh') || k.includes('v1') || k.includes('v2')) {
            caches.delete(k);
          }
        });
      });
    }

    this.registerServiceWorker();
    this.setupNetworkListeners();
    this.setupHashRouting();
    this.updateOfflinePackTimestampDisplay();

    // Initial Data Fetch
    await this.fetchInitialData();

    // Check for direct QR view in URL
    const urlParams = new URLSearchParams(window.location.search);
    const qrCode = urlParams.get('qr');
    if (qrCode) {
      this.loadQrView(qrCode);
    }
  },

  // Service Worker Registration
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then(reg => console.log('Service Worker registered with scope:', reg.scope))
          .catch(err => console.error('Service Worker registration failed:', err));
      });
    }
  },

  // Setup Online / Offline Network State Listeners
  setupNetworkListeners() {
    const updateStatus = () => {
      const isOnline = navigator.onLine;
      this.state.isOffline = !isOnline;
      const badge = document.getElementById('network-status-badge');
      const text = document.getElementById('network-status-text');
      const alertBox = document.getElementById('offline-alert-box');

      if (isOnline) {
        badge.className = 'network-badge online';
        badge.innerHTML = '<i class="fa-solid fa-wifi"></i> <span>Online</span>';
        alertBox.classList.remove('active');
      } else {
        badge.className = 'network-badge offline';
        badge.innerHTML = '<i class="fa-solid fa-plane-slash"></i> <span>Offline Mode</span>';
        alertBox.classList.add('active');
        this.toast('You are now offline. Displaying cached records.', 'warning');
      }
    };

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    updateStatus();
  },

  // SPA Navigation and Hash Routing
  setupHashRouting() {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      this.navigate(hash, {}, false);
    };

    window.addEventListener('hashchange', handleHash);
    const initial = window.location.hash.replace('#', '') || 'home';
    this.navigate(initial, {}, false);
  },

  navigate(viewId, params = {}, updateHash = true) {
    if (updateHash) {
      window.location.hash = viewId;
    }

    this.state.currentView = viewId;

    // Toggle active view container
    document.querySelectorAll('.view-container').forEach(el => el.classList.remove('active-view'));
    const target = document.getElementById(`view-${viewId}`);
    if (target) {
      target.classList.add('active-view');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Toggle Desktop Navigation
    document.querySelectorAll('.desktop-nav .nav-link').forEach(btn => btn.classList.remove('active'));
    const activeDesktopBtn = document.getElementById(`nav-btn-${viewId}`);
    if (activeDesktopBtn) activeDesktopBtn.classList.add('active');

    // Toggle Mobile Navigation
    document.querySelectorAll('.bottom-nav-item').forEach(btn => btn.classList.remove('active'));
    const activeMobBtn = document.getElementById(`mob-nav-${viewId}`);
    if (activeMobBtn) activeMobBtn.classList.add('active');

    // Handle view-specific initializations
    if (viewId === 'home') {
      this.renderHomeFeaturedAttractions();
    } else if (viewId === 'services') {
      this.renderServices();
    } else if (viewId === 'explore') {
      this.renderAttractions();
    } else if (viewId === 'connect') {
      this.renderApprovedProviders();
      if (params.openForm) {
        const formCard = document.getElementById('provider-registration-box');
        if (formCard) formCard.classList.add('active');
      }
    } else if (viewId === 'admin') {
      this.checkAdminSession();
    } else if (viewId === 'qr') {
      this.loadQrView('ramkund-ghat-hub');
    }
  },

  // Initial Data Fetch
  async fetchInitialData() {
    try {
      const [servicesRes, attractionsRes, statsRes] = await Promise.all([
        API.getServices(),
        API.getAttractions(),
        API.getStats()
      ]);

      if (servicesRes.success) this.state.services = servicesRes.data;
      if (attractionsRes.success) this.state.attractions = attractionsRes.data;
      if (statsRes) {
        this.state.stats = statsRes;
        this.updateStatsCounters(statsRes);
      }

      this.renderHomeFeaturedAttractions();
    } catch (err) {
      console.error('Initial data fetch error:', err);
    }
  },

  // Update Stats Counters on Home View
  updateStatsCounters(stats) {
    const elServices = document.getElementById('stat-count-services');
    const elAttractions = document.getElementById('stat-count-attractions');
    const elProviders = document.getElementById('stat-count-providers');
    const elQrs = document.getElementById('stat-count-qrs');

    if (elServices && stats.totalServices) elServices.textContent = `${stats.totalServices}+`;
    if (elAttractions && stats.totalAttractions) elAttractions.textContent = `${stats.totalAttractions}+`;
    if (elProviders && stats.approvedProviders) elProviders.textContent = `${stats.approvedProviders}+`;
    if (elQrs && stats.totalQRs) elQrs.textContent = `${stats.totalQRs} Active`;
  },

  // Offline Emergency Pack Downloader
  async downloadOfflineEmergencyPack() {
    this.toast('Downloading complete offline package to device storage...', 'info');
    try {
      const [servicesRes, attractionsRes, providersRes] = await Promise.all([
        API.getServices(),
        API.getAttractions(),
        API.getApprovedProviders()
      ]);

      await window.offlineStore.saveOfflinePack({
        services: servicesRes.data || [],
        attractions: attractionsRes.data || [],
        providers: providersRes.data || []
      });

      this.updateOfflinePackTimestampDisplay();
      this.toast('Offline emergency pack saved! Available even without network.', 'success');
    } catch (err) {
      console.error('Offline pack download error:', err);
      this.toast('Failed to download offline pack. Please check network.', 'error');
    }
  },

  updateOfflinePackTimestampDisplay() {
    const ts = window.offlineStore.getOfflinePackTimestamp();
    const el = document.getElementById('offline-pack-status');
    if (el) {
      el.textContent = ts ? `Last cached on your device: ${ts}` : 'Not yet cached for offline use.';
    }
  },

  // Language Switcher
  setLanguage(lang) {
    this.state.currentLang = lang;
    const dict = this.i18n[lang] || this.i18n.en;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });

    if (lang === 'mr') {
      document.getElementById('lbl-brand-tagline').textContent = 'नाशिक महाकुंभमेळा २०२७ आणि पर्यटन मार्गदर्शक';
      document.getElementById('lbl-emergency-banner-title').textContent = 'महाकुंभ २४/७ आपत्कालीन संपर्क:';
    } else {
      document.getElementById('lbl-brand-tagline').textContent = 'Nashik Maha Kumbh Mela 2027 & Tourism';
      document.getElementById('lbl-emergency-banner-title').textContent = 'Maha Kumbh 24/7 Emergency Helplines:';
    }

    this.toast(`Language changed to ${lang === 'mr' ? 'मराठी / हिंदी' : 'English'}`);
  },

  // =========================================================================
  // VIEW 1: HOME PAGE RENDERING
  // =========================================================================

  renderHomeFeaturedAttractions() {
    const container = document.getElementById('home-featured-attractions-grid');
    if (!container) return;

    const featured = this.state.attractions.filter(a => a.is_featured).slice(0, 3);
    const toRender = featured.length > 0 ? featured : this.state.attractions.slice(0, 3);

    container.innerHTML = toRender.map(a => this.createAttractionCardHtml(a)).join('');
  },

  // =========================================================================
  // VIEW 2: PILGRIM ASSISTANCE (ESSENTIAL SERVICES)
  // =========================================================================

  filterServicesByCategory(category) {
    this.state.servicesFilter.category = category;
    this.navigate('services');
    this.highlightServicesCategoryPill(category);
    this.renderServices();
  },

  highlightServicesCategoryPill(category) {
    document.querySelectorAll('#services-category-pills .filter-pill').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-cat') === category);
    });
  },

  setServicesCategory(cat) {
    this.state.servicesFilter.category = cat;
    this.highlightServicesCategoryPill(cat);
    this.renderServices();
  },

  handleServicesSearch(query) {
    this.state.servicesFilter.search = query.toLowerCase().trim();
    this.renderServices();
  },

  handleRadiusChange(radiusVal) {
    this.state.servicesFilter.maxDist = parseFloat(radiusVal);
    const display = document.getElementById('radius-val-display');
    if (display) display.textContent = `${parseFloat(radiusVal).toFixed(1)} KM`;
    this.renderServices();
  },

  handleAreaChange(area) {
    this.state.servicesFilter.area = area;
    this.renderServices();
  },

  handleVerificationChange(status) {
    this.state.servicesFilter.verificationStatus = status;
    this.renderServices();
  },

  resetServicesFilters() {
    this.state.servicesFilter = {
      category: 'all',
      search: '',
      area: 'all',
      maxDist: 30.0,
      verificationStatus: 'all'
    };
    document.getElementById('services-search-input').value = '';
    document.getElementById('services-area-select').value = 'all';
    document.getElementById('services-verif-select').value = 'all';
    document.getElementById('services-radius-slider').value = 30;
    document.getElementById('radius-val-display').textContent = '30.0 KM';
    this.highlightServicesCategoryPill('all');
    this.renderServices();
  },

  renderServices() {
    const container = document.getElementById('services-cards-container');
    const countEl = document.getElementById('services-results-count');
    if (!container) return;

    const { category, search, area, maxDist, verificationStatus } = this.state.servicesFilter;

    let filtered = this.state.services.filter(s => {
      // Category check
      if (category !== 'all' && s.category !== category) return false;
      // Area check
      if (area !== 'all' && s.area !== area) return false;
      // Verification status check
      if (verificationStatus !== 'all' && s.verification_status !== verificationStatus) return false;
      // Radius check
      if (s.dist_from_ramkund > maxDist) return false;
      // Search check
      if (search) {
        const matchName = s.name.toLowerCase().includes(search);
        const matchAddr = s.address.toLowerCase().includes(search);
        const matchDesc = s.description && s.description.toLowerCase().includes(search);
        const matchTags = Array.isArray(s.tags) && s.tags.some(t => t.toLowerCase().includes(search));
        if (!matchName && !matchAddr && !matchDesc && !matchTags) return false;
      }
      return true;
    });

    if (countEl) {
      countEl.textContent = `Showing ${filtered.length} verified listings within ${maxDist.toFixed(1)} KM of Ramkund`;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; background: #FFFFFF; border-radius: 16px; border: 1px dashed #CBD5E1;">
          <i class="fa-solid fa-magnifying-glass" style="font-size: 2rem; color: var(--color-slate-300); margin-bottom: 0.75rem;"></i>
          <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--color-navy); margin-bottom: 4px;">No matching services found</h4>
          <p style="font-size: 0.85rem; color: var(--color-slate-500); margin-bottom: 1rem;">Try expanding the radius slider or resetting your search keywords.</p>
          <button class="btn-secondary-hero" onclick="App.resetServicesFilters()">Reset Filters</button>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(s => this.createServiceCardHtml(s)).join('');
  },

  createServiceCardHtml(s) {
    let verifBadgeClass = 'badge-reviewed';
    if (s.verification_status === 'Official Source') verifBadgeClass = 'badge-official';
    else if (s.verification_status === 'Provider Submitted') verifBadgeClass = 'badge-provider';
    else if (s.verification_status === 'Needs Review') verifBadgeClass = 'badge-unreviewed';

    const tagsList = Array.isArray(s.tags)
      ? s.tags.map(t => `<span class="meta-chip">${t}</span>`).join('')
      : '';

    return `
      <article class="service-card ${s.is_emergency ? 'emergency-card' : ''}" aria-label="${s.name}">
        <div>
          <div class="service-header-row">
            <div>
              <div class="service-subcat">${s.sub_category || s.category}</div>
              <h3 class="service-title">${s.name}</h3>
            </div>
            <span class="dist-badge">
              <i class="fa-solid fa-location-dot"></i> ${s.dist_from_ramkund} KM
            </span>
          </div>

          <div class="service-address">
            <i class="fa-solid fa-map-pin"></i>
            <span>${s.address}</span>
          </div>

          <div style="margin-bottom: 0.65rem;">
            <span class="verification-badge ${verifBadgeClass}">
              <i class="fa-solid fa-shield-check"></i> ${s.verification_status}
            </span>
            ${s.hours ? `<span class="meta-chip" style="margin-left: 4px;"><i class="fa-regular fa-clock"></i> ${s.hours}</span>` : ''}
            ${s.rate_info ? `<span class="meta-chip" style="margin-left: 4px;"><i class="fa-solid fa-tag"></i> ${s.rate_info}</span>` : ''}
          </div>

          <p class="service-desc">${s.description || 'Essential municipal amenity for pilgrims during the Kumbh Mela and year-round tourism.'}</p>
          <div class="service-meta-row">${tagsList}</div>
        </div>

        <div class="service-card-footer">
          <div class="service-actions-left">
            ${s.phone ? `
              <a href="tel:${s.phone}" class="btn-card-action btn-call" title="Call ${s.phone}">
                <i class="fa-solid fa-phone"></i> Call
              </a>
            ` : ''}
            ${s.google_maps_url ? `
              <a href="${s.google_maps_url}" target="_blank" rel="noopener noreferrer" class="btn-card-action btn-directions">
                <i class="fa-solid fa-diamond-turn-right"></i> Directions
              </a>
            ` : ''}
          </div>
          <button class="btn-report-info" onclick="App.openReportModal(${s.id}, '${s.name.replace(/'/g, "\\'")}')" title="Report Outdated Information">
            <i class="fa-regular fa-flag"></i> Report
          </button>
        </div>
      </article>
    `;
  },

  // =========================================================================
  // VIEW 3: EXPLORE NASHIK & ITINERARY BUILDER
  // =========================================================================

  setAttractionsCategory(category) {
    this.state.attractionsCategory = category;
    document.querySelectorAll('#attractions-category-pills .filter-pill').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-cat') === category);
    });
    this.renderAttractions();
  },

  renderAttractions() {
    const container = document.getElementById('explore-attractions-grid');
    if (!container) return;

    const cat = this.state.attractionsCategory;
    const filtered = cat === 'all'
      ? this.state.attractions
      : this.state.attractions.filter(a => a.category === cat);

    container.innerHTML = filtered.map(a => this.createAttractionCardHtml(a)).join('');
  },

  createAttractionCardHtml(a) {
    const highlights = Array.isArray(a.highlights)
      ? a.highlights.map(h => `<span class="highlight-pill">${h}</span>`).join('')
      : '';

    return `
      <article class="attraction-card" aria-label="${a.name}">
        <div class="attraction-image-box">
          <img src="${a.image_url || '/assets/attractions/default.jpg'}" alt="${a.name}" class="attraction-img" loading="lazy" onerror="this.src='/assets/attractions/default.jpg'">
          <span class="attraction-category-tag">${a.category}</span>
          ${a.suggested_duration ? `
            <span class="attraction-duration-tag">
              <i class="fa-regular fa-clock"></i> ${a.suggested_duration}
            </span>
          ` : ''}
        </div>
        <div class="attraction-content">
          <div>
            <h3 class="attraction-title">${a.name}</h3>
            <p class="service-address"><i class="fa-solid fa-location-dot"></i> ${a.address} (${a.dist_from_ramkund} km from center)</p>
            <p class="attraction-desc">${a.description}</p>
            <div class="highlights-pill-list">${highlights}</div>
          </div>
          <div class="service-card-footer" style="padding-top: 0.5rem;">
            <div class="verification-badge badge-official">
              <i class="fa-solid fa-certificate"></i> ${a.verification_status}
            </div>
            ${a.google_maps_url ? `
              <a href="${a.google_maps_url}" target="_blank" rel="noopener noreferrer" class="btn-card-action btn-directions">
                <i class="fa-solid fa-location-arrow"></i> Map Route
              </a>
            ` : ''}
          </div>
        </div>
      </article>
    `;
  },

  // Handle Itinerary Generation
  async handleGenerateItinerary() {
    const durationInput = document.querySelector('input[name="itinerary-duration"]:checked');
    const duration = durationInput ? durationInput.value : 'half_day';

    const interestInputs = document.querySelectorAll('input[name="itinerary-interest"]:checked');
    const interests = Array.from(interestInputs).map(cb => cb.value);

    const btn = document.getElementById('btn-run-itinerary');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Calculating Route...';

    try {
      const result = await API.generateItinerary(duration, interests);
      this.renderGeneratedItinerary(result);
    } catch (err) {
      console.error('Itinerary error:', err);
      this.toast('Failed to generate itinerary. Please try again.', 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate Suggested Route';
    }
  },

  renderGeneratedItinerary(data) {
    const container = document.getElementById('itinerary-output-container');
    if (!container) return;

    const timelineHtml = data.timeline.map(item => `
      <div class="timeline-step-item">
        <div class="timeline-step-marker"></div>
        <div class="timeline-content-card">
          <span class="step-time-badge"><i class="fa-regular fa-clock"></i> ${item.timeSlot} (${item.allocatedDuration})</span>
          <h4 class="step-attraction-title">Stop ${item.step}: ${item.attraction.name}</h4>
          <p class="step-details"><i class="fa-solid fa-location-dot" style="color: var(--color-saffron);"></i> ${item.distanceFromCenter} | Best Activity: ${item.recommendedActivity}</p>
          <p style="font-size: 0.8rem; color: var(--color-slate-600);">${item.attraction.description.slice(0, 160)}...</p>
          <div style="margin-top: 0.5rem;">
            <a href="${item.attraction.google_maps_url}" target="_blank" class="btn-card-action btn-directions" style="font-size: 0.72rem; padding: 0.25rem 0.55rem;">
              <i class="fa-solid fa-diamond-turn-right"></i> Open Navigation
            </a>
          </div>
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="itinerary-header-bar">
        <div class="itinerary-title-meta">
          <h4>${data.title}</h4>
          <span style="font-size: 0.8rem; color: var(--color-slate-500); font-weight: 600;">
            ${data.totalStops} Suggested Heritage Stops | Estimated Time: ${data.estimatedTotalHours}
          </span>
        </div>
        <button class="btn-secondary-hero" style="font-size: 0.78rem; padding: 0.35rem 0.7rem;" onclick="window.print()">
          <i class="fa-solid fa-print"></i> Print Plan
        </button>
      </div>

      <div class="itinerary-disclaimer-alert">
        <i class="fa-solid fa-triangle-exclamation"></i> <strong>Advisory:</strong> ${data.advisoryNote}
      </div>

      <div class="itinerary-timeline">
        ${timelineHtml}
      </div>
    `;

    container.classList.add('active');
    container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  },

  // =========================================================================
  // VIEW 4: LOCAL CONNECT (LOCAL OPPORTUNITY PLATFORM)
  // =========================================================================

  toggleProviderRegistrationForm() {
    const card = document.getElementById('provider-registration-box');
    if (card) {
      card.classList.toggle('active');
      if (card.classList.contains('active')) {
        card.scrollIntoView({ behavior: 'smooth' });
      }
    }
  },

  async handleProviderRegistration(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-submit-provider');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting...';

    const payload = {
      name: document.getElementById('reg-name').value,
      business_name: document.getElementById('reg-business').value,
      category: document.getElementById('reg-category').value,
      area: document.getElementById('reg-area').value,
      phone: document.getElementById('reg-phone').value,
      whatsapp: document.getElementById('reg-whatsapp').value,
      services_offered: document.getElementById('reg-services').value,
      description: document.getElementById('reg-description').value,
      pricing_notes: document.getElementById('reg-pricing').value,
      website_url: document.getElementById('reg-website').value
    };

    try {
      const res = await API.registerProvider(payload);
      this.toast(res.message, 'success');
      document.getElementById('provider-reg-form').reset();
      this.toggleProviderRegistrationForm();
    } catch (err) {
      this.toast(err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Registration';
    }
  },

  handleProviderFilterChange(cat) {
    this.state.providerCategory = cat;
    this.renderApprovedProviders();
  },

  async renderApprovedProviders() {
    const container = document.getElementById('approved-providers-grid');
    if (!container) return;

    container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;"><i class="fa-solid fa-spinner fa-spin"></i> Loading local providers...</div>';

    const res = await API.getApprovedProviders({ category: this.state.providerCategory });
    if (!res.success || !res.data || res.data.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; background: #FFFFFF; border-radius: 16px; border: 1px dashed #CBD5E1;">
          <h4 style="font-size: 1.1rem; font-weight: 700; color: var(--color-navy); margin-bottom: 4px;">No approved providers in this category yet</h4>
          <p style="font-size: 0.85rem; color: var(--color-slate-500); margin-bottom: 1rem;">Are you a local service provider? Register above to get verified.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = res.data.map(p => `
      <article class="provider-card" aria-label="${p.business_name}">
        <div>
          <div class="provider-header">
            <div>
              <div class="service-subcat">${p.category.toUpperCase()}</div>
              <h3 class="provider-title">${p.business_name}</h3>
              <p class="provider-owner">Managed by ${p.name}</p>
            </div>
            <span class="verification-badge badge-official">
              <i class="fa-solid fa-shield-check"></i> Verified Provider
            </span>
          </div>

          <p class="service-address"><i class="fa-solid fa-location-dot"></i> Area: ${p.area}</p>
          <p class="service-desc">${p.description}</p>
          
          <div style="background-color: var(--color-cream); padding: 0.65rem 0.85rem; border-radius: 8px; margin-bottom: 1rem; font-size: 0.82rem; border: 1px solid var(--color-slate-100);">
            <strong>Services:</strong> ${p.services_offered}<br>
            ${p.pricing_notes ? `<strong>Tariff:</strong> ${p.pricing_notes}` : ''}
          </div>
        </div>

        <div class="service-card-footer">
          <div class="service-actions-left">
            <a href="tel:${p.phone}" class="btn-card-action btn-call">
              <i class="fa-solid fa-phone"></i> Call
            </a>
            ${p.whatsapp ? `
              <a href="https://wa.me/${p.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" class="btn-card-action" style="background:#25D366; color:#FFF;">
                <i class="fa-brands fa-whatsapp"></i> WhatsApp
              </a>
            ` : ''}
          </div>
          <button class="btn-primary-hero" style="font-size: 0.8rem; padding: 0.35rem 0.75rem;" onclick="App.openEnquiryModal(${p.id}, '${p.business_name.replace(/'/g, "\\'")}')">
            <i class="fa-solid fa-envelope"></i> Enquire
          </button>
        </div>
      </article>
    `).join('');
  },

  // Direct Visitor Enquiry Modal
  openEnquiryModal(providerId, businessName) {
    document.getElementById('enquiry-provider-id').value = providerId;
    document.getElementById('modal-enquiry-title').textContent = `Enquiry for ${businessName}`;
    document.getElementById('modal-enquiry-desc').textContent = `Your contact details and query will be sent directly to ${businessName}.`;
    document.getElementById('modal-provider-enquiry').classList.add('active');
  },

  async handleSendEnquiry(e) {
    e.preventDefault();
    const providerId = document.getElementById('enquiry-provider-id').value;
    const payload = {
      visitor_name: document.getElementById('enquiry-name').value,
      visitor_phone: document.getElementById('enquiry-phone').value,
      visit_date: document.getElementById('enquiry-date').value,
      message: document.getElementById('enquiry-message').value
    };

    try {
      const res = await API.sendProviderEnquiry(providerId, payload);
      this.toast(res.message, 'success');
      this.closeModals();
      document.getElementById('enquiry-form').reset();
    } catch (err) {
      this.toast(err.message, 'error');
    }
  },

  // =========================================================================
  // VIEW 5: QR HUB & LOCATION RESOLVER
  // =========================================================================

  async loadQrView(codeId) {
    try {
      const data = await API.resolveQrView(codeId);
      const titleEl = document.getElementById('qr-view-title');
      const locEl = document.getElementById('qr-view-location');
      const descEl = document.getElementById('qr-view-desc');

      if (titleEl) titleEl.textContent = data.qrRecord.title;
      if (locEl) locEl.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${data.qrRecord.location_label}`;
      if (descEl) descEl.textContent = data.qrRecord.description || 'Welcome to this Kumbh Mela and Nashik assistance sector.';

      // Render nearby facilities
      const nearbyContainer = document.getElementById('qr-nearby-services-container');
      if (nearbyContainer && data.emergencyNearby) {
        nearbyContainer.innerHTML = data.emergencyNearby.map(s => this.createServiceCardHtml(s)).join('');
      }
    } catch (err) {
      console.warn('Could not load specific QR, falling back to default', err);
    }
  },

  // =========================================================================
  // VIEW 6: ADMIN AUTHENTICATION & DASHBOARD
  // =========================================================================

  checkAdminSession() {
    const isLoggedIn = API.isAdminLoggedIn();
    const loginSection = document.getElementById('admin-login-section');
    const dashboardSection = document.getElementById('admin-dashboard-section');

    if (isLoggedIn) {
      loginSection.style.display = 'none';
      dashboardSection.style.display = 'block';
      const user = API.getAdminUser();
      if (user) {
        document.getElementById('admin-welcome-user').textContent = `Logged in as ${user.name} (${user.username})`;
      }
      this.loadAdminData();
    } else {
      loginSection.style.display = 'block';
      dashboardSection.style.display = 'none';
    }
  },

  async handleAdminLogin(e) {
    e.preventDefault();
    const u = document.getElementById('admin-user-input').value;
    const p = document.getElementById('admin-pass-input').value;

    const btn = document.getElementById('btn-submit-admin-login');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';

    try {
      await API.adminLogin(u, p);
      this.toast('Admin authentication successful!', 'success');
      this.checkAdminSession();
    } catch (err) {
      this.toast(err.message, 'error');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-arrow-right-to-bracket"></i> Sign In to Dashboard';
    }
  },

  handleAdminLogout() {
    API.adminLogout();
    this.toast('Logged out of admin console.');
    this.checkAdminSession();
  },

  setAdminTab(tabName) {
    this.state.adminActiveTab = tabName;
    const tabs = ['providers', 'services', 'attractions', 'qr', 'reports'];
    tabs.forEach(t => {
      const btn = document.getElementById(`tab-btn-admin-${t}`);
      const content = document.getElementById(`admin-content-${t}`);
      if (btn) btn.classList.toggle('active', t === tabName);
      if (content) content.style.display = t === tabName ? 'block' : 'none';
    });

    if (tabName === 'providers') this.loadAdminProviders();
    else if (tabName === 'services') this.loadAdminServices();
    else if (tabName === 'attractions') this.loadAdminAttractions();
    else if (tabName === 'qr') this.loadAdminQrs();
    else if (tabName === 'reports') this.loadAdminReports();
  },

  async loadAdminData() {
    this.setAdminTab(this.state.adminActiveTab);
  },

  // Admin Tab: Providers Moderation
  async loadAdminProviders() {
    const tbody = document.getElementById('admin-providers-tbody');
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Loading provider applications...</td></tr>';

    try {
      const providers = await API.adminGetProviders();
      const pendingCount = providers.filter(p => p.status === 'pending').length;
      document.getElementById('admin-pending-badge').textContent = pendingCount;

      tbody.innerHTML = providers.map(p => `
        <tr>
          <td><strong>${p.business_name}</strong><br><small>${p.services_offered}</small></td>
          <td>${p.name}<br><small style="color:var(--color-slate-500);">${p.area}</small></td>
          <td><span class="meta-chip">${p.category}</span></td>
          <td>${p.phone}</td>
          <td>
            <span class="verification-badge ${p.status === 'approved' ? 'badge-official' : (p.status === 'pending' ? 'badge-provider' : 'badge-unreviewed')}">
              ${p.status.toUpperCase()}
            </span>
          </td>
          <td>
            ${p.status === 'pending' ? `
              <div style="display:flex; gap:4px;">
                <button class="btn-card-action btn-call" style="padding:3px 8px; font-size:0.75rem;" onclick="App.moderateProvider(${p.id}, 'approved')">
                  <i class="fa-solid fa-check"></i> Approve
                </button>
                <button class="btn-card-action" style="padding:3px 8px; font-size:0.75rem; background:#DC2626; color:#FFF;" onclick="App.moderateProvider(${p.id}, 'rejected')">
                  <i class="fa-solid fa-xmark"></i> Reject
                </button>
              </div>
            ` : `
              <button class="btn-report-info" onclick="App.moderateProvider(${p.id}, '${p.status === 'approved' ? 'rejected' : 'approved'}')">
                Change Status
              </button>
            `}
          </td>
        </tr>
      `).join('');
    } catch (err) {
      tbody.innerHTML = '<tr><td colspan="6" style="color:red; text-align:center;">Failed to load providers.</td></tr>';
    }
  },

  async moderateProvider(id, status) {
    const note = prompt(`Enter review notes for setting status to ${status}:`, status === 'approved' ? 'Credentials and ID verified' : 'Incomplete documentation');
    try {
      await API.adminUpdateProviderStatus(id, status, note || '');
      this.toast(`Provider marked as ${status}.`, 'success');
      this.loadAdminProviders();
      // Also refresh public listings in background
      API.getApprovedProviders().then(res => this.state.providers = res.data);
    } catch (err) {
      this.toast(err.message, 'error');
    }
  },

  // Admin Tab: Essential Services
  async loadAdminServices() {
    const tbody = document.getElementById('admin-services-tbody');
    if (!tbody) return;

    try {
      const res = await API.getServices();
      const services = res.data || [];
      tbody.innerHTML = services.map(s => `
        <tr>
          <td><strong>${s.name}</strong><br><small>${s.phone || 'No phone'}</small></td>
          <td><span class="meta-chip">${s.category}</span></td>
          <td>${s.area} (${s.dist_from_ramkund} km)</td>
          <td><span class="verification-badge badge-official">${s.verification_status}</span></td>
          <td>${s.last_reviewed_date || 'N/A'}</td>
          <td>
            <button class="btn-card-action btn-directions" style="padding:3px 8px; font-size:0.75rem;" onclick="App.openServiceEditModal(${s.id})">
              <i class="fa-solid fa-pen"></i> Edit
            </button>
            <button class="btn-card-action" style="padding:3px 8px; font-size:0.75rem; background:#EF4444; color:#FFF; margin-left:4px;" onclick="App.deleteService(${s.id})">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>
      `).join('');
    } catch (err) {
      tbody.innerHTML = '<tr><td colspan="6" style="color:red;">Failed to load services.</td></tr>';
    }
  },

  openServiceEditModal(serviceId = null) {
    const modal = document.getElementById('modal-service-form');
    document.getElementById('service-admin-form').reset();
    document.getElementById('admin-service-id').value = serviceId || '';

    if (serviceId) {
      const service = this.state.services.find(s => s.id === serviceId);
      if (service) {
        document.getElementById('modal-service-form-title').textContent = `Edit Service: ${service.name}`;
        document.getElementById('as-name').value = service.name;
        document.getElementById('as-category').value = service.category;
        document.getElementById('as-subcat').value = service.sub_category || '';
        document.getElementById('as-area').value = service.area;
        document.getElementById('as-address').value = service.address;
        document.getElementById('as-dist').value = service.dist_from_ramkund;
        document.getElementById('as-phone').value = service.phone || '';
        document.getElementById('as-hours').value = service.hours || '24/7';
        document.getElementById('as-ratetype').value = service.rate_type || 'free';
        document.getElementById('as-rateinfo').value = service.rate_info || '';
        document.getElementById('as-maps').value = service.google_maps_url || '';
        document.getElementById('as-desc').value = service.description || '';
        document.getElementById('as-verif').value = service.verification_status;
        document.getElementById('as-source').value = service.source_reference || '';
        document.getElementById('as-emergency').checked = !!service.is_emergency;
      }
    } else {
      document.getElementById('modal-service-form-title').textContent = 'Add New Essential Service';
    }

    modal.classList.add('active');
  },

  async handleServiceSave(e) {
    e.preventDefault();
    const id = document.getElementById('admin-service-id').value;
    const payload = {
      name: document.getElementById('as-name').value,
      category: document.getElementById('as-category').value,
      sub_category: document.getElementById('as-subcat').value,
      area: document.getElementById('as-area').value,
      address: document.getElementById('as-address').value,
      dist_from_ramkund: parseFloat(document.getElementById('as-dist').value) || 0.0,
      phone: document.getElementById('as-phone').value,
      hours: document.getElementById('as-hours').value,
      rate_type: document.getElementById('as-ratetype').value,
      rate_info: document.getElementById('as-rateinfo').value,
      google_maps_url: document.getElementById('as-maps').value,
      description: document.getElementById('as-desc').value,
      verification_status: document.getElementById('as-verif').value,
      source_reference: document.getElementById('as-source').value,
      is_emergency: document.getElementById('as-emergency').checked ? 1 : 0
    };

    try {
      await API.adminSaveService(payload, id || null);
      this.toast(`Service record ${id ? 'updated' : 'created'} successfully!`, 'success');
      this.closeModals();
      // Reload services
      const res = await API.getServices();
      this.state.services = res.data;
      this.loadAdminServices();
      this.renderServices();
    } catch (err) {
      this.toast(err.message, 'error');
    }
  },

  async deleteService(id) {
    if (!confirm('Are you sure you want to delete this essential service record?')) return;
    try {
      await API.adminDeleteService(id);
      this.toast('Service record deleted.', 'info');
      const res = await API.getServices();
      this.state.services = res.data;
      this.loadAdminServices();
      this.renderServices();
    } catch (err) {
      this.toast(err.message, 'error');
    }
  },

  // Admin Tab: Attractions Management
  async loadAdminAttractions() {
    const tbody = document.getElementById('admin-attractions-tbody');
    if (!tbody) return;

    try {
      const res = await API.getAttractions();
      tbody.innerHTML = res.data.map(a => `
        <tr>
          <td><strong>${a.name}</strong></td>
          <td><span class="meta-chip">${a.category}</span></td>
          <td>${a.area} (${a.dist_from_ramkund} km)</td>
          <td>${a.suggested_duration || '1 hour'}</td>
          <td>
            <button class="btn-card-action btn-directions" style="padding:3px 8px; font-size:0.75rem;" onclick="alert('Attraction: ${a.name}\\n\\n${a.description}')">
              <i class="fa-solid fa-eye"></i> View
            </button>
          </td>
        </tr>
      `).join('');
    } catch (err) {
      tbody.innerHTML = '<tr><td colspan="5" style="color:red;">Failed to load attractions.</td></tr>';
    }
  },

  // Admin Tab: Dynamic QR Manager
  async loadAdminQrs() {
    const tbody = document.getElementById('admin-qrs-tbody');
    if (!tbody) return;

    try {
      const qrs = await API.adminGetQRs();
      tbody.innerHTML = qrs.map(q => `
        <tr>
          <td><strong>${q.title}</strong><br><small style="color:var(--color-slate-500);">${q.code_id}</small></td>
          <td>${q.location_label}</td>
          <td>
            <code style="background:#F1F5F9; padding:2px 6px; border-radius:4px; font-size:0.75rem;">${q.target_url}</code>
            <br>
            <button class="btn-report-info" onclick="App.promptUpdateQrDestination(${q.id}, '${q.target_url}')" style="margin-top:4px;">
              <i class="fa-solid fa-link"></i> Change Destination
            </button>
          </td>
          <td><strong>${q.scans_count}</strong> scans</td>
          <td>
            <div style="display:flex; gap:4px;">
              <a href="/api/qr/${q.code_id}/download?format=png" download class="btn-card-action btn-directions" style="padding:3px 8px; font-size:0.75rem;">
                <i class="fa-solid fa-file-image"></i> PNG
              </a>
              <a href="/api/qr/${q.code_id}/download?format=svg" download class="btn-card-action btn-call" style="padding:3px 8px; font-size:0.75rem;">
                <i class="fa-solid fa-bezier-curve"></i> SVG
              </a>
            </div>
          </td>
          <td>
            <button class="btn-card-action" style="padding:3px 8px; font-size:0.75rem; background:#EF4444; color:#FFF;" onclick="App.deleteQr(${q.id})">
              <i class="fa-solid fa-trash"></i>
            </button>
          </td>
        </tr>
      `).join('');
    } catch (err) {
      tbody.innerHTML = '<tr><td colspan="6" style="color:red;">Failed to load QR records.</td></tr>';
    }
  },

  openCreateQrModal() {
    const modal = document.getElementById('modal-create-qr');
    document.getElementById('create-qr-form').reset();
    this.handleQrTypeSwitch('area_hub');
    modal.classList.add('active');
  },

  handleQrTypeSwitch(type) {
    const selectGroup = document.getElementById('qr-target-select-group');
    const customGroup = document.getElementById('qr-custom-url-group');
    const select = document.getElementById('qr-form-target-id');

    if (type === 'custom') {
      selectGroup.style.display = 'none';
      customGroup.style.display = 'block';
    } else {
      selectGroup.style.display = 'block';
      customGroup.style.display = 'none';

      if (type === 'attraction') {
        select.innerHTML = this.state.attractions.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
      } else if (type === 'service') {
        select.innerHTML = this.state.services.map(s => `<option value="${s.id}">${s.name} (${s.category})</option>`).join('');
      } else {
        select.innerHTML = `
          <option value="1">Ramkund Main Ghat Snan Hub</option>
          <option value="2">Trimbakeshwar Temple & Kushavarta</option>
          <option value="3">Tapovan Sadhugram Camp</option>
          <option value="4">CBS Central Bus Station</option>
          <option value="5">Nashik Road Railway Station Hub</option>
        `;
      }
    }
  },

  async handleCreateQr(e) {
    e.preventDefault();
    const type = document.getElementById('qr-form-type').value;
    const payload = {
      title: document.getElementById('qr-form-title').value,
      location_label: document.getElementById('qr-form-loc').value,
      target_type: type,
      target_id: type !== 'custom' ? document.getElementById('qr-form-target-id').value : null,
      custom_target_url: type === 'custom' ? document.getElementById('qr-form-custom-url').value : null,
      description: document.getElementById('qr-form-desc').value
    };

    try {
      await API.adminCreateQR(payload);
      this.toast('New Dynamic QR code generated!', 'success');
      this.closeModals();
      this.loadAdminQrs();
    } catch (err) {
      this.toast(err.message, 'error');
    }
  },

  async promptUpdateQrDestination(qrId, currentUrl) {
    const newUrl = prompt('Enter new destination URL for this physical QR code (No reprinting needed):', currentUrl);
    if (!newUrl || newUrl === currentUrl) return;

    try {
      await API.adminUpdateQR(qrId, { target_url: newUrl });
      this.toast('Dynamic destination updated successfully!', 'success');
      this.loadAdminQrs();
    } catch (err) {
      this.toast(err.message, 'error');
    }
  },

  async deleteQr(id) {
    if (!confirm('Are you sure you want to delete this QR code?')) return;
    try {
      await API.adminDeleteQR(id);
      this.toast('QR record deleted.', 'info');
      this.loadAdminQrs();
    } catch (err) {
      this.toast(err.message, 'error');
    }
  },

  // Admin Tab: Information Reports
  async loadAdminReports() {
    const tbody = document.getElementById('admin-reports-tbody');
    if (!tbody) return;

    try {
      const reports = await API.adminGetReports();
      tbody.innerHTML = reports.map(r => `
        <tr>
          <td><strong>${r.entity_name}</strong><br><small>${r.created_at}</small></td>
          <td><span class="meta-chip">${r.issue_type}</span></td>
          <td>${r.description}</td>
          <td>${r.reporter_name}<br><small>${r.reporter_contact || 'N/A'}</small></td>
          <td>
            <span class="verification-badge ${r.status === 'resolved' ? 'badge-official' : (r.status === 'pending' ? 'badge-provider' : 'badge-unreviewed')}">
              ${r.status.toUpperCase()}
            </span>
          </td>
          <td>
            <select class="filter-select" style="font-size:0.75rem; padding:2px 4px;" onchange="App.updateReportStatus(${r.id}, this.value)">
              <option value="pending" ${r.status === 'pending' ? 'selected' : ''}>Pending</option>
              <option value="investigating" ${r.status === 'investigating' ? 'selected' : ''}>Investigating</option>
              <option value="resolved" ${r.status === 'resolved' ? 'selected' : ''}>Resolved</option>
              <option value="dismissed" ${r.status === 'dismissed' ? 'selected' : ''}>Dismissed</option>
            </select>
          </td>
        </tr>
      `).join('');
    } catch (err) {
      tbody.innerHTML = '<tr><td colspan="6" style="color:red;">Failed to load reports.</td></tr>';
    }
  },

  async updateReportStatus(id, status) {
    try {
      await API.adminUpdateReportStatus(id, status, 'Reviewed by administrator');
      this.toast(`Report marked as ${status}.`, 'success');
    } catch (err) {
      this.toast(err.message, 'error');
    }
  },

  // =========================================================================
  // COMMUNITY REPORTING MODAL
  // =========================================================================

  openReportModal(entityId, entityName) {
    document.getElementById('report-entity-id').value = entityId || '';
    document.getElementById('report-entity-name').value = entityName || '';
    document.getElementById('modal-report-info').classList.add('active');
  },

  async handleReportSubmit(e) {
    e.preventDefault();
    const payload = {
      entity_type: document.getElementById('report-entity-type').value,
      entity_id: document.getElementById('report-entity-id').value,
      entity_name: document.getElementById('report-entity-name').value,
      issue_type: document.getElementById('report-issue-type').value,
      description: document.getElementById('report-desc').value,
      reporter_contact: document.getElementById('report-contact').value
    };

    try {
      const res = await API.submitReport(payload);
      this.toast(res.message, 'success');
      this.closeModals();
      document.getElementById('report-form').reset();
    } catch (err) {
      this.toast(err.message, 'error');
    }
  },

  // Close all modal dialogs
  closeModals() {
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
  },

  // Toast Notification Helper
  toast(message, type = 'info') {
    const el = document.getElementById('app-toast');
    const msgEl = document.getElementById('toast-message');
    if (!el || !msgEl) return;

    msgEl.textContent = message;
    el.className = 'toast-notice show';

    if (type === 'error') {
      el.style.backgroundColor = '#991B1B';
    } else if (type === 'success') {
      el.style.backgroundColor = '#065F46';
    } else if (type === 'warning') {
      el.style.backgroundColor = '#9A3412';
    } else {
      el.style.backgroundColor = '#0F172A';
    }

    setTimeout(() => {
      el.classList.remove('show');
    }, 4000);
  }
};

// Initialize Application once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.App = App;
  App.init();
});
