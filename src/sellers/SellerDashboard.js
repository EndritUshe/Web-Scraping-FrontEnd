import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Sidebar from "../sellers/Sidebar";
import MembershipPlan from "../sellers/MembershipPlan";
import MyProducts from "../sellers/MyProducts";
import Analytics from "../sellers/Analytics";
import Orders from "../sellers/Orders";
import ErrorBoundary from "../errors/ErrorBoundary"; // adjust path

export default function SellerDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  let email = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      email = decoded.sub || decoded.email;
    } catch (err) {
      console.error("Invalid token", err);
      email = "";
    }
  }

  const [selectedSection, setSelectedSection] = useState("plan");

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const renderContent = () => {
    switch (selectedSection) {
      case "plan":
        return (
          <ErrorBoundary>
            <MembershipPlan />
          </ErrorBoundary>
        );
      case "products":
        return (
          <ErrorBoundary>
            <MyProducts />
          </ErrorBoundary>
        );
      case "analytics":
        return (
          <ErrorBoundary>
            <Analytics />
          </ErrorBoundary>
        );
      case "orders":
        return (
          <ErrorBoundary>
            <Orders />
          </ErrorBoundary>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar
        selectedSection={selectedSection}
        setSelectedSection={setSelectedSection}
        onLogout={handleLogout}
      />

      <Box sx={{ flex: 1, p: 4, overflowY: "auto" }}>
        <Typography variant="h4" gutterBottom>
          Welcome {email ? email : "Seller"}!
        </Typography>
        {renderContent()}
      </Box>
    </Box>
  );
}
