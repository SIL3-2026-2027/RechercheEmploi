import { useApp } from './context/AppContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import OfferDetail from './pages/OfferDetail'
import CandidateSpace from './pages/CandidateSpace'
import EmployerSpace from './pages/EmployerSpace'
import AdminSpace from './pages/AdminSpace'
import OfferModal from './components/OfferModal'
import Toast from './components/Toast'

export default function App() {
  const { view, role } = useApp()

  return (
    <>
      {view === 'home' && <Home />}
      {view === 'login' && <Login />}
      {view === 'register' && <Register />}
      {view === 'detail' && <OfferDetail />}
      {view === 'space' && role === 'candidat' && <CandidateSpace />}
      {view === 'space' && role === 'employeur' && <EmployerSpace />}
      {view === 'space' && role === 'admin' && <AdminSpace />}
      <OfferModal />
      <Toast />
    </>
  )
}
