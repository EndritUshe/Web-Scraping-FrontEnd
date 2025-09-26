// src/pages/Homepage.js
import * as React from 'react';
import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import PopularProductGrid from '../components/PopularProductGrid';
import Banners from '../components/Banners';
import { Snackbar, Alert } from '@mui/material';

export default function Homepage() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Show snackbar when page loads
    setOpen(true);
  }, []);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <div>
      <Navbar />
      <Banners />
      <PopularProductGrid />

      {/* Snackbar on page load */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
          Welcome to Compare.al
        </Alert>
      </Snackbar>
    </div>
  );
}
