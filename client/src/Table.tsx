import './css/Table.css'
import { useState, useMemo } from 'react';
import { sortData, getSortIcon, getRowClass, filterDataByStatus, DisplayStatus as ds } from './TableUtils';
import type { JobItemType, ColumnSortType} from './types';
import Checkbox from './Checkbox';

// A list of columns to display in the table
const columns = [
    { label: "ID", columnId: "id" },
    { label: "Company", columnId: "company" },
    { label: "Title", columnId: "title" },
    { label: "Website", columnId: "website" },
    { label: "Date Applied", columnId: "applied_date" },
    { label: "Date Updated", columnId: "updated_date" },
    { label: "Status", columnId: "status" }
];

type TableProps = { data: JobItemType[]; selectedId?: number; setSelectedId: (id: number) => void };

// The Table component displays a sortable table of job applications.
const Table = ({ data, selectedId, setSelectedId }: TableProps) => {
    const [sortConfig, setSortConfig] = useState<ColumnSortType>(null);
    const [statusFilter, setDisplayStatusFilter] = useState(
        ds.Applied | ds.Interview | ds.Offer 
    );

    const sortHandler = (column: keyof JobItemType) => {
        const direction = sortConfig?.columnId === column && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
        setSortConfig({ columnId: column, direction });
    };
    const selectionHandler = (id: number) => {
        setSelectedId(id);
    }
    const checkboxChangeHandler = (status: number, checked: boolean) => {
        if (checked) {
            setDisplayStatusFilter((prev) => prev | status);
        } else {
            setDisplayStatusFilter((prev) => prev & ~status);
        }
    };
    const sortedData = useMemo(() => (sortConfig ? sortData(data, sortConfig) : data), [data, sortConfig]);
    const filteredData = useMemo(() => filterDataByStatus(sortedData, statusFilter), [sortedData, statusFilter]);

    return (
        <>
            <div className="app-panel">
                <div>
                    <span className="strong-label">Filter By Status:</span>
                    <Checkbox label="Applied" checked={!!(statusFilter & ds.Applied)} onChange={checkboxChangeHandler} />
                    <Checkbox label="Interview" checked={!!(statusFilter & ds.Interview)} onChange={checkboxChangeHandler} />
                    <Checkbox label="Offer" checked={!!(statusFilter & ds.Offer)} onChange={checkboxChangeHandler} />
                    <Checkbox label="Rejected" checked={!!(statusFilter & ds.Rejected)} onChange={checkboxChangeHandler} />
                </div>
                <div>
                    <span className="strong-label">Displayed applications:</span>
                    <span>{filteredData.length}</span>
                </div>
            </div>
            <table className="app-table">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.columnId} className={getSortIcon(column.columnId, sortConfig)} onClick={() => sortHandler(column.columnId as keyof JobItemType)}>
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item) => (
                        <tr key={item.id} className={getRowClass(item.status as string, item.id === selectedId)} onClick={() => selectionHandler(item.id as number)}>
                            {columns.map((column) => {
                                if (column.columnId === "website") {
                                    return (
                                        <td key={column.columnId}>
                                            <a href={item[column.columnId as keyof JobItemType] as string} target="_blank" rel="noopener noreferrer">
                                                {item[column.columnId as keyof JobItemType]}
                                            </a>
                                        </td>
                                    );
                                } else {
                                    return <td key={column.columnId}>{item[column.columnId as keyof JobItemType]}</td>
                                }
                            }
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default Table;
