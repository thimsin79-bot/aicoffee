/**
 * Ai Coffee Shop - Product Page Logic & Customization
 */

// High-Quality Photo Database for Default Menu
const PRODUCT_DEFAULT_IMAGES = {
  'espresso': 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=800&auto=format&fit=crop&q=80',
  'americano': 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=800&auto=format&fit=crop&q=80',
  'cappuccino': 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&auto=format&fit=crop&q=80',
  'latte': 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=800&auto=format&fit=crop&q=80',
  'mocha': 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=800&auto=format&fit=crop&q=80',
  'caramel macchiato': 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=800&auto=format&fit=crop&q=80',
  'matcha latte': 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&auto=format&fit=crop&q=80',
  'hot chocolate': 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=800&auto=format&fit=crop&q=80',
  'cold brew': 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800&auto=format&fit=crop&q=80',
  'iced latte': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&auto=format&fit=crop&q=80',
  'iced caramel frappe': 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80',
  'mango smoothie': 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=800&auto=format&fit=crop&q=80',
  'lemon iced tea': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&auto=format&fit=crop&q=80',
  'butter croissant': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80',
  'chocolate muffin': 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=800&auto=format&fit=crop&q=80',
  'cheesecake': 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80',
  'ham & cheese sandwich': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&auto=format&fit=crop&q=80'
};

function getProductPhoto(name, explicitPhoto) {
  if (explicitPhoto && explicitPhoto.trim()) return explicitPhoto.trim();
  try {
    const stored = JSON.parse(localStorage.getItem('menuItems') || '[]');
    const found = stored.find(i => (i.name || '').toLowerCase() === (name || '').toLowerCase());
    if (found && found.photo && found.photo.trim()) return found.photo.trim();
  } catch (e) {}
  const key = (name || '').toLowerCase().trim();
  if (PRODUCT_DEFAULT_IMAGES[key]) return PRODUCT_DEFAULT_IMAGES[key];
  for (const [k, url] of Object.entries(PRODUCT_DEFAULT_IMAGES)) {
    if (key.includes(k) || k.includes(key)) return url;
  }
  return '';
}

document.addEventListener('DOMContentLoaded', () => {
  // Product State & Elements
  let basePrice = 3.50;
  let selectedSize = 0.50;
  let selectedExtras = 0;
  let qty = 1;
  let selectedSizeLabel = 'Medium';
  let selectedExtrasLabels = [];
  let currentProductPhoto = '';

  const priceEls = {
    total: document.getElementById('totalPrice'),
    display: document.getElementById('productPrice')
  };

  function updatePrice() {
    const unit = basePrice + selectedSize + selectedExtras;
    if (priceEls.display) priceEls.display.textContent = '$' + unit.toFixed(2);
    if (priceEls.total) priceEls.total.textContent = '$' + (unit * qty).toFixed(2);
  }

  function recalculateExtras() {
    selectedExtras = 0;
    selectedExtrasLabels = [];
    document.querySelectorAll('#extraOptions button.selected').forEach(b => {
      if (b.id === 'btnCustomExtra') return;
      selectedExtras += parseFloat(b.dataset.price || 0);
      selectedExtrasLabels.push(b.textContent.split('(')[0].replace('+', '').trim());
    });
    updatePrice();
  }

  function loadProduct(prod) {
    if (prod.name) document.getElementById('productName').textContent = prod.name;
    if (prod.price !== undefined) {
      basePrice = parseFloat(prod.price) || 3.50;
    }
    if (prod.desc !== undefined) {
      document.getElementById('productDescription').textContent = prod.desc || 'Handcrafted specialty beverage brewed fresh for you.';
    }
    if (prod.category) {
      document.getElementById('productCategory').textContent = prod.category;
    }
    
    const resolvedPhoto = getProductPhoto(prod.name, prod.photo);
    currentProductPhoto = resolvedPhoto;

    const imgEl = document.getElementById('productFeaturedImg');
    const iconEl = document.getElementById('productImage');

    if (resolvedPhoto) {
      imgEl.src = resolvedPhoto;
      imgEl.alt = prod.name || 'Coffee';
      imgEl.style.display = 'block';
      iconEl.style.display = 'none';
      imgEl.onerror = function () {
        this.style.display = 'none';
        iconEl.style.display = 'block';
        iconEl.innerHTML = prod.icon || '&#9749;';
      };
    } else {
      imgEl.style.display = 'none';
      iconEl.style.display = 'block';
      iconEl.innerHTML = prod.icon || '&#9749;';
    }

    qty = 1;
    document.getElementById('qty').textContent = qty;
    updatePrice();
  }

  // Initialize from URL Parameters or LocalStorage
  const params = new URLSearchParams(window.location.search);
  const initialName = params.get('name') || 'Cappuccino';
  const initialPrice = params.get('price') ? parseFloat(params.get('price')) : 3.50;
  const initialDesc = params.get('desc') || 'Espresso balanced with steamed milk and airy velvet microfoam.';
  const initialCategory = params.get('category') || 'Hot Coffee';
  const initialIcon = params.get('icon') || '&#9749;';
  const initialPhoto = params.get('photo') || '';

  loadProduct({
    name: initialName,
    price: initialPrice,
    desc: initialDesc,
    category: initialCategory,
    icon: initialIcon,
    photo: initialPhoto
  });

  // Size & Extras Pill Selection
  document.querySelectorAll('#sizeOptions button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#sizeOptions button').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSize = parseFloat(btn.dataset.price || 0);
      selectedSizeLabel = btn.textContent.split('(')[0].trim();
      updatePrice();
    });
  });

  document.querySelectorAll('#extraOptions button').forEach(btn => {
    if (btn.id === 'btnCustomExtra') return;
    btn.addEventListener('click', () => {
      btn.classList.toggle('selected');
      recalculateExtras();
    });
  });

  // Custom Extra Button (+ Custom Item)
  const btnCustomExtra = document.getElementById('btnCustomExtra');
  if (btnCustomExtra) {
    btnCustomExtra.addEventListener('click', function () {
      const extraName = prompt('Enter custom add-in or flavor item (e.g., Caramel Drizzle, Honey, Vanilla Syrup):');
      if (!extraName || !extraName.trim()) return;
      const extraPriceStr = prompt('Enter price for ' + extraName.trim() + ' in $ (e.g., 0.50, or 0 for free):', '0.50');
      const extraPrice = parseFloat(extraPriceStr) || 0;

      const newBtn = document.createElement('button');
      newBtn.type = 'button';
      newBtn.dataset.price = extraPrice.toFixed(2);
      newBtn.className = 'selected';
      newBtn.textContent = '+ ' + extraName.trim() + ' ($' + extraPrice.toFixed(2) + ')';
      newBtn.addEventListener('click', () => {
        newBtn.classList.toggle('selected');
        recalculateExtras();
      });

      const container = document.getElementById('extraOptions');
      container.insertBefore(newBtn, this);
      recalculateExtras();
      showToast('Added custom add-in: ' + extraName.trim());
    });
  }

  // Quantity Adjustments
  const minusBtn = document.getElementById('minus');
  const plusBtn = document.getElementById('plus');
  if (minusBtn) {
    minusBtn.addEventListener('click', () => {
      if (qty > 1) {
        qty--;
        document.getElementById('qty').textContent = qty;
        updatePrice();
      }
    });
  }
  if (plusBtn) {
    plusBtn.addEventListener('click', () => {
      qty++;
      document.getElementById('qty').textContent = qty;
      updatePrice();
    });
  }

  // Add to Cart Handler
  const addToCartBtn = document.getElementById('addToCart');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const name = document.getElementById('productName').textContent;
      const icon = document.getElementById('productImage').innerHTML;
      const unitPrice = basePrice + selectedSize + selectedExtras;
      const item = {
        name,
        icon,
        photo: currentProductPhoto,
        size: selectedSizeLabel,
        extras: selectedExtrasLabels,
        unitPrice: parseFloat(unitPrice.toFixed(2)),
        qty,
        lineTotal: parseFloat((unitPrice * qty).toFixed(2))
      };

      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      cart.push(item);
      localStorage.setItem('cart', JSON.stringify(cart));

      // Instant live update of all cart badges
      if (window.updateCartBadge) {
        window.updateCartBadge();
      }

      showToast('Added ' + qty + 'x ' + name + ' to cart!', true);
    });
  }

  // Toast Notification Helper
  let toastTimeout;
  function showToast(msg, showCartBtn) {
    const toast = document.getElementById('toast');
    const text = document.getElementById('toastText');
    const cartLink = document.getElementById('toastCartLink');
    if (!toast || !text) return;

    text.textContent = msg;
    if (cartLink) {
      cartLink.style.display = showCartBtn ? 'inline-flex' : 'none';
    }

    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, showCartBtn ? 3800 : 2500);
  }

  // Add New Product Item Modal Controller
  const addItemModal = document.getElementById('addItemModal');
  const btnOpenModal = document.getElementById('btnOpenAddItemModal');
  const btnCloseModal = document.getElementById('closeAddItemModal');
  const btnCancelModal = document.getElementById('cancelAddItemModal');
  let currentUploadedPhoto = '';

  function openModal() {
    if (!addItemModal) return;
    addItemModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    const nameInput = document.getElementById('newProdName');
    if (nameInput) nameInput.focus();
  }

  function closeModal() {
    if (!addItemModal) return;
    addItemModal.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (btnOpenModal) btnOpenModal.addEventListener('click', openModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

  if (addItemModal) {
    addItemModal.addEventListener('click', (e) => {
      if (e.target === addItemModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && addItemModal && addItemModal.classList.contains('show')) {
      closeModal();
    }
  });

  // Client-side image compression for device photos
  function compressImage(file, maxDim, quality, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        callback(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  const fileInput = document.getElementById('newProdPhotoFile');
  if (fileInput) {
    fileInput.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (!file) return;
      compressImage(file, 600, 0.75, function (dataUrl) {
        currentUploadedPhoto = dataUrl;
        document.getElementById('newProdPhotoImg').src = dataUrl;
        document.getElementById('newProdPhotoName').textContent = file.name;
        document.getElementById('newProdPhotoPreview').style.display = 'flex';
        document.getElementById('newProdPhotoUrl').value = '';
      });
    });
  }

  const urlInput = document.getElementById('newProdPhotoUrl');
  if (urlInput) {
    urlInput.addEventListener('input', function () {
      const url = this.value.trim();
      if (url) {
        currentUploadedPhoto = url;
        document.getElementById('newProdPhotoImg').src = url;
        document.getElementById('newProdPhotoName').textContent = 'Web Image Link';
        document.getElementById('newProdPhotoPreview').style.display = 'flex';
      } else if (!document.getElementById('newProdPhotoFile').files.length) {
        currentUploadedPhoto = '';
        document.getElementById('newProdPhotoPreview').style.display = 'none';
      }
    });
  }

  const removePhotoBtn = document.getElementById('removePhotoBtn');
  if (removePhotoBtn) {
    removePhotoBtn.addEventListener('click', function () {
      currentUploadedPhoto = '';
      document.getElementById('newProdPhotoFile').value = '';
      document.getElementById('newProdPhotoUrl').value = '';
      document.getElementById('newProdPhotoPreview').style.display = 'none';
    });
  }

  // Form submission for adding product to menu catalog
  const addNewItemForm = document.getElementById('addNewItemForm');
  if (addNewItemForm) {
    addNewItemForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('newProdName').value.trim();
      const category = document.getElementById('newProdCat').value;
      const price = parseFloat(document.getElementById('newProdPrice').value) || 3.50;
      const icon = document.getElementById('newProdIcon').value.trim() || '☕';
      const desc = document.getElementById('newProdDesc').value.trim();
      const photo = currentUploadedPhoto || '';

      const newItem = {
        name,
        price,
        category,
        icon,
        desc,
        photo
      };

      let menuItems = [];
      try {
        menuItems = JSON.parse(localStorage.getItem('menuItems') || '[]');
      } catch (err) {
        menuItems = [];
      }

      const existingIdx = menuItems.findIndex(m => m.name.toLowerCase() === name.toLowerCase());
      if (existingIdx >= 0) {
        menuItems[existingIdx] = newItem;
      } else {
        menuItems.unshift(newItem);
      }
      localStorage.setItem('menuItems', JSON.stringify(menuItems));

      closeModal();
      this.reset();
      currentUploadedPhoto = '';
      document.getElementById('newProdPhotoPreview').style.display = 'none';

      const catLabel = category === 'food' ? 'Food & Pastries' : category === 'cold' ? 'Cold & Iced Drinks' : 'Hot Coffee';
      loadProduct({
        name,
        price,
        category: catLabel,
        icon,
        desc,
        photo
      });

      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('name', name);
      newUrl.searchParams.set('price', price.toFixed(2));
      newUrl.searchParams.set('category', catLabel);
      newUrl.searchParams.set('desc', desc);
      newUrl.searchParams.set('icon', icon);
      window.history.pushState({}, '', newUrl.toString());

      showToast('🎉 ' + name + ' added to menu catalog!');
    });
  }
});

