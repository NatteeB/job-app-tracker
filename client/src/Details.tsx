
import { type JobItemType } from './TableUtils';

type DetailsProps = {
    selectedId?: number;
    data: JobItemType[];
};
// The Details component displays detailed information about a selected job application.
// Note: The details field in the data is assumed to contain HTML content.
const Details = ({ selectedId = -1, data }: DetailsProps) => {
    const selectedItem = data.find(item => item.id === selectedId);
    return (
        <div>
            {
                selectedItem ? (
                    <>
                        <h3>{selectedItem.name}</h3>
                        <hr/>
                        <h4>Notes:</h4>
                        <div>{selectedItem.notes}</div>
                        <hr/>
                        <h4>Details:</h4>
                        <div dangerouslySetInnerHTML={{ __html: selectedItem.details }} />
                    </>
                ) : (
                    <p><strong>No application selected</strong></p>
                )}
        </div>
    )
}

export default Details