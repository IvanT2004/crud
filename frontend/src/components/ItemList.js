import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Container, Box } from '@mui/material';
import { Edit, Delete, PictureAsPdf } from '@mui/icons-material';
import generatePdf from '../generatePdf';
import api from '../api';

const ItemList = ({ items, onEdit, onDelete }) => {
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    console.log('ItemList component mounted or updated');
    return () => {
      console.log('ItemList component unmounted');
    };
  }, []);

  const handleDelete = async (id) => {
    if (deleting === id) {
        return; // Evita la eliminación duplicada
    }
    setDeleting(id); // Marca el ítem como "en proceso de eliminación"

    try {
        const response = await api.delete(`/items/${id}`);
        if (response.status === 204) {
            onDelete(id);  // Actualiza el estado para eliminar el ítem del frontend
        } else {
            console.error("Error deleting item:", response.data);
            alert(`Error al eliminar el item: ${response.data.message}`);
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log("Item no encontrado. Es posible que ya haya sido eliminado.");
            onDelete(id);  // Considera el ítem eliminado si ya no se encuentra
        } else {
            console.error("There was an error deleting the item:", error);
            alert(`Error al eliminar el item: ${error.message}`);
        }
    } finally {
        setTimeout(() => {
            setDeleting(null); // Desbloquea el botón de eliminación después de un pequeño retraso
        }, 500); // Retraso de 500ms para asegurarse de que no se realicen solicitudes duplicadas
    }
};



  
  const handleGeneratePdf = (item, index) => {
    console.log('Generando PDF para:', item);
    generatePdf(item);
  };

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Cotizaciones
        </Typography>
        <List>
          {items.map((item, index) => (
            <ListItem key={item._id} divider>
              <ListItemText
                primary={item.asunto}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit" onClick={() => onEdit(item)}>
                  <Edit />
                </IconButton>
                <IconButton 
                  edge="end" 
                  aria-label="delete" 
                  onClick={() => handleDelete(item._id)} 
                  disabled={deleting === item._id}
                >
                  <Delete />
                </IconButton>
                <IconButton edge="end" aria-label="generate-pdf" onClick={() => handleGeneratePdf(item, index)}>
                  <PictureAsPdf />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default ItemList;