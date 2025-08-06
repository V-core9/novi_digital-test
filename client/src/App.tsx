import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import LoginPage from './pages/Auth/Login'
import RegisterPage from './pages/Auth/Register'
import HomePage from './pages/HomePage/HomePage'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path='/'
            element={<HomePage />}
          />
          <Route
            path='/login'
            element={<LoginPage />}
          />
          <Route
            path='/register'
            element={<RegisterPage />}
          />
          <Route
            path='/dashboard'
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  )
}

export default App
