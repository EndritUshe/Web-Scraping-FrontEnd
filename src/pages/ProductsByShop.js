import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
  CircularProgress,
  LinearProgress,
  Box,
} from "@mui/material";
import Navbar from "../components/Navbar";

export default function ProductsByShop() {
  const location = useLocation();
  const navigate = useNavigate(); // Add navigate
  const { store, query } = location.state || {}; // store: "shpresa", "german", etc.

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!store) return;

    setLoading(true);
    setProgress(20);

    const fetchAllProducts = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/scrape/${store}/all?query=${encodeURIComponent(query || "")}`
        );
        const data = await res.json();
        setProducts(data);

        setProgress(100);
        setTimeout(() => setLoading(false), 300);
      } catch (err) {
        console.error("Error fetching all products:", err);
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, [store, query]);

  return (
    <div>
      <Navbar />
      <Container sx={{ marginTop: 4, minHeight: "60vh" }}>
        
        {/* Back Button */}
        <Button
          variant="outlined"
          sx={{ mb: 2 }}
          onClick={() => navigate(-1)}
        >
          ← Back
        </Button>

        <Typography variant="h4" gutterBottom>
          {store?.toUpperCase()} Products {query ? `for "${query}"` : ""}
        </Typography>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "60vh",
              textAlign: "center",
            }}
          >
            <CircularProgress size={60} thickness={4} color="primary" />
            <Typography variant="h6" sx={{ mt: 3 }}>
              Fetching products...
            </Typography>
            <Box sx={{ width: "60%", mt: 4 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 8, borderRadius: 5 }}
              />
            </Box>
          </Box>
        ) : products.length > 0 ? (
          <Grid container spacing={3}>
            {products.map((product, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <Card sx={{ display: "flex", minHeight: 180, maxWidth: 500 }}>
                  <CardMedia
                    component="img"
                    sx={{ width: "40%", objectFit: "contain", p: 1 }}
                    image={product.imgUrl}
                    alt={product.name}
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
                        {product.name}
                      </Typography>
                      <Typography variant="body1" sx={{ marginY: 1 }}>
                        Price: {product.priceEnd} Lek
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        From: {store}
                      </Typography>
                    </div>

                    <Button
                      variant="contained"
                      color="primary"
                      href={product.productUrl}
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
        ) : (
          <Typography
            variant="h6"
            color="text.secondary"
            textAlign="center"
            mt={10}
          >
            No products found {query ? `for "${query}"` : ""}.
          </Typography>
        )}

        <Divider sx={{ my: 4 }} />
      </Container>
    </div>
  );
}
