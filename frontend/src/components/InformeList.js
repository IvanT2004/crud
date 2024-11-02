import React, { useState } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Grid, TablePagination } from '@mui/material';
import { Delete, PictureAsPdf, Edit } from '@mui/icons-material';
import generateReportPdf from '../generateReportPdf';
import api from '../api';

const InformeList = ({ informes, onDelete, onEdit }) => {
  const [deleting, setDeleting] = useState(null);
  const [page, setPage] = useState(0); // Control de la página actual
  const [rowsPerPage, setRowsPerPage] = useState(5); // Cantidad de filas por página

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

  // Filtrar los informes para mostrar solo los de la página actual
  const displayedInformes = informes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reiniciar a la primera página cuando se cambie la cantidad de filas
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <Typography variant="h4" gutterBottom>
        Informes Generados
      </Typography>
      <List>
        {displayedInformes.map((informe) => (
          <ListItem key={informe._id} divider>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <Typography variant="body1">{`INFORME-${informe.serial}`}</Typography>
              </Grid>
              <Grid item xs={6}>
                <ListItemText
                  primary={`Fecha: ${new Date(informe.timestamp).toLocaleDateString()}`}
                />
              </Grid>
              <Grid item xs={3}>
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="generate-pdf" onClick={() => handleGeneratePdf(informe)}>
                    <PictureAsPdf />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(informe._id)}>
                    <Delete />
                  </IconButton>
                  <IconButton edge="end" aria-label="edit" onClick={() => onEdit(informe)}>
                    <Edit />
                  </IconButton>
                </ListItemSecondaryAction>
              </Grid>
            </Grid>
          </ListItem>
        ))}
      </List>

      {/* Control de paginación */}
      <TablePagination
        component="div"
        count={informes.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default InformeList;
