import { useState, useEffect } from 'react';
import Table from './Table';
import Details from './Details';
import './css/App.css';
import type { JobItemType } from './TableUtils';

function App() {
  const [selectedId, setSelectedId] = useState(-1);
  const [data, setData] = useState([] as JobItemType[]);

  useEffect(() => {
    fetch("http://localhost:8000/data")
      .then(res => res.json())
      .then(setData);
  }, []);

  // const saveChanges = async (updated: JobItemType[]) => {
  //   await fetch("http://localhost:8000/data", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(updated),
  //   });
  //   setData(updated);
  // };

  return (
    <>
      <div className="app-panel">
        <h3>Applications List</h3>
      </div>

      <div className="app-panel data-panel">
        <Table data={data} selectedId={selectedId} setSelectedId={setSelectedId} />
      </div>
      {/* <button onClick={() => saveChanges(data)}>Save</button> */}
      <div className="app-panel data-panel">
        <Details data={data} selectedId={selectedId} />
      </div>
    </>
  )
}

export default App
