import './App.css';

import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Sidebar from './pages/global/sidebar/Sidebar';
import Dashboard from './pages/dashboard/Dashboard';
import { createContext, useState, useEffect } from 'react';
import Monitor from './pages/monitor/monitor';
import Display from './pages/monitor/Display';
import Fuzz from './pages/fuzzing/Fuzz';

export const AppContext = createContext()



function App() {
  

  const [data, setData] = useState('alive');
  const [darkMode, setDarkMode] = useState('dark');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [inputFilter, setInputFilter] = useState('');



  
  return (
  <AppContext.Provider value={{data, setData, darkMode, setDarkMode, isSidebarCollapsed, setIsSidebarCollapsed, inputFilter, setInputFilter}}>
    <div className={darkMode === 'dark' ? "App dark" : "App light"}>
      <Router>
        <Sidebar />
        <div className='nav-dashboard'>
            <Routes>
              <Route path='/dashboard' element={<Dashboard />}></Route>
              <Route path='/monitor' element={<Monitor />}></Route>
              <Route path='/fuzz' element={<Fuzz />}></Route>
              <Route path='/monitor/display' element={<Display />}></Route>
              <Route path='/' element={<Navigate to='/dashboard' />}></Route>
            </Routes>
        </div>
      </Router>
      
    </div>
  </AppContext.Provider>
  );
}

export default App;
