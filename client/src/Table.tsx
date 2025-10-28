import './css/Table.css'
import { useState, useMemo } from 'react';
import {type JobItemType, type ColumnSortType, sortData, getSortIcon, getRowClass} from './TableUtils';

// A list of columns to display in the table
const columns = [
        {label: "ID", columnId: "id"},
        {label: "Name", columnId: "name"},
        {label: "Position", columnId: "position"},
        {label: "Website", columnId: "website"},
        {label: "Date Applied", columnId: "date"},
        {label: "Date Updated", columnId: "updated"},
        {label: "Status", columnId: "status"},
        {label: "Notes", columnId: "notes"}
    ];

type TableProps = { data: JobItemType[]; selectedId?: number; setSelectedId: (id: number) => void };

// The Table component displays a sortable table of job applications.
const Table = ({ data, selectedId, setSelectedId }: TableProps) => {
    const [sortConfig, setSortConfig] = useState<ColumnSortType>(null);
    
    const sortHandler = (column: keyof JobItemType) => {        
        const direction = sortConfig?.columnId === column && sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
        setSortConfig({ columnId: column, direction });
        console.log("Current sort config:", { columnId: column, direction });
    };    
    const sortedData = useMemo(() => (sortConfig ? sortData(data, sortConfig) : data), [data, sortConfig]);
    const selectionHandler = (id: number) => {
        setSelectedId(id);
    }

    return (
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
                    {sortedData.map((item) => (
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
    );
};

export default Table;
