import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function PopularProductGrid() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/popular-products/all')
      .then((res) => res.json())
      .then((data) => {
        const mappedData = data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          previousPrice: item.previousPrice,
          newPrice: item.newPrice,
          store: item.store,
          category: item.category,
          imgUrl: item.imgUrl,
        }));
        setProducts(mappedData);
      })
      .catch((err) => console.error('Error fetching popular products:', err));
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', margin: '2rem 2rem 0 12rem' }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', color: 'primary.main', textTransform: 'uppercase' }}
        >
          Popular Products
        </Typography>
      </Box>

      <Divider
        sx={{
          margin: '0 12rem 1.5rem 12rem',
          borderColor: 'primary.main',
          borderBottomWidth: 2,
        }}
      />

      <Grid container spacing={3} sx={{ padding: '0 5rem', justifyContent: 'center' }}>
        {products.map((product) => {
          const hasDiscount =
            product.previousPrice &&
            product.newPrice &&
            product.previousPrice > product.newPrice;
          const discount = hasDiscount
            ? `-${Math.round(
                ((product.previousPrice - product.newPrice) / product.previousPrice) * 100
              )}%`
            : null;

          return (
            <Grid
              item
              key={product.id}
              xs={12}
              sm={6}
              md={3}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <Card
                sx={{
                  position: 'relative',
                  width: '100%',
                  minWidth: 280,
                  minHeight: 280,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: 2,
                  boxShadow: 3,
                  overflow: 'hidden',
                }}
              >
                {/* Discount tag */}
                {hasDiscount && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      backgroundColor: '#1565c0',
                      color: 'white',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                      zIndex: 1,
                      boxShadow: '0px 2px 6px rgba(0,0,0,0.3)',
                    }}
                  >
                    {discount}
                  </Box>
                )}

                <CardActionArea
                  onClick={() => navigate(`/popular-products/${encodeURIComponent(product.id)}`)}
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={product.imgUrl || '/static/images/promo.jpg'}
                    alt={product.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div">
                      {product.title}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      {hasDiscount && (
                        <Typography
                          variant="body2"
                          sx={{ textDecoration: 'line-through', color: 'text.disabled' }}
                        >
                          ${product.previousPrice?.toFixed(2)}
                        </Typography>
                      )}
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 'bold', color: 'primary.main' }}
                      >
                        ${product.newPrice?.toFixed(2)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {product.store}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {product.category}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
