import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/banners")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [res.data];
        setBanners(data);
      })
      .catch((err) => console.error("Error fetching banners:", err))
      .finally(() => setLoading(false));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1400, settings: { slidesToShow: 3 } },
      { breakpoint: 1000, settings: { slidesToShow: 2 } },
      { breakpoint: 700, settings: { slidesToShow: 1 } },
    ],
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (banners.length === 0) return null;

  return (
    <Box
      sx={{
        width: "calc(100% - 100px)",       // space from left & right
        maxWidth: "calc(100% - 100px)",    // prevent overflow
        margin: "2rem auto",
        borderRadius: "26px",
        boxShadow: "0 26px 70px rgba(19,32,62,0.14)",
        background: "#f5f7ff",
        py: 4,
        px: { xs: 2, sm: 3, md: 4 },
        overflow: "hidden",               // key to prevent horizontal scroll
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          mb: 5,
        }}
      >
        <Divider
          sx={{
            flex: 1,
            borderColor: "#07203cff",
            borderBottomWidth: 2.5,
            mr: 2.5,
          }}
        />
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
          Announcements & Promotions
        </Typography>
        <Divider
          sx={{
            flex: 1,
            borderColor: "#07203cff",
            borderBottomWidth: 2.5,
            ml: 2.5,
          }}
        />
      </Box>


      <Slider {...settings}>
        {banners.map((banner) => (
          <Box
            key={banner.id}
            sx={{
              px: 1,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Card
              sx={{
                display: "flex",
                height: 220,
                width: "100%",
                maxWidth: { xs: 300, sm: 350, md: 400 }, // responsive max widths
                overflow: "hidden",
                borderRadius: "16px",
                boxShadow: "0 18px 42px rgba(19,32,62,0.12)",
                background: "#ffffff",
              }}
            >
              <CardMedia
                component="img"
                image={banner.imgUrl}
                alt={banner.title}
                sx={{ width: "60%", height: "100%", objectFit: "cover" }}
              />
              <CardContent
                sx={{
                  width: "40%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  p: 2,
                }}
              >
                <Typography variant="h6" sx={{ wordBreak: "break-word", mb: 2, fontSize: "1rem" }}>
                  {banner.title}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CardMedia
                    component="img"
                    image={banner.storeLogo}
                    alt="store logo"
                    sx={{ width: 60, height: 60, objectFit: "contain", mr: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.9rem" }}>
                    {banner.category}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
