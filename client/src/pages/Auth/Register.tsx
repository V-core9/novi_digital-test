import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { TextField, Snackbar, Alert, Box, Container, Button, Typography, CircularProgress } from '@mui/material'
import type { SnackbarCloseReason } from '@mui/material'

import LaunchIcon from '@mui/icons-material/Launch'

import fetchWrapper from '../../utils/fetchWrapper'
import apiLocation from '../../configs/apiLocation'

interface FormValues {
  firstName: string
  lastName: string
  email: string
  password: string
}

export default function RegisterPage(): JSX.Element {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>()

  const [registerError, setRegisterError] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit: SubmitHandler<FormValues> = async ({ firstName, lastName, email, password }: FormValues) => {
    setIsLoading((prev) => true)
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
      setShowToast(true)
      setRegisterError('')
    } catch (err: any) {
      setRegisterError(err.message || 'Registration failed')
    }
    setIsLoading((prev) => false)
  }

  const handleClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return
    }
    setShowToast(false)
  }

  return (
    <Container maxWidth='xs'>
      <Box
        maxWidth={400}
        mx='auto'
        mt={8}
        p={4}
        boxShadow={3}
        borderRadius={2}
      >
        <Snackbar
          open={showToast}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity='success'
            variant='filled'
            sx={{ width: '100%' }}
          >
            Registration Successful. You can now login.
            <Button
              variant='contained'
              onClick={() => navigate('/login')}
              size='small'
              endIcon={<LaunchIcon />}
              sx={{ ml: 2 }}
            >
              Goto Login
            </Button>
          </Alert>
        </Snackbar>

        <Typography
          variant='h5'
          gutterBottom
        >
          Register
        </Typography>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <TextField
            fullWidth
            label='First Name'
            margin='normal'
            {...register('firstName', { required: 'First name is required' })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />

          <TextField
            fullWidth
            label='Last Name'
            margin='normal'
            {...register('lastName', { required: 'Last name is required' })}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />

          <TextField
            fullWidth
            label='Email'
            margin='normal'
            type='email'
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email'
              }
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            fullWidth
            label='Password'
            margin='normal'
            type='password'
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          {registerError && <Typography color='error'>Error: {registerError}</Typography>}

          <Button
            fullWidth
            variant='contained'
            color='primary'
            type='submit'
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </form>
      </Box>
      <Button
        variant='outlined'
        sx={{ mt: 2 }}
        disabled={isLoading}
        onClick={(ev) => navigate('/login')}
        fullWidth
      >
        {isLoading ? <CircularProgress size={24} /> : 'Open Login Page'}
      </Button>
    </Container>
  )
}
