// src/components/PopularProductNavbar.js
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Divider,
  Badge,
  TextField,
  Autocomplete,
  Select,
  MenuItem
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

const SearchWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: '100%',
  maxWidth: 600,
  overflow: 'hidden',
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  color: 'white', // selected value text
  fontWeight: 'bold',
  borderRadius: '4px 0 0 4px',
  backgroundColor: 'rgba(25, 118, 210, 0.2)', // selected value background
  minWidth: 150,
  '& .MuiSvgIcon-root': {
    color: 'white', // arrow color
  },
  '& .MuiSelect-select': {
    paddingLeft: theme.spacing(2),
  },
  '& .MuiMenu-paper': {
    backgroundColor: 'rgba(25, 118, 210, 0.2)', // light blue for dropdown options
  },
  '& .MuiMenuItem-root': {
    color: 'white', // text color for all options
    backgroundColor: 'rgba(25, 118, 210, 0.2)', // light blue default
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.5)', // dark blue on hover
    },
  },
}));

export default function PopularProductNavbar() {
  const [category, setCategory] = useState('All Categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [cartCount, setCartCount] = useState(0); 
  const navigate = useNavigate();

  const categories = ['All Categories', 'Electronics', 'Clothing', 'Books'];

  // Fetch live search suggestions
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();

    fetch(
      `http://localhost:8080/api/popular-products/filter?category=${encodeURIComponent(
        category
      )}&search=${encodeURIComponent(searchTerm)}`,
      { signal: controller.signal }
    )
      .then((res) => res.json())
      .then((data) => setSuggestions(data))
      .catch((err) => {
        if (err.name !== 'AbortError') console.error(err);
      });

    return () => controller.abort();
  }, [searchTerm, category]);

// When selecting an autocomplete suggestion
const handleSelect = (event, value) => {
  if (value) {
    navigate(`/popular-products/${value.id}`);
  }
};

// When pressing Enter or clicking search for a general query
const handleSearch = () => {
  if (searchTerm.trim() !== '') {
    navigate(`/popular-products/${encodeURIComponent(category)}/${encodeURIComponent(searchTerm)}`);
}
};
  

// Attach to input
const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    e.preventDefault(); // prevent form submit
    handleSearch();
  }
};

  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
       

        <Typography
                  variant="h6"
                  component="div"
                  sx={{ marginLeft: 2, cursor: "pointer" }}
                  onClick={() => navigate("/")}
                >
                  Compare.al
                </Typography>

        {/* Center: category + divider + autocomplete search */}
        <SearchWrapper>
          <StyledSelect
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </StyledSelect>

          <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.5)' }} />
            <Autocomplete
            freeSolo
            options={suggestions}
            getOptionLabel={(option) => option.title || ''}
            onChange={handleSelect}
            inputValue={searchTerm}
            onInputChange={(event, value) => setSearchTerm(value)}
            sx={{ flexGrow: 1 }}
            renderInput={(params) => (
                <TextField
                {...params}
                placeholder="Search products..."
                variant="standard"
                // Remove underline completely
                InputProps={{
                    ...params.InputProps,
                    disableUnderline: true,
                    style: { color: 'white', paddingLeft: 8 },
                }}
                onKeyDown={handleKeyDown}
                />
            )}
            />


          <Button onClick={handleSearch} sx={{ color: 'inherit', minWidth: 'auto', padding: '6px 8px' }}>
            <SearchIcon />
          </Button>
        </SearchWrapper>

        {/* Right: Website name + Cart */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          
               {/* Left: Wishlist */}
        <IconButton edge="start" color="inherit">
          <FavoriteBorderIcon />
        </IconButton>

          <IconButton edge="start" color="inherit">
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

        
        </Box>
      </Toolbar>
    </AppBar>
  );
}
