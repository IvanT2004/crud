import React, { useState, useEffect } from 'react';
import api from '../api';
import { TextField, Button, Container, Box, Typography, Grid, Paper, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Add } from '@mui/icons-material';
import './ItemForm.css';

const ItemForm = ({ selectedItem, onSave }) => {
  const [asunto, setAsunto] = useState('');
  const [cliente, setCliente] = useState('ETIB');
  const [otrosCliente, setOtrosCliente] = useState('');
  const [productos, setProductos] = useState([{ codigo: '', descripcion: '', cantidad: 0, valor: 0, total: 0 }]);
  const [numRows, setNumRows] = useState(1);
  const [subTotal, setSubTotal] = useState(0);
  const [observaciones, setObservaciones] = useState('');
  const [iva, setIva] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (selectedItem) {
      setAsunto(selectedItem.asunto);
      setCliente(selectedItem.cliente);
      setOtrosCliente(selectedItem.cliente === 'Otros' ? selectedItem.otrosCliente : '');
      const productosActualizados = selectedItem.productos.map(p => ({
        ...p,
        total: parseFloat(p.cantidad) * parseFloat(p.valor)
      }));
      setProductos(productosActualizados);
      setObservaciones(selectedItem.observaciones || ''); // Cargar observaciones
      calcularTotales(productosActualizados);
    } else {
      setAsunto('');
      setCliente('ETIB');
      setProductos([{ codigo: '', descripcion: '', cantidad: 0, valor: 0, total: 0 }]);
      setObservaciones(''); // Inicializar observaciones
      setSubTotal(0);
      setIva(0);
      setTotal(0);
    }
  }, [selectedItem]);
  const formatNumberInput = (value) => {
    return new Intl.NumberFormat('es-CO').format(value);
  };

  const parseFormattedNumber = (value) => {
    return Number(value.replace(/\./g, ''));
  };

  const handleProductChange = (index, field, value) => {
    const formattedValue = field === 'cantidad' || field === 'valor' ? parseFormattedNumber(value) : value;
    const newProductos = productos.map((producto, i) => {
      if (i === index) {
        const updatedProducto = { ...producto, [field]: formattedValue };
        if (field === 'cantidad' || field === 'valor') {
          updatedProducto.total = parseFloat(updatedProducto.cantidad || 0) * parseFloat(updatedProducto.valor || 0);
        }
        return updatedProducto;
      }
      return producto;
    });
    setProductos(newProductos);
    calcularTotales(newProductos);
  };

  const addProductRows = () => {
    const newRows = Array.from({ length: numRows }, () => ({ codigo: '', descripcion: '', cantidad: 0, valor: 0, total: 0 }));
    setProductos([...productos, ...newRows]);
  };

  const calcularTotales = (productos) => {
    const subTotalCalculado = productos.reduce((sum, producto) => sum + parseFloat(producto.total || 0), 0);
    const ivaCalculado = subTotalCalculado * 0.19;
    setSubTotal(subTotalCalculado);
    setIva(ivaCalculado);
    setTotal(subTotalCalculado + ivaCalculado);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validación básica antes de enviar
    if (!asunto.trim()) {
        alert("El campo Asunto es obligatorio");
        return;
    }
  
    // Filtrar los productos para incluir solo aquellos que tienen una descripción
    const filteredProductos = productos.filter(producto => producto.descripcion.trim());
  
    if (filteredProductos.length === 0) {
        alert("Debe haber al menos un producto con una descripción válida.");
        return;
    }
  
    const item = {
        asunto,
        cliente: cliente === 'Otros' ? otrosCliente : cliente,
        productos: filteredProductos, // Usar solo los productos filtrados
        subTotal,
        iva,
        total,
        observaciones
    };
  
    try {
      let savedItem;
      if (selectedItem) {
          savedItem = await api.put(`/items/${selectedItem._id}`, item);
      } else {
          savedItem = await api.post('/items', item);
      }
      onSave(savedItem.data);
      
      // Limpiar el formulario después de guardar
      setAsunto('');
      setCliente('ETIB');
      setOtrosCliente('');
      setProductos([{ codigo: '', descripcion: '', cantidad: 0, valor: 0, total: 0 }]);
      setObservaciones('');
      setSubTotal(0);
      setIva(0);
      setTotal(0);
  } catch (error) {
      console.error("Error al crear o actualizar el item:", error);
      alert("Hubo un error al crear o actualizar el item. Por favor, revisa los datos e inténtalo de nuevo.");
  }
};
  
  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          {selectedItem ? 'Editar' : 'Nueva'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Cliente</InputLabel>
            <Select
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
            >
              <MenuItem value="ETIB">ETIB Empresa de Transporte Integrado de Bogotá</MenuItem>
              <MenuItem value="Otros">Otros</MenuItem>
            </Select>
          </FormControl>
          {cliente === 'Otros' && (
            <TextField
              label="Otros Cliente"
              value={otrosCliente}
              onChange={(e) => setOtrosCliente(e.target.value)}
              fullWidth
              margin="normal"
            />
          )}
          <TextField
            label="Asunto"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            fullWidth
            margin="normal"
          />
          <div className="product-rows">
            {productos.map((producto, index) => (
              <div className="product-row" key={index}>
                <TextField
                  label="Codigo"
                  value={producto.codigo}
                  onChange={(e) => handleProductChange(index, 'codigo', e.target.value)}
                  className="product-field"
                />
                <TextField
                  label="Descripción"
                  value={producto.descripcion}
                  onChange={(e) => handleProductChange(index, 'descripcion', e.target.value)}
                  className="product-field"
                />
                <TextField
                  label="Cantidad"
                  type="text"
                  value={formatNumberInput(producto.cantidad)}
                  onChange={(e) => handleProductChange(index, 'cantidad', e.target.value)}
                  className="product-field"
                />
                <TextField
                  label="Valor"
                  type="text"
                  value={formatNumberInput(producto.valor)}
                  onChange={(e) => handleProductChange(index, 'valor', e.target.value)}
                  className="product-field"
                />
                <TextField
                  label="Valor Total"
                  value={formatNumberInput(producto.total.toFixed(0))}
                  InputProps={{
                    readOnly: true,
                  }}
                  className="product-field"
                />
              </div>
            ))}
          </div>
          <Box mt={2} display="flex" alignItems="center">
            <TextField
              label="Filas"
              type="number"
              value={numRows}
              onChange={(e) => setNumRows(e.target.value)}
              InputProps={{ inputProps: { min: 1 } }}
              style={{ marginRight: 10 }}
            />
            <Button
              type="button"
              variant="outlined"
              startIcon={<Add />}
              onClick={addProductRows}
            >
              Añadir más filas
            </Button>
          </Box>
          <TextField
            label="Observaciones"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            fullWidth
            margin="normal"
            multiline
          />
          <Box mt={2} component={Paper} p={2}>
            <Typography variant="h6">Resumen</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  label="Sub Total"
                  value={formatNumberInput(subTotal.toFixed(0))}
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="IVA (19%)"
                  value={formatNumberInput(iva.toFixed(0))}
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Total"
                  value={formatNumberInput(total.toFixed(0))}
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                />
              </Grid>
            </Grid>
          </Box>
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary">
              {selectedItem ? 'Actualizar' : 'Crear'}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default ItemForm;
