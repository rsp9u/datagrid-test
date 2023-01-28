import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

import 'react-data-grid/lib/styles.css';
import DataGrid, { SelectColumn } from 'react-data-grid';
import './rdg.css';

export default () => {
  // prepare columns
  const columns = [
    SelectColumn,
    { key: "id", name: "ID", resizable: true },
    { key: "title", name: "Title", resizable: true },
  ];

  // prepare rows
  const generateRows = (n, start) => {
    const rows = [];
    for (let i=start ; i<n+start; i++) {
      rows.push({
        id: i,
        title: `Something text of id[${i}]`,
      });
    }
    return rows;
  };
  const [rows, setRows] = useState(generateRows(20, 0));
  const [selectedRows, setSelectedRows] = useState(new Set());

  // infinite scroll
  const isAtBottom = ({ currentTarget }) => {
    return event.currentTarget.scrollTop + 10 >= currentTarget.scrollHeight - currentTarget.clientHeight;
  };
  const loadMoreRows = (n, length) => {
    return new Promise((resolve) => {
      const newRows = generateRows(n, length);
      setTimeout(() => resolve(newRows), 1000);
    });
  };
  const [isLoading, setIsLoading] = useState(false);
  const handleScroll = async (event) => {
    if (isLoading || !isAtBottom(event)) {
      return;
    }

    setIsLoading(true);
    const newRows = await loadMoreRows(20, rows.length);
    setRows([...rows, ...newRows]);
    setIsLoading(false);
  };

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      selectedRows={selectedRows}
      onSelectedRowsChange={setSelectedRows}
      onScroll={handleScroll}
      rowKeyGetter={(row) => row.id}
      className="rdg-root"
    />
  );
};
