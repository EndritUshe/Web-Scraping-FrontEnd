// src/pages/PopularProductsByCategory.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import { useParams } from "react-router-dom";

const PopularProductsByCategory = () => {
  const { category, searchTerm } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = `http://localhost:8080/api/popular-products/filter?category=${encodeURIComponent(
    category
  )}&search=${encodeURIComponent(searchTerm)}`;

  useEffect(() => {
    const controller = new AbortController();

    fetch(baseUrl, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error(err);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [baseUrl]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Box textAlign="center" mt={6}>
        <Typography variant="h6" color="text.secondary">
          No products found for "{searchTerm}" in {category}.
        </Typography>
      </Box>
    );
  }

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h5" gutterBottom>
        There are {products.length} products found for "{searchTerm}" in {category}
      </Typography>

      <Grid container spacing={3}>
        {products.map((product, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card
              sx={{
                display: "flex",
                minHeight: 180,
                maxWidth: 500,
                height: "100%",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
              }}
            >
              {/* Left half: image */}
              <CardMedia
                component="img"
                sx={{ width: "40%", objectFit: "contain", p: 1 }}
                image={product.imgUrl}
                alt={product.title}
              />

              {/* Right half: details */}
              <CardContent
                sx={{
                  width: "60%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Typography variant="h6" sx={{ wordWrap: "break-word" }}>
                    {product.title}
                  </Typography>
                  <Typography variant="body1" sx={{ marginY: 1 }}>
                    Price: {product.newPrice} Lek
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    From: {product.store}
                  </Typography>
                </div>

                <Button
                  variant="contained"
                  color="primary"
                  href={product.url}
                  target="_blank"
                  sx={{ m: 1, alignSelf: "flex-start" }}
                >
                  Visit Product
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PopularProductsByCategory;
