import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import routes from './configs/routes'

function App() {
  return (
    <>
      <Router>
        <Routes>
          {routes.map((route) => (
            <Route {...route} />
          ))}
        </Routes>
      </Router>
    </>
  )
}

export default App
