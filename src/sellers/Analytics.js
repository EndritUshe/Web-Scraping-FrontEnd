import React, { useEffect, useState } from "react";
import { Typography, Grid, Card, CardContent, Box, CircularProgress } from "@mui/material";

export default function Analytics() {
  const [topProducts, setTopProducts] = useState([]);
  const [topStores, setTopStores] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingStores, setLoadingStores] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem("jwtToken");

    // Fetch top products
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

    // Fetch top stores
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

  // Loading state
  if (loadingProducts || loadingStores) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      {/* Top Products */}
      <Typography variant="h5" gutterBottom>
        Top Clicked Products
      </Typography>
      {topProducts.length === 0 ? (
        <Typography color="text.secondary">No product clicks recorded yet.</Typography>
      ) : (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {topProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card sx={{ padding: 2 }}>
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Category: {product.category}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Brand: {product.brand}
                  </Typography>
                  <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                    Clicks: {product.clickCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Top Stores */}
      <Typography variant="h5" gutterBottom>
        Top Clicked Stores
      </Typography>
      {topStores.length === 0 ? (
        <Typography color="text.secondary">No store clicks recorded yet.</Typography>
      ) : (
        <Grid container spacing={3}>
          {topStores.map((store) => (
            <Grid item xs={12} sm={6} md={4} key={store.id}>
              <Card sx={{ padding: 2 }}>
                <CardContent>
                  <Typography variant="h6">{store.storeName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Clicks: {store.clickCount}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
