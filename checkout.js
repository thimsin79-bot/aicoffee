/**
 * Ai Coffee Shop - Checkout Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');

  // Radio card active state styling
  document.querySelectorAll('.radio-card input').forEach(input => {
    input.addEventListener('change', () => {
      document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('selected'));
      input.closest('.radio-card').classList.add('selected');
    });
  });

  function renderOrder() {
    const subtotal = cart.reduce((sum, item) => sum + (Number(item.lineTotal) || 0), 0);
    const tax = subtotal * 0.08;
    const deliveryEl = document.getElementById('delivery');
    const delivery = deliveryEl ? (parseFloat(deliveryEl.value) || 2.00) : 2.00;
    const orderItems = document.getElementById('orderItems');

    if (orderItems) {
      orderItems.innerHTML = '';
      if (cart.length === 0) {
        orderItems.innerHTML = '<p style="color:var(--text-muted); padding: 15px 0;">Your cart is empty. Please add items from the menu first.</p>';
      } else {
        cart.forEach(item => {
          const div = document.createElement('div');
          div.className = 'order-item-row';
          div.innerHTML = `
            <span class="name">${item.icon || '☕'} ${item.name} &times; ${item.qty}</span>
            <span style="font-weight:600; color:var(--text-main);">$${Number(item.lineTotal).toFixed(2)}</span>
          `;
          orderItems.appendChild(div);
        });
      }
    }

    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const deliveryFeeEl = document.getElementById('deliveryFee');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
    if (taxEl) taxEl.textContent = '$' + tax.toFixed(2);
    if (deliveryFeeEl) deliveryFeeEl.textContent = '$' + delivery.toFixed(2);
    if (totalEl) totalEl.textContent = '$' + (subtotal + tax + delivery).toFixed(2);
  }

  const deliverySelect = document.getElementById('delivery');
  if (deliverySelect) {
    deliverySelect.addEventListener('change', renderOrder);
  }

  const checkoutForm = document.getElementById('checkoutForm');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', async e => {
      e.preventDefault();
      if (!cart || cart.length === 0) {
        alert('Your cart is empty. Please add items to your cart before checking out.');
        location.href = 'Menu.html';
        return;
      }

      const checkedPay = document.querySelector('input[name="pay"]:checked');
      const payment = checkedPay ? checkedPay.value : 'credit_card';
      const fullNameEl = document.getElementById('fullName');
      const name = fullNameEl ? fullNameEl.value.trim() : 'Customer';
      const addressEl = document.getElementById('address');
      const cityEl = document.getElementById('city');
      const address = (addressEl ? addressEl.value.trim() : '') + ', ' + (cityEl ? cityEl.value.trim() : '');
      const subtotal = cart.reduce((sum, item) => sum + item.lineTotal, 0);
      const tax = subtotal * 0.08;
      const deliveryEl = document.getElementById('delivery');
      const delivery = deliveryEl ? parseFloat(deliveryEl.value) : 2.00;
      const orderNumber = String(Math.floor(Math.random() * 900000) + 100000);

      const order = {
        number: orderNumber,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        name,
        address,
        payment,
        items: cart,
        subtotal,
        tax,
        delivery,
        total: subtotal + tax + delivery
      };

      if (window.CoffeeAPI) {
        await window.CoffeeAPI.createOrder(order);
      } else {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        localStorage.setItem('lastOrder', JSON.stringify(order));
        localStorage.removeItem('cart');
      }

      if (window.updateCartBadge) {
        window.updateCartBadge();
      }

      window.location.href = 'Order.html';
    });
  }

  renderOrder();
});

