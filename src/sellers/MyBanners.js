import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function MyBanners({ onAddBanner }) {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBanners = () => {
    const controller = new AbortController();
    const token = localStorage.getItem("jwtToken");

    fetch("http://localhost:8080/api/banners/my-banners", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch banners");
        return res.json();
      })
      .then((data) => {
        setBanners(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error(err);
          setLoading(false);
        }
      });

    return () => controller.abort();
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDeleteBanner = (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;

    const token = localStorage.getItem("jwtToken");

    fetch(`http://localhost:8080/api/banners/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete banner");
        fetchBanners();
      })
      .catch((err) => console.error(err));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (banners.length === 0) {
    return (
      <Box textAlign="center" mt={6}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          You have not created any banners yet.
        </Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={onAddBanner}
        >
          Add Banner
        </Button>
      </Box>
    );
  }

  return (
    <Container sx={{ marginTop: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">You have {banners.length} banners</Typography>
        <Button
          variant="contained"
          color="success"
          startIcon={<AddIcon />}
          onClick={onAddBanner}
        >
          Add Banner
        </Button>
      </Box>

      <Grid container spacing={3}>
        {banners.map((banner) => (
          <Grid item xs={12} key={banner.id}>
            <Card
              sx={{
                width: "100%",
                borderRadius: 3,
                boxShadow: 4,
                overflow: "hidden",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 8,
                },
              }}
            >
              {/* Banner Image Section */}
              <CardMedia
                component="img"
                height="320"
                image={banner.imgUrl}
                alt={banner.title}
                sx={{
                  objectFit: "cover",
                  width: "100%",
                }}
              />

              {/* Banner Content Section */}
              <CardContent sx={{ position: "relative", p: 3 }}>
                {/* Title */}
                <Typography variant="h5" gutterBottom>
                  {banner.title}
                </Typography>

                {/* Store Logo */}
                <Box
                  component="img"
                  src={banner.storeLogo}
                  alt="Store Logo"
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "1px solid #ddd",
                    display: "block",
                    mb: 2,
                  }}
                />

                {/* Category */}
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  Category: {banner.category}
                </Typography>

                {/* Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    mt: 3,
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    endIcon={<OpenInNewIcon />}
                    onClick={() => window.open(banner.storeUrl, "_blank")}
                  >
                    Visit Store
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteBanner(banner.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
