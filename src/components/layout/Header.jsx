import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LogOut, UserCog, Eye, EyeOff, ChevronDown } from 'lucide-react'
import { useHBAuth } from '../../hooks/useHBAuth.js'
import { useUI } from '../../context/UIContext.jsx'
import Logo from '../ui/Logo.jsx'

const TABS = [
  { label: 'Inicio', to: '/inicio', match: ['/inicio'] },
  { label: 'Cuentas', to: '/cuentas/ahorro', match: ['/cuentas/ahorro'] },
  { label: 'Préstamos', to: '/cuentas/credito', match: ['/cuentas/credito'] },
  { label: 'Operaciones', to: '/operaciones', match: ['/operaciones', '/creditos/solicitar'] },
]

export default function Header() {
  const { user, logout } = useHBAuth()
  const { hideAmounts, toggleHideAmounts } = useUI()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuUser, setMenuUser] = useState(false)

  useEffect(() => { setMenuUser(false) }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  const iniciales = (user?.nombre || 'C')
    .split(/[\s,]+/).filter(Boolean).slice(0, 2).map((s) => s[0]).join('').toUpperCase()

  const isActive = (tab) => tab.match.some((m) => location.pathname.startsWith(m))

  return (
    <header className="bn-header">
      <div className="bn-top-strip">
        <div className="bn-container">
          <div className="bn-top-left">
            <button className="bn-brand-button" onClick={() => navigate('/inicio')} aria-label="Inicio" title="Banco de la Nación">
              <img src="/image/logoBN.png" alt="Banco de la Nación" className="bn-brand-icon" />
            </button>
          </div>

          <div className="bn-top-center">
            <nav className="bn-tabs" aria-label="Main navigation">
              <ul className="bn-nav-list">
                {TABS.map((t) => (
                  <li key={t.to}>
                    <button
                      className={`bn-tab ${isActive(t) ? 'active' : ''}`}
                      onClick={() => navigate(t.to)}
                      aria-current={isActive(t) ? 'page' : undefined}
                    >
                      {t.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="bn-top-right">
            <div className="bn-utilities">
              <button className="bn-hide-toggle" onClick={toggleHideAmounts} title="Ocultar importes" aria-pressed={hideAmounts}>
                {hideAmounts ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>

              <div className="bn-user-wrap">
                <button className="bn-user" onClick={() => setMenuUser((v) => !v)} aria-haspopup="true" aria-expanded={menuUser}>
                  <span className="bn-avatar">{iniciales}</span>
                  <span className="bn-user-name">{user?.nombre ? user.nombre.split(' ')[0] : 'Cliente'}</span>
                </button>
                {menuUser && (
                  <div className="bn-user-menu">
                    <button onClick={() => navigate('/inicio')}>
                      <UserCog size={16} /> Actualiza tus datos
                    </button>
                    <button onClick={handleLogout}>
                      <LogOut size={16} /> Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
              <button className="bn-logout" onClick={handleLogout} title="Cerrar sesión">
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
