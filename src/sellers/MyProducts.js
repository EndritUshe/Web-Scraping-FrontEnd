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

export default function MyProducts({ onEditProduct }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem("jwtToken");

    fetch("http://localhost:8080/api/popular-products/my-products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
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
  }, []);

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
          You have not created any products yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h5" gutterBottom>
        You have {products.length} products
      </Typography>

      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} key={product.id}>
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
              <CardMedia
                component="img"
                sx={{ width: "40%", objectFit: "contain", p: 1 }}
                image={product.imgUrl}
                alt={product.title}
              />

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
                    Store: {product.store}
                  </Typography>
                </div>

                <Button
                  variant="contained"
                  color="primary"
                  sx={{ m: 1, alignSelf: "flex-start" }}
                  onClick={() => onEditProduct(product.id)} // inline edit callback
                >
                  Edit Product
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
