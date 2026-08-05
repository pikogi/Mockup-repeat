import { motion } from 'framer-motion'
import { Crown, Pencil, Copy, Trash2, Package, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatMoney, periodLabel } from '@/lib/membershipFormat'

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES = {
  active: { label: 'Activo', className: 'bg-emerald-50 text-emerald-600' },
  expired: { label: 'Vencido', className: 'bg-red-50 text-red-600' },
  cancelled: { label: 'Cancelado', className: 'bg-gray-100 text-gray-500' },
  paused: { label: 'Pausado', className: 'bg-amber-50 text-amber-600' },
}

export function StatusBadge({ status, className }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.active
  return (
    <span className={cn('inline-block text-xs font-semibold px-2.5 py-1 rounded-full', style.className, className)}>
      {style.label}
    </span>
  )
}

// ─── Plan badge (chip con color del plan) ─────────────────────────────────────

export function PlanBadge({ plan }) {
  if (!plan) return <span className="text-sm text-gray-400">Sin plan</span>
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: plan.color }} />
      {plan.name}
    </span>
  )
}

// ─── Plan card ────────────────────────────────────────────────────────────────

export function PlanCard({ plan, memberCount, onEdit, onDuplicate, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-white dark:bg-gray-900 rounded-2xl border overflow-hidden transition-all',
        plan.active
          ? 'border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md'
          : 'border-gray-200 dark:border-gray-700 opacity-60',
      )}
    >
      <div className="h-1.5" style={{ backgroundColor: plan.color }} />
      <div className="p-5 space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2">
            <p className="font-bold text-lg text-gray-900 dark:text-white">{plan.name}</p>
            {!plan.active && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Inactivo</span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{plan.description}</p>
        </div>

        <div className="flex items-end gap-1">
          <span className="text-2xl font-black text-gray-900 dark:text-white">{formatMoney(plan.price)}</span>
          <span className="text-sm text-gray-400 mb-0.5">/{periodLabel(plan.billing_period)}</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 pt-1 border-t border-gray-100 dark:border-gray-800">
          <span className="flex items-center gap-1.5 pt-3">
            <Crown className="w-3.5 h-3.5" style={{ color: plan.color }} />
            {memberCount} {memberCount === 1 ? 'miembro' : 'miembros'}
          </span>
          {plan.point_multiplier > 1 && <span className="pt-3">{plan.point_multiplier}x puntos</span>}
          {plan.member_limit && <span className="pt-3">Límite: {plan.member_limit}</span>}
        </div>

        <div className="flex items-center gap-1 pt-1">
          <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={() => onEdit(plan)}>
            <Pencil className="w-3.5 h-3.5" /> Editar
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDuplicate(plan)} title="Duplicar">
            <Copy className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(plan.id)}
            title="Eliminar"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

export function EmptyPlansState({ onCreate }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20 space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto">
        <Package className="w-8 h-8 text-gray-400" />
      </div>
      <div>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Sin planes todavía</p>
        <p className="text-sm text-gray-400 mt-1">Creá tu primer plan de membresía para empezar a vender.</p>
      </div>
      <Button onClick={onCreate} className="gap-2">
        <Plus className="w-4 h-4" /> Creá tu primer plan
      </Button>
    </motion.div>
  )
}
