import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Package, Info, Eye, Pencil, QrCode, Share2, Trash2, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { MOONCAFE_CLUBS, MEMBERSHIP_TYPE_ID } from '@/constants/moonCafeClubs'

const moonClub = MOONCAFE_CLUBS.find((card) => card.program_type_id === MEMBERSHIP_TYPE_ID)

function splitTwoLines(name) {
  const words = name.split(' ')
  if (words.length <= 2) return [name, '']
  const mid = Math.ceil(words.length / 2)
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
}

function handleNotAvailable() {
  toast.info('Esto es una demo — esta acción no está disponible.')
}

function MoonClubCard({ card }) {
  const navigate = useNavigate()
  const [line1, line2] = splitTwoLines(card.club_name)

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
                <Badge variant="outline" className="flex-shrink-0 text-blue-700 bg-blue-50 border-blue-200">
                  <Package className="w-3 h-3 mr-1" />
                  Membresía
                </Badge>
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
              <Button
                variant="outline"
                size="sm"
                className="gap-2 h-9"
                onClick={() => window.open('/memberships/clubs/preview', '_blank')}
              >
                <Eye className="w-4 h-4" /> Preview
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 h-9"
                onClick={() => navigate(`/memberships/clubs/edit?club=${card.id}`)}
              >
                <Pencil className="w-4 h-4" /> Editar
              </Button>
              <Button variant="outline" size="sm" className="gap-2 h-9" onClick={handleNotAvailable}>
                <QrCode className="w-4 h-4" /> Ver QR
              </Button>
              <Button variant="outline" size="sm" className="gap-2 h-9" onClick={handleNotAvailable}>
                <Share2 className="w-4 h-4" /> Compartir Link
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 h-9"
                onClick={() => window.open('/memberships/clubs/preview', '_blank')}
              >
                <Package className="w-4 h-4" /> Catálogo
              </Button>
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

export default function MembershipClubs() {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-8 h-8 text-gray-700 dark:text-gray-300" />
            <h1 className="text-4xl font-bold leading-tight text-foreground">Mis Clubes</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">El club de membresía conectado a este panel.</p>
        </motion.div>

        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-blue-700 dark:text-blue-300 mb-6">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="text-sm">
            Esta es una demo — la creación de clubes no está disponible. Tocá <strong>Editar</strong> para explorar la
            configuración del club.
          </p>
        </div>

        {moonClub && (
          <div className="space-y-4">
            <MoonClubCard card={moonClub} />
          </div>
        )}
      </div>
    </div>
  )
}
