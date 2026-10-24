
import { addComment } from './api.js';
import { renderComments } from './render.js';

// Функция для показа индикатора загрузки
function showLoading() {
  document.body.style.cursor = 'wait';
  document.querySelector('.loading').style.display = 'block';
}

function hideLoading() {
  document.body.style.cursor = 'default';
  document.querySelector('.loading').style.display = 'none';
}

async function updateComments() {
  try {
    const comments = await fetchComments();
    renderComments('.comments', comments);
  } catch (error) {
    console.error('Ошибка при получении комментариев:', error);
  }
}

export function initForm() {
  const form = document.querySelector('.comment-form');
  
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = form.querySelector('[name="name"]').value.trim();
    const text = form.querySelector('[name="text"]').value.trim();

    if (!name || !text) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    try {
      const commentData = {
        name, text 
    };

      const response = await addComment(commentData);
      form.reset();

    } 
    
    catch (error) {
      console.error('Ошибка при отправке комментария:', error);
      alert('Не удалось отправить комментарий. Попробуйте позже.');
    }
  });
}