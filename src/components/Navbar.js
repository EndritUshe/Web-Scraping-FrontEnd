// src/components/Navbar.js
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  width: '50%',
  maxWidth: 600,
  margin: '0 auto',
  display: 'flex',
  alignItems: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 1, 1.5, 1),
    fontSize: '1rem',
  },
}));

export default function Navbar() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const navigate = useNavigate();

  // Function to perform search
  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      // Navigate to /search-results and pass query as state
      navigate('/search-results', { state: { query: searchTerm } });
    }
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <AppBar position="static" color="primary" sx={{ padding: '0.5rem 1rem' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left side: title */}
        <Typography variant="h6" component="div" sx={{ marginLeft: 2, textTransform: 'uppercase' }}>
          Compare Al
        </Typography>

        {/* Center: search bar */}
        <Search>
          <StyledInputBase
            placeholder="What are you looking for today?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            inputProps={{ 'aria-label': 'search' }}
          />
          <Button onClick={handleSearch} sx={{ color: 'inherit', minWidth: 'auto', padding: '6px 8px' }}>
            <SearchIcon />
          </Button>
        </Search>

        {/* Right side: sign in button */}
        <Button color="inherit" sx={{ marginRight: 2 }}>
          Sign in
        </Button>
      </Toolbar>
    </AppBar>
  );
}
