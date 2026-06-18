import React from 'react'
import { Info } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const MetricCard = React.memo(function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  gradient,
  href,
  loading,
  suffix,
  tooltip,
  subtitle,
}) {
  const Wrapper = href ? Link : 'div'
  const wrapperProps = href ? { to: href } : {}

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <Wrapper {...wrapperProps} className="block h-full">
        <Card
          className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full ${href ? 'cursor-pointer' : ''}`}
        >
          {tooltip && (
            <div className="absolute top-2 right-2 z-10 group">
              <Info className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors cursor-default" />
              <div className="absolute right-0 top-5 w-52 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-xl px-3 py-2.5 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none leading-relaxed z-20">
                {tooltip}
              </div>
            </div>
          )}
          <div className={`absolute inset-0 opacity-[0.08] ${gradient}`} />
          <div className="relative p-3 md:p-5 h-full">
            {/* Mobile: horizontal layout */}
            <div className="flex md:hidden items-center gap-3">
              <div className={`p-2 rounded-lg ${gradient} shadow-md flex-shrink-0`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 leading-tight">{title}</p>
                {loading ? (
                  <div className="w-16 h-5 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mt-0.5" />
                ) : (
                  <p className="text-lg font-bold tabular-nums text-gray-900 dark:text-gray-100 leading-none mt-0.5">
                    {(value ?? 0).toLocaleString()}
                    {suffix}
                  </p>
                )}
                {subtitle && !loading && (
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{subtitle}</p>
                )}
              </div>
              {trend && !loading && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                  {trend}
                </span>
              )}
            </div>

            {/* Desktop: flex-col justify-between so icon stays top, number stays bottom */}
            <div className="hidden md:flex flex-col justify-between h-full">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-2xl ${gradient} shadow-lg`}>
                  <Icon className="w-5 h-5 text-white" />
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
                  <>
                    <p className="text-3xl font-bold tabular-nums text-gray-900 dark:text-gray-100">
                      {(value ?? 0).toLocaleString()}
                      {suffix}
                    </p>
                    {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>}
                  </>
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
