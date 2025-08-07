import ProtectedRoute from '../components/ProtectedRoute'

// Public Pages
import LoginPage from '../pages/Auth/Login'
import RegisterPage from '../pages/Auth/Register'
import HomePage from '../pages/HomePage/HomePage'

// Protected Pages
import Dashboard from '../pages/protectedPages/Dashboard'

// Error Pages
import NotFound404 from '../pages/errors/NotFound404'

const routes = [
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: <NotFound404 />
  }
]

export default routes
