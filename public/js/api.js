/**
 * Tourist Assist API Client
 * Wraps fetch calls with offline fallback and admin auth handling.
 */
const API = {
  baseUrl: '/api',

  getAuthHeader() {
    const token = localStorage.getItem('tourist_assist_admin_token') || localStorage.getItem('kumbh_admin_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  },

  async getServices(params = {}) {
    const query = new URLSearchParams(params).toString();
    try {
      const res = await fetch(`${this.baseUrl}/services?${query}`);
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      // Auto cache in offline store if it's general list
      if (!params.search && (!params.category || params.category === 'all')) {
        window.offlineStore.saveBatch('services', data).catch(console.error);
      }
      return { success: true, data, fromCache: false };
    } catch (err) {
      console.warn('API getServices failed, retrieving from offline cache...', err);
      let cached = await window.offlineStore.getAll('services');
      // Apply basic client-side filter
      if (params.category && params.category !== 'all') {
        cached = cached.filter(s => s.category === params.category);
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        cached = cached.filter(s =>
          (s.name && s.name.toLowerCase().includes(q)) ||
          (s.address && s.address.toLowerCase().includes(q))
        );
      }
      return { success: true, data: cached, fromCache: true };
    }
  },

  async getAttractions(params = {}) {
    const query = new URLSearchParams(params).toString();
    try {
      const res = await fetch(`${this.baseUrl}/attractions?${query}`);
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      if (!params.search && (!params.category || params.category === 'all')) {
        window.offlineStore.saveBatch('attractions', data).catch(console.error);
      }
      return { success: true, data, fromCache: false };
    } catch (err) {
      console.warn('API getAttractions failed, retrieving from offline cache...', err);
      let cached = await window.offlineStore.getAll('attractions');
      if (params.category && params.category !== 'all') {
        cached = cached.filter(a => a.category === params.category);
      }
      return { success: true, data: cached, fromCache: true };
    }
  },

  async generateItinerary(duration, interests) {
    const res = await fetch(`${this.baseUrl}/attractions/itinerary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ duration, interests })
    });
    if (!res.ok) throw new Error('Failed to generate itinerary');
    return await res.json();
  },

  async getApprovedProviders(params = {}) {
    const query = new URLSearchParams(params).toString();
    try {
      const res = await fetch(`${this.baseUrl}/providers?${query}`);
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      window.offlineStore.saveBatch('providers', data).catch(console.error);
      return { success: true, data, fromCache: false };
    } catch (err) {
      console.warn('API getProviders failed, retrieving from offline cache...', err);
      const cached = await window.offlineStore.getAll('providers');
      return { success: true, data: cached, fromCache: true };
    }
  },

  async registerProvider(payload) {
    const res = await fetch(`${this.baseUrl}/providers/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to submit registration');
    return json;
  },

  async sendProviderEnquiry(providerId, payload) {
    const res = await fetch(`${this.baseUrl}/providers/${providerId}/enquire`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to send enquiry');
    return json;
  },

  async submitReport(payload) {
    const res = await fetch(`${this.baseUrl}/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to submit report');
    return json;
  },

  async getStats() {
    try {
      const res = await fetch(`${this.baseUrl}/stats`);
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch (e) {
      return {
        totalServices: 16,
        emergencyServices: 4,
        totalAttractions: 11,
        approvedProviders: 4,
        pendingProviders: 2,
        totalQRs: 5,
        totalScans: 858
      };
    }
  },

  async resolveQrView(codeId) {
    const res = await fetch(`${this.baseUrl}/qr/view/${codeId}`);
    if (!res.ok) throw new Error('QR destination not found');
    return await res.json();
  },

  // Admin APIs
  async adminLogin(username, password) {
    const res = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Invalid credentials');
    localStorage.setItem('kumbh_admin_token', json.token);
    localStorage.setItem('kumbh_admin_user', JSON.stringify(json.user));
    return json;
  },

  adminLogout() {
    localStorage.removeItem('kumbh_admin_token');
    localStorage.removeItem('kumbh_admin_user');
  },

  isAdminLoggedIn() {
    return !!localStorage.getItem('kumbh_admin_token');
  },

  getAdminUser() {
    try {
      return JSON.parse(localStorage.getItem('kumbh_admin_user') || 'null');
    } catch (e) {
      return null;
    }
  },

  async adminGetProviders(status = 'all') {
    const res = await fetch(`${this.baseUrl}/providers/admin/all?status=${status}`, {
      headers: this.getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to fetch admin providers');
    return await res.json();
  },

  async adminUpdateProviderStatus(id, status, notes = '') {
    const res = await fetch(`${this.baseUrl}/providers/admin/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...this.getAuthHeader() },
      body: JSON.stringify({ status, admin_notes: notes })
    });
    if (!res.ok) throw new Error('Failed to update provider status');
    return await res.json();
  },

  async adminGetQRs() {
    const res = await fetch(`${this.baseUrl}/qr`, {
      headers: this.getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to fetch QR codes');
    return await res.json();
  },

  async adminCreateQR(payload) {
    const res = await fetch(`${this.baseUrl}/qr`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...this.getAuthHeader() },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to create QR');
    return await res.json();
  },

  async adminUpdateQR(id, payload) {
    const res = await fetch(`${this.baseUrl}/qr/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...this.getAuthHeader() },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to update QR');
    return await res.json();
  },

  async adminDeleteQR(id) {
    const res = await fetch(`${this.baseUrl}/qr/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to delete QR');
    return await res.json();
  },

  async adminGetReports(status = 'all') {
    const res = await fetch(`${this.baseUrl}/reports?status=${status}`, {
      headers: this.getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to fetch reports');
    return await res.json();
  },

  async adminUpdateReportStatus(id, status, notes) {
    const res = await fetch(`${this.baseUrl}/reports/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...this.getAuthHeader() },
      body: JSON.stringify({ status, admin_notes: notes })
    });
    if (!res.ok) throw new Error('Failed to update report');
    return await res.json();
  },

  async adminSaveService(serviceData, id = null) {
    const method = id ? 'PUT' : 'POST';
    const endpoint = id ? `${this.baseUrl}/services/${id}` : `${this.baseUrl}/services`;
    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json', ...this.getAuthHeader() },
      body: JSON.stringify(serviceData)
    });
    if (!res.ok) throw new Error('Failed to save service');
    return await res.json();
  },

  async adminDeleteService(id) {
    const res = await fetch(`${this.baseUrl}/services/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to delete service');
    return await res.json();
  },

  async adminSaveAttraction(attractionData, id = null) {
    const method = id ? 'PUT' : 'POST';
    const endpoint = id ? `${this.baseUrl}/attractions/${id}` : `${this.baseUrl}/attractions`;
    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json', ...this.getAuthHeader() },
      body: JSON.stringify(attractionData)
    });
    if (!res.ok) throw new Error('Failed to save attraction');
    return await res.json();
  },

  async adminDeleteAttraction(id) {
    const res = await fetch(`${this.baseUrl}/attractions/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeader()
    });
    if (!res.ok) throw new Error('Failed to delete attraction');
    return await res.json();
  }
};

window.API = API;
