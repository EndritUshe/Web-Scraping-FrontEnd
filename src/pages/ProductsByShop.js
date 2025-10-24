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
import Footer from "../components/Footer";

export default function ProductsByShop() {
  const location = useLocation();
  const navigate = useNavigate();
  const { store, query } = location.state || {};

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
      <Container maxWidth={false} sx={{ marginTop: 4, minHeight: "60vh", width: "95%", mx: "auto" }}>
        
        {/* Header Box */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
            padding: "24px 28px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #2563eb 100%)",
            color: "#f5f7ff",
            boxShadow: "0 28px 64px rgba(15, 23, 42, 0.35)",
            mb: 4,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Typography variant="h5" fontWeight={700}>
              {store?.toUpperCase()} Products {products.length} found
            </Typography>
            <Typography variant="body2" color="#f8fafc">
              Browse all products from this store{query ? ` for "${query}"` : ""}.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{
              borderColor: "#f8fafc",
              color: "#f8fafc",
              alignSelf: { xs: "flex-end", sm: "auto" },
            }}
          >
            Back
          </Button>
        </Box>

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
              <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 5 }} />
            </Box>
          </Box>
        ) : products.length > 0 ? (
          <Grid container spacing={3} justifyContent="center">
            {products.map((product, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx} display="flex" justifyContent="center">
                <Card
                  sx={{
                    display: "flex",
                    minHeight: 180,
                    width: "100%",
                    maxWidth: 500,
                    transition: "transform 0.2s, box-shadow 0.2s",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #f9f9f9 0%, #ffffff 100%)",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 14px 28px rgba(0,0,0,0.18)",
                    },
                  }}
                >
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
                      <Typography variant="h6" sx={{ wordWrap: "break-word", color: "#1e3a8a", fontWeight: 700 }}>
                        {product.name}
                      </Typography>
                      <Typography variant="body1" sx={{ my: 1, fontWeight: 500 }}>
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
          <Typography variant="h6" color="text.secondary" textAlign="center" mt={10}>
            No products found {query ? `for "${query}"` : ""}.
          </Typography>
        )}

        <Divider sx={{ my: 4 }} />
      </Container>
      <Footer />
    </div>
  );
}
