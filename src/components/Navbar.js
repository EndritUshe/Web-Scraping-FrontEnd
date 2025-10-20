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
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import axios from 'axios';
import { Paper, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

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
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([]);

  // Fetch suggestions when user types
  React.useEffect(() => {
    const fetchSuggestions = async () => {
      const q = searchTerm.trim();
      if (q.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const resp = await axios.get('http://localhost:8080/api/scrape/suggestions', {
          params: { query: q },
        });
        setSuggestions(resp.data);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setSuggestions([]);
      }
    };

    const delay = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  // Called when user picks a suggestion
  const handleSelect = async (suggestion) => {
   
    const { id, name, category } = suggestion;

    // Record click in backend
    try {
      await axios.post(`http://localhost:8080/api/product-clicks/record/${id}`);
    } catch (err) {
      console.error('Error recording product click:', err);
    }

    setSearchTerm(name);
    setSuggestions([]);

    navigate('/search-results', {
      state: { query: name, category },
    });
  };

  // Called when user presses Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate('/search-results', {
        state: { query: searchTerm },
      });
    }
  };

  return (
    <AppBar position="static" color="primary" sx={{ padding: '0.5rem 1rem' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography
          variant="h6"
          component="div"
          sx={{ marginLeft: 2, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Compare.al
        </Typography>

        <Search>
          <StyledInputBase
            placeholder="What are you looking for today?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            inputProps={{ 'aria-label': 'search' }}
          />
          <Button
            onClick={() => navigate('/search-results', { state: { query: searchTerm } })}
            sx={{ color: 'inherit', minWidth: 'auto', padding: '6px 8px' }}
          >
            <SearchIcon />
          </Button>

          {/* Suggestions dropdown */}
          {suggestions.length > 0 && (
            <Paper
              sx={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 10,
                maxHeight: 250,
                overflowY: 'auto',
              }}
            >
              <List dense>
                {suggestions.map((sug, idx) => (
                  <ListItem disablePadding key={idx}>
                    <ListItemButton onClick={() => handleSelect(sug)}>
                      <ListItemText
                        primary={sug.name}
                        secondary={sug.category.replaceAll('_', ' ')}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Search>

        <div>
          <Button
            color="inherit"
            variant="outlined"
            startIcon={<LoginIcon />}
            onClick={() => navigate('/login')}
            sx={{ borderColor: 'white', color: 'white', mr: 1 }}
          >
            Sign In
          </Button>
          <Button
            color="inherit"
            variant="outlined"
            startIcon={<PersonAddIcon />}
            onClick={() => navigate('/signup')}
            sx={{ borderColor: 'white', color: 'white' }}
          >
            Sign Up
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}
