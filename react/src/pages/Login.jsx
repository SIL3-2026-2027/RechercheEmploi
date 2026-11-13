import { useState } from 'react'
import { useApp } from '../context/AppContext'
import Icon from '../components/Icon'
import LogoMark from '../components/LogoMark'

export default function Login() {
  const { cancelAuth, showAuth, login } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    login(email, () => { setEmail(''); setPassword('') })
  }

  return (
    <div className="auth-view active" id="viewLogin">
      <div className="auth-visual">
        <div className="auth-visual-header">
          <LogoMark id="lg1" from="#ffffff" to="#bfdbfe" stroke="#1e3a8a" />
          <div><div className="brand-main">Chercheurs d'Emplois</div><div className="brand-sub">Plateforme emploi</div></div>
        </div>
        <h2>Bon retour parmi nous.</h2>
        <p>Connectez-vous pour retrouver vos candidatures, vos notifications et vos offres en cours.</p>
        <ul className="auth-points">
          <li><div className="auth-point-icon"><Icon name="check" size="sm" /></div><div><strong>Suivi en temps réel</strong><span>Consultez le statut de chaque candidature à tout moment.</span></div></li>
          <li><div className="auth-point-icon"><Icon name="bell" size="sm" /></div><div><strong>Notifications ciblées</strong><span>Ne manquez plus aucune mise à jour importante.</span></div></li>
          <li><div className="auth-point-icon"><Icon name="shield" size="sm" /></div><div><strong>Données protégées</strong><span>Authentification sécurisée et accès strictement contrôlé.</span></div></li>
        </ul>
      </div>
      <div className="auth-form-side">
        <a className="auth-back" onClick={cancelAuth}><Icon name="arrowLeft" size="sm" />Retour</a>
        <div className="auth-form-inner">
          <h1>Connexion</h1>
          <p className="form-intro">Accédez à votre espace candidat ou employeur.</p>
          <form className="auth-form" onSubmit={onSubmit}>
            <div className="form-group"><label htmlFor="loginEmail">Adresse e-mail</label><div className="form-input-wrap"><Icon name="mail" /><input id="loginEmail" type="email" placeholder="vous@exemple.com" required value={email} onChange={(e) => setEmail(e.target.value)} /></div></div>
            <div className="form-group"><label htmlFor="loginPassword">Mot de passe</label><div className="form-input-wrap"><Icon name="lock" /><input id="loginPassword" type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} /></div></div>
            <div className="form-row-between"><label className="checkbox-wrap"><input type="checkbox" />Se souvenir de moi</label><a href="#" className="forgot-link" onClick={(e) => e.preventDefault()}>Mot de passe oublié ?</a></div>
            <button type="submit" className="btn btn-primary btn-block btn-lg">Se connecter</button>
          </form>
          <p className="auth-switch">Pas encore de compte ? <a onClick={() => showAuth('register')}>Créer un compte</a></p>
        </div>
      </div>
    </div>
  )
}
