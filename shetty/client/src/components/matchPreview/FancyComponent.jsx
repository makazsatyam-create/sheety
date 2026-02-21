import React, { useState } from "react";
import {
  Box,
  Grid,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";

const iconSx = { color: "#ffffff", fontSize: { xs: 18, sm: 20 } };

const OddsChip = ({ top, bottom, bgcolor, onClick, locked, lockType }) => (
  <Box
    onClick={locked ? undefined : onClick}
    sx={{
      cursor: locked ? "default" : onClick ? "pointer" : "default",
      width: { xs: 48, sm: 56 },
      height: { xs: 36, sm: 42 },
      padding: "2px",
      borderRadius: "999px",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      bgcolor,
      transition: "all 0.2s ease",
      flexShrink: 0,
      "&:hover":
        !locked && onClick
          ? {
              transform: "translateY(-2px)",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }
          : {},
    }}
  >
    {locked ? (
      lockType === "suspended" ? (
        <Box
          component="span"
          sx={{
            fontSize: { xs: "8px", sm: "9px" },
            fontWeight: 700,
            color: "#090909",
            opacity: 0.9,
            lineHeight: 1.1,
          }}
        >
          Suspended
        </Box>
      ) : (
        <Box
          component="span"
          sx={{
            fontSize: { xs: "8px", sm: "9px" },
            fontWeight: 700,
            color: "#090909",
            opacity: 0.9,
            lineHeight: 1.1,
          }}
        >
          Ball running
        </Box>
      )
    ) : (
      <>
        <Box
          component="span"
          sx={{
            fontWeight: 900,
            fontSize: { xs: "11px", sm: "13px" },
            lineHeight: 1.1,
            color: "#090909",
            display: "block",
            fontFamily: "Lato, sans-serif",
            mb: 0.25,
          }}
        >
          {top}
        </Box>
        <Box
          component="span"
          sx={{
            fontWeight: 600,
            fontSize: { xs: "8px", sm: "9px" },
            lineHeight: 1.1,
            color: "#01153c",
            display: "block",
            fontFamily: "Lato, sans-serif",
            opacity: 0.8,
          }}
        >
          {bottom}
        </Box>
      </>
    )}
  </Box>
);

function FancyComponent({
  onBetClick,
  sections: sectionsProp,
  pendingBets: pendingBetsProp = [],
}) {
  const [activeId, setActiveId] = useState("all");
  const [expanded, setExpanded] = useState({});
  const pendingBets = Array.isArray(pendingBetsProp) ? pendingBetsProp : [];

  const sectionsWithRows = React.useMemo(() => {
    if (!Array.isArray(sectionsProp) || sectionsProp.length === 0) return [];
    return sectionsProp.filter((s) => (s.rows || []).length > 0);
  }, [sectionsProp]);

  const tabs = React.useMemo(() => {
    if (sectionsWithRows.length === 0) return [{ id: "all", label: "ALL" }];
    return [
      { id: "all", label: "ALL" },
      ...sectionsWithRows.map((s) => ({ id: s.id, label: s.label })),
    ];
  }, [sectionsWithRows]);

  const visibleSections =
    activeId === "all"
      ? sectionsWithRows
      : sectionsWithRows.filter((s) => s.id === activeId);

  const activeSx = {
    bgcolor: "#01fafe",
    color: "#04373d",
    border: "none",
    "&:hover": { bgcolor: "#1fe3ee", color: "#04373d" },
  };

  const inactiveSx = {
    bgcolor: "transparent",
    color: "#ffffff",
    border: "none",
    "&:hover": { bgcolor: "rgba(255,255,255,0.08)", color: "#ffffff" },
  };

  const toggleSection = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleBetClick = (matchName, odd, side, gameType = "Normal", size) => {
    onBetClick?.(matchName, odd, side, gameType, size);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", overflow: "hidden" }}>
      <Box
        sx={{
          m: 0,
          p: { xs: 0.5, sm: 0 },
          borderRadius: "999px",
          border: "1px solid #04a0e2",
          bgcolor: "rgba(0,0,0,0.2)",
        }}
      >
        <Grid container spacing={{ xs: 0.5, sm: 1 }}>
          {tabs.map(({ id, label }) => (
            <Grid item xs={6} sm={tabs.length > 2 ? 3 : 6} key={id}>
              <Button
                fullWidth
                disableElevation
                onClick={() => setActiveId(id)}
                sx={{
                  borderRadius: "20px",
                  fontSize: { xs: "9px", sm: "10px" },
                  fontWeight: 700,
                  minHeight: { xs: "24px", sm: "28px" },
                  py: 0,
                  px: 0,
                  ...(activeId === id ? activeSx : inactiveSx),
                }}
              >
                {label}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>

      {visibleSections.map((section) => (
        <Box key={section.id} sx={{ mt: { xs: 0.75, sm: 1 } }}>
          {!expanded[section.id] ? (
            <Box
              onClick={() => toggleSection(section.id)}
              sx={{
                display: "flex",
                alignItems: "center",
                py: { xs: 0.75, sm: 1 },
                pl: { xs: 1, sm: 2 },
                pr: { xs: 1.5, sm: 2 },
                cursor: "pointer",
                border: "1px solid #04a0e2",
                borderRadius: "999px",
                bgcolor: "rgba(0,0,0,0.2)",
                minHeight: { xs: 32, sm: 36 },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: { xs: 24, sm: 28 },
                  height: { xs: 24, sm: 28 },
                  borderRadius: "50%",
                  bgcolor: "#22f3ff",
                  mr: { xs: 0.75, sm: 1 },
                }}
              >
                <KeyboardArrowUp sx={iconSx} />
              </Box>
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: { xs: "11px", sm: "12px" },
                  fontWeight: 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {section.label}
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
                <Table
                  size="small"
                  sx={{
                    tableLayout: "fixed",
                    width: "100%",
                    minWidth: 320,
                    borderCollapse: "separate",
                    borderSpacing: "0 6px",
                    "& .MuiTableCell-root": {
                      borderColor: "rgba(255,255,255,0.08)",
                    },
                    "& thead tr td": { borderSpacing: 0 },
                  }}
                >
                  <TableHead>
                    <TableRow
                      onClick={() => toggleSection(section.id)}
                      sx={{
                        cursor: "pointer",
                        bgcolor: "rgba(7, 17, 35, 0.95)",
                        "& .MuiTableCell-root": {
                          borderBottom: "1px solid rgba(4, 160, 226, 0.5)",
                          py: { xs: 0.6, sm: 1 },
                          px: { xs: 1, sm: 2 },
                          verticalAlign: "middle",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          width: "auto",
                          minWidth: 0,
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: { xs: "10px", sm: "12px" },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            minWidth: 0,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              width: { xs: 22, sm: 28 },
                              height: { xs: 22, sm: 28 },
                              minWidth: { xs: 22, sm: 28 },
                              borderRadius: "50%",
                              bgcolor: "#22f3ff",
                              mr: { xs: 0.75, sm: 1 },
                            }}
                          >
                            <KeyboardArrowDown sx={iconSx} />
                          </Box>
                          <Typography
                            sx={{
                              color: "#fff",
                              fontSize: "inherit",
                              fontWeight: 600,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {section.label}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ width: 80, color: "#fff" }} />
                      <TableCell
                        sx={{
                          width: 72,
                          textAlign: "center",
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: { xs: "10px", sm: "12px" },
                        }}
                      >
                        No
                      </TableCell>
                      <TableCell
                        sx={{
                          width: 72,
                          textAlign: "center",
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: { xs: "10px", sm: "12px" },
                        }}
                      >
                        Yes
                      </TableCell>
                      <TableCell
                        sx={{
                          width: 76,
                          textAlign: "right",
                          color: "#fff",
                          display: { xs: "none", sm: "table-cell" },
                        }}
                      />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(section.rows || []).map((exampleRow, rowIdx) => (
                      <TableRow
                        key={rowIdx}
                        sx={{
                          bgcolor: "#31425F",
                          "& td": {
                            borderTop: "1px solid #1C2D40",
                            borderBottom: "1px solid #1C2D40",
                            py: { xs: 0.6, sm: 1 },
                            px: { xs: 1, sm: 2 },
                            verticalAlign: "middle",
                          },
                          "& td:first-of-type": {
                            borderLeft: "1px solid #1C2D40",
                            borderTopLeftRadius: { xs: 16, sm: 10 },
                            borderBottomLeftRadius: { xs: 16, sm: 10 },
                          },
                          "& td:last-of-type": {
                            borderRight: "1px solid #1C2D40",
                            borderTopRightRadius: { xs: 16, sm: 10 },
                            borderBottomRightRadius: { xs: 16, sm: 10 },
                          },
                          "&:hover": { bgcolor: "rgba(49, 66, 95, 0.95)" },
                        }}
                      >
                        <TableCell
                          sx={{
                            width: "auto",
                            minWidth: 0,
                            color: "#fff",
                            fontSize: { xs: "10px", sm: "12px" },
                            fontWeight: 600,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.75,
                              flexWrap: "wrap",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#fff",
                                fontSize: "inherit",
                                fontWeight: 600,
                                lineHeight: 1.25,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: { xs: 2, sm: 1 },
                                WebkitBoxOrient: "vertical",
                                whiteSpace: { xs: "normal", sm: "nowrap" },
                              }}
                            >
                              {exampleRow.title}
                            </Typography>
                            {pendingBets.length > 0 &&
                              (() => {
                                const rowTitle = String(
                                  exampleRow.title || ""
                                ).trim();
                                const rowPending = pendingBets.filter(
                                  (b) => {
                                    const betTeam = String(
                                      b.teamName || ""
                                    ).trim();
                                    return (
                                      betTeam !== "" &&
                                      betTeam === rowTitle
                                    );
                                  }
                                );
                                const isBetOnThisRow = rowPending.length > 0;
                                if (!isBetOnThisRow) return null;
                                const value =
                                  "+" +
                                  rowPending.reduce(
                                    (s, b) =>
                                      s + Number(b.betAmount || b.price || 0),
                                    0
                                  );
                                return (
                                  <Box
                                    component="span"
                                    sx={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: 0.25,
                                      fontSize: "11px",
                                      fontWeight: 700,
                                      color: "#18a21e",
                                      px: 1,
                                      py: 0.25,
                                      borderRadius: "8px",
                                      backgroundColor: "#fff",
                                    }}
                                  >
                                    → {value}
                                  </Box>
                                );
                              })()}
                          </Box>
                        </TableCell>

                        <TableCell sx={{ width: 80, textAlign: "center" }}>
                          <Button
                            size="small"
                            disabled={exampleRow.locked}
                            onClick={(e) => {
                              if (exampleRow.locked) return;
                              e.stopPropagation();
                              // 🔴 UPDATED: Use handleBetClick instead of direct onBetClick
                              handleBetClick(
                                exampleRow.title,
                                exampleRow.values[0].top,
                                "lay",
                                section.id,
                                exampleRow.laySizeNum
                              );
                            }}
                            sx={{
                              fontWeight: 600,
                              fontSize: { xs: "9px", sm: "10px" },
                              textTransform: "capitalize",
                              background: exampleRow.locked
                                ? "#2d5a5e"
                                : "#3e8d93",
                              color: "#fff",
                              borderRadius: "999px",
                              padding: { xs: "4px 10px", sm: "6px 16px" },
                              minWidth: { xs: 40, sm: 56 },
                              minHeight: { xs: 24, sm: 28 },
                              "&:hover": exampleRow.locked
                                ? {}
                                : { background: "#2e7d83" },
                            }}
                          >
                            {exampleRow.book}
                          </Button>
                        </TableCell>

                        <TableCell sx={{ width: 72, textAlign: "center" }}>
                          <Box
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <OddsChip
                              top={exampleRow.values[0].top}
                              bottom={exampleRow.values[0].bottom}
                              bgcolor="#ffc3dc"
                              locked={exampleRow.locked}
                              lockType={exampleRow.lockType}
                              onClick={(e) => {
                                e.stopPropagation();
                                // 🔴 UPDATED: Use handleBetClick instead of direct onBetClick
                                handleBetClick(
                                  exampleRow.title,
                                  exampleRow.values[0].top,
                                  "lay",
                                  section.id,
                                  exampleRow.laySizeNum
                                );
                              }}
                            />
                          </Box>
                        </TableCell>

                        <TableCell sx={{ width: 72, textAlign: "center" }}>
                          <Box
                            sx={{ display: "flex", justifyContent: "center" }}
                          >
                            <OddsChip
                              top={exampleRow.values[1].top}
                              bottom={exampleRow.values[1].bottom}
                              bgcolor="#B2D9FF"
                              locked={exampleRow.locked}
                              lockType={exampleRow.lockType}
                              onClick={(e) => {
                                e.stopPropagation();
                                // 🔴 UPDATED: Use handleBetClick instead of direct onBetClick
                                handleBetClick(
                                  exampleRow.title,
                                  exampleRow.values[1].top,
                                  "back",
                                  section.id,
                                  exampleRow.backSizeNum
                                );
                              }}
                            />
                          </Box>
                        </TableCell>

                        <TableCell
                          sx={{
                            width: 76,
                            textAlign: "right",
                            color: "#fff",
                            display: { xs: "none", sm: "table-cell" },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-end",
                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                color: "#fff",
                                fontSize: { xs: "8px", sm: "9px" },
                                lineHeight: 1.3,
                                whiteSpace: "nowrap",
                              }}
                            >
                              MIN: {exampleRow.min}
                            </Typography>
                            <Typography
                              sx={{
                                color: "#fff",
                                fontSize: { xs: "8px", sm: "9px" },
                                lineHeight: 1.3,
                                whiteSpace: "nowrap",
                              }}
                            >
                              MAX: {exampleRow.max}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Box>
      ))}
    </Box>
  );
}

export default FancyComponent;
