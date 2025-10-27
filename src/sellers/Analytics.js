import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Container,
} from "@mui/material";

export default function Analytics() {
  const [topProducts, setTopProducts] = useState([]);
  const [topStores, setTopStores] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingStores, setLoadingStores] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem("jwtToken");

    const fetchTopProducts = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/product-clicks/top-products?limit=5",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );
        if (!res.ok) throw new Error("Failed to fetch top products");
        const data = await res.json();
        setTopProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
        setTopProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    const fetchTopStores = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/store-clicks/top-stores?limit=5",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );
        if (!res.ok) throw new Error("Failed to fetch top stores");
        const data = await res.json();
        setTopStores(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
        setTopStores([]);
      } finally {
        setLoadingStores(false);
      }
    };

    fetchTopProducts();
    fetchTopStores();

    return () => controller.abort();
  }, []);

  if (loadingProducts || loadingStores) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ marginTop: 4, width: "90%" }} maxWidth={false}>
      
      {/* Header same styling */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          padding: "24px 28px",
          borderRadius: "24px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #2563eb 100%)",
          color: "#f5f7ff",
          boxShadow: "0 28px 64px rgba(15, 23, 42, 0.35)",
          mb: 4,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Analytics Dashboard
        </Typography>
        <Typography variant="body2" color="#f8fafc">
          Track the most clicked stores and products in your platform.
        </Typography>
      </Box>

      {/* Top Products */}
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Top Clicked Products
      </Typography>

      {topProducts.length === 0 ? (
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          No product clicks recorded yet.
        </Typography>
      ) : (
        <Grid container spacing={3} sx={{ mb: 5 }}>
          {topProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card
                sx={{
                  borderRadius: "16px",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                  transition: "transform 0.25s, box-shadow 0.25s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {product.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Category: {product.category}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Brand: {product.brand}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="primary"
                    fontWeight={600}
                    sx={{ mt: 1 }}
                  >
                    Clicks: {product.clickCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Top Stores */}
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Top Clicked Stores
      </Typography>

      {topStores.length === 0 ? (
        <Typography color="text.secondary">
          No store clicks recorded yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {topStores.map((store) => (
            <Grid item xs={12} sm={6} md={4} key={store.id}>
              <Card
                sx={{
                  borderRadius: "16px",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                  transition: "transform 0.25s, box-shadow 0.25s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
                  },
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {store.storeName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="primary"
                    fontWeight={600}
                    sx={{ mt: 1 }}
                  >
                    Clicks: {store.clickCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

    </Container>
  );
}
