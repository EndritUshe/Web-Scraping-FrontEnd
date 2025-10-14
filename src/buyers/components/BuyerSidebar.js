import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SettingsIcon from "@mui/icons-material/Settings";
import StorefrontIcon from "@mui/icons-material/Storefront"; // New icon for All Products

const BuyerSidebar = ({ activePage, setActivePage }) => {
  const menuItems = [
    { id: "all-products", label: "All Products", icon: <StorefrontIcon /> }, // New item at top
    { id: "wishlist", label: "Wishlist", icon: <FavoriteIcon /> },
    { id: "orders", label: "My Orders", icon: <ShoppingBagIcon /> },
    { id: "alerts", label: "Alerts", icon: <NotificationsActiveIcon /> },
    { id: "settings", label: "Settings", icon: <SettingsIcon /> },
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h6"
        sx={{ mb: 3, fontWeight: "bold", textAlign: "center", color: "green" }}
      >
        Buyer Panel
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={activePage === item.id}
              onClick={() => setActivePage(item.id)}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "rgba(46, 125, 50, 0.15)",
                  color: "#2e7d32",
                  fontWeight: 600,
                },
              }}
            >
              <ListItemIcon sx={{ color: activePage === item.id ? "#2e7d32" : "gray" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default BuyerSidebar;
