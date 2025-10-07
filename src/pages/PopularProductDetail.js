import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Grid,
  Card,
  CardMedia,
  Typography,
  Box,
  Button,
  Rating,
  Divider,
  Stack
} from "@mui/material";

import PopularProductNavbar from "../components/PopularProductNavbar";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";

function PopularProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8080/api/popular-products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch product details");
        }
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setMainImage(data.imgUrl || "https://via.placeholder.com/400");
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
      });
  }, [id]);

  if (!product) {
    return (
      <Typography variant="body1" sx={{ p: 3 }}>
        Loading product details...
      </Typography>
    );
  }

  const allImages = [product.imgUrl, ...(product.images || [])];

  return (
    <>
      <PopularProductNavbar />

      <Box sx={{ p: 4, width: "96%" }}>

        <Grid container spacing={10} alignItems="flex-start">
          {/* LEFT BOX */}
          <Grid item xs={12} md={8}>
            <Box sx={{ maxWidth: 1000 }}>   {/* constrain left side width */}
              {/* Main Image */}
              <Card
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minWidth: 600,
                  minHeight: 400,
                  boxShadow: 2,
                  mb: 2, // space between main image and thumbnails
                }}
              >
                <CardMedia
                  component="img"
                  image={mainImage}
                  alt={product.title}
                  sx={{
                    objectFit: "contain",
                    height: 500,
                    width: 700,
                  }}
                />
              </Card>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,       // spacing between thumbnails
                  mt: 2,
                  flexWrap: "wrap", // thumbnails wrap to next line if needed
                  justifyContent: "flex-start",
                }}
              >
                {allImages.map((img, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      width: 180,
                      height: 180,
                      cursor: "pointer",
                      border:
                        mainImage === img ? "2px solid #1976d2" : "1px solid #ccc",
                      borderRadius: 1,
                      overflow: "hidden",
                      flexShrink: 0,
                    }}
                    onClick={() => setMainImage(img)}
                  >
                    <img
                      src={img}
                      alt={`thumbnail-${idx}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                ))}
              </Box>

            </Box>

          </Grid>



          <Grid item xs={12} md={4}>
            <Box maxWidth={600}>
              <Divider sx={{ my: 2, borderBottomWidth: 2 }} />
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {product.title}
              </Typography>

              {/* Ratings */}
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Rating value={4.5} precision={0.5} readOnly />
                <Typography variant="body2" sx={{ ml: 1 }} color="text.secondary">
                  (32 reviews)
                </Typography>


              </Box>

              <Divider sx={{ my: 2, borderBottomWidth: 2 }} />

              {/* Description */}
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                {product.description}
              </Typography>


              <Typography variant="h5" color="error" sx={{ mt: 3 }}>
                {product.newPrice.toLocaleString()} ALL
              </Typography>

              {product.previousPrice > 0 && (
                <Typography
                  variant="body2"
                  sx={{ textDecoration: "line-through", color: "gray" }}
                >
                  {product.previousPrice.toLocaleString()} ALL
                </Typography>
              )}

              <Divider sx={{ my: 2, borderBottomWidth: 2 }} />


              <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                {product.category}
              </Typography>

              {/* Store Info */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  Shop: {product.store}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  95% positive feedback • Trusted Seller
                </Typography>

                {/* Go to Store button with arrow */}
                <Button
                  variant="contained"
                  sx={{
                    mt: 1,
                    borderRadius: 2,
                    textTransform: "none",
                    backgroundColor: "rgba(41, 225, 48, 1)", // light green
                    "&:hover": {
                      backgroundColor: "#28d231ff", // slightly darker green on hover
                    },
                    color: "white", // ensure text is readable
                  }}
                  endIcon={<ArrowForwardIosIcon />}
                  onClick={() => window.open(product.storeUrl, "_blank")}
                >
                  Visit Store
                </Button>
              </Box>

              <Divider sx={{ my: 2, borderBottomWidth: 2 }} />


              <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: "wrap" }}>
                {/* Add to Cart Button */}
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => {
                    // console.log("Add to cart:", product.id);
                    // TODO: Add cart logic
                  }}
                >
                  Add to Cart
                </Button>

                {/* Wishlist Button */}
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<FavoriteBorderIcon />}
                  onClick={() => {
                    // console.log("Add to wishlist:", product.id);
                    // TODO: Wishlist logic
                  }}
                >
                  Wishlist
                </Button>

                {/* Compare Prices Button */}
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<CompareArrowsIcon />}
                  onClick={() => {
                    // console.log("Compare prices for:", product.id);
                    // TODO: Compare logic
                  }}
                >
                  Compare Prices
                </Button>
              </Stack>

            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default PopularProductDetail;
