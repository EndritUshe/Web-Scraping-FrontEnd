import React, { useState } from "react";
import { Box } from "@mui/material";

import BuyerSidebar from "./components/BuyerSidebar";
import AllProducts from "./pages/AllProducts";
import WishlistPage from "./pages/WishlistPage";
import OrdersPage from "./pages/OrdersPage";
import AlertsPage from "./pages/AlertsPage";
import SettingsPage from "./pages/SettingsPage";
import ErrorBoundary from "../errors/ErrorBoundary";

const BuyerDashboard = () => {
  const [activePage, setActivePage] = useState("all-products");

  const renderPage = () => {
    switch (activePage) {
      case "all-products":
        return (
          <ErrorBoundary>
            <AllProducts />
          </ErrorBoundary>
        );
      case "wishlist":
        return (
          <ErrorBoundary>
            <WishlistPage />
          </ErrorBoundary>
        );
      case "orders":
        return (
          <ErrorBoundary>
            <OrdersPage />
          </ErrorBoundary>
        );
      case "alerts":
        return (
          <ErrorBoundary>
            <AlertsPage />
          </ErrorBoundary>
        );
      case "settings":
        return (
          <ErrorBoundary>
            <SettingsPage />
          </ErrorBoundary>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar on the left same like Seller */}
      <BuyerSidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content Area Styled Like Seller */}
      <Box
        sx={{
          flex: 1,
          p: 4,
          overflowY: "auto",
          width: "90%", // ✅ Wider width
          maxWidth: "1600px",
          margin: "0 auto",
        }}
      >
        {renderPage()}
      </Box>
    </Box>
  );
};

export default BuyerDashboard;
