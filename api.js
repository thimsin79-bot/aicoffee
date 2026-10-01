/**
 * Ai Coffee Shop - Universal API Client Adapter
 * Seamlessly connects to live REST API backend (server.js) with 
 * automatic zero-breakage fallback to localStorage when offline.
 */

(function () {
  'use strict';

  // Determine API base URL
  const isFileProtocol = window.location.protocol === 'file:';
  const API_BASE = isFileProtocol ? 'http://localhost:3000/api' : '/api';

  // Seed data shipped with the static site, used to bootstrap localStorage
  // on first visit so the storefront is never empty before the API responds.
  const SEED_URL = 'data';
  const SEED_FILES = { menu: 'menu.json', orders: 'orders.json', feedback: 'feedback.json', shop: 'shop.json' };

  async function fetchSeed(key) {
    try {
      const res = await fetch(`${SEED_URL}/${SEED_FILES[key]}`, { cache: 'no-cache' });
      if (!res.ok) return null;
      const data = await res.json();
      return data;
    } catch (err) {
      return null;
    }
  }

  // Populate localStorage from the bundled seed file if we have nothing yet.
  async function ensureSeeded(key, storageKey) {
    try {
      const current = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (current && (!Array.isArray(current) || current.length > 0)) return current;
    } catch (e) {}
    const seed = await fetchSeed(key);
    if (seed) {
      try { localStorage.setItem(storageKey, JSON.stringify(seed)); } catch (e) {}
      return seed;
    }
    return null;
  }

  const CoffeeAPI = {
    isOnline: false,
    apiUrl: API_BASE,

    // Default Menu Item Photos Mapping
    // Shared by every page that renders a menu, so photos stay consistent
    // even when an item has no stored photo of its own.
    defaultImages: {
      'espresso': 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop&q=80',
      'americano': 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=600&auto=format&fit=crop&q=80',
      'cappuccino': 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&auto=format&fit=crop&q=80',
      'latte': 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&auto=format&fit=crop&q=80',
      'mocha': 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=600&auto=format&fit=crop&q=80',
      'caramel macchiato': 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=600&auto=format&fit=crop&q=80',
      'matcha latte': 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80',
      'hot chocolate': 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&auto=format&fit=crop&q=80',
      'cold brew': 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80',
      'iced latte': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop&q=80',
      'iced caramel frappe': 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80',
      'mango smoothie': 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=600&auto=format&fit=crop&q=80',
      'lemon iced tea': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80',
      'butter croissant': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80',
      'chocolate muffin': 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600&auto=format&fit=crop&q=80',
      'cheesecake': 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80',
      'ham & cheese sandwich': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80'
    },

    // An explicit photo always wins; otherwise fall back to the shared map,
    // with a fuzzy match so slightly-off names still resolve.
    resolvePhoto(name, explicitPhoto) {
      if (explicitPhoto && explicitPhoto.trim()) return explicitPhoto.trim();
      const key = String(name || '').toLowerCase().trim();
      if (this.defaultImages[key]) return this.defaultImages[key];
      for (const k of Object.keys(this.defaultImages)) {
        if (key.includes(k) || k.includes(key)) return this.defaultImages[k];
      }
      return '';
    },

    // 1. Initial Health Ping
    async checkConnection() {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);
        const res = await fetch(`${this.apiUrl}/health`, {
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          this.isOnline = true;
          console.log('%c[Ai Coffee API] 🟢 Connected to live REST API & database!', 'color:#10b981; font-weight:bold;');
        } else {
          this.isOnline = false;
        }
      } catch (e) {
        this.isOnline = false;
        console.log('%c[Ai Coffee API] 🟠 Server not detected — using instant localStorage fallback.', 'color:#f59e0b;');
      }

      window.dispatchEvent(new CustomEvent('coffee_api_status', { detail: { online: this.isOnline } }));
      return this.isOnline;
    },

    // 2. Menu Catalog Methods
    async getMenu() {
      if (this.isOnline) {
        try {
          const res = await fetch(`${this.apiUrl}/menu`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              localStorage.setItem('menuItems', JSON.stringify(data));
              return data;
            }
          }
        } catch (err) {
          console.warn('[API] Fetch menu failed, falling back:', err);
        }
      }

      // Await the seed so a first-time visitor never sees an empty catalog.
      // Startup seeding runs in the background, so without this the initial
      // render can beat it to localStorage and show zero items.
      const seeded = await ensureSeeded('menu', 'menuItems');
      if (Array.isArray(seeded)) return seeded;

      try {
        return JSON.parse(localStorage.getItem('menuItems') || '[]');
      } catch (e) {
        return [];
      }
    },

    // 1b. Bootstrap localStorage from bundled seed files on first visit
    async seedFromFiles() {
      await ensureSeeded('menu', 'menuItems');
      await ensureSeeded('orders', 'orders');
      await ensureSeeded('feedback', 'feedback');
      await ensureSeeded('shop', 'shopInfo');
    },

    async saveMenuItem(item) {
      // Always sync to localStorage first for instant client responsiveness
      let localMenu = [];
      try {
        localMenu = JSON.parse(localStorage.getItem('menuItems') || '[]');
      } catch (e) {
        localMenu = [];
      }
      const existingIdx = localMenu.findIndex(m => m.name.toLowerCase() === (item.name || '').toLowerCase());
      if (existingIdx >= 0) {
        localMenu[existingIdx] = item;
      } else {
        localMenu.unshift(item);
      }
      localStorage.setItem('menuItems', JSON.stringify(localMenu));

      // If backend is active, send to REST API
      if (this.isOnline) {
        try {
          await fetch(`${this.apiUrl}/menu`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          });
        } catch (err) {
          console.warn('[API] Server sync menu item failed:', err);
        }
      }

      window.dispatchEvent(new CustomEvent('coffee_menu_updated', { detail: item }));
      return item;
    },

    async deleteMenuItem(itemName) {
      let localMenu = [];
      try {
        localMenu = JSON.parse(localStorage.getItem('menuItems') || '[]');
      } catch (e) {
        localMenu = [];
      }
      localMenu = localMenu.filter(m => m.name.toLowerCase() !== itemName.toLowerCase());
      localStorage.setItem('menuItems', JSON.stringify(localMenu));

      if (this.isOnline) {
        try {
          await fetch(`${this.apiUrl}/menu/${encodeURIComponent(itemName)}`, {
            method: 'DELETE'
          });
        } catch (err) {
          console.warn('[API] Delete menu item failed:', err);
        }
      }

      window.dispatchEvent(new CustomEvent('coffee_menu_updated'));
      return true;
    },

    // 3. Orders Methods
    async getOrders() {
      if (this.isOnline) {
        try {
          const res = await fetch(`${this.apiUrl}/orders`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              localStorage.setItem('orders', JSON.stringify(data));
              return data;
            }
          }
        } catch (err) {
          console.warn('[API] Fetch orders failed, falling back:', err);
        }
      }

      const seededOrders = await ensureSeeded('orders', 'orders');
      if (Array.isArray(seededOrders)) return seededOrders;

      try {
        return JSON.parse(localStorage.getItem('orders') || '[]');
      } catch (e) {
        return [];
      }
    },

    async createOrder(orderData) {
      const orderNumber = orderData.number || String(Math.floor(10000 + Math.random() * 90000));
      const newOrder = {
        ...orderData,
        number: orderNumber,
        status: orderData.status || 'processing',
        createdAt: orderData.createdAt || new Date().toISOString()
      };

      // Always save to localStorage for receipt and order history
      let orders = [];
      try {
        orders = JSON.parse(localStorage.getItem('orders') || '[]');
      } catch (e) {
        orders = [];
      }
      orders.unshift(newOrder);
      localStorage.setItem('orders', JSON.stringify(orders));
      localStorage.setItem('lastOrder', JSON.stringify(newOrder));
      localStorage.removeItem('cart'); // Clear cart after order

      if (this.isOnline) {
        try {
          const res = await fetch(`${this.apiUrl}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newOrder)
          });
          if (res.ok) {
            const data = await res.json();
            if (data.order) return data.order;
          }
        } catch (err) {
          console.warn('[API] Server create order failed, using local order:', err);
        }
      }

      window.dispatchEvent(new CustomEvent('coffee_orders_updated', { detail: newOrder }));
      return newOrder;
    },

    async updateOrderStatus(orderNumber, status) {
      let orders = [];
      try {
        orders = JSON.parse(localStorage.getItem('orders') || '[]');
      } catch (e) {
        orders = [];
      }
      const order = orders.find(o => String(o.number) === String(orderNumber));
      if (order) {
        order.status = status;
        localStorage.setItem('orders', JSON.stringify(orders));
      }

      if (this.isOnline) {
        try {
          await fetch(`${this.apiUrl}/orders/${encodeURIComponent(orderNumber)}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
          });
        } catch (err) {
          console.warn('[API] Update order status failed:', err);
        }
      }

      window.dispatchEvent(new CustomEvent('coffee_orders_updated'));
      return order;
    },

    // 4. Feedback Methods
    async getFeedback() {
      if (this.isOnline) {
        try {
          const res = await fetch(`${this.apiUrl}/feedback`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              localStorage.setItem('feedback', JSON.stringify(data));
              return data;
            }
          }
        } catch (err) {
          console.warn('[API] Fetch feedback failed, falling back:', err);
        }
      }

      const seededFeedback = await ensureSeeded('feedback', 'feedback');
      if (Array.isArray(seededFeedback)) return seededFeedback;

      try {
        return JSON.parse(localStorage.getItem('feedback') || '[]');
      } catch (e) {
        return [];
      }
    },

    async submitFeedback(fbData) {
      const newFb = {
        id: Date.now(),
        ...fbData,
        createdAt: new Date().toISOString()
      };

      let list = [];
      try {
        list = JSON.parse(localStorage.getItem('feedback') || '[]');
      } catch (e) {
        list = [];
      }
      list.unshift(newFb);
      localStorage.setItem('feedback', JSON.stringify(list));

      if (this.isOnline) {
        try {
          await fetch(`${this.apiUrl}/feedback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newFb)
          });
        } catch (err) {
          console.warn('[API] Submit feedback failed:', err);
        }
      }

      return newFb;
    },

    async deleteFeedback(id) {
      let list = [];
      try {
        list = JSON.parse(localStorage.getItem('feedback') || '[]');
      } catch (e) {
        list = [];
      }
      list = list.filter(f => f.id !== id);
      localStorage.setItem('feedback', JSON.stringify(list));

      if (this.isOnline) {
        try {
          await fetch(`${this.apiUrl}/feedback/${id}`, {
            method: 'DELETE'
          });
        } catch (err) {
          console.warn('[API] Delete feedback failed:', err);
        }
      }
      return true;
    },

    // 5. Store Information Methods
    async getShopInfo() {
      if (this.isOnline) {
        try {
          const res = await fetch(`${this.apiUrl}/shop-info`);
          if (res.ok) {
            const data = await res.json();
            if (data && data.name) {
              localStorage.setItem('shopInfo', JSON.stringify(data));
              return data;
            }
          }
        } catch (err) {}
      }

      const seededShop = await ensureSeeded('shop', 'shopInfo');
      if (seededShop && typeof seededShop === 'object') return seededShop;

      try {
        return JSON.parse(localStorage.getItem('shopInfo') || '{}');
      } catch (e) {
        return {};
      }
    },

    async saveShopInfo(info) {
      localStorage.setItem('shopInfo', JSON.stringify(info));
      if (this.isOnline) {
        try {
          await fetch(`${this.apiUrl}/shop-info`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(info)
          });
        } catch (err) {}
      }
      return info;
    },

    // 6. Authentication Methods
    async signUp(userData) {
      localStorage.setItem('coffee_shop_user', JSON.stringify(userData));
      if (this.isOnline) {
        try {
          const res = await fetch(`${this.apiUrl}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
          });
          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              localStorage.setItem('coffee_shop_user', JSON.stringify(data.user));
              return data.user;
            }
          }
        } catch (err) {}
      }
      return userData;
    },

    async signIn(email, password) {
      if (this.isOnline) {
        try {
          const res = await fetch(`${this.apiUrl}/auth/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              localStorage.setItem('coffee_shop_user', JSON.stringify(data.user));
              return data.user;
            }
          }
        } catch (err) {}
      }

      // Offline / Local fallback user
      const user = {
        name: email.split('@')[0],
        email: email,
        role: email.includes('admin') ? 'admin' : 'customer'
      };
      localStorage.setItem('coffee_shop_user', JSON.stringify(user));
      return user;
    },

    getUser() {
      try {
        return JSON.parse(localStorage.getItem('coffee_shop_user') || 'null');
      } catch (e) {
        return null;
      }
    },

    signOut() {
      localStorage.removeItem('coffee_shop_user');
      localStorage.removeItem('coffee_admin_mode');
    }
  };

  // Expose globally
  window.CoffeeAPI = CoffeeAPI;

  // Seed localStorage from bundled seed files, then ping the API.
  // Seeding first means the storefront always has content on a first visit,
  // whether or not a backend is present.
  CoffeeAPI.seedFromFiles().finally(() => {
    CoffeeAPI.checkConnection().then(online => {
      if (!online) return;
      // Refresh from the live API once we've confirmed it's reachable.
      CoffeeAPI.getMenu();
      CoffeeAPI.getOrders();
      CoffeeAPI.getFeedback();
      CoffeeAPI.getShopInfo();
    });
  });
})();

