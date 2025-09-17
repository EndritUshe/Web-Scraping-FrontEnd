import * as React from 'react';
import { Grid, Card, CardActionArea, CardMedia, CardContent, Typography, Box } from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

export default function PopularProductGrid() {
  // Dummy data
  const products = Array.from({ length: 24 }, (_, i) => ({
    title: `Product ${i + 1}`,
    description: `Price: $${(i + 1) * 10}.00`,
  }));

  return (
     <Box>
      {/* Title with icon */}
      <Box sx={{ display: 'flex', alignItems: 'center', margin: '2rem 2rem 1rem 12rem' }}>
        <ArrowRightIcon sx={{ color: 'primary.main', mr: 2, fontSize: 30 }} />
        <Typography 
          variant="h5" 
          sx={{ fontWeight: 'bold', color: 'primary.main', textTransform: 'uppercase' }}
        >
          Produktet e preferuara
        </Typography>
      </Box>

      {/* Product grid */}
      <Grid container spacing={3} sx={{ padding: '0 5rem', justifyContent: 'center' }}>
        {products.map((product, index) => (
          <Grid
            item
            key={index}
            xs={24}    // full width on mobile
            sm={6}     // 2 cards per row on small screens
            md={4}     // 3 cards per row on medium and up
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <Card  
              sx={{
                width: '100%',
                minWidth: 360,
                minHeight: 260,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="160"
                  image="/static/images/promo.jpg"
                  alt={product.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {product.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
