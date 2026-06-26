import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react'
import Logo from '../ui/Logo.jsx'

const COLS = [
  {
    title: 'Productos',
    links: ['Cuenta de Ahorros', 'Cuenta Sueldo', 'Crédito de Consumo', 'Crédito Hipotecario', 'Tarjeta de Débito'],
  },
  {
    title: 'Banco de la Nación',
    links: ['Nosotros', 'Transparencia', 'Gobierno Corporativo', 'Noticias', 'Sala de prensa'],
  },
  {
    title: 'Ayuda',
    links: ['Centro de ayuda', 'Ubícanos', 'Reclamos', 'Tasas y tarifas', 'Seguridad'],
  },
]

export default function PublicFooter() {
  return (
    <footer className="lp-footer" id="footer">
      <div className="lp-footer-inner">
        <div className="lp-footer-brand">
          <Logo size={40} variant="light" subtitle="BANCA POR INTERNET" />
          <p>Banco de la Nación es el banco oficial del país. Operaciones seguras y servicio digital desde cualquier lugar.</p>
          <div className="lp-social">
            <a href="#footer" aria-label="Facebook"><Facebook size={18} /></a>
            <a href="#footer" aria-label="Instagram"><Instagram size={18} /></a>
            <a href="#footer" aria-label="Twitter"><Twitter size={18} /></a>
          </div>
        </div>

        {COLS.map((c) => (
          <div className="lp-footer-col" key={c.title}>
            <h4>{c.title}</h4>
            <ul>
              {c.links.map((l) => (
                <li key={l}><a href="#footer">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}

        <div className="lp-footer-col">
          <h4>Contacto</h4>
          <ul className="lp-contact">
            <li><Phone size={15} /> Línea gratuita: (01) 311-9000</li>
            <li><Mail size={15} /> atencion@bn.com.pe</li>
            <li><MapPin size={15} /> Av. 9 de Diciembre 123, Lima</li>
          </ul>
        </div>
      </div>

      <div className="lp-footer-legal">
        © {2026} Banco de la Nación — Banca por Internet. Demo educativo.
      </div>
    </footer>
  )
}
