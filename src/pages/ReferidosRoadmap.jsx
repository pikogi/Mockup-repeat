import { useState } from 'react'
import { Users, UserPlus, Gift, Clock, TrendingUp, Share2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const STATS = [
  {
    label: 'Referidos totales',
    value: '34',
    sub: '+8 este mes',
    icon: Users,
    color: 'text-violet-600',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
  },
  {
    label: 'Convertidos',
    value: '27',
    sub: '79% conversión',
    icon: UserPlus,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    label: 'Premios entregados',
    value: '27',
    sub: '1 café gratis c/u',
    icon: Gift,
    color: 'text-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
  },
  {
    label: 'Clientes nuevos via ref.',
    value: '18%',
    sub: 'del total de altas',
    icon: TrendingUp,
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
]

const REFERRALS = [
  {
    id: 1,
    referrer: 'Valentina Gómez',
    referrerEmail: 'valentina.gomez@gmail.com',
    referrerSince: '2025-03-12',
    referred: 'Lucas Martínez',
    referredEmail: 'lucas.martinez@gmail.com',
    status: 'converted',
    date: '2026-06-28',
    reward: 'Café gratis',
  },
  {
    id: 2,
    referrer: 'Tomás Ruiz',
    referrerEmail: 'tomas.ruiz@hotmail.com',
    referrerSince: '2025-01-05',
    referred: 'Sofía Herrera',
    referredEmail: 'sofiaherrera@hotmail.com',
    status: 'converted',
    date: '2026-06-25',
    reward: 'Café gratis',
  },
  {
    id: 3,
    referrer: 'Valentina Gómez',
    referrerEmail: 'valentina.gomez@gmail.com',
    referrerSince: '2025-03-12',
    referred: 'Nicolás Peralta',
    referredEmail: 'nperalta92@gmail.com',
    status: 'pending',
    date: '2026-06-24',
    reward: 'Pendiente',
  },
  {
    id: 4,
    referrer: 'Camila Torres',
    referrerEmail: 'camila.torres@gmail.com',
    referrerSince: '2025-07-20',
    referred: 'Agustín López',
    referredEmail: 'aguslopez@gmail.com',
    status: 'converted',
    date: '2026-06-20',
    reward: 'Café gratis',
  },
  {
    id: 5,
    referrer: 'Martín Díaz',
    referrerEmail: 'martin.diaz@gmail.com',
    referrerSince: '2025-09-08',
    referred: 'Julieta Fernández',
    referredEmail: 'julieta.fdz@gmail.com',
    status: 'converted',
    date: '2026-06-18',
    reward: 'Café gratis',
  },
  {
    id: 6,
    referrer: 'Lucía Sánchez',
    referrerEmail: 'lucia.sanchez@outlook.com',
    referrerSince: '2025-11-14',
    referred: 'Facundo Romero',
    referredEmail: 'facuromero@outlook.com',
    status: 'expired',
    date: '2026-05-30',
    reward: '—',
  },
  {
    id: 7,
    referrer: 'Tomás Ruiz',
    referrerEmail: 'tomas.ruiz@hotmail.com',
    referrerSince: '2025-01-05',
    referred: 'Carla Méndez',
    referredEmail: 'carla.mendez@gmail.com',
    status: 'converted',
    date: '2026-05-27',
    reward: 'Café gratis',
  },
  {
    id: 8,
    referrer: 'Camila Torres',
    referrerEmail: 'camila.torres@gmail.com',
    referrerSince: '2025-07-20',
    referred: 'Ezequiel Vega',
    referredEmail: 'ezevega@gmail.com',
    status: 'pending',
    date: '2026-06-29',
    reward: 'Pendiente',
  },
]

const STATUS_MAP = {
  converted: {
    label: 'Convertido',
    className: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  },
  pending: { label: 'Pendiente', className: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
  expired: { label: 'Expirado', className: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400' },
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
}

function TopReferrers({ referrals }) {
  const data = {}
  referrals
    .filter((r) => r.status === 'converted')
    .forEach((r) => {
      if (!data[r.referrer]) data[r.referrer] = { count: 0, email: r.referrerEmail, since: r.referrerSince }
      data[r.referrer].count++
    })
  const sorted = Object.entries(data)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 3)
  const max = sorted[0]?.[1].count || 1

  return (
    <Card className="border border-gray-100 dark:border-gray-800 shadow-sm">
      <CardContent className="p-5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Top referidores</h3>
        <div className="space-y-3">
          {sorted.map(([name, { count, email, since }], i) => (
            <div key={name} className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-300 dark:text-gray-600 w-4">{i + 1}</span>
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-[10px] font-bold">
                  {name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">{name}</p>
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 ml-2">{count}</span>
                </div>
                <p className="text-[11px] text-gray-400 truncate mb-1">
                  {email} · Miembro desde {formatDate(since)}
                </p>
                <div className="h-1 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-violet-500 transition-all duration-500"
                    style={{ width: `${(count / max) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function ReferidosContent() {
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = statusFilter === 'all' ? REFERRALS : REFERRALS.filter((r) => r.status === statusFilter)

  return (
    <>
      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm">
              <CardContent className="p-5">
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-3', s.bg)}>
                  <s.icon className={cn('w-4.5 h-4.5', s.color)} />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-none mb-1">{s.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{s.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="space-y-4">
        {/* Top referidores */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <TopReferrers referrals={REFERRALS} />
        </motion.div>

        {/* Table */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          {/* Table */}
          <Card className="border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              {/* Filter tabs */}
              <div className="flex items-center gap-1 p-4 border-b border-gray-100 dark:border-gray-800">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mr-3">Historial</p>
                {['all', 'converted', 'pending', 'expired'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs font-medium transition-all',
                      statusFilter === f
                        ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800',
                    )}
                  >
                    {f === 'all' ? 'Todos' : STATUS_MAP[f].label}
                  </button>
                ))}
              </div>

              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {filtered.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    {/* Referrer */}
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-violet-700 dark:text-violet-400 text-[10px] font-bold">
                          {r.referrer
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{r.referrer}</p>
                        <p className="text-[11px] text-gray-400 truncate">{r.referrerEmail}</p>
                        <p className="text-[11px] text-gray-400">Miembro desde {formatDate(r.referrerSince)}</p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <svg
                      className="w-4 h-4 text-gray-300 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>

                    {/* Referred */}
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-500 text-[10px] font-bold">
                          {r.referred
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{r.referred}</p>
                        <p className="text-[11px] text-gray-400 truncate">{r.referredEmail}</p>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0 hidden sm:flex">
                      <Clock className="w-3 h-3" />
                      {formatDate(r.date)}
                    </div>

                    {/* Reward */}
                    <div className="flex-shrink-0 hidden md:flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <Gift className="w-3.5 h-3.5 text-amber-400" />
                      {r.reward}
                    </div>

                    {/* Status */}
                    <span
                      className={cn(
                        'flex-shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full',
                        STATUS_MAP[r.status].className,
                      )}
                    >
                      {STATUS_MAP[r.status].label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  )
}

export default function ReferidosRoadmap() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Share2 className="w-8 h-8 text-gray-700 dark:text-gray-300" />
            <h1 className="text-4xl font-bold leading-tight text-foreground">Referidos</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Tus clientes traen nuevos miembros y reciben recompensas automáticamente.
          </p>
        </motion.div>

        <ReferidosContent />
      </div>
    </div>
  )
}
