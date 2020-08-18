import './goal_backend_handler.js';
import './notes_backend_handler.js';
import './task_backend_handler.js';

// We need to wait to ensure react has actually loaded the component when we grab the header element.
setTimeout(() => {
    let headerTitle = document.querySelector('.header-content > h1');
    if (headerTitle === undefined)
    {
        throw 'Could not change header after multiple tries.' +
            'Ensure headerTitle query is correct and element is loaded quickly.';
    }

    headerTitle.innerText += ' (MOCK)';
}, 10);