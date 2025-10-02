import { useState } from 'react';
import Table from './Table';
import Details from './Details';
import data from './data/jobDataSample.json';
import './css/App.css';

function App() {
  const [selectedId, setSelectedId] = useState(-1);

  return (
    <>
      <div className="app-panel">
        <h3>Applications List</h3>
      </div>

      <div className="app-panel data-panel">
        <Table data={data} selectedId={selectedId} setSelectedId={setSelectedId} />
      </div>
      <div className="app-panel data-panel">
        <Details data={data} selectedId={selectedId} />
      </div>
    </>
  )
}

export default App
