import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  styled,
  InputAdornment,
} from "@mui/material";
import ListIcon from "@mui/icons-material/List";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import BetsTable from "./BetsTable";

const ACCENT = "#01fafe";
const CONTAINER_BG = "#212e44";
const TITLE_BAR_BG = "#131B2A";

const StyledContainer = styled(Box)(({ theme }) => ({
  backgroundColor: CONTAINER_BG,
  borderRadius: 13,
  overflow: "hidden",
  padding: "16px 12px",
  margin: 12,
  minHeight: "85vh",
  border: "1px solid rgba(0, 0, 0, 0.23)",
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
  [theme.breakpoints.down("sm")]: {
    padding: 12,
    margin: 12,
  },
}));

export const MainBox = styled(Box)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minHeight: 0,
});

const TitleBar = styled(Box)({
  backgroundColor: "#071123",
  fontWeight: 500,
  fontFamily: "Lato",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  padding: "10px 16px",
  borderRadius: "25px",
  border: `1px solid #04a0e2`,
});

const TitleChip = styled(Box)(({ active }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  padding: "4px 0",
  backgroundColor: "transparent",
  border: "none",
  boxShadow: "none",
}));

const FilterRow = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  gap: 16,
  padding: "14px 24px",
  alignItems: "center",
  justifyContent: "flex-end",
  backgroundColor: "#212e44",
  height: "fit-content",
  borderRadius: "20px",
  borderBottom: `2px solid ${ACCENT}20`,
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    gap: 14,
    padding: "5px",
  },
}));

const FilterField = styled(Box)(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  margin: 0,
  padding: "4px 6px",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-start",
    alignSelf: "stretch",
    margin: 0,
    gap: 6,
    width: "100%",
  },
}));

const FilterLabel = styled(Typography)(({ theme }) => ({
  color: "#fff",
  fontSize: "12px",
  fontWeight: 400,
  minWidth: 60,
  lineHeight: "16.2px",
  letterSpacing: "0.00938em",
  textAlign: "right",
  whiteSpace: "nowrap",
  [theme.breakpoints.down("sm")]: {
    textAlign: "left",
    minWidth: "unset",
    marginBottom: 4,
    width: "100%",
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  color: "#fff",
  width: 155,
  height: 26,
  padding: 5,
  border: "1px solid #ffffff",
  borderRadius: 20,
  backgroundColor: "transparent",
  fontWeight: 400,
  lineHeight: "1.1876em",
  letterSpacing: "0.00938em",
  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
  "& .MuiSelect-select": {
    padding: "8px 32px 5px 12px",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "1.1876em",
    letterSpacing: "0.00938em",
  },
  "& .MuiSvgIcon-root": { color: "#fff" },
  "&:hover": {
    borderColor: "#ffffff",
  },
  [theme.breakpoints.down("sm")]: {
    width: "100%",
    minWidth: "100%",
    "& .MuiSelect-select": {
      textAlign: "left",
    },
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: 155,
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
  "& .MuiOutlinedInput-root": {
    color: "#fff",
    height: 26,
    width: 155,
    padding: 5,
    border: "1px solid #ffffff",
    borderRadius: 20,
    backgroundColor: "transparent",
    fontWeight: 400,
    lineHeight: "1.1876em",
    letterSpacing: "0.00938em",
    "& fieldset": { border: "none" },
    "& input": {
      padding: "5px 12px",
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: "1.1876em",
      letterSpacing: "0.00938em",
      "&::-webkit-calendar-picker-indicator": {
        display: "none",
      },
      "&::-moz-calendar-picker-indicator": {
        display: "none",
      },
    },
    "&:hover": {
      borderColor: "#ffffff",
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      "& input": {
        textAlign: "left",
      },
    },
  },
}));

const TabsRow = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  gap: 8,
  padding: "8px 24px 12px",
  overflowX: "auto",
  overflowY: "hidden",
  WebkitOverflowScrolling: "touch",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  [theme.breakpoints.down("sm")]: {
    padding: "8px 12px 12px",
    gap: 6,
  },
}));

const TabButton = styled(Button)(({ theme, isActive }) => ({
  borderRadius: 20,
  textTransform: "none",
  padding: "7px",
  minWidth: "92px",
  fontSize: "14px",
  fontWeight: 500,
  marginRight: "20px",
  lineHeight: 1.75,
  letterSpacing: "0.02857em",
  flexShrink: 0,
  border: `1px solid #fff`,
  boxSizing: "border-box",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "Lato",
  backgroundColor: isActive ? ACCENT : "transparent",
  color: isActive ? "#000" : "#fff",
  "&:hover": {
    backgroundColor: isActive ? ACCENT : "rgba(1, 250, 254, 0.1)",
    borderColor: isActive ? "transparent" : ACCENT,
  },
  [theme.breakpoints.down("sm")]: {
    padding: "8px 14px",
    fontSize: "13px",
  },
}));

const menuPaperProps = {
  sx: {
    backgroundColor: CONTAINER_BG,
    border: `1px solid ${ACCENT}`,
    color: "#fff",
    "& .MuiMenuItem-root": {
      color: "#fff",
      fontSize: "14px",
      padding: "8px 16px",
    },
    "& .MuiMenuItem-root:hover": {
      backgroundColor: "rgba(1, 250, 254, 0.2)",
    },
  },
};

function MenuHeaderBox({
  title = "MY BETS",
  icon = <ListIcon sx={{ color: "#fff", fontSize: 24, marginLeft: "5px" }} />,
  activeTitle = true,
  balanceLabel = null,
  balanceValue = null,
  filterFields = [
    {
      id: "betStatus",
      label: "Bet Status",
      type: "select",
      value: "Open",
      options: ["Open", "Settled", "Void"],
    },
    {
      id: "selectGames",
      label: "Select Games",
      type: "select",
      value: "Sports",
      options: ["Sports", "Casino", "Live"],
    },
    { id: "from", label: "From", type: "date", value: "2026-01-28" },
    { id: "to", label: "To", type: "date", value: "2026-02-04" },
  ],
  onFilterChange,
  tabs = [],
  tableContent,
  tableColumns = null,
  filterFieldBoxSx = null,
  tableEmptyMessage = "No Bets Found",
  tableLoading = false,
  onTabChange,
}) {
  const dateInputRefs = useRef({});
  const [internalTabs, setInternalTabs] = useState(tabs ?? []);
  const [isTabLoading, setIsTabLoading] = useState(false);

  const activeTabs = tabs ?? internalTabs;
  const showBalance = balanceLabel != null && balanceValue != null;
  const visibleFilterFields = showBalance
    ? filterFields.filter((f) => f.type === "date")
    : filterFields;

  const handleTabChange = (tabId) => {
    if (isTabLoading) return;
    setIsTabLoading(true);
    setInternalTabs((prev) =>
      prev.map((t) => ({ ...t, active: t.id === tabId }))
    );
    onTabChange?.(tabId);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 2500);
  };

  const handleFilterChange = (id, value) => {
    onFilterChange?.(id, value);
  };

  const openDatePicker = (fieldId) => {
    const input = dateInputRefs.current[fieldId];
    if (input?.showPicker) {
      input.showPicker();
    } else if (input) {
      input.click();
    }
  };

  return (
    <StyledContainer>
      <MainBox>
        <TitleBar>
          <TitleChip active={activeTitle}>
            {icon}
            <Typography
              variant="h6"
              sx={{
                color: "#fff",
                textTransform: "uppercase",
                fontWeight: 900,
                marginLeft: "5px",
                fontFamily: "Lato",
                letterSpacing: "0.00938em",
                fontSize: "13px",
              }}
            >
              {title}
            </Typography>
          </TitleChip>
          {showBalance && (
            <Typography
              sx={{
                color: ACCENT,
                textTransform: "uppercase",
                fontWeight: 700,
                fontFamily: "Lato",
                letterSpacing: "0.00938em",
                fontSize: "13px",
              }}
            >
              {balanceLabel}: {balanceValue}
            </Typography>
          )}
        </TitleBar>
      </MainBox>

      <FilterRow>
        {visibleFilterFields.map((field) => (
          <FilterField key={field.id} sx={filterFieldBoxSx}>
            <FilterLabel>{field.label}</FilterLabel>
            {field.type === "select" ? (
              <StyledSelect
                value={field.value}
                onChange={(e) => handleFilterChange(field.id, e.target.value)}
                IconComponent={KeyboardArrowDownIcon}
                renderValue={(v) => v}
                variant="outlined"
                MenuProps={{ PaperProps: menuPaperProps }}
              >
                {field.options?.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </StyledSelect>
            ) : (
              <StyledTextField
                type="date"
                value={field.value || ""}
                onChange={(e) => handleFilterChange(field.id, e.target.value)}
                inputRef={(el) => {
                  dateInputRefs.current[field.id] = el;
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      sx={{ cursor: "pointer", pointerEvents: "auto" }}
                      onClick={() => openDatePicker(field.id)}
                    >
                      <CalendarMonthIcon
                        sx={{
                          color: "rgba(255, 255, 255, 0.7)",
                          fontSize: 20,
                          mr: 0.5,
                        }}
                      />
                    </InputAdornment>
                  ),
                }}
                inputProps={{
                  style: {
                    colorScheme: "dark",
                    cursor: "pointer",
                  },
                }}
                size="small"
              />
            )}
          </FilterField>
        ))}
      </FilterRow>

      {activeTabs.length > 0 && (
        <TabsRow>
          {activeTabs.map((tab) => (
            <TabButton
              key={tab.id}
              isActive={tab.active}
              disabled={isTabLoading}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabsRow>
      )}

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          overflowY: "auto",
          overflowX: "auto",
          mt: 1,
        }}
      >
        <BetsTable
          columns={tableColumns}
          emptyMessage={tableEmptyMessage}
          loading={isTabLoading || tableLoading}
        >
          {tableContent?.map((row, rowIndex) => (
            <Box
              key={rowIndex}
              sx={{
                display: "flex",
                borderBottom: "1px solid rgba(4,160,226,0.25)",
                minWidth: "100%",
              }}
            >
              {tableColumns?.map((col) => {
                const isNameColumn = col.id === "eventName" || col.id === "betOn" || col.id === "market";
                return (
                  <Box
                    key={col.id}
                    title={row[col.id] != null ? String(row[col.id]) : undefined}
                    sx={{
                      flex: isNameColumn ? "1.5 1 0%" : "1 1 0%",
                      minWidth: isNameColumn ? 120 : undefined,
                      padding: "10px 12px",
                      color: "#fff",
                      textAlign: col.align || "left",
                      whiteSpace: isNameColumn ? "normal" : "nowrap",
                      wordBreak: isNameColumn ? "break-word" : undefined,
                      overflow: isNameColumn ? "visible" : "hidden",
                      textOverflow: isNameColumn ? undefined : "ellipsis",
                      borderRight:
                        col.id !== tableColumns[tableColumns.length - 1].id
                          ? "1px solid rgba(4,160,226,0.25)"
                          : "none",
                    }}
                  >
                    {row[col.id]}
                  </Box>
                );
              })}
            </Box>
          ))}
        </BetsTable>
      </Box>
    </StyledContainer>
  );
}

export default MenuHeaderBox;
