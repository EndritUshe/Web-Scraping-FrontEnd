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


export default function MyBanners({ onAddBanner }) {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const MAX_BANNERS = 1; // static limit
  const canAddBanner = banners.length < MAX_BANNERS;

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
        setBanners(banners.filter((b) => b.id !== id));
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

  return (
    <Container sx={{ marginTop: 4, width: "90%" }} maxWidth={false}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          padding: "24px 28px",
          borderRadius: "24px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #2563eb 100%)",
          color: "#f5f7ff",
          boxShadow: "0 28px 64px rgba(15, 23, 42, 0.35)",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography variant="h5" fontWeight={700}>
            Your Banners
          </Typography>
          <Typography variant="body1">
            {banners.length > 0
              ? `Banners created: (${banners.length})`
              : "You haven't uploaded any banners yet."}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={onAddBanner}
            disabled={!canAddBanner}
            sx={{ borderColor: "#f5f7ff", color: "#f5f7ff" }}
          >
            Add Banner
          </Button>
          {!canAddBanner && (
            <Typography
              sx={{ color: "#ffffff", fontSize: "1rem", mt: 1, fontWeight: 600 }}
            >
              Banner limit reached ({MAX_BANNERS})
            </Typography>
          )}
        </Box>
      </Box>

      {banners.length === 0 ? (
        <Box textAlign="center" mt={6}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            You have not created any banners yet.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {banners.map((banner) => (
            <Grid item xs={12} sm={6} key={banner.id}>
              <Card
                sx={{
                  borderRadius: "16px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  height: "100%",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={banner.imgUrl}
                  alt={banner.title}
                  sx={{ height: 220, objectFit: "cover" }}
                />
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    flexGrow: 1,
                    p: 2,
                  }}
                >
                  <Typography variant="h6" fontWeight={600}>
                    {banner.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Category: {banner.categoryName}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                    <Button
                      variant="contained"
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
      )}
    </Container>
  );
}
