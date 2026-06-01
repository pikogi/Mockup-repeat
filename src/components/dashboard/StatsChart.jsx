import React, { useRef, useState } from 'react'
import { Card } from '@/components/ui/card'
import { ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { AreaChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const PREV_LABEL = {
  prevAdds: 'Nuevos (ant.)',
  prevScans: 'Sellos (ant.)',
  prevPoints: 'Puntos (ant.)',
  prevRedemptions: 'Premios (ant.)',
  prevReturning: 'Volvieron (ant.)',
}

const CURR_LABEL = {
  adds: 'Nuevos',
  scans: 'Sellos',
  points: 'Puntos',
  redemptions: 'Premios',
  returning: 'Volvieron',
}

function MobileTabDropdown({ tabs, activeTab, onTabChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const active = tabs.find((t) => t.key === activeTab) ?? tabs[0]

  React.useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative md:hidden flex-shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-900 dark:text-gray-100"
      >
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: active.color }} />
        {active.label}
        <ChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-20 min-w-[110px]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                onTabChange?.(tab.key)
                setOpen(false)
              }}
              className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-left transition-colors ${
                tab.key === activeTab
                  ? 'bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: tab.color }} />
              {tab.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

const StatsChart = React.memo(function StatsChart({
  title,
  mobileTitle,
  data,
  color = '#3B82F6',
  dataKey,
  prevDataKey,
  loading,
  tabs,
  activeTab,
  onTabChange,
}) {
  const activeConfig = tabs ? (tabs.find((t) => t.key === activeTab) ?? tabs[0]) : null
  const effectiveDataKey = activeConfig?.key ?? dataKey
  const effectivePrevDataKey = activeConfig?.prevKey ?? prevDataKey
  const effectiveColor = activeConfig?.color ?? color

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 md:px-6 md:pt-6">
          {tabs ? (
            <>
              <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 md:text-sm">
                {mobileTitle && <span className="md:hidden">{mobileTitle}</span>}
                <span className={mobileTitle ? 'hidden md:inline' : undefined}>
                  {title ?? 'Actividad en el tiempo'}
                </span>
              </h3>
              {tabs.length >= 3 ? (
                <>
                  {/* Mobile: custom dropdown */}
                  <MobileTabDropdown tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
                  {/* Desktop: pills */}
                  <div className="hidden md:flex gap-0.5 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 flex-shrink-0">
                    {tabs.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => onTabChange?.(tab.key)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          activeTab === tab.key
                            ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex gap-0.5 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 flex-shrink-0">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => onTabChange?.(tab.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        activeTab === tab.key
                          ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: effectiveColor }} />
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
            </div>
          )}
        </div>
        <div className="h-64 px-2 pb-2 md:px-3">
          {loading ? (
            <div className="h-full flex items-end gap-1 px-2 pb-1">
              {[40, 65, 35, 80, 55, 90, 45, 70, 50, 85, 60, 75, 45, 90].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-gray-200 dark:bg-gray-700 animate-pulse"
                  style={{ height: `${h}%`, opacity: 0.3 + i * 0.04 }}
                />
              ))}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`gradient-${effectiveDataKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={effectiveColor} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={effectiveColor} stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                  allowDecimals={false}
                  width={28}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--tooltip-bg))',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
                    padding: '12px 16px',
                  }}
                  labelStyle={{ color: 'hsl(var(--tooltip-label))', fontWeight: 600, marginBottom: 4 }}
                  itemStyle={{ color: effectiveColor }}
                  labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate ?? label}
                  formatter={(value, name) => [value, CURR_LABEL[name] ?? PREV_LABEL[name] ?? name]}
                  cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area
                  type="monotone"
                  dataKey={effectiveDataKey}
                  stroke={effectiveColor}
                  strokeWidth={2.5}
                  fill={`url(#gradient-${effectiveDataKey})`}
                  dot={{ r: 3, fill: effectiveColor, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: effectiveColor, stroke: 'white', strokeWidth: 2 }}
                />
                {effectivePrevDataKey && (
                  <Line
                    type="monotone"
                    dataKey={effectivePrevDataKey}
                    stroke="#94a3b8"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    dot={false}
                    activeDot={{ r: 3, fill: '#94a3b8', stroke: 'white', strokeWidth: 2 }}
                    legendType="none"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        {effectivePrevDataKey && (
          <div className="flex items-center gap-4 px-5 pb-4 md:px-6 text-xs text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-4 h-0.5 rounded" style={{ backgroundColor: effectiveColor }} />
              Período actual
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-4 border-t border-dashed border-gray-400 dark:border-gray-500" />
              Período anterior
            </span>
          </div>
        )}
      </Card>
    </motion.div>
  )
})

export default StatsChart
