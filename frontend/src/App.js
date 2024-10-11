import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Box, Typography, Button, AppBar, Toolbar, IconButton, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ItemList from './components/ItemList';
import ItemForm from './components/ItemForm';
import Informe from './components/Informe'; // Importar el nuevo componente
import Login from './components/Login';
import Register from './components/register';
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
      setItems([newItem, ...items]);
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
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            IMPD Cotizaciones
          </Typography>
          {isAuthenticated ? (
            <>
              <MenuItem component={Link} to="/">Cotizaciones</MenuItem>
              <MenuItem component={Link} to="/informes">Informes</MenuItem>
              <Button color="inherit" onClick={handleLogout}>Cerrar sesión</Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">Login</Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? (
              <Box mt={4}>
                <ItemForm selectedItem={selectedItem} onSave={handleSave} />
                <ItemList items={items} onEdit={handleEdit} onDelete={handleDelete} />
              </Box>
            ) : (
              <Login onLogin={handleLogin} />
            )}
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/informes" element={<Informe />} /> 
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
