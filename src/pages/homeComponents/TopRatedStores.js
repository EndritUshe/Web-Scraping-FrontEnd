import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardMedia, Divider } from "@mui/material";

export default function TopRatedStores() {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/stores/active");
        if (!res.ok) throw new Error("Failed to fetch stores");

        const data = await res.json();
        setStores(data);
      } catch (err) {
        console.error("Error fetching stores:", err);
      }
    };

    fetchStores();
  }, []);

  const handleCardClick = async (store) => {
    try {
      await fetch(`http://localhost:8080/api/store-clicks/record/${store.id}`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Error recording click:", err);
    }

    window.open(store.url, "_blank");
  };

  return (
    <Box sx={{ px: 10, py: 6 }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          color: "#1565c0",
          mb: 2,
          textTransform: "uppercase",
        }}
      >
        Top Rated Stores
      </Typography>
      <Divider sx={{ mb: 4, borderColor: "#1565c0", borderBottomWidth: 2 }} />

      <Grid container spacing={3} justifyContent="center">
        {stores.map((store) => (
          <Grid item xs={6} sm={4} md={2} key={store.storeName}>
            <Card
              sx={{
                textAlign: "center",
                boxShadow: 3,
                borderRadius: 2,
                transition: "transform 0.3s",
                minWidth: 200,
                minHeight: 240,
                "&:hover": { transform: "scale(1.05)", cursor: "pointer" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
              // 🔹 Pass entire store object so we can send storeName and open store URL
              onClick={() => handleCardClick(store)}
            >
              <CardMedia
                component="img"
                height="180"
                image={store.logoUrl}
                alt={store.displayName}
                sx={{ objectFit: "contain", p: 1 }}
              />
              <Typography sx={{ py: 1.5, fontWeight: 600, color: "#1565c0" }}>
                {store.displayName}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
