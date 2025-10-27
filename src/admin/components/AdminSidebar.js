// src/admin/components/AdminSidebar.js
import React from "react";
import { Box, Button, Typography, Divider } from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import StoreIcon from "@mui/icons-material/Store";
import ArticleIcon from "@mui/icons-material/Article";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export default function AdminSidebar({ activePage, setActivePage }) {
  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userRole");
    window.location.href = "/login";
  };

  const navItems = [
    { id: "categories", label: "Categories", icon: <CategoryIcon /> },
    { id: "stores", label: "Stores", icon: <StoreIcon /> },
    { id: "faqs", label: "FAQs", icon: <CategoryIcon /> },
    { id: "suggested-products", label: "Suggestions", icon: <ArticleIcon /> },
    { id: "scrape", label: "Scrape Products", icon: <ArticleIcon /> },
  ];

  const buttonStyles = {
    justifyContent: "flex-start",
    borderRadius: "12px",
    textTransform: "none",
    fontWeight: 600,
    color: "rgba(226, 232, 240, 0.85)",
    mb: 1,
    "&.MuiButton-contained": {
      background: "linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)",
      color: "#ffffff",
      boxShadow: "0 14px 30px rgba(185, 28, 28, 0.25)",
      "&:hover": {
        background: "linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%)",
      },
    },
    "&:hover": {
      background: "rgba(184, 28, 28, 0.18)",
    },
  };

  return (
    <Box
      sx={{
        width: 240,
        background: "linear-gradient(165deg, #3b0d0d 0%, #2c0a0a 100%)",
        color: "#ffffff",
        borderRadius: "26px",
        boxShadow: "0 26px 70px rgba(19, 32, 62, 0.14)",
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        position: "sticky",
        top: 24,
        minHeight: "100vh",
      }}
    >
      {/* Branding */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Compare.al
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: "rgba(226, 232, 240, 0.72)",
            textTransform: "uppercase",
          }}
        >
          Admin Dashboard
        </Typography>
      </Box>

      {/* Navigation */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {navItems.map((item) => (
          <Button
            key={item.id}
            fullWidth
            startIcon={item.icon}
            variant={activePage === item.id ? "contained" : "text"}
            sx={buttonStyles}
            onClick={() => setActivePage(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </Box>

      {/* Footer Logout */}
      <Box sx={{ mt: "auto" }}>
        <Divider sx={{ mb: 2, borderColor: "rgba(43, 10, 10, 0.3)" }} />
        <Button
          fullWidth
          startIcon={<ExitToAppIcon />}
          variant="outlined"
          sx={{
            borderRadius: "12px",
            padding: "0.55rem 1rem",
            fontWeight: 600,
            border: "1px solid rgba(255, 255, 255, 0.75)",
            color: "#ffffff",
            "&:hover": {
              background: "rgba(43, 10, 10, 0.3)",
            },
          }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
}
