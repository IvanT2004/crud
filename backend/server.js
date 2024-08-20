const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Importa path para manejar las rutas
const app = express();
const port = 5000;

const mongoUri = process.env.MONGO_URI || "mongodb://nuevoAdmin:contraseñaSegura@mongo:27017/crud?authSource=admin";
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => {
  console.error('Failed to connect to MongoDB', err);
  process.exit(1); // Salir del proceso si no se puede conectar a MongoDB
});

app.use(cors());
app.use(express.json());

// Rutas de tu API
const itemsRouter = require('./routes/items');
const authRouter = require('./routes/auth');

app.use('/items', itemsRouter);
app.use('/auth', authRouter);

// Servir los archivos estáticos del frontend de React
// app.use(express.static(path.join(__dirname, 'build')));

// Redirigir todas las demás rutas a index.html para que React Router maneje el enrutamiento
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


/*
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5000;

const mongoUri = process.env.MONGO_URI || "mongodb://mongo:27017/crud";

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB', err));

 //Configurar CORS para permitir solo solicitudes desde el frontend
 const corsOptions = {
 origin: 'http://185.173.110.165:3000', // Reemplaza con la URL de tu frontend
 optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

const itemsRouter = require('./routes/items');
const authRouter = require('./routes/auth');

app.use('/items', itemsRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
*/