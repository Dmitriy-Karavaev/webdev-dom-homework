
import { addComment, fetchComments } from './api.js';
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
  const nameInput = document.querySelector('.add-form-name');
  const commentInput = document.querySelector('.add-form-text');
  const submitBtn = document.querySelector('.add-form-button');

  if (!nameInput || !commentInput || !submitBtn) {
    console.warn('⚠️ Элементы формы не найдены');
    return;
  }

  // Обработчик отправки формы
  submitBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    showLoading();

    try {
      const name = nameInput.value.trim();
      const text = commentInput.value.trim();

      if (!name || !text) {
        alert('Заполните все поля');
        submitBtn.disabled = false;
        hideLoading();
        return;
      }

      await addComment({ name, text });
      await updateComments();
      
      nameInput.value = '';
      commentInput.value = '';
    } catch (error) {
      console.error('Ошибка при добавлении комментария:', error);
      alert('Не удалось добавить комментарий. Попробуйте позже.');
    } finally {
      submitBtn.disabled = false;
      hideLoading();
    }
  });
}