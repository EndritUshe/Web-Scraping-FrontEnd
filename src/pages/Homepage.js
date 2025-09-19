// src/pages/Homepage.js
import * as React from 'react';
import Navbar from '../components/Navbar';
import PopularProductGrid from '../components/PopularProductGrid';
import Banners from '../components/Banners';

export default function Homepage() {
  return (
    <div>
      <Navbar />
      <Banners/>
      <PopularProductGrid />
    
    </div>
  );
}
