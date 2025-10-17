// src/sellers/CreateProductComponent.js
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Grid,
  Card,
  CardMedia,
  IconButton,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";

// Store options (adjust if needed)
const STORE_OPTIONS = [
  { value: "FEJZO", label: "3vFejzo" },
  { value: "GERMAN_COMPUTERS", label: "German Computers" },
  { value: "GO_TECH", label: "Go Tech" },
  { value: "SHPRESA_AL", label: "Shpresa Al" },
];

export default function CreateProductComponent({ onBack }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [previousPrice, setPreviousPrice] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [store, setStore] = useState(STORE_OPTIONS[0].value);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem("jwtToken");

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/categories/all"); // endpoint returning array of {id, name}
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
        if (data.length > 0) setCategory(data[0].name); // default
      } catch (err) {
        console.error(err);
        alert("Could not load categories");
      }
    };
    fetchCategories();
  }, []);

  // Upload a single file and return URL
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8080/api/popular-products/upload-image", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");
    return await res.text();
  };

  const handleSubmit = async () => {
    if (!thumbnail) {
      alert("Please select a thumbnail image");
      return;
    }

    setUploading(true);

    try {
      // Upload thumbnail
      const thumbnailUrl = await uploadFile(thumbnail);

      // Upload additional images
      const uploadedImages = [];
      for (let file of images) {
        const url = await uploadFile(file);
        uploadedImages.push(url);
      }

      // Create product payload
      const payload = {
        title,
        description,
        previousPrice: parseFloat(previousPrice),
        newPrice: parseFloat(newPrice),
        store,
        category, // selected from backend categories
        imgUrl: thumbnailUrl,
        images: uploadedImages,
      };

      const res = await fetch("http://localhost:8080/api/popular-products/create-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Product creation failed");

      alert("Product created successfully!");
      if (onBack) onBack(); // go back
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Add New Product
      </Typography>

      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Description"
        value={description}
        multiline
        rows={4}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Previous Price"
        type="number"
        value={previousPrice}
        onChange={(e) => setPreviousPrice(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="New Price"
        type="number"
        value={newPrice}
        onChange={(e) => setNewPrice(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        select
        label="Store"
        value={store}
        onChange={(e) => setStore(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      >
        {STORE_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      >
        {categories.map((cat) => (
          <MenuItem key={cat.id} value={cat.name}>
            {cat.name}
          </MenuItem>
        ))}
      </TextField>

      {/* Thumbnail */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Thumbnail Image</Typography>
        <Button
          variant="contained"
          component="label"
          startIcon={<AddPhotoAlternateIcon />}
        >
          Upload Thumbnail
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
          />
        </Button>
        {thumbnail && (
          <Card sx={{ mt: 1, width: 120, height: 120 }}>
            <CardMedia
              component="img"
              image={URL.createObjectURL(thumbnail)}
              alt="thumbnail"
              sx={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </Card>
        )}
      </Box>

      {/* Additional Images */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Additional Images</Typography>
        <Button
          variant="contained"
          component="label"
          startIcon={<AddPhotoAlternateIcon />}
        >
          Upload Images
          <input
            type="file"
            hidden
            accept="image/*"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files))}
          />
        </Button>
        <Grid container spacing={1} sx={{ mt: 1 }}>
          {images.map((file, idx) => (
            <Grid item key={idx}>
              <Card sx={{ width: 80, height: 80, position: "relative" }}>
                <CardMedia
                  component="img"
                  image={URL.createObjectURL(file)}
                  alt={`image-${idx}`}
                  sx={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
                <IconButton
                  size="small"
                  sx={{ position: "absolute", top: 0, right: 0 }}
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button variant="contained" onClick={handleSubmit} disabled={uploading}>
          {uploading ? "Uploading..." : "Create Product"}
        </Button>
        <Button variant="outlined" onClick={onBack}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
