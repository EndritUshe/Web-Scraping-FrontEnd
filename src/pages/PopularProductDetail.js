import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardMedia,
  Typography,
  Box,
  Button,
  Rating,
  Divider,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { addToWishlist } from "../api/wishlist";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function PopularProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const navigate = useNavigate();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    fetch(`http://localhost:8080/api/popular-products/details/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setMainImage(data.imgUrl);
      })
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

  if (!product)
    return (
      <Typography sx={{ p: 3, textAlign: "center" }}>
        Loading product details...
      </Typography>
    );

  const allImages = [product.imgUrl, ...(product.images || [])];

  const handleWishlistClick = async () => {
    const userRole = localStorage.getItem("userRole");
    const token = localStorage.getItem("jwtToken");

    if (!token || userRole !== "ROLE_BUYER") {
      navigate("/login");
      return;
    }

    try {
      await addToWishlist(product.id);
      setSnackbarMessage("Added to wishlist!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    } catch (err) {
      setSnackbarMessage(err.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <>
      <Navbar />

      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #f2f6ff 0%, #e4ebff 60%, #eef2ff 100%)",
          padding: "48px 16px",
        }}
      >
        {/* ✅ Title + Back Button Box */}
        <Box
          sx={{
            maxWidth: "95%",
            margin: "0 auto",
            mb: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #2563eb 100%)",
            color: "#f8fafc",
            padding: "24px 30px",
            borderRadius: "22px",
            boxShadow: "0 28px 64px rgba(15, 23, 42, 0.30)",
          }}
        >
          <Typography variant="h5" fontWeight="700">
            {product.title}
          </Typography>

          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ borderRadius: 2, backgroundColor: "#f8fafc", color: "#1e3a8a", "&:hover": { backgroundColor: "#e2e8f0" } }}
          >
            Back
          </Button>
        </Box>

        <Box
          sx={{
            maxWidth: "95%",
            margin: "0 auto",
            background: "#fff",
            borderRadius: "24px",
            padding: "36px",
            boxShadow: "0 24px 50px rgba(0,0,0,0.12)",
          }}
        >
          <Grid container spacing={6}>
            {/* LEFT - Image Display */}
            <Grid item xs={12} md={7}>
              <Card
                sx={{
                  width: 800,      // fixed width
                  height: 600,     // fixed height
                  borderRadius: "16px",
                  overflow: "hidden", // crop image edges
                  boxShadow: 3,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CardMedia
                  component="img"
                  image={mainImage}
                  alt={product.title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",

                  }}
                />
              </Card>

              {/* Thumbnails */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 3,
                  flexWrap: "wrap",
                  justifyContent: "center",

                }}
              >
                {allImages.map((img, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      width: 100,
                      height: 100,
                      cursor: "pointer",
                      borderRadius: "12px",
                      border:
                        mainImage === img
                          ? "3px solid #2563eb"
                          : "1px solid #cbd5e1",
                      overflow: "hidden",
                    }}
                    onClick={() => setMainImage(img)}
                  >
                    <img
                      src={img}
                      alt={`thumbnail-${idx}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block", // crop for thumbnails too
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* RIGHT - Product Details */}
            <Grid item xs={12} md={5}>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Rating value={4.5} precision={0.5} readOnly />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  (32 reviews)
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="body1" color="text.secondary">
                {product.description}
              </Typography>

              <Typography
                variant="h5"
                fontWeight="bold"
                color="error"
                sx={{ mt: 3 }}
              >
                {product.newPrice.toLocaleString()} ALL
              </Typography>

              {product.previousPrice > 0 && (
                <Typography
                  variant="body2"
                  sx={{ textDecoration: "line-through", color: "gray", mt: 1 }}
                >
                  {product.previousPrice.toLocaleString()} ALL
                </Typography>
              )}

              <Divider sx={{ my: 3 }} />

              <Typography variant="body2" color="text.secondary">
                Category: {product.category}
              </Typography>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" fontWeight="bold" color="#1e3a8a">
                  Store: {product.store}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ✅ Trusted Seller • Fast Delivery
                </Typography>

                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    borderRadius: "12px",
                    fontWeight: 600,
                    backgroundColor: "#2563eb",
                    "&:hover": { backgroundColor: "#1e3a8a" },
                  }}
                  endIcon={<ArrowForwardIosIcon />}
                  onClick={() => window.open(product.storeUrl, "_blank")}
                >
                  Visit Store
                </Button>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Stack direction="row" spacing={2} sx={{ mt: 3, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ShoppingCartIcon />}
                >
                  Add to Cart
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<FavoriteBorderIcon />}
                  onClick={handleWishlistClick}
                >
                  Wishlist
                </Button>

                <Button variant="outlined" startIcon={<CompareArrowsIcon />}>
                  Compare
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbarSeverity} onClose={() => setOpenSnackbar(false)}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Footer />
    </>
  );
}

export default PopularProductDetail;
