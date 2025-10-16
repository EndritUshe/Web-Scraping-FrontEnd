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
import CreateStoreComponent from "../components/CreateStoreComponent";

// Import your StoreName enum mapping
import { StoreName } from "../constants/StoreName";

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);

  const token = localStorage.getItem("jwtToken");

  // Fetch all stores
  const fetchStores = useCallback(() => {
    fetch("http://localhost:8080/api/stores/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setStores(data))
      .catch(console.error);
  }, [token]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleOpenCreate = () => setOpenCreate(true);
  const handleCloseCreate = () => {
    setOpenCreate(false);
    fetchStores(); // Refresh after creating a store
  };

  // Delete store
  const handleDeleteStore = async (id) => {
    if (!window.confirm("Are you sure you want to delete this store?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/stores/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to delete store");

      alert("Store deleted successfully!");
      fetchStores();
    } catch (err) {
      console.error(err);
      alert("Error: " + err.message);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4">Stores</Typography>
        <Button
          variant="contained"
          color="error"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Create Store
        </Button>
      </Box>

      <Grid container spacing={2}>
        {stores.map((store) => {
          const storeInfo = StoreName[store.storeName];

          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={store.id}>
              <Card sx={{ position: "relative" }}>
                {store.logoUrl && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={store.logoUrl}
                    alt={storeInfo?.displayName || store.storeName}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">
                    {storeInfo?.displayName || store.storeName}
                  </Typography>
                  <Typography variant="body2">
                    {store.active ? "Active" : "Inactive"}
                  </Typography>
                </CardContent>

                {/* Delete button */}
                <IconButton
                  size="small"
                  sx={{ position: "absolute", top: 5, right: 5 }}
                  onClick={() => handleDeleteStore(store.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Create store modal */}
      <Dialog open={openCreate} onClose={handleCloseCreate} maxWidth="sm" fullWidth>
        <CreateStoreComponent onBack={handleCloseCreate} />
      </Dialog>
    </Box>
  );
}
