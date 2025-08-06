import { Button, Container, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import fetchWrapper from '../../utils/fetchWrapper'
import apiLocation from '../../configs/apiLocation'

export default function Register() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const navigate = useNavigate()

  const isEmailValid = (email: string) => /\S+@\S+\.\S+/.test(email)

  const handleSubmit = async () => {
    setError('')
    setSuccess('')

    if (!firstName.trim() || !lastName.trim()) {
      setError('First and last name are required.')
      return
    }

    if (!isEmailValid(email)) {
      setError('Invalid email address.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    try {
      await fetchWrapper.post(
        apiLocation + '/auth/register',
        {
          firstName,
          lastName,
          email,
          password
        },
        { auth: false }
      )
      setSuccess('Registration successful. You can now log in.')

      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    }
  }

  return (
    <Container maxWidth='xs'>
      <Typography
        variant='h5'
        gutterBottom
      >
        Register
      </Typography>
      <TextField
        label='First Name'
        fullWidth
        margin='normal'
        onChange={(e) => setFirstName(e.target.value)}
      />
      <TextField
        label='Last Name'
        fullWidth
        margin='normal'
        onChange={(e) => setLastName(e.target.value)}
      />
      <TextField
        label='Email'
        fullWidth
        margin='normal'
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label='Password'
        type='password'
        fullWidth
        margin='normal'
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <Typography color='error'>{error}</Typography>}
      {success && <Typography color='primary'>{success}</Typography>}
      <Button
        variant='contained'
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSubmit}
      >
        Register
      </Button>
    </Container>
  )
}
