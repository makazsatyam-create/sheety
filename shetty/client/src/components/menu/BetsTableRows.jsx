import React from 'react';
import { Box, Typography } from '@mui/material';

const cellStyle = {
  padding: '10px 12px',
  color: '#fff',
  fontSize: '13px',
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  borderBottom: '1px solid rgba(1, 250, 254, 0.2)',
};

function BetsTableRows({ data = [] }) {
  if (!data.length) return null;

  return (
    <Box sx={{ width: '100%' }}>
      {data.map((row) => (
        <Box
          key={row.id}
          sx={{
            display: 'flex',
            width: '100%',
            flexWrap: 'nowrap',
            alignItems: 'center',
            minWidth: 0,
            '&:last-of-type .cell': { borderBottom: 'none' },
          }}
        >
          <Box className="cell" sx={{ ...cellStyle, flex: '1 1 0%', minWidth: 0 }}>{row.placeDate}</Box>
          <Box className="cell" sx={{ ...cellStyle, flex: '1 1 0%', minWidth: 0 }}>{row.eventName}</Box>
          <Box className="cell" sx={{ ...cellStyle, flex: '1 1 0%', minWidth: 0 }}>{row.market}</Box>
          <Box className="cell" sx={{ ...cellStyle, flex: '1 1 0%', minWidth: 0 }}>{row.betOn}</Box>
          <Box className="cell" sx={{ ...cellStyle, flex: '1 1 0%', minWidth: 0 }}>{row.betType}</Box>
          <Box className="cell" sx={{ ...cellStyle, flex: '1 1 0%', minWidth: 0 }}>{row.odds}</Box>
          <Box className="cell" sx={{ ...cellStyle, flex: '1 1 0%', minWidth: 0 }}>{row.amount}</Box>
          <Box className="cell" sx={{ ...cellStyle, flex: '1 1 0%', minWidth: 0 }}>{row.result}</Box>
          <Box className="cell" sx={{ ...cellStyle, flex: '1 1 0%', minWidth: 0 }}>{row.winnings}</Box>
        </Box>
      ))}
    </Box>
  );
}

export default BetsTableRows;