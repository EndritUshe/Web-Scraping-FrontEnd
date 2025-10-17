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
import AddIcon from "@mui/icons-material/Add";

export default function MyProducts({ onEditProduct, onAddProduct }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem("jwtToken");

    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/popular-products/my-products", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => controller.abort(); // cleanup function
  }, []);

  const handleDeleteProduct = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    const token = localStorage.getItem("jwtToken");

    fetch(`http://localhost:8080/api/popular-products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete product");
        setProducts(products.filter((p) => p.id !== id)); // update state without refetch
      })
      .catch((err) => console.error(err));
  };

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
        <Typography variant="h6" color="text.secondary" gutterBottom>
          You have not created any products yet.
        </Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={onAddProduct}
        >
          Add Product
        </Button>
      </Box>
    );
  }

  return (
    <Container sx={{ marginTop: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">You have {products.length} products</Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={onAddProduct}
        >
          Add Product
        </Button>
      </Box>

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
                  <Typography variant="body2" color="text.secondary">
                    Category: {product.category}
                  </Typography>
                </div>

                <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => onEditProduct(product.id)}
                  >
                    Edit
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
