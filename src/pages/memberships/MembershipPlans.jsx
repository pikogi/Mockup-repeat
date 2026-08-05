import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MembershipTabs from '@/components/memberships/MembershipTabs'
import PlanFormDialog from '@/components/memberships/PlanFormDialog'
import { PlanCard, EmptyPlansState } from '@/components/memberships/MembershipSections'
import { loadMembershipData, saveMembershipData, genMembershipId } from '@/constants/membershipDemoData'

const EMPTY_PLAN_FORM = {
  name: '',
  description: '',
  color: '#111827',
  billing_period: 'monthly',
  price: '',
  trial_days: '',
  member_limit: '',
  included_services: [],
  included_products: [],
  discount_pct: '',
  point_multiplier: '1',
  welcome_reward: '',
  renewal_reward: '',
  perks: [],
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
      billing_period: plan.billing_period,
      price: plan.price ?? '',
      trial_days: plan.trial_days ?? '',
      member_limit: plan.member_limit ?? '',
      included_services: plan.included_services || [],
      included_products: plan.included_products || [],
      discount_pct: plan.discount_pct ?? '',
      point_multiplier: plan.point_multiplier ?? 1,
      welcome_reward: plan.welcome_reward || '',
      renewal_reward: plan.renewal_reward || '',
      perks: plan.perks || [],
      cancellation_policy: plan.cancellation_policy || 'anytime',
      allow_pause: plan.allow_pause !== false,
      active: plan.active !== false,
    })
    setShowForm(true)
  }

  const handleSave = () => {
    if (!formData.name.trim() || !formData.price) return
    const plan = {
      id: editingId || genMembershipId(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      color: formData.color,
      billing_period: formData.billing_period,
      price: Number(formData.price),
      trial_days: formData.trial_days === '' ? 0 : Number(formData.trial_days),
      renewal_frequency: formData.billing_period,
      member_limit: formData.member_limit === '' ? null : Number(formData.member_limit),
      included_services: formData.included_services.filter((s) => s.name.trim()),
      included_products: formData.included_products.filter((p) => p.name.trim()),
      discount_pct: formData.discount_pct === '' ? null : Number(formData.discount_pct),
      point_multiplier: formData.point_multiplier === '' ? 1 : Number(formData.point_multiplier),
      welcome_reward: formData.welcome_reward.trim() || null,
      renewal_reward: formData.renewal_reward.trim() || null,
      perks: formData.perks.filter((p) => p.name.trim()),
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

  return (
    <div className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <MembershipTabs />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Planes de membresía</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {plans.length} {plans.length === 1 ? 'plan' : 'planes'}
            </p>
          </div>
          <Button onClick={openAdd} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nuevo plan
          </Button>
        </div>

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
