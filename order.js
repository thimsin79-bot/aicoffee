/**
 * Ai Coffee Shop - Order Confirmation Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const order = JSON.parse(localStorage.getItem('lastOrder') || 'null');
  const orderContent = document.getElementById('orderContent');
  if (!orderContent) return;

  if (!order) {
    orderContent.innerHTML = `
      <div class="receipt-card" style="text-align:center; padding: 50px 20px;">
        <div style="font-size:3.5rem; margin-bottom:12px;">🔍</div>
        <h2>No Order Found</h2>
        <p style="color:var(--text-muted); margin-bottom:20px;">You haven't placed an order in this session yet.</p>
        <a href="Menu.html" class="btn btn-primary">Browse Our Menu &rarr;</a>
      </div>
    `;
  } else {
    const numEl = document.getElementById('orderNumber');
    const payEl = document.getElementById('payMethod');
    const deliveryToEl = document.getElementById('deliveryTo');

    if (numEl) numEl.textContent = order.number;
    if (payEl) payEl.textContent = order.payment;
    if (deliveryToEl) deliveryToEl.textContent = (order.name || 'Customer') + ' — ' + (order.address || '');

    const items = document.getElementById('orderItems');
    if (items) {
      items.innerHTML = '';
      (order.items || []).forEach(item => {
        const div = document.createElement('div');
        div.className = 'receipt-item-row';
        div.innerHTML = `
          <span>${item.icon || '☕'} ${item.name} &times; ${item.qty}</span>
          <span style="font-weight:600; color:var(--text-main);">$${Number(item.lineTotal).toFixed(2)}</span>
        `;
        items.appendChild(div);
      });
    }

    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const deliveryFeeEl = document.getElementById('deliveryFee');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = '$' + Number(order.subtotal).toFixed(2);
    if (taxEl) taxEl.textContent = '$' + Number(order.tax).toFixed(2);
    if (deliveryFeeEl) deliveryFeeEl.textContent = '$' + Number(order.delivery).toFixed(2);
    if (totalEl) totalEl.textContent = '$' + Number(order.total).toFixed(2);
  }
});

