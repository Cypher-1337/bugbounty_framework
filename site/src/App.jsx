import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Sidebar from './pages/global/sidebar/Sidebar';
import Dashboard from './pages/dashboard/Dashboard';
import { createContext, useState } from 'react';

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
          <Routes>
            <Route path='/dashboard' element={<Dashboard />}></Route>
          </Routes>
      </Router>
      
    </div>
  </AppContext.Provider>
  );
}

export default App;
