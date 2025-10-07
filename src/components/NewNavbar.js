/**
 * Navbar component --------- THIS HAS TO BE CHANGED WITH THE CURRENT NAVBAR.
 * ----------------
 * This React component renders the application's navigation bar with:
 * - A logo/title ("Compare.al")
 * - A central search input with real-time suggestions
 * - Sign In / Sign Up buttons on the right
 *
 * As the user types, it calls `/api/scrape/suggestions` to fetch product
 * suggestions from a static backend product database.
 *
 * When the user selects one of the suggestions, the product name and category
 * are passed to the `/search-results` route, where the app triggers the actual
 * scraping process based on that product’s category.
 * The scrapers are specific based on the category (e.g., laptops, phones).
 *
 * If the user presses Enter without selecting a suggestion, it navigates to
 * `/search-results` with the entered search term.
 * 
 * 
 */

import React, { useState, useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import SearchIcon from "@mui/icons-material/Search";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Styled search box
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: "50%",
  maxWidth: 600,
  margin: "0 auto",
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.5, 1, 1.5, 1),
    fontSize: "1rem",
  },
}));

export default function Navbar() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch suggestions as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/api/scrape/suggestions", {
          params: { query: searchTerm },
        });
        setSuggestions(response.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  // When user selects one suggestion
  const handleSelect = async (product) => {
    setSearchTerm(product.name);
    setSuggestions([]);

    try {
      navigate("/search-results", {
        state: {
          query: product.name,
          category: product.category,
        },
      });

      // Optional: You can trigger the actual scrape here if you want immediate results
      // await axios.get("http://localhost:8080/api/scrape/search", {
      //   params: { query: product.name, category: product.category },
      // });
    } catch (error) {
      console.error("Error starting scrape:", error);
    }
  };

  // If user presses Enter manually
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && suggestions.length === 0 && searchTerm.trim() !== "") {
      navigate("/search-results", { state: { query: searchTerm } });
    }
  };

  return (
    <AppBar position="static" color="primary" sx={{ padding: "0.5rem 1rem" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Left side: title */}
        <Typography
          variant="h6"
          component="div"
          sx={{ marginLeft: 2, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Compare.al
        </Typography>

        {/* Center: search bar + dropdown */}
        <Search>
          <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
            <StyledInputBase
              placeholder="What are you looking for today?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              inputProps={{ "aria-label": "search" }}
            />
            <Button
              sx={{ color: "inherit", minWidth: "auto", padding: "6px 8px" }}
              onClick={() => navigate("/search-results", { state: { query: searchTerm } })}
            >
              <SearchIcon />
            </Button>
          </div>

          {/* Dropdown list of suggestions */}
          {suggestions.length > 0 && (
            <Paper
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 20,
                maxHeight: 250,
                overflowY: "auto",
                mt: 1,
              }}
            >
              <List>
                {suggestions.map((product, index) => (
                  <ListItem disablePadding key={index}>
                    <ListItemButton onClick={() => handleSelect(product)}>
                      <ListItemText
                        primary={product.name}
                        secondary={product.category.replaceAll("_", " ")}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Search>

        {/* Right side: sign in and sign up buttons */}
        <div>
          <Button
            color="inherit"
            variant="outlined"
            startIcon={<LoginIcon />}
            onClick={() => navigate("/login")}
            sx={{ borderColor: "white", color: "white", mr: 1 }}
          >
            Sign In
          </Button>

          <Button
            color="inherit"
            variant="outlined"
            startIcon={<PersonAddIcon />}
            onClick={() => navigate("/signup")}
            sx={{ borderColor: "white", color: "white" }}
          >
            Sign Up
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}
