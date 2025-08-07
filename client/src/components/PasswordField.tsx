import { TextField } from '@mui/material'

function PasswordField({ register, errors }: any) {
  return (
    <TextField
      label='Password'
      type='password'
      fullWidth
      {...register('password', {
        required: 'Password is required',
        minLength: {
          value: 6,
          message: 'Password must be at least 6 characters'
        }
      })}
      error={!!errors.password}
      helperText={errors.password?.message}
      margin='normal'
    />
  )
}

export default PasswordField
