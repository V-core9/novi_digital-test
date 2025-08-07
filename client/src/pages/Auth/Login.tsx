import { useForm } from 'react-hook-form'
import { Container, Box, TextField, Button, Typography, CircularProgress } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from '../../store/slices/auth.slice'
import { useNavigate } from 'react-router-dom'
import type { SubmitHandler } from 'react-hook-form'
import type { RootState } from '../../store'

import PasswordField from '../../components/PasswordField'

interface LoginFormInputs {
  email: string
  password: string
}

export default function LoginForm() {
  const formRoot = useForm<LoginFormInputs>()

  const { register, handleSubmit, formState } = formRoot
  const { errors } = formState

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isLoading = useSelector((state: RootState) => state.auth.isLoading)

  const handleLogin: SubmitHandler<LoginFormInputs> = async ({ email, password }) => {
    const res = await dispatch<any>(authActions.login({ email, password }))
    if (authActions.login.fulfilled.match(res)) {
      navigate('/dashboard')
    }
  }

  return (
    <Container maxWidth='xs'>
      <Box
        component='form'
        onSubmit={handleSubmit((data, ev: any) => {
          ev.preventDefault()
          handleLogin(data)
        })}
        noValidate
        maxWidth={400}
        mx='auto'
        mt={8}
        p={4}
        boxShadow={3}
        borderRadius={2}
      >
        <Typography
          variant='h5'
          textAlign='center'
        >
          Login
        </Typography>

        <TextField
          label='Email'
          type='email'
          fullWidth
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address'
            }
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
          margin='normal'
        />

        <PasswordField
          register={register}
          errors={errors}
        />

        <Button
          type='submit'
          variant='contained'
          sx={{ mt: 2 }}
          disabled={isLoading}
          fullWidth
        >
          {isLoading ? <CircularProgress size={24} /> : 'Login'}
        </Button>
      </Box>

      <Button
        variant='outlined'
        sx={{ mt: 2 }}
        disabled={isLoading}
        onClick={(ev) => navigate('/register')}
        fullWidth
      >
        {isLoading ? <CircularProgress size={24} /> : 'Open Register Page'}
      </Button>
    </Container>
  )
}
