import React, { useState, useEffect } from "react";
import { MdPushPin, MdDelete } from "react-icons/md";
import { Box, Typography, IconButton, Button, Stack } from "@mui/material";
import PushPinIcon from "@mui/icons-material/PushPin";

const GRID_COLUMNS = "minmax(150px, 1.8fr) minmax(0, 2fr) minmax(0, 2fr)";

const SECTION_PAD_X = 2;
const SECTION_PAD_Y = 1;

const OddsBox = ({ price, amount, bgColor = "#B2D9FF" }) => (
  <Box
    sx={{
      backgroundColor: bgColor,
      borderRadius: "20px",
      padding: "2px 4px",
      minWidth: 55,
      height: 32,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      lineHeight: "12px",
      fontSize: "13px",
      fontWeight: 900,
      textAlign: "center",
      flexShrink: 0,
    }}
  >
    <Typography fontSize={13} fontWeight={900} lineHeight="12px" color="#090909">{price}</Typography>
    <Typography fontSize={9} fontWeight={600} lineHeight="11px" opacity={0.8} color="#01153c">{amount}</Typography>
  </Box>
);

function MultiMarkets() {
  const [multiMarkets, setMultiMarkets] = useState([]);

  useEffect(() => {
    const savedMarkets = localStorage.getItem("multiMarkets");
    if (savedMarkets) setMultiMarkets(JSON.parse(savedMarkets));
  }, []);

  const handleRemoveMarket = (marketId) => {
    const updated = multiMarkets.filter((m) => m.id !== marketId);
    setMultiMarkets(updated);
    localStorage.setItem("multiMarkets", JSON.stringify(updated));
  };

  const handleClearAll = () => {
    setMultiMarkets([]);
    localStorage.removeItem("multiMarkets");
  };

  const MarketSection = ({ market, index, onRemove }) => (
    <Box sx={{ 
      mt: 1.5, 
      backgroundColor: "#1C2D40", 
      borderRadius: 5, 
      overflow: "hidden",
      px: 1.5,
    }}>
      <Box
        sx={{
          backgroundColor: "#071123",
          borderRadius: "18px",
          border: "1px solid #04a0e2",
          fontWeight: 900,
          py: SECTION_PAD_Y,
          px: SECTION_PAD_X,
          display: "flex",
          lineHeight: "17.55px",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 40,
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <PushPinIcon sx={{ color: "#fff", fontSize: 14 }} />
          <Typography fontSize={14} color="#fff" fontWeight={900}>
            {market.title?.toUpperCase()} ({index + 1})
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          {market.limits && (
            <Typography fontSize={12} color="#fff">MIN: {market.limits.min}&nbsp;&nbsp;MAX: {market.limits.max}</Typography>
          )}
          <IconButton size="small" onClick={() => onRemove(market.id)} sx={{ color: "#ff6b6b", p: 0.5 }}>
            <MdDelete size={18} />
          </IconButton>
        </Stack>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: GRID_COLUMNS,
          alignItems: "center",
          py: SECTION_PAD_Y,
          gap: 1,
          minHeight: 40,
          mt: 0.5,
        }}
      >
        <Typography 
          fontWeight={500} 
          fontSize={12} 
          lineHeight="16.2px" 
          letterSpacing="0.02em" 
          color="#fff"
          sx={{ pl: 3 }}
        >
          Market
        </Typography>
        <Typography 
          fontWeight={600} 
          fontSize={12} 
          lineHeight="16.2px" 
          textAlign="center" 
          letterSpacing="0.02em" 
          color="#fff"
        >
          Back
        </Typography>
        <Typography 
          fontWeight={600} 
          fontSize={12} 
          lineHeight="16.2px" 
          textAlign="center" 
          letterSpacing="0.02em" 
          color="#fff"
        >
          Lay
        </Typography>
      </Box>

      {market.data.map((row, i) => (
        <Box
          key={i}
          sx={{
            display: "grid",
            gridTemplateColumns: GRID_COLUMNS,
            alignItems: "center",
            minHeight: 40,
            py: SECTION_PAD_Y,
            gap: 1,
            background: "#31425F",
            borderRadius: 5,
            borderTopLeftRadius: "100px",
            borderBottomLeftRadius: "100px",
            borderBottom: "2px solid var(--background-card, #1C2D40)",
            mb: 0.5,
          }}
        >
          <Typography 
            fontSize={12} 
            color="#fff" 
            fontWeight={600}
            sx={{ 
              overflow: "hidden", 
              textOverflow: "ellipsis", 
              whiteSpace: "nowrap",
              pl: 3,
            }}
          >
            {row.team}
          </Typography>
          <Box display="flex" gap={0.5} justifyContent="center" alignItems="center" sx={{ flexWrap: "nowrap" }}>
            {row.back.map((b, idx) => (
              <OddsBox key={idx} price={b.price} amount={b.amount} />
            ))}
          </Box>
          <Box display="flex" gap={0.5} justifyContent="center" alignItems="center" sx={{ flexWrap: "nowrap" }}>
            {row.lay.map((l, idx) => (
              <OddsBox key={idx} price={l.price} amount={l.amount} bgColor="#ffc3dc" />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box sx={{ width: "100%", minHeight: "80vh", p: { xs: 2, lg: 3 } }}>
      <Box
        sx={{
          background: "var(--reports-subheader-bg-color, #0a0c10)",
          fontSize: 13,
          fontWeight: 900,
          lineHeight: "17.55px",
          color: "#fff",
          textTransform: "uppercase",
          height: 32,
          display: "flex",
          alignItems: "center",
          border: "1px solid var(--reports-header-border, #04a0e2)",
          borderRadius: "30px",
          px: 1,
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: "#6b7280", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <MdPushPin style={{ fontSize: 16, color: "#090909" }} />
          </Box>
          <Typography component="span" fontSize={13} fontWeight={900}>MULTI MARKETS</Typography>
        </Box>
      </Box>

      <Box sx={{ borderRadius: 2, p: 3, minHeight: "60vh", backgroundColor: "#071123" }}>
        {multiMarkets.length === 0 ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height={192}>
            <Typography sx={{ color: "#9fb3c8", fontSize: 14, textAlign: "center" }}>
              No multi-markets added yet. <br />Click the settings icon on any market to add it here.
            </Typography>
          </Box>
        ) : (
          <>
            {multiMarkets.map((market, index) => (
              <MarketSection key={market.id} market={market} index={index} onRemove={handleRemoveMarket} />
            ))}
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="outlined"
                onClick={handleClearAll}
                sx={{ 
                  color: "#ff6b6b", 
                  borderColor: "#ff6b6b", 
                  fontSize: 12, 
                  textTransform: "uppercase", 
                  "&:hover": { 
                    borderColor: "#ff5252", 
                    backgroundColor: "rgba(255,107,107,0.1)" 
                  } 
                }}
              >
                Clear All Multi-Markets
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

export default MultiMarkets;