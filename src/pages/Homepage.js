// src/pages/Homepage.js
import * as React from 'react';
import Navbar from '../components/Navbar';
import PopularProductGrid from '../components/PopularProductGrid';

export default function Homepage() {
  return (
    <div>
      <Navbar />
      <PopularProductGrid />
    </div>
  );
}
