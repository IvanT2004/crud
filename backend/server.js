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
.catch((err) => console.error('Failed to connect to MongoDB', err));

app.use(cors());
app.use(express.json());

const itemsRouter = require('./routes/items');
app.use('/items', itemsRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
