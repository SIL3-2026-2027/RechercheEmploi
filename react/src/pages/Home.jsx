import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import { CATEGORIES } from '../data'
import Icon, { RawSvg } from '../components/Icon'
import LogoMark from '../components/LogoMark'

function Header() {
  const { showHome, showAuth } = useApp()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeNav = () => setMobileOpen(false)

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`} id="siteHeader">
      <div className="container header-inner">
        <a href="#accueil" className="logo" onClick={(e) => { e.preventDefault(); showHome() }}>
          <LogoMark id="logoGrad" />
          <span className="logo-text"><span className="brand-main">Chercheurs d'Emplois</span><span className="brand-sub">Plateforme emploi</span></span>
        </a>

        <nav className={`main-nav${mobileOpen ? ' mobile-open' : ''}`} id="mainNav">
          <a href="#accueil" onClick={closeNav}><Icon name="home" />Accueil</a>
          <a href="#a-propos" onClick={closeNav}><Icon name="info" />À propos</a>
          <a href="#fonctionnalites" onClick={closeNav}><Icon name="grid" />Fonctionnalités</a>
        </nav>

        <div className="auth-actions">
          <button className="btn btn-ghost" onClick={() => showAuth('login')}><Icon name="login" size="sm" />Connexion</button>
          <button className="btn btn-primary" onClick={() => showAuth('register')}><Icon name="userPlus" size="sm" />Inscription</button>
          <button className="burger" onClick={() => setMobileOpen((o) => !o)}><Icon name="menu" /></button>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  const { showAuth } = useApp()
  return (
    <section className="hero" id="accueil">
      <div className="container hero-content">
        <span className="hero-badge"><span className="badge-dot"></span>Plateforme de recherche et de publication d'emplois</span>
        <h1>L'emploi qui <em>vous correspond</em>, à portée de clic.</h1>
        <p className="hero-subtitle">Consultez les offres, préparez votre CV et suivez vos candidatures en un seul endroit. Les employeurs publient, vous candidatez — simplement.</p>
        <div className="hero-cta">
          <a href="#offres" className="btn btn-primary btn-lg">Découvrir les offres<Icon name="arrowRight" size="sm" /></a>
          <button className="btn btn-ghost btn-lg" onClick={() => showAuth('register')}><Icon name="userPlus" size="sm" />Créer un compte</button>
        </div>
        <div className="hero-trust">
          <div className="hero-trust-item"><Icon name="shield" />Données protégées</div>
          <div className="hero-trust-item"><Icon name="check" />Candidature en un clic</div>
          <div className="hero-trust-item"><Icon name="clock" />Suivi en temps réel</div>
        </div>
        <div className="hero-preview">
          <div className="preview-window">
            <div className="preview-topbar"><span className="preview-dot r"></span><span className="preview-dot y"></span><span className="preview-dot g"></span></div>
            <div className="preview-body">
              {[undefined, '#ede9fe', '#d1fae5'].map((bg, i) => (
                <div className="preview-card" key={i}>
                  <div className="preview-chip" style={bg ? { background: bg } : undefined}></div>
                  <div className="preview-line mid"></div><div className="preview-line short"></div><div className="preview-line"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="a-propos">
      <div className="container">
        <div className="about-grid">
          <div className="about-content">
            <span className="eyebrow">À propos</span>
            <h2>La plateforme qui relie les talents aux opportunités</h2>
            <p>Chercheurs d'Emplois est une plateforme pédagogique conçue pour centraliser la recherche d'emploi et le recrutement. Candidats et employeurs y trouvent un espace unique, clair et sécurisé pour interagir.</p>
            <p>Notre objectif : simplifier chaque étape — de la création du profil jusqu'au suivi de la candidature — tout en garantissant la confidentialité des données et le contrôle des accès.</p>
            <ul className="about-values">
              <li><div className="about-value-icon"><Icon name="shield" /></div><div><strong>Sécurité &amp; confidentialité</strong><span>Mots de passe hachés, autorisations contrôlées côté serveur, données strictement personnelles.</span></div></li>
              <li><div className="about-value-icon"><Icon name="clock" /></div><div><strong>Rapidité &amp; efficacité</strong><span>Des parcours courts, des pages qui chargent vite, une recherche fluide pour tous les rôles.</span></div></li>
              <li><div className="about-value-icon"><Icon name="users" /></div><div><strong>Pour tous les profils</strong><span>Candidats en recherche, recruteurs, entreprises — chacun dispose de son espace dédié.</span></div></li>
            </ul>
          </div>
          <div className="about-visual">
            <div className="about-visual-inner">
              <div className="about-card"><div className="about-card-head"><div className="about-card-icon blue"><Icon name="file" /></div><div><div className="about-card-title">Profil candidat</div><div className="about-card-sub">Complété à 85 %</div></div></div><div className="about-bar"><span style={{ width: '85%' }}></span></div></div>
              <div className="about-card"><div className="about-card-head"><div className="about-card-icon green"><Icon name="briefcase" /></div><div><div className="about-card-title">Offre publiée</div><div className="about-card-sub">12 candidatures reçues</div></div></div><div className="about-bar"><span style={{ width: '62%' }}></span></div></div>
              <div className="about-card"><div className="about-card-head"><div className="about-card-icon orange"><Icon name="bell" /></div><div><div className="about-card-title">Notification</div><div className="about-card-sub">Statut mis à jour</div></div></div><div className="about-bar"><span style={{ width: '100%' }}></span></div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const FEATURES = [
  { icon: 'userPlus', title: 'Inscription & rôles', text: "Créez un compte en tant que candidat ou employeur, en quelques secondes, avec contrôle d'accès par rôle." },
  { icon: 'fileLines', title: 'Profil & CV', text: 'Renseignez vos compétences, formation et expérience, et joignez votre CV PDF en toute sécurité.' },
  { icon: 'search', title: 'Recherche avancée', text: 'Filtrez les offres par mots-clés, localisation et type de contrat pour trouver la bonne opportunité.' },
  { icon: 'send', title: 'Candidature en un clic', text: 'Postulez directement avec votre profil et votre CV. Une seule candidature par offre et par candidat.' },
  { icon: 'bars', title: 'Tableau de bord', text: 'Employeurs : suivez vos offres et le nombre de candidatures reçues. Candidats : suivez chaque statut.' },
  { icon: 'bell', title: 'Notifications internes', text: 'Soyez informé à chaque nouvelle candidature ou changement de statut, directement dans la plateforme.' },
]

function Features() {
  return (
    <section id="fonctionnalites">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Fonctionnalités</span>
          <h2>Tout ce dont vous avez besoin, au même endroit</h2>
          <p>Une plateforme pensée pour les candidats et les employeurs — simple, rapide et sécurisée.</p>
        </div>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon"><Icon name={f.icon} size="lg" /></div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Categories() {
  const { showToast } = useApp()
  const onClick = (nom) => {
    showToast('Catégorie : ' + nom)
    document.getElementById('offres').scrollIntoView({ behavior: 'smooth' })
  }
  return (
    <section id="categories">
      <div className="categories-banner">
        <div className="container">
          <div className="categories-banner-head">
            <span className="eyebrow">Catégories</span>
            <h2>Explorez par domaine d'activité</h2>
            <p>Cliquez sur une catégorie pour découvrir les offres correspondantes dans la section ci-dessous.</p>
          </div>
        </div>
      </div>
      <div className="container categories-wrap">
        <div className="categories-grid" id="categoriesGrid">
          {CATEGORIES.map((cat) => (
            <div className="category-card" key={cat.nom} onClick={() => onClick(cat.nom)}>
              <div className="category-icon">
                <svg className="icon icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: cat.icon }} />
              </div>
              <div><div className="category-name">{cat.nom}</div><div className="category-count">{cat.compte} offres disponibles</div></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Offers() {
  const { offers, filters, setFilters, openOfferDetail, showToast } = useApp()

  const onSubmit = (e) => {
    e.preventDefault()
    const f = {
      keyword: e.target.keyword.value.trim(),
      localisation: e.target.localisation.value.trim(),
      contrat: e.target.contrat.value,
    }
    setFilters(f)
    if (f.keyword || f.localisation || f.contrat) showToast('Filtres appliqués')
  }

  const kw = filters.keyword.toLowerCase()
  const loc = filters.localisation.toLowerCase()
  const filtered = offers.filter((o) => {
    const matchKw = !kw || o.titre.toLowerCase().includes(kw) || o.entreprise.toLowerCase().includes(kw) || o.description.toLowerCase().includes(kw)
    const matchLoc = !loc || o.localisation.toLowerCase().includes(loc)
    const matchContrat = !filters.contrat || o.contrat === filters.contrat
    return matchKw && matchLoc && matchContrat
  })

  return (
    <section id="offres">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Offres d'emploi</span>
          <h2>Les dernières opportunités publiées</h2>
          <p>Utilisez les filtres ci-dessous pour affiner votre recherche selon vos critères.</p>
        </div>
        <form className="filters-bar" onSubmit={onSubmit}>
          <div className="filter-field"><label htmlFor="filterKeyword">Mot-clé</label><div className="filter-input-wrap"><Icon name="search" /><input id="filterKeyword" name="keyword" type="text" placeholder="Ex. développeur, marketing…" defaultValue={filters.keyword} /></div></div>
          <div className="filter-field"><label htmlFor="filterLoc">Localisation</label><div className="filter-input-wrap"><Icon name="pin" /><input id="filterLoc" name="localisation" type="text" placeholder="Ex. Cotonou, Paris…" defaultValue={filters.localisation} /></div></div>
          <div className="filter-field"><label htmlFor="filterContract">Type de contrat</label>
            <select id="filterContract" name="contrat" defaultValue={filters.contrat}>
              <option value="">Tous</option><option value="CDI">CDI</option><option value="CDD">CDD</option><option value="Stage">Stage</option><option value="Freelance">Freelance</option>
            </select>
          </div>
          <button type="submit" className="btn-filter"><Icon name="filter" size="sm" />Filtrer</button>
        </form>
        <div className="results-info">
          <span className="results-count"><strong>{filtered.length}</strong> offre{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}</span>
        </div>
        <div className="offers-grid" id="offersGrid">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <RawSvg name="searchMinus" />
              <h3>Aucune offre ne correspond à votre recherche</h3>
              <p>Essayez de modifier les filtres ou d'élargir vos critères.</p>
            </div>
          ) : (
            filtered.map((o) => (
              <article className="offer-card" key={o.id} onClick={() => openOfferDetail(o.id)}>
                <div className="offer-header">
                  <div className="company-logo" style={{ background: o.couleur }}>{o.initiales}</div>
                  <div><h3 className="offer-title">{o.titre}</h3><p className="offer-company">{o.entreprise}</p></div>
                </div>
                <div className="offer-badges"><span className={`contract-badge ${o.contrat.toLowerCase().replace(/\s/g, '')}`}>{o.contrat}</span></div>
                <div className="offer-meta"><span><Icon name="pin" size="sm" />{o.localisation}</span></div>
                <p className="offer-desc">{o.description}</p>
                <div className="offer-footer">
                  <span className="offer-date"><Icon name="clock" size="xs" />{o.date}</span>
                  <span className="offer-link">Voir l'offre<Icon name="arrowRight" size="sm" /></span>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

function EmployerCta() {
  const { showAuth } = useApp()
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-card">
          <div className="cta-text">
            <h2>Vous recrutez ? Publiez votre offre dès aujourd'hui.</h2>
            <p>Créez un compte employeur, décrivez votre besoin et recevez des candidatures qualifiées. Suivez chaque profil et mettez à jour les statuts en un clic.</p>
            <div className="cta-actions">
              <button className="btn btn-light btn-lg" onClick={() => showAuth('register', 'employeur')}><Icon name="plus" size="sm" />Publier une offre</button>
              <a href="#fonctionnalites" className="btn btn-outline-light btn-lg">Voir les fonctionnalités</a>
            </div>
          </div>
          <div className="cta-visual">
            <div className="mini-card"><div className="mini-icon"><Icon name="briefcase" /></div><div><strong>Publication rapide</strong><small>Une offre en ligne en quelques minutes</small></div></div>
            <div className="mini-card"><div className="mini-icon"><Icon name="inbox" /></div><div><strong>Candidatures centralisées</strong><small>Tous les profils au même endroit</small></div></div>
            <div className="mini-card"><div className="mini-icon"><Icon name="bell" /></div><div><strong>Notifications internes</strong><small>Soyez alerté à chaque événement</small></div></div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const { showAuth } = useApp()
  const go = (e, ...args) => { e.preventDefault(); showAuth(...args) }
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <LogoMark id="logoGradFooter" from="#60a5fa" to="#2563eb" />
              <span className="logo-text"><span className="brand-main">Chercheurs d'Emplois</span><span className="brand-sub">Plateforme emploi</span></span>
            </div>
            <p>Plateforme pédagogique de recherche et de publication d'emplois. Projet réalisé par le Groupe 5 — Francis, Akim, Esméralda, Kèmi.</p>
          </div>
          <div className="footer-col"><h4>Plateforme</h4><ul><li><a href="#offres">Offres d'emploi</a></li><li><a href="#categories">Catégories</a></li><li><a href="#fonctionnalites">Fonctionnalités</a></li><li><a href="#a-propos">À propos</a></li></ul></div>
          <div className="footer-col"><h4>Compte</h4><ul><li><a href="#" onClick={(e) => go(e, 'login')}>Connexion</a></li><li><a href="#" onClick={(e) => go(e, 'register')}>Inscription</a></li><li><a href="#" onClick={(e) => go(e, 'register', 'employeur')}>Espace employeur</a></li></ul></div>
          <div className="footer-col"><h4>Légal</h4><ul><li><a href="#">Mentions légales</a></li><li><a href="#">Confidentialité</a></li><li><a href="#">Contact</a></li></ul></div>
        </div>
        <div className="footer-bottom"><span>© 2026 Chercheurs d'Emplois — Projet pédagogique, Groupe 5.</span><div className="legal"><a href="#">Mentions légales</a><a href="#">Confidentialité</a></div></div>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <div id="viewHome">
      <Header />
      <Hero />
      <About />
      <Features />
      <Categories />
      <Offers />
      <EmployerCta />
      <Footer />
    </div>
  )
}
