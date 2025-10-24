// src/admin/AdminDashboard.js
import React, { useState } from "react";
import { Box, Drawer, CssBaseline, AppBar, Toolbar, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

// Components & pages
import AdminSidebar from "./components/AdminSidebar";
import AdminNavbar from "./components/AdminNavbar";
import Categories from "./pages/Categories";
import Stores from "./pages/Stores";
import FAQs from "./pages/FAQs";
import SuggestedProducts from "./pages/SuggestedProducts";
import ScrapePage from "./pages/ScrapingPage";

const drawerWidth = 240;

const AdminDashboard = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activePage, setActivePage] = useState("categories"); // default page

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    // Render pages based on activePage state
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

    const drawer = (
        <AdminSidebar activePage={activePage} setActivePage={setActivePage} />
    );

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />

            {/* AppBar */}
            <AppBar
                position="fixed"
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: "#d21f19ff" }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: "none" } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <AdminNavbar />
                </Toolbar>
            </AppBar>

            {/* Sidebar / Drawer */}
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: 0 }}>
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: "block", sm: "none" },
                        "& .MuiDrawer-paper": { width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>

                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", sm: "block" },
                        "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main content */}
            <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                {renderPage()}
            </Box>
        </Box>
    );
};

export default AdminDashboard;
