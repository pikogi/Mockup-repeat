import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Search, Users, ArrowUpDown } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { format } from 'date-fns'

const LEVELS = [
  { name: 'Rookie', min: 0, max: 99, color: '#9ca3af', bg: '#f3f4f6' },
  { name: 'Amateur', min: 100, max: 249, color: '#16a34a', bg: '#f0fdf4' },
  { name: 'Pro', min: 250, max: 499, color: '#2563eb', bg: '#eff6ff' },
  { name: 'Elite', min: 500, max: 999, color: '#9333ea', bg: '#faf5ff' },
  { name: 'Beast', min: 1000, max: Infinity, color: '#ea580c', bg: '#fff7ed' },
]

function getLevel(xp) {
  return LEVELS.find((l) => xp >= l.min && xp <= l.max) ?? LEVELS[0]
}

function getNextLevel(xp) {
  const idx = LEVELS.findIndex((l) => xp >= l.min && xp <= l.max)
  return LEVELS[idx + 1] ?? null
}

const RAW = [
  {
    id: 1,
    name: 'Marcos Ríos',
    email: 'marcos.rios@gmail.com',
    joined: '2025-09-01',
    xp: 1240,
    streak: 12,
    visits: 124,
    rewards: 5,
  },
  {
    id: 2,
    name: 'Fernanda López',
    email: 'fer.lopez@gmail.com',
    joined: '2025-10-15',
    xp: 980,
    streak: 9,
    visits: 98,
    rewards: 3,
  },
  {
    id: 3,
    name: 'Carlos Martínez',
    email: 'carlos.mtz@gmail.com',
    joined: '2026-01-08',
    xp: 340,
    streak: 5,
    visits: 34,
    rewards: 2,
  },
  {
    id: 4,
    name: 'Valentina Cruz',
    email: 'valen.cruz@icloud.com',
    joined: '2026-01-20',
    xp: 520,
    streak: 7,
    visits: 52,
    rewards: 2,
  },
  {
    id: 5,
    name: 'Sebastián Morales',
    email: 'seba.m@hotmail.com',
    joined: '2026-02-03',
    xp: 820,
    streak: 6,
    visits: 82,
    rewards: 3,
  },
  {
    id: 6,
    name: 'Lucía Herrera',
    email: 'lucia.h@gmail.com',
    joined: '2026-02-18',
    xp: 180,
    streak: 3,
    visits: 18,
    rewards: 1,
  },
  {
    id: 7,
    name: 'Tomás Navarro',
    email: 'tomas.nav@gmail.com',
    joined: '2026-03-05',
    xp: 280,
    streak: 4,
    visits: 28,
    rewards: 1,
  },
  {
    id: 8,
    name: 'Camila Ortiz',
    email: 'cami.ortiz@yahoo.com',
    joined: '2026-03-20',
    xp: 110,
    streak: 2,
    visits: 11,
    rewards: 0,
  },
  {
    id: 9,
    name: 'Diego Vargas',
    email: 'diego.v@gmail.com',
    joined: '2026-04-01',
    xp: 60,
    streak: 1,
    visits: 6,
    rewards: 0,
  },
  {
    id: 10,
    name: 'Martina Rojas',
    email: 'marti.rojas@gmail.com',
    joined: '2026-04-15',
    xp: 30,
    streak: 0,
    visits: 3,
    rewards: 0,
  },
  {
    id: 11,
    name: 'Andrés Flores',
    email: 'andres.fl@gmail.com',
    joined: '2026-04-28',
    xp: 20,
    streak: 0,
    visits: 2,
    rewards: 0,
  },
  {
    id: 12,
    name: 'Isabella Méndez',
    email: 'isa.mendez@gmail.com',
    joined: '2026-05-05',
    xp: 10,
    streak: 0,
    visits: 1,
    rewards: 0,
  },
]

function MemberCard({ member, onClick }) {
  const level = getLevel(member.xp)
  const nextLevel = getNextLevel(member.xp)
  const progressPct = nextLevel ? Math.min(100, ((member.xp - level.min) / (nextLevel.min - level.min)) * 100) : 100

  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onClick?.(member)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 flex items-center justify-center flex-shrink-0">
            <span className="font-bold text-orange-600 dark:text-orange-400 text-lg">
              {member.name[0].toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{member.name}</p>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ color: level.color, background: level.bg }}
              >
                {level.name}
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{member.email}</p>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {format(new Date(member.joined), 'MMM d, yyyy')}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Miembro desde</p>
        </div>
      </div>

      {/* Stats + progress */}
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span className="flex items-center gap-1">
            <span>⚡</span>
            <strong>{member.xp}</strong> XP
          </span>
          <span className="flex items-center gap-1">
            <span>🔥</span>
            <strong>{member.streak}</strong> sem racha
          </span>
          <span className="flex items-center gap-1">
            <span>🏋️</span>
            <strong>{member.visits}</strong> visitas
          </span>
          <span className="flex items-center gap-1">
            <span>🏆</span>
            <strong>{member.rewards}</strong> premios
          </span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
          <div
            className="h-1.5 rounded-full transition-all"
            style={{ width: `${progressPct}%`, background: level.color }}
          />
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {nextLevel ? `${member.xp}/${nextLevel.min} XP para ${nextLevel.name}` : '¡Nivel máximo alcanzado! 🏆'}
        </p>
      </div>
    </Card>
  )
}

export default function CustomersGym() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('xp')

  const filtered = RAW.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'visits') return b.visits - a.visits
    if (sortBy === 'streak') return b.streak - a.streak
    if (sortBy === 'date') return new Date(b.joined) - new Date(a.joined)
    return b.xp - a.xp
  })

  const handleClick = useCallback(() => {
    window.parent?.postMessage({ type: 'tour-customer-clicked' }, '*')
  }, [])

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-gray-700 dark:text-gray-300" />
            <h1 className="text-4xl font-bold leading-tight text-foreground">Miembros</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Seguí el progreso gamificado de cada alumno.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-end gap-4 mb-8"
        >
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar por email o nombre"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl border-gray-200 dark:border-gray-700"
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-10 rounded-xl w-full sm:w-44">
              <ArrowUpDown className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-sm">Ordenar por</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xp">XP acumulado</SelectItem>
              <SelectItem value="streak">Racha activa</SelectItem>
              <SelectItem value="visits">Visitas totales</SelectItem>
              <SelectItem value="date">Fecha de ingreso</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Mostrando <span className="font-semibold text-gray-900 dark:text-gray-100">{sorted.length}</span> de{' '}
            <span className="font-semibold text-gray-900 dark:text-gray-100">{RAW.length}</span> miembros
          </p>
        </motion.div>

        <div className="space-y-3">
          {sorted.map((member) => (
            <motion.div key={member.id} layout transition={{ layout: { duration: 0.2 } }}>
              <MemberCard member={member} onClick={handleClick} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
