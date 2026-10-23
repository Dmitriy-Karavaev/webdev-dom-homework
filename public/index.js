import { renderComments } from './render.js';
import { fetchComments } from './api.js';
import { initForm } from './form.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const comments = await fetchComments();
        renderComments('.comments', comments);
        
        initForm();
    } catch (error) {
        console.error('Ошибка при инициализации:', error);
    }
});