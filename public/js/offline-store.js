/**
 * Tourist Assist Offline Store Manager
 * Uses IndexedDB with localStorage fallback for fast and reliable offline access.
 */
class OfflineStore {
  constructor() {
    this.dbName = 'TouristAssistOfflineDB';
    this.dbVersion = 1;
    this.db = null;
    this.isOnline = navigator.onLine;
    this.init();
  }

  async init() {
    if (!('indexedDB' in window)) {
      console.warn('IndexedDB not supported, falling back to localStorage');
      return;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('services')) {
          db.createObjectStore('services', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('attractions')) {
          db.createObjectStore('attractions', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('providers')) {
          db.createObjectStore('providers', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('IndexedDB error:', event.target.errorCode);
        resolve(null);
      };
    });
  }

  async saveBatch(storeName, items) {
    if (!this.db) {
      try {
        localStorage.setItem(`kumbh_offline_${storeName}`, JSON.stringify(items));
      } catch (e) {
        console.error('LocalStorage write error:', e);
      }
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        const tx = this.db.transaction([storeName], 'readwrite');
        const store = tx.objectStore(storeName);
        store.clear(); // Refresh cache with latest records
        items.forEach(item => store.put(item));
        tx.oncomplete = () => resolve(true);
        tx.onerror = (e) => reject(e);
      } catch (err) {
        reject(err);
      }
    });
  }

  async getAll(storeName) {
    if (!this.db) {
      try {
        const cached = localStorage.getItem(`kumbh_offline_${storeName}`);
        return cached ? JSON.parse(cached) : [];
      } catch (e) {
        return [];
      }
    }

    return new Promise((resolve) => {
      try {
        const tx = this.db.transaction([storeName], 'readonly');
        const store = tx.objectStore(storeName);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      } catch (err) {
        resolve([]);
      }
    });
  }

  async saveOfflinePack(data) {
    if (data.services) await this.saveBatch('services', data.services);
    if (data.attractions) await this.saveBatch('attractions', data.attractions);
    if (data.providers) await this.saveBatch('providers', data.providers);
    localStorage.setItem('kumbh_offline_pack_downloaded_at', new Date().toLocaleString());
  }

  getOfflinePackTimestamp() {
    return localStorage.getItem('kumbh_offline_pack_downloaded_at');
  }

  // Saved / Bookmarked items for quick access
  getSavedIds() {
    try {
      return JSON.parse(localStorage.getItem('kumbh_saved_bookmarks') || '[]');
    } catch (e) {
      return [];
    }
  }

  toggleBookmark(id) {
    const list = this.getSavedIds();
    const index = list.indexOf(id);
    let isSaved = false;
    if (index >= 0) {
      list.splice(index, 1);
      isSaved = false;
    } else {
      list.push(id);
      isSaved = true;
    }
    localStorage.setItem('kumbh_saved_bookmarks', JSON.stringify(list));
    return isSaved;
  }
}

// Global instance
window.offlineStore = new OfflineStore();
