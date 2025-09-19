import * as React from 'react';
import { useState, useEffect } from 'react';
import { Grid, Card, CardActionArea, CardMedia, CardContent, Typography, Box, Divider } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

export default function PopularProductGrid() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch popular products from backend
    fetch('http://localhost:8080/api/popular/products')
      .then((res) => res.json())
      .then((data) => {
        // Map only the fields we need
        const mappedData = data.map((item) => ({
          title: item.title,
          description: item.description,
          previousPrice: item.previousPrice,
          newPrice: item.newPrice,
          store: item.store,          // enum string like "FEJZO"
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

      {/* Product grid */}
      <Grid container spacing={3} sx={{ padding: '0 5rem', justifyContent: 'center' }}>
        {products.map((product, index) => (
          <Grid
              item
              key={index}
              xs={3}   // span 3/12 columns on extra-small screens
              sm={4}   // span 4/12 columns on small screens
              md={4}   // span 4/12 columns on medium screens
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
              <CardActionArea>
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

                  {/* Prices */}
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

                  {/* Store and category */}
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
