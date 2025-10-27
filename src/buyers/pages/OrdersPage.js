import React from "react";
import { Box, Typography } from "@mui/material";
import creatingGif from "../../assets/coupon.gif";

export default function OrdersPage() {
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
          padding: { xs: "16px 20px", sm: "24px 32px" },
          borderRadius: "24px",
          background: "linear-gradient(135deg, #166534 0%, #1e3a21 100%)",
          color: "#f5f7ff",
          mb: 4,
          boxShadow: "0 28px 64px rgba(22, 101, 52, 0.35)",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1,
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography variant="h5" fontWeight={700}>
            My Orders
          </Typography>
          <Typography variant="body1">
            Track your purchases — feature coming soon!
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
