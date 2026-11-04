import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { OFFRES as INITIAL_OFFRES } from '../data'
import { STATUS_LABELS } from '../constants'

const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

export function AppProvider({ children }) {
  // Navigation : home | detail | login | register | space
  const [view, setView] = useState('home')
  const [previousView, setPreviousView] = useState('home')
  const [detailReturn, setDetailReturn] = useState('home')
  const [currentOfferId, setCurrentOfferId] = useState(null)

  // Session simulée
  const [role, setRole] = useState('candidat') // candidat | employeur | admin
  const [loggedIn, setLoggedIn] = useState(false)
  const [pendingOfferId, setPendingOfferId] = useState(null)
  const [registerRole, setRegisterRole] = useState('candidat')

  // Données
  const [offers, setOffers] = useState(INITIAL_OFFRES)
  const [filters, setFilters] = useState({ keyword: '', localisation: '', contrat: '' })
  const [userApplications, setUserApplications] = useState([])
  const [userNotifications, setUserNotifications] = useState([])
  const [applyBanner, setApplyBanner] = useState(null)
  const [employerOffers, setEmployerOffers] = useState([
    { id: 1, titre: 'Développeur Full-Stack React / Laravel', localisation: 'Cotonou, Bénin', contrat: 'CDI', date: 'Il y a 2 jours', statut: 'active', candidatures: 3 },
    { id: 2, titre: 'Designer UI / UX', localisation: 'Paris, France', contrat: 'CDD', date: 'Il y a 4 jours', statut: 'active', candidatures: 1 },
  ])
  const [employerApplications, setEmployerApplications] = useState([
    { id: 1, offerId: 1, candidat: 'Kèmi Dossou', email: 'kemi.dossou@exemple.com', date: 'Il y a 1 jour', statut: 'recue', cv: 'CV_Kemi_Dossou.pdf' },
    { id: 2, offerId: 1, candidat: 'Francis A.', email: 'francis.a@exemple.com', date: 'Il y a 2 jours', statut: 'examen', cv: 'CV_Francis_A.pdf' },
    { id: 3, offerId: 2, candidat: 'Esméralda K.', email: 'esmeralda.k@exemple.com', date: 'Il y a 3 jours', statut: 'acceptee', cv: 'CV_Esmeralda_K.pdf' },
  ])

  // Profil employeur (null tant que le profil n'est pas créé)
  const [employerProfile, setEmployerProfile] = useState(null)

  // Modale d'offre
  const [offerModal, setOfferModal] = useState({ open: false, editId: null })

  // Toast
  const [toast, setToast] = useState({ message: '', show: false })
  const toastTimer = useRef(null)
  const showToast = useCallback((message) => {
    setToast({ message, show: true })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, show: false })), 3200)
  }, [])

  const bannerTimer = useRef(null)
  useEffect(() => () => { clearTimeout(toastTimer.current); clearTimeout(bannerTimer.current) }, [])

  const currentOffer = offers.find((o) => o.id === currentOfferId) || null
  const scrollTop = () => window.scrollTo(0, 0)

  // --- Navigation ---
  const showHome = () => { setView('home'); scrollTop() }

  const showAuth = (type, roleToSelect = null, isFromApply = false) => {
    if (!isFromApply) setPreviousView('home')
    if (type === 'register' && roleToSelect === 'employeur') setRegisterRole('employeur')
    setView(type)
    scrollTop()
  }

  const cancelAuth = () => {
    setView(previousView === 'detail' && currentOffer ? 'detail' : 'home')
    scrollTop()
  }

  const openOfferDetail = (id) => {
    setDetailReturn(view === 'space' ? 'space' : 'home')
    setCurrentOfferId(id)
    setPreviousView('detail')
    setView('detail')
    scrollTop()
  }

  const closeOfferDetail = () => { setView(detailReturn); scrollTop() }

  // --- Candidatures ---
  const applyToOffer = (offerId) => {
    const o = offers.find((x) => x.id === offerId)
    if (!o) return
    if (userApplications.some((a) => a.offerId === offerId)) {
      showToast('Vous avez déjà postulé à cette offre.')
      return
    }
    setUserApplications((prev) => [
      { offerId: o.id, titre: o.titre, entreprise: o.entreprise, initiales: o.initiales, couleur: o.couleur, date: "À l'instant", statut: 'recue' },
      ...prev,
    ])
    setUserNotifications((prev) => [
      { titre: 'Candidature envoyée', message: `Votre candidature pour « ${o.titre} » a bien été transmise à ${o.entreprise}.`, date: "À l'instant", unread: true },
      ...prev,
    ])
    setApplyBanner(`Votre candidature pour « ${o.titre} » a bien été transmise à l'employeur.`)
    clearTimeout(bannerTimer.current)
    bannerTimer.current = setTimeout(() => setApplyBanner(null), 6000)
  }

  const handleApply = () => {
    if (!currentOffer) return
    if (loggedIn && role !== 'candidat') {
      showToast('Seuls les candidats peuvent postuler.')
      return
    }
    if (loggedIn && role === 'candidat') {
      applyToOffer(currentOffer.id)
      setView('space')
      scrollTop()
      return
    }
    setPendingOfferId(currentOffer.id)
    showToast('Connectez-vous pour finaliser votre candidature…')
    setTimeout(() => showAuth('login', null, true), 900)
  }

  // --- Auth simulée ---
  const login = (email, onDone) => {
    const mail = email.toLowerCase()
    const newRole = mail.includes('techinnov') || mail.includes('employeur') ? 'employeur' : mail.includes('admin') ? 'admin' : 'candidat'
    setRole(newRole)
    showToast('Connexion en cours…')
    setTimeout(() => {
      setLoggedIn(true)
      if (pendingOfferId && newRole === 'candidat') {
        applyToOffer(pendingOfferId)
        setPendingOfferId(null)
      }
      setView('space')
      scrollTop()
      onDone && onDone()
    }, 800)
  }

  const logout = () => {
    setRole('candidat')
    setLoggedIn(false)
    showHome()
    showToast('Vous êtes déconnecté.')
  }

  // --- Employeur ---
  const updateApplicationStatus = (appId, newStatus) => {
    const app = employerApplications.find((a) => a.id === appId)
    if (!app) return
    setEmployerApplications((prev) => prev.map((a) => (a.id === appId ? { ...a, statut: newStatus } : a)))
    showToast('Statut mis à jour : ' + STATUS_LABELS[newStatus])
    if (newStatus !== 'recue') {
      const offer = offers.find((o) => o.id === app.offerId)
      setUserNotifications((prev) => [
        {
          titre: 'Statut de candidature mis à jour',
          message: `Votre candidature pour « ${offer ? offer.titre : 'une offre'} » est maintenant : ${STATUS_LABELS[newStatus]}.`,
          date: "À l'instant",
          unread: true,
        },
        ...prev,
      ])
    }
  }

  const toggleOfferStatus = (offerId) => {
    const offer = employerOffers.find((o) => o.id === offerId)
    if (!offer) return
    const next = offer.statut === 'active' ? 'inactive' : 'active'
    setEmployerOffers((prev) => prev.map((o) => (o.id === offerId ? { ...o, statut: next } : o)))
    showToast(next === 'active' ? 'Offre réactivée' : 'Offre désactivée')
  }

  const openOfferModal = (editId = null) => setOfferModal({ open: true, editId })
  const closeOfferModal = () => setOfferModal({ open: false, editId: null })

  const submitOffer = ({ editId, titre, localisation, contrat, description, missions, profil }) => {
    if (editId) {
      setEmployerOffers((prev) => prev.map((o) => (o.id === editId ? { ...o, titre, localisation, contrat } : o)))
      setOffers((prev) =>
        prev.map((o) => (o.id === editId ? { ...o, titre, localisation, contrat, description, descriptionLongue: description, missions, profil } : o))
      )
      showToast('Offre modifiée avec succès')
    } else {
      const newId = Math.max(0, ...offers.map((o) => o.id)) + 1
      setOffers((prev) => [
        ...prev,
        {
          id: newId, titre, entreprise: 'TechInnov SARL', initiales: 'TI', couleur: '#2563eb', localisation, contrat,
          date: "À l'instant", description, descriptionLongue: description, missions, profil,
          avantages: ['Rémunération attractive', 'Ambiance collaborative'],
        },
      ])
      setEmployerOffers((prev) => [...prev, { id: newId, titre, localisation, contrat, date: "À l'instant", statut: 'active', candidatures: 0 }])
      showToast('Offre publiée avec succès !')
    }
    closeOfferModal()
  }

  // --- Profil employeur ---
  const saveEmployerProfile = (profile) => {
    const isCreation = !employerProfile
    setEmployerProfile(profile)
    showToast(isCreation ? 'Profil employeur créé avec succès' : 'Profil employeur modifié avec succès')
  }

  const value = {
    view, role, loggedIn, registerRole, setRegisterRole,
    offers, filters, setFilters, currentOffer,
    userApplications, userNotifications, applyBanner,
    employerOffers, employerApplications,
    employerProfile, saveEmployerProfile,
    offerModal, toast,
    showToast, showHome, showAuth, cancelAuth, openOfferDetail, closeOfferDetail,
    handleApply, login, logout,
    updateApplicationStatus, toggleOfferStatus, openOfferModal, closeOfferModal, submitOffer,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
