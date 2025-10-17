import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardMedia,
  IconButton,

  MenuItem,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CreateBannerComponent({ onBack }) {
  const [title, setTitle] = useState("");
  const [storeUrl, setStoreUrl] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [bannerImage, setBannerImage] = useState(null);
  const [storeLogo, setStoreLogo] = useState(null);
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem("jwtToken");

  // ✅ Fetch categories from backend (same as CreateProductComponent)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/categories/all");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
        if (data.length > 0) setCategoryId(data[0].id); // default select first category
      } catch (err) {
        console.error(err);
        alert("Could not load categories");
      }
    };
    fetchCategories();
  }, []);

  // ✅ Upload helper
  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8080/api/banners/upload-image", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");
    return await res.text(); // backend returns plain URL
  };

  // ✅ Submit banner
  const handleSubmit = async () => {
    if (!bannerImage) {
      alert("Please select a banner image");
      return;
    }
    if (!storeLogo) {
      alert("Please select a store logo");
      return;
    }

    setUploading(true);
    try {
      const bannerUrl = await uploadFile(bannerImage);
      const logoUrl = await uploadFile(storeLogo);

      const payload = {
        title,
        imgUrl: bannerUrl,
        storeUrl,
        categoryId, // ✅ use category ID
        storeLogo: logoUrl,
      };

      const res = await fetch("http://localhost:8080/api/banners/create-banner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Banner creation failed");

      alert("Banner created successfully!");
      if (onBack) onBack();
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Add New Banner
      </Typography>

      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Store URL"
        value={storeUrl}
        onChange={(e) => setStoreUrl(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      {/* ✅ Category dropdown */}
      <TextField
        select
        label="Category"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      >
        {categories.map((cat) => (
          <MenuItem key={cat.id} value={cat.id}>
            {cat.name}
          </MenuItem>
        ))}
      </TextField>

      {/* Banner Image */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Banner Image</Typography>
        <Button
          variant="contained"
          component="label"
          startIcon={<AddPhotoAlternateIcon />}
        >
          Upload Banner
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setBannerImage(e.target.files[0])}
          />
        </Button>
        {bannerImage && (
          <Card sx={{ mt: 1, width: 200, height: 120, position: "relative" }}>
            <CardMedia
              component="img"
              image={URL.createObjectURL(bannerImage)}
              alt="banner"
              sx={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
            <IconButton
              size="small"
              sx={{ position: "absolute", top: 0, right: 0 }}
              onClick={() => setBannerImage(null)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Card>
        )}
      </Box>

      {/* Store Logo */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1">Store Logo</Typography>
        <Button
          variant="contained"
          component="label"
          startIcon={<AddPhotoAlternateIcon />}
        >
          Upload Logo
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setStoreLogo(e.target.files[0])}
          />
        </Button>
        {storeLogo && (
          <Card sx={{ mt: 1, width: 100, height: 100, position: "relative" }}>
            <CardMedia
              component="img"
              image={URL.createObjectURL(storeLogo)}
              alt="store-logo"
              sx={{ objectFit: "contain", width: "100%", height: "100%" }}
            />
            <IconButton
              size="small"
              sx={{ position: "absolute", top: 0, right: 0 }}
              onClick={() => setStoreLogo(null)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Card>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button variant="contained" onClick={handleSubmit} disabled={uploading}>
          {uploading ? "Uploading..." : "Create Banner"}
        </Button>
        <Button variant="outlined" onClick={onBack}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
