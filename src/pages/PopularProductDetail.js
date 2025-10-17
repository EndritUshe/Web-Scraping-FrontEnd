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

import { addToWishlist } from "../api/wishlist";
import Navbar from "../components/Navbar";

function PopularProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const navigate = useNavigate();

  // Snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    fetch(`http://localhost:8080/api/popular-products/details/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch product details");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setMainImage(data.imgUrl || "https://via.placeholder.com/400");
      })
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

  if (!product) return <Typography sx={{ p: 3 }}>Loading product details...</Typography>;

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

      <Box sx={{ p: 4, width: "96%" }}>
        <Grid container spacing={10} alignItems="flex-start">
          {/* LEFT BOX */}
          <Grid item xs={12} md={8}>
            <Box sx={{ maxWidth: 1000 }}>
              <Card sx={{ display: "flex", justifyContent: "center", alignItems: "center", minWidth: 600, minHeight: 400, boxShadow: 2, mb: 2 }}>
                <CardMedia
                  component="img"
                  image={mainImage}
                  alt={product.title}
                  sx={{ objectFit: "contain", height: 500, width: 700 }}
                />
              </Card>

              <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap", justifyContent: "flex-start" }}>
                {allImages.map((img, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      width: 180,
                      height: 180,
                      cursor: "pointer",
                      border: mainImage === img ? "2px solid #1976d2" : "1px solid #ccc",
                      borderRadius: 1,
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                    onClick={() => setMainImage(img)}
                  >
                    <img
                      src={img}
                      alt={`thumbnail-${idx}`}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* RIGHT BOX */}
          <Grid item xs={12} md={4}>
            <Box maxWidth={600}>
              <Divider sx={{ my: 2, borderBottomWidth: 2 }} />
              <Typography variant="h4" fontWeight="bold" color="primary.main">{product.title}</Typography>

              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Rating value={4.5} precision={0.5} readOnly />
                <Typography variant="body2" sx={{ ml: 1 }} color="text.secondary">(32 reviews)</Typography>
              </Box>

              <Divider sx={{ my: 2, borderBottomWidth: 2 }} />
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>{product.description}</Typography>

              <Typography variant="h5" color="error" sx={{ mt: 3 }}>{product.newPrice.toLocaleString()} ALL</Typography>
              {product.previousPrice > 0 && (
                <Typography variant="body2" sx={{ textDecoration: "line-through", color: "gray" }}>
                  {product.previousPrice.toLocaleString()} ALL
                </Typography>
              )}

              <Divider sx={{ my: 2, borderBottomWidth: 2 }} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>{product.category}</Typography>

              <Box sx={{ mt: 2 }}>
                <Typography variant="h5" fontWeight="bold" color="primary">Shop: {product.store}</Typography>
                <Typography variant="body2" color="text.secondary">95% positive feedback • Trusted Seller</Typography>

                <Button
                  variant="contained"
                  sx={{ mt: 1, borderRadius: 2, textTransform: "none", backgroundColor: "rgba(41, 225, 48, 1)", "&:hover": { backgroundColor: "#28d231ff" }, color: "white" }}
                  endIcon={<ArrowForwardIosIcon />}
                  onClick={() => window.open(product.storeUrl, "_blank")}
                >
                  Visit Store
                </Button>
              </Box>

              <Divider sx={{ my: 2, borderBottomWidth: 2 }} />
              <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => console.log("Add to cart:", product.id)}
                >
                  Add to Cart
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<FavoriteBorderIcon />}
                  onClick={handleWishlistClick}
                >
                  Wishlist
                </Button>

                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<CompareArrowsIcon />}
                  onClick={() => console.log("Compare prices for:", product.id)}
                >
                  Compare Prices
                </Button>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbarSeverity} onClose={() => setOpenSnackbar(false)}>{snackbarMessage}</Alert>
      </Snackbar>
    </>
  );
}

export default PopularProductDetail;
