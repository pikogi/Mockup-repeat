import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CreditCard, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PlanFormDialog from '@/components/memberships/PlanFormDialog'
import { PlanCard, EmptyPlansState } from '@/components/memberships/MembershipSections'
import { loadMembershipData, saveMembershipData, genMembershipId } from '@/constants/membershipDemoData'

const EMPTY_PLAN_FORM = {
  name: '',
  description: '',
  color: '#111827',
  billing_period_days: 30,
  price: '',
  trial_days: '',
  member_limit: '',
  cancellation_policy: 'anytime',
  allow_pause: true,
  active: true,
}

export default function MembershipPlans() {
  const [data, setData] = useState(loadMembershipData)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(EMPTY_PLAN_FORM)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    saveMembershipData(data)
  }, [data])

  const { plans, members } = data
  const memberCountByPlan = (planId) => members.filter((m) => m.plan_id === planId).length

  const openAdd = () => {
    setEditingId(null)
    setFormData(EMPTY_PLAN_FORM)
    setShowForm(true)
  }

  const openEdit = (plan) => {
    setEditingId(plan.id)
    setFormData({
      name: plan.name,
      description: plan.description || '',
      color: plan.color || '#111827',
      billing_period_days: plan.billing_period_days ?? 30,
      price: plan.price ?? '',
      trial_days: plan.trial_days ?? '',
      member_limit: plan.member_limit ?? '',
      cancellation_policy: plan.cancellation_policy || 'anytime',
      allow_pause: plan.allow_pause !== false,
      active: plan.active !== false,
    })
    setShowForm(true)
  }

  const handleSave = () => {
    if (!formData.name.trim() || !formData.price) return
    // Los servicios/productos/beneficios de un plan se definen en el editor del
    // programa (Beneficios del programa), no acá — se preservan si ya existían.
    const existing = editingId ? plans.find((p) => p.id === editingId) : null
    const plan = {
      ...existing,
      id: editingId || genMembershipId(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      color: formData.color,
      billing_period_days: formData.billing_period_days === '' ? 30 : Number(formData.billing_period_days),
      price: Number(formData.price),
      trial_days: formData.trial_days === '' ? 0 : Number(formData.trial_days),
      member_limit: formData.member_limit === '' ? null : Number(formData.member_limit),
      cancellation_policy: formData.cancellation_policy,
      allow_pause: formData.allow_pause,
      active: formData.active,
    }
    setData((prev) => ({
      ...prev,
      plans: editingId ? prev.plans.map((p) => (p.id === editingId ? plan : p)) : [...prev.plans, plan],
    }))
    setShowForm(false)
  }

  const handleDelete = (id) => {
    setData((prev) => ({ ...prev, plans: prev.plans.filter((p) => p.id !== id) }))
    setDeleteConfirm(null)
  }

  const handleDuplicate = (plan) => {
    setData((prev) => ({
      ...prev,
      plans: [...prev.plans, { ...plan, id: genMembershipId(), name: `${plan.name} (copia)` }],
    }))
  }

  const handleToggleActive = (plan) => {
    setData((prev) => ({
      ...prev,
      plans: prev.plans.map((p) => (p.id === plan.id ? { ...p, active: !p.active } : p)),
    }))
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="w-8 h-8 text-gray-700 dark:text-gray-300" />
              <h1 className="text-4xl font-bold leading-tight text-foreground">Planes de membresía</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {plans.length} {plans.length === 1 ? 'plan' : 'planes'}
            </p>
          </div>
          <Button onClick={openAdd} className="flex items-center gap-2 md:self-start">
            <Plus className="w-4 h-4" /> Nuevo plan
          </Button>
        </motion.div>

        {plans.length === 0 ? (
          <EmptyPlansState onCreate={openAdd} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                memberCount={memberCountByPlan(plan.id)}
                onEdit={openEdit}
                onDuplicate={handleDuplicate}
                onDelete={setDeleteConfirm}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-center font-semibold text-gray-900 dark:text-white mb-1">¿Eliminar plan?</p>
              <p className="text-center text-sm text-gray-500 mb-5">
                Los miembros actuales de este plan no se ven afectados, pero no podrás asignarlo a nuevos clientes.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>
                  Cancelar
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => handleDelete(deleteConfirm)}>
                  Eliminar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PlanFormDialog
        open={showForm}
        onOpenChange={setShowForm}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        editingId={editingId}
      />
    </div>
  )
}
