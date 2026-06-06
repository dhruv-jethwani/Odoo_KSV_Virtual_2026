import { useEffect, useState } from 'react'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import Landing from './components/common/Landing'
import Home from './components/common/Home'

const getPageFromHash = () => {
  switch (window.location.hash) {
    case '#login':
      return 'login'
    case '#signup':
    case '#register':
      return 'register'
    case '#home':
      return 'home'
    default:
      return 'landing'
  }
}

function App() {
  const [page, setPage] = useState(getPageFromHash)

  useEffect(() => {
    const handleHashChange = () => setPage(getPageFromHash())

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  if (page === 'login') {
    return <Login />
  }

  if (page === 'register') {
    return <Register />
  }

  if (page === 'home') {
    return <Home />
  }

  return <Landing />
}

export default App