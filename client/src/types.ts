export type JobItemType = { 
    id: number; 
    company: string; 
    title: string; 
    website: string; 
    applied_date: string; 
    updated_date: string; 
    status: string; 
    notes: string,
    details: string 
};

export type ColumnSortType = { 
    columnId: keyof JobItemType; 
    direction: 'ascending' | 'descending' 
} | null;