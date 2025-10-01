import React from "react";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function MyBanners({ onAddBanner }) {
  return (
    <Box sx={{ textAlign: "center", mt: 6 }}>
      <Typography variant="h5" gutterBottom>
        Banners Section
      </Typography>
      <Button
        variant="contained"
        color="success"
        startIcon={<AddIcon />}
        onClick={onAddBanner}
      >
        Add Banner
      </Button>
    </Box>
  );
}
