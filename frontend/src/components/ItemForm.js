import React, { useState, useEffect } from 'react';
import api from '../api';
import { TextField, Button, Container, Box, Typography } from '@mui/material';

const ItemForm = ({ selectedItem, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (selectedItem) {
      setName(selectedItem.name);
      setDescription(selectedItem.description);
    } else {
      setName('');
      setDescription('');
    }
  }, [selectedItem]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const item = { name, description };
    let savedItem;
    if (selectedItem) {
      savedItem = await api.put(`/items/${selectedItem._id}`, item);
    } else {
      savedItem = await api.post('/items', item);
    }
    onSave(savedItem.data);
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          {selectedItem ? 'Edit Item' : 'Create Item'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary">
              {selectedItem ? 'Update' : 'Create'}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default ItemForm;
