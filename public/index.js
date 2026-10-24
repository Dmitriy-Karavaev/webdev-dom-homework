import { loadComments } from './api.js';
import { renderComments } from './render.js';
import { initForm } from './form.js';

async function initApp() {
  const commentsList = document.querySelector('.comments');
  const loadingBlock = document.querySelector('.loading');

  // 1. Показываем лоадер перед запросом
  if (loadingBlock) {
    loadingBlock.style.display = 'block';
  }

  try {
    const comments = await loadComments();
    
    if (commentsList) {
      renderComments('.comments', comments);
    }
    
    initForm();

  } catch (error) {
    console.error('Ошибка при загрузке комментариев:', error);
    
    if (commentsList) {
      commentsList.innerHTML = `
        <div class="error-message">
          <h3>Не удалось загрузить комментарии</h3>
          <p>\${error.message}</p>
          <button onclick="location.reload()">Попробовать снова</button>
        </div>
      `;
    }
  } finally {
    if (loadingBlock) {
      loadingBlock.style.display = 'none';
    }
  }
}

document.addEventListener('DOMContentLoaded', initApp);