import React from "react";
import { Box, Typography, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

const BuyerNavbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userRole");
    window.location.href = "/login";
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        Buyer Dashboard
      </Typography>
      <Button
        variant="outlined"
        color="inherit"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Box>
  );
};

export default BuyerNavbar;
