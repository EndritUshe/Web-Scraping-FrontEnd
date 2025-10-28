import React, { useEffect, useState } from "react";
import {
 
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Box,
  Button,
  CardActionArea,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const PopularProductsByCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = `http://localhost:8080/api/popular-products/filter?category=${encodeURIComponent(
    category
  )}`;

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
          console.error("Error fetching products:", err);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [baseUrl, category]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #f2f6ff 0%, #e4ebff 60%, #eef2ff 100%)",
          padding: "36px 18px 60px",
        }}
      >
        <Box
          sx={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
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
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <Typography variant="h5" fontWeight={700}>
                {category} -- {products.length} products found
              </Typography>
              <Typography variant="body2" color="#f8fafc">
                Browse the popular products in this category.
              </Typography>
            </Box>
           <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ borderRadius: 2, backgroundColor: "#f8fafc", color: "#1e3a8a", "&:hover": { backgroundColor: "#e2e8f0" } }}
          >
            Back
          </Button>
          </Box>

          {/* Products Container */}
          <Box
            sx={{
              background: "#ffffff",
              borderRadius: "24px",
              border: "1px solid rgba(148, 163, 184, 0.24)",
              boxShadow: "0 26px 60px rgba(15, 23, 42, 0.18)",
              padding: 4,
            }}
          >
            {products.length === 0 ? (
              <Box textAlign="center" mt={6}>
                <Typography variant="h6" color="text.secondary">
                  No products found in "{category}".
                </Typography>
              </Box>
            ) : (
              <Grid
                container
                spacing={3}
                justifyContent="center"
              >
                {products.map((product) => (
                  <Grid item xs={12} sm={6} key={product.id} display="flex" justifyContent="center">
                    <Card
                      sx={{
                        display: "flex",
                        minHeight: 180,
                        maxWidth: 500,
                        width: "100%",
                        height: "100%",
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
                      <CardActionArea
                        sx={{ display: "flex" }}
                        onClick={() =>
                          navigate(`/popular-products/${encodeURIComponent(product.id)}`)
                        }
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
                            paddingY: 1,
                          }}
                        >
                          <div>
                            <Typography
                              variant="h6"
                              sx={{ wordWrap: "break-word", color: "#1e3a8a", fontWeight: 700 }}
                            >
                              {product.title}
                            </Typography>
                            <Typography variant="body1" sx={{ my: 1, fontWeight: 500 }}>
                              Price: {product.newPrice} Lek
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              From: {product.store}
                            </Typography>
                          </div>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default PopularProductsByCategory;
