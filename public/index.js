import { renderLoginPage, renderFeedPage } from './render.js';
import { loadComments } from './api.js';

async function init() {
  if (window.location.hash === '#/login') {
    renderLoginPage();
    return;
  }

  const token = localStorage.getItem('token');
  let user = null;

  if (token) {
    try {
      user = JSON.parse(localStorage.getItem('user') || 'null');
    } catch (e) {
      user = null;
    }
  }

  const comments = await loadComments();
  renderFeedPage(comments, Boolean(token && user), user);
}

init();

window.addEventListener('hashchange', init);