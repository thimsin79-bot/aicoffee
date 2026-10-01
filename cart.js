/**
 * Ai Coffee Shop - Cart Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');

  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    if (window.updateCartBadge) {
      window.updateCartBadge();
    }
    renderCart();
  }

  function renderCart() {
    const layout = document.getElementById('cartLayout');
    const emptyBox = document.getElementById('emptyBox');
    if (!layout || !emptyBox) return;

    if (!cart || cart.length === 0) {
      layout.style.display = 'none';
      emptyBox.style.display = 'block';
      return;
    }

    layout.style.display = 'grid';
    emptyBox.style.display = 'none';

    const itemsBox = document.getElementById('cartItems');
    if (!itemsBox) return;
    itemsBox.innerHTML = '';

    cart.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'cart-item-card';
      const opts = [item.size, ...(item.extras || [])].filter(Boolean).join(', ');

      const thumbHtml = item.photo
        ? `<img src="${item.photo}" alt="${item.name}">`
        : (item.icon || '&#9749;');

      div.innerHTML = `
        <div class="cart-thumb">${thumbHtml}</div>
        <div class="cart-info">
          <h3>${item.name}</h3>
          <div class="cart-options">${opts || 'Regular / Default'} &bull; $${Number(item.unitPrice).toFixed(2)} ea</div>
        </div>
        <div class="cart-actions-row">
          <div class="cart-qty-ctrl">
            <button type="button" data-action="minus" data-index="${index}" aria-label="Decrease">&minus;</button>
            <span>${item.qty}</span>
            <button type="button" data-action="plus" data-index="${index}" aria-label="Increase">+</button>
          </div>
          <div class="cart-line-price">$${Number(item.lineTotal).toFixed(2)}</div>
          <button class="cart-remove-btn" type="button" data-action="remove" data-index="${index}" title="Remove item">&times;</button>
        </div>
      `;
      itemsBox.appendChild(div);
    });

    const subtotal = cart.reduce((sum, item) => sum + (Number(item.lineTotal) || 0), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
    if (taxEl) taxEl.textContent = '$' + tax.toFixed(2);
    if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
  }

  const cartItemsContainer = document.getElementById('cartItems');
  if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', e => {
      const target = e.target.closest('[data-action]');
      if (!target) return;
      const index = parseInt(target.dataset.index);
      const action = target.dataset.action;

      if (action === 'plus') {
        cart[index].qty++;
        cart[index].lineTotal = cart[index].unitPrice * cart[index].qty;
      } else if (action === 'minus') {
        cart[index].qty--;
        if (cart[index].qty <= 0) {
          cart.splice(index, 1);
        } else {
          cart[index].lineTotal = cart[index].unitPrice * cart[index].qty;
        }
      } else if (action === 'remove') {
        cart.splice(index, 1);
      }
      saveCart();
    });
  }

  renderCart();
});

