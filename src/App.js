import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import SellerDashboard from "./sellers/SellerDashboard";
import BuyerDashboard from "./buyers/BuyerDashboard";
import AdminDashboard from "./admin/AdminDashboard";
import PopularProductDetail from "./pages/PopularProductDetail";
import PopularProductsByCategory from "./pages/PopularProductsByCategory";
import SearchResults from "./pages/SearchResults";
import ProductsByShop from "./pages/ProductsByShop";
import ProtectedRoute from "./components/ProtectedRoute";

// ✅ New imports
import FAQPage from "./pages/FAQPage";
import SuggestProductPage from "./pages/SuggestProductPage";

function App() {
  const RoleProtectedRoute = ({ children, role }) => {
    const token = localStorage.getItem("jwtToken");
    const userRole = localStorage.getItem("userRole");

    if (!token) return <Navigate to="/login" />;
    if (role && userRole !== role) return <Navigate to="/login" />;
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin dashboard route */}
        <Route
          path="/admin-dashboard"
          element={
            <RoleProtectedRoute role="ROLE_ADMIN">
              <AdminDashboard />
            </RoleProtectedRoute>
          }
        />

        {/* Seller dashboard route */}
        <Route
          path="/seller-dashboard"
          element={
            <RoleProtectedRoute role="ROLE_SELLER">
              <SellerDashboard />
            </RoleProtectedRoute>
          }
        />

        {/* Buyer dashboard route */}
        <Route
          path="/buyer-dashboard"
          element={
            <RoleProtectedRoute role="ROLE_BUYER">
              <BuyerDashboard />
            </RoleProtectedRoute>
          }
        />

        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/products-by-shop" element={<ProductsByShop />} />
        <Route path="/popular-products/:id" element={<PopularProductDetail />} />
        <Route path="/popular-products/category/:category" element={<PopularProductsByCategory />} />

        {/* ✅ New Routes */}
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/suggest-product" element={<SuggestProductPage />} />
      </Routes>

    </Router>
  );
}

export default App;
