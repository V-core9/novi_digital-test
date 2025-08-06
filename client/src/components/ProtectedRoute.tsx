import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import type { RootState } from '../store'

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = useSelector((state: RootState) => state.auth.accessToken)
  if (!token) return <Navigate to='/login' />
  return children
}
