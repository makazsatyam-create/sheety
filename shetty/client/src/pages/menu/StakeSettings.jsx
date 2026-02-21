import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  styled,
  Grid,
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const ACCENT = '#01fafe';
const CONTAINER_BG = '#212e44';
const CARD_BG = '#1a2435';

const StyledContainer = styled(Box)(({ theme }) => ({
  backgroundColor: CONTAINER_BG,
  borderRadius: 13,
  overflow: 'hidden',
  padding: '16px 12px',
  margin: 12,
  minHeight: '85vh',
  border: '1px solid rgba(0, 0, 0, 0.23)',
  width: '100%',
  maxWidth: '100%',
  boxSizing: 'border-box',
  [theme.breakpoints.down('sm')]: {
    padding: 12,
    margin: 12,
  },
}));

const TitleBar = styled(Box)({
  backgroundColor: '#071123',
  fontFamily: 'Lato',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
  padding: '10px 16px',
  borderRadius: '25px',
  border: '1px solid #04a0e2',
  marginBottom: 16,
});

const SaveButton = styled(Button)({
  backgroundColor: ACCENT,
  color: '#000',
  fontWeight: 700,
  borderRadius: 20,
  padding: '8px 24px',
  textTransform: 'none',
  fontFamily: 'Lato',
  '&:hover': {
    backgroundColor: '#00e5e8',
  },
});

const StakeCard = styled(Box)(({ theme }) => ({
  backgroundColor: '#212e44',
  borderRadius: '12px',
  padding: 16,

  border: '1px solid rgba(4, 160, 226, 0.4)',
  [theme.breakpoints.down('sm')]: {
    padding: 12,
  },
}));

const formatWithCommas = (n) => {
  if (n == null || Number.isNaN(n)) return '';
  return Number(n).toLocaleString();
};

const parseNumber = (s) => {
  const n = Number(String(s).replace(/,/g, ''));
  return Number.isNaN(n) ? 0 : n;
};

const INITIAL_STAKES = [
  { id: 1, buttonLabel: '100', inputValue: 100 },
  { id: 2, buttonLabel: '200', inputValue: 200 },
  { id: 3, buttonLabel: '500', inputValue: 500 },
  { id: 4, buttonLabel: '1,000', inputValue: 1000 },
  {id: 5, buttonLabel: '1,500', inputValue: 1500},
  {id: 6, buttonLabel: '2,000', inputValue: 2000},
  {id: 7, buttonLabel: '5,000', inputValue: 5000},
  {id: 8, buttonLabel: '10,000', inputValue: 10000},
  {id: 9, buttonLabel: '1,00,000', inputValue: 100000},
];

function StakeSettings() {
  const [stakes, setStakes] = useState(INITIAL_STAKES);

  const updateStake = useCallback((id, field, value) => {
    setStakes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  }, []);

  const handleLabelChange = (id, raw) => {
    const parsed = parseNumber(raw);
    setStakes((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              buttonLabel: raw,
              inputValue:
                !Number.isNaN(parsed) && String(raw).replace(/,/g, '').length > 0
                  ? parsed
                  : s.inputValue,
            }
          : s
      )
    );
  };

  const handleValueChange = (id, newValue) => {
    const num = Math.max(0, Math.floor(Number(newValue)) || 0);
    setStakes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, inputValue: num } : s))
    );
  };

  const handleIncrement = (id) => {
    const s = stakes.find((x) => x.id === id);
    if (s) handleValueChange(id, s.inputValue * 2);
  };

  const handleDecrement = (id) => {
    const s = stakes.find((x) => x.id === id);
    if (s) handleValueChange(id, Math.max(0, Math.round(s.inputValue / 2)));
  };

  const handleSave = () => {
    console.log('Stake settings saved:', stakes);
    // TODO: persist to API or context
  };

  return (
    <StyledContainer>
      <TitleBar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SettingsIcon sx={{ color: '#fff', fontSize: 24 }} />
          <Typography
            variant="h6"
            sx={{
              color: '#fff',
              textTransform: 'uppercase',
              fontWeight: 900,
              fontFamily: 'Lato',
              letterSpacing: '0.00938em',
              fontSize: '13px',
            }}
          >
            STAKE SETTINGS
          </Typography>
        </Box>
        <SaveButton onClick={handleSave}>Save</SaveButton>
      </TitleBar>

      <Typography
        sx={{
          color: 'rgba(255,255,255,0.9)',
          fontSize: 14,
          fontFamily: 'Lato',
          mb: 2,
        }}
      >
        Change your input variable and label setting:
      </Typography>

      <Grid container spacing={2}  columns={12}>
        {stakes.map((stake) => (
          <Grid size={{xs:12, sm:4}} key={stake.id}>
            <StakeCard>
  {/* Button Label and its box on same line */}
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
    <Typography
      sx={{
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Lato',
        minWidth: 90,
        flexShrink: 0,
      }}
    >
      Button Label
    </Typography>
    <TextField
      fullWidth
      size="small"
      value={stake.buttonLabel}
      onChange={(e) => handleLabelChange(stake.id, e.target.value)}
      placeholder="Button Label"
      sx={{
        flex: 1,
        color:'#fff',
        fontWeight:500,
        fontFamily:'Lato',
        boxSizing:'border-box',
        fontSize:16,
        minWidth: 0,
        '& .MuiOutlinedInput-root': {
          color: '#000',
          backgroundColor: '#fff',
          borderRadius: '25px',
          '& fieldset': { border: 'none' },
          '&:hover fieldset': { border: 'none' },
        },
      }}
    />
  </Box>
  {/* Input Value and its control on same line */}
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
  <Typography
    sx={{
      color: '#fff',
      fontSize: 12,
      fontFamily: 'Lato',
      borderRadius: '25px',
      minWidth: 90,
      flexShrink: 0,
    }}
  >
    Input Value
  </Typography>
  <Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    gap: 0,
    flex: 1,
    minWidth: 0,
    backgroundColor: '#fff',
    borderRadius: '25px',
    overflow: 'hidden',
  }}
>
  <IconButton
    onClick={() => handleIncrement(stake.id)}
    sx={{
      width: 30,
      height: 30,
      borderRadius: '50%',
      background: '#01fafe',
      display: 'flex',
      marginRight: 1, 
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      color: '#000',
      flexShrink: 0,
      '&:hover': {
        background: '#01fafe',
      },
    }}
    size="small"
  >
    <AddIcon fontSize="small" />
  </IconButton>
  <TextField
    type="number"
    size="small"
    value={stake.inputValue}
    onChange={(e) => handleValueChange(stake.id, e.target.value)}
    inputProps={{ min: 0, step: 1 }}
    sx={{
      flex: 1,
      minWidth: 0,
      '& .MuiOutlinedInput-root': {
        backgroundColor: 'transparent',
        borderRadius: 0,
        '& fieldset': { border: 'none' },
        '&:hover fieldset': { border: 'none' },
      },
      '& .MuiOutlinedInput-input': {
        textAlign: 'center',
      },
    }}
  />
  <IconButton
    onClick={() => handleDecrement(stake.id)}
    sx={{
      width: 30,
      height: 30,
      borderRadius: '50%',
      background: '#01fafe',
      display: 'flex',
      marginLeft: 1, 
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      color: '#000',
      flexShrink: 0,
      '&:hover': {
        background: '#01fafe',
      },
    }}
    size="small"
  >
    <RemoveIcon fontSize="small" />
  </IconButton>
</Box>
</Box>
</StakeCard>
          </Grid>
        ))}
      </Grid>
    </StyledContainer>
  );
}

export default StakeSettings;
