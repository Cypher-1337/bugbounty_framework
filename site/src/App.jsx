// App.jsx
import './App.css';
import './themes.css';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import Sidebar from './pages/global/sidebar/Sidebar';
import Dashboard from './pages/dashboard/Dashboard';
import { createContext, useState, useEffect } from 'react';
import Monitor from './pages/monitor/monitor';
import Display from './pages/monitor/Display';
import Login from './pages/login/Login';
import { AuthProvider } from './auth';
import ProtectedRoute from './components/protectedRoute';
export const AppContext = createContext()

function App() {

  const [data, setData] = useState('alive');
  const [darkMode, setDarkMode] = useState('dark');
  const [inputFilter, setInputFilter] = useState('');
  const [selectedView, setSelectedView] = useState('alive'); // Move selectedView state here

  const themes = [
    'dark-theme'
  ];

  useEffect(() => {
    // Select random theme on mount
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    document.documentElement.className = randomTheme;
  }, []);

  return (
  <AuthProvider>     {/* To check if you authenticated or not */}

    <AppContext.Provider value={{data, setData, darkMode, setDarkMode,  inputFilter, setInputFilter, selectedView, setSelectedView}}>
      <div className={`App ${darkMode === 'dark' ? "dark" : "light"}`}>

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