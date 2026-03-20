import React from 'react'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const MetricCard = React.memo(function MetricCard({ title, value, icon: Icon, trend, gradient, href, loading }) {
  const Wrapper = href ? Link : 'div'
  const wrapperProps = href ? { to: href } : {}

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Wrapper {...wrapperProps}>
        <Card
          className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 ${href ? 'cursor-pointer' : ''}`}
        >
          <div className={`absolute inset-0 opacity-[0.08] ${gradient}`} />
          <div className="relative p-4 md:p-6">
            {/* Mobile: horizontal compact layout */}
            <div className="flex md:hidden items-center gap-3">
              <div className={`p-2.5 rounded-xl ${gradient} shadow-lg flex-shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                {trend && !loading && (
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{trend}</span>
                )}
              </div>
              {loading ? (
                <div className="w-12 h-7 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex-shrink-0" />
              ) : (
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex-shrink-0">
                  {(value ?? 0).toLocaleString()}
                </p>
              )}
            </div>

            {/* Desktop: vertical layout */}
            <div className="hidden md:block">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl ${gradient} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                {trend && !loading && (
                  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full">
                    {trend}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{title}</p>
                {loading ? (
                  <div className="w-24 h-9 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mt-1" />
                ) : (
                  <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{(value ?? 0).toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>
        </Card>
      </Wrapper>
    </motion.div>
  )
})

export default MetricCard
