/**
 * Ai Coffee Shop - Home Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const CATEGORY_LABELS = {
    hot: 'Hot Coffee',
    cold: 'Cold & Iced Drinks',
    food: 'Food & Pastries'
  };

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Photos resolve through the shared CoffeeAPI map, so the home page and the
  // menu page always fall back to the same image for a given item name.
  function resolvePhoto(item) {
    if (window.CoffeeAPI && window.CoffeeAPI.resolvePhoto) {
      return window.CoffeeAPI.resolvePhoto(item.name, item.photo);
    }
    return (item.photo || '').trim();
  }

  function buildCard(item) {
    const photo = resolvePhoto(item);
    const icon = escapeHtml(item.icon || '\u2615');

    const thumb = photo
      ? '<div class="card-thumb"><img src="' + escapeHtml(photo) + '" alt="' + escapeHtml(item.name) + '" loading="lazy"></div>'
      : '<div class="card-thumb">' + icon + '</div>';

    const card = document.createElement('div');
    card.className = 'coffee-card';
    card.dataset.name = item.name;
    card.dataset.desc = item.desc || '';
    card.dataset.price = item.price;
    card.dataset.icon = item.icon || '\u2615';
    card.dataset.category = item.category;
    if (photo) card.dataset.photo = photo;

    card.innerHTML = thumb +
      '<h3>' + escapeHtml(item.name) + '</h3>' +
      '<p>' + escapeHtml(item.desc || '') + '</p>' +
      '<div class="card-footer">' +
        '<span class="card-price">$' + Number(item.price || 0).toFixed(2) + '</span>' +
        '<span class="card-add-btn">Customize &rarr;</span>' +
      '</div>';

    return card;
  }

  async function renderMenu() {
    let items = [];
    if (window.CoffeeAPI) {
      items = await window.CoffeeAPI.getMenu();
    } else {
      try { items = JSON.parse(localStorage.getItem('menuItems') || '[]'); } catch (e) { items = []; }
    }
    if (!Array.isArray(items)) return;

    Object.keys(CATEGORY_LABELS).forEach(cat => {
      const grid = document.querySelector('[data-home-cat="' + cat + '"]');
      if (!grid) return;

      const inCat = items.filter(i => (i.category || 'hot') === cat);
      grid.innerHTML = '';
      inCat.forEach(item => grid.appendChild(buildCard(item)));

      const countEl = document.querySelector('[data-home-count="' + cat + '"]');
      if (countEl) {
        countEl.textContent = inCat.length + (inCat.length === 1 ? ' selection' : ' selections');
      }
    });

    bindCardClicks();
  }

  function bindCardClicks() {
    document.querySelectorAll('.coffee-card').forEach(card => {
      if (card.dataset.bound === '1') return;
      card.dataset.bound = '1';
      card.addEventListener('click', () => {
        const params = new URLSearchParams();
        params.set('name', card.dataset.name || '');
        params.set('desc', card.dataset.desc || '');
        params.set('price', card.dataset.price || '');
        params.set('icon', card.dataset.icon || '');
        if (card.dataset.photo) params.set('photo', card.dataset.photo);
        location.href = 'Product.html?' + params.toString();
      });
    });
  }

  renderMenu();

  // Keep the home page in step with admin menu edits, whether they happen in
  // this tab (custom event) or another tab (storage event).
  window.addEventListener('coffee_menu_updated', renderMenu);
  window.addEventListener('storage', e => {
    if (e.key === 'menuItems') renderMenu();
  });

  // Contact form submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      alert("Thank you! We've received your message and will respond shortly.");
      e.target.reset();
    });
  }
});
