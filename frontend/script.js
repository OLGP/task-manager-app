document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const filterAllBtn = document.getElementById('filter-all');
    const filterPendingBtn = document.getElementById('filter-pending');
    const filterCompletedBtn = document.getElementById('filter-completed');
    const messageArea = document.getElementById('message-area');
    const searchInput = document.getElementById('search-input');

    let currentFilter = 'all'; // Variable para almacenar el filtro actual: 'all', 'pending', 'completed'

    // URL base de tu backend (donde está corriendo Node.js)
    const API_BASE_URL = 'http://localhost:3000/api/tasks';
    
    // Función para mostrar mensajes de éxito o error
function showMessage(message, type) {
    messageArea.textContent = message;
    messageArea.className = `message-area show ${type}`; // Añade clases para tipo y visibilidad
    setTimeout(() => {
        messageArea.classList.remove('show'); // Oculta el mensaje después de un tiempo
    }, 3000); // 3 segundos
}
    // Nueva función para actualizar una tarea
async function updateTask(taskId, newText) {
    try {
        const response = await fetch(`${API_BASE_URL.replace('/api/tasks', '/api/tasks')}/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: newText }),
        });

        if (response.ok) {
            await fetchAndDisplayTasks(searchInput.value.trim()); // Recarga la lista para mostrar el cambio
        } else {
            console.error('Error al actualizar la tarea:', response.statusText);
        }
    } catch (error) {
        console.error('Error de red al actualizar tarea:', error);
    }
}

    // Función para obtener y mostrar las tareas
    async function fetchAndDisplayTasks(searchTerm = '') { // Añade searchTerm con valor por defecto
        taskList.innerHTML = ''; // Limpia la lista antes de cargar
        try {
            let apiUrl = API_BASE_URL;
const queryParams = []; // Array para construir los parámetros de la URL

if (currentFilter === 'pending') {
    queryParams.push('completed=false');
} else if (currentFilter === 'completed') {
    queryParams.push('completed=true');
}

if (searchTerm) { // Si hay un término de búsqueda
    queryParams.push(`search=${encodeURIComponent(searchTerm)}`); // Añade el término de búsqueda codificado
}

if (queryParams.length > 0) {
    apiUrl += '?' + queryParams.join('&'); // Une los parámetros con '&'
}
const response = await fetch(apiUrl);
            if (!response.ok) { // Verifica si la respuesta HTTP fue exitosa
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const tasks = await response.json();

            tasks.forEach(task => {
                const listItem = document.createElement('li');
                // Agrega una clase 'completed' si la tarea está marcada como completada (útil para estilos futuros)
                if (task.completed) {
                    listItem.classList.add('completed');
                }
                // Reemplazar la línea que crea listItem.innerHTML = `...`;
// por la siguiente, asegurándote de copiar todo el bloque completo:
listItem.innerHTML = `
    <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task._id}">
    <span class="${task.completed ? 'completed-text' : ''}">${task.text}</span>
    <div class="task-actions">
        <button class="edit-btn" data-id="${task._id}">Editar</button>
        <button class="delete-btn" data-id="${task._id}">Eliminar</button>
    </div>
`;
                taskList.appendChild(listItem);

                // Lógica para el botón de eliminar (ya conectada al backend)
                listItem.querySelector('.delete-btn').addEventListener('click', async () => {
                    const taskId = listItem.querySelector('.delete-btn').dataset.id;
                    try {
                        const response = await fetch(`${API_BASE_URL}/${taskId}`, {
                            method: 'DELETE',
                        });

                        if (response.ok) {
                            await fetchAndDisplayTasks(searchInput.value.trim()); // Recarga la lista para reflejar el cambio
                        } else {
                            console.error('Error al eliminar la tarea:', response.statusText);
                        }
                    } catch (error) {
                        console.error('Error de red al eliminar tarea:', error);
                    }
                });

                   // Lógica para el checkbox de completar tarea
listItem.querySelector('.task-checkbox').addEventListener('change', async (e) => {
    const taskId = e.target.dataset.id;
    const isCompleted = e.target.checked; // true si está marcado, false si no

    try {
        const response = await fetch(`${API_BASE_URL}/${taskId}`, {
            method: 'PUT', // Usamos PUT para actualizar
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: isCompleted }), // Solo enviamos el estado 'completed'
        });

        if (response.ok) {
            // Si la actualización fue exitosa, recarga la lista para que se apliquen los estilos
            await fetchAndDisplayTasks(searchInput.value.trim());
        } else {
            console.error('Error al actualizar el estado de la tarea:', response.statusText);
            e.target.checked = !isCompleted; // Si falla, revierte el estado visual del checkbox
        }
    } catch (error) {
        console.error('Error de red al actualizar el estado de la tarea:', error);
        e.target.checked = !isCompleted; // Si falla, revierte el estado visual del checkbox
    }
});

                
                // Lógica para el botón de editar
listItem.querySelector('.edit-btn').addEventListener('click', () => {
    const currentSpan = listItem.querySelector('span');
    const taskId = listItem.querySelector('.edit-btn').dataset.id;
    const currentText = currentSpan.textContent;

    // Crea un campo de entrada para la edición
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = currentText;
    inputField.className = 'edit-input'; // Agrega una clase para posibles estilos

 
    // Reemplaza el texto original con el campo de entrada
    listItem.replaceChild(inputField, currentSpan);

    inputField.focus(); // Pone el foco en el campo de edición

    // Escucha el evento 'blur' (cuando el input pierde el foco) o 'keypress' (al presionar Enter)
    inputField.addEventListener('blur', async () => {
        const newText = inputField.value.trim();
        if (newText === '' || newText === currentText) {
            // Si el texto está vacío o no cambió, restaura el span original
            listItem.replaceChild(currentSpan, inputField);
            return;
        }
        await updateTask(taskId, newText);
    });

    inputField.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            inputField.blur(); // Dispara el evento blur para guardar
        }
    });
});
            });
        } catch (error) {
            console.error('Error al cargar las tareas:', error);
        }
    }

    // Manejar el envío del formulario para añadir una tarea
    taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        showMessage('El texto de la tarea no puede estar vacío.', 'error');
        return;
    }

    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: taskText }),
        });

        if (response.ok) {
            taskInput.value = '';
            await fetchAndDisplayTasks(searchInput.value.trim());
            showMessage('Tarea añadida correctamente.', 'success');
        } else {
            const errorData = await response.json(); // Intenta leer el mensaje de error del backend
            showMessage(`Error al añadir la tarea: ${errorData.message || response.statusText}`, 'error');
        }
    } catch (error) {
        showMessage('Error de red al añadir tarea.', 'error');
        console.error('Error de red al añadir tarea:', error);
    }
});

    // Cargar las tareas cuando la página se carga por primera vez
    fetchAndDisplayTasks(searchInput.value.trim());
// Event listeners para los botones de filtro
filterAllBtn.addEventListener('click', () => {
    currentFilter = 'all';
    filterAllBtn.classList.add('active');
    filterPendingBtn.classList.remove('active');
    filterCompletedBtn.classList.remove('active');
    fetchAndDisplayTasks(searchInput.value.trim());
});

filterPendingBtn.addEventListener('click', () => {
    currentFilter = 'pending';
    filterAllBtn.classList.remove('active');
    filterPendingBtn.classList.add('active');
    filterCompletedBtn.classList.remove('active');
    fetchAndDisplayTasks(searchInput.value.trim());
});

filterCompletedBtn.addEventListener('click', () => {
    currentFilter = 'completed';
    filterAllBtn.classList.remove('active');
    filterPendingBtn.classList.remove('active');
    filterCompletedBtn.classList.add('active');
    fetchAndDisplayTasks(searchInput.value.trim());
});
// Event listener para el campo de búsqueda (con un pequeño retraso para evitar llamadas excesivas)
let searchTimeout;
searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout); // Limpia el temporizador anterior
    searchTimeout = setTimeout(() => {
        const searchTerm = searchInput.value.trim();
        fetchAndDisplayTasks(searchTerm); // Llama a la función con el término de búsqueda
    }, 300); // Espera 300ms después de que el usuario deja de escribir
});
});