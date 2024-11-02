const mongoose = require('mongoose');

const InformeSchema = new mongoose.Schema({
  serial: { type: String, required: true },
  timestamp: { type: Date, required: true }, // Fecha y hora del informe
  imageTimestamp: { type: Date, required: true }, // Fecha y hora para el pie de página de las imágenes
  damageDescription: { type: String, required: true },
  proposedSolution: { type: String, required: true },
  observacion: { type: String, required: true },
  images: [{ type: String }] // Almacenar los paths de las imágenes
});

module.exports = mongoose.model('Informe', InformeSchema);
