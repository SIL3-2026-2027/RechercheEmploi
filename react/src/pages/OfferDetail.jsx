import { useApp } from '../context/AppContext'
import Icon from '../components/Icon'

const cityOf = (localisation) => localisation.split(',')[0].trim()

export default function OfferDetail() {
  const {
    currentOffer: o, offers, employerOffers, loggedIn,
    showAuth, closeOfferDetail, openOfferDetail, handleApply,
  } = useApp()

  // Offre introuvable ou désactivée : on ne laisse pas une page blanche
  if (!o) {
    return (
      <div id="viewOfferDetail" className="active">
        <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: 12 }}>Cette offre n'est plus disponible</h1>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Elle a été retirée ou désactivée par l'employeur.</p>
          <button className="btn btn-primary" onClick={closeOfferDetail}>
            <Icon name="arrowLeft" size="sm" />
            Retour aux offres
          </button>
        </div>
      </div>
    )
  }

  // Offres similaires : même contrat ou même ville d'abord, puis on complète jusqu'à 3
  const autres = offers.filter((x) => x.id !== o.id)
  const proches = autres.filter((x) => x.contrat === o.contrat || cityOf(x.localisation) === cityOf(o.localisation))
  const list = [...proches, ...autres.filter((x) => !proches.includes(x))].slice(0, 3)

  // Nombre de candidatures : connu seulement pour les offres de l'employeur connecté
  const mine = employerOffers.find((e) => e.id === o.id)

  return (
    <div id="viewOfferDetail" className="active">
      <div className="detail-topbar">
        <div className="container detail-topbar-inner">
          <a className="back-link" onClick={closeOfferDetail}>
            <Icon name="arrowLeft" size="sm" />
            Retour aux offres
          </a>
          {!loggedIn && (
            <div className="auth-actions">
              <button className="btn btn-ghost" onClick={() => showAuth('login')}>Connexion</button>
              <button className="btn btn-primary" onClick={() => showAuth('register')}>Inscription</button>
            </div>
          )}
        </div>
      </div>

      <div className="detail-hero">
        <div className="container">
          <div className="detail-hero-content">
            <div className="detail-hero-logo" style={{ background: o.couleur }}>{o.initiales}</div>
            <div className="detail-hero-info">
              <h1>{o.titre}</h1>
              <p className="detail-hero-company">
                <Icon name="briefcase" size="sm" />
                <strong>{o.entreprise}</strong>
              </p>
              <div className="detail-meta-row">
                <span className="meta-pill"><Icon name="pin" size="sm" /><span>{o.localisation}</span></span>
                <span className="meta-pill"><Icon name="file" size="sm" /><span>{o.contrat}</span></span>
                <span className="meta-pill"><Icon name="clock" size="sm" /><span>{o.date}</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="detail-grid">
          <div className="detail-main">
            <div className="detail-card">
              <h2><Icon name="file" />Description du poste</h2>
              <p>{o.descriptionLongue || o.description}</p>
            </div>
            {o.missions?.length > 0 && (
              <div className="detail-card dynamic">
                <h2><Icon name="checkSquare" />Missions principales</h2>
                <ul>{o.missions.map((m, i) => <li key={i}>{m}</li>)}</ul>
              </div>
            )}
            {o.profil?.length > 0 && (
              <div className="detail-card dynamic">
                <h2><Icon name="user" />Profil recherché</h2>
                <ul>{o.profil.map((p, i) => <li key={i}>{p}</li>)}</ul>
              </div>
            )}
            {o.avantages?.length > 0 && (
              <div className="detail-card dynamic">
                <h2><Icon name="info" />Ce que nous offrons</h2>
                <ul>{o.avantages.map((a, i) => <li key={i}>{a}</li>)}</ul>
              </div>
            )}
          </div>

          <aside className="detail-sidebar">
            <div className="apply-card">
              <h3>Postuler à cette offre</h3>
              <p className="apply-sub">Votre profil et votre CV seront transmis directement à l'employeur.</p>
              <div className="apply-info">
                <div className="apply-info-row"><span>Type de contrat</span><span>{o.contrat}</span></div>
                <div className="apply-info-row"><span>Localisation</span><span>{cityOf(o.localisation)}</span></div>
                {mine && (
                  <div className="apply-info-row">
                    <span>Candidatures</span>
                    <span>{mine.candidatures} reçue{mine.candidatures > 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
              <button className="btn btn-primary btn-block btn-lg" onClick={handleApply}>
                <Icon name="send" size="sm" />
                Postuler maintenant
              </button>
              <p style={{ textAlign: 'center', marginTop: 14, fontSize: '0.82rem', color: 'var(--muted)' }}>
                Vous devez être connecté en tant que candidat pour postuler.
              </p>
            </div>

            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 800, marginBottom: 16, letterSpacing: '-0.02em' }}>
                Offres similaires
              </h3>
              <div className="similar-offers">
                {list.map((s) => (
                  <div className="similar-offer" key={s.id} onClick={() => openOfferDetail(s.id)}>
                    <div className="similar-logo" style={{ background: s.couleur }}>{s.initiales}</div>
                    <div className="similar-info">
                      <div className="similar-title">{s.titre}</div>
                      <div className="similar-company">{s.entreprise} · {cityOf(s.localisation)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
