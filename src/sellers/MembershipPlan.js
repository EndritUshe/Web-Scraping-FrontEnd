import React from "react";
import { Box, Typography } from "@mui/material";

export default function MembershipPlan() {  // ✅ default export
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        Membership Plan
      </Typography>
      <Typography>Current Plan: FREE</Typography>
      <Typography sx={{ mt: 1 }}>Upgrade options coming soon.</Typography>
    </Box>
  );
}