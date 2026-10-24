import { addComment } from './api.js';
import { renderComments } from './render.js';
import { loadComments } from './api.js';

function showLoading() {
  document.body.style.cursor = 'wait';
  const loadingBlock = document.querySelector('.loading');
  if (loadingBlock) loadingBlock.style.display = 'block';
}

function hideLoading() {
  document.body.style.cursor = 'default';
  const loadingBlock = document.querySelector('.loading');
  if (loadingBlock) loadingBlock.style.display = 'none';
}

async function updateComments() {
  console.log('Обновляем список комментариев...');
  try {
    const comments = await loadComments();
    renderComments('.comments', comments);
  } catch (error) {
    console.error('Ошибка при получении комментариев:', error);
    alert('Не удалось обновить список комментариев');
  }
}

export function initForm() {
  const form = document.querySelector('.add-form');
  
  if (!form) {
    console.error('❌ Форма с классом .add-form не найдена в DOM');
    return;
  }
  
  console.log('✅ Форма найдена, добавляем обработчик submit');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    console.log('🖱️ Сработал обработчик submit, форма отправлена');
    
    try {
      const name = form.querySelector('[name="name"]').value.trim();
      const text = form.querySelector('[name="text"]').value.trim();

      // Валидация полей
      if (!name || !text) {
        alert('Пожалуйста, заполните все поля');
        return;
      }

      // Проверка длины текста
      if (text.length < 10) {
        alert('Текст комментария должен быть не менее 10 символов');
        return;
      }

      showLoading();

      const commentData = { name, text };
      console.log('📦 Отправляем данные:', commentData);

      // Отправляем комментарий
      const response = await addComment(commentData);
      
      // Проверяем успешный ответ
      if (!response || !response.id) {
        throw new Error('Неверный ответ от сервера');
      }

      // Обновляем список комментариев
      await updateComments();
      
      // Очищаем форму
      form.reset();
      console.log('🧹 Форма очищена');

    } catch (error) {
      console.error('💥 Ошибка при отправке:', error);
      alert('Не удалось отправить комментарий. Попробуйте позже.');
    } finally {
      hideLoading();
    }
  });
}