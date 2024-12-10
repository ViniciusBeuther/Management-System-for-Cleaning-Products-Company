import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './modules/login/components/Login';
import Home from './modules/home/Home';
import ProtectedRoute from './routes/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Routes for login and authentication */}
        <Route path="/" element={ <Login /> } />
        <Route path="/home" element={ <ProtectedRoute> <Home /> </ProtectedRoute> } /> 
        
        {/* Routes for storage modules */}
        <Route path='/products' element={<ProtectedRoute> <p>products</p> </ProtectedRoute>} />
        <Route path='/storage' element={<ProtectedRoute> <p>storage</p> </ProtectedRoute>} />
        <Route path='/productReceivingForm' element={<ProtectedRoute> <p>receiving form</p> </ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default AppRoutes;