import React, { useState } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Grid, TablePagination } from '@mui/material';
import { Delete, PictureAsPdf } from '@mui/icons-material';
import generateReportPdf from '../generateReportPdf';
import api from '../api';

const InformeList = ({ informes, onDelete }) => {
  const [deleting, setDeleting] = useState(null);
  const [page, setPage] = useState(0); // Control de la página actual
  const [rowsPerPage, setRowsPerPage] = useState(10); // Cantidad de filas por página

  // Función para manejar la eliminación
  const handleDelete = async (id) => {
    if (deleting === id) return;

    console.log(`Eliminando informe con ID: ${id}`);
    setDeleting(id);

    try {
      const response = await api.delete(`/informes/${id}`);
      if (response.status === 204) {
        onDelete(id);
        alert('Informe eliminado correctamente');
      } else {
        console.error('Error eliminando el informe:', response.data);
        alert(`Error al eliminar el informe: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Hubo un error al eliminar el informe:', error);
      alert(`Error al eliminar el informe: ${error.message}`);
    } finally {
      setDeleting(null);
    }
  };

  const handleGeneratePdf = (informe) => {
    console.log('Generando PDF para:', informe);
    generateReportPdf(informe);
  };

  // Ordenar los informes por fecha descendente
  const sortedInformes = informes.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Controlar el cambio de página
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Controlar el cambio en la cantidad de filas por página
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reiniciar a la primera página
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <Typography variant="h4" gutterBottom>
        Informes Generados
      </Typography>
      <List>
        {sortedInformes
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Paginación de los informes
          .map((informe) => (
            <ListItem key={informe._id} divider>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  <Typography variant="body1">{`INFORME-${informe.serial}`}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <ListItemText
                    primary={`Fecha: ${informe.date}`}
                    secondary={informe.damageDescription}
                  />
                </Grid>
                <Grid item xs={3}>
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="generate-pdf"
                      onClick={() => handleGeneratePdf(informe)}
                    >
                      <PictureAsPdf />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(informe._id)}
                      disabled={deleting === informe._id}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </Grid>
              </Grid>
            </ListItem>
          ))}
      </List>
      <TablePagination
        component="div"
        count={informes.length} // Total de informes
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
      />
    </div>
  );
};

export default InformeList;
