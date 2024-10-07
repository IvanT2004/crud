import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      await api.post('/auth/register', { name, email, password });
      setMessage('Usuario registrado exitosamente');
      navigate('/login');
    } catch (error) {
      if (error.response) {
        // Error del servidor, muestra el mensaje exacto
        setMessage(error.response.data.message || 'Error al registrar usuario');
      } else {
        // Otro tipo de error (problema de red, etc.)
        setMessage('Error de red. Verifica tu conexión.');
      }
    }
  };
  

  return (
    <Box mt={4} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" gutterBottom>
        Registro
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 400 }}>
        <TextField
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Registrar
        </Button>
      </form>
      {message && <Typography color="error" mt={2}>{message}</Typography>}
      <Box mt={2}>
        <Link href="/login" variant="body2">
          ¿Ya tienes una cuenta? Iniciar sesión
        </Link>
      </Box>
    </Box>
  );
};

export default Register;
