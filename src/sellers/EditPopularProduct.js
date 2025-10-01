// src/pages/EditPopularProduct.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardMedia,
  Typography,
  Box,
  Button,
  TextField,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";

export default function EditPopularProduct({ productId, onBack }) {
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8080/api/popular-products/my-product/${productId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch product");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setMainImage(data.imgUrl || "https://via.placeholder.com/400");
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg(err.message);
        setOpen(true);
      })
      .finally(() => setLoading(false));
  }, [productId]);

  const handleClose = () => setOpen(false);

  if (!product) {
    return (
      <Typography variant="body1" sx={{ p: 3 }}>
        {loading ? "Loading product details..." : "Product not found."}
      </Typography>
    );
  }

  const allImages = [product.imgUrl, ...(product.images || [])];

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/popular-products/${product.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
          body: JSON.stringify({
            title: product.title,
            description: product.description,
            previousPrice: product.previousPrice,
            newPrice: product.newPrice,
          }),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to update product");
      }
      navigate("/seller-dashboard", { replace: true });
      window.location.reload(); 
      setSuccessMsg("Product updated successfully!");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
      setOpen(true);
    }
  };

  return (
    <Box sx={{ p: 4, width: "96%" }}>
      <Button variant="outlined" sx={{ mb: 2 }} onClick={onBack}>
        Back to Products
      </Button>

      <Grid container spacing={10} alignItems="flex-start">
        {/* LEFT BOX */}
        <Grid item xs={12} md={8}>
          <Box sx={{ maxWidth: 1000 }}>
            {/* Main Image */}
            <Card
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minWidth: 600,
                minHeight: 400,
                boxShadow: 2,
                mb: 2,
              }}
            >
              <CardMedia
                component="img"
                image={mainImage}
                alt={product.title}
                sx={{ objectFit: "contain", height: 500, width: 700 }}
              />
            </Card>

            {/* Thumbnails */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 2,
                flexWrap: "wrap",
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

        {/* RIGHT BOX */}
        <Grid item xs={12} md={4}>
          <Box maxWidth={600}>
            <Divider sx={{ my: 2, borderBottomWidth: 2 }} />

            {/* Editable fields */}
            <TextField
              label="Title"
              value={product.title}
              onChange={(e) =>
                setProduct({ ...product, title: e.target.value })
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Description"
              value={product.description}
              multiline
              rows={4}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Previous Price"
              type="number"
              value={product.previousPrice}
              onChange={(e) =>
                setProduct({ ...product, previousPrice: Number(e.target.value) })
              }
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="New Price"
              type="number"
              value={product.newPrice}
              onChange={(e) =>
                setProduct({ ...product, newPrice: Number(e.target.value) })
              }
              fullWidth
              sx={{ mb: 2 }}
            />

            {/* Read-only fields */}
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              Category: {product.category}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Store: {product.store}
            </Typography>

            <Divider sx={{ my: 2, borderBottomWidth: 2 }} />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSaveChanges}
            >
              SAVE CHANGES
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={successMsg ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {successMsg || errorMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
