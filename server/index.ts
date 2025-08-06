import app from './src/app'
import { connectToDB } from './src/config/mongoose' // Import the mongoose configuration file

connectToDB()

const port = process.env.PORT || 8080

app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`)
  /* eslint-enable no-console */
})
