import React from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, Container, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const ItemList = ({ items, onEdit, onDelete }) => {
  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          Item List
        </Typography>
        <List>
          {items.map(item => (
            <ListItem key={item._id} divider>
              <ListItemText
                primary={item.name}
                secondary={item.description}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit" onClick={() => onEdit(item)}>
                  <Edit />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => onDelete(item._id)}>
                  <Delete />
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
