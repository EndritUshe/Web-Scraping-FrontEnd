import { Navigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    // Optional: show a message before redirect
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          You must be logged in to access this page.
        </Typography>
        <Button variant="contained" color="primary" href="/login">
          Go to Login
        </Button>
      </Box>
    );
  }

  return children;
}
