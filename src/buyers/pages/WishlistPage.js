import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  const getToken = () => localStorage.getItem('jwt');

  const loadWishlist = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) throw new Error('You are not logged in');

      const response = await axios.get('http://localhost:8080/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const mappedData = response.data.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        previousPrice: item.previousPrice,
        newPrice: item.newPrice,
        store: item.store,
        category: item.category,
        imgUrl: item.imgUrl,
      }));

      setWishlistItems(mappedData);
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || 'Failed to load wishlist');
      setOpen(true);
    }
  }, []);

  const handleRemove = async (productId) => {
    try {
      const token = getToken();
      if (!token) throw new Error('You are not logged in');

      const response = await axios.delete(
        `http://localhost:8080/api/wishlist/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(response.data.message || 'Removed from wishlist');
      setOpen(true);
      loadWishlist();
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || 'Failed to remove item');
      setOpen(true);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <Box
      sx={{
        width: '90%',
    
        margin: '0 auto',
        padding: { xs: '1rem', sm: '2rem', md: '3rem' },
        overflowX: 'hidden', // prevents horizontal scroll
      }}
    >
      {/* HEADER BOX */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: { xs: '16px 20px', sm: '24px 32px' },
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #166534 0%, #1e3a21 100%)',
          color: '#f5f7ff',
          mb: 4,
          boxShadow: '0 28px 64px rgba(22, 101, 52, 0.35)',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="h5" fontWeight={700}>
            My Wishlist
          </Typography>
          <Typography variant="body1">
            {wishlistItems.length > 0
              ? `You have ${wishlistItems.length} item(s) in your wishlist`
              : 'Your wishlist is empty.'}
          </Typography>
        </Box>
      </Box>

      {/* WISHLIST GRID */}
      {wishlistItems.length === 0 ? (
        <Typography
          variant="h6"
          align="center"
          sx={{ mt: 6, color: 'text.secondary' }}
        >
          Your wishlist is empty.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {wishlistItems.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.imgUrl || '/static/images/promo.jpg'}
                  alt={product.title}
                  sx={{
                    objectFit: 'cover',
                    transition: 'transform 0.3s',
                    '&:hover': { transform: 'scale(1.05)' },
                  }}
                />
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="h6">{product.title}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {product.previousPrice && (
                      <Typography
                        variant="body2"
                        sx={{ textDecoration: 'line-through', color: 'text.disabled' }}
                      >
                        ${product.previousPrice.toFixed(2)}
                      </Typography>
                    )}
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#166534' }}>
                      ${product.newPrice?.toFixed(2)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Store: {product.store}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Category: {product.category}
                  </Typography>

                  <IconButton
                    sx={{
                      mt: 1,
                      alignSelf: 'flex-start',
                      background: 'rgba(255,255,255,0.08)',
                      '&:hover': { background: 'rgba(255,255,255,0.15)' },
                    }}
                    onClick={() => handleRemove(product.id)}
                  >
                    <FavoriteIcon sx={{ color: '#ef4444' }} />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
