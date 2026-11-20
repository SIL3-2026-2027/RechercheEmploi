import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { STATUS_LABELS } from '../constants'
import Icon from './Icon'

// ---------------------------------------------------------------------------
// Fil d'actualité : même composant pour les trois profils, mais le contenu,
// les filtres et les actions changent selon le rôle connecté.
// ---------------------------------------------------------------------------

// "Il y a 2 jours" / "À l'instant" -> minutes (sert uniquement à trier)
const ageInMinutes = (text = '') => {
  if (/instant/i.test(text)) return 0
  if (/aujourd/i.test(text)) return 120
  if (/hier/i.test(text)) return 1440
  const m = text.match(/(\d+)\s*(minute|heure|jour|semaine|mois)/i)
  if (!m) return 60 * 24 * 365
  const n = Number(m[1])
  const unit = { minute: 1, heure: 60, jour: 1440, semaine: 10080, mois: 43200 }[m[2].toLowerCase()]
  return n * unit
}

const TYPE_STYLE = {
  offre: { icon: 'briefcase', color: 'linear-gradient(135deg, #2563eb, #60a5fa)' },
  candidature: { icon: 'file', color: 'linear-gradient(135deg, #059669, #34d399)' },
  maj: { icon: 'bell', color: 'linear-gradient(135deg, #7c3aed, #a78bfa)' },
  conseil: { icon: 'info', color: 'linear-gradient(135deg, #d97706, #fbbf24)' },
  inscription: { icon: 'userPlus', color: 'linear-gradient(135deg, #0891b2, #22d3ee)' },
  moderation: { icon: 'shield', color: 'linear-gradient(135deg, #dc2626, #f87171)' },
}

// Compétences et ville du profil candidat de la maquette (Kèmi Dossou)
const CANDIDATE_SKILLS = ['react', 'laravel', 'mysql', 'git', 'développeur', 'web']
const CANDIDATE_CITY = 'cotonou'

const FILTERS = {
  candidat: [
    { id: 'all', label: 'Tout' },
    { id: 'offre', label: 'Offres pour vous' },
    { id: 'maj', label: 'Mes mises à jour' },
    { id: 'conseil', label: 'Conseils' },
  ],
  employeur: [
    { id: 'all', label: 'Tout' },
    { id: 'candidature', label: 'Candidatures' },
    { id: 'offre', label: 'Mes offres' },
    { id: 'conseil', label: 'Conseils' },
  ],
  admin: [
    { id: 'all', label: 'Tout' },
    { id: 'inscription', label: 'Inscriptions' },
    { id: 'offre', label: 'Offres' },
    { id: 'moderation', label: 'Modération' },
  ],
}

const INTRO = {
  candidat: 'Les offres et les nouvelles qui correspondent à votre profil.',
  employeur: "L'activité de vos offres et de vos candidatures.",
  admin: "L'activité de la plateforme, en un coup d'œil.",
}

export default function ActivityFeed({ onNavigate }) {
  const {
    role, offers, openOfferDetail,
    userNotifications, userApplications,
    employerOffers, employerApplications, employerProfile,
  } = useApp()
  const [filter, setFilter] = useState('all')

  const go = (tab) => (onNavigate ? () => onNavigate(tab) : undefined)
  const items = []

  if (role === 'candidat') {
    // 1. Mises à jour personnelles (candidature envoyée, changement de statut…)
    userNotifications.forEach((n, i) => {
      items.push({
        id: 'n' + i, type: 'maj', titre: n.titre, texte: n.message, age: n.date,
        tag: n.unread ? 'Nouveau' : null,
      })
    })

    // 2. Offres recommandées : ville + compétences du profil, hors offres déjà postulées
    const applied = new Set(userApplications.map((a) => a.offerId))
    offers
      .filter((o) => !applied.has(o.id))
      .map((o) => {
        const texte = `${o.titre} ${o.description}`.toLowerCase()
        const hits = CANDIDATE_SKILLS.filter((k) => texte.includes(k))
        const inCity = o.localisation.toLowerCase().includes(CANDIDATE_CITY)
        return { o, hits, inCity, score: hits.length + (inCity ? 2 : 0) }
      })
      .sort((a, b) => b.score - a.score || ageInMinutes(a.o.date) - ageInMinutes(b.o.date))
      .slice(0, 4)
      .forEach(({ o, hits, inCity }) => {
        const raisons = [inCity && 'Cotonou', ...hits.slice(0, 2).map((h) => h.charAt(0).toUpperCase() + h.slice(1))].filter(Boolean)
        items.push({
          id: 'o' + o.id, type: 'offre',
          titre: o.titre,
          texte: `${o.entreprise} · ${o.localisation} · ${o.contrat}` + (raisons.length ? ` — correspond à votre profil : ${raisons.join(', ')}` : ''),
          age: o.date, tag: o.contrat,
          action: { label: "Voir l'offre", onClick: () => openOfferDetail(o.id) },
        })
      })

    // 3. Conseils
    items.push(
      { id: 'c1', type: 'conseil', titre: 'Complétez votre profil à 100 %', texte: 'Un profil complet est plus souvent repéré par les employeurs. Ajoutez votre formation et votre expérience.', age: 'Conseil du jour' },
      { id: 'c2', type: 'conseil', titre: 'Gardez un CV à jour', texte: 'Un CV récent au format PDF accélère vos candidatures : il est transmis automatiquement avec chaque envoi.', age: 'Conseil' },
    )
  }

  if (role === 'employeur') {
    // 1. Profil à compléter
    if (!employerProfile) {
      items.push({
        id: 'p', type: 'conseil', titre: 'Créez le profil de votre entreprise',
        texte: 'Il est nécessaire pour publier des offres. Votre nom d’entreprise apparaîtra sur chacune.',
        age: 'À faire', tag: 'Important', priority: true,
        action: onNavigate ? { label: 'Créer mon profil', onClick: go('profil') } : undefined,
      })
    }

    // 2. Candidatures reçues
    employerApplications.forEach((a) => {
      const offre = offers.find((o) => o.id === a.offerId)
      items.push({
        id: 'a' + a.id, type: 'candidature',
        titre: `Candidature de ${a.candidat}`,
        texte: `A postulé à « ${offre ? offre.titre : 'une de vos offres'} » · ${a.cv}`,
        age: a.date, tag: STATUS_LABELS[a.statut],
      })
    })

    // 3. Activité de mes offres
    employerOffers.forEach((o) => {
      items.push({
        id: 'e' + o.id, type: 'offre',
        titre: o.statut === 'active' ? `Offre en ligne : ${o.titre}` : `Offre désactivée : ${o.titre}`,
        texte: `${o.candidatures} candidature(s) · ${o.localisation} · ${o.contrat}`,
        age: o.date, tag: o.statut === 'active' ? 'Active' : 'Désactivée',
        action: onNavigate ? { label: 'Gérer mes offres', onClick: go('offres') } : undefined,
      })
    })
    if (employerOffers.length === 0 && employerProfile) {
      items.push({
        id: 'o0', type: 'offre', titre: 'Publiez votre première offre',
        texte: "Décrivez le poste, les missions et le profil recherché : l'offre apparaît immédiatement sur l'accueil.",
        age: 'À faire',
        action: onNavigate ? { label: 'Mes offres', onClick: go('offres') } : undefined,
      })
    }

    // 4. Conseils et marché
    const cdi = offers.filter((o) => o.contrat === 'CDI').length
    items.push(
      { id: 'm', type: 'conseil', titre: 'Le marché en ce moment', texte: `${offers.length} offres sont en ligne sur la plateforme, dont ${cdi} en CDI.`, age: 'Aujourd’hui' },
      { id: 'c1', type: 'conseil', titre: 'Détaillez les missions', texte: 'Les offres avec des missions et un profil précis reçoivent des candidatures mieux ciblées.', age: 'Conseil' },
      { id: 'c2', type: 'conseil', titre: 'Répondez vite', texte: 'Mettre à jour le statut d’une candidature sous 48 h améliore l’expérience des candidats.', age: 'Conseil' },
    )
  }

  if (role === 'admin') {
    // Données de démonstration cohérentes avec les écrans d'administration
    ;[
      { id: 'i1', nom: 'techinnov@exemple.com', role: 'Employeur', age: "Aujourd'hui, 10:45" },
      { id: 'i2', nom: 'kemi.dossou@exemple.com', role: 'Candidat', age: 'Hier, 18:30' },
      { id: 'i3', nom: 'hello@studiocreatif.fr', role: 'Employeur', age: 'Il y a 2 jours' },
    ].forEach((u) => {
      items.push({
        id: u.id, type: 'inscription', titre: 'Nouvelle inscription', texte: `${u.nom} (${u.role})`, age: u.age, tag: u.role,
        action: onNavigate ? { label: 'Gérer les comptes', onClick: go('comptes') } : undefined,
      })
    })

    ;[...offers].sort((a, b) => b.id - a.id).slice(0, 3).forEach((o) => {
      items.push({
        id: 'of' + o.id, type: 'offre', titre: `Offre publiée : ${o.titre}`,
        texte: `${o.entreprise} · ${o.localisation} · ${o.contrat}`, age: o.date, tag: o.contrat,
      })
    })

    items.push({
      id: 'sig1', type: 'moderation', titre: 'Offre signalée à examiner',
      texte: '« Designer UI / UX » — Studio Créatif · 1 signalement', age: 'Il y a 4 jours', tag: 'À modérer',
      action: onNavigate ? { label: 'Aller à la modération', onClick: go('moderation') } : undefined,
    })
    items.push({
      id: 'st', type: 'conseil', titre: 'Résumé de la plateforme',
      texte: `${offers.length} offres en ligne · 3 comptes inscrits · 1 signalement en attente.`, age: "Aujourd'hui",
    })
  }

  // Tri : les plus récents d'abord (les conseils restent en bas)
  const ordered = items
    .map((it, idx) => ({ ...it, idx, minutes: it.priority ? -1 : it.type === 'conseil' ? 1e9 : ageInMinutes(it.age) }))
    .sort((a, b) => a.minutes - b.minutes || a.idx - b.idx)

  const filters = FILTERS[role] || FILTERS.candidat
  const shown = filter === 'all' ? ordered : ordered.filter((it) => it.type === filter)

  return (
    <div className="space-tab active" id="activityFeed">
      <div className="space-welcome">
        <h1>Fil d'actualité</h1>
        <p>{INTRO[role] || INTRO.candidat}</p>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {filters.map((f) => (
          <button key={f.id} className={`btn ${filter === f.id ? 'btn-primary' : 'btn-ghost'} btn-sm`} onClick={() => setFilter(f.id)}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-section">
        <div>
          {shown.length === 0 ? (
            <div className="empty-space">
              <h3>Rien à afficher pour l'instant</h3>
              <p>Les nouveautés de cette catégorie apparaîtront ici.</p>
            </div>
          ) : (
            shown.map((it) => {
              const style = TYPE_STYLE[it.type] || TYPE_STYLE.conseil
              return (
                <div className="application-item feed-item" key={it.id} style={{ cursor: 'default', flexWrap: 'wrap' }}>
                  <div className="app-logo" style={{ background: style.color }}>
                    <Icon name={style.icon} stroke="#fff" />
                  </div>
                  <div className="app-info" style={{ minWidth: 0 }}>
                    <div className="app-title">{it.titre}</div>
                    <div className="app-company" style={{ whiteSpace: 'normal' }}>{it.texte}</div>
                    <div className="app-date"><Icon name="clock" size="xs" />{it.age}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {it.tag && <span className="app-status status-recue">{it.tag}</span>}
                    {it.action && (
                      <button className="btn btn-ghost btn-sm" onClick={it.action.onClick}>{it.action.label}</button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
