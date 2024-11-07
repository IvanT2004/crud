const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const Informe = require('../models/Informe');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Obtener todos los informes
router.get('/', auth, async (req, res) => {
  try {
    const informes = await Informe.find();
    const baseURL = process.env.SERVER_BASE_URL || `https://${req.headers.host}`;
    informes.forEach(informe => {
      informe.images = informe.images.map(imagePath =>
        imagePath.startsWith('http') ? imagePath : `${baseURL}/${imagePath}`
      );
    });
    res.json(informes);
  } catch (err) {
    console.error('Error al obtener los informes:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
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

// Actualizar un informe con subida de imágenes
router.put('/:id', auth, upload.array('images', 6), async (req, res) => {
  const { id } = req.params;
  const { serial, timestamp, imageTimestamp, damageDescription, proposedSolution, observacion } = req.body;

  const imagesToKeep = req.body.imagesToKeep ? JSON.parse(req.body.imagesToKeep) : [];
  const newImagePaths = req.files.map((file) => file.path);

  try {
    const informe = await Informe.findById(id);
    if (!informe) {
      return res.status(404).json({ message: 'Informe no encontrado' });
    }

    const imagesToDelete = informe.images.filter((imgPath) => !imagesToKeep.includes(`${process.env.SERVER_BASE_URL || 'http://backend:5000'}/${imgPath}`));

    imagesToDelete.forEach((imgPath) => {
      const filePath = path.join(__dirname, '..', imgPath.replace(`${process.env.SERVER_BASE_URL || 'https://backend:5000'}/`, ''));
      fs.unlink(filePath, (err) => {
        if (err) console.error(`Error eliminando la imagen ${filePath}:`, err);
      });
    });

    const updatedImages = [...imagesToKeep, ...newImagePaths];
    const updateData = {
      serial,
      timestamp,
      imageTimestamp,
      damageDescription,
      proposedSolution,
      observacion,
      images: updatedImages
    };

    const updatedInforme = await Informe.findByIdAndUpdate(id, updateData, { new: true });

    res.json(updatedInforme);
  } catch (error) {
    console.error('Error al actualizar el informe:', error);
    res.status(500).json({ message: 'Error al actualizar el informe' });
  }
});

// Crear un informe con subida de imágenes
router.post('/', auth, upload.array('images', 6), async (req, res) => {
  try {
    const imagePaths = req.files.map(file => file.path); // Obtener los paths de las imágenes
    
    console.log("Datos recibidos:", req.body); // Esto te ayudará a ver qué datos están llegando realmente al servidor
    
    const informe = new Informe({
      serial: req.body.serial,
      timestamp: new Date(req.body.timestamp), // Asegurarse de que sea un objeto Date
      imageTimestamp: new Date(req.body.imageTimestamp), // Asegurarse de que sea un objeto Date
      damageDescription: req.body.damageDescription,
      proposedSolution: req.body.proposedSolution,
      observacion: req.body.observacion,
      images: imagePaths
    });

    const savedInforme = await informe.save();
    res.status(201).json(savedInforme);
    console.log("timestamp recibido:", req.body.timestamp);
    console.log("imageTimestamp recibido:", req.body.imageTimestamp);
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
    // console.log(Informe con ID ${id} eliminado); // Log de confirmación

    res.status(204).end(); // Respuesta sin contenido
  } catch (err) {
    console.error('Error al eliminar el informe:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
