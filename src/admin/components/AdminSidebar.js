// src/admin/components/AdminSidebar.js
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
import CategoryIcon from "@mui/icons-material/Category";
import StoreIcon from "@mui/icons-material/Store"; // <-- Import Store icon

const AdminSidebar = ({ activePage, setActivePage }) => {
  const menuItems = [
    { id: "categories", label: "Categories", icon: <CategoryIcon /> },
    { id: "stores", label: "Stores", icon: <StoreIcon /> }, // <-- Add Stores
  ];

  return (
    <Box sx={{ p: 2, backgroundColor: "#fbe9e7", height: "100%" }}>
      <Typography
        variant="h6"
        sx={{ mb: 3, fontWeight: "bold", textAlign: "center", color: "#d32f2f" }}
      >
        Admin Panel
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={activePage === item.id}
              onClick={() => setActivePage(item.id)}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "rgba(211, 47, 47, 0.15)",
                  color: "#d32f2f",
                  fontWeight: 600,
                },
              }}
            >
              <ListItemIcon
                sx={{ color: activePage === item.id ? "#d32f2f" : "gray" }}
              >
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

export default AdminSidebar;
