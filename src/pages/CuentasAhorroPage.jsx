import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  ChevronDown,
  FileText,
  Landmark,
  ListChecks,
  PiggyBank,
  Receipt,
  RefreshCw,
  Send,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { useCuentas } from '../hooks/useCuentas.js'
import { useDetalleAhorro } from '../hooks/useMovimientos.js'
import { formatTEA, simboloMoneda, toNumber } from '../utils/format.js'
import PageLayout from '../components/layout/PageLayout.jsx'
import ActionPanel from '../components/ui/ActionPanel.jsx'
import Card from '../components/ui/Card.jsx'
import Loader from '../components/ui/Loader.jsx'
import Badge from '../components/ui/Badge.jsx'
import Money from '../components/ui/Money.jsx'
import Alert from '../components/ui/Alert.jsx'
import DetalleAhorro from '../components/cuentas/DetalleAhorro.jsx'

export default function CuentasAhorroPage() {
  const { cuentas, loading, error, recargar } = useCuentas('ahorro')
  const navigate = useNavigate()
  const [abierta, setAbierta] = useState(null)

  const total = cuentas.reduce((s, c) => s + toNumber(c.saldo), 0)
  const cuentaPrincipal = cuentas[0]
  const simboloTotal = simboloMoneda(cuentaPrincipal?.moneda)
  const cuentasActivas = cuentas.filter((c) => String(c.estado || '').toLowerCase().includes('activa')).length

  const acciones = [
    { icon: Send, label: 'Transferencias propias', to: '/operaciones/transferencia' },
    { icon: Receipt, label: 'Pago de crédito', to: '/operaciones/pago-credito' },
    { icon: FileText, label: 'Pago de servicios', to: '/operaciones/pago-servicios' },
  ]

  return (
    <PageLayout
      title="Cuentas de Ahorro"
      subtitle="Cuentas › Mis productos"
      actions={
        <button className="bbva-btn-ghost" onClick={recargar} disabled={loading}>
          <RefreshCw size={14} /> Actualizar
        </button>
      }
      aside={
        <div className="bn-ahorro-aside">
          <ActionPanel title="Operaciones" items={acciones} />
          <section className="bn-ahorro-security">
            <img src="/image/altoalfraude.png" alt="Alto al fraude" />
            <div>
              <h3>Operaciones seguras</h3>
              <p>Verifique el número de cuenta y no comparta sus claves de banca por internet.</p>
            </div>
          </section>
        </div>
      }
    >
      {error && <Alert tipo="error">{error}</Alert>}

      {loading ? (
        <Card>
          <Loader text="Cargando cuentas de ahorro..." />
        </Card>
      ) : cuentas.length === 0 ? (
        <Card>
          <div className="bn-ahorro-empty">
            <img src="/image/logoBN.png" alt="Banco de la Nación" />
            <div>
              <h2>No registra cuentas de ahorro</h2>
              <p>Cuando tenga productos asociados, aquí verá saldos, movimientos y detalle de cada cuenta.</p>
            </div>
          </div>
        </Card>
      ) : (
        <>
          <section className="bn-ahorro-summary">
            <div className="bn-ahorro-summary-main">
              <span className="bn-ahorro-kicker">
                <Wallet size={16} /> Saldo consolidado
              </span>
              <Money value={total} simbolo={simboloTotal} className="bn-ahorro-total" />
              <p>
                Disponible total de sus cuentas de ahorro registradas. Los importes se protegen con el modo ocultar saldos.
              </p>
              <div className="bn-ahorro-summary-actions">
                <button className="bbva-btn" onClick={() => navigate('/operaciones/transferencia')}>
                  <Send size={16} /> Transferir
                </button>
                <button className="bbva-btn-ghost" onClick={() => navigate('/operaciones/pago-servicios')}>
                  <FileText size={16} /> Pagar servicios
                </button>
              </div>
            </div>

            <div className="bn-ahorro-summary-stats">
              <div>
                <span>Cuentas activas</span>
                <strong>{cuentasActivas}</strong>
              </div>
              <div>
                <span>Productos</span>
                <strong>{cuentas.length}</strong>
              </div>
              <div>
                <span>Moneda principal</span>
                <strong>{cuentaPrincipal?.moneda || 'Soles'}</strong>
              </div>
            </div>
          </section>

          <section className="bn-ahorro-toolbar">
            <div>
              <h2>Cuentas disponibles</h2>
              <p>Revise sus productos, tasas, estado y operaciones frecuentes.</p>
            </div>
            <span className="bn-ahorro-count">{cuentas.length} productos</span>
          </section>

          <div className="bn-ahorro-grid">
            {cuentas.map((c) => (
              <CuentaItem
                key={c.codcuentaahorro}
                cuenta={c}
                abierta={abierta === c.codcuentaahorro}
                onToggle={() => setAbierta(abierta === c.codcuentaahorro ? null : c.codcuentaahorro)}
                onMovimientos={() => navigate(`/cuentas/ahorro/${c.codcuentaahorro}/movimientos`)}
              />
            ))}
          </div>
        </>
      )}
    </PageLayout>
  )
}

function CuentaItem({ cuenta, abierta, onToggle, onMovimientos }) {
  const simbolo = simboloMoneda(cuenta.moneda)
  const { detalle, loading, error } = useDetalleAhorro(abierta ? cuenta.codcuentaahorro : null)

  return (
    <article className={`bn-ahorro-card ${abierta ? 'open' : ''}`}>
      <div className="bn-ahorro-card-top">
        <div className="bn-ahorro-product">
          <span className="bn-ahorro-product-icon">
            <PiggyBank size={22} />
          </span>
          <div>
            <span className="bn-ahorro-product-label">Cuenta de ahorro</span>
            <h3>{cuenta.codcuentaahorro}</h3>
          </div>
        </div>
        <Badge estado={cuenta.estado} />
      </div>

      <div className="bn-ahorro-balance">
        <span>Saldo disponible</span>
        <Money value={cuenta.saldo} simbolo={simbolo} className="bn-ahorro-card-money" />
      </div>

      <div className="bn-ahorro-meta">
        <div>
          <span><Landmark size={14} /> Producto</span>
          <strong>{cuenta.tipo}</strong>
        </div>
        <div>
          <span><TrendingUp size={14} /> TEA</span>
          <strong>{formatTEA(cuenta.tea)}</strong>
        </div>
        <div>
          <span><CalendarDays size={14} /> Moneda</span>
          <strong>{cuenta.moneda}</strong>
        </div>
      </div>

      <div className="bn-ahorro-actions">
        <button className="bbva-btn-ghost sm" onClick={onMovimientos}>
          <ListChecks size={14} /> Movimientos
        </button>
        <button className="bbva-btn-ghost sm" onClick={onToggle}>
          Ver detalle <ChevronDown size={14} className={`bbva-chev ${abierta ? 'up' : ''}`} />
        </button>
      </div>

      {abierta && (
        <div className="bn-ahorro-detail">
          <div className="bn-ahorro-detail-head">
            <ShieldCheck size={16} />
            <span>Detalle protegido de la cuenta</span>
          </div>
          <DetalleAhorro detalle={detalle} loading={loading} error={error} />
        </div>
      )}
    </article>
  )
}
