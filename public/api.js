const PERSONAL_KEY = 'yourname-yourlastname'; 
const API_URL = `https://wedev-api.sky.pro/api/v1/${PERSONAL_KEY}/comments`;

// Кэширование запросов для предотвращения множественных обращений
let commentsCache = null;
let isFetching = false;

export async function fetchComments() {
    // Проверяем, есть ли данные в кэше
    if (commentsCache && !isFetching) {
        return commentsCache;
    }

    if (isFetching) {
        return new Promise((resolve) => {
            const waitForFetch = setInterval(() => {
                if (!isFetching) {
                    clearInterval(waitForFetch);
                    resolve(commentsCache);
                }
            }, 100);
        });
    }

    isFetching = true;
    
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error('Ошибка при получении комментариев');
        }
        
        const data = await response.json();
        
        commentsCache = data.comments.map(comment => ({
            id: comment.id,
            name: comment.author?.name || '',
            text: comment.text || '',
            date: comment.date || '',
            likes: comment.likes || 0,
            isLiked: comment.isLiked || false,
            parentId: null
        }));
        
        isFetching = false;
        return commentsCache;
    } catch (error) {
        console.error('Ошибка получения комментариев:', error);
        isFetching = false;
        return [];
    }
}

export async function addComment(newComment) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            // Убираем заголовок Content-Type
            body: JSON.stringify({
                text: newComment.text,
                name: newComment.name
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Ошибка от сервера:', errorData);
            throw new Error(errorData.error || 'Ошибка при добавлении комментария');
        }
        
        // Обновляем кэш после добавления
        commentsCache = null;
        return await response.json();
    } catch (error) {
        console.error('Ошибка добавления комментария:', error);
        return null;
    }
}