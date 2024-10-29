const express = require('express');
const router = express.Router();
const Informe = require('../models/Informe');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload'); // Importa multer


router.get('/', auth, async (req, res) => {
  try {
    const informes = await Informe.find();
    res.json(informes);
  } catch (err) {
    console.error('Error al obtener los informes:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


// Crear un informe con subida de imágenes
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const imagePaths = req.files.map(file => file.path); // Obtener los paths de las imágenes

    const informe = new Informe({
      serial: req.body.serial,
      date: req.body.date,
      damageDescription: req.body.damageDescription,
      proposedSolution: req.body.proposedSolution,
      observacion: req.body.observacion,
      images: imagePaths // Guardar los paths en la BD
    });

    const savedInforme = await informe.save();
    res.status(201).json(savedInforme);
  } catch (err) {
    console.error('Error creating informe:', err);
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params; // Extraer el ID de los parámetros
  try {
    const informe = await Informe.findById(id); // Buscar el informe por ID
    if (!informe) {
      return res.status(404).json({ message: 'Informe no encontrado' });
    }
    
    // Usamos deleteOne() para eliminar el informe
    await Informe.deleteOne({ _id: id }); 
    console.log(`Informe con ID ${id} eliminado`); // Log de confirmación

    res.status(204).end(); // Respuesta sin contenido
  } catch (err) {
    console.error('Error al eliminar el informe:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});



module.exports = router;
