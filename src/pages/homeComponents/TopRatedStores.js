import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardMedia, Divider } from "@mui/material";
import Slider from "react-slick";

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
      await fetch(`http://localhost:8080/api/store-clicks/record/${store.id}`, { method: "POST" });
    } catch (err) {
      console.error("Error recording click:", err);
    }
    window.open(store.url, "_blank");
  };

  // Show 7 cards on large screens, adjust for smaller
  const settings = {
  dots: true,
  infinite: stores.length > 8,
  speed: 500,
  slidesToShow: 8,
  slidesToScroll: 1,
  responsive: [
    { breakpoint: 1650, settings: { slidesToShow: 7 } },
    { breakpoint: 1450, settings: { slidesToShow: 6 } },
    { breakpoint: 1250, settings: { slidesToShow: 5 } },
    { breakpoint: 1000, settings: { slidesToShow: 4 } },
    { breakpoint: 750, settings: { slidesToShow: 3 } },
    { breakpoint: 500, settings: { slidesToShow: 2 } },
    { breakpoint: 350, settings: { slidesToShow: 1 } },
  ],
};

  if (stores.length === 0)
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Typography sx={{ color: "#1565c0" }}>No stores available at the moment.</Typography>
      </Box>
    );

  return (
    <Box
      sx={{
        width: "95%",
        mx: "auto",
        my: 6,
        backgroundColor: "white",
        borderRadius: "26px",
        boxShadow: "0 26px 70px rgba(19,32,62,0.14)",
        background: "#f5f7ff",
        p: { xs: 3, md: 5 },
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", width: "100%", mb: 5 }}>
        <Divider sx={{ flex: 1, borderColor: "#07203cff", borderBottomWidth: 2.5, mr: 2.5 }} />
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#07203cff",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            letterSpacing: "0.5px",
          }}
        >
          Top Rated Stores
        </Typography>
        <Divider sx={{ flex: 1, borderColor: "#07203cff", borderBottomWidth: 2.5, ml: 2.5 }} />
      </Box>

      {/* Carousel */}
      <Slider {...settings}>
        {stores.map((store) => (
          <Box key={store.storeName} sx={{ px: 0.5 }}>
            <Card
              onClick={() => handleCardClick(store)}
              sx={{
                cursor: "pointer",
                textAlign: "center",
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                transition: "transform 0.25s, box-shadow 0.25s",
                "&:hover": { transform: "translateY(-3px)", boxShadow: "0 6px 18px rgba(0,0,0,0.15)" },
                width: "100%",
                minWidth: 140,
                maxWidth: 170,
                minHeight: 180,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                p: 1,
              }}
            >
              <CardMedia
                component="img"
                height="100"
                image={store.logoUrl}
                alt={store.displayName}
                sx={{ objectFit: "contain", p: 1 }}
              />
              <Typography sx={{ py: 1, fontWeight: 600, color: "#1565c0", fontSize: "0.95rem" }}>
                {store.displayName}
              </Typography>
            </Card>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
