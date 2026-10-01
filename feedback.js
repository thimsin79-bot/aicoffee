/**
 * Ai Coffee Shop - Feedback Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const feedback = JSON.parse(localStorage.getItem('feedback') || '[]');
  let rating = 5;

  // Highlight initial 5 stars
  document.querySelectorAll('#rateBox span').forEach(s => s.classList.add('on'));

  document.querySelectorAll('#rateBox span').forEach(star => {
    star.addEventListener('click', () => {
      rating = parseInt(star.dataset.v);
      document.querySelectorAll('#rateBox span').forEach(s => {
        s.classList.toggle('on', parseInt(s.dataset.v) <= rating);
      });
    });
  });

  const feedbackForm = document.getElementById('feedbackForm');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', async e => {
      e.preventDefault();
      const fbData = {
        type: document.getElementById('fbType').value,
        name: document.getElementById('fbName').value.trim() || 'Anonymous Customer',
        rating,
        message: document.getElementById('fbMsg').value.trim(),
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
      };

      if (window.CoffeeAPI) {
        await window.CoffeeAPI.submitFeedback(fbData);
      } else {
        const feedback = JSON.parse(localStorage.getItem('feedback') || '[]');
        feedback.push(fbData);
        localStorage.setItem('feedback', JSON.stringify(feedback));
      }

      e.target.reset();
      rating = 5;
      document.querySelectorAll('#rateBox span').forEach(s => s.classList.add('on'));

      const msg = document.getElementById('successMsg');
      if (msg) {
        msg.style.display = 'flex';
        setTimeout(() => { msg.style.display = 'none'; }, 3500);
      }
      renderHistory();
    });
  }

  async function renderHistory() {
    const list = document.getElementById('historyList');
    if (!list) return;
    list.innerHTML = '';
    const feedback = window.CoffeeAPI ? await window.CoffeeAPI.getFeedback() : JSON.parse(localStorage.getItem('feedback') || '[]');
    if (!feedback || feedback.length === 0) {
      list.innerHTML = '<p style="color:var(--text-dim);">No customer feedback posted yet.</p>';
      return;
    }

    feedback.slice().reverse().forEach(fb => {
      const div = document.createElement('div');
      div.className = 'history-card';
      div.innerHTML = `
        <div class="fb-head">
          <span class="type-pill ${fb.type}">${fb.type}</span>
          <span style="color:var(--color-primary); font-size:1.1rem;">${'★'.repeat(fb.rating || 0)}</span>
        </div>
        <div class="fb-msg">${fb.message}</div>
        <div class="fb-meta">
          <span>By ${fb.name}</span>
          <span>${fb.date || new Date(fb.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </div>
      `;
      list.appendChild(div);
    });
  }

  renderHistory();
});

