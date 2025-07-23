const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config(); // Carga las variables de entorno del archivo .env

const app = express();
const port = process.env.PORT || 3000; // Puerto para el servidor

// Middleware para parsear JSON en las peticiones
app.use(express.json());
app.use(cors()); // Esto permite todas las peticiones desde cualquier origen

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// Definir un esquema para las tareas
const TaskSchema = new mongoose.Schema({
    text: { type: String, required: [true, 'El texto de la tarea es obligatorio'], // <--- CAMBIO AQUÍ
        trim: true // <--- OPCIONAL: Elimina espacios en blanco al inicio/final
    },
    completed: { // <--- AÑADIREMOS ESTO PARA LA SIGUIENTE FUNCIONALIDAD
        type: Boolean,
        default: false
    }
}, 
{ timestamps: true }); // <--- OPCIONAL: Añade automáticamente campos createdAt y updatedAt


const Task = mongoose.model('Task', TaskSchema);

// Rutas de la API (Endpoints CRUD)

// GET /api/tasks - Obtener todas las tareas (con filtro opcional y búsqueda)
app.get('/api/tasks', async (req, res) => {
    try {
        const { completed, search } = req.query; // Obtiene los parámetros 'completed' y 'search'

        let query = {}; // Objeto vacío para la consulta por defecto (trae todo)

        if (completed !== undefined) {
            query.completed = completed === 'true';
        }

        if (search) { // Si hay un término de búsqueda
            // Agrega una búsqueda de texto insensible a mayúsculas/minúsculas
            query.text = { $regex: search, $options: 'i' };
        }

        const tasks = await Task.find(query).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/tasks - Crear una nueva tarea
app.post('/api/tasks', async (req, res) => {
    const task = new Task({
        text: req.body.text
    });
    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE /api/tasks/:id - Eliminar una tarea por ID
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const taskId = req.params.id; // Obtiene el ID de la URL
        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        res.json({ message: 'Tarea eliminada correctamente' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// PUT /api/tasks/:id - Actualizar una tarea por ID
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        const updateData = req.body; // Obtiene todos los datos enviados en el cuerpo

        // Construye un objeto de actualización que solo incluye los campos presentes
        const updateObject = {};
        if (updateData.text !== undefined) {
            updateObject.text = updateData.text;
        }
        if (updateData.completed !== undefined) {
            updateObject.completed = updateData.completed;
        }

        // Busca la tarea por ID y la actualiza con solo los campos proporcionados
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            updateObject, // Usa el objeto que solo tiene los campos a actualizar
            { new: true, runValidators: true } // `new: true` devuelve el documento actualizado
        );

        if (!updatedTask) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        res.json(updatedTask); // Devuelve la tarea actualizada
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor backend corriendo en http://localhost:${port}`);
});