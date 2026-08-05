import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { format } from 'date-fns'
import {
  ArrowLeft,
  Crown,
  Calendar,
  Wallet,
  Gift,
  Clock,
  CreditCard,
  Heart,
  Scissors,
  MessageSquare,
  Sparkles,
  Receipt,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { StatusBadge } from '@/components/memberships/MembershipSections'
import { formatMoney, periodLabel } from '@/lib/membershipFormat'
import { loadMembershipData } from '@/constants/membershipDemoData'

function SectionCard({ title, icon: Icon, children }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-4 h-4 text-gray-400" />
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
      </div>
      {children}
    </Card>
  )
}

function EmptyRow({ children }) {
  return <p className="text-sm text-gray-400 py-2">{children}</p>
}

export default function MembershipMemberProfile() {
  const { memberId } = useParams()
  const [data] = useState(loadMembershipData)
  const [notes, setNotes] = useState('')

  const member = data.members.find((m) => m.id === memberId)
  const plan = member ? data.plans.find((p) => p.id === member.plan_id) : null

  useEffect(() => {
    if (!memberId) return
    setNotes(localStorage.getItem(`membership_notes_${memberId}`) || '')
  }, [memberId])

  const handleNotesBlur = () => {
    if (!memberId) return
    if (notes.trim()) {
      localStorage.setItem(`membership_notes_${memberId}`, notes)
    } else {
      localStorage.removeItem(`membership_notes_${memberId}`)
    }
  }

  if (!member) {
    return (
      <div className="px-4 py-8">
        <div className="max-w-4xl mx-auto text-center py-16">
          <p className="text-gray-500">No encontramos este miembro.</p>
          <Link
            to="/memberships/members"
            className="text-sm text-gray-900 dark:text-white font-medium underline mt-2 inline-block"
          >
            Volver a Miembros
          </Link>
        </div>
      </div>
    )
  }

  const daysToRenewal = member.renewal_date
    ? Math.round((new Date(member.renewal_date) - new Date()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Link
          to="/memberships/members"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Miembros
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center text-xl font-bold text-gray-600 dark:text-gray-300 flex-shrink-0">
              {member.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{member.name}</h1>
              <p className="text-sm text-gray-500">{member.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={member.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Sidebar ── */}
          <div className="space-y-5 lg:order-2">
            {/* Membresía */}
            <Card className="p-5" style={{ borderTop: `3px solid ${plan?.color ?? '#111827'}` }}>
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-4 h-4" style={{ color: plan?.color }} />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{plan?.name ?? 'Sin plan'}</span>
              </div>
              {plan && (
                <p className="text-2xl font-black text-gray-900 dark:text-white">
                  {formatMoney(plan.price)}
                  <span className="text-sm font-normal text-gray-400">/{periodLabel(plan.billing_period)}</span>
                </p>
              )}
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2 text-sm">
                <div className="flex items-center justify-between text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Se unió
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {format(new Date(member.joined_at), 'dd MMM yyyy')}
                  </span>
                </div>
                {member.renewal_date && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <Calendar className="w-3.5 h-3.5" /> Próxima renovación
                    </span>
                    <span
                      className={
                        daysToRenewal != null && daysToRenewal <= 7
                          ? 'text-amber-600 font-semibold'
                          : 'text-gray-900 dark:text-white font-medium'
                      }
                    >
                      {format(new Date(member.renewal_date), 'dd MMM yyyy')}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5" /> Saldo en wallet
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">{member.wallet_balance} pts</span>
                </div>
                <div className="flex items-center justify-between text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" /> Tarjeta de fidelidad
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">Vinculada</span>
                </div>
              </div>
            </Card>

            {/* Favoritos */}
            <SectionCard title="Favoritos" icon={Heart}>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Producto favorito</span>
                  <span className="text-gray-900 dark:text-white font-medium">{member.favorite_product ?? '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5" /> Empleado favorito
                  </span>
                  <span className="text-gray-900 dark:text-white font-medium">{member.favorite_employee ?? '—'}</span>
                </div>
              </div>
            </SectionCard>

            {/* Acciones sugeridas */}
            <SectionCard title="Acciones sugeridas" icon={Sparkles}>
              {member.suggested_actions.length === 0 ? (
                <EmptyRow>Sin acciones sugeridas por ahora.</EmptyRow>
              ) : (
                <ul className="space-y-2">
                  {member.suggested_actions.map((action, i) => (
                    <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                      {action}
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>

            {/* Notas personales */}
            <SectionCard title="Notas personales" icon={MessageSquare}>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={handleNotesBlur}
                placeholder="Preferencias, alergias, lo que quieras recordar de este miembro..."
                rows={3}
              />
              <p className="text-xs text-gray-400 mt-1">Se guarda solo en este dispositivo.</p>
            </SectionCard>
          </div>

          {/* ── Contenido principal ── */}
          <div className="lg:col-span-2 space-y-5 lg:order-1">
            <SectionCard title="Historial de renovaciones" icon={Receipt}>
              {member.renewal_history.length === 0 ? (
                <EmptyRow>Sin renovaciones todavía.</EmptyRow>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {member.renewal_history.map((r, i) => (
                    <div key={i} className="flex items-center justify-between py-2 text-sm">
                      <span className="text-gray-700 dark:text-gray-300">{r.plan_name}</span>
                      <span className="text-gray-400">{format(new Date(r.date), 'dd MMM yyyy')}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatMoney(r.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard title="Historial de pagos" icon={CreditCard}>
              {member.payment_history.length === 0 ? (
                <EmptyRow>Sin pagos registrados.</EmptyRow>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {member.payment_history.map((p, i) => (
                    <div key={i} className="flex items-center justify-between py-2 text-sm">
                      <span className="text-gray-400">{format(new Date(p.date), 'dd MMM yyyy')}</span>
                      <span
                        className={
                          p.status === 'failed'
                            ? 'text-red-500 font-medium'
                            : 'text-emerald-600 dark:text-emerald-400 font-medium'
                        }
                      >
                        {p.status === 'failed' ? 'Falló' : 'Pagado'}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatMoney(p.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard title="Historial de visitas" icon={Clock}>
              {member.visit_history.length === 0 ? (
                <EmptyRow>Sin visitas registradas.</EmptyRow>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {member.visit_history.map((v, i) => (
                    <div key={i} className="flex items-center justify-between py-2 text-sm">
                      <span className="text-gray-700 dark:text-gray-300">{v.service}</span>
                      <span className="text-gray-400">{format(new Date(v.date), 'dd MMM yyyy')}</span>
                    </div>
                  ))}
                </div>
              )}
              {member.services_used.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-wrap gap-2">
                  {member.services_used.map((s, i) => (
                    <span
                      key={i}
                      className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                    >
                      {s.name} · {s.count}x
                    </span>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard title="Recompensas ganadas" icon={Gift}>
              {member.rewards_earned.length === 0 ? (
                <EmptyRow>Sin recompensas todavía.</EmptyRow>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {member.rewards_earned.map((r, i) => (
                    <div key={i} className="flex items-center justify-between py-2 text-sm">
                      <span className="text-gray-700 dark:text-gray-300">{r.name}</span>
                      <span className="text-gray-400">{format(new Date(r.date), 'dd MMM yyyy')}</span>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard title="Comunicación" icon={MessageSquare}>
              {member.communication_timeline.length === 0 ? (
                <EmptyRow>Sin comunicaciones enviadas.</EmptyRow>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {member.communication_timeline.map((c, i) => (
                    <div key={i} className="flex items-center justify-between py-2 text-sm gap-3">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 flex-shrink-0">
                        {c.channel}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300 flex-1">{c.message}</span>
                      <span className="text-gray-400 flex-shrink-0">{format(new Date(c.date), 'dd MMM')}</span>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  )
}
