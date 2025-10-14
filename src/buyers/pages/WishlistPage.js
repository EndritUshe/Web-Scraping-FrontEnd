import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Divider,
  Snackbar,
  Alert,
  IconButton,
} from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  const getToken = () => localStorage.getItem('jwt');

  // Load wishlist items
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

  // Remove item from wishlist
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
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', margin: '2rem 2rem 0 12rem' }}>
        <ArrowRightIcon sx={{ color: "#2e7d32", mr: 2, fontSize: 30 }} />
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', color: "#2e7d32", textTransform: 'uppercase' }}
        >
          My Wishlist
        </Typography>
      </Box>

      <Divider
        sx={{ margin: '0 12rem 1.5rem 12rem', borderColor: '#2e7d32', borderBottomWidth: 2 }}
      />

      {/* Empty State */}
      {wishlistItems.length === 0 ? (
        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
          Your wishlist is empty.
        </Typography>
      ) : (
        <Grid container spacing={3} sx={{ padding: '0 5rem', justifyContent: 'center' }}>
          {wishlistItems.map((product) => (
            <Grid
              item
              key={product.id}
              xs={12}
              sm={6}
              md={4}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <Card
                sx={{
                  width: '100%',
                  minWidth: 300,
                  minHeight: 280,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.03)' },
                  boxShadow: 3,
                }}
              >
                {/* Card content without click action */}
                <CardMedia
                  component="img"
                  height="180"
                  image={product.imgUrl || '/static/images/promo.jpg'}
                  alt={product.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6">{product.title}</Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ textDecoration: 'line-through', color: 'text.disabled' }}
                    >
                      ${product.previousPrice?.toFixed(2)}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                      ${product.newPrice?.toFixed(2)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">{product.store}</Typography>
                    <Typography variant="body2" color="text.secondary">{product.category}</Typography>
                  </Box>
                </CardContent>

                <IconButton
                  sx={{ position: 'absolute', top: 8, right: 8, color: 'error.main' }}
                  onClick={() => handleRemove(product.id)}
                >
                  <FavoriteIcon />
                </IconButton>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Snackbar */}
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
