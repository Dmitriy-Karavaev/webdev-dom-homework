export function loadComments() {
  return fetch('https://webdev-hw-api.vercel.app/api/comments', {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка сети: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      if (!data || !Array.isArray(data.comments)) {
        throw new Error('Неверный формат данных от сервера');
      }
      return data.comments;
    });
}

export function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}

export function addComment(commentData) {
  return fetch('https://webdev-hw-api.vercel.app/api/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(commentData)
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Не удалось добавить комментарий');
      }
      return response.json();
    });
}