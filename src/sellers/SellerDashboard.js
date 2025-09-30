import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import Sidebar from "../sellers/Sidebar";
import MembershipPlan from "../sellers/MembershipPlan";
import MyProducts from "../sellers/MyProducts";
import Analytics from "../sellers/Analytics";
import Orders from "../sellers/Orders";
import EditPopularProduct from "../sellers/EditPopularProduct";
import CreateProductComponent from "../sellers/CreateProductComponent";
import ErrorBoundary from "../errors/ErrorBoundary";

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
  const [editingProductId, setEditingProductId] = useState(null);
  const [creatingProduct, setCreatingProduct] = useState(false);

  // Handles sidebar clicks
  const handleSectionChange = (section) => {
    setSelectedSection(section);
    setEditingProductId(null); // close edit if switching sections
    setCreatingProduct(false); // close create if switching sections
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const renderContent = () => {
    // Render EditPopularProduct if editing
    if (editingProductId) {
      return (
        <ErrorBoundary>
          <EditPopularProduct
            productId={editingProductId}
            onBack={() => setEditingProductId(null)}
          />
        </ErrorBoundary>
      );
    }

    // Render CreateProductComponent if creating
    if (creatingProduct) {
      return (
        <ErrorBoundary>
          <CreateProductComponent onBack={() => setCreatingProduct(false)} />
        </ErrorBoundary>
      );
    }

    // Otherwise render normal sections
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
            <MyProducts
              onEditProduct={(id) => setEditingProductId(id)}
              onAddProduct={() => setCreatingProduct(true)}
            />
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
        setSelectedSection={handleSectionChange}
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
