import { Bell } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/components/auth/LanguageContext'

export default function Notifications() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center mx-auto mb-6">
          <Bell className="w-10 h-10 text-indigo-400" />
        </div>
        <h1 className="text-4xl font-bold leading-tight text-foreground mb-3">{t('notifications')}</h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">{t('comingSoon')}</p>
      </motion.div>
    </div>
  )
}
