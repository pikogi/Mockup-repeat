import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { toast } from 'sonner'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const HEADER_MAX = 40
const BODY_MAX = 200

// Tarjeta de automatización: mismo patrón visual/interacción que las automatizaciones
// de notificaciones ya existentes en el resto de la app (icono + trigger + preview
// colapsado + "Configurar mensaje" expandible), simplificado a una sola condición
// numérica genérica ({ label, value }) en vez de los múltiples tipos de condición
// del sistema original — suficiente para las 13 automatizaciones de membresías.
export default function AutomationCard({ definition, state, onChange }) {
  const [expanded, setExpanded] = useState(false)
  const [draft, setDraft] = useState({ header: state.header, body: state.body, extra_value: state.extra_value })
  const Icon = definition.icon

  const handleExpand = () => {
    setDraft({ header: state.header, body: state.body, extra_value: state.extra_value })
    setExpanded(true)
  }

  const handleCancel = () => setExpanded(false)

  const handleSave = () => {
    onChange({ ...state, header: draft.header, body: draft.body, extra_value: draft.extra_value })
    setExpanded(false)
    toast.success('Automatización guardada')
  }

  return (
    <Card
      className={cn(
        'overflow-hidden flex flex-col',
        state.enabled ? `border-l-4 ${definition.accent}` : 'border-gray-200 dark:border-gray-800',
      )}
    >
      <div className="flex items-start gap-4 p-5">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', definition.color)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{definition.title}</p>
            {state.enabled && (
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded-full">
                Activa
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{definition.description}</p>
          {definition.extraLabel && !expanded && (
            <p className="text-xs text-gray-400 mt-0.5">
              {definition.extraLabel}: <strong>{state.extra_value}</strong>
            </p>
          )}
        </div>
        <Switch
          checked={state.enabled}
          onCheckedChange={(v) => onChange({ ...state, enabled: v })}
          className="flex-shrink-0 mt-0.5"
        />
      </div>

      {!expanded && (
        <div className="mx-5 mb-4">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 px-4 py-3">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5 truncate">{state.header}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{state.body}</p>
          </div>
        </div>
      )}

      <button
        onClick={() => (expanded ? handleCancel() : handleExpand())}
        className="mt-auto w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 border-t border-gray-100 dark:border-gray-800 transition-colors"
      >
        {expanded ? (
          <>
            <ChevronUp className="w-3.5 h-3.5" /> Cerrar
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5" /> Configurar mensaje
          </>
        )}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 space-y-4 border-t border-gray-100 dark:border-gray-800">
              {definition.extraLabel && (
                <div className="space-y-1.5">
                  <Label>{definition.extraLabel}</Label>
                  <Input
                    type="number"
                    value={draft.extra_value ?? ''}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, extra_value: e.target.value === '' ? null : Number(e.target.value) }))
                    }
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label>Título</Label>
                  <span className="text-xs text-gray-400">
                    {draft.header.length}/{HEADER_MAX}
                  </span>
                </div>
                <Input
                  value={draft.header}
                  maxLength={HEADER_MAX}
                  onChange={(e) => setDraft((d) => ({ ...d, header: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label>Mensaje</Label>
                  <span className="text-xs text-gray-400">
                    {draft.body.length}/{BODY_MAX}
                  </span>
                </div>
                <Textarea
                  value={draft.body}
                  maxLength={BODY_MAX}
                  rows={3}
                  onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button className="flex-1" onClick={handleSave}>
                  Guardar
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}
