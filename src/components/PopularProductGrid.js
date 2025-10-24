import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  Grid,
  Card,
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
      .then((data) =>
        setProducts(
          data.map((item) => ({
            id: item.id,
            title: item.title,
            previousPrice: item.previousPrice,
            newPrice: item.newPrice,
            store: item.store,
            category: item.category,
            imgUrl: item.imgUrl,
          }))
        )
      )
      .catch((err) => console.error('Error fetching popular products:', err));
  }, []);

  return (
    <Box
      sx={{
        width: "95%",
        mx: "auto",
        my: 6,
        backgroundColor: "white",
        borderRadius: "26px",
        boxShadow: "0 26px 70px rgba(19,32,62,0.14)",
        background: "#f5f7ff",
        p: { xs: 3, md: 5 },
      }}
    >
      {/* Header with Dividers */}
      <Box sx={{ display: "flex", alignItems: "center", width: "100%", mb: 5 }}>
        <Divider
          sx={{ flex: 1, borderColor: "#07203cff", borderBottomWidth: 2.5, mr: 2.5 }}
        />
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#07203cff",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            letterSpacing: "0.5px",
          }}
        >
          Popular Products
        </Typography>
        <Divider
          sx={{ flex: 1, borderColor: "#07203cff", borderBottomWidth: 2.5, ml: 2.5 }}
        />
      </Box>

      {/* Products */}
      <Grid container spacing={3} justifyContent="center">
        {products.map((product) => {
          const hasDiscount = product.previousPrice > product.newPrice;
          const discount = hasDiscount
            ? `-${Math.round(
                ((product.previousPrice - product.newPrice) / product.previousPrice) * 100
              )}%`
            : null;

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Card
                sx={{
                  position: "relative",
                  minWidth: 260,
                  minHeight: 350,
                  borderRadius: "18px",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.10)",
                  transition: "transform 0.25s, box-shadow 0.25s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
                  },
                  overflow: "hidden",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/popular-products/${encodeURIComponent(product.id)}`)}
              >
                {hasDiscount && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      backgroundColor: "#07203cff",
                      color: "white",
                      px: 1.2,
                      py: 0.4,
                      borderRadius: "6px",
                      fontWeight: "bold",
                      fontSize: "0.8rem",
                      zIndex: 2,
                    }}
                  >
                    {discount}
                  </Box>
                )}

                <CardMedia
                  component="img"
                  height="220"
                  image={product.imgUrl}
                  alt={product.title}
                  sx={{ objectFit: "cover" }}
                />

                <CardContent sx={{ px: 2 }}>
                  <Typography
                    sx={{ fontWeight: 600, fontSize: "1.05rem", mb: 1, color: "#07203cff" }}
                  >
                    {product.title}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    {hasDiscount && (
                      <Typography
                        variant="body2"
                        sx={{ textDecoration: "line-through", color: "text.disabled" }}
                      >
                        ${product.previousPrice.toFixed(2)}
                      </Typography>
                    )}
                    <Typography
                      sx={{ fontWeight: 700, color: "#1565c0" }}
                    >
                      ${product.newPrice.toFixed(2)}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    {product.store} — {product.category}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
