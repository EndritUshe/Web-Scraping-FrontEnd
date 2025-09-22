import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import SearchResults from './pages/SearchResults';
import PopularProductDetail from './pages/PopularProductDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/popular-products/:id" element={<PopularProductDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
