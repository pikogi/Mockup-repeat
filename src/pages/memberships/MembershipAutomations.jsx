import { useState, useEffect } from 'react'
import { Zap } from 'lucide-react'
import MembershipTabs from '@/components/memberships/MembershipTabs'
import AutomationCard from '@/components/memberships/AutomationCard'
import { loadMembershipData, saveMembershipData, AUTOMATION_DEFINITIONS } from '@/constants/membershipDemoData'

export default function MembershipAutomations() {
  const [data, setData] = useState(loadMembershipData)

  useEffect(() => {
    saveMembershipData(data)
  }, [data])

  const activeCount = data.automations.filter((a) => a.enabled).length

  const handleChange = (updated) => {
    setData((prev) => ({
      ...prev,
      automations: prev.automations.map((a) => (a.id === updated.id ? updated : a)),
    }))
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <MembershipTabs />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Automatizaciones</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Se envían sin intervención manual según el comportamiento del miembro.
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full">
            <Zap className="w-3.5 h-3.5" /> {activeCount} activas
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {AUTOMATION_DEFINITIONS.map((definition) => {
            const state = data.automations.find((a) => a.id === definition.id)
            if (!state) return null
            return <AutomationCard key={definition.id} definition={definition} state={state} onChange={handleChange} />
          })}
        </div>
      </div>
    </div>
  )
}
