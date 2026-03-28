import { Store } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useLanguage } from '@/components/auth/LanguageContext'

export default function StoreFilterSelect({ stores, selectedStore, setSelectedStore }) {
  const { t } = useLanguage()

  if (!stores || stores.length <= 1) return null

  return (
    <Select value={selectedStore} onValueChange={setSelectedStore}>
      <SelectTrigger className="h-10 rounded-xl w-full md:w-[200px] bg-white dark:bg-gray-900">
        <Store className="w-4 h-4 mr-2 text-gray-500" />
        <SelectValue placeholder={t('filterStore')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t('allStores')}</SelectItem>
        {stores.map((store) => (
          <SelectItem key={store.id} value={store.id}>
            {store.store_name || store.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
