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
      return;
    }
    console.log(`handleDelete called for id: ${id}`);
    setDeleting(id);
    try {
      const url = `/items/${id}`;
      console.log(`Attempting to delete item with URL: ${url}`);
      const response = await api.delete(url);
      if (response.status === 204) {
        onDelete(id);
      } else {
        console.error("Error deleting item:", response.data);
        alert(`Error al eliminar el item: ${response.data.message}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("Item no encontrado. Es posible que ya haya sido eliminado.");
        onDelete(id);
      } else {
        console.error("There was an error deleting the item:", error);
        alert(`Error al eliminar el item: ${error.message}`);
      }
    } finally {
      setDeleting(null);
      console.log(`Deletion process completed for id: ${id}`);
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
