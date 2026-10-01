/**
 * Ai Coffee Shop - Admin Control Center Logic
 */

const LS = {
  shop: 'shopInfo',
  menu: 'menuItems',
  photos: 'gallery',
  files: 'fileList'
};

const defaultMenu = [
  { name: 'Espresso', price: 2.50, category: 'hot', icon: '&#9749;', desc: 'Rich and bold single shot espresso.', photo: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop&q=80' },
  { name: 'Americano', price: 3.00, category: 'hot', icon: '&#9749;', desc: 'Espresso topped with hot water.', photo: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=600&auto=format&fit=crop&q=80' },
  { name: 'Cappuccino', price: 3.50, category: 'hot', icon: '&#9749;', desc: 'Espresso with creamy steamed milk.', photo: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&auto=format&fit=crop&q=80' },
  { name: 'Latte', price: 3.80, category: 'hot', icon: '&#9749;', desc: 'Smooth milk coffee with a soft foam.', photo: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=600&auto=format&fit=crop&q=80' },
  { name: 'Mocha', price: 4.20, category: 'hot', icon: '&#9749;', desc: 'Espresso, chocolate and steamed milk.', photo: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=600&auto=format&fit=crop&q=80' },
  { name: 'Caramel Macchiato', price: 4.50, category: 'hot', icon: '&#9749;', desc: 'Espresso with vanilla, milk and caramel.', photo: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=600&auto=format&fit=crop&q=80' },
  { name: 'Matcha Latte', price: 4.30, category: 'hot', icon: '&#127861;', desc: 'Ceremonial matcha with steamed milk.', photo: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80' },
  { name: 'Hot Chocolate', price: 3.60, category: 'hot', icon: '&#127861;', desc: 'Velvety cocoa with marshmallows.', photo: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&auto=format&fit=crop&q=80' },
  { name: 'Cold Brew', price: 4.00, category: 'cold', icon: '&#127853;', desc: 'Slow-steeped, smooth and refreshing.', photo: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80' },
  { name: 'Iced Latte', price: 4.00, category: 'cold', icon: '&#127865;', desc: 'Chilled espresso with cold milk.', photo: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop&q=80' },
  { name: 'Iced Caramel Frappe', price: 4.80, category: 'cold', icon: '&#127864;', desc: 'Blended coffee, caramel and ice.', photo: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80' },
  { name: 'Mango Smoothie', price: 4.50, category: 'cold', icon: '&#127865;', desc: 'Fresh mango blended with yogurt.', photo: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=600&auto=format&fit=crop&q=80' },
  { name: 'Lemon Iced Tea', price: 3.20, category: 'cold', icon: '&#127866;', desc: 'Refreshing tea with lemon zest.', photo: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80' },
  { name: 'Butter Croissant', price: 2.80, category: 'food', icon: '&#127828;', desc: 'Flaky, golden and buttery.', photo: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80' },
  { name: 'Chocolate Muffin', price: 2.50, category: 'food', icon: '&#127836;', desc: 'Moist muffin with chocolate chunks.', photo: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600&auto=format&fit=crop&q=80' },
  { name: 'Cheesecake', price: 4.90, category: 'food', icon: '&#127853;', desc: 'Creamy New York style slice.', photo: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&auto=format&fit=crop&q=80' },
  { name: 'Ham & Cheese Sandwich', price: 5.50, category: 'food', icon: '&#129368;', desc: 'Grilled sandwich with melted cheese.', photo: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80' }
];

const shopDefault = {
  name: 'Ai Coffee Shop',
  tagline: 'Freshly brewed specialty coffee, crafted with passion.',
  email: 'hello@aicoffeeshop.com',
  phone: '+1 555-0123',
  address: '123 Coffee Street, Cityville',
  hours: '7:00 AM — 9:00 PM',
  about: 'At Ai Coffee Shop, we believe great coffee brings people together.'
};

function load(key, fallback) {
  const data = localStorage.getItem(key);
  if (data !== null) {
    try { return JSON.parse(data); } catch (e) {}
  }
  return JSON.parse(JSON.stringify(fallback));
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Client-side Image Resizer & Compressor
function processImageFile(file, maxDimension, quality, callback) {
  if (!file || !file.type.startsWith('image/')) {
    alert('Please select a valid image file.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      let w = img.width;
      let h = img.height;
      const max = maxDimension || 600;

      if (w > max || h > max) {
        if (w > h) {
          h = Math.round((h * max) / w);
          w = max;
        } else {
          w = Math.round((w * max) / h);
          h = max;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);

      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality || 0.8);
      callback(compressedDataUrl, file.name);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

document.addEventListener('DOMContentLoaded', () => {
  const shop = load(LS.shop, shopDefault);
  let menu = load(LS.menu, defaultMenu);
  
  // Ensure all items have photos populated
  menu = menu.map(item => {
    if (!item.photo || !item.photo.trim()) {
      const found = defaultMenu.find(d => d.name.toLowerCase() === item.name.toLowerCase());
      if (found && found.photo) item.photo = found.photo;
    }
    return item;
  });
  save(LS.menu, menu);

  let photos = load(LS.photos, []);
  let files = load(LS.files, []);

  // --- 1. SHOP INFO ---
  const shopNameInput = document.getElementById('shopName');
  if (shopNameInput) {
    shopNameInput.value = shop.name;
    document.getElementById('shopTagline').value = shop.tagline;
    document.getElementById('shopEmail').value = shop.email;
    document.getElementById('shopPhone').value = shop.phone;
    document.getElementById('shopAddress').value = shop.address;
    document.getElementById('shopHours').value = shop.hours;
    document.getElementById('shopAbout').value = shop.about;

    document.getElementById('infoForm').addEventListener('submit', e => {
      e.preventDefault();
      const s = {
        name: document.getElementById('shopName').value.trim(),
        tagline: document.getElementById('shopTagline').value.trim(),
        email: document.getElementById('shopEmail').value.trim(),
        phone: document.getElementById('shopPhone').value.trim(),
        address: document.getElementById('shopAddress').value.trim(),
        hours: document.getElementById('shopHours').value.trim(),
        about: document.getElementById('shopAbout').value.trim()
      };
      save(LS.shop, s);
      const msg = document.getElementById('infoSaved');
      if (msg) {
        msg.style.display = 'block';
        setTimeout(() => { msg.style.display = 'none'; }, 3000);
      }
    });
  }

  // --- 2. MENU MANAGEMENT ---
  let editingIndex = null;
  const miFileInput = document.getElementById('miFileInput');
  const miPhoto = document.getElementById('miPhoto');
  const miPreviewBox = document.getElementById('miPreviewBox');
  const miPreviewImg = document.getElementById('miPreviewImg');
  const miPreviewName = document.getElementById('miPreviewName');
  const miClearPhotoBtn = document.getElementById('miClearPhotoBtn');

  if (miFileInput) {
    miFileInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;

      processImageFile(file, 600, 0.8, (dataUrl, fileName) => {
        miPhoto.value = dataUrl;
        miPreviewImg.src = dataUrl;
        miPreviewName.textContent = fileName || 'Photo uploaded from device';
        miPreviewBox.style.display = 'flex';
      });
    });
  }

  if (miPhoto) {
    miPhoto.addEventListener('input', () => {
      const url = miPhoto.value.trim();
      if (url) {
        miPreviewImg.src = url;
        miPreviewName.textContent = 'Remote image preview';
        miPreviewBox.style.display = 'flex';
      } else {
        miPreviewBox.style.display = 'none';
      }
    });
  }

  if (miClearPhotoBtn) {
    miClearPhotoBtn.addEventListener('click', () => {
      miPhoto.value = '';
      if (miFileInput) miFileInput.value = '';
      miPreviewImg.src = '';
      miPreviewBox.style.display = 'none';
    });
  }

  const menuForm = document.getElementById('menuForm');
  if (menuForm) {
    menuForm.addEventListener('submit', e => {
      e.preventDefault();
      const item = {
        name: document.getElementById('miName').value.trim(),
        price: parseFloat(document.getElementById('miPrice').value),
        category: document.getElementById('miCategory').value,
        icon: document.getElementById('miIcon').value.trim() || '&#9749;',
        desc: document.getElementById('miDesc').value.trim(),
        photo: miPhoto.value.trim()
      };

      if (editingIndex !== null) {
        menu[editingIndex] = item;
        editingIndex = null;
        document.getElementById('menuFormTitle').textContent = 'Add New Menu Item';
        document.getElementById('cancelEditMenuBtn').style.display = 'none';
      } else {
        menu.push(item);
      }

      save(LS.menu, menu);
      e.target.reset();
      miClearPhotoBtn.click();
      renderMenu();
    });
  }

  const cancelEditMenuBtn = document.getElementById('cancelEditMenuBtn');
  if (cancelEditMenuBtn) {
    cancelEditMenuBtn.addEventListener('click', () => {
      editingIndex = null;
      if (menuForm) menuForm.reset();
      if (miClearPhotoBtn) miClearPhotoBtn.click();
      document.getElementById('menuFormTitle').textContent = 'Add New Menu Item';
      cancelEditMenuBtn.style.display = 'none';
    });
  }

  function renderMenu() {
    const list = document.getElementById('menuList');
    if (!list) return;
    list.innerHTML = '';
    if (!menu || menu.length === 0) {
      list.innerHTML = '<p style="color:var(--text-dim); text-align:center; padding:20px;">No menu items cataloged yet.</p>';
      return;
    }
    menu.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'row-item';
      const thumb = item.photo
        ? '<img src="' + item.photo + '" alt="' + item.name + '">'
        : item.icon || '&#9749;';

      div.innerHTML = `
        <div class="item-thumb">${thumb}</div>
        <div class="item-main">
          <h4 style="color:var(--text-main); font-size:1rem;">${item.name}</h4>
          <p style="color:var(--text-muted); font-size:0.85rem;">
            <span style="color:var(--color-primary); font-weight:700;">$${Number(item.price).toFixed(2)}</span> &bull; 
            <span style="text-transform:capitalize;">${item.category}</span> &bull; ${item.desc || 'No description'}
          </p>
        </div>
        <div class="actions">
          <button type="button" class="btn btn-secondary btn-sm edit-menu-btn" data-index="${i}">Edit</button>
          <button type="button" class="btn btn-danger btn-sm del-menu-btn" data-index="${i}">Delete</button>
        </div>
      `;
      list.appendChild(div);
    });
  }

  const menuListContainer = document.getElementById('menuList');
  if (menuListContainer) {
    menuListContainer.addEventListener('click', e => {
      const editBtn = e.target.closest('.edit-menu-btn');
      if (editBtn) {
        const i = parseInt(editBtn.dataset.index);
        editingIndex = i;
        const item = menu[i];
        document.getElementById('miName').value = item.name;
        document.getElementById('miPrice').value = item.price;
        document.getElementById('miCategory').value = item.category;
        document.getElementById('miIcon').value = item.icon === '&#9749;' ? '' : item.icon;
        document.getElementById('miDesc').value = item.desc || '';
        miPhoto.value = item.photo || '';

        if (item.photo) {
          miPreviewImg.src = item.photo;
          miPreviewName.textContent = 'Current Item Photo';
          miPreviewBox.style.display = 'flex';
        } else {
          miPreviewBox.style.display = 'none';
        }

        document.getElementById('menuFormTitle').textContent = 'Editing Menu Item: ' + item.name;
        document.getElementById('cancelEditMenuBtn').style.display = 'inline-flex';
        document.querySelector('#tab-menu').scrollIntoView({ behavior: 'smooth' });
        return;
      }

      const delBtn = e.target.closest('.del-menu-btn');
      if (delBtn) {
        const i = parseInt(delBtn.dataset.index);
        if (confirm('Delete this menu item?')) {
          menu.splice(i, 1);
          save(LS.menu, menu);
          renderMenu();
        }
      }
    });
  }

  // --- 3. PHOTOS TAB ---
  const phFileInput = document.getElementById('phFileInput');
  const phUrl = document.getElementById('phUrl');
  const phPreviewBox = document.getElementById('phPreviewBox');
  const phPreviewImg = document.getElementById('phPreviewImg');
  const phPreviewName = document.getElementById('phPreviewName');
  const phClearPhotoBtn = document.getElementById('phClearPhotoBtn');

  if (phFileInput) {
    phFileInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;

      processImageFile(file, 800, 0.82, (dataUrl, fileName) => {
        phUrl.value = dataUrl;
        phPreviewImg.src = dataUrl;
        phPreviewName.textContent = fileName || 'Photo uploaded from device';
        phPreviewBox.style.display = 'flex';
      });
    });
  }

  if (phUrl) {
    phUrl.addEventListener('input', () => {
      const url = phUrl.value.trim();
      if (url) {
        phPreviewImg.src = url;
        phPreviewName.textContent = 'Remote image preview';
        phPreviewBox.style.display = 'flex';
      } else {
        phPreviewBox.style.display = 'none';
      }
    });
  }

  if (phClearPhotoBtn) {
    phClearPhotoBtn.addEventListener('click', () => {
      phUrl.value = '';
      if (phFileInput) phFileInput.value = '';
      phPreviewImg.src = '';
      phPreviewBox.style.display = 'none';
    });
  }

  const photoForm = document.getElementById('photoForm');
  if (photoForm) {
    photoForm.addEventListener('submit', e => {
      e.preventDefault();
      const caption = document.getElementById('phCaption').value.trim();
      const url = phUrl.value.trim();

      if (!url) {
        alert('Please choose an image from your device or enter an image URL.');
        return;
      }

      photos.push({ caption, url });
      save(LS.photos, photos);
      e.target.reset();
      phClearPhotoBtn.click();
      renderPhotos();
    });
  }

  function renderPhotos() {
    const g = document.getElementById('gallery');
    if (!g) return;
    g.innerHTML = '';
    if (!photos || photos.length === 0) {
      g.innerHTML = '<p style="color:var(--text-dim); text-align:center; padding:20px; grid-column: 1 / -1;">No photos in gallery yet.</p>';
      return;
    }
    photos.forEach((p, i) => {
      const div = document.createElement('div');
      div.className = 'photo-card';
      div.innerHTML = `
        <img src="${p.url}" alt="${p.caption}">
        <span class="caption-bar">${p.caption}</span>
        <button type="button" class="del-btn del-photo-btn" data-index="${i}" title="Delete photo">&times;</button>
      `;
      g.appendChild(div);
    });
  }

  const galleryContainer = document.getElementById('gallery');
  if (galleryContainer) {
    galleryContainer.addEventListener('click', e => {
      const delBtn = e.target.closest('.del-photo-btn');
      if (!delBtn) return;
      const i = parseInt(delBtn.dataset.index);
      photos.splice(i, 1);
      save(LS.photos, photos);
      renderPhotos();
    });
  }

  // --- 4. FILES TAB ---
  const flFileInput = document.getElementById('flFileInput');
  const flUrl = document.getElementById('flUrl');
  const flName = document.getElementById('flName');
  const flNotice = document.getElementById('flSelectedNotice');

  if (flFileInput) {
    flFileInput.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;

      if (!flName.value) {
        flName.value = file.name;
      }

      const reader = new FileReader();
      reader.onload = function (evt) {
        flUrl.value = evt.target.result;
        flNotice.style.display = 'block';
        flNotice.textContent = '✅ File "' + file.name + '" loaded from device and ready to save.';
      };
      reader.readAsDataURL(file);
    });
  }

  const fileForm = document.getElementById('fileForm');
  if (fileForm) {
    fileForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = flName.value.trim();
      const url = flUrl.value.trim();

      if (!url) {
        alert('Please select a file from your device or enter a document URL.');
        return;
      }

      files.push({ name, url });
      save(LS.files, files);
      e.target.reset();
      flNotice.style.display = 'none';
      renderFiles();
    });
  }

  function renderFiles() {
    const list = document.getElementById('fileList');
    if (!list) return;
    list.innerHTML = '';
    if (!files || files.length === 0) {
      list.innerHTML = '<p style="color:var(--text-dim); text-align:center; padding:20px;">No document attachments saved.</p>';
      return;
    }
    files.forEach((f, i) => {
      const div = document.createElement('div');
      div.className = 'row-item';
      div.innerHTML = `
        <div class="item-main">
          <h4 style="color:var(--text-main); font-size:1rem;">📄 ${f.name}</h4>
          <p style="color:var(--text-dim); font-size:0.82rem; word-break:break-all;">${f.url.startsWith('data:') ? 'Uploaded local file (' + Math.round(f.url.length * 0.75 / 1024) + ' KB)' : f.url}</p>
        </div>
        <div class="actions">
          <a class="btn btn-secondary btn-sm" href="${f.url}" target="_blank" download="${f.name}">Open / Download</a>
          <button type="button" class="btn btn-danger btn-sm del-file-btn" data-index="${i}">Delete</button>
        </div>
      `;
      list.appendChild(div);
    });
  }

  const fileListContainer = document.getElementById('fileList');
  if (fileListContainer) {
    fileListContainer.addEventListener('click', e => {
      const delBtn = e.target.closest('.del-file-btn');
      if (!delBtn) return;
      const i = parseInt(delBtn.dataset.index);
      files.splice(i, 1);
      save(LS.files, files);
      renderFiles();
    });
  }

  // TABS CONTROLLER
  document.querySelectorAll('.admin-tabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.admin-tabs button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-body').forEach(s => {
        s.classList.toggle('show', s.id === btn.dataset.tab);
      });
    });
  });

  // Top 'Add New Product' Quick Action
  const btnTopAddProduct = document.getElementById('btnTopAddProduct');
  if (btnTopAddProduct) {
    btnTopAddProduct.addEventListener('click', () => {
      const menuTabBtn = document.querySelector('.admin-tabs button[data-tab="tab-menu"]');
      if (menuTabBtn) menuTabBtn.click();
      const nameInput = document.getElementById('miName');
      if (nameInput) {
        nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        nameInput.focus();
      }
    });
  }

  // Preview Modal Logic
  const previewModal = document.getElementById('previewModal');
  const previewFrame = document.getElementById('previewFrame');
  const btnPreviewSite = document.getElementById('btnPreviewSite');
  const btnClosePreview = document.getElementById('btnClosePreview');

  if (btnPreviewSite && previewModal && previewFrame) {
    btnPreviewSite.addEventListener('click', () => {
      previewModal.style.display = 'flex';
      previewFrame.src = 'Home.html';
    });
  }

  if (btnClosePreview && previewModal) {
    btnClosePreview.addEventListener('click', () => {
      previewModal.style.display = 'none';
    });
  }

  if (previewModal) {
    previewModal.addEventListener('click', e => {
      if (e.target === previewModal) previewModal.style.display = 'none';
    });
  }

  const modeDesk = document.getElementById('previewModeDesktop');
  const modeTab = document.getElementById('previewModeTablet');
  const modeMob = document.getElementById('previewModeMobile');

  function setPreviewActive(activeBtn) {
    [modeDesk, modeTab, modeMob].forEach(btn => {
      if (!btn) return;
      if (btn === activeBtn) {
        btn.style.background = 'var(--color-primary)';
        btn.style.color = '#000';
      } else {
        btn.style.background = 'transparent';
        btn.style.color = 'var(--text-muted)';
      }
    });
  }

  if (modeDesk && previewFrame) {
    modeDesk.addEventListener('click', function() {
      previewFrame.style.width = '100%';
      setPreviewActive(this);
    });
  }
  if (modeTab && previewFrame) {
    modeTab.addEventListener('click', function() {
      previewFrame.style.width = '768px';
      setPreviewActive(this);
    });
  }
  if (modeMob && previewFrame) {
    modeMob.addEventListener('click', function() {
      previewFrame.style.width = '390px';
      setPreviewActive(this);
    });
  }

  // Initial renders
  renderMenu();
  renderPhotos();
  renderFiles();
});

