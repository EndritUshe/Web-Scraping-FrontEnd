import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Card, CardContent, CardMedia, Typography, Box, Divider } from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import axios from "axios";

export default function Banners() {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/banners")
      .then((res) => setBanners(res.data))
      .catch((err) => console.error(err));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 2 } },
      { breakpoint: 900, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <Box sx={{ width: "90%", margin: "2rem auto" }}>
      {/* Title with divider */}
      <Box sx={{ display: 'flex', alignItems: 'center', margin: '2rem 2rem 0 12rem' }}>
        <ArrowRightIcon sx={{ color: 'primary.main', mr: 2, fontSize: 30 }} />
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', color: 'primary.main', textTransform: 'uppercase' }}
        >
          Banners
        </Typography>
      </Box>
      <Divider sx={{ margin: '0 12rem 1.5rem 12rem', borderColor: 'primary.main', borderBottomWidth: 2 }} />

      {/* Carousel */}
  <Slider {...settings}>
  {banners.map((banner) => (
    <Box key={banner.id} sx={{ px: 1 }}> {/* 👈 wrapper box for spacing/size */}
      <Card
        sx={{
          display: "flex",
          flexDirection: "row", // 👈 landscape layout
          minHeight: 150,
          maxWidth: 800,
          height: "100%",
          width: "100%",
        }}
      >
        {/* Left half: image */}
        <CardMedia
          component="img"
          image={banner.imgUrl}
          alt={banner.title}
          sx={{ width: "40%", objectFit: "cover", p: 1 }}
        />

        {/* Right half: details */}
        <CardContent
          sx={{
            width: "60%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center", // centers vertically
          }}
        >
          <Typography variant="h6" sx={{ wordWrap: "break-word", mb: 2 }}>
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
