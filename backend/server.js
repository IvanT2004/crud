/*
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 5000;

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

const itemsRouter = require('./routes/items');
const authRouter = require('./routes/auth');

app.use('/items', itemsRouter);
app.use('/auth', authRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

*/

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
