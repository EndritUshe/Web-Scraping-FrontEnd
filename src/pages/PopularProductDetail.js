import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PopularProductDetail() {
  const { id } = useParams(); // get id from URL
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // directly fetch from your backend
    fetch(`http://localhost:8080/api/popular-products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch product details");
        }
        return res.json();
      })
      .then((data) => {
        setProduct(data);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
      });
  }, [id]);



  
  return (
    <div>
      <h1>Popular Product Detail</h1>
      {product ? (
        <pre>{JSON.stringify(product, null, 2)}</pre>
      ) : (
        <p>Loading product details...</p>
      )}
    </div>
  );
}

export default PopularProductDetail;
