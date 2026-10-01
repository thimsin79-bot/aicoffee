/**
 * Ai Coffee Shop - Customer Profile Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const orders = JSON.parse(localStorage.getItem('orders') || '[]');

  function loadProfile() {
    const initial = (user && user.name) ? user.name.charAt(0).toUpperCase() : 'U';
    const avatarEl = document.getElementById('avatar');
    const nameEl = document.getElementById('displayName');
    const emailEl = document.getElementById('displayEmail');

    if (avatarEl) avatarEl.textContent = initial;
    if (nameEl) nameEl.textContent = (user && user.name) || 'Guest';
    if (emailEl) emailEl.textContent = (user && user.email) || 'Not signed in';

    const editName = document.getElementById('editName');
    const editEmail = document.getElementById('editEmail');
    const editPhone = document.getElementById('editPhone');

    if (editName) editName.value = (user && user.name) || '';
    if (editEmail) editEmail.value = (user && user.email) || '';
    if (editPhone) editPhone.value = (user && user.phone) || '';

    const ordersEl = document.getElementById('totalOrders');
    const spentEl = document.getElementById('totalSpent');

    if (ordersEl) ordersEl.textContent = orders.length;
    const spent = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    if (spentEl) spentEl.textContent = '$' + spent.toFixed(0);
  }

  loadProfile();

  const editForm = document.getElementById('editForm');
  if (editForm) {
    editForm.addEventListener('submit', e => {
      e.preventDefault();
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      currentUser.name = document.getElementById('editName').value.trim();
      currentUser.email = document.getElementById('editEmail').value.trim();
      currentUser.phone = document.getElementById('editPhone').value.trim();
      const newPass = document.getElementById('editPassword').value;
      if (newPass) currentUser.password = newPass;

      localStorage.setItem('user', JSON.stringify(currentUser));
      loadProfile();

      const msg = document.getElementById('savedMsg');
      if (msg) {
        msg.style.display = 'block';
        setTimeout(() => { msg.style.display = 'none'; }, 3000);
      }
    });
  }

  const signOutBtn = document.getElementById('signOutBtn');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
      localStorage.removeItem('loggedIn');
      alert('Signed out successfully.');
      window.location.href = 'Home.html';
    });
  }
});

