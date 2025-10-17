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
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import axios from 'axios';

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  const getToken = () => localStorage.getItem('jwt');
  const isLoggedIn = !!getToken();

  // Load all products and wishlist
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

  // Add a product to wishlist
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
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', margin: '2rem 2rem 0 12rem' }}>
        <ArrowRightIcon sx={{ color: '#2e7d32', mr: 2, fontSize: 30 }} />
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2e7d32', textTransform: 'uppercase' }}>
          All Products
        </Typography>
      </Box>

      <Divider sx={{ margin: '0 12rem 1.5rem 12rem', borderColor: '#2e7d32', borderBottomWidth: 2 }} />

      {products.length === 0 ? (
        <Typography variant="h5" align="center" sx={{ mt: 4 }}>
          No products available.
        </Typography>
      ) : (
        <Grid container spacing={3} sx={{ padding: '0 5rem', justifyContent: 'center' }}>
          {products.map((product) => (
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
                    <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.disabled' }}>
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

                {isLoggedIn && (
                  <Button
                    variant="outlined"
                    startIcon={<FavoriteBorderIcon />}
                    sx={{ m: 1, color: "#2e7d32" }}
                    onClick={() => handleAddWishlist(product.id)}
                    disabled={wishlistIds.has(product.id)}
                  >
                    {wishlistIds.has(product.id) ? "Added" : "Add to Wishlist"}
                  </Button>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
