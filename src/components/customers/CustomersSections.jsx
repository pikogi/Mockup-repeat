import React from 'react'
import { Card } from '@/components/ui/card'
import { Mail, Stamp, TrendingUp, Gift, Users } from 'lucide-react'
import { format } from 'date-fns'
import { useLanguage } from '@/components/auth/LanguageContext'

export const CustomerCard = React.memo(function CustomerCard({ member, userData, onClick }) {
  const displayName = member.full_name || member.email || '?'
  const displayEmail = member.email || ''
  const displayDate = member.created_at

  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onClick(member)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 dark:from-indigo-900 to-purple-100 dark:to-purple-900 flex items-center justify-center flex-shrink-0">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">
              {displayName[0].toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{displayName}</p>
            {displayEmail && displayEmail !== displayName && (
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                <Mail className="w-3 h-3 inline mr-1 align-text-bottom" />
                {displayEmail}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {member.programs?.length > 0 && (
                <span className="truncate block">{member.programs.map((p) => p.program_name).join(', ')}</span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {displayDate ? format(new Date(displayDate), 'MMM d, yyyy') : '—'}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Miembro desde</p>
        </div>
      </div>

      {userData ? (
        userData.loyalty_cards?.map((lc) => {
          const stampsRequired = lc.program?.program_rules?.stamps_required ?? 20
          const currentStamps = lc.current_balance ?? 0
          const totalVisits = lc.total_visits ?? 0
          const rewardsRedeemed = lc.redemptions?.filter((r) => r.status === 'completed').length || 0
          const progressPct = Math.min(100, (currentStamps / stampsRequired) * 100)
          return (
            <div key={lc.card_id} className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              {userData.loyalty_cards.length > 1 && (
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                  {lc.program?.program_name}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span className="flex items-center gap-1">
                  <Stamp className="w-3.5 h-3.5 text-amber-500" />
                  <strong>{currentStamps}</strong> sellos
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
                {currentStamps}/{stampsRequired} sellos al próximo premio
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
})

export function CustomerListSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0" />
              <div className="space-y-2 min-w-0">
                <div className="w-36 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-48 h-3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
                <div className="w-28 h-3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
              </div>
            </div>
            <div className="text-right space-y-2 flex-shrink-0">
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-14 h-3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse ml-auto" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export function CustomerErrorState() {
  return (
    <Card className="p-12 text-center bg-red-50/50 dark:bg-red-950/20">
      <Users className="w-12 h-12 text-red-400 dark:text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Error cargando miembros</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        Revisa la consola del navegador (F12) para más detalles.
      </p>
    </Card>
  )
}

export function CustomerEmptyState() {
  const { t } = useLanguage()

  return (
    <Card className="p-12 text-center bg-gray-50 dark:bg-gray-800 border-dashed">
      <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('noCustomersTitle')}</h3>
      <p className="text-gray-500 dark:text-gray-400">{t('noCustomersDesc')}</p>
    </Card>
  )
}
