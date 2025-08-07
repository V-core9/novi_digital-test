import { Box, Button, Typography } from '@mui/material'
import { purple } from '@mui/material/colors'
import { useNavigate } from 'react-router-dom'

const primary = purple[500] // #f44336

export default function NotFound404() {
  const navigate = useNavigate()

  return (
    <Box>
      <Typography
        variant='h1'
        style={{ color: primary }}
      >
        404
      </Typography>
      <Typography
        variant='h6'
        style={{ color: primary }}
      >
        The page you’re looking for doesn’t exist.
      </Typography>
      <Button
        variant='contained'
        onClick={() => navigate(-1)}
      >
        Back Home
      </Button>
    </Box>
  )
}
