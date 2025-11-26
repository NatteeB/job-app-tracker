import { useState, useEffect } from 'react';
import Table from './Table';
import Details from './Details';
import NewJobDialog from './NewJobDialog';
import { useAppDispatch, useAppSelector } from './hooks';
import { fetchData } from './dataSlice';
import './css/App.css';

function App() {
  const dispatch = useAppDispatch();
  const { items: data, status, error } = useAppSelector((state) => state.data);
  const [selectedId, setSelectedId] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchData());
  }, []);

  // Disable body scroll when dialog is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);


  if (status === 'loading') return <p>Loading data...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;

  return (
    <>
      <h2>Job Applications</h2>
      <button id="buttonOpener" onClick={() => setIsOpen(true)}>Add New Job</button>
      {isOpen && <NewJobDialog onClose={() => setIsOpen(false)} />}
      <div className="app-panel data-panel">
        <Table data={data} selectedId={selectedId} setSelectedId={setSelectedId} />
      </div>
      <div className="app-panel details-panel">
        <Details data={data} selectedId={selectedId} />
      </div>
    </>
  )
}

export default App
