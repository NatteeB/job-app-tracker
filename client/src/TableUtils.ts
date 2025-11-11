
export type JobItemType = { id: number; name: string; position: string; website: string; date: string; updated: string; status: string; notes: string, details: string };
export type ColumnSortType = { columnId: keyof JobItemType; direction: 'ascending' | 'descending' } | null;

const DisplayStatus = {
  Applied: 1 << 0,
  Interview: 1 << 1,
  Offer: 1 << 2,
  Rejected: 1 << 3,
};

/**
 * Sorts the job application json data based on the provided sort configuration (See ColumnSortType).
 * @param data - The job application data to sort.
 * @param sortConfig - The configuration for sorting the data.
 * @returns The sorted job application data.
 */
const sortData = (data: JobItemType[], sortConfig: ColumnSortType): JobItemType[] => {
    console.log("Sorting data with config:", sortConfig);
    if (!sortConfig) return data;

    const { columnId, direction } = sortConfig;
    const sorted = [...data].sort((a, b) => {
        if (a[columnId] < b[columnId]) return direction === 'ascending' ? -1 : 1;
        if (a[columnId] > b[columnId]) return direction === 'ascending' ? 1 : -1;
        return 0;
    });
    return sorted;
};
/**
 * Gets the sort icon class for the specified column.
 * @param currentcolumnId - The ID of the current column.
 * @param config - The current sort configuration.
 * @returns The CSS class for the sort icon.
 */
const getSortIcon = (currentcolumnId:string, config: ColumnSortType) => {
    if (!config) return "app-table-unsorted";
    return config.columnId === currentcolumnId ? (config.direction === 'ascending' ? "app-table-sorted-asc" : "app-table-sorted-desc") : "app-table-unsorted";
};
/**
 * Gets the CSS class for the row based on its status and selection state.
 * @param status - The status of the job application.
 * @param selected - Whether the row is selected.
 * @returns The CSS class for the row.
 */
const getRowClass = (status: string, selected?: boolean) => {
    let className = '';
    switch (status.toLowerCase()) {
        case 'offer':
            className = 'status-offer';
            break;
        case 'rejected':
            className = 'status-rejected';
            break;
        default:
            className = '';
    }
    if (selected) {
        className += ' selected';
    }
    return className;
}

const filterDataByStatus = (data: JobItemType[], statusFilter: number): JobItemType[] => {
    return data.filter((item) => {
        const itemStatus = item.status.toLowerCase();
        switch (itemStatus) {
            case 'applied':
                return (statusFilter & DisplayStatus.Applied) !== 0;
            case 'interview':
                return (statusFilter & DisplayStatus.Interview) !== 0;
            case 'offer':
                return (statusFilter & DisplayStatus.Offer) !== 0;
            case 'rejected':
                return (statusFilter & DisplayStatus.Rejected) !== 0;
            default:
                return false;
        }
    });
}
export { sortData, getSortIcon, getRowClass, DisplayStatus, filterDataByStatus };