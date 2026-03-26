import { cn } from '@/lib/utils'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { motion, AnimatePresence } from 'framer-motion'
import { format, subMonths } from 'date-fns'
import { useLanguage } from '@/components/auth/LanguageContext'

export default function DateFilterSelect({
  dateFilter,
  setDateFilter,
  customDate,
  setCustomDate,
  maxMonthsBack = 3,
  className,
}) {
  const { t } = useLanguage()

  return (
    <div className={cn('flex w-full md:w-auto flex-wrap items-end gap-2', className)}>
      <Select value={dateFilter} onValueChange={setDateFilter}>
        <SelectTrigger className="h-10 w-full md:w-[200px] bg-white dark:bg-gray-900">
          <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
          <SelectValue placeholder={t('filterPeriod')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7d">{t('period7d')}</SelectItem>
          <SelectItem value="month">{t('periodMonth')}</SelectItem>
          <SelectItem value="custom">{t('periodCustom')}</SelectItem>
        </SelectContent>
      </Select>

      <AnimatePresence>
        {dateFilter === 'custom' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full md:w-auto overflow-hidden"
          >
            <div className="flex gap-2">
              <div className="flex flex-1 md:flex-none flex-col gap-1">
                <Label className="text-xs text-gray-500 dark:text-gray-400">Desde</Label>
                <Input
                  type="date"
                  className="bg-white dark:bg-gray-900 w-full md:w-[160px] h-10"
                  value={format(customDate.from, 'yyyy-MM-dd')}
                  min={format(subMonths(new Date(), maxMonthsBack), 'yyyy-MM-dd')}
                  max={format(customDate.to, 'yyyy-MM-dd')}
                  onChange={(e) => {
                    if (!e.target.value) return
                    setCustomDate((prev) => ({ ...prev, from: new Date(e.target.value + 'T00:00:00') }))
                  }}
                />
              </div>
              <div className="flex flex-1 md:flex-none flex-col gap-1">
                <Label className="text-xs text-gray-500 dark:text-gray-400">Hasta</Label>
                <Input
                  type="date"
                  className="bg-white dark:bg-gray-900 w-full md:w-[160px] h-10"
                  value={format(customDate.to, 'yyyy-MM-dd')}
                  min={format(customDate.from, 'yyyy-MM-dd')}
                  max={format(new Date(), 'yyyy-MM-dd')}
                  onChange={(e) => {
                    if (!e.target.value) return
                    setCustomDate((prev) => ({ ...prev, to: new Date(e.target.value + 'T00:00:00') }))
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
