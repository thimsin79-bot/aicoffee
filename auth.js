/**
 * Ai Coffee Shop - Authentication Logic (Sign In & Sign Up)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Sign In Form
  const signinForm = document.getElementById('signinForm');
  if (signinForm) {
    signinForm.addEventListener('submit', async e => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const errEl = document.getElementById('errorMsg');

      let user = null;
      if (window.CoffeeAPI) {
        user = await window.CoffeeAPI.signIn(email, password);
      }

      if (user) {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(user));
        alert('Welcome back, ' + (user.name || 'Coffee Lover') + '!');
        window.location.href = 'Home.html';
        return;
      }

      const stored = JSON.parse(localStorage.getItem('user') || 'null');
      if (stored && stored.email.toLowerCase() === email.toLowerCase() && stored.password === password) {
        localStorage.setItem('loggedIn', 'true');
        alert('Welcome back, ' + stored.name + '!');
        window.location.href = 'Home.html';
      } else {
        const demoUser = { name: email.split('@')[0], email: email, password: password, phone: '+1 555-0123' };
        localStorage.setItem('user', JSON.stringify(demoUser));
        localStorage.setItem('loggedIn', 'true');
        alert('Signed in as ' + demoUser.name + '!');
        window.location.href = 'Home.html';
      }
    });
  }

  // Sign Up Form
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async e => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      const errEl = document.getElementById('errorMsg');

      const userData = { name, email, password, phone: '' };

      if (window.CoffeeAPI) {
        await window.CoffeeAPI.signUp(userData);
      }

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('loggedIn', 'true');
      alert('Account created! Welcome to Ai Coffee Shop, ' + name + '!');
      window.location.href = 'Home.html';
    });
  }
});

