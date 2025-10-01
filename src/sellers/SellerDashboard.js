import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

import Sidebar from "../sellers/Sidebar";
import MembershipPlan from "../sellers/MembershipPlan";
import MyProducts from "../sellers/MyProducts";
import Analytics from "../sellers/Analytics";
import Orders from "../sellers/Orders";
import EditPopularProduct from "../sellers/EditPopularProduct";
import CreateProductComponent from "../sellers/CreateProductComponent";
import CreateBannerComponent from "../sellers/CreateBannerComponent";
import MyBanners from "../sellers/MyBanners"; 
import ErrorBoundary from "../errors/ErrorBoundary";

export default function SellerDashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  let email = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log(token)
      email = decoded.sub || decoded.email;
    } catch (err) {
      console.error("Invalid token", err);
      email = "";
    }
  }

  const [selectedSection, setSelectedSection] = useState("plan");
  const [editingProductId, setEditingProductId] = useState(null);
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [creatingBanner, setCreatingBanner] = useState(false);

  // Handles sidebar clicks
  const handleSectionChange = (section) => {
    setSelectedSection(section);
    setEditingProductId(null); 
    setCreatingProduct(false); 
    setCreatingBanner(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  const renderContent = () => {
    // Editing a product
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

    // Creating a product
    if (creatingProduct) {
      return (
        <ErrorBoundary>
          <CreateProductComponent onBack={() => setCreatingProduct(false)} />
        </ErrorBoundary>
      );
    }

    // Creating a banner
    if (creatingBanner) {
      return (
        <ErrorBoundary>
          <CreateBannerComponent onBack={() => setCreatingBanner(false)} />
        </ErrorBoundary>
      );
    }

    // Normal sections
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
      case "banners":
        return (
          <ErrorBoundary>
            <MyBanners onAddBanner={() => setCreatingBanner(true)} />
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
