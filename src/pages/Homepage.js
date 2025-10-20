// src/pages/Homepage.js
import React, { useState, useEffect } from "react";
import { Snackbar, Alert, Box } from "@mui/material";

import Navbar from "../components/Navbar";
import PopularProductGrid from "../components/PopularProductGrid";
import Banners from "../components/Banners";
import Footer from "../components/Footer"; // ✅ fixed path

import FeaturedCategories from "./homeComponents/FeaturedCategories";
// import DealsOfTheWeek from "./homeComponents/DealsOfTheWeek";
import TopRatedStores from "./homeComponents/TopRatedStores";

export default function Homepage() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setOpen(false); 
  };

  return (
    <Box sx={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      <Navbar />

      {/* 🔝 Banners */}
      <Banners />

      {/* 🏷️ Categories */}
      <FeaturedCategories />

      {/* ⚡ Deals */}
      {/* <DealsOfTheWeek /> */}

      {/* ❤️ Popular products */}
      <PopularProductGrid />

      {/* 🏆 Top stores */}
      <TopRatedStores />

      {/* 👋 Welcome Snackbar */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="info" sx={{ width: "100%" }}>
          Welcome to Compare.al
        </Alert>
      </Snackbar>

      <Footer/>

    </Box>
  );
}
