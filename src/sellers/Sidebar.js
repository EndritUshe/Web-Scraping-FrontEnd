import React from "react";
import { Box, Button, Typography, Divider } from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export default function Sidebar({ selectedSection, setSelectedSection, onLogout }) {
  return (
    <Box
      sx={{
        width: 220,
        bgcolor: "#f5f5f5",
        p: 2,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100vh",
        borderRight: "1px solid #ccc",
      }}
    >
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Seller Menu
        </Typography>

        <Button
          fullWidth
          startIcon={<StorefrontIcon />}
          variant={selectedSection === "plan" ? "contained" : "outlined"}
          sx={{ mb: 1 }}
          onClick={() => setSelectedSection("plan")}
        >
          Membership Plan
        </Button>

        <Button
          fullWidth
          startIcon={<Inventory2Icon />}
          variant={selectedSection === "products" ? "contained" : "outlined"}
          sx={{ mb: 1 }}
          onClick={() => setSelectedSection("products")}
        >
          My Products
        </Button>

        <Button
          fullWidth
          startIcon={<BarChartIcon />}
          variant={selectedSection === "analytics" ? "contained" : "outlined"}
          sx={{ mb: 1 }}
          onClick={() => setSelectedSection("analytics")}
        >
          Analytics
        </Button>

        <Button
          fullWidth
          startIcon={<ShoppingCartIcon />}
          variant={selectedSection === "orders" ? "contained" : "outlined"}
          sx={{ mb: 1 }}
          onClick={() => setSelectedSection("orders")}
        >
          Orders
        </Button>
      </Box>

      <Box>
        <Divider sx={{ my: 2 }} />
        <Button
          fullWidth
          startIcon={<ExitToAppIcon />}
          variant="contained"
          color="error"
          onClick={onLogout}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
}
