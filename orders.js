/**
 * Ai Coffee Shop - Order History Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const statuses = ['Completed', 'Processing', 'Delivered'];

  async function renderOrders() {
    const orders = window.CoffeeAPI ? await window.CoffeeAPI.getOrders() : JSON.parse(localStorage.getItem('orders') || '[]');
    const wrap = document.getElementById('ordersWrap');
    const emptyBox = document.getElementById('emptyBox');
    if (!wrap || !emptyBox) return;

    if (!orders || orders.length === 0) {
      wrap.style.display = 'none';
      emptyBox.style.display = 'block';
      return;
    }

    wrap.style.display = 'block';
    emptyBox.style.display = 'none';
    wrap.innerHTML = '';

    orders.slice().forEach(order => {
      const card = document.createElement('div');
      card.className = 'order-card';
      const items = (order.items || []).map(item => `${item.name} &times; ${item.qty}`).join(', ');
      const status = order.status ? (order.status.charAt(0).toUpperCase() + order.status.slice(1)) : statuses[order.number.length % 3];

      card.innerHTML = `
        <div class="order-head">
          <span class="order-number">Order #${order.number}</span>
          <span class="order-date">${order.date || new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </div>
        <div class="order-items-snippet">${items || 'Handcrafted Coffee'}</div>
        <div class="order-foot">
          <span class="status-badge ${status.toLowerCase()}">${status}</span>
          <span class="order-total-price">$${Number(order.total).toFixed(2)}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        localStorage.setItem('lastOrder', JSON.stringify(order));
        location.href = 'Order.html';
      });

      wrap.appendChild(card);
    });
  }

  renderOrders();

  window.addEventListener('coffee_orders_updated', () => {
    renderOrders();
  });
});

