document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'https://wedev-api.sky.pro/api/v1/Dmitriy-Karavaev/comments';
  const form = document.getElementById('commentForm');
  const nameInput = document.querySelector('.add-form-name');
  const textInput = document.querySelector('.add-form-text');
  const commentsList = document.querySelector('.comments');
  
  if (!form || !nameInput || !textInput || !commentsList) {
    console.error('Элементы не найдены');
    return;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderComment(comment) {
  const li = document.createElement('li');
  li.className = 'comment';

  const commentName = (comment.name && comment.name.trim() !== '')
    ? comment.name
    : (comment.author && comment.author.name && comment.author.name.trim() !== '')
      ? comment.author.name
      : 'Аноним';

  const commentText = (comment.text && comment.text.trim() !== '')
    ? comment.text
    : (comment.body && comment.body.trim() !== '')
      ? comment.body
      : '';

  const dateStr = new Date(comment.date || Date.now()).toLocaleString();

  li.innerHTML = `
    <div class="comment-header">
      <span>${escapeHtml(commentName)}</span>
      <span>${dateStr}</span>
    </div>
    <div class="comment-body">
      <div class="comment-text">${escapeHtml(commentText)}</div>
    </div>
    <div class="comment-footer">
      <div class="likes">
        <span class="likes-counter">0</span>
        <button type="button" class="like-button" aria-label="Лайк"></button>
      </div>
    </div>
  `;
  li.dataset.commentId = comment.id;
  commentsList.appendChild(li);
}

  async function loadComments() {
    commentsList.innerHTML = '<li style="color:#aaa; text-align:center; padding:20px;">Загрузка...</li>';
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        if (response.status === 500) {
          alert('Сервер не отвечает, попробуй позже');
        } else if (response.status === 400) {
          alert('Некорректный запрос к API');
        }
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      let comments = '';

      if (Array.isArray(data)) comments = data;
      else if (data && Array.isArray(data.data)) comments = data.data;
      else if (data && Array.isArray(data.comments)) comments = data.comments;

      commentsList.innerHTML = '';
      comments.forEach(renderComment);
    } catch (err) {
      if (err instanceof TypeError) {
        alert('Кажется, у вас отсутствует интернет, попробуйте позже');
      } else {
        console.error(err);
        commentsList.innerHTML = '<li style="color:red; text-align:center; padding:20px;">Ошибка загрузки</li>';
      }
    }
  }

  const MAX_RETRIES = 3;

  async function postCommentWithRetry(name, text, retryCount = 0) {
    try {
        const payload = { name: name, text: text };
        
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            if (response.status === 500) {
                if (retryCount < MAX_RETRIES) {
                    return postCommentWithRetry(name, text, retryCount + 1);
                }
                throw new Error('Сервер не отвечает, попробуй позже');
            }

            if (response.status === 400) {
                let serverMsg = 'Имя и комментарий должны быть не короче 3 символов';
                try {
                    const errData = await response.json();
                    if (errData.message) serverMsg = errData.message;
                    if (errData.error) serverMsg = errData.error;
                } catch (e) {
                }
                throw new Error(serverMsg);
            }

            throw new Error(`Ошибка сервера: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        if (error instanceof TypeError) {
            throw new Error('Кажется, у вас сломался интернет, попробуйте позже');
        }
        if (error.message.includes('500') && retryCount < MAX_RETRIES) {
            return postCommentWithRetry(name, text, retryCount + 1);
        }
        throw error;
    }
}

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    let name = (nameInput.value || '').trim();
    const text = (textInput.value || '').trim();

    if (!name || name.length < 3) {
      alert('Имя и комментарий должны быть не короче 3 символов');
      return;
    }
    if (!text || text.length < 3) {
      alert('Имя и комментарий должны быть не короче 3 символов');
      return;
    }

    const btn = form.querySelector('button[type="submit"]') || form.querySelector('.add-form-button');
    const originalText = btn ? btn.textContent : 'Отправить';
    
    if(btn) btn.disabled = true;
    form.style.display = 'none';
    
    const statusMsg = document.createElement('div');
    statusMsg.id = 'status-msg';
    statusMsg.style.cssText = 'color:#bcec30; font-size:24px; padding:20px; text-align:center;';
    form.parentNode.insertBefore(statusMsg, form);
    statusMsg.textContent = 'Отправка...';

    try {
      const newComment = await postCommentWithRetry(name, text, 0);
      
      if (!newComment.date) newComment.date = new Date();
      
      renderComment(newComment);
      
      nameInput.value = '';
      textInput.value = '';
      
      statusMsg.textContent = 'Комментарий добавлен!';
      statusMsg.style.color = '#4caf50';
      
    } catch (error) {
      console.error('Ошибка отправки:', error);
      statusMsg.textContent = `Ошибка: ${error.message}`;
      statusMsg.style.color = '#f44336'; 
      
    } finally {
      setTimeout(() => {
        statusMsg.remove();
        form.style.display = 'flex'; 
        if(btn) {
          btn.disabled = false;
          btn.textContent = originalText;
        }
      }, 3000);
    }
  });

  commentsList.addEventListener('click', (e) => {
    const likeBtn = e.target.closest('.like-button');
    if (!likeBtn) return;
    
    const counter = likeBtn.parentElement.querySelector('.likes-counter');
    if (!counter) return;

    const isLiked = likeBtn.classList.contains('-active-like');
    const currentCount = parseInt(counter.textContent, 10) || 0;

    if (isLiked) {
      likeBtn.classList.remove('-active-like');
      likeBtn.setAttribute('aria-pressed', 'false');
      counter.textContent = Math.max(0, currentCount - 1);
    } else {
      likeBtn.classList.add('-active-like');
      likeBtn.setAttribute('aria-pressed', 'true');
      counter.textContent = currentCount + 1;
    }
  });

  loadComments();
});