// src/admin/pages/Categories.js
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateCategoryComponent from "../components/CreateCategoryComponent";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);

  const token = localStorage.getItem("jwtToken");

  // Fetch categories from backend
  const fetchCategories = useCallback(() => {
    fetch("http://localhost:8080/api/categories/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(console.error);
  }, [token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Open/close create modal
  const handleOpenCreate = () => setOpenCreate(true);
  const handleCloseCreate = () => {
    setOpenCreate(false);
    fetchCategories(); // refresh categories after creating
  };

  // Delete category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete category");

      alert("Category deleted successfully!");
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Categories</Typography>
        <Button
          variant="contained"
          color="error"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Create Featured Category
        </Button>
      </Box>

      {/* Categories Grid */}
      <Grid container spacing={2}>
        {categories.map((cat) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={cat.id}>
            <Card sx={{ position: "relative" }}>
              {cat.imgUrl && (
                <CardMedia
                  component="img"
                  height="140"
                  image={cat.imgUrl}
                  alt={cat.name}
                />
              )}
              <CardContent>
                <Typography variant="h6">{cat.name}</Typography>
                <Typography variant="body2">
                  {cat.active ? "Active" : "Inactive"}
                </Typography>
              </CardContent>

              {/* Delete button */}
              <IconButton
                size="small"
                sx={{ position: "absolute", top: 5, right: 5 }}
                onClick={() => handleDeleteCategory(cat.id)}
              >
                <DeleteIcon />
              </IconButton>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Modal for creating category */}
      <Dialog open={openCreate} onClose={handleCloseCreate} maxWidth="sm" fullWidth>
        <CreateCategoryComponent onBack={handleCloseCreate} />
      </Dialog>
    </Box>
  );
}
