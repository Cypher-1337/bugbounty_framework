import React, { useState } from 'react'
import Add from './Add';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import GridViewIcon from '@mui/icons-material/GridView';
import Dashboard from './Dashboard';


function Monitor() {
  const [activeTab, setActiveTab] = useState(1);

  const toggleTab = (index) => {
    setActiveTab(index);
  };

  return (
    <div className="container">
      <div className="bloc-tabs">
        <div
          className={activeTab === 1 ? 'tabs active-tabs' : 'tabs'}
          onClick={() => toggleTab(1)}
        >
          Dashboard <GridViewIcon color="primary" className='link-icon' sx={{margin: "15px 0 0 0", fontSize: "20px"}}/>
        </div>

        <div
          className={activeTab === 2 ? 'tabs active-tabs' : 'tabs'}
          onClick={() => toggleTab(2)}
        >
            Add <AddCircleIcon color="success" className='link-icon' sx={{margin: "15px 0 0 0", fontSize: "20px"}}/>

        </div>

        
      </div>

      <div className="content-tabs">
        <div className={activeTab === 1 ? 'content active-content' : 'content'}>
          <Dashboard />
        </div>

        <div className={activeTab === 2 ? 'content active-content' : 'content'}>
          <Add />

        </div>

        <div className={activeTab === 3 ? 'content active-content' : 'content'}>
          
        </div>
      </div>
    </div>
  )
}

export default Monitor