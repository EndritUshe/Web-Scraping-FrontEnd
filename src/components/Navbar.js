import * as React from 'react';
import { styled } from '@mui/material/styles';
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
  borderRadius: '12px',
  backgroundColor: '#f5f7ff',
  border: '1px solid rgba(205,214,230,0.6)',
  display: 'flex',
  alignItems: 'center',
  flex: 1,
  maxWidth: 600,
  margin: '0 16px',
  boxShadow: '0 18px 42px rgba(19,32,62,0.12)',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#1f2937',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: '10px 12px',
    fontSize: '0.95rem',
  },
}));

export default function Navbar() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([]);

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

  const handleSelect = async (suggestion) => {
    const { id, name, category } = suggestion;
    try {
      await axios.post(`http://localhost:8080/api/product-clicks/record/${id}`);
    } catch (err) {
      console.error('Error recording product click:', err);
    }
    setSearchTerm(name);
    setSuggestions([]);
    navigate('/search-results', { state: { query: name, category } });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate('/search-results', { state: { query: searchTerm } });
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: "linear-gradient(160deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)",
        borderRadius: '26px',
        margin: '24px auto',          // center horizontally
        padding: '0.5rem 1rem',
        boxShadow: '0 26px 70px rgba(19,32,62,0.14)',
        maxWidth: 'calc(100% - 48px)', // prevent overflow
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Brand */}
        <Typography
          variant="h6"
          sx={{ cursor: 'pointer', color: '#e2e8f0', fontWeight: 700 }}
          onClick={() => navigate('/')}
        >
          Compare.al
        </Typography>

        {/* Search */}
        <Search>
          <StyledInputBase
            placeholder="What are you looking for today?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            onClick={() => navigate('/search-results', { state: { query: searchTerm } })}
            sx={{
              color: '#fff',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              borderRadius: '0 12px 12px 0',
              minWidth: 'auto',
              padding: '6px 10px',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
              },
            }}
          >
            <SearchIcon />
          </Button>

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
                boxShadow: '0 18px 42px rgba(19,32,62,0.12)',
                borderRadius: '12px',
              }}
            >
              <List dense>
                {suggestions.map((sug, idx) => (
                  <ListItem disablePadding key={idx}>
                    <ListItemButton onClick={() => handleSelect(sug)}>
                      <ListItemText
                        primary={sug.name}
                        secondary={sug.category.replaceAll('_', ' ')}
                        primaryTypographyProps={{ fontSize: '0.95rem', color: '#1f2937' }}
                        secondaryTypographyProps={{ fontSize: '0.8rem', color: '#64748b' }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Search>

        {/* Auth Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button
            color="inherit"
            variant="outlined"
            startIcon={<LoginIcon />}
            onClick={() => navigate('/login')}
            sx={{
              borderColor: '#e2e8f0',
              color: '#e2e8f0',
              '&:hover': { backgroundColor: 'rgba(226,232,240,0.08)' },
            }}
          >
            Sign In
          </Button>
          <Button
            color="inherit"
            variant="outlined"
            startIcon={<PersonAddIcon />}
            onClick={() => navigate('/signup')}
            sx={{
              borderColor: '#e2e8f0',
              color: '#e2e8f0',
              '&:hover': { backgroundColor: 'rgba(226,232,240,0.08)' },
            }}
          >
            Sign Up
          </Button>
        </div>
      </Toolbar>
    </AppBar>
  );
}
