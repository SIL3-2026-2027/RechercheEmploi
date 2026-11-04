import { useEffect, useState } from 'react'
import { useApp } from '../context/AppContext'
import Icon from './Icon'

const EMPTY = { titre: '', description: '', localisation: '', contrat: 'CDI', missions: '', profil: '' }

export default function OfferModal() {
  const { offerModal, closeOfferModal, submitOffer } = useApp()
  const [form, setForm] = useState(EMPTY)
  const { open } = offerModal

  // Formulaire vide à chaque ouverture
  useEffect(() => {
    if (open) setForm(EMPTY)
  }, [open])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const lines = (text) => text.split('\n').map((l) => l.trim()).filter(Boolean)

  const onSubmit = (e) => {
    e.preventDefault()
    submitOffer({
      editId: null,
      titre: form.titre.trim(),
      localisation: form.localisation.trim(),
      contrat: form.contrat,
      description: form.description.trim(),
      missions: lines(form.missions),
      profil: lines(form.profil),
    })
  }

  return (
    <div className={`modal-overlay${open ? ' active' : ''}`} id="offerModal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Créer une nouvelle offre</h2>
          <button className="modal-close" onClick={closeOfferModal}><Icon name="x" /></button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="offreTitre">Titre du poste</label>
            <input type="text" id="offreTitre" className="no-icon" placeholder="Ex. Développeur Full-Stack" required value={form.titre} onChange={set('titre')} />
          </div>
          <div className="form-group">
            <label htmlFor="offreDesc">Description</label>
            <textarea id="offreDesc" className="no-icon" placeholder="Décrivez le poste, le contexte…" required value={form.description} onChange={set('description')} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label htmlFor="offreLoc">Localisation</label>
              <input type="text" id="offreLoc" className="no-icon" placeholder="Ex. Cotonou, Bénin" required value={form.localisation} onChange={set('localisation')} />
            </div>
            <div className="form-group">
              <label htmlFor="offreContrat">Type de contrat</label>
              <select id="offreContrat" className="no-icon" required value={form.contrat} onChange={set('contrat')}>
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="Stage">Stage</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="offreMissions">Missions (une par ligne)</label>
            <textarea id="offreMissions" className="no-icon" placeholder={'Mission 1\nMission 2'} required value={form.missions} onChange={set('missions')} />
          </div>
          <div className="form-group">
            <label htmlFor="offreProfil">Profil recherché (un par ligne)</label>
            <textarea id="offreProfil" className="no-icon" placeholder={'Compétence 1\nCompétence 2'} required value={form.profil} onChange={set('profil')} />
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
            <button type="button" className="btn btn-ghost" onClick={closeOfferModal}>Annuler</button>
            <button type="submit" className="btn btn-primary">Publier l'offre</button>
          </div>
        </form>
      </div>
    </div>
  )
}
