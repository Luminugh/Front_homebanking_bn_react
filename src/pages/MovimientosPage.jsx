import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Download,
  Landmark,
  ListChecks,
  RefreshCw,
  Search,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { useMovimientos } from '../hooks/useMovimientos.js'
import { useCuentas } from '../hooks/useCuentas.js'
import { formatDate, formatTEA, simboloMoneda, toNumber } from '../utils/format.js'
import PageLayout from '../components/layout/PageLayout.jsx'
import Card from '../components/ui/Card.jsx'
import Loader from '../components/ui/Loader.jsx'
import Money from '../components/ui/Money.jsx'
import Badge from '../components/ui/Badge.jsx'
import Alert from '../components/ui/Alert.jsx'

function isIngreso(movimiento) {
  const signo = String(movimiento?.signo || '').trim().toUpperCase()
  if (['+', 'I', 'H', 'C', 'CREDITO', 'CRÉDITO', 'INGRESO'].includes(signo)) return true
  if (['-', 'E', 'D', 'DEBITO', 'DÉBITO', 'EGRESO'].includes(signo)) return false
  return toNumber(movimiento?.monto) >= 0
}

function canalLabel(movimiento) {
  return movimiento.canal || movimiento.medio || 'Canal no especificado'
}

export default function MovimientosPage() {
  const { cod } = useParams()
  const navigate = useNavigate()
  const { movimientos, loading, error, recargar } = useMovimientos(cod, 50)
  const { cuentas } = useCuentas('ahorro')

  const cuenta = cuentas.find((c) => c.codcuentaahorro === cod)
  const simbolo = cuenta ? simboloMoneda(cuenta.moneda) : 'S/'

  const resumen = useMemo(() => {
    return movimientos.reduce(
      (acc, movimiento) => {
        const monto = Math.abs(toNumber(movimiento.monto))
        if (isIngreso(movimiento)) acc.ingresos += monto
        else acc.egresos += monto
        return acc
      },
      { ingresos: 0, egresos: 0 },
    )
  }, [movimientos])

  const ultimoMovimiento = movimientos[0]

  return (
    <PageLayout>
      <div className="bn-mov-page">
        <div className="bn-mov-topbar">
          <button className="bn-mov-back-btn" onClick={() => navigate('/cuentas/ahorro')}>
            <ArrowLeft size={16} /> Cuentas de ahorro
          </button>
          <div className="bn-mov-top-actions">
            <button className="bn-btn bn-btn-light" onClick={recargar} disabled={loading}>
              <RefreshCw size={15} /> Actualizar
            </button>
            <button className="bn-btn bn-btn-primary" type="button">
              <Download size={15} /> Descargar
            </button>
          </div>
        </div>

        <section className="bn-mov-statement">
          <div className="bn-mov-statement-main">
            <span className="bn-mov-eyebrow">
              <ListChecks size={16} /> Estado de cuenta
            </span>
            <h1>Movimientos de la cuenta</h1>
            <p>Revise el historial reciente de operaciones de su cuenta de ahorro.</p>

            <div className="bn-mov-account-line">
              <span>Número de cuenta</span>
              <strong>{cod}</strong>
            </div>
          </div>

          <aside className="bn-mov-balance-panel">
            <span>Saldo disponible</span>
            {cuenta ? <Money value={cuenta.saldo} simbolo={simbolo} className="bn-mov-balance" /> : <strong>--</strong>}
            <div className="bn-mov-balance-status">
              {cuenta ? <Badge estado={cuenta.estado} /> : <Badge estado="Sin datos" />}
            </div>
          </aside>
        </section>

        <section className="bn-mov-kpi-grid">
          <MetricCard icon={<ArrowDownLeft size={16} />} label="Ingresos" tone="positive">
            <Money value={resumen.ingresos} simbolo={simbolo} className="bn-mov-kpi-money" />
          </MetricCard>
          <MetricCard icon={<ArrowUpRight size={16} />} label="Egresos" tone="negative">
            <Money value={resumen.egresos} simbolo={simbolo} className="bn-mov-kpi-money" />
          </MetricCard>
          <MetricCard icon={<CalendarDays size={16} />} label="Último movimiento">
            <strong>{ultimoMovimiento ? formatDate(ultimoMovimiento.fecha) : '--'}</strong>
          </MetricCard>
          <MetricCard icon={<Wallet size={16} />} label="Operaciones">
            <strong>{movimientos.length}</strong>
          </MetricCard>
        </section>

        <Card>
          <div className="bn-mov-product-strip">
            <ProductFact icon={<Landmark size={15} />} label="Producto" value={cuenta?.tipo || '--'} />
            <ProductFact icon={<TrendingUp size={15} />} label="TEA" value={formatTEA(cuenta?.tea)} />
            <ProductFact icon={<ShieldCheck size={15} />} label="Moneda" value={cuenta?.moneda || '--'} />
          </div>
        </Card>

        {error && <Alert tipo="error">{error}</Alert>}

        <Card>
          <div className="bn-mov-list-head">
            <div>
              <h2><ListChecks size={18} /> Últimos movimientos</h2>
              <p>Hasta 50 operaciones recientes de la cuenta seleccionada.</p>
            </div>
            <span className="bn-mov-records">{movimientos.length} registros</span>
          </div>

          <div className="bn-mov-filterbar pro">
            <div className="bn-mov-search">
              <Search size={15} />
              <span>Periodo reciente</span>
            </div>
            <span>Vista de consulta</span>
          </div>

          {loading ? (
            <Loader text="Cargando movimientos..." />
          ) : movimientos.length === 0 ? (
            <div className="bn-mov-empty">
              <ListChecks size={34} />
              <h3>Sin movimientos registrados</h3>
              <p>Esta cuenta no registra operaciones en el periodo consultado.</p>
            </div>
          ) : (
            <div className="bn-mov-table-wrap pro">
              <table className="bn-mov-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Operación</th>
                    <th>Canal</th>
                    <th className="num">Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {movimientos.map((movimiento, index) => {
                    const ingreso = isIngreso(movimiento)
                    return (
                      <tr key={`${movimiento.fecha}-${index}`}>
                        <td>
                          <span className="bn-mov-date">{formatDate(movimiento.fecha)}</span>
                        </td>
                        <td>
                          <div className="bn-mov-operation">
                            <span className={`bn-mov-type ${ingreso ? 'in' : 'out'}`}>
                              {ingreso ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}
                            </span>
                            <div>
                              <strong>{movimiento.concepto || 'Operación bancaria'}</strong>
                              <small>{ingreso ? 'Ingreso' : 'Egreso'}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="bn-mov-channel">{canalLabel(movimiento)}</span>
                        </td>
                        <td className="num">
                          <Money value={movimiento.monto} simbolo={simbolo} signo={movimiento.signo} colored className="bn-mov-amount" />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </PageLayout>
  )
}

function MetricCard({ icon, label, tone = '', children }) {
  return (
    <article className={`bn-mov-kpi ${tone}`}>
      <span>{icon} {label}</span>
      {children}
    </article>
  )
}

function ProductFact({ icon, label, value }) {
  return (
    <div className="bn-mov-product-fact">
      <span>{icon} {label}</span>
      <strong>{value}</strong>
    </div>
  )
}
