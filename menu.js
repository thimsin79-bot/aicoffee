/**
 * Ai Coffee Shop - Menu Page Logic
 */

// Photo fallback map and resolveItemPhoto() now live on CoffeeAPI in api.js,
// which every page loads, so the home page and menu page never disagree.

function resolveItemPhoto(name, explicitPhoto) {
  if (window.CoffeeAPI && window.CoffeeAPI.resolvePhoto) {
    return window.CoffeeAPI.resolvePhoto(name, explicitPhoto);
  }
  return (explicitPhoto || '').trim();
}

document.addEventListener('DOMContentLoaded', () => {
  // Category Tab Switching
  const buttons = document.querySelectorAll('.tabs button');
  const sections = document.querySelectorAll('.menu-section');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      sections.forEach(s => s.classList.remove('show'));
      const targetSection = document.getElementById(button.dataset.tab);
      if (targetSection) targetSection.classList.add('show');
    });
  });

  // Handle dynamic items from live API or localStorage
  async function renderCustomMenuItems() {
    let items = [];
    if (window.CoffeeAPI) {
      items = await window.CoffeeAPI.getMenu();
    } else {
      try { items = JSON.parse(localStorage.getItem('menuItems') || '[]'); } catch (e) {}
    }
    if (!Array.isArray(items) || items.length === 0) return;

    const container = { hot: 'hot', cold: 'cold', food: 'food' };
    document.querySelectorAll('.menu-section').forEach(s => s.innerHTML = '');

    items.forEach(item => {
      const cid = container[item.category];
      if (!cid) return;
      const section = document.getElementById(cid);
      if (!section) return;

      const div = document.createElement('div');
      div.className = 'menu-item';
      div.dataset.name = item.name;
      div.dataset.desc = item.desc || '';
      div.dataset.price = item.price;
      div.dataset.icon = item.icon || '&#9749;';
      div.dataset.category = item.category === 'food' ? 'Food & Pastries' : item.category === 'cold' ? 'Cold & Iced Drinks' : 'Hot Coffee';

      const photoUrl = resolveItemPhoto(item.name, item.photo);
      div.dataset.photo = photoUrl;

      const thumb = photoUrl
        ? '<span class="badge-thumb"><img src="' + photoUrl + '" alt="' + item.name + '" loading="lazy"></span>'
        : '<span class="badge-thumb">' + (item.icon || '&#9749;') + '</span>';

      div.innerHTML = `
        <div class="item-left">
          ${thumb}
          <div class="item-info">
            <h3>${item.name}</h3>
            <p>${item.desc || ''}</p>
          </div>
        </div>
        <div class="item-right">
          <div class="item-price">$${Number(item.price).toFixed(2)}</div>
          <span class="item-cta">Customize &rarr;</span>
        </div>
      `;
      section.appendChild(div);
    });
  }

  renderCustomMenuItems();

  window.addEventListener('coffee_menu_updated', () => {
    renderCustomMenuItems();
  });
  window.addEventListener('storage', e => {
    if (e.key === 'menuItems') renderCustomMenuItems();
  });

  // Click handler on menu item to go to Product.html with photo
  document.addEventListener('click', e => {
    const item = e.target.closest('.menu-item');
    if (!item) return;

    const name = item.dataset.name || item.querySelector('h3').textContent.trim();
    const desc = item.dataset.desc || item.querySelector('p').textContent.trim();
    const price = item.dataset.price || item.querySelector('.item-price').textContent.replace('$', '').trim();
    const icon = item.dataset.icon || '&#9749;';
    const category = item.dataset.category || 'Hot Coffee';
    const photo = item.dataset.photo || (item.querySelector('.badge-thumb img') ? item.querySelector('.badge-thumb img').src : resolveItemPhoto(name));

    location.href = 'Product.html?name=' + encodeURIComponent(name) +
      '&desc=' + encodeURIComponent(desc) +
      '&price=' + encodeURIComponent(price) +
      '&category=' + encodeURIComponent(category) +
      '&icon=' + encodeURIComponent(icon) +
      (photo ? '&photo=' + encodeURIComponent(photo) : '');
  });
});

