import React from "react";
import { Box, Typography } from "@mui/material";
import creatingGif from "../assets/coupon.gif";

export default function Orders() {
  return (
    <Box
      sx={{
        width: "90%",
        margin: "0 auto",
        padding: { xs: "1rem", sm: "2rem", md: "3rem" },
        overflowX: "hidden",
      }}
    >
      {/* HEADER BOX */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          padding: "24px 28px",
          borderRadius: "24px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #2563eb 100%)",
          color: "#f5f7ff",
          boxShadow: "0 28px 64px rgba(15, 23, 42, 0.35)",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography variant="h5" fontWeight={700}>
            Seller Orders
          </Typography>
          <Typography variant="body1">
            Track orders from your products — feature coming soon!
          </Typography>
        </Box>
      </Box>

      {/* GIF BOX */}
      <Box display="flex" justifyContent="center" mt={6}>
        <img
          src={creatingGif}
          alt="Coming Soon"
          style={{ width: "60%" }}
        />
      </Box>
    </Box>
  );
}
