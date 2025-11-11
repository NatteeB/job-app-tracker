import { useMemo } from 'react';
import { DisplayStatus as ds } from './TableUtils';

type CheckboxProps = {
    label: string;
    checked: boolean;
    onChange?: (status: number, checked: boolean) => void;
};
const convertStatusLabelToNumber = (label: string): number => {
    switch (label.toLowerCase()) {
        case 'applied':
            return ds.Applied;
        case 'interview':
            return ds.Interview;
        case 'offer':
            return ds.Offer;
        case 'rejected':
            return ds.Rejected;
        default:
            return 0;
    }
}

const Checkbox = ({ label, checked, onChange }: CheckboxProps) => {
    const statusNumber = useMemo(() => convertStatusLabelToNumber(label), [label]);
    return (
        <label>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange?.(statusNumber, e.target.checked)}
            />
            {label}
        </label>
    );
}
export default Checkbox;