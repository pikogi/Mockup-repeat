import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { format } from 'date-fns'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import MembershipTabs from '@/components/memberships/MembershipTabs'
import { StatusBadge, PlanBadge } from '@/components/memberships/MembershipSections'
import { formatMoney } from '@/lib/membershipFormat'
import { loadMembershipData } from '@/constants/membershipDemoData'
import { addDaysUTC } from '@/utils/date'

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'active', label: 'Activo' },
  { value: 'expired', label: 'Vencido' },
  { value: 'cancelled', label: 'Cancelado' },
  { value: 'paused', label: 'Pausado' },
]

const RENEWAL_OPTIONS = [
  { value: 'all', label: 'Cualquier renovación' },
  { value: '7d', label: 'Vence en 7 días' },
  { value: '30d', label: 'Vence en 30 días' },
  { value: 'overdue', label: 'Vencidas' },
]

function matchesRenewalWindow(member, windowKey) {
  if (windowKey === 'all') return true
  if (!member.renewal_date) return false
  const now = new Date()
  const renewal = new Date(member.renewal_date)
  if (windowKey === '7d') return renewal >= now && renewal <= addDaysUTC(now, 7)
  if (windowKey === '30d') return renewal >= now && renewal <= addDaysUTC(now, 30)
  if (windowKey === 'overdue') return renewal < now
  return true
}

export default function MembershipMembers() {
  const navigate = useNavigate()
  const [data] = useState(loadMembershipData)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  const [renewalFilter, setRenewalFilter] = useState('all')

  const { plans, members } = data
  const planById = new Map(plans.map((p) => [p.id, p]))

  const query = search.trim().toLowerCase()
  const filtered = members.filter((m) => {
    if (query && !m.name.toLowerCase().includes(query) && !m.email.toLowerCase().includes(query)) return false
    if (statusFilter !== 'all' && m.status !== statusFilter) return false
    if (planFilter !== 'all' && m.plan_id !== planFilter) return false
    if (!matchesRenewalWindow(m, renewalFilter)) return false
    return true
  })

  return (
    <div className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <MembershipTabs />

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Miembros</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {filtered.length} de {members.length} {members.length === 1 ? 'miembro' : 'miembros'}
          </p>
        </div>

        {/* Búsqueda y filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre o email..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 transition"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] h-10 bg-white dark:bg-gray-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-full sm:w-[160px] h-10 bg-white dark:bg-gray-900">
              <SelectValue placeholder="Todos los planes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los planes</SelectItem>
              {plans.map((plan) => (
                <SelectItem key={plan.id} value={plan.id}>
                  {plan.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={renewalFilter} onValueChange={setRenewalFilter}>
            <SelectTrigger className="w-full sm:w-[190px] h-10 bg-white dark:bg-gray-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RENEWAL_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tabla */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">Sin miembros que coincidan con los filtros.</div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-4">Miembro</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Próxima renovación</TableHead>
                  <TableHead>Gasto total</TableHead>
                  <TableHead>LTV</TableHead>
                  <TableHead className="pr-4">Última visita</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((member) => (
                  <TableRow
                    key={member.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/memberships/members/${member.id}`)}
                  >
                    <TableCell className="pl-4">
                      <p className="font-medium text-gray-900 dark:text-white">{member.name}</p>
                      <p className="text-xs text-gray-400">{member.email}</p>
                    </TableCell>
                    <TableCell>
                      <PlanBadge plan={planById.get(member.plan_id)} />
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={member.status} />
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-300">
                      {member.renewal_date ? format(new Date(member.renewal_date), 'dd MMM yyyy') : '—'}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatMoney(member.total_spent)}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatMoney(member.lifetime_value)}
                    </TableCell>
                    <TableCell className="pr-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {member.last_visit ? format(new Date(member.last_visit), 'dd MMM yyyy') : '—'}
                      </p>
                      <p className="text-xs text-gray-400">{member.visit_frequency}</p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
