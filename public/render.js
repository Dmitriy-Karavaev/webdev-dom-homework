export function renderComments(selector, data) {
  const commentsList = document.querySelector(selector);
  if (!commentsList) return;

  // Очищаем контейнер
  commentsList.innerHTML = '';

  // Создаем фрагмент документа
  const fragment = document.createDocumentFragment();

  data.forEach((comment) => {
    const li = document.createElement('li');
    li.className = 'comment';
    li.dataset.id = comment.id;

    // Создаем элементы через DOM API
    const header = document.createElement('div');
    header.className = 'comment-header';
    header.innerHTML = `
      <div>${comment.name}</div>
      <div>${comment.date}</div>
    `;

    const body = document.createElement('div');
    body.className = 'comment-body';
    body.innerHTML = `<div class="comment-text">${comment.text}</div>`;

    const footer = document.createElement('div');
    footer.className = 'comment-footer';
    
    li.appendChild(header);
    li.appendChild(body);
    li.appendChild(footer);

    fragment.appendChild(li);
  });

  commentsList.appendChild(fragment);
}