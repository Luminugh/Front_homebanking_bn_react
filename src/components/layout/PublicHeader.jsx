import { useNavigate } from 'react-router-dom'
import { Lock, Menu, ChevronDown, Gift } from 'lucide-react'
import Logo from '../ui/Logo.jsx'

export default function PublicHeader() {
  const navigate = useNavigate()
  return (
    <header className="lp-header">
      <div className="lp-top-strip">
        <div className="lp-top-strip-container">
          <div className="lp-top-strip-left">
            <img src="/image/escudo.png" alt="Escudo del Perú" className="lp-escudo-icon" />
            <span className="lp-pe-badge">República del Perú</span>
            <nav className="lp-utility-tabs">
              <button type="button" className="lp-utility-tab active">Clientes</button>
              <button type="button" className="lp-utility-tab">Ciudadanos</button>
              <button type="button" className="lp-utility-tab">Entidades del Gobierno</button>
            </nav>
          </div>

          <div className="lp-top-strip-right">
            <span>Portal de Transparencia</span>
            <img src="/image/PTE.png" alt="Portal de Transparencia" className="lp-pte-icon" />
          </div>
        </div>
      </div>

      <div className="lp-brand-bar">
        <div className="lp-brand-container">
          <div className="lp-brand-row">
            <button className="lp-brand" onClick={() => navigate('/')} aria-label="Banco de la Nación — Inicio">
              <Logo size={180} wordmark={false} variant="dark" subtitle="" />
            </button>

            <nav className="lp-nav-links">
              <a href="#productos" className="lp-nav-item">
                Productos y Servicios <ChevronDown size={14} className="lp-nav-icon-arrow" />
              </a>
              <a href="#canales" className="lp-nav-item">
                Canales Digitales <ChevronDown size={14} className="lp-nav-icon-arrow" />
              </a>
              <a href="#beneficios" className="lp-nav-item lp-nav-special">
                <Gift size={15} /> BN Beneficios
              </a>
            </nav>

            <div className="lp-brand-right">
              <form onSubmit={(e) => e.preventDefault()} className="lp-search-box">
                <img src="/image/lupa.png" alt="Buscar" width={14} height={14} />
                <input placeholder="Buscar en el portal..." />
              </form>
              <a href="https://www.pagalo.pe/" target="_blank" rel="noreferrer" className="lp-pagalo-button" aria-label="págalo.pe">
                <img src="/image/logo-pagalo.png" alt="págalo.pe" className="lp-pagalo-logo" />
              </a>
              <button type="button" className="lp-internet-button" onClick={() => navigate('/login')}>
                <Lock size={15} style={{ marginRight: '4px' }} />
                Banca por Internet
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
