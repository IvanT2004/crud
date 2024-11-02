const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Importa path para manejar las rutas
const app = express();
const port = 5000;

// const mongoUri = process.env.MONGO_URI || "mongodb://nuevoAdmin:contraseñaSegura@mongo:27017/crud?authSource=admin";
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/crud';
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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas de tu API
const itemsRouter = require('./routes/items');
const authRouter = require('./routes/auth');
const informesRouter = require('./routes/Informes'); // Importar las rutas de informes

app.use('/informes', informesRouter); // Conectar las rutas
app.use('/items', itemsRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

