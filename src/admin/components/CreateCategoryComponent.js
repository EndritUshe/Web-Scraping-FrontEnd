// src/admin/components/CreateCategoryComponent.js
import React, { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Card,
    CardMedia,
    IconButton,
    FormControlLabel,
    Switch,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CreateCategoryComponent({ onBack }) {
    const [name, setName] = useState("");
    const [categoryImage, setCategoryImage] = useState(null);
    const [isActive, setIsActive] = useState(true); // New state for active toggle
    const [uploading, setUploading] = useState(false);

    const token = localStorage.getItem("jwtToken");

    // Upload helper
    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("http://localhost:8080/api/categories/upload-image", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");
        const url = await res.text();
        return url;
    };

    const handleSubmit = async () => {
        if (!name) {
            alert("Please enter a category name");
            return;
        }

        if (!categoryImage) {
            alert("Please select a category image");
            return;
        }

        setUploading(true);

        try {
            const imgUrl = await uploadFile(categoryImage);

            const payload = {
                name,
                imgUrl,
                active: isActive, // use "active" to match backend field
            };

            console.log("Payload being sent:", payload); // <-- debug log

            const res = await fetch("http://localhost:8080/api/categories/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Category creation failed");

            const createdCategory = await res.json();
            console.log("Created category:", createdCategory); // <-- log the returned object

            alert("Category created successfully!");
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
                Create New Category
            </Typography>

            <TextField
                label="Category Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
            />

            {/* Active toggle */}
            <FormControlLabel
                control={
                    <Switch
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        color="primary"
                    />
                }
                label="Active"
                sx={{ mb: 2 }}
            />

            {/* Category Image */}
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Category Image</Typography>
                <Button
                    variant="contained"
                    component="label"
                    startIcon={<AddPhotoAlternateIcon />}
                >
                    Upload Image
                    <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => setCategoryImage(e.target.files[0])}
                    />
                </Button>
                {categoryImage && (
                    <Card sx={{ mt: 1, width: 200, height: 140, position: "relative" }}>
                        <CardMedia
                            component="img"
                            image={URL.createObjectURL(categoryImage)}
                            alt="category"
                            sx={{ objectFit: "cover", width: "100%", height: "100%" }}
                        />
                        <IconButton
                            size="small"
                            sx={{ position: "absolute", top: 0, right: 0 }}
                            onClick={() => setCategoryImage(null)}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Card>
                )}
            </Box>

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                <Button variant="contained" onClick={handleSubmit} disabled={uploading}>
                    {uploading ? "Uploading..." : "Create Category"}
                </Button>
                <Button variant="outlined" onClick={onBack}>
                    Cancel
                </Button>
            </Box>
        </Box>
    );
}
