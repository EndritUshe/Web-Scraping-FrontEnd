import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardMedia, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function FeaturedCategories() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

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

  const handleCardClick = (categoryName) => {
    navigate(`/popular-products/category/${encodeURIComponent(categoryName)}`);
  };

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
          Featured Categories
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


      {categories.length === 0 ? (
        <Typography sx={{ color: "#1565c0", textAlign: "center", py: 4 }}>
          No featured categories available at the moment.
        </Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {categories.map((cat) => (
            <Grid item xs={6} sm={4} md={3} lg={2.4} key={cat.id}>
              <Card
                onClick={() => handleCardClick(cat.name)}
                sx={{
                  cursor: "pointer",
                  textAlign: "center",
                  borderRadius: "18px",
                  boxShadow: "0 6px 18px rgba(0,0,0,0.10)",
                  transition: "transform 0.25s, box-shadow 0.25s",
                  minWidth: 230,          // ✅ Added
                  minHeight: 260,         // ✅ Added
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={cat.imgUrl}
                  alt={cat.name}
                  sx={{ objectFit: "cover" }}
                />

                <Typography
                  sx={{
                    py: 1.8,
                    fontWeight: 700,
                    color: "#1565c0",
                    fontSize: "1.05rem",
                  }}
                >
                  {cat.name}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
