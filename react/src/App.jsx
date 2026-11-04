import { useApp } from './context/AppContext'
import EmployerSpace from './pages/EmployerSpace'
import OfferModal from './components/OfferModal'
import Toast from './components/Toast'

// Chaque membre de l'équipe ajoute ici les pages de ses issues :
//   1. un import en haut du fichier
//   2. une ligne d'affichage dans le return (selon `view` de useApp())
export default function App() {
  const { view, role } = useApp()

  return (
    <>
      {view === 'space' && role === 'employeur' && <EmployerSpace />}
      <OfferModal />
      <Toast />
    </>
  )
}
