import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import SearchResults from './pages/SearchResults';
import PopularProductDetail from './pages/PopularProductDetail';
import PopularProductsByCategory from './pages/PopularProductsByCategory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/popular-products/:id" element={<PopularProductDetail />} />
        <Route path="/popular-products/:category/:searchTerm" element={<PopularProductsByCategory />} />
      </Routes>
    </Router>
  );
}

export default App;
