import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import Icon from '../components/Icon'
import LogoMark from '../components/LogoMark'

const EMPTY_FORM = { nom: '', secteur: '', localisation: '', siteWeb: '', description: '' }

const initialsOf = (nom) =>
  nom
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

export default function EmployerSpace() {
  const {
    employerProfile, saveEmployerProfile, employerOffers,
    openOfferModal, showToast, showHome, logout,
  } = useApp()
  const [tab, setTab] = useState('profil')
  const [form, setForm] = useState(EMPTY_FORM)

  const hasProfile = !!employerProfile

  // Remplit le formulaire avec le profil existant (mode modification)
  useEffect(() => {
    setForm(employerProfile ? { ...EMPTY_FORM, ...employerProfile } : EMPTY_FORM)
  }, [employerProfile])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    saveEmployerProfile({
      nom: form.nom.trim(),
      secteur: form.secteur.trim(),
      localisation: form.localisation.trim(),
      siteWeb: form.siteWeb.trim(),
      description: form.description.trim(),
    })
  }

  const onNewOffer = () => {
    if (!hasProfile) {
      showToast("Créez d'abord le profil de votre entreprise pour publier une offre.")
      setTab('profil')
      return
    }
    openOfferModal()
  }

  const navLink = (id, icon, label) => (
    <a className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>
      <Icon name={icon} />
      {label}
    </a>
  )

  const chipName = hasProfile ? employerProfile.nom : 'Mon entreprise'
  const chipInitials = hasProfile ? initialsOf(employerProfile.nom) : 'ME'

  return (
    <div className="space-view active" id="viewEmployerSpace">
      <header className="space-topbar">
        <div className="container space-topbar-inner">
          <a className="logo" onClick={showHome}>
            <LogoMark id="lgEmp" />
            <span className="logo-text">
              <span className="brand-main">Chercheurs d'Emplois</span>
              <span className="brand-sub">Espace employeur</span>
            </span>
          </a>
          <div className="space-actions">
            <div className="user-chip" onClick={logout}>
              <div className="user-avatar">{chipInitials}</div>
              <div>
                <div className="user-name">{chipName}</div>
                <div className="user-role">Employeur</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="space-layout">
        <aside className="space-sidebar">
          <nav className="sidebar-nav">
            <div className="sidebar-label">Espace employeur</div>
            {navLink('offres', 'briefcase', 'Mes offres')}
            {navLink('profil', 'user', 'Profil employeur')}
            <div className="sidebar-divider"></div>
            <a onClick={logout}>
              <Icon name="logout" />
              Déconnexion
            </a>
          </nav>
        </aside>

        <main className="space-main">
          {tab === 'offres' && (
            <div className="space-tab active">
              <div className="space-welcome">
                <h1>Mes offres d'emploi</h1>
                <p>Publiez vos offres et retrouvez-les ici.</p>
              </div>
              <div className="space-section">
                <div className="space-section-header">
                  <h2>Liste de mes offres</h2>
                  <button className="btn btn-primary btn-sm" onClick={onNewOffer}>
                    <Icon name="plus" size="sm" />
                    Nouvelle offre
                  </button>
                </div>
                <div>
                  {employerOffers.length === 0 ? (
                    <div className="empty-space">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" dangerouslySetInnerHTML={{ __html: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>' }} />
                      <h3>Aucune offre publiée</h3>
                      <p>Créez votre première offre pour recevoir des candidatures.</p>
                    </div>
                  ) : (
                    employerOffers.map((o) => (
                      <div className="application-item" key={o.id} style={{ cursor: 'default' }}>
                        <div className="app-logo" style={{ background: '#2563eb' }}>{o.titre.charAt(0)}</div>
                        <div className="app-info">
                          <div className="app-title">{o.titre}</div>
                          <div className="app-company">{o.localisation} · {o.contrat} · {o.date}</div>
                          <div className="app-date" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                            <Icon name="file" size="xs" />
                            {o.candidatures} candidature(s)
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {tab === 'profil' && (
            <div className="space-tab active">
              <div className="space-welcome">
                <h1>Profil employeur</h1>
                <p>
                  {hasProfile
                    ? "Modifiez les informations de votre entreprise."
                    : "Créez le profil de votre entreprise pour pouvoir publier des offres."}
                </p>
              </div>
              <div className="space-section">
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, marginBottom: 20 }}>
                  Informations de l'entreprise
                </h2>
                <form onSubmit={onSubmit}>
                  <div className="form-group">
                    <label htmlFor="empNom">Nom de l'entreprise</label>
                    <input id="empNom" type="text" className="no-icon" placeholder="Ex. TechInnov SARL" required value={form.nom} onChange={set('nom')} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="empSecteur">Secteur d'activité</label>
                    <input id="empSecteur" type="text" className="no-icon" placeholder="Ex. Informatique & Tech" required value={form.secteur} onChange={set('secteur')} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="empLoc">Localisation</label>
                    <input id="empLoc" type="text" className="no-icon" placeholder="Ex. Cotonou, Bénin" required value={form.localisation} onChange={set('localisation')} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="empSite">Site web (facultatif)</label>
                    <input id="empSite" type="url" className="no-icon" placeholder="https://www.exemple.com" value={form.siteWeb} onChange={set('siteWeb')} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="empDesc">Description</label>
                    <textarea id="empDesc" className="no-icon" placeholder="Présentez votre entreprise en quelques lignes…" required value={form.description} onChange={set('description')} />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    <Icon name="check" size="sm" />
                    {hasProfile ? 'Enregistrer les modifications' : 'Créer mon profil'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
