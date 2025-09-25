import React from "react";
import { jwtDecode } from "jwt-decode";
import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  let email = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      email = decoded.sub || decoded.email; // depends on your backend JWT structure
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/login"); // redirect to login page
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          border: "1px solid #ccc",
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome {email ? email : "User"}!
        </Typography>
        <Typography variant="body1" gutterBottom>
          This is your dashboard. More features coming soon.
        </Typography>

        <Button
          variant="contained"
          color="error"
          sx={{ mt: 2 }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
}
