import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ItemList from './components/ItemList';
import ItemForm from './components/ItemForm';
import Login from './components/Login';
//import Register from './components/register';
import { Container, Box, Typography, Button } from '@mui/material';
import api from './api';

const App = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchItems = async () => {
        const response = await api.get('/items');
        setItems(response.data);
      };
      fetchItems();
    }
  }, [isAuthenticated]);

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

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    api.defaults.headers.common['Authorization'] = null;
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Container maxWidth="md">
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? (
              <Box mt={4}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h2" gutterBottom>
                    IMPD Cotizaciones
                  </Typography>
                  <Button variant="contained" color="secondary" onClick={handleLogout}>
                    Cerrar sesión
                  </Button>
                </Box>
                <ItemForm selectedItem={selectedItem} onSave={handleSave} />
                <ItemList items={items} onEdit={handleEdit} onDelete={handleDelete} />
              </Box>
            ) : (
              <Login onLogin={handleLogin} />
            )}
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
