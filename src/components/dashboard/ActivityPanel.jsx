import { useState } from 'react'
import { Gift, QrCode, Trophy, UserPlus, X } from 'lucide-react'
import { motion } from 'framer-motion'

const EVENT_DEFS = {
  new_user: {
    label: 'Nuevo usuario',
    icon: UserPlus,
    bg: 'bg-sky-50 dark:bg-sky-950/50',
    text: 'text-sky-600 dark:text-sky-400',
  },
  stamp: {
    label: 'Sello entregado',
    icon: QrCode,
    bg: 'bg-amber-50 dark:bg-amber-950/50',
    text: 'text-amber-600 dark:text-amber-400',
  },
  completed: {
    label: 'Tarjeta completada',
    icon: Trophy,
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  reward: {
    label: 'Premio entregado',
    icon: Gift,
    bg: 'bg-purple-50 dark:bg-purple-950/50',
    text: 'text-purple-600 dark:text-purple-400',
  },
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 border-b">
      <div className="w-10 h-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse flex-shrink-0" />
      <div className="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex-shrink-0" />
      <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" style={{ width: '55%' }} />
      <div className="w-28 h-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse flex-shrink-0" />
    </div>
  )
}

function EventRow({ event }) {
  const def = EVENT_DEFS[event.type]
  if (!def) return null
  const { label, icon: Icon, bg, text } = def
  return (
    <div className="flex items-center gap-3 px-5 py-3.5 border-b last:border-0 hover:bg-gray-50/70 dark:hover:bg-gray-900/40 transition-colors">
      <span className="text-xs tabular-nums text-gray-400 dark:text-gray-500 w-10 flex-shrink-0 font-mono">
        {event.time}
      </span>
      <div className={`p-1.5 rounded-lg ${bg} flex-shrink-0`}>
        <Icon className={`w-3.5 h-3.5 ${text}`} />
      </div>
      <span className="flex-1 text-sm text-gray-800 dark:text-gray-200 truncate font-medium">{event.userName}</span>
      <span className={`text-xs font-semibold ${text} flex-shrink-0`}>{label}</span>
    </div>
  )
}

function DayHeader({ label }) {
  return (
    <div className="px-5 py-2.5 bg-gray-50 dark:bg-gray-900/60 border-b">
      <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{label}</p>
    </div>
  )
}

export function ActivityPanel({ activityEvents = [], loading }) {
  const [visibleDays, setVisibleDays] = useState(5)
  const [dateFilter, setDateFilter] = useState('')

  const today = new Date().toISOString().split('T')[0]

  const filtered = dateFilter ? activityEvents.filter((e) => e.dateKey === dateFilter) : activityEvents

  const grouped = filtered.reduce((acc, event) => {
    if (!acc[event.dateKey]) acc[event.dateKey] = { label: event.dateStr, events: [] }
    acc[event.dateKey].events.push(event)
    return acc
  }, {})

  const allDays = Object.entries(grouped)
  const visibleDaysData = dateFilter ? allDays : allDays.slice(0, visibleDays)
  const hasMore = !dateFilter && allDays.length > visibleDays

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div />
        <div className="relative flex-shrink-0">
          <input
            type="date"
            max={today}
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value)
              setVisibleDays(5)
            }}
            className="h-9 px-3 pr-8 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          />
          {dateFilter && (
            <button
              onClick={() => {
                setDateFilter('')
                setVisibleDays(5)
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center py-16 px-6 text-center">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Sin actividad para esta fecha</p>
          <button
            onClick={() => setDateFilter('')}
            className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Ver toda la actividad
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
          {visibleDaysData.map(([dateKey, { label, events }]) => (
            <div key={dateKey}>
              <DayHeader label={label} />
              {events.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </div>
          ))}
          {hasMore && (
            <div className="px-5 py-4 border-t bg-gray-50 dark:bg-gray-900/50 flex justify-center">
              <button
                onClick={() => setVisibleDays((v) => v + 5)}
                className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Ver más días
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
