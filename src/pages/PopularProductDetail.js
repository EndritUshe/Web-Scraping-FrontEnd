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
  Paper,
  Modal,
} from "@mui/material";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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

  const [openModal, setOpenModal] = useState(false);

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

      <Box sx={{ minHeight: "100vh", background: "linear-gradient(160deg, #e9efff 0%, #dbe4ff 100%)", padding: "48px 16px" }}>

        {/* ✅ Top Bar */}
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
          <Typography variant="h5" fontWeight="900">
            Product Details
          </Typography>

          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              borderRadius: 2, backgroundColor: "#f8fafc", color: "#1e3a8a",
              "&:hover": { backgroundColor: "#e2e8f0" }
            }}
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
            {/* ✅ LEFT IMAGE */}
            <Grid item xs={12} md={7}>
              <Card
                sx={{
                  width: "100%",
                  height: 600,
                  minWidth: 450,
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: 3,
                }}
              >
                <CardMedia
                  component="img"
                  image={mainImage}
                  alt={product.title}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Card>

              {/* ✅ Thumbnails */}
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
                      border: mainImage === img ? "3px solid #2563eb" : "1px solid #cbd5e1",
                      overflow: "hidden",
                    }}
                    onClick={() => setMainImage(img)}
                  >
                    <img
                      src={img}
                      alt={`thumb-${idx}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* ✅ RIGHT — CARD CONTENT */}
            <Grid item xs={12} md={5}>
              <Paper
                elevation={5}
                sx={{
                  p: 4,
                  borderRadius: "20px",
                  minWidth: 500,
                  background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
                  border: "1px solid #e2e8f0",
                }}
              >
                {/* ✅ Big title — Product Name */}
                <Typography variant="h4" fontWeight="900" sx={{ color: "#0f172a", mb: 2 }}>
                  {product.title || product.description}
                </Typography>

                {/* ✅ Category + Store */}
                <Typography fontWeight="700" sx={{ color: "#0f172a" }}>
                  Category: {product.category}
                </Typography>
               

                <Typography fontWeight="700" sx={{ color: "#0f172a" }}>
                  Store: {product.store}
                </Typography>
            
                {/* ✅ Price */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h4" fontWeight="800" color="error">
                    {product.newPrice.toLocaleString()} ALL
                  </Typography>

                  {product.previousPrice > 0 && (
                    <Typography sx={{ textDecoration: "line-through", color: "#94a3b8", mt: 1 }}>
                      {product.previousPrice.toLocaleString()} ALL
                    </Typography>
                  )}
                </Box>

                {/* ✅ Reviews Below Price */}
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                  <Rating value={4.5} precision={0.5} readOnly />
                  <Typography variant="body2">(32 Reviews)</Typography>
                </Stack>

                {/* ✅ Trusted Store Badge */}
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <CheckCircleIcon sx={{ color: "#0088ff", fontSize: 20, mr: 1 }} />
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Trusted Store
                  </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* ✅ Buttons — Add to Cart + Wishlist */}
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => setOpenModal(true)}
                    sx={{
                      flex: 1,
                      borderRadius: "14px",
                      py: 1.2,
                      bgcolor: "#2563eb",
                      "&:hover": { bgcolor: "#1e3a8a" },
                    }}
                  >
                    Add to Cart
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<FavoriteBorderIcon />}
                    onClick={handleWishlistClick}
                    sx={{ flex: 1, borderRadius: "14px", py: 1.2 }}
                  >
                    Wishlist
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* ✅ Modal - Coming Soon Feature */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 380,
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            textAlign: "center",
            p: 4,
            boxShadow: "0px 20px 50px rgba(0,0,0,0.2)",
          }}
        >
          <Typography variant="h5" fontWeight="700" sx={{ color: "#0f172a", mb: 2 }}>
            🚧 Coming Soon!
          </Typography>

          <Typography sx={{ color: "#475569", mb: 4 }}>
            This feature is under development.<br />
            Stay tuned for future updates!
          </Typography>

          <Button
            variant="contained"
            fullWidth
            onClick={() => setOpenModal(false)}
            sx={{
              borderRadius: "12px",
              bgcolor: "#2563eb",
              "&:hover": { bgcolor: "#1e3a8a" },
              py: 1.3,
            }}
          >
            OK
          </Button>
        </Box>
      </Modal>

      {/* ✅ Snackbar */}
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
