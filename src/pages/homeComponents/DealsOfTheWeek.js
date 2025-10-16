import React from "react";
import { Box, Typography, Divider, Grid, Card, CardMedia, CardContent } from "@mui/material";

const deals = [
  { title: "iPhone 15 Pro", discount: "-15%", image: "/images/deals/iphone15.jpg" },
  { title: "Samsung QLED TV", discount: "-20%", image: "/images/deals/samsungtv.jpg" },
  { title: "Dell XPS 13", discount: "-10%", image: "/images/deals/dellxps.jpg" },
  { title: "Sony WH-1000XM5", discount: "-25%", image: "/images/deals/sonyheadphones.jpg" },
];

export default function DealsOfTheWeek() {
  return (
    <Box sx={{ px: 10, py: 6 }}>
      <Typography
        variant="h5"
        sx={{ fontWeight: "bold", color: "#1565c0", mb: 2, textTransform: "uppercase" }}
      >
        Deals of the Week
      </Typography>
      <Divider sx={{ mb: 4, borderColor: "#1565c0", borderBottomWidth: 2 }} />

      <Grid container spacing={3} justifyContent="center">
        {deals.map((deal, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <CardMedia component="img" height="200" image={deal.image} alt={deal.title} />
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  backgroundColor: "#1565c0",
                  color: "white",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  fontWeight: "bold",
                }}
              >
                {deal.discount}
              </Box>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#1565c0" }}>
                  {deal.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
