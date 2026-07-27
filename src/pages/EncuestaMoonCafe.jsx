import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardList, Plus, MoreVertical, Copy, BarChart2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

const DEMO_SURVEY = {
  id: 1,
  name: 'Moon Cafe: Queremos conocer tu opinión',
  questions: 4,
  active: true,
}

export default function EncuestaMoonCafe() {
  const navigate = useNavigate()
  const [active, setActive] = useState(DEMO_SURVEY.active)

  const demoAction = () => toast('Función disponible próximamente en esta demo.')

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <ClipboardList className="w-7 h-7 text-gray-700 dark:text-gray-300" />
              <h1 className="text-3xl font-bold text-foreground">Encuestas de Satisfacción</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm ml-10">Conoce la experiencia real de tus clientes</p>
          </div>
          <Button
            size="lg"
            onClick={() => navigate('/encuesta/mooncafe-demo/crear')}
            className="w-full md:w-fit bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black gap-2 shadow-md border-0"
          >
            <Plus className="w-5 h-5" />
            Crear encuesta
          </Button>
        </motion.div>

        {/* Survey card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          <Card className="border border-gray-100 dark:border-gray-800 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{DEMO_SURVEY.name}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Switch
                    checked={active}
                    onCheckedChange={(v) => {
                      setActive(v)
                      toast(v ? 'Encuesta activada.' : 'Encuesta desactivada.')
                    }}
                  />
                  <button
                    onClick={demoAction}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <Badge className="bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 text-xs">Activa</Badge>
                <span className="text-xs text-gray-500 dark:text-gray-400">{DEMO_SURVEY.questions} preguntas</span>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 h-9"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.origin + '/encuesta/moon-cafe-demo').catch(() => {})
                    toast('Link copiado al portapapeles.')
                  }}
                >
                  <Copy className="w-4 h-4" />
                  Copiar link
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 h-9"
                  onClick={() => navigate('/encuesta/mooncafe-demo/resultados')}
                >
                  <BarChart2 className="w-4 h-4" />
                  Resultados
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
