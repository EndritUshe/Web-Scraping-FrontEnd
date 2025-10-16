// src/admin/components/CreateStoreComponent.js
import React, { useState } from "react";
import {
    Box,
    Button,
    Typography,
    Card,
    CardMedia,
    IconButton,
    FormControlLabel,
    Switch,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";

// Import your StoreName enum
import { StoreName } from "../constants/StoreName";

export default function CreateStoreComponent({ onBack }) {
    const [storeOption, setStoreOption] = useState("");
    const [storeLogo, setStoreLogo] = useState(null);
    const [isActive, setIsActive] = useState(true);
    const [uploading, setUploading] = useState(false);

    const token = localStorage.getItem("jwtToken");

    // Upload helper
    const uploadFile = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("http://localhost:8080/api/stores/upload-logo", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!res.ok) throw new Error("Upload failed");
        const url = await res.text(); // backend returns plain text URL
        return url;
    };

    const handleSubmit = async () => {
        if (!storeOption) {
            alert("Please select a store");
            return;
        }

        if (!storeLogo) {
            alert("Please select a store logo");
            return;
        }

        setUploading(true);

        try {
            const logoUrl = await uploadFile(storeLogo);

            const payload = {
                storeName: storeOption,
                logoUrl,       // store logo URL
                isActive: isActive, // <-- make sure the property name matches the entity exactly
            };

            const res = await fetch("http://localhost:8080/api/stores/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Store creation failed");

            alert("Store created successfully!");
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
                Create New Store
            </Typography>

            {/* Store selection */}
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Store</InputLabel>
                <Select
                    value={storeOption}
                    label="Store"
                    onChange={(e) => setStoreOption(e.target.value)}
                >
                    {Object.values(StoreName).map((store) => (
                        <MenuItem key={store.name} value={store.name}>
                            {store.displayName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

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
                    <Card sx={{ mt: 1, width: 200, height: 140, position: "relative" }}>
                        <CardMedia
                            component="img"
                            image={URL.createObjectURL(storeLogo)}
                            alt="store logo"
                            sx={{ objectFit: "cover", width: "100%", height: "100%" }}
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

            {/* Buttons */}
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                <Button variant="contained" onClick={handleSubmit} disabled={uploading}>
                    {uploading ? "Uploading..." : "Create Store"}
                </Button>
                <Button variant="outlined" onClick={onBack}>
                    Cancel
                </Button>
            </Box>
        </Box>
    );
}
