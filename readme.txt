task-manager-app/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── backend/
    ├── server.js          (Para la lógica del servidor Node.js/Express)
    ├── package.json       (Archivo de configuración de Node.js)
    └── .env               (Para variables de entorno como la URL de MongoDB)

# Gestor de Tareas Full-Stack (MERN Stack)

Este es un gestor de tareas web completo, desarrollado con el **MERN Stack** (MongoDB, Express.js, React/Frontend JavaScript, Node.js). Permite a los usuarios añadir, ver, marcar como completadas, editar y eliminar tareas de forma intuitiva, con funcionalidades de filtrado y búsqueda en tiempo real.

---

## **Características Principales**

* **Creación de Tareas:** Añade nuevas tareas fácilmente con un campo de texto.
* **Gestión de Estado:** Marca las tareas como completadas o pendientes usando casillas de verificación.
* **Edición en Línea:** Modifica el texto de cualquier tarea directamente desde la lista.
* **Eliminación de Tareas:** Borra tareas individualmente.
* **Filtrado:** Visualiza todas las tareas, solo las pendientes o solo las completadas.
* **Búsqueda en Tiempo Real:** Filtra tareas por texto de forma instantánea, insensible a mayúsculas y minúsculas.
* **Persistencia de Datos:** Todas las tareas se guardan en una base de datos MongoDB Atlas.

---

## **Tecnologías Utilizadas**

### **Backend (Node.js con Express.js)**

* **Node.js:** Entorno de ejecución de JavaScript del lado del servidor.
* **Express.js:** Framework web minimalista y flexible para Node.js, utilizado para construir la API RESTful.
* **Mongoose:** Librería para modelado de objetos de MongoDB en entornos Node.js, facilitando la interacción con la base de datos.
* **MongoDB Atlas:** Base de datos NoSQL basada en la nube para el almacenamiento de las tareas.
* **dotenv:** Para la gestión de variables de entorno (ej. URI de la base de datos).
* **CORS:** Middleware para habilitar solicitudes de recursos de origen cruzado.

### **Frontend (HTML, CSS, JavaScript)**

* **HTML5:** Estructura semántica de la aplicación web.
* **CSS3:** Estilos personalizados para una interfaz de usuario limpia y funcional.
* **JavaScript (ES6+):** Lógica interactiva del lado del cliente, incluyendo manejo del DOM, llamadas a la API y lógica de filtros/búsqueda.
* **Fetch API:** Para realizar peticiones HTTP asíncronas al backend.

---

## **Configuración y Ejecución Local**

Sigue estos pasos para levantar la aplicación en tu máquina local.

### **Prerrequisitos**

* [Node.js](https://nodejs.org/) (versión 14 o superior recomendada)
* [npm](https://www.npmjs.com/) (viene con Node.js)
* Una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (para la base de datos)
* [Git](https://git-scm.com/downloads) (opcional, para clonar el repositorio)

### **1. Clonar el Repositorio**

```bash
git clone [https://github.com/OLGP/task-manager-app.git](https://github.com/TU_USUARIO_GITHUB/task-manager-app.git)
cd task-manager-app    
