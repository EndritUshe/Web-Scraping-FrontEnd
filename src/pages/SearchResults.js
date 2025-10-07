import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
} from "@mui/material";

export default function SearchResults() {
  const location = useLocation();
  const { query } = location.state || {};

  const [germanProducts, setGermanProducts] = useState([]);
  const [fejzoProducts, setFejzoProducts] = useState([]);

  useEffect(() => {
    if (query) {
      // Fetch German Computers
      fetch(`http://localhost:8080/api/scrape/german?query=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
              // console.log("German products:", data); // 👈 log only German data
              setGermanProducts(data);
            })
        .catch((err) => console.error("Error fetching German products:", err));

      // Fetch Fejzo
      fetch(`http://localhost:8080/api/scrape/fejzo?query=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => setFejzoProducts(data))
        .catch((err) => console.error("Error fetching Fejzo products:", err));
    }
  }, [query]);

  // Show only 4 items each
  const germanLimited = germanProducts.slice(0, 4);
  const fejzoLimited = fejzoProducts.slice(0, 4);

  const renderProducts = (products, sourceName, baseUrl) => (
    <Container sx={{ marginTop: 4 }}>
      <Typography variant="h5" gutterBottom>
        There are {products.length} products from {sourceName} "{query}"
      </Typography>

      <Grid container spacing={3}>
        {products.map((product, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card
              sx={{
                display: "flex",
                minHeight: 180,
                maxWidth: 500,
                height: "100%",
              }}
            >
              {/* Left half: image */}
              <CardMedia
                component="img"
                sx={{ width: "40%", 
                  objectFit: "contain", p: 1 }}
                image={product.imgUrl}
                alt={product.name}
              />

              {/* Right half: details */}
              <CardContent
                sx={{
                  width: "60%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Typography variant="h6" sx={{ wordWrap: "break-word" }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body1" sx={{ marginY: 1 }}>
                    Price: {product.priceEnd} Lek
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    From: {sourceName}
                  </Typography>
                </div>

                <Button
                  variant="contained"
                  color="primary"
                  href={product.productUrl}
                  target="_blank"
                  sx={{ m: 1, alignSelf: "flex-start" }}
                >
                  Visit Product
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Link to see more */}
      <Button
        variant="outlined"
        color="secondary"
        href={baseUrl}
        target="_blank"
        sx={{ mt: 2 }}
      >
        See all results on {sourceName}
      </Button>
    </Container>
  );

  return (
      <Container sx={{ marginTop: 4 }}>
      {renderProducts(
        germanLimited,
        "German Computers",
        `https://www.germancomputers.al/shop?search=${query}&order=name+asc`
      )}
      <Divider sx={{ my: 4 }} />
      {renderProducts(
        fejzoLimited,
        "Fejzo",
        `https://3vfejzo.al/shop/?s=${query}&post_type=product`
      )}
    </Container>
  );
}
