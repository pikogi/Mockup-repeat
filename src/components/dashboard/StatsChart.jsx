import React from 'react'
import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { AreaChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const PREV_LABEL = {
  prevAdds: 'Miembros (ant.)',
  prevScans: 'Sellos (ant.)',
  prevRedemptions: 'Premios (ant.)',
}

const CURR_LABEL = {
  adds: 'Miembros',
  scans: 'Sellos',
  redemptions: 'Premios',
}

const StatsChart = React.memo(function StatsChart({ title, data, color = '#3B82F6', dataKey, prevDataKey, loading }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card className="border-0 shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        </div>
        <div className="h-64">
          {loading ? (
            <div className="h-full flex flex-col justify-end gap-1 px-2">
              {[40, 65, 35, 80, 55, 90, 45].map((h, i) => (
                <div key={i} className="flex items-end gap-2 flex-1">
                  <div
                    className="w-full rounded-t-md bg-gray-200 dark:bg-gray-700 animate-pulse"
                    style={{ height: `${h}%`, opacity: 0.4 + i * 0.08 }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  allowDecimals={false}
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
                  itemStyle={{ color: color }}
                  labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDate ?? label}
                  formatter={(value, name) => [value, CURR_LABEL[name] ?? PREV_LABEL[name] ?? name]}
                  cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area
                  type="monotone"
                  dataKey={dataKey}
                  stroke={color}
                  strokeWidth={2.5}
                  fill={`url(#gradient-${dataKey})`}
                  dot={{ r: 3, fill: color, strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: color, stroke: 'white', strokeWidth: 2 }}
                />
                {prevDataKey && (
                  <Line
                    type="monotone"
                    dataKey={prevDataKey}
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
      </Card>
    </motion.div>
  )
})

export default StatsChart
