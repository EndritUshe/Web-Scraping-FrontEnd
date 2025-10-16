import React from "react";
import { Box, Typography, Divider, Grid, Card, CardMedia, CardContent } from "@mui/material";

const recentProducts = [
  { name: "MacBook Air M2", image: "/images/recent/macbook.jpg" },
  { name: "Galaxy S24 Ultra", image: "/images/recent/galaxys24.jpg" },
  { name: "Sony PS5", image: "/images/recent/ps5.jpg" },
  { name: "GoPro Hero 12", image: "/images/recent/gopro.jpg" },
];

export default function RecentlyViewed() {
  return (
    <Box sx={{ px: 10, py: 6 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", color: "#1565c0", mb: 2, textTransform: "uppercase" }}
      >
        Recently Viewed
      </Typography>
      <Divider sx={{ mb: 4, borderColor: "#1565c0", borderBottomWidth: 2 }} />

      <Grid container spacing={3} justifyContent="center">
        {recentProducts.map((product, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                boxShadow: 3,
                borderRadius: 2,
                overflow: "hidden",
                transition: "transform 0.3s",
                "&:hover": { transform: "scale(1.03)" },
              }}
            >
              <CardMedia component="img" height="200" image={product.image} alt={product.name} />
              <CardContent>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", color: "#1565c0", textAlign: "center" }}
                >
                  {product.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
