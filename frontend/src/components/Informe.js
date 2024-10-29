import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import api from '../api';
import InformeList from './InformeList'; // Componente de listado de informes

const TechnicalReportForm = () => {
  const [serial, setSerial] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [damageDescription, setDamageDescription] = useState('');
  const [observations, setObservations] = useState('garantia');
  const [images, setImages] = useState([]);
  const [informes, setInformes] = useState([]); // Estado para los informes generados

  const proposedSolution = 'Cambiar componentes para poner parte a punto';

  // Cargar los informes al montar el componente
  useEffect(() => {
    fetchInformes();
  }, []);

  // Función para obtener los informes desde el backend
  const fetchInformes = async () => {
    try {
      const response = await api.get('/informes'); // Verifica esta URL
      console.log('Informes obtenidos:', response.data);
      setInformes(response.data);
    } catch (error) {
      console.error('Error al obtener los informes:', error);
    }
  };

  const handleImageUpload = (e) => {
    const uploadedImages = Array.from(e.target.files);
    setImages([...images, ...uploadedImages]);
  };

  const handleImageRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const resetForm = () => {
    // Restablecer todos los campos del formulario a sus valores iniciales
    setSerial('');
    setDate(new Date().toISOString().split('T')[0]);
    setDamageDescription('');
    setObservations('garantia');
    setImages([]);
  };

  const handleSubmit = async () => {
    const reportData = new FormData(); // Usamos FormData para enviar las imágenes
    reportData.append('serial', serial);
    reportData.append('date', date);
    reportData.append('damageDescription', damageDescription);
    reportData.append('proposedSolution', proposedSolution);
    reportData.append('observacion', observations);

    images.forEach((image) => {
      reportData.append('images', image); // Agregar cada imagen al FormData
    });

    try {
      const response = await api.post('/informes', reportData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Informe creado:', response.data);
      fetchInformes(); // Actualizar la lista de informes
      resetForm(); // Limpiar el formulario
      alert('Informe guardado exitosamente');
    } catch (error) {
      console.error('Error al crear el informe:', error);
      alert('Error al guardar el informe');
    }
  };

  const handleDeleteInforme = (id) => {
    setInformes((prevInformes) => prevInformes.filter((informe) => informe._id !== id));
  };

  return (
    <Container maxWidth="md">
      {/* Formulario de Informe Técnico */}
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
          <TextField
            label="Fecha"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Descripción del Daño"
            value={damageDescription}
            onChange={(e) => setDamageDescription(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            required
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
              <MenuItem value="garantia">
                * Garantía válida por 6 meses debido a fatiga de material.
              </MenuItem>
              <MenuItem value="revision">
                * Revisar sistema de inyección y turbo.
              </MenuItem>
            </Select>
          </FormControl>

          <input
            accept="image/*"
            id="image-upload"
            type="file"
            multiple
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
          <label htmlFor="image-upload">
            <Button
              variant="contained"
              color="primary"
              component="span"
              style={{ marginTop: '10px' }}
            >
              Cargar Imágenes
            </Button>
          </label>

          <Grid container spacing={2} style={{ marginTop: '10px' }}>
            {images.map((image, index) => (
              <Grid item xs={4} key={index}>
                <img
                  src={URL.createObjectURL(image)}
                  alt={`preview-${index}`}
                  style={{ width: '100%' }}
                />
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleImageRemove(index)}
                >
                  Eliminar
                </Button>
              </Grid>
            ))}
          </Grid>

          <Box mt={4}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Generar PDF
            </Button>
          </Box>
        </form>
      </Box>

      {/* Listado de Informes Generados */}
      <InformeList informes={informes} onDelete={handleDeleteInforme} />
    </Container>
  );
};

export default TechnicalReportForm;
