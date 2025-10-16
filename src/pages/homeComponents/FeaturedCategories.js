import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardMedia, Divider } from "@mui/material";

export default function FeaturedCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/categories/active");

        if (!res.ok) throw new Error("Failed to fetch categories");

        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Box sx={{ px: 10, py: 6 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", color: "#1565c0", mb: 2, textTransform: "uppercase" }}
      >
        Featured Categories
      </Typography>
      <Divider sx={{ mb: 4, borderColor: "#1565c0", borderBottomWidth: 2 }} />

      <Grid container spacing={3} justifyContent="center">
        {categories.map((cat) => (
          <Grid item xs={6} sm={4} md={2} key={cat.id}>
            <Card
              sx={{
                textAlign: "center",
                boxShadow: 3,
                borderRadius: 2,
                transition: "transform 0.3s",
                minWidth: 200,   // minimum width
                minHeight: 240,  // minimum height
                "&:hover": { transform: "scale(1.05)" },
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={cat.imgUrl} 
                alt={cat.name}
              />
              <Typography sx={{ py: 1.5, fontWeight: 600, color: "#1565c0" }}>
                {cat.name}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
