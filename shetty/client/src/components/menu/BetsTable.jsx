import React from 'react';
import { Box, Typography, styled, CircularProgress, useTheme, useMediaQuery } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const ACCENT = '#01fafe';
const HEADER_BG = '#212e44';
const BORDER_COLOR = 'rgba(1, 250, 254, 0.4)';

const TableWrapper = styled(Box)({
  width: '100%',
  backgroundColor: HEADER_BG,
  borderRadius: 12,
  overflow: 'hidden',
  border: `1px solid ${BORDER_COLOR}`,
});

const TableHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'rgba(7, 17, 35, 0.95)',
  height: 'fit-content',
  border: '1px solid rgba(4, 160, 226, 0.5)',
  flexWrap: 'nowrap',
  borderRadius: 12,
  minWidth: '100%',
  [theme.breakpoints.down('sm')]: {
    borderRadius: 10,
    minWidth: 720,
  },
}));

const HeaderCell = styled(Box, { shouldForwardProp: (p) => p !== 'align' && p !== 'wider' })(({ theme, align, wider }) => ({
  flex: wider ? '1.5 1 0%' : '1 1 0%',
  minWidth: wider ? 120 : 0,
  padding: '10px 12px',
  color: 'rgba(255, 255, 255, 0.9)',
  fontFamily: 'Lato, sans-serif',
  fontSize: 11,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  whiteSpace: 'nowrap',
  borderRight: '1px solid rgba(4, 160, 226, 0.25)',
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
  '&:last-of-type': {
    borderRight: 'none',
  },
  [theme.breakpoints.down('sm')]: {
    flex: '0 0 auto',
    minWidth: wider ? 120 : 72,
    padding: '8px 10px',
    fontSize: 10,
  },
}));



const ContentBox = styled(Box, { shouldForwardProp: (p) => p !== 'isEmpty' })(({ theme, isEmpty }) => ({
  backgroundColor: 'rgba(7, 17, 35, 0.6)',
  borderRadius: 16,
  border: '1px solid rgba(4, 160, 226, 0.35)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: isEmpty ? 24 : 0,
  fontSize: '0.875rem',
  letterSpacing: '0.01071em',
  marginTop: 8,
  width: '100%',
  boxSizing: 'border-box',
  overflow: 'hidden',
  minHeight: isEmpty ? 120 : 0,
  [theme.breakpoints.down('sm')]: {
    borderRadius: 12,
    padding: isEmpty ? 16 : 0,
    marginTop: 8,
    ...(!isEmpty && { minWidth: 720, width: 'max-content' }),
  },
}));
function BetsTable({ columns, children, emptyMessage = 'No Bets Found', loading = false }) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  const defaultColumns = [
    { id: 'placeDate', label: 'Date', sortable: true },
    { id: 'eventName', label: 'Event' },
    { id: 'market', label: 'Market' },
    { id: 'betOn', label: 'Selection' },
    { id: 'betType', label: 'Type' },
    { id: 'odds', label: 'Odds', align: 'right' },
    { id: 'amount', label: 'Stake', align: 'right' },
    { id: 'result', label: 'Status' },
    { id: 'winnings', label: 'Payout', align: 'right' },
  ];
  const cols = columns || defaultColumns;

  const isEmpty = children == null || children === false;

  return (
    <Box
      sx={{
        width: '100%',
        minWidth: 0,
        overflowX: 'auto',
        overflowY: 'visible',
        WebkitOverflowScrolling: 'touch',
        '&::-webkit-scrollbar': {
         display: 'none',
        },
              }}
    >
      <TableHeader>
        {cols.map((col) => {
          const wider = col.id === 'eventName' || col.id === 'betOn' || col.id === 'market';
          return (
          <HeaderCell key={col.id} align={col.align} wider={wider}>
            {col.label}
            {col.sortable && (
              <KeyboardArrowDownIcon sx={{ fontSize: isSmall ? 14 : 16, color: BORDER_COLOR }} />
            )}
          </HeaderCell>
          );
        })}
      </TableHeader>
      <ContentBox
        isEmpty={isEmpty && !loading}
        sx={
          isEmpty && !loading
            ? {}
            : {
                justifyContent: 'flex-start',
                alignItems: 'stretch',
                flexDirection: 'column',
              }
        }
      >
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <CircularProgress size={isSmall ? 28 : 32} sx={{ color: ACCENT }} />
            <Typography sx={{ color: '#fff', fontFamily: 'Lato, sans-serif', fontSize: isSmall ? 13 : 14 }}>
              Loading...
            </Typography>
          </Box>
        ) : isEmpty ? (
          <Typography
            sx={{
              color: '#fff',
              fontFamily: 'Lato, sans-serif',
              fontSize: isSmall ? 13 : 14,
              textAlign: 'center',
            }}
          >
            {emptyMessage}
          </Typography>
        ) : (
          children
        )}
      </ContentBox>
    </Box>
  );
}

export default BetsTable;