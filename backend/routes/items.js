const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// Obtener todos los items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find({ activo: true }); // Solo obtener los items activos
    res.json(items);
  } catch (err) {
    console.error('Error getting items:', err);
    res.status(500).json({ message: err.message });
  }
});

// Crear un item
// Crear un item
router.post('/', async (req, res) => {
  try {
    // Encuentra el último item para determinar el número siguiente
    const lastItem = await Item.findOne().sort({ numero: -1 });
    const newNumero = lastItem ? lastItem.numero + 1 : 1;

    const item = new Item({
      numero: newNumero, // Asigna el nuevo número
      asunto: req.body.asunto,
      cliente: req.body.cliente,
      productos: req.body.productos,
      subTotal: req.body.subTotal,
      iva: req.body.iva,
      total: req.body.total,
    });

    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error('Error creating item:', err);
    res.status(400).json({ message: err.message });
  }
});


// Obtener un item por ID
router.get('/:id', getItem, (req, res) => {
  res.json(res.item);
});

// Actualizar un item
router.put('/:id', getItem, async (req, res) => {
  if (req.body.numero != null) {
    res.item.numero = req.body.numero;
  }
  if (req.body.asunto != null) {
    res.item.asunto = req.body.asunto;
  }
  if (req.body.cliente != null) {
    res.item.cliente = req.body.cliente;
  }
  if (req.body.productos != null) {
    res.item.productos = req.body.productos;
  }
  if (req.body.subTotal != null) {
    res.item.subTotal = req.body.subTotal;
  }
  if (req.body.iva != null) {
    res.item.iva = req.body.iva;
  }
  if (req.body.total != null) {
    res.item.total = req.body.total;
  }

  try {
    const updatedItem = await res.item.save();
    res.json(updatedItem);
  } catch (err) {
    console.error('Error updating item:', err);
    res.status(400).json({ message: err.message });
  }
});

// Eliminar un item (sin usar el middleware getItem)
router.delete('/:id', async (req, res) => {
  const itemId = req.params.id;
  console.log(`Received request to deactivate item with id: ${itemId}`);
  try {
    const item = await Item.findById(itemId);
    if (item == null) {
      console.log(`Item with id ${itemId} not found`);
      return res.status(404).json({ message: 'Cannot find item' });
    }
    item.activo = false; // En lugar de eliminar, desactivamos el registro
    await item.save();
    console.log(`Deactivated item with id: ${itemId}`);
    res.status(204).end();  // No response body needed for a 204
  } catch (err) {
    console.log(`Error deactivating item with id ${itemId}:`, err);
    res.status(500).json({ message: err.message });
  }
});

// Middleware para obtener un item por ID
async function getItem(req, res, next) {
  console.log(`Fetching item with id: ${req.params.id}`);
  let item;
  try {
    item = await Item.findById(req.params.id);
    if (item == null) {
      console.log(`Item with id ${req.params.id} not found`);
      return res.status(404).json({ message: 'Cannot find item' });
    }
  } catch (err) {
    console.log('Error fetching item:', err);
    return res.status(500).json({ message: err.message });
  }
  res.item = item;
  next();
}

module.exports = router;
