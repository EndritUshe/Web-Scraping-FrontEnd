import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import SellerDashboard from "./sellers/SellerDashboard";
import BuyerDashboard from "./buyers/BuyerDashboard";
import PopularProductDetail from "./pages/PopularProductDetail";
import PopularProductsByCategory from "./pages/PopularProductsByCategory";
import SearchResults from "./pages/SearchResults";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductsByShop from "./pages/ProductsByShop";

function App() {
  // Role-based protected route
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

        {/* Seller dashboard route */}
        <Route
          path="/seller-dashboard"
          element={
            <RoleProtectedRoute role="ROLE_SELLER">
              <SellerDashboard />
            </RoleProtectedRoute>
          }
        />

        {/* <Route
          path="/my-product/:id"
          element={
            <RoleProtectedRoute role="ROLE_SELLER">
              <EditPopularProduct />
            </RoleProtectedRoute>
          }
        /> */}

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
        <Route
          path="/popular-products/:category/:searchTerm"
          element={<PopularProductsByCategory />}
        />
      </Routes>
    </Router>
  );
}

export default App;
