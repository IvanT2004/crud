const mongoose = require('mongoose');

const InformeSchema = new mongoose.Schema({
  serial: { type: String, required: true },
  date: { type: String, required: true },
  damageDescription: { type: String, required: true },
  proposedSolution: { type: String, required: true },
  observacion: { type: String, required: true },
  images: [{ type: String }] // Almacenar los paths de las imágenes
});

module.exports = mongoose.model('Informe', InformeSchema);
