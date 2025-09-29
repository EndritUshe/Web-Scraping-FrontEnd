import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Snackbar,
  Alert
} from "@mui/material";

// Stores list (match your StoreName enum)
const STORES = [
  { name: "FEJZO", displayName: "3vFejzo", url: "https://3vfejzo.al" },
  { name: "GERMAN_COMPUTERS", displayName: "German Computers", url: "https://germancomputers.al" },
  // { name: "GO_TECH", displayName: "Go Tech", url: "https://gotech.al" },
  // { name: "SHPRESA_AL", displayName: "Shpresa Al", url: "https://shpresaal.al" }
];

export default function MyProducts() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prevPrice, setPrevPrice] = useState(0);
  const [newPrice, setNewPrice] = useState(0);
  const [store, setStore] = useState(STORES[0].name);
  const [category, setCategory] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [images, setImages] = useState([""]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("jwtToken");

      const dto = {
        id: null,
        title,
        description,
        previousPrice: prevPrice,
        newPrice: newPrice,
        store, // enum string
        storeUrl: STORES.find(s => s.name === store)?.url,
        category,
        imgUrl,
        images,
        storeId: null // backend will set seller id
      };

      const res = await fetch("http://localhost:8080/api/popular-products/create-product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dto)
      });

      if (!res.ok) throw new Error("Failed to create product");

      setMessage("Product created successfully!");
      setSeverity("success");
      setOpen(true);

      // reset form
      setTitle("");
      setDescription("");
      setPrevPrice(0);
      setNewPrice(0);
      setCategory("");
      setImgUrl("");
      setImages([""]);
    } catch (err) {
      setMessage(err.message);
      setSeverity("error");
      setOpen(true);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>My Products Section</Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <TextField
          label="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          multiline
          rows={3}
          required
        />
        <TextField
          type="number"
          label="Previous Price"
          value={prevPrice}
          onChange={e => setPrevPrice(Number(e.target.value))}
          required
        />
        <TextField
          type="number"
          label="New Price"
          value={newPrice}
          onChange={e => setNewPrice(Number(e.target.value))}
          required
        />
        <TextField
          select
          label="Store"
          value={store}
          onChange={e => setStore(e.target.value)}
        >
          {STORES.map(s => (
            <MenuItem key={s.name} value={s.name}>{s.displayName}</MenuItem>
          ))}
        </TextField>
        <TextField
          label="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
        />
        <TextField
          label="Main Image URL"
          value={imgUrl}
          onChange={e => setImgUrl(e.target.value)}
          required
        />
        <TextField
          label="Additional Images (comma-separated)"
          value={images.join(",")}
          onChange={e => setImages(e.target.value.split(","))}
        />
        <Button type="submit" variant="contained" sx={{ mt: 1 }}>Create Product</Button>
      </Box>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
      >
        <Alert severity={severity} onClose={() => setOpen(false)}>{message}</Alert>
      </Snackbar>
    </Box>
  );
}
