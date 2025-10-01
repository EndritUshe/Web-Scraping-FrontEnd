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
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import axios from "axios";

export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/banners")
      .then((res) => {
        console.log("API Response:", res.data);
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
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 2 } },
      { breakpoint: 900, settings: { slidesToShow: 1 } },
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
    <Box sx={{ width: "80%", margin: "2rem auto" }}>
      {/* Title */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <ArrowRightIcon sx={{ color: "primary.main", mr: 2, fontSize: 30 }} />
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "primary.main", textTransform: "uppercase" }}
        >
          Banners
        </Typography>
      </Box>
      <Divider sx={{ width: "100%", mb: 3, borderColor: "primary.main", borderBottomWidth: 2 }} />

      {/* Carousel */}
      <Slider {...settings}>
        {banners.map((banner) => (
          <Box key={banner.id} sx={{ px: 1 }}>
            <Card
              sx={{
                display: "flex",
                height: 200,        // fixed height
                width: "100%",      // dynamic width
                maxWidth: 800,
                overflow: "hidden",
                borderRadius: 2,
              }}
            >
              {/* Left: Image 60% */}
              <CardMedia
                component="img"
                image={banner.imgUrl}
                alt={banner.title}
                sx={{ width: "60%", height: "100%", objectFit: "cover" }}
              />

              {/* Right: Content 40% */}
              <CardContent
                sx={{
                  width: "40%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  p: 2,
                }}
              >
                <Typography variant="h6" sx={{ wordBreak: "break-word", mb: 2 }}>
                  {banner.title}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CardMedia
                    component="img"
                    image={banner.storeLogo}
                    alt="store logo"
                    sx={{ width: 50, height: 50, objectFit: "contain", mr: 2 }}
                  />
                  <Typography variant="body2" color="text.secondary">
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
