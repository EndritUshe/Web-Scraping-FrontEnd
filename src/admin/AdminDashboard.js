// src/admin/AdminDashboard.js
import React, { useState } from "react";
import { Box } from "@mui/material";

// Components & pages
import AdminSidebar from "./components/AdminSidebar";
import Categories from "./pages/Categories";
import Stores from "./pages/Stores";
import FAQs from "./pages/FAQs";
import SuggestedProducts from "./pages/SuggestedProducts";
import ScrapePage from "./pages/ScrapingPage";
import ErrorBoundary from "../errors/ErrorBoundary";

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("categories"); // default page

  const renderPage = () => {
    switch (activePage) {
      case "categories":
        return <Categories />;
      case "stores":
        return <Stores />;
      case "faqs":
        return <FAQs />;
      case "suggested-products":
        return <SuggestedProducts />;
      case "scrape":
        return <ScrapePage />;
      default:
        return <Categories />;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <AdminSidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          p: 4,
          overflowY: "auto",
          width: "90%",
          maxWidth: "1600px",
          margin: "0 auto",
        }}
      >
        <ErrorBoundary>{renderPage()}</ErrorBoundary>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
