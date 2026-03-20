import { Card } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { createPageUrl } from '@/utils'
import { useLanguage } from '@/components/auth/LanguageContext'

export default function StampsDistribution({ data, loading }) {
  const { t } = useLanguage()
  const maxCount = Math.max(...data.map((d) => d.count), 1)
  const navigate = useNavigate()

  const handleBarClick = (stamps) => {
    navigate(createPageUrl('Customers') + `?stamps=${stamps}`)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="p-6 border-0 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('stampsDistributionTitle')}</h3>
        <p className="text-sm text-gray-500 mb-6">{t('stampsDistributionSubtitle')}</p>

        {loading ? (
          <div className="space-y-3">
            {[70, 45, 85, 30, 60, 20, 50, 35, 15, 40, 25].map((w, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse flex-shrink-0" />
                <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-200 rounded-full animate-pulse" style={{ width: `${w}%` }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((item, index) => (
              <div
                key={item.stamps}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1 rounded-lg transition-colors"
                onClick={() => handleBarClick(item.stamps)}
              >
                <div className="w-16 text-sm text-gray-600 flex-shrink-0">
                  {item.stamps} {item.stamps === 1 ? t('stampSingular') : t('stampPlural')}
                </div>
                <div className="flex-1 h-8 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.5 }}
                    className={`h-full rounded-full flex items-center justify-end pr-3 ${
                      item.count === 0 ? 'bg-transparent' : 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                    }`}
                    style={{
                      width: `${(item.count / maxCount) * 100}%`,
                      minWidth: item.count > 0 ? '40px' : '0',
                      transformOrigin: 'left',
                    }}
                  >
                    {item.count > 0 && (
                      <span className={`text-xs font-bold ${item.stamps === 0 ? 'text-gray-400' : 'text-white'}`}>
                        {item.count}
                      </span>
                    )}
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  )
}
