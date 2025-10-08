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

 // Map base URLs to store names
  const websiteMap = {
    "https://www.germancomputers.al": "German Computers",
    "https://355store.al": "355 Mobile",
    "https://3vfejzo.al": "Fejzo",
    "https://shop.shpresa.al": "Shpresa",
    // add more stores as needed
  };

export default function SearchResults() {
  const location = useLocation();
  const { query } = location.state || {};

  const [productsBySource, setProductsBySource] = useState({});

 

  // Assign source based on productUrl
  const assignSource = (products, map) => {
    return products.map((product) => {
      const source = Object.keys(map).find((baseUrl) =>
        product.productUrl.startsWith(baseUrl)
      );
      return {
        ...product,
        source: source ? map[source] : "Unknown",
      };
    });
  };

  // Group products by source
  const groupBySource = (products) => {
    return products.reduce((acc, product) => {
      const src = product.source || "Unknown";
      if (!acc[src]) acc[src] = [];
      acc[src].push(product);
      return acc;
    }, {});
  };

  useEffect(() => {
    if (!query) return;

    fetch(`http://localhost:8080/api/scrape/search?query=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        const productsWithSource = assignSource(data, websiteMap);
        const grouped = groupBySource(productsWithSource);

        // Limit each store to max 4 items
        Object.keys(grouped).forEach((key) => {
          grouped[key] = grouped[key].slice(0, 4);
        });

        setProductsBySource(grouped);
      })
      .catch((err) => console.error("Error fetching search products:", err));
  }, [query]);

  // Render a single store group
  const renderProductGroup = (products, sourceName) => (
    <Container sx={{ marginTop: 4 }} key={sourceName}>
      <Typography variant="h5" gutterBottom>
        {products.length} products from {sourceName} "{query}"
      </Typography>

      {products.length > 0 ? (
        <Grid container spacing={3}>
          {products.map((product, idx) => (
            <Grid item xs={12} sm={6} key={idx}>
              <Card sx={{ display: "flex", minHeight: 180, maxWidth: 500 }}>
                {/* Left: Image */}
                <CardMedia
                  component="img"
                  sx={{ width: "40%", objectFit: "contain", p: 1 }}
                  image={product.imgUrl}
                  alt={product.name}
                />

                {/* Right: Details */}
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
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
          No products found from {sourceName}.
        </Typography>
      )}

      <Divider sx={{ my: 4 }} />
    </Container>
  );

  return (
    <Container sx={{ marginTop: 4 }}>
      {Object.entries(productsBySource).map(([sourceName, products]) =>
        renderProductGroup(products, sourceName)
      )}
    </Container>
  );
}
