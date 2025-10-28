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

  const MAX_PRODUCTS = 4;
  const canAddProduct = products.length < MAX_PRODUCTS;

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem("jwtToken");

    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/popular-products/my-products", {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
    return () => controller.abort();
  }, []);

  const handleDeleteProduct = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    const token = localStorage.getItem("jwtToken");

    fetch(`http://localhost:8080/api/popular-products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete product");
        setProducts(products.filter((p) => p.id !== id));
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

  return (
    <Container sx={{ marginTop: 4, width: "90%" }} maxWidth={false}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          padding: "24px 28px",
          borderRadius: "24px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #2563eb 100%)",
          color: "#f5f7ff",
          boxShadow: "0 28px 64px rgba(15, 23, 42, 0.35)",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography variant="h5" fontWeight={700}>Welcome!</Typography>
          <Typography variant="body1">
            {products.length > 0
              ? `Products you have created (${products.length})`
              : "You have not created any products yet."}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={onAddProduct}
            disabled={!canAddProduct}
            sx={{ borderColor: "#f5f7ff", color: "#f5f7ff" }}
          >
            Add Product
          </Button>
          {!canAddProduct && (
            <Typography
              sx={{ color: "#ffffff", fontSize: "1rem", mt: 1, fontWeight: 600 }}
            >
              Product limit reached ({MAX_PRODUCTS})
            </Typography>
          )}
        </Box>
      </Box>

      {products.length === 0 ? (
        <Box textAlign="center" mt={6}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            You have not created any products yet. Please press "Add Product" to create your first.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} key={product.id}>
              <Card
                sx={{
                  display: "flex",
                  minHeight: 250,
                  maxWidth: 700,
                  height: "100%",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    width: "40%",
                    objectFit: "cover",
                    transition: "transform 0.3s",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                  image={product.imgUrl}
                  alt={product.title}
                />

                <CardContent
                  sx={{ width: "60%", display: "flex", flexDirection: "column", justifyContent: "space-between", p: 2 }}
                >
                  <div>
                    <Typography variant="h6" sx={{ wordWrap: "break-word" }}>{product.title}</Typography>
                    <Typography variant="body1" sx={{ marginY: 1 }}>Price: {product.newPrice} ALL</Typography>
                    <Typography variant="body2" color="text.secondary">Store: {product.store}</Typography>
                    <Typography variant="body2" color="text.secondary">Category: {product.category}</Typography>
                  </div>

                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    <Button variant="contained" color="primary" onClick={() => onEditProduct(product.id)}>
                      Edit
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => handleDeleteProduct(product.id)}>
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
