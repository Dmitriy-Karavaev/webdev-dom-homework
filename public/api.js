const API_URL = 'https://wedev-api.sky.pro/api/v1/Dmitriy-Karavaev/comments';

export async function loadComments() {
  const res = await fetch('./comments.json');
  if (!res.ok) throw new Error('Ошибка сети: ' + res.status);
  return res.json();
}

export function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(resolve, interval);
  });
}

export async function addComment(commentData) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(commentData)
  });

  if (!response.ok) {
    let errorText;
    try {
      errorText = await response.text();
    } catch (e) {
      errorText = 'Сервер вернул ошибку без сообщения';
    }
    
    console.error('❌ Ошибка от сервера:', errorText);
    throw new Error(`Не удалось добавить комментарий: статус ${response.status}`);
  }

  return await response.json();
}