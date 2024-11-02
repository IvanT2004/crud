import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../api';
import InformeList from './InformeList';

const TechnicalReportForm = () => {
  const [serial, setSerial] = useState('');
  const [timestamp, setTimestamp] = useState(new Date());
  const [imageTimestamp, setImageTimestamp] = useState(new Date());
  const [damageDescription, setDamageDescription] = useState('');
  const [observations, setObservations] = useState('garantia');
  const [images, setImages] = useState([]);
  const [imagesToKeep, setImagesToKeep] = useState([]); // Estado para las imágenes a conservar en el servidor
  const [informes, setInformes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const proposedSolution = 'Cambiar componentes para poner parte a punto';

  useEffect(() => {
    fetchInformes();
  }, []);

  const fetchInformes = async () => {
    try {
      const response = await api.get('/informes');
      setInformes(response.data);
    } catch (error) {
      console.error('Error al obtener los informes:', error);
    }
  };

  const handleImageRemove = (index) => {
    const imageToRemove = images[index];
    if (imageToRemove.type === 'url') {
      setImagesToKeep(imagesToKeep.filter((img) => img !== imageToRemove.src));
    }
    setImages(images.filter((_, i) => i !== index));
  };

  const handleEdit = (informe) => {
    setSerial(informe.serial);
    setTimestamp(new Date(informe.timestamp));
    setImageTimestamp(new Date(informe.imageTimestamp));
    setDamageDescription(informe.damageDescription);
    setObservations(informe.observacion);
    setEditingId(informe._id);

    // Cargar las imágenes existentes del servidor y almacenarlas en imagesToKeep
    const imagesFromServer = informe.images.map((imgPath) => ({
      type: 'url',
      src: imgPath,
    }));
    setImages(imagesFromServer);
    setImagesToKeep(informe.images); // Guardamos las imágenes originales en el estado imagesToKeep
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (value.length <= 330) {
      setDamageDescription(value);
      setError('');
    } else {
      setError('La descripción del daño no puede exceder los 330 caracteres.');
    }
  };

  const handleImageChange = (e) => {
    const newImages = Array.from(e.target.files).map((file) => ({
      type: 'file',
      file,
    }));

    if (images.filter((img) => img.type === 'file').length + newImages.length > 6) {
      setError('No puedes añadir más de 6 imágenes.');
    } else {
      setImages([...images, ...newImages]);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (damageDescription.length > 330) {
      setError('La descripción del daño no puede exceder los 330 caracteres.');
      return;
    }
    if (images.length > 6) {
      setError('No puedes añadir más de 6 imágenes.');
      return;
    }
  
    const formData = new FormData();
    formData.append('serial', serial);
    formData.append('timestamp', timestamp.toISOString());
    formData.append('imageTimestamp', imageTimestamp.toISOString());
    formData.append('damageDescription', damageDescription);
    formData.append('proposedSolution', proposedSolution);
    formData.append('observacion', observations);
  
    images.forEach((image) => {
      if (image.type === 'file') {
        formData.append('images', image.file);
      }
    });
  
    if (editingId) {
      const filteredImagesToKeep = imagesToKeep.map((img) =>
        img.startsWith('http') ? img : `${process.env.SERVER_BASE_URL || 'http://localhost:5000'}/${img}`
      );
  
      formData.append('imagesToKeep', JSON.stringify(filteredImagesToKeep));
  
      const response = await api.put(`/informes/${editingId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      setInformes((prevInformes) =>
        prevInformes.map((informe) =>
          informe._id === editingId ? response.data : informe
        )
      );
      setEditingId(null);
    } else {
      await api.post('/informes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
  
    await fetchInformes(); // Sincronizar los datos después de la actualización
    resetForm();
  };

  const handleDeleteInforme = (id) => {
    setInformes((prevInformes) => prevInformes.filter((informe) => informe._id !== id));
  };

  const resetForm = () => {
    setSerial('');
    setTimestamp(new Date());
    setImageTimestamp(new Date());
    setDamageDescription('');
    setObservations('garantia');
    setImages([]);
    setImagesToKeep([]); // Resetear las imágenes a conservar
    setEditingId(null);
    setError('');
  };

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Informe Técnico
        </Typography>
        <form>
          <TextField
            label="Número de Serial"
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Fecha y Hora del Informe"
              value={timestamp}
              onChange={(newValue) => setTimestamp(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
            <DateTimePicker
              label="Fecha y Hora para Pie de Página de Imágenes"
              value={imageTimestamp}
              onChange={(newValue) => setImageTimestamp(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
            />
          </LocalizationProvider>
          <TextField
            label="Descripción del Daño"
            value={damageDescription}
            onChange={handleDescriptionChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            required
            helperText={`${damageDescription.length}/330 caracteres`}
          />
          <Typography variant="h6" style={{ marginTop: '20px' }}>
            Solución Propuesta
          </Typography>
          <Typography>{proposedSolution}</Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel>Observaciones</InputLabel>
            <Select
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
            >
              <MenuItem value="garantia">* Garantía válida por 6 meses.</MenuItem>
              <MenuItem value="revision">* Revisar sistema de inyección y turbo.</MenuItem>
            </Select>
          </FormControl>

          <input
            accept="image/*"
            id="image-upload"
            type="file"
            multiple
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          <label htmlFor="image-upload">
            <Button variant="contained" color="primary" component="span" style={{ marginTop: '10px' }}>
              Cargar Imágenes
            </Button>
          </label>

          {error && (
            <Typography color="error" style={{ marginTop: '10px' }}>
              {error}
            </Typography>
          )}

          <Grid container spacing={2} style={{ marginTop: '10px' }}>
            {images.map((image, index) => (
              <Grid item xs={4} key={index}>
                <img src={image.type === 'file' ? URL.createObjectURL(image.file) : image.src} alt={`preview-${index}`} style={{ width: '100%' }} />
                <Button variant="contained" color="secondary" onClick={() => handleImageRemove(index)}>
                  Eliminar
                </Button>
              </Grid>
            ))}
          </Grid>

          <Box mt={4}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {editingId ? 'Actualizar Informe' : 'Generar PDF'}
            </Button>
          </Box>
        </form>
      </Box>

      <InformeList informes={informes} onDelete={handleDeleteInforme} onEdit={handleEdit} />
    </Container>
  );
};

export default TechnicalReportForm;
