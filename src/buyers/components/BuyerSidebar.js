import React from "react";
import {
  Box,
  Button,
  Typography,
  Divider,
} from "@mui/material";

import StorefrontIcon from "@mui/icons-material/Storefront";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export default function BuyerSidebar({ activePage, setActivePage }) {
  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userRole");
    window.location.href = "/login";
  };

  const navItems = [
    { id: "all-products", label: "All Products", icon: <StorefrontIcon /> },
    { id: "wishlist", label: "Wishlist", icon: <FavoriteIcon /> },
    { id: "orders", label: "My Orders", icon: <ShoppingBagIcon /> },
    { id: "alerts", label: "Alerts", icon: <NotificationsActiveIcon /> },
    { id: "settings", label: "Settings", icon: <SettingsIcon /> },
  ];

  const buttonStyles = {
    justifyContent: "flex-start",
    borderRadius: "12px",
    textTransform: "none",
    fontWeight: 600,
    color: "rgba(226, 232, 240, 0.85)",
    mb: 1,
    "&.MuiButton-contained": {
      background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
      color: "#ffffff",
      boxShadow: "0 14px 30px rgba(22, 163, 74, 0.25)",
      "&:hover": {
        background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%)",
      },
    },
    "&:hover": {
      background: "rgba(148, 163, 184, 0.18)",
    },
  };

  return (
    <Box
      sx={{
        width: 240,
        background: "linear-gradient(165deg, #012e1dff 0%, #01221bff 100%)",
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
          sx={{ color: "rgba(226, 232, 240, 0.72)", textTransform: "uppercase" }}
        >
          Buyer Dashboard
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
        <Divider sx={{ mb: 2, borderColor: "rgba(1, 35, 23, 0.3)" }} />
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
              background: "rgba(1, 35, 23, 0.3)",
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
