import React, { useState, useEffect } from 'react';
import ItemList from './components/ItemList';
import ItemForm from './components/ItemForm';
import { Container, Box, Typography } from '@mui/material';
import api from './api';

const App = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      const response = await api.get('/items');
      setItems(response.data);
    };
    fetchItems();
  }, []);

  const handleEdit = (item) => {
    setSelectedItem(item);
  };

  const handleSave = async (newItem) => {
    if (selectedItem) {
      setItems(items.map(item => (item._id === newItem._id ? newItem : item)));
    } else {
      setItems([...items, newItem]);
    }
    setSelectedItem(null);
  };

  const handleDelete = async (id) => {
    await api.delete(`/items/${id}`);
    setItems(items.filter(item => item._id !== id));
  };

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Typography variant="h2" gutterBottom>
          IMPD Cotizaciones
        </Typography>
        <ItemForm selectedItem={selectedItem} onSave={handleSave} />
        <ItemList items={items} onEdit={handleEdit} onDelete={handleDelete} />
      </Box>
    </Container>
  );
};

export default App;
