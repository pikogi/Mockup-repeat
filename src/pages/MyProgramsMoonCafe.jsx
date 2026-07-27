import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CreditCard, Plus, Search, Info, Eye, Pencil, QrCode, Share2, Package, Trash2, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/components/auth/LanguageContext'
import { MOONCAFE_CLUBS, POINTS_TYPE_ID } from '@/constants/moonCafeClubs'

const TYPE_BADGE = {
  '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc151': {
    label: 'Sellos',
    className: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc157': {
    label: 'Puntos',
    className: 'text-purple-700 bg-purple-50 border-purple-200',
  },
  '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc155': { label: 'Membresía', className: 'text-blue-700 bg-blue-50 border-blue-200' },
}

function splitTwoLines(name) {
  const words = name.split(' ')
  if (words.length <= 2) return [name, '']
  const mid = Math.ceil(words.length / 2)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
}

function DemoClubCard({ card, onEdit, onCatalog }) {
  const [line1, line2] = splitTwoLines(card.club_name)
  const badge = TYPE_BADGE[card.program_type_id]
  const isPoints = card.program_type_id === POINTS_TYPE_ID

  const handleNotAvailable = () => toast.info('Esto es una demo — esta acción no está disponible.')

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="flex flex-col md:flex-row">
          {/* Colored panel */}
          <div
            className="w-full md:w-48 h-36 md:h-auto relative overflow-hidden flex-shrink-0"
            style={{ background: card.card_color || '#111827' }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white px-4">
                <p className="font-bold text-lg leading-tight">
                  {line1}
                  {line2 && (
                    <>
                      <br />
                      {line2}
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 p-6">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{card.club_name}</h3>
                {badge && (
                  <Badge variant="outline" className={cn('flex-shrink-0', badge.className)}>
                    <Package className="w-3 h-3 mr-1" />
                    {badge.label}
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{card.reward_text}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch checked={card.is_active} onCheckedChange={() => {}} />
                  <span className={`text-sm font-medium ${card.is_active ? 'text-emerald-600' : 'text-gray-500'}`}>
                    {card.is_active ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
                <Badge variant="outline" className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {card.members} miembros
                </Badge>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-2 h-9" onClick={handleNotAvailable}>
                <Eye className="w-4 h-4" /> Preview
              </Button>
              <Button variant="outline" size="sm" className="gap-2 h-9" onClick={() => onEdit(card)}>
                <Pencil className="w-4 h-4" /> Editar
              </Button>
              <Button variant="outline" size="sm" className="gap-2 h-9" onClick={handleNotAvailable}>
                <QrCode className="w-4 h-4" /> Ver QR
              </Button>
              <Button variant="outline" size="sm" className="gap-2 h-9" onClick={handleNotAvailable}>
                <Share2 className="w-4 h-4" /> Compartir Link
              </Button>
              {isPoints && (
                <Button variant="outline" size="sm" className="gap-2 h-9" onClick={() => onCatalog(card)}>
                  <Package className="w-4 h-4" /> Catálogo
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                disabled
                className="gap-2 h-9 text-red-500 border-red-200 opacity-60 cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" /> Eliminar
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default function MyProgramsMoonCafe() {
  const { t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const flowSuffix = location.pathname.includes('points') ? 'mooncafe-points' : 'mooncafe'

  const filteredCards = MOONCAFE_CLUBS.filter(
    (card) =>
      card.club_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.card_title?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleEdit = (card) => navigate(`/editclub-demo/${flowSuffix}?club=${card.id}`)
  const handleCatalog = (card) => navigate(`/catalogo-demo/mooncafe?club=${card.id}`)

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                <h1 className="text-4xl font-bold leading-tight text-foreground">{t('myPrograms')}</h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">{t('myProgramsSubtitle')}</p>
            </div>
            <Button size="lg" disabled className="w-full md:w-fit gap-2 opacity-40 cursor-not-allowed">
              <Plus className="w-5 h-5" />
              {t('createProgram')}
            </Button>
          </div>

          {/* Demo notice */}
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-blue-700 dark:text-blue-300 mb-4">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              Esta es una demo — la creación de clubes no está disponible. Para explorar la configuración, toca{' '}
              <strong>Editar</strong> en cualquiera de los clubes ya creados.
            </p>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder={t('searchPrograms')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl border-gray-200 dark:border-gray-700 focus:border-yellow-500"
            />
          </div>
        </motion.div>

        <div className="space-y-4">
          {filteredCards.map((card) => (
            <DemoClubCard key={card.id} card={card} onEdit={handleEdit} onCatalog={handleCatalog} />
          ))}
        </div>
      </div>
    </div>
  )
}
