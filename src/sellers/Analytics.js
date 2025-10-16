import React, { useEffect, useState } from "react";
import { Typography, Grid, Card, CardContent, Box, CircularProgress } from "@mui/material";

export default function Analytics() {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem("jwtToken"); // JWT stored on login

    const fetchTopProducts = async () => {
      try {
        const res = await fetch(
          "http://localhost:8080/api/product-clicks/top-products?limit=5",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // pass JWT for ROLE_SELLER access
            },
            signal: controller.signal,
          }
        );

        if (!res.ok) throw new Error("Failed to fetch top products");

        const data = await res.json();
        setTopProducts(data);
        setLoading(false);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching top products:", err);
          setLoading(false);
        }
      }
    };

    fetchTopProducts();

    return () => controller.abort(); // cleanup on unmount
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (topProducts.length === 0) {
    return (
      <Box textAlign="center" mt={6}>
        <Typography variant="h6" color="text.secondary">
          No product clicks recorded yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        Top Clicked Products
      </Typography>

      <Grid container spacing={3}>
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
    </Box>
  );
}
