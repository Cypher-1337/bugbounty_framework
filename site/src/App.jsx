import './App.css';

import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Sidebar from './pages/global/sidebar/Sidebar';
import Dashboard from './pages/dashboard/Dashboard';
import ChangesData from './pages/changes/Changes'
import { createContext, useState } from 'react';
import Monitor from './pages/monitor/monitor';
import Display from './pages/monitor/Display';
// import Endpoint from './pages/endpoints/Endpoint';
// import Filter from './pages/filter_subdomains/Filter'
import Login from './pages/login/Login';
// import Dorking from './pages/dorking/dorking';
import { AuthProvider } from './auth';
import ProtectedRoute from './components/protectedRoute';
export const AppContext = createContext()



function App() {
  

  const [data, setData] = useState('alive');
  const [darkMode, setDarkMode] = useState('dark');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [inputFilter, setInputFilter] = useState('');



  
  return (
  <AuthProvider>     {/* To check if you authenticated or not */}

    <AppContext.Provider value={{data, setData, darkMode, setDarkMode, isSidebarCollapsed, setIsSidebarCollapsed, inputFilter, setInputFilter}}>
      <div className={darkMode === 'dark' ? "App dark" : "App light"}>
        <Router>
          <Sidebar />
            <div className='nav-dashboard'>
            <Routes>
            <Route path='/login' element={<Login />} />
                <Route
                    path='/dashboard'
                    element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
                />  
                 <Route
                    path='/changes'
                    element={<ProtectedRoute><ChangesData /></ProtectedRoute>}
                />
                <Route
                    path='/monitor'
                    element={<ProtectedRoute><Monitor /></ProtectedRoute>}
                />
                <Route
                    path='/monitor/display'
                    element={<ProtectedRoute><Display /></ProtectedRoute>}
                />
                {/* <Route
                    path='/endpoints'
                    element={<ProtectedRoute><Endpoint /></ProtectedRoute>}
                /> */}
                {/* <Route
                    path='/filter_subdomains'
                    element={<ProtectedRoute><Filter /></ProtectedRoute>}
                /> */}
{/* 
                <Route
                    path='/dorking'
                    element={<ProtectedRoute><Dorking /></ProtectedRoute>}
                /> */}


                <Route path='/' element={<Navigate to='/dashboard' />} />
            </Routes>
            </div>
        </Router>
        
      </div>
    </AppContext.Provider>

  </AuthProvider>
  );
}

export default App;
