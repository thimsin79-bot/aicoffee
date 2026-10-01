/**
 * Ai Coffee Shop - Admin Dashboard Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Set admin mode in localStorage so public site shows floating admin bar
  localStorage.setItem('coffee_admin_mode', 'true');

  async function loadDashboardData() {
    const orders = window.CoffeeAPI ? await window.CoffeeAPI.getOrders() : JSON.parse(localStorage.getItem('orders') || '[]');
    const feedback = window.CoffeeAPI ? await window.CoffeeAPI.getFeedback() : JSON.parse(localStorage.getItem('feedback') || '[]');
    const statuses = ['completed', 'processing', 'delivered'];

    function totalSales() {
      return orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    }

    function totalItems() {
      return orders.reduce((sum, o) =>
        sum + (o.items || []).reduce((s, i) => s + (Number(i.qty) || 0), 0), 0);
    }

    const totalOrdersEl = document.getElementById('totalOrders');
    const revenueEl = document.getElementById('revenue');
    const productsSoldEl = document.getElementById('productsSold');
    const feedbackCountEl = document.getElementById('feedbackCount');
    const complaintCountEl = document.getElementById('complaintCount');

    if (totalOrdersEl) totalOrdersEl.textContent = orders.length;
    if (revenueEl) revenueEl.textContent = '$' + totalSales().toFixed(2);
    if (productsSoldEl) productsSoldEl.textContent = totalItems();
    if (feedbackCountEl) feedbackCountEl.textContent = feedback.length;
    if (complaintCountEl) {
      complaintCountEl.textContent = feedback.filter(f => f.type === 'Complaint').length + ' complaints';
    }

    const tbody = document.getElementById('ordersTable');
    if (tbody) {
      if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-dim); padding:20px;">No orders found yet.</td></tr>';
      } else {
        tbody.innerHTML = '';
        orders.slice().reverse().slice(0, 8).forEach(o => {
          const status = statuses[o.number.length % 3];
          const itemCount = (o.items || []).reduce((s, i) => s + (Number(i.qty) || 0), 0) + ' items';
          tbody.innerHTML += `
            <tr>
              <td style="font-weight:700; color:var(--color-primary)">#${o.number}</td>
              <td>${o.name || 'Customer'}</td>
              <td>${itemCount}</td>
              <td style="font-weight:700;">$${Number(o.total).toFixed(2)}</td>
              <td><span class="status-badge ${status}">${status}</span></td>
            </tr>`;
        });
      }
    }

    const fbList = document.getElementById('feedbackList');
    if (fbList) {
      if (feedback.length === 0) {
        fbList.innerHTML = '<p style="text-align:center; color:var(--text-dim); padding:20px 0;">No feedback submitted yet.</p>';
      } else {
        fbList.innerHTML = '';
        feedback.slice().reverse().slice(0, 8).forEach((fb, i) => {
          const div = document.createElement('div');
          div.className = 'feedback-admin-item';
          div.innerHTML = `
            <span class="status-badge ${fb.type === 'Complaint' ? 'danger' : fb.type === 'Praise' ? 'completed' : 'processing'}">${fb.type}</span>
            <span class="msg">${fb.message}</span>
            <button class="del-feedback-btn" data-id="${fb.id || ''}" data-index="${feedback.length - 1 - i}" title="Delete">&times;</button>
          `;
          fbList.appendChild(div);
        });

        fbList.addEventListener('click', async e => {
          const btn = e.target.closest('.del-feedback-btn');
          if (!btn) return;
          const fbId = btn.dataset.id;
          const idx = parseInt(btn.dataset.index);
          if (window.CoffeeAPI && fbId) {
            await window.CoffeeAPI.deleteFeedback(fbId);
          } else {
            const fbArr = JSON.parse(localStorage.getItem('feedback') || '[]');
            fbArr.splice(idx, 1);
            localStorage.setItem('feedback', JSON.stringify(fbArr));
          }
          loadDashboardData();
        });
      }
    }
  }

  loadDashboardData();

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

  // --- Add New Product Item Modal Controller ---
  const addItemModal = document.getElementById('addItemModal');
  const btnOpenModal = document.getElementById('btnOpenAddItemModal');
  const btnCloseModal = document.getElementById('closeAddItemModal');
  const btnCancelModal = document.getElementById('cancelAddItemModal');
  const addNewItemForm = document.getElementById('addNewItemForm');
  const newProdPhotoFile = document.getElementById('newProdPhotoFile');
  const newProdPhotoUrl = document.getElementById('newProdPhotoUrl');
  const newProdPhotoPreview = document.getElementById('newProdPhotoPreview');
  const newProdPhotoImg = document.getElementById('newProdPhotoImg');
  const newProdPhotoName = document.getElementById('newProdPhotoName');
  const removePhotoBtn = document.getElementById('removePhotoBtn');
  const toast = document.getElementById('toast');

  let currentUploadedPhoto = '';

  function openAddItemModal() {
    if (!addItemModal) return;
    addItemModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    const nameInput = document.getElementById('newProdName');
    if (nameInput) nameInput.focus();
  }

  function closeAddItemModal() {
    if (!addItemModal) return;
    addItemModal.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (btnOpenModal) btnOpenModal.addEventListener('click', openAddItemModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeAddItemModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeAddItemModal);

  if (addItemModal) {
    addItemModal.addEventListener('click', (e) => {
      if (e.target === addItemModal) closeAddItemModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && addItemModal && addItemModal.classList.contains('show')) {
      closeAddItemModal();
    }
  });

  // Client-side image compression for device photos (camera & gallery)
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

  if (newProdPhotoFile) {
    newProdPhotoFile.addEventListener('change', function (e) {
      const file = e.target.files[0];
      if (!file) return;
      compressImage(file, 600, 0.75, function (dataUrl) {
        currentUploadedPhoto = dataUrl;
        if (newProdPhotoImg) newProdPhotoImg.src = dataUrl;
        if (newProdPhotoName) newProdPhotoName.textContent = file.name;
        if (newProdPhotoPreview) newProdPhotoPreview.style.display = 'flex';
        if (newProdPhotoUrl) newProdPhotoUrl.value = '';
      });
    });
  }

  if (newProdPhotoUrl) {
    newProdPhotoUrl.addEventListener('input', function () {
      const url = this.value.trim();
      if (url) {
        currentUploadedPhoto = url;
        if (newProdPhotoImg) newProdPhotoImg.src = url;
        if (newProdPhotoName) newProdPhotoName.textContent = 'Web Image Link';
        if (newProdPhotoPreview) newProdPhotoPreview.style.display = 'flex';
      } else if (!newProdPhotoFile || !newProdPhotoFile.files.length) {
        currentUploadedPhoto = '';
        if (newProdPhotoPreview) newProdPhotoPreview.style.display = 'none';
      }
    });
  }

  if (removePhotoBtn) {
    removePhotoBtn.addEventListener('click', function () {
      currentUploadedPhoto = '';
      if (newProdPhotoFile) newProdPhotoFile.value = '';
      if (newProdPhotoUrl) newProdPhotoUrl.value = '';
      if (newProdPhotoPreview) newProdPhotoPreview.style.display = 'none';
    });
  }

  function showToast(message, linkUrl, linkText) {
    if (!toast) return;
    let html = `<span>✅</span> ${message}`;
    if (linkUrl && linkText) {
      html += `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText} ↗</a>`;
    }
    toast.innerHTML = html;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

  if (addNewItemForm) {
    addNewItemForm.addEventListener('submit', async function (e) {
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

      if (window.CoffeeAPI) {
        await window.CoffeeAPI.saveMenuItem(newItem);
      } else {
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
      }

      // Close modal & reset form
      closeAddItemModal();
      this.reset();
      currentUploadedPhoto = '';
      if (newProdPhotoPreview) newProdPhotoPreview.style.display = 'none';

      // Show toast notification with live link
      showToast(`Product "${name}" successfully published to database!`, `Menu.html`, 'View in Menu');
    });
  }
});

