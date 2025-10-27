import React, { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import axios from 'axios';

export default function AllProducts({ onAddProduct }) {
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  const getToken = () => localStorage.getItem('jwt');
  const isLoggedIn = !!getToken();

  const loadProductsAndWishlist = useCallback(async () => {
    try {
      const productsResponse = await axios.get('http://localhost:8080/api/popular-products/all');
      setProducts(productsResponse.data);

      if (isLoggedIn) {
        const token = getToken();
        const wishlistResponse = await axios.get('http://localhost:8080/api/wishlist', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlistIds(new Set(wishlistResponse.data.map((p) => p.id)));
      }
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || 'Failed to load products');
      setOpen(true);
    }
  }, [isLoggedIn]);

  const handleAddWishlist = async (productId) => {
    if (!isLoggedIn) {
      setMessage('You must be logged in to add to wishlist');
      setOpen(true);
      return;
    }

    try {
      const token = getToken();
      await axios.post(
        `http://localhost:8080/api/wishlist/add/${productId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Added to wishlist');
      setOpen(true);
      setWishlistIds((prev) => new Set(prev).add(productId));
    } catch (err) {
      setMessage(err.response?.data?.message || err.message || 'Failed to add to wishlist');
      setOpen(true);
    }
  };

  useEffect(() => {
    loadProductsAndWishlist();
  }, [loadProductsAndWishlist]);

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
      {/* HEADER BOX with dark green gradient */}
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
          width: '100%', // ensures it does not exceed container
          boxSizing: 'border-box',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography variant="h5" fontWeight={700}>
            All Products
          </Typography>
          <Typography variant="body1">
            {products.length > 0
              ? `Currently available products (${products.length})`
              : 'No products available yet.'}
          </Typography>
        </Box>
        {onAddProduct && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              background: 'linear-gradient(135deg, #16a34a 0%, #166534 100%)',
              color: '#ffffff',
              '&:hover': {
                background: 'linear-gradient(135deg, #166534 0%, #16a34a 100%)',
              },
            }}
            onClick={onAddProduct}
          >
            Add Product
          </Button>
        )}
      </Box>

      {/* PRODUCTS GRID */}
      {products.length === 0 ? (
        <Typography
          variant="h6"
          align="center"
          sx={{ mt: 6, color: 'text.secondary' }}
        >
          No products available.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
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

                  {isLoggedIn && (
                    <Button
                      variant="contained"
                      startIcon={<FavoriteBorderIcon />}
                      sx={{
                        mt: 1,
                        background: wishlistIds.has(product.id)
                          ? 'gray'
                          : 'linear-gradient(135deg, #16a34a 0%, #166534 100%)',
                        color: '#ffffff',
                        '&:hover': {
                          background: wishlistIds.has(product.id)
                            ? 'gray'
                            : 'linear-gradient(135deg, #166534 0%, #16a34a 100%)',
                        },
                      }}
                      onClick={() => handleAddWishlist(product.id)}
                      disabled={wishlistIds.has(product.id)}
                    >
                      {wishlistIds.has(product.id) ? 'Added' : 'Add to Wishlist'}
                    </Button>
                  )}
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
