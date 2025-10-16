// src/admin/components/AdminNavbar.js
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

const AdminNavbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userRole");
    window.location.href = "/login";
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", color: "#fff" }}
      >
        Admin Dashboard
      </Typography>

      <Button
        variant="outlined"
        onClick={handleLogout}
        startIcon={<LogoutIcon />}
        sx={{
          color: "#fff",
          borderColor: "#fff",
          "&:hover": {
            backgroundColor: "#b71c1c",
            borderColor: "#fff",
          },
        }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default AdminNavbar;
