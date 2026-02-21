import React, { useState, useCallback } from 'react';
import MenuHeaderBox from '../../components/menu/MenuHeaderBox';
import HistoryIcon from '@mui/icons-material/History';



const PNL_COLUMNS = [
    { id: 'transactionTime', label: 'TRANSACTION TIME' },
    { id: 'amount', label: 'AMOUNT' },
    { id: 'cashableAmount', label: 'CASHABLE AMOUNT' },
    { id: 'turnover', label: 'TURNOVER' },
    { id: 'status', label: 'STATUS' },
    { id: 'redeemedDate', label: 'REDEEMED DATE' },
    { id: 'updateTime', label: 'UPDATE TIME' },
  ];
  const TRANSACTION_TYPE_OPTIONS = [
    'All',
    'AWARDED',
    'REDEEMED',
    'CANCELLED',
    'IN PROGRESS',
  ];
const today = new Date();
const weekAgo = new Date(today);
weekAgo.setDate(weekAgo.getDate() - 7);

const formatDate = (d) => d.toISOString().slice(0, 10); // YYYY-MM-DD
const defaultFrom = formatDate(weekAgo);
const defaultTo = formatDate(today);

function DepositTurnover() {
  const [filters, setFilters] = useState({
    transactionType: 'All',
    from: defaultFrom,
    to: defaultTo,
  });

  const handleFilterChange = useCallback((id, value) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
  }, []);

  const filterFields = [
    { id: 'transactionType', label: 'Transaction Type', type: 'select', value: filters.transactionType, options: TRANSACTION_TYPE_OPTIONS },
    { id: 'from', label: 'From', type: 'date', value: filters.from },
    { id: 'to', label: 'To', type: 'date', value: filters.to },
  ];

  return (
    <MenuHeaderBox
      title="Deposit Turnover"
      icon={<HistoryIcon sx={{ color: '#fff', fontSize: 24, marginLeft: '5px' }} />}
      filterFields={filterFields}
      onFilterChange={handleFilterChange}
      tabs={[]}
      tableColumns={PNL_COLUMNS}
      tableContent={null}
      tableEmptyMessage="No data Found."
    />
  );
}

export default DepositTurnover;
