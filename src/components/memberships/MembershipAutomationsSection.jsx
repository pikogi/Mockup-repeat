import { Zap } from 'lucide-react'
import AutomationCard from '@/components/memberships/AutomationCard'
import { AUTOMATION_DEFINITIONS } from '@/constants/membershipDemoData'

// Automatizaciones de membresías, embebidas como pestaña dentro de Notificaciones
// (antes vivía en su propia ruta /memberships/automations).
export default function MembershipAutomationsSection({ automations, onChangeAutomation }) {
  const activeCount = automations.filter((a) => a.enabled).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Notificaciones automáticas</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Se envían sin intervención manual según el comportamiento del miembro.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-xl">
          <Zap className="w-3.5 h-3.5" />
          <span className="text-sm font-semibold">{activeCount} activas</span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {AUTOMATION_DEFINITIONS.map((definition) => {
          const state = automations.find((a) => a.id === definition.id)
          if (!state) return null
          return (
            <AutomationCard key={definition.id} definition={definition} state={state} onChange={onChangeAutomation} />
          )
        })}
      </div>
    </div>
  )
}
