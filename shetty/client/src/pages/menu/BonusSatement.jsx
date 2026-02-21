import React, { useState, useCallback } from 'react';
import MenuHeaderBox from '../../components/menu/MenuHeaderBox';
import RedeemIcon from '@mui/icons-material/Redeem';



const PNL_COLUMNS = [
    { id: 'bonusType', label: 'BONUS TYPE' },
    { id: 'approvalReq', label: 'APPROVAL REQ.' },
    { id: 'awardedDate', label: 'AWARDED DATE' },
    { id: 'awardedAmt', label: 'AWARDED AMT.' },
    { id: 'turnover', label: 'TURNOVER' },
    { id: 'installments', label: 'INSTALLMENTS' },
    { id: 'redeemedAmt', label: 'REDEEMED AMT.' },
    { id: 'status', label: 'STATUS' },
    { id: 'lastRedeemedDate', label: 'LAST REDEEMED DATE' },
    { id: 'expiryDate', label: 'EXPIRY DATE' },
  ];
const today = new Date();
const weekAgo = new Date(today);
weekAgo.setDate(weekAgo.getDate() - 7);

const formatDate = (d) => d.toISOString().slice(0, 10); // YYYY-MM-DD
const defaultFrom = formatDate(weekAgo);
const defaultTo = formatDate(today);

function BonusStatement() {
  const [filters, setFilters] = useState({
    
    from: defaultFrom,
    to: defaultTo,
  });

  const handleFilterChange = useCallback((id, value) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
  }, []);

  const filterFields = [
    
    { id: 'from', label: 'From', type: 'date', value: filters.from },
    { id: 'to', label: 'To', type: 'date', value: filters.to },
  ];

  return (
    <MenuHeaderBox
      title="Bonus Statement"
      icon={<RedeemIcon sx={{ color: '#fff', fontSize: 24, marginLeft: '5px' }} />}
      filterFields={filterFields}
      onFilterChange={handleFilterChange}
      tabs={[]}
      tableColumns={PNL_COLUMNS}
      tableContent={null}
      tableEmptyMessage="No data Found."
    />
  );
}

export default BonusStatement;
