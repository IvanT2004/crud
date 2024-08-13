const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  codigo: { type: String, required: true },
  descripcion: { type: String, required: true },
  cantidad: { type: Number, required: true },
  valor: { type: Number, required: true },
  total: { type: Number, required: true },
});

const ItemSchema = new mongoose.Schema({
  numero: { type: Number, required: true },
  asunto: { type: String, required: true },
  cliente: { type: String, required: true },
  productos: [ProductoSchema],
  subTotal: { type: Number, required: true },
  iva: { type: Number, required: true },
  total: { type: Number, required: true },
  activo: { type: Boolean, default: true } // Nuevo campo para manejar la activación/desactivación
});

module.exports = mongoose.model('Item', ItemSchema);
