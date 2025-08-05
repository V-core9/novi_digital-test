import { Button, Container, TextField, CircularProgress } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../../store/slices/auth.slice'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { RootState } from '../../store'

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const isLoading = useSelector((state: RootState) => state.auth.loading)

  const handleLogin = async () => {
    const res = await dispatch<any>(login({ email, password }))
    if (login.fulfilled.match(res)) {
      navigate('/dashboard')
    }
  }

  return (
    <Container maxWidth='xs'>
      <TextField
        label='Email'
        fullWidth
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label='Password'
        fullWidth
        type='password'
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        fullWidth
        onClick={handleLogin}
        variant='contained'
        sx={{ mt: 2 }}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : 'Login'}
      </Button>
    </Container>
  )
}

export default LoginPage()
