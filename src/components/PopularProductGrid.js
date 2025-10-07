import * as React from 'react';
import { useState, useEffect } from 'react';
import { Grid, Card, CardActionArea, CardMedia, CardContent, Typography, Box, Divider } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { useNavigate } from 'react-router-dom';

export default function PopularProductGrid() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/popular-products')
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
        <ArrowRightIcon sx={{ color: 'primary.main', mr: 2, fontSize: 30 }} />
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
        {products.map((product) => (
          <Grid
            item
            key={product.id}
            xs={3}
            sm={4}
            md={4}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <Card
              sx={{
                width: '100%',
                minWidth: 300,
                minHeight: 260,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <CardActionArea
                onClick={() => {
                  // console.log('Navigating to product:', product.id);
                  navigate(`/popular-products/${encodeURIComponent(product.id)}`);
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={product.imgUrl || '/static/images/promo.jpg'}
                  alt={product.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.title}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Typography
                      variant="body2"
                      sx={{ textDecoration: 'line-through', color: 'text.disabled' }}
                    >
                      ${product.previousPrice?.toFixed(2)}
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
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
        ))}
      </Grid>
    </Box>
  );
}
