import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import PopularProductDetail from "./pages/PopularProductDetail";
import PopularProductsByCategory from "./pages/PopularProductsByCategory";
import SearchResults from "./pages/SearchResults";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
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

        <Route path="/search-results" element={<SearchResults />} />
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
