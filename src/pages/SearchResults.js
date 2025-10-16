import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
  CircularProgress,
  LinearProgress,
  Box,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { WEBSITE_MAP, STORE_ENDPOINT_MAP } from "./constants/constants";

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { query } = location.state || {};

  const [productsBySource, setProductsBySource] = useState({});
  const [countsBySource, setCountsBySource] = useState({});
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Assign source based on productUrl
  const assignSource = (products) => {
  return products.map((product) => {
    const source = Object.keys(WEBSITE_MAP).find((baseUrl) => {
      const baseDomain = baseUrl.replace(/^https?:\/\//, "").replace(/^www\./, "");
      const productDomain = product.productUrl.replace(/^https?:\/\//, "").replace(/^www\./, "");
      return productDomain.startsWith(baseDomain);
    });
    return {
      ...product,
      source: source ? WEBSITE_MAP[source] : "Unknown",
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

    setLoading(true);
    setProgress(20);

    const fetchData = async () => {
      try {
        // Fetch products
        const res = await fetch(
          `http://localhost:8080/api/scrape/search?query=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        const productsWithSource = assignSource(data);
        const grouped = groupBySource(productsWithSource);

        // Limit each store to max 4 items for display
        Object.keys(grouped).forEach((key) => {
          grouped[key] = grouped[key].slice(0, 4);
        });
        setProductsBySource(grouped);

        // Fetch total counts per site
        const countPromises = Object.entries(WEBSITE_MAP).map(([url, name]) => {
          const endpoint = STORE_ENDPOINT_MAP[name];
          if (!endpoint) return Promise.resolve([name, 0]);
          return fetch(
            `http://localhost:8080/api/scrape/${endpoint}/count?query=${encodeURIComponent(query)}`
          )
            .then((res) => res.json())
            .then((count) => [name, count]);
        });

        const countsArray = await Promise.all(countPromises);
        const countsMap = {};
        countsArray.forEach(([name, count]) => (countsMap[name] = count));
        setCountsBySource(countsMap);

        setProgress(100);
        setTimeout(() => setLoading(false), 300);
      } catch (err) {
        console.error("Error fetching search products:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [query]);

  // Render a single store group
  const renderProductGroup = (products, sourceName) => {
    const endpoint = STORE_ENDPOINT_MAP[sourceName] || null;

    return (
      <Container sx={{ marginTop: 4 }} key={sourceName}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h5" gutterBottom>
            {countsBySource[sourceName] || 0} Products from {sourceName} "{query}"
          </Typography>
          {endpoint && (
            <Button
              variant="contained"
              onClick={() =>
                navigate("/products-by-shop", {
                  state: { store: endpoint, query },
                })
              }
            >
              See All Products
            </Button>
          )}
        </Box>

        {products.length > 0 ? (
          <Grid container spacing={3}>
            {products.map((product, idx) => (
              <Grid item xs={12} sm={6} key={idx}>
                <Card sx={{ display: "flex", minHeight: 180, maxWidth: 500 }}>
                  <CardMedia
                    component="img"
                    sx={{ width: "40%", objectFit: "contain", p: 1 }}
                    image={product.imgUrl}
                    alt={product.name}
                  />
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
  };

  return (
  <div>
    <Navbar />
    <Container sx={{ marginTop: 4, minHeight: "60vh" }}>
      
      {/* Back Button */}
      <Button
        variant="outlined"
        sx={{ mb: 2 }}
        onClick={() => navigate(-1)}
      >
        ← Back
      </Button>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "60vh",
            textAlign: "center",
          }}
        >
          <CircularProgress size={60} thickness={4} color="primary" />
          <Typography variant="h6" sx={{ mt: 3 }}>
            Fetching results for "{query}"...
          </Typography>

          <Box sx={{ width: "60%", mt: 4 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 8, borderRadius: 5 }}
            />
          </Box>
        </Box>
      ) : Object.keys(productsBySource).length > 0 ? (
        Object.entries(productsBySource).map(([sourceName, products]) =>
          renderProductGroup(products, sourceName)
        )
      ) : (
        <Typography
          variant="h6"
          color="text.secondary"
          textAlign="center"
          mt={10}
        >
          No results found for "{query}".
        </Typography>
      )}
    </Container>
  </div>
);

}
