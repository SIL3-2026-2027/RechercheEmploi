import { useApp } from './context/AppContext'
import EmployerSpace from './pages/EmployerSpace'
import OfferModal from './components/OfferModal'
import Toast from './components/Toast'
import Home from './pages/Home' // TEST LOCAL
import Login from './pages/Login' // TEST LOCAL
import Register from './pages/Register' // TEST LOCAL

export default function App() {
  const { view, role } = useApp()

  return (
    <>
      {view === 'home' && <Home />} {/* TEST LOCAL */}
      {view === 'login' && <Login />} {/* TEST LOCAL */}
      {view === 'register' && <Register />} {/* TEST LOCAL */}
      {view === 'space' && role === 'employeur' && <EmployerSpace />}
      <OfferModal />
      <Toast />
    </>
  )
}
