import { Link } from 'react-router-dom'
import { createPageUrl } from '@/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/components/auth/LanguageContext'

export function ProgramListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-48 h-48 md:h-auto bg-gray-200 animate-pulse flex-shrink-0" />
            <div className="flex-1 p-6 space-y-4">
              <div className="space-y-2">
                <div className="w-48 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="w-64 h-4 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse" />
                <div className="w-24 h-6 bg-gray-100 rounded-full animate-pulse" />
              </div>
              <div className="w-full h-3 bg-gray-100 rounded animate-pulse" />
              <div className="w-3/4 h-3 bg-gray-100 rounded animate-pulse" />
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="w-24 h-8 bg-gray-100 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

export function EmptyProgramsState() {
  const { t } = useLanguage()

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 bg-gradient-to-br from-yellow-50 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Plus className="w-12 h-12 text-yellow-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('noProgramsTitle')}</h3>
        <p className="text-gray-600 mb-6">{t('noProgramsDesc')}</p>
        <Link to={createPageUrl('CreateClub')}>
          <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black gap-2">
            <Plus className="w-5 h-5" />
            {t('createFirstProgram')}
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}
