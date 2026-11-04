// Logo SVG de la maquette. Variantes via les props :
//  - header / espaces : défaut
//  - footer : from="#60a5fa" to="#2563eb"
//  - pages d'auth : from="#ffffff" to="#bfdbfe" stroke="#1e3a8a"
//  - admin : from="#1e293b" to="#475569" lens="#475569"
export default function LogoMark({
  id,
  from = '#2563eb',
  to = '#60a5fa',
  stroke = '#ffffff',
  lens = '#2563eb',
}) {
  return (
    <svg className="logo-svg" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <rect width="44" height="44" rx="12" fill={`url(#${id})`} />
      <rect x="9" y="16" width="22" height="16" rx="2.5" fill="none" stroke={stroke} strokeWidth="2.2" />
      <path d="M16 16v-2.4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2V16" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="9" y1="23" x2="31" y2="23" stroke={stroke} strokeWidth="1.4" opacity="0.55" />
      <circle cx="31" cy="28" r="6" fill={lens} stroke={stroke} strokeWidth="2.2" />
      <circle cx="31" cy="28" r="2.4" fill="none" stroke="#ffffff" strokeWidth="1.6" />
      <line x1="35.2" y1="32.2" x2="38" y2="35" stroke={stroke} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}
