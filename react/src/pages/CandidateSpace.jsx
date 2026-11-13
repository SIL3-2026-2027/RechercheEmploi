import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { STATUS_LABELS } from '../constants'
import Icon, { RawSvg } from '../components/Icon'
import LogoMark from '../components/LogoMark'

function ApplicationList({ items, openOfferDetail }) {
  if (items.length === 0) {
    return (
      <div className="empty-space">
        <RawSvg name="file" />
        <h3>Aucune candidature pour le moment</h3>
        <p>Explorez les offres et postulez en un clic.</p>
      </div>
    )
  }
  return items.map((a) => (
    <div className="application-item" key={a.offerId} onClick={() => openOfferDetail(a.offerId)}>
      <div className="app-logo" style={{ background: a.couleur }}>{a.initiales}</div>
      <div className="app-info">
        <div className="app-title">{a.titre}</div>
        <div className="app-company">{a.entreprise}</div>
        <div className="app-date"><Icon name="clock" size="xs" />{a.date}</div>
      </div>
      <span className={`app-status status-${a.statut}`}>{STATUS_LABELS[a.statut]}</span>
    </div>
  ))
}

export default function CandidateSpace() {
  const { userApplications, userNotifications, applyBanner, openOfferDetail, showHome, logout, showToast } = useApp()
  const [tab, setTab] = useState('dashboard')

  const unread = userNotifications.filter((n) => n.unread).length
  const badgeStyle = { display: unread > 0 ? 'grid' : 'none' }
  const navLink = (id, icon, label, extra) => (
    <a className={tab === id ? 'active' : ''} onClick={() => setTab(id)}><Icon name={icon} />{label}{extra}</a>
  )

  return (
    <div className="space-view active" id="viewCandidateSpace">
      <header className="space-topbar">
        <div className="container space-topbar-inner">
          <a className="logo" onClick={showHome}>
            <LogoMark id="lgCand" />
            <span className="logo-text"><span className="brand-main">Chercheurs d'Emplois</span><span className="brand-sub">Espace candidat</span></span>
          </a>
          <div className="space-actions">
            <button className="icon-btn" onClick={() => setTab('notifications')} title="Notifications">
              <Icon name="bell" />
              <span className="count" style={badgeStyle}>{unread}</span>
            </button>
            <div className="user-chip" onClick={logout}>
              <div className="user-avatar">KD</div>
              <div><div className="user-name">Kèmi Dossou</div><div className="user-role">Candidat</div></div>
            </div>
          </div>
        </div>
      </header>

      <div className="space-layout">
        <aside className="space-sidebar">
          <nav className="sidebar-nav">
            <div className="sidebar-label">Espace candidat</div>
            {navLink('dashboard', 'grid', 'Tableau de bord')}
            {navLink('candidatures', 'fileLines', 'Mes candidatures')}
            {navLink('profil', 'user', 'Mon profil')}
            {navLink('cv', 'file', 'Mon CV')}
            {navLink('notifications', 'bell', 'Notifications', <span className="count-pill" style={badgeStyle}>{unread}</span>)}
            <div className="sidebar-divider"></div>
            <a onClick={logout}><Icon name="logout" />Déconnexion</a>
          </nav>
        </aside>

        <main className="space-main">
          {tab === 'dashboard' && (
            <div className="space-tab active">
              {applyBanner && (
                <div className="success-banner">
                  <div className="icon-big"><Icon name="check" size="lg" /></div>
                  <div><strong>Candidature envoyée avec succès !</strong><span>{applyBanner}</span></div>
                </div>
              )}
              <div className="space-welcome"><h1>Bonjour Kèmi</h1><p>Voici un aperçu de votre activité sur la plateforme.</p></div>
              <div className="space-stats">
                <div className="space-stat"><div className="space-stat-icon blue"><Icon name="file" /></div><div><div className="space-stat-value">{userApplications.length}</div><div className="space-stat-label">Candidatures envoyées</div></div></div>
                <div className="space-stat"><div className="space-stat-icon orange"><Icon name="clock" /></div><div><div className="space-stat-value">0</div><div className="space-stat-label">En attente de réponse</div></div></div>
                <div className="space-stat"><div className="space-stat-icon green"><Icon name="check" /></div><div><div className="space-stat-value">0</div><div className="space-stat-label">Entretiens obtenus</div></div></div>
                <div className="space-stat"><div className="space-stat-icon purple"><Icon name="user" /></div><div><div className="space-stat-value">85%</div><div className="space-stat-label">Profil complété</div></div></div>
              </div>
              <div className="space-section">
                <div className="space-section-header"><h2>Mes candidatures récentes</h2><button className="btn btn-ghost" onClick={() => setTab('candidatures')}>Voir tout</button></div>
                <div><ApplicationList items={userApplications.slice(0, 3)} openOfferDetail={openOfferDetail} /></div>
              </div>
            </div>
          )}

          {tab === 'candidatures' && (
            <div className="space-tab active">
              <div className="space-welcome"><h1>Mes candidatures</h1><p>Suivez l'avancement de toutes vos candidatures.</p></div>
              <div className="space-section"><div><ApplicationList items={userApplications} openOfferDetail={openOfferDetail} /></div></div>
            </div>
          )}

          {tab === 'profil' && (
            <div className="space-tab active">
              <div className="space-welcome"><h1>Mon profil</h1><p>Renseignez vos informations personnelles et professionnelles.</p></div>
              <div className="space-section">
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, marginBottom: 20 }}>Informations personnelles</h2>
                <div className="form-group"><label>Nom complet</label><input type="text" defaultValue="Kèmi Dossou" className="no-icon" /></div>
                <div className="form-group"><label>Adresse e-mail</label><input type="email" defaultValue="kemi.dossou@exemple.com" className="no-icon" /></div>
                <div className="form-group"><label>Localisation</label><input type="text" defaultValue="Cotonou, Bénin" className="no-icon" /></div>
                <div className="form-group"><label>Compétences</label><input type="text" defaultValue="React, Laravel, MySQL, Git" className="no-icon" /></div>
                <button className="btn btn-primary" onClick={() => showToast('Profil enregistré')}><Icon name="check" size="sm" />Enregistrer</button>
              </div>
            </div>
          )}

          {tab === 'cv' && (
            <div className="space-tab active">
              <div className="space-welcome"><h1>Mon CV</h1><p>Gérez votre CV au format PDF.</p></div>
              <div className="space-section">
                <div className="application-item" style={{ cursor: 'default' }}>
                  <div className="app-logo" style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)' }}><Icon name="file" size="lg" stroke="#fff" /></div>
                  <div className="app-info"><div className="app-title">CV_Kemi_Dossou.pdf</div><div className="app-company">Déposé il y a 3 jours · 245 Ko</div></div>
                  <button className="btn btn-ghost" onClick={() => showToast('Remplacement du CV…')}>Remplacer</button>
                </div>
                <div style={{ marginTop: 20 }}>
                  <button className="btn btn-primary" onClick={() => showToast('Nouveau CV téléversé')}><Icon name="upload" size="sm" />Téléverser un CV</button>
                </div>
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="space-tab active">
              <div className="space-welcome"><h1>Notifications</h1><p>Suivez les événements importants liés à vos candidatures.</p></div>
              <div className="space-section">
                <div>
                  {userNotifications.length === 0 ? (
                    <div className="empty-space"><RawSvg name="bell" /><h3>Aucune notification</h3><p>Vous serez informé des événements importants ici.</p></div>
                  ) : (
                    userNotifications.map((n, i) => (
                      <div className="application-item" key={i} style={{ cursor: 'default' }}>
                        <div className="app-logo" style={{ background: n.unread ? 'linear-gradient(135deg, #2563eb, #60a5fa)' : 'var(--bg-alt)' }}>
                          <Icon name="check" size="sm" stroke={n.unread ? '#fff' : 'var(--muted)'} />
                        </div>
                        <div className="app-info">
                          <div className="app-title">{n.titre}</div>
                          <div className="app-company" style={{ whiteSpace: 'normal' }}>{n.message}</div>
                          <div className="app-date"><Icon name="clock" size="xs" />{n.date}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
