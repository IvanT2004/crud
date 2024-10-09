import React, { useState } from 'react';
import { TextField, Button, Container, Box, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import generateReportPdf from '../generateReportPdf'; // Importa la función de generar PDF

const TechnicalReportForm = () => {
  const [serial, setSerial] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [damageDescription, setDamageDescription] = useState('');
  const [observations, setObservations] = useState('garantia'); // Valor inicial de Observaciones
  const [images, setImages] = useState([]);

  // Solución propuesta quemada
  const proposedSolution = 'Cambiar componentes para poner parte a punto';

  const handleImageUpload = (e) => {
    const uploadedImages = Array.from(e.target.files);
    setImages([...images, ...uploadedImages]);
  };

  const handleImageRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleSubmit = () => {
    const reportData = {
      serial,
      date,
      damageDescription,
      proposedSolution, // Este valor ya está predefinido
      observacion: observations, // Este será el valor de las observaciones seleccionadas
      images,
    };

    // Llama a la función para generar el PDF
    generateReportPdf(reportData);
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
              <MenuItem value="garantia">* Garantía válida por 6 meses debido a fatiga de material.</MenuItem>
              <MenuItem value="revision">* Revisar sistema de inyección y turbo</MenuItem>
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
            <Button variant="contained" color="primary" component="span" style={{ marginTop: '10px' }}>
              Cargar Imágenes
            </Button>
          </label>
          <Grid container spacing={2} style={{ marginTop: '10px' }}>
            {images.map((image, index) => (
              <Grid item xs={4} key={index}>
                <img src={URL.createObjectURL(image)} alt={`preview-${index}`} style={{ width: '100%' }} />
                <Button variant="contained" color="secondary" onClick={() => handleImageRemove(index)}>
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
    </Container>
  );
};

export default TechnicalReportForm;
