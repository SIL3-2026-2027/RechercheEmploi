import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Icon from '../components/Icon'
import LogoMark from '../components/LogoMark'
import ActivityFeed from '../components/ActivityFeed'

export default function AdminSpace() {
  const { showHome, logout, showToast } = useApp()
  const [tab, setTab] = useState('dashboard')

  const navLink = (id, icon, label) => (
    <a className={tab === id ? 'active' : ''} onClick={() => setTab(id)}><Icon name={icon} />{label}</a>
  )

  return (
    <div className="space-view active" id="viewAdminSpace">
      <header className="space-topbar">
        <div className="container space-topbar-inner">
          <a className="logo" onClick={showHome}>
            <LogoMark id="lgAdmin" from="#1e293b" to="#475569" lens="#475569" />
            <span className="logo-text"><span className="brand-main">Chercheurs d'Emplois</span><span className="brand-sub">Administration</span></span>
          </a>
          <div className="space-actions">
            <div className="user-chip" onClick={logout}>
              <div className="user-avatar">AD</div>
              <div><div className="user-name">Administrateur</div><div className="user-role">Supervision</div></div>
            </div>
          </div>
        </div>
      </header>

      <div className="space-layout">
        <aside className="space-sidebar">
          <nav className="sidebar-nav">
            <div className="sidebar-label">Administration</div>
            {navLink('dashboard', 'grid', 'Tableau de bord')}
            {navLink('actualite', 'info', "Fil d'actualité")}
            {navLink('comptes', 'user', 'Gestion des comptes')}
            {navLink('moderation', 'shield', 'Modération des offres')}
            <div className="sidebar-divider"></div>
            <a onClick={logout}><Icon name="logout" />Déconnexion</a>
          </nav>
        </aside>

        <main className="space-main">
          {tab === 'dashboard' && (
            <div className="space-tab active">
              <div className="space-welcome"><h1>Tableau de bord Administrateur</h1><p>Supervision technique et modération de la plateforme.</p></div>
              <div className="space-stats">
                <div className="space-stat"><div className="space-stat-icon blue"><Icon name="user" /></div><div><div className="space-stat-value">3</div><div className="space-stat-label">Comptes inscrits</div></div></div>
                <div className="space-stat"><div className="space-stat-icon green"><Icon name="briefcase" /></div><div><div className="space-stat-value">6</div><div className="space-stat-label">Offres publiées</div></div></div>
                <div className="space-stat"><div className="space-stat-icon orange"><Icon name="info" /></div><div><div className="space-stat-value">0</div><div className="space-stat-label">Signalements</div></div></div>
              </div>
              <div className="space-section">
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, marginBottom: 20 }}>Activité récente</h2>
                <table className="admin-table">
                  <thead><tr><th>Date</th><th>Action</th><th>Détails</th></tr></thead>
                  <tbody>
                    <tr><td>Aujourd'hui, 10:45</td><td>Nouvelle inscription</td><td>techinnov@exemple.com (Employeur)</td></tr>
                    <tr><td>Aujourd'hui, 09:12</td><td>Nouvelle offre publiée</td><td>Développeur Full-Stack React / Laravel</td></tr>
                    <tr><td>Hier, 18:30</td><td>Candidature reçue</td><td>Kèmi Dossou a postulé à une offre</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'actualite' && <ActivityFeed onNavigate={setTab} />}

          {tab === 'comptes' && (
            <div className="space-tab active">
              <div className="space-welcome"><h1>Gestion des comptes</h1><p>Consultez et désactivez les comptes abusifs.</p></div>
              <div className="space-section">
                <table className="admin-table">
                  <thead><tr><th>Nom</th><th>Email</th><th>Rôle</th><th>Statut</th><th>Action</th></tr></thead>
                  <tbody>
                    {[
                      ['Kèmi Dossou', 'kemi.dossou@exemple.com', 'Candidat'],
                      ['TechInnov SARL', 'contact@techinnov.bj', 'Employeur'],
                      ['Studio Créatif', 'hello@studiocreatif.fr', 'Employeur'],
                    ].map(([nom, email, role]) => (
                      <tr key={email}>
                        <td>{nom}</td><td>{email}</td><td>{role}</td>
                        <td><span style={{ color: 'var(--success)' }}>Actif</span></td>
                        <td><button className="btn btn-danger btn-sm" onClick={() => showToast('Compte désactivé')}>Désactiver</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {tab === 'moderation' && (
            <div className="space-tab active">
              <div className="space-welcome"><h1>Modération des offres</h1><p>Retirez les offres signalées ou manifestement inappropriées.</p></div>
              <div className="space-section">
                <table className="admin-table">
                  <thead><tr><th>Offre</th><th>Entreprise</th><th>Signalements</th><th>Action</th></tr></thead>
                  <tbody>
                    <tr><td>Développeur Full-Stack React / Laravel</td><td>TechInnov SARL</td><td>0</td><td><button className="btn btn-ghost btn-sm" onClick={() => showToast('Offre retirée')}>Retirer</button></td></tr>
                    <tr><td>Designer UI / UX</td><td>Studio Créatif</td><td>1</td><td><button className="btn btn-danger btn-sm" onClick={() => showToast('Offre retirée')}>Retirer</button></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
