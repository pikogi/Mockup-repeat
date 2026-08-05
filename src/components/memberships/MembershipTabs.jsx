import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const TABS = [
  { label: 'Dashboard', to: '/memberships' },
  { label: 'Planes', to: '/memberships/plans' },
  { label: 'Miembros', to: '/memberships/members' },
  { label: 'Automatizaciones', to: '/memberships/automations' },
  { label: 'Analytics', to: '/memberships/analytics' },
]

export default function MembershipTabs() {
  const location = useLocation()

  return (
    <div className="inline-flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 p-1 mb-6">
      {TABS.map((tab) => {
        const isActive =
          tab.to === '/memberships' ? location.pathname === '/memberships' : location.pathname.startsWith(tab.to)
        return (
          <Link
            key={tab.to}
            to={tab.to}
            className={cn(
              'px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors',
              isActive
                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
