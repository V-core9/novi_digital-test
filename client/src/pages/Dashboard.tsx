import { Button } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store'
import { logout } from '../store/slices/auth.slice'

export default function Dashboard() {
  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch()

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div>
      <h2>Welcome to the dashboard</h2>
      {user && <pre style={{ backgroundColor: '#eee', padding: '1rem' }}>{JSON.stringify(user, null, 2)}</pre>}
      <Button
        variant='outlined'
        color='secondary'
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  )
}
