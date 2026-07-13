import { useEffect, useMemo, useState } from 'react'
import CustomerDetailModal from '@/components/customers/CustomerDetailModal'
import { getEmailCampaigns, getPushCampaigns } from '@/constants/moonCafeCampaigns'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  Cake,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Gift,
  Mail,
  Plus,
  Search,
  Smartphone,
  Stamp,
  Star,
  Tag,
  TrendingUp,
  UserPlus,
  Users,
  X,
} from 'lucide-react'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// ─── Program ──────────────────────────────────────────────────────────────────

const PROGRAM = {
  program_name: 'Club de Fidelidad Moon Cafe',
  program_rules: { stamps_required: 5 },
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const makeCard = (id, balance, visits, rewardsCount, firstTxDaysAgo) => {
  const txCount = Math.min(visits, 8)
  const start = firstTxDaysAgo ?? id % 3
  const gap = visits <= 3 ? 14 : visits <= 6 ? 7 : 3
  const transactions = Array.from({ length: txCount }, (_, i) => {
    const daysAgo = start + i * gap
    const d = new Date()
    d.setUTCDate(d.getUTCDate() - daysAgo)
    d.setUTCHours(9 + ((id * 3 + i * 7) % 10), (id * 11 + i * 17) % 60, 0, 0)
    return { transaction_id: `tx-${id}-${i}`, transaction_type: 'stamp_added', created_at: d.toISOString() }
  })
  return {
    card_id: `mc${id}`,
    current_balance: balance,
    total_visits: visits,
    redemptions: Array.from({ length: rewardsCount }, (_, i) => ({ status: 'completed', id: i })),
    program: PROGRAM,
    transactions,
  }
}

const RAW_MEMBERS = [
  {
    id: 1,
    name: 'Carlos Martínez',
    email: 'carlos.mtz@gmail.com',
    joined: '2026-01-08',
    balance: 4,
    visits: 22,
    rewards: 4,
    phone: '+54 9 351 412-3344',
    birthday: '1990-03-15',
    firstTxDaysAgo: 1,
  },
  {
    id: 2,
    name: 'Sofía Ramírez',
    email: 'sofi.ramirez@gmail.com',
    joined: '2026-01-15',
    balance: 2,
    visits: 17,
    rewards: 3,
    phone: '+54 9 351 508-7621',
    birthday: '1995-07-22',
    firstTxDaysAgo: 3,
  },
  {
    id: 3,
    name: 'Andrés Morales',
    email: 'andres.m@hotmail.com',
    joined: '2026-02-01',
    balance: 0,
    visits: 10,
    rewards: 2,
    phone: '+54 9 351 623-0198',
    birthday: '1988-11-04',
    firstTxDaysAgo: 0,
  },
  {
    id: 4,
    name: 'Valentina Cruz',
    email: 'valen.cruz@icloud.com',
    joined: '2026-02-10',
    balance: 3,
    visits: 8,
    rewards: 1,
    phone: '+54 9 351 741-5530',
    birthday: '1997-01-30',
    firstTxDaysAgo: 5,
  },
  {
    id: 5,
    name: 'Lucía Herrera',
    email: 'lucia.h@gmail.com',
    joined: '2026-02-20',
    balance: 1,
    visits: 6,
    rewards: 1,
    phone: '+54 9 351 899-2267',
    birthday: '1993-05-18',
    firstTxDaysAgo: 12,
  },
  {
    id: 6,
    name: 'Mateo Flores',
    email: 'mateo.flores@gmail.com',
    joined: '2026-03-03',
    balance: 4,
    visits: 14,
    rewards: 2,
    phone: '+54 9 351 312-4480',
    birthday: '1991-09-09',
    firstTxDaysAgo: 7,
  },
  {
    id: 7,
    name: 'Camila Ortiz',
    email: 'cami.ortiz@yahoo.com',
    joined: '2026-03-12',
    balance: 2,
    visits: 7,
    rewards: 1,
    birthday: '1999-12-03',
    firstTxDaysAgo: 38,
  },
  {
    id: 8,
    name: 'Diego Vargas',
    email: 'diego.v@gmail.com',
    joined: '2026-03-25',
    balance: 0,
    visits: 5,
    rewards: 1,
    phone: '+54 9 351 487-9915',
    birthday: '1992-06-17',
    firstTxDaysAgo: 52,
  },
  {
    id: 9,
    name: 'Martina Rojas',
    email: 'marti.rojas@gmail.com',
    joined: '2026-06-20',
    balance: 3,
    visits: 3,
    rewards: 0,
    phone: '+54 9 351 556-1023',
    birthday: '1996-02-14',
    firstTxDaysAgo: 4,
  },
  {
    id: 10,
    name: 'Sebastián Castro',
    email: 'seba.castro@hotmail.com',
    joined: '2026-03-14',
    balance: 1,
    visits: 2,
    rewards: 0,
    birthday: '1994-08-27',
    firstTxDaysAgo: 80,
  },
  {
    id: 11,
    name: 'Isabella Méndez',
    email: 'isa.mendez@gmail.com',
    joined: '2026-06-28',
    balance: 2,
    visits: 2,
    rewards: 0,
    phone: '+54 9 351 730-6642',
    birthday: '1998-04-11',
    firstTxDaysAgo: 2,
  },
  {
    id: 12,
    name: 'Tomás Navarro',
    email: 'tomas.nav@gmail.com',
    joined: '2026-05-01',
    balance: 1,
    visits: 1,
    rewards: 0,
    phone: '+54 9 351 621-8874',
    birthday: '1995-10-22',
    firstTxDaysAgo: 18,
  },
]

const USER_STATS_MAP = Object.fromEntries(
  RAW_MEMBERS.map((m) => [
    m.id,
    {
      full_name: m.name,
      email: m.email,
      registered_at: `${m.joined}T00:00:00Z`,
      loyalty_cards: [makeCard(m.id, m.balance, m.visits, m.rewards, m.firstTxDaysAgo)],
      ...(m.phone && { phone: m.phone }),
      ...(m.birthday && { birth_date: m.birthday }),
    },
  ]),
)

const MEMBERS = RAW_MEMBERS.map((m) => ({
  user_id: m.id,
  full_name: m.name,
  email: m.email,
  created_at: `${m.joined}T00:00:00Z`,
  programs: [{ program_name: PROGRAM.program_name }],
}))

// ─── Segmentation ─────────────────────────────────────────────────────────────

const SEGMENTS = {
  nuevo: {
    label: 'Nuevo',
    tooltip: 'Se unió en los últimos 30 días',
    colorClass: 'text-sky-700 bg-sky-50 dark:text-sky-400 dark:bg-sky-900/20',
  },
  vip: {
    label: 'VIP',
    tooltip: 'Cliente frecuente: 10+ visitas o 3+ premios',
    colorClass: 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20',
  },
  activo: {
    label: 'Activo',
    tooltip: 'Visitó el local en los últimos 30 días',
    colorClass: 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20',
  },
  en_riesgo: {
    label: 'En riesgo',
    tooltip: 'Sin visitar hace entre 30 y 60 días',
    colorClass: 'text-orange-700 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20',
  },
  inactivo: {
    label: 'Inactivo',
    tooltip: 'Sin visitar hace más de 60 días',
    colorClass: 'text-gray-500 bg-gray-100 dark:text-gray-400 dark:bg-gray-800',
  },
}

const SEGMENT_ORDER = { en_riesgo: 0, activo: 1, vip: 2, nuevo: 3, inactivo: 4 }

function getLastVisit(userId) {
  const txs = USER_STATS_MAP[userId]?.loyalty_cards?.[0]?.transactions ?? []
  if (!txs.length) return null
  return new Date(Math.max(...txs.map((t) => new Date(t.created_at))))
}

function getSegment(raw, lastVisit) {
  const joinedDays = Math.round((Date.now() - new Date(raw.joined + 'T00:00:00Z')) / 86400000)
  if (joinedDays <= 30) return 'nuevo'
  if (raw.visits >= 10 || raw.rewards >= 3) return 'vip'
  if (!lastVisit) return 'inactivo'
  const lastDays = Math.round((Date.now() - lastVisit) / 86400000)
  if (lastDays <= 30) return 'activo'
  if (lastDays <= 60) return 'en_riesgo'
  return 'inactivo'
}

function timeAgo(date) {
  if (!date) return 'Sin visitas'
  const days = Math.round((Date.now() - date) / 86400000)
  if (days === 0) return 'Hoy'
  if (days === 1) return 'Ayer'
  if (days < 7) return `Hace ${days} días`
  if (days < 30) return `Hace ${Math.round(days / 7)} sem`
  if (days < 60) return 'Hace 1 mes'
  return `Hace ${Math.round(days / 30)} meses`
}

// Enrich once at module level
const ENRICHED = MEMBERS.map((m) => {
  const raw = RAW_MEMBERS.find((r) => r.id === m.user_id)
  const lastVisit = getLastVisit(m.user_id)
  return { ...m, raw, lastVisit, segment: getSegment(raw, lastVisit) }
})

// ─── SegmentBadge ─────────────────────────────────────────────────────────────

function SegmentBadge({ segment }) {
  const s = SEGMENTS[segment]
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              'inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full cursor-default',
              s.colorClass,
            )}
          >
            {segment === 'vip' && <Star className="w-2.5 h-2.5" />}
            {s.label}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top">{s.tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// ─── WhatsApp helpers ─────────────────────────────────────────────────────────

function WhatsAppIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  )
}

function cleanPhone(phone) {
  return phone?.replace(/\D/g, '') ?? ''
}

// ─── MemberCard (CustomerCard with inline segment badge) ─────────────────────

function MemberCard({ member, userData, segment, lastVisit, phone, isSelected, onSelect, onClick }) {
  const displayName = member.full_name || member.email || '?'
  const displayEmail = member.email || ''

  return (
    <Card
      className={cn(
        'p-4 transition-all cursor-pointer group',
        isSelected
          ? 'ring-2 ring-indigo-400 dark:ring-indigo-500 bg-indigo-50/40 dark:bg-indigo-900/10 shadow-md'
          : 'hover:shadow-md',
      )}
      onClick={() => onClick(member)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Checkbox */}
          <div
            onClick={(e) => {
              e.stopPropagation()
              onSelect(member.user_id)
            }}
            className={cn(
              'w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer',
              isSelected
                ? 'bg-indigo-500 border-indigo-500'
                : 'border-gray-300 dark:border-gray-600 group-hover:border-indigo-400 dark:group-hover:border-indigo-500',
            )}
          >
            {isSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
          </div>

          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 dark:from-indigo-900 to-purple-100 dark:to-purple-900 flex items-center justify-center flex-shrink-0">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">
              {displayName[0].toUpperCase()}
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{displayName}</p>
              <SegmentBadge segment={segment} />
              <span className="text-[11px] text-gray-400 whitespace-nowrap">{timeAgo(lastVisit)}</span>
            </div>
            {displayEmail && displayEmail !== displayName && (
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                <Mail className="w-3 h-3 inline mr-1 align-text-bottom" />
                {displayEmail}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {member.created_at ? format(new Date(member.created_at), 'MMM d, yyyy') : '—'}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Miembro desde</p>
          </div>
          {phone && (
            <a
              href={`https://wa.me/${cleanPhone(phone)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title={`WhatsApp a ${phone}`}
              className="w-8 h-8 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 flex items-center justify-center transition-colors flex-shrink-0"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
            </a>
          )}
        </div>
      </div>

      {userData ? (
        userData.loyalty_cards?.map((lc) => {
          const stampsRequired = lc.program?.program_rules?.stamps_required ?? 20
          const unitLabel = lc.program?.program_rules?.unit_label ?? 'sellos'
          const isPoints = !!lc.program?.program_rules?.unit_label
          const currentStamps = lc.current_balance ?? 0
          const totalVisits = lc.total_visits ?? 0
          const rewardsRedeemed = lc.redemptions?.filter((r) => r.status === 'completed').length || 0
          const progressPct = Math.min(100, (currentStamps / stampsRequired) * 100)
          return (
            <div key={lc.card_id} className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span className="flex items-center gap-1">
                  <Stamp className="w-3.5 h-3.5 text-amber-500" />
                  <strong>{currentStamps}</strong> {unitLabel}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                  <strong>{totalVisits}</strong> visitas
                </span>
                <span className="flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5 text-green-500" />
                  <strong>{rewardsRedeemed}</strong> premios
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-amber-400 to-yellow-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {currentStamps}/{stampsRequired}{' '}
                {isPoints ? `${unitLabel} al próximo premio` : 'sellos al próximo premio'}
              </p>
            </div>
          )
        })
      ) : (
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 space-y-1.5">
          <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-3/4" />
          <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />
        </div>
      )}
    </Card>
  )
}

// ─── Activity feed ────────────────────────────────────────────────────────────

const ALL_TRANSACTIONS = ENRICHED.flatMap((m) =>
  (USER_STATS_MAP[m.user_id]?.loyalty_cards?.[0]?.transactions ?? []).map((tx) => ({ ...tx, member: m })),
).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

function ActivityFeed() {
  return (
    <div className="space-y-2">
      {ALL_TRANSACTIONS.map((tx) => (
        <div
          key={tx.transaction_id}
          className="flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-3"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 dark:from-indigo-900 to-purple-100 dark:to-purple-900 flex items-center justify-center flex-shrink-0">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">
              {tx.member.full_name[0].toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{tx.member.full_name}</p>
            <p className="text-xs text-gray-400">Sello entregado</p>
          </div>
          <p className="text-xs text-gray-400 flex-shrink-0 tabular-nums">
            {new Date(tx.created_at).toLocaleString('es-AR', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      ))}
    </div>
  )
}

// ─── MemberDetailPanel ────────────────────────────────────────────────────────

function MemberDetailPanel({ member, onClose }) {
  const [showStampSuccess, setShowStampSuccess] = useState(false)
  const stats = USER_STATS_MAP[member.user_id]
  const card = stats?.loyalty_cards?.[0]
  const stampsRequired = PROGRAM.program_rules.stamps_required
  const currentBalance = card?.current_balance ?? 0
  const totalVisits = card?.total_visits ?? 0
  const rewardsRedeemed = card?.redemptions?.filter((r) => r.status === 'completed').length ?? 0
  const progressPct = Math.min(100, Math.round((currentBalance / stampsRequired) * 100))
  const txs = [...(card?.transactions ?? [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  const handleAddStamp = () => {
    setShowStampSuccess(true)
    setTimeout(() => setShowStampSuccess(false), 2500)
  }

  function fmtDate(str) {
    if (!str) return '—'
    return new Date(str + (str.length === 10 ? 'T00:00:00Z' : '')).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    })
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Pull handle (mobile) */}
      <div className="flex justify-center pt-3 pb-1 lg:hidden flex-shrink-0">
        <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
      </div>

      {/* Stamp success overlay */}
      <AnimatePresence>
        {showStampSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4"
            >
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-xl font-bold text-gray-900 dark:text-gray-100"
            >
              ¡Sello entregado!
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-gray-500 dark:text-gray-400 mt-1"
            >
              {member.full_name}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back button */}
      <div className="flex-shrink-0 px-4 pt-3 pb-2 border-b border-gray-100 dark:border-gray-800">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 p-5">
          {/* Customer info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 dark:from-gray-800 to-gray-200 dark:to-gray-700 flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{member.full_name}</p>
                  <SegmentBadge segment={member.segment} />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{member.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-y-2 gap-x-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>
                  Se unió el <strong>{fmtDate(member.created_at)}</strong>
                </span>
              </div>
              {stats?.phone && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Smartphone className="w-4 h-4 flex-shrink-0" />
                    <strong>{stats.phone}</strong>
                  </div>
                  <a
                    href={`https://wa.me/${cleanPhone(stats.phone)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs font-medium text-[#25D366] hover:underline"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                </div>
              )}
              {stats?.birth_date && (
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Cake className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Cumpleaños: <strong>{fmtDate(stats.birth_date)}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-3 text-center">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-2">
                <Stamp className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">{currentBalance}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sellos</p>
            </Card>
            <Card className="p-3 text-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">{totalVisits}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Visitas</p>
            </Card>
            <Card className="p-3 text-center">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto mb-2">
                <Gift className="w-4 h-4" />
              </div>
              <p className="text-2xl font-bold tabular-nums text-gray-900 dark:text-gray-100">{rewardsRedeemed}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Premios</p>
            </Card>
          </div>

          {/* Progress card */}
          <Card className="p-4 bg-gradient-to-r from-amber-50 dark:from-amber-950 to-yellow-50 dark:to-yellow-950">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Progreso al próximo premio</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="bg-gradient-to-r from-amber-400 to-yellow-500 h-3 rounded-full"
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {currentBalance} de {stampsRequired} sellos
            </p>
          </Card>

          {/* Transaction history */}
          {txs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Historial</h4>
              </div>
              <Card className="max-h-48 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                {txs.map((tx) => (
                  <div key={tx.transaction_id} className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Stamp className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Sello entregado</span>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 tabular-nums">
                      {new Date(tx.created_at).toLocaleString('es-AR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))}
              </Card>
            </div>
          )}

          {/* Add stamp button */}
          <button
            onClick={handleAddStamp}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold transition-all shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Agregar sello manualmente
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── ActionPicker — shows previously sent campaigns from Comunicación ─────────

function ActionPicker({ type, count, onSend, onClose }) {
  if (!type) return null

  const isEmail = type === 'email'
  const campaigns = isEmail ? getEmailCampaigns() : getPushCampaigns()
  const Icon = isEmail ? Mail : Bell
  const label = isEmail ? 'Email' : 'Push'

  function fmtDate(iso) {
    return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="w-4 h-4" />
            {label} — {count} miembro{count > 1 ? 's' : ''}
          </DialogTitle>
        </DialogHeader>
        <p className="text-xs text-gray-400 -mt-2 mb-3">
          Elegí cuál de tus {isEmail ? 'emails enviados' : 'notificaciones enviadas'} reenviar a los miembros
          seleccionados.
        </p>

        {campaigns.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto">
              <Icon className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Todavía no enviaste ningún {isEmail ? 'email' : 'push'}
            </p>
            <p className="text-xs text-gray-400">
              Primero creá y enviá una campaña desde{' '}
              <a href="/comunicacion/roadmap" className="text-indigo-500 hover:underline font-medium">
                Comunicación
              </a>
              . Una vez enviada, aparecerá acá para reenviarla a segmentos específicos.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {campaigns.map((c) => (
              <button
                key={c.id}
                onClick={() => onSend(isEmail ? c.subject : c.header)}
                className="w-full flex items-start justify-between gap-3 text-left px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/40 dark:hover:bg-indigo-900/10 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {isEmail ? c.subject : c.header}
                  </p>
                  {(isEmail ? c.preview : c.body) && (
                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{isEmail ? c.preview : c.body}</p>
                  )}
                  <p className="text-[11px] text-gray-400 mt-1">
                    Enviado el {fmtDate(c.sent_at)} · {c.recipients} destinatarios
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 flex-shrink-0 transition-colors mt-0.5" />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function CustomersMoonCafe() {
  const [activeView, setActiveView] = useState('members')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [segmentFilter, setSegmentFilter] = useState('all')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [actionType, setActionType] = useState(null)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 1024)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const toggleSelect = (userId) =>
    setSelectedIds((prev) => {
      const next = new Set(prev)
      next.has(userId) ? next.delete(userId) : next.add(userId)
      return next
    })

  const clearSelection = () => setSelectedIds(new Set())

  const handleSend = (templateLabel) => {
    toast.success(`"${templateLabel}" enviado a ${selectedIds.size} miembro${selectedIds.size > 1 ? 's' : ''}`)
    setActionType(null)
    clearSelection()
  }

  const handleWhatsApp = () => {
    const withPhone = ENRICHED.filter((m) => selectedIds.has(m.user_id) && m.raw?.phone)
    if (withPhone.length === 0) {
      toast.error('Ningún miembro seleccionado tiene número de WhatsApp')
      return
    }
    if (withPhone.length === 1) {
      window.open(`https://wa.me/${cleanPhone(withPhone[0].raw.phone)}`, '_blank')
      clearSelection()
      return
    }
    const numbers = withPhone.map((m) => `${m.full_name}: ${m.raw.phone}`).join('\n')
    navigator.clipboard.writeText(numbers).then(() =>
      toast.success(`${withPhone.length} números copiados para lista de difusión`, {
        description: 'Pegá los contactos en WhatsApp para crear la lista.',
      }),
    )
    clearSelection()
  }

  const metrics = useMemo(() => {
    const now = new Date()
    const active = ENRICHED.filter((m) => m.segment === 'activo' || m.segment === 'vip').length
    const atRisk = ENRICHED.filter((m) => m.segment === 'en_riesgo').length
    const newThisMonth = ENRICHED.filter((m) => {
      const d = new Date(m.created_at)
      return d.getUTCFullYear() === now.getFullYear() && d.getUTCMonth() === now.getMonth()
    }).length
    return [
      {
        label: 'Total',
        value: ENRICHED.length,
        icon: Users,
        color: 'text-blue-600',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
      },
      {
        label: 'Activos (30d)',
        value: active,
        icon: TrendingUp,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      },
      {
        label: 'En riesgo',
        value: atRisk,
        icon: AlertCircle,
        color: 'text-orange-500',
        bg: 'bg-orange-50 dark:bg-orange-900/20',
      },
      {
        label: 'Nuevos',
        value: newThisMonth,
        icon: UserPlus,
        color: 'text-sky-600',
        bg: 'bg-sky-50 dark:bg-sky-900/20',
      },
    ]
  }, [])

  const segCounts = useMemo(() => {
    const c = { all: ENRICHED.length }
    Object.keys(SEGMENTS).forEach((s) => {
      c[s] = ENRICHED.filter((m) => m.segment === s).length
    })
    return c
  }, [])

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase()
    let list = ENRICHED.filter((m) => {
      const matchSearch = !q || m.full_name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
      const matchSeg = segmentFilter === 'all' || m.segment === segmentFilter
      return matchSearch && matchSeg
    })
    if (sortBy === 'recent') {
      list = [...list].sort((a, b) => {
        const so = SEGMENT_ORDER[a.segment] - SEGMENT_ORDER[b.segment]
        if (so !== 0) return so
        return (b.lastVisit?.getTime() ?? 0) - (a.lastVisit?.getTime() ?? 0)
      })
    } else if (sortBy === 'name') {
      list = [...list].sort((a, b) => a.full_name.localeCompare(b.full_name))
    } else if (sortBy === 'visits') {
      list = [...list].sort((a, b) => {
        const va = USER_STATS_MAP[a.user_id]?.loyalty_cards?.[0]?.total_visits ?? 0
        const vb = USER_STATS_MAP[b.user_id]?.loyalty_cards?.[0]?.total_visits ?? 0
        return vb - va
      })
    }
    return list
  }, [searchQuery, segmentFilter, sortBy])

  const allFilteredSelected = useMemo(
    () => filtered.length > 0 && filtered.every((m) => selectedIds.has(m.user_id)),
    [filtered, selectedIds],
  )

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      clearSelection()
    } else {
      setSelectedIds(new Set(filtered.map((m) => m.user_id)))
    }
  }

  const segmentPills = [
    { id: 'all', label: 'Todos' },
    { id: 'vip', label: 'VIP' },
    { id: 'activo', label: 'Activos' },
    { id: 'nuevo', label: 'Nuevos' },
    { id: 'en_riesgo', label: 'En riesgo' },
    { id: 'inactivo', label: 'Inactivos' },
  ]

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <Users className="w-8 h-8 text-gray-700 dark:text-gray-300" />
            <h1 className="text-4xl font-bold text-foreground">Miembros</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Seguí la actividad de los miembros de tu programa.</p>
        </motion.div>

        {/* Metric cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8"
        >
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.04 }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm"
            >
              <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center mb-3', m.bg)}>
                <m.icon className={cn('w-4 h-4', m.color)} />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-none mb-1">{m.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{m.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit"
        >
          {[
            { id: 'members', label: 'Miembros' },
            { id: 'activity', label: 'Actividad' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={cn(
                'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
                activeView === tab.id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
              )}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Members tab */}
        {activeView === 'members' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}>
            {/* Search + sort */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                <Input
                  placeholder="Buscar cliente..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-sm"
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-9 w-44 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Más recientes</SelectItem>
                  <SelectItem value="name">Nombre A–Z</SelectItem>
                  <SelectItem value="visits">Más visitas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Segment pills + select all */}
            <div className="flex flex-wrap items-center gap-1.5 mb-6">
              {segmentPills.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSegmentFilter(p.id)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap',
                    segmentFilter === p.id
                      ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700',
                  )}
                >
                  {p.label} <span className="opacity-60">({segCounts[p.id] ?? 0})</span>
                </button>
              ))}
              <button
                onClick={toggleSelectAll}
                className="ml-auto px-3 py-1 rounded-full text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all whitespace-nowrap"
              >
                {allFilteredSelected ? 'Deseleccionar todos' : 'Seleccionar todos'}
              </button>
            </div>

            {/* 2-column layout: list + detail panel */}
            <div className="flex gap-6 items-start">
              {/* List */}
              <div className={cn('min-w-0 transition-all duration-300', selectedCustomer ? 'flex-1' : 'w-full')}>
                {filtered.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">Sin resultados</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {filtered.map((member, i) => (
                      <motion.div
                        key={member.user_id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                      >
                        <MemberCard
                          member={member}
                          userData={USER_STATS_MAP[member.user_id]}
                          segment={member.segment}
                          lastVisit={member.lastVisit}
                          phone={member.raw?.phone}
                          isSelected={selectedIds.has(member.user_id)}
                          onSelect={toggleSelect}
                          onClick={(m) => setSelectedCustomer(selectedCustomer?.user_id === m.user_id ? null : m)}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Detail panel — desktop */}
              <AnimatePresence>
                {selectedCustomer && (
                  <motion.div
                    key="panel"
                    initial={{ opacity: 0, x: 32 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 32 }}
                    transition={{ duration: 0.2 }}
                    className="hidden lg:flex flex-col w-[360px] flex-shrink-0 sticky top-6 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden"
                    style={{ maxHeight: 'calc(100vh - 5rem)' }}
                  >
                    <MemberDetailPanel member={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Activity tab */}
        {activeView === 'activity' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}>
            <ActivityFeed />
          </motion.div>
        )}
      </div>

      {/* Mobile: original popup modal */}
      <CustomerDetailModal
        customer={isMobile ? selectedCustomer : null}
        brandId={null}
        initialData={USER_STATS_MAP[selectedCustomer?.user_id]}
        onClose={() => setSelectedCustomer(null)}
      />

      <ActionPicker
        type={actionType}
        count={selectedIds.size}
        onSend={handleSend}
        onClose={() => setActionType(null)}
      />

      {/* Floating action bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-2xl shadow-2xl px-4 py-3"
          >
            <span className="text-sm font-semibold pr-2 border-r border-white/20 dark:border-gray-900/20 whitespace-nowrap">
              {selectedIds.size} seleccionado{selectedIds.size > 1 ? 's' : ''}
            </span>
            <button
              onClick={() => setActionType('email')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-white/10 dark:hover:bg-gray-900/10 transition-colors whitespace-nowrap"
            >
              <Mail className="w-4 h-4" /> Email
            </button>
            <button
              onClick={() => setActionType('push')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-white/10 dark:hover:bg-gray-900/10 transition-colors whitespace-nowrap"
            >
              <Bell className="w-4 h-4" /> Push
            </button>
            <button
              onClick={() => setActionType('cupon')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-white/10 dark:hover:bg-gray-900/10 transition-colors whitespace-nowrap"
            >
              <Tag className="w-4 h-4" /> Cupón
            </button>
            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-[#25D366]/20 transition-colors whitespace-nowrap text-[#25D366]"
            >
              <WhatsAppIcon className="w-4 h-4" />
              {(() => {
                const n = ENRICHED.filter((m) => selectedIds.has(m.user_id) && m.raw?.phone).length
                return n > 1 ? `Lista (${n})` : 'WhatsApp'
              })()}
            </button>
            <button
              onClick={clearSelection}
              className="ml-1 p-1.5 rounded-lg hover:bg-white/10 dark:hover:bg-gray-900/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
