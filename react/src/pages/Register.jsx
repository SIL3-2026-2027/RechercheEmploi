import { useEffect, useRef, useState } from 'react'
import { useApp } from '../context/AppContext'
import Icon from '../components/Icon'
import LogoMark from '../components/LogoMark'

export default function Register() {
  const { cancelAuth, showAuth, showToast, registerRole, setRegisterRole } = useApp()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [success, setSuccess] = useState(false)
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    setSuccess(true)
    showToast('Compte ' + registerRole + ' créé avec succès !')
    timer.current = setTimeout(() => {
      setSuccess(false)
      setForm({ name: '', email: '', password: '' })
      showAuth('login', null, true)
    }, 1800)
  }

  return (
    <div className="auth-view active" id="viewRegister">
      <div className="auth-visual">
        <div className="auth-visual-header">
          <LogoMark id="lg2" from="#ffffff" to="#bfdbfe" stroke="#1e3a8a" />
          <div><div className="brand-main">Chercheurs d'Emplois</div><div className="brand-sub">Plateforme emploi</div></div>
        </div>
        <h2>Rejoignez la plateforme en quelques secondes.</h2>
        <p>Créez votre compte candidat ou employeur et commencez dès maintenant à interagir sur la plateforme.</p>
        <ul className="auth-points">
          <li><div className="auth-point-icon"><Icon name="user" size="sm" /></div><div><strong>Profil candidat complet</strong><span>Compétences, formation, expérience et CV en PDF.</span></div></li>
          <li><div className="auth-point-icon"><Icon name="briefcase" size="sm" /></div><div><strong>Espace employeur dédié</strong><span>Publiez vos offres et suivez les candidatures reçues.</span></div></li>
          <li><div className="auth-point-icon"><Icon name="shield" size="sm" /></div><div><strong>Accès strictement contrôlé</strong><span>Chaque rôle ne voit que ce qui le concerne.</span></div></li>
        </ul>
      </div>
      <div className="auth-form-side">
        <a className="auth-back" onClick={cancelAuth}><Icon name="arrowLeft" size="sm" />Retour</a>
        <div className="auth-form-inner">
          <h1>Créer un compte</h1>
          <p className="form-intro">Choisissez votre rôle et commencez en quelques secondes.</p>
          <div className={`alert-success${success ? ' show' : ''}`} id="registerSuccess"><Icon name="check" size="sm" /><span>Compte créé avec succès. Vous pouvez maintenant vous connecter.</span></div>
          <form className="auth-form" onSubmit={onSubmit}>
            <div className="form-group">
              <label>Je m'inscris en tant que</label>
              <div className="role-choice">
                <div className={`role-opt${registerRole === 'candidat' ? ' selected' : ''}`} onClick={() => setRegisterRole('candidat')}>
                  <div className="role-opt-icon"><Icon name="user" /></div>
                  <div><div className="role-opt-title">Candidat</div><div className="role-opt-desc">Je cherche un emploi et je veux postuler aux offres.</div></div>
                </div>
                <div className={`role-opt${registerRole === 'employeur' ? ' selected' : ''}`} onClick={() => setRegisterRole('employeur')}>
                  <div className="role-opt-icon"><Icon name="briefcase" /></div>
                  <div><div className="role-opt-title">Employeur</div><div className="role-opt-desc">Je recrute et je veux publier des offres d'emploi.</div></div>
                </div>
              </div>
            </div>
            <div className="form-group"><label htmlFor="regName">Nom complet</label><div className="form-input-wrap"><Icon name="user" /><input id="regName" type="text" placeholder="Ex. Kèmi Dossou" required value={form.name} onChange={set('name')} /></div></div>
            <div className="form-group"><label htmlFor="regEmail">Adresse e-mail</label><div className="form-input-wrap"><Icon name="mail" /><input id="regEmail" type="email" placeholder="vous@exemple.com" required value={form.email} onChange={set('email')} /></div></div>
            <div className="form-group"><label htmlFor="regPassword">Mot de passe</label><div className="form-input-wrap"><Icon name="lock" /><input id="regPassword" type="password" placeholder="8 caractères minimum" minLength={8} required value={form.password} onChange={set('password')} /></div></div>
            <button type="submit" className="btn btn-primary btn-block btn-lg" style={{ marginTop: 8 }}>Créer mon compte</button>
          </form>
          <p className="auth-switch">Déjà inscrit ? <a onClick={() => showAuth('login')}>Se connecter</a></p>
        </div>
      </div>
    </div>
  )
}
