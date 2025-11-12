import { useState, useEffect } from 'react';
import Table from './Table';
import Details from './Details';
import { useAppDispatch, useAppSelector } from './hooks';
import { fetchData } from './dataSlice';
import './css/App.css';

function App() {
  const dispatch = useAppDispatch();
  const { items: data, status, error } = useAppSelector((state) => state.data);
  const [selectedId, setSelectedId] = useState(-1);

  useEffect(() => {
    dispatch(fetchData());
  }, []);

  if (status === 'loading') return <p>Loading data...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;

  return (
    <>
      <h2>Job Applications</h2>

      <div className="app-panel data-panel">
        <Table data={data} selectedId={selectedId} setSelectedId={setSelectedId} />
      </div>
      {/* <button onClick={() => saveChanges(data)}>Save</button> */}
      <div className="app-panel details-panel">
        <Details data={data} selectedId={selectedId} />
      </div>
    </>
  )
}

export default App
