import { useState, useMemo } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

import 'react-data-grid/lib/styles.css';
import DataGrid, { SelectColumn } from 'react-data-grid';
import './rdg.css';
import { exportToExcel, exportToCsv } from './exportUtils';

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
    if (isLoading || isFiltered || !isAtBottom(event)) {
      return;
    }

    setIsLoading(true);
    const newRows = await loadMoreRows(20, rows.length);
    setRows([...rows, ...newRows]);
    setIsLoading(false);
  };

  // checkbox style change
  const checkboxFormatter = ({ onChange, ...props }, ref) => {
    const handleChange = (event) => {
      onChange(event.target.checked, event.nativeEvent.shiftKey);
    };
    return <input type="checkbox" ref={ref} {...props} onChange={handleChange} />;
  };

  // filtering button
  const [isFiltered, setIsFiltered] = useState(false);
  const handleFilterClick = () => {
    console.log("Filter");
    console.log(selectedRows);
    setIsFiltered(!isFiltered);
  };

  const filteredRows = useMemo(() => {
    if (!isFiltered) {
      return rows;
    }
    return rows.filter((r) => selectedRows.has(r.id));
  }, [rows, selectedRows, isFiltered]);

  // data-grid element
  const gridElement = (
    <DataGrid
      columns={columns}
      rows={filteredRows}
      selectedRows={selectedRows}
      onSelectedRowsChange={setSelectedRows}
      onScroll={handleScroll}
      rowKeyGetter={(row) => row.id}
      renderers={{ checkboxFormatter }}
    />
  );

  // export button
  const handleExportExcelClick = () => {
    exportToExcel(gridElement, "test.xlsx");
  };
  const handleExportCsvClick = () => {
    exportToCsv(gridElement, "test.csv");
  };

  return (
    <div>
      <div style={{ textAlign: "end" }}>
        <input type="button" style={{ margin: "2px" }} value="Filter" onClick={handleFilterClick} />
        <input type="button" style={{ margin: "2px" }} value="Export xls" onClick={handleExportExcelClick} />
        <input type="button" style={{ margin: "2px", marginRight: "6px" }} value="Export csv" onClick={handleExportCsvClick} />
      </div>
      {gridElement}
    </div>
  );
};
