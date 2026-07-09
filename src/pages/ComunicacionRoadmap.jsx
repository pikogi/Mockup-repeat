import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Bell,
  Mail,
  Send,
  Users,
  Clock,
  CheckCircle2,
  Sparkles,
  Cake,
  Star,
  ChevronDown,
  ChevronUp,
  Zap,
  Megaphone,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  ImageIcon,
  X,
  Search,
  Code2,
  Eye,
  FileSpreadsheet,
  ArrowLeft,
  Target,
  Flame,
  ShoppingBag,
  BarChart2,
  Heart,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// ─── Constants ───────────────────────────────────────────────────────────────

const PUSH_HEADER_MAX = 40
const PUSH_BODY_MAX = 200
const EMAIL_SUBJECT_MAX = 80

const DEMO_MEMBERS = [
  { id: 1, name: 'Carlos Martínez', email: 'carlos.mtz@gmail.com' },
  { id: 2, name: 'Sofía Ramírez', email: 'sofi.ramirez@gmail.com' },
  { id: 3, name: 'Andrés Morales', email: 'andres.m@hotmail.com' },
  { id: 4, name: 'Valentina Cruz', email: 'valen.cruz@icloud.com' },
  { id: 5, name: 'Lucía Herrera', email: 'lucia.h@gmail.com' },
  { id: 6, name: 'Mateo Flores', email: 'mateo.flores@gmail.com' },
  { id: 7, name: 'Camila Ortiz', email: 'cami.ortiz@yahoo.com' },
  { id: 8, name: 'Diego Vargas', email: 'diego.v@gmail.com' },
  { id: 9, name: 'Martina Rojas', email: 'marti.rojas@gmail.com' },
  { id: 10, name: 'Sebastián Castro', email: 'seba.castro@hotmail.com' },
  { id: 11, name: 'Isabella Méndez', email: 'isa.mendez@gmail.com' },
  { id: 12, name: 'Tomás Navarro', email: 'tomas.nav@gmail.com' },
]

const PUSH_AUTOMATIONS_DEFAULT = [
  {
    id: 'push-welcome',
    icon: Sparkles,
    color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600',
    accent: 'border-emerald-400',
    title: 'Bienvenida',
    description: 'Se envía cuando un nuevo miembro se une al programa.',
    enabled: true,
    header: '¡Bienvenido/a a Moon Café! ☕',
    body: 'Gracias por unirte. A partir de ahora acumulás sellos en cada visita y accedés a tu café gratis.',
    extra: null,
  },
  {
    id: 'push-birthday',
    icon: Cake,
    color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600',
    accent: 'border-rose-400',
    title: 'Cumpleaños',
    description: 'Se envía antes o el día del cumpleaños del miembro.',
    enabled: true,
    header: '¡Feliz cumpleaños! 🎂',
    body: 'En tu día te regalamos un café gratis. Pasá por Moon Café y celebrá con tu favorito.',
    extra: { type: 'birthday_days', value: 0 },
  },
  {
    id: 'push-inactivity',
    icon: Clock,
    color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
    accent: 'border-slate-400',
    title: 'Inactividad',
    description: 'Se envía si el miembro no visitó en los últimos N días.',
    enabled: true,
    header: 'Te extrañamos ☕',
    body: 'Hace tiempo que no pasás por Moon Café. Volvé y seguí acumulando sellos hacia tu próximo café gratis.',
    extra: { type: 'days', value: 30 },
  },
  {
    id: 'push-benefit',
    icon: Star,
    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600',
    accent: 'border-amber-400',
    title: 'Premio desbloqueado',
    description: 'Se envía cuando el miembro completa la tarjeta y desbloquea su premio.',
    enabled: true,
    header: '¡Tenés un café gratis! 🎁',
    body: 'Completaste tu tarjeta Moon Café. Presentá tu wallet en caja y disfrutá tu café gratis.',
    extra: null,
  },
  {
    id: 'push-near-reward',
    icon: Target,
    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600',
    accent: 'border-amber-500',
    title: 'Cerca del premio',
    description: 'Se envía cuando al miembro le quedan pocos sellos para completar la tarjeta.',
    enabled: false,
    header: '¡Casi llegás! 🎯',
    body: 'Te faltan solo 2 sellos para tu próximo café gratis. ¡Pasá por Moon Café hoy y completá tu tarjeta!',
    extra: { type: 'stamps_remaining', value: 2 },
  },
  {
    id: 'push-streak',
    icon: Flame,
    color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600',
    accent: 'border-orange-500',
    title: 'Racha de visitas',
    description: 'Se envía cuando el miembro acumula varias visitas en pocos días.',
    enabled: false,
    header: '¡Estás en racha! 🔥',
    body: 'Llevas 3 visitas esta semana. ¡Seguí así y completá tu tarjeta antes de que te des cuenta!',
    extra: { type: 'streak_visits', value: 3 },
  },
  {
    id: 'push-early-reactivation',
    icon: Clock,
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
    accent: 'border-blue-400',
    title: 'Reactivación temprana',
    description: 'Se envía si el miembro no visitó en los últimos 14 días.',
    enabled: false,
    header: '¿Todo bien? ☕',
    body: 'Hace 14 días que no pasás por Moon Café. Tus sellos te esperan — ¡volvé cuando quieras!',
    extra: { type: 'days', value: 14 },
  },
  {
    id: 'push-combo',
    icon: ShoppingBag,
    color: 'bg-violet-100 dark:bg-violet-900/30 text-violet-600',
    accent: 'border-violet-400',
    title: 'Combo sugerido',
    description: 'Se envía en horario pico para sugerir un add-on y aumentar el ticket.',
    enabled: false,
    header: '¿Ya tomaste tu café? ☕🥐',
    body: 'Hoy nuestro combo café + medialunas tiene 15% off. ¡Solo hasta las 12! Mostrá tu wallet en caja.',
    extra: { type: 'hour', value: 10 },
  },
  {
    id: 'push-featured',
    icon: Megaphone,
    color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600',
    accent: 'border-rose-500',
    title: 'Producto destacado',
    description: 'Se envía manualmente para promocionar un producto nuevo o de temporada.',
    enabled: false,
    header: 'Novedad en Moon Café ✨',
    body: 'Llegó el chai latte de temporada. Pasá a probarlo y sumá sellos como siempre.',
    extra: null,
  },
]

const EMAIL_AUTOMATIONS_DEFAULT = [
  {
    id: 'email-welcome',
    icon: Sparkles,
    color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600',
    accent: 'border-emerald-400',
    title: 'Bienvenida',
    description: 'Se envía cuando un nuevo miembro se une al programa.',
    enabled: true,
    header: '¡Bienvenido/a a Moon Café! ☕',
    body: 'Hola, bienvenido/a al programa de fidelidad de Moon Café. A partir de ahora acumulás sellos en cada visita y cuando completes tu tarjeta recibís un café gratis. Tu tarjeta ya está disponible en Google y Apple Wallet.',
    extra: null,
    heroImage: null,
  },
  {
    id: 'email-birthday',
    icon: Cake,
    color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600',
    accent: 'border-rose-400',
    title: 'Cumpleaños',
    description: 'Se envía antes o el día del cumpleaños del miembro.',
    enabled: true,
    header: '¡Feliz cumpleaños! Te regalamos un café 🎂',
    body: '¡Hoy es tu día y queremos celebrarlo! En tu cumpleaños te regalamos un café gratis. Pasá por cualquiera de nuestras sucursales y presentá tu tarjeta. ¡Que lo disfrutes!',
    extra: { type: 'birthday_days', value: 0 },
    heroImage: null,
  },
  {
    id: 'email-inactivity',
    icon: Clock,
    color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
    accent: 'border-slate-400',
    title: 'Inactividad',
    description: 'Se envía si el miembro no visitó en los últimos N días.',
    enabled: true,
    header: 'Te extrañamos en Moon Café ☕',
    body: 'Hace tiempo que no pasás por Moon Café. Tus sellos te esperan y estás cada vez más cerca de tu próximo café gratis. Visitanos y seguí acumulando.',
    extra: { type: 'days', value: 30 },
    heroImage: null,
  },
  {
    id: 'email-benefit',
    icon: Star,
    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600',
    accent: 'border-amber-400',
    title: 'Premio desbloqueado',
    description: 'Se envía cuando el miembro completa la tarjeta y desbloquea su premio.',
    enabled: true,
    header: '¡Tenés un café gratis esperándote! 🎁',
    body: 'Completaste tu tarjeta Moon Café. Pasá por cualquiera de nuestras sucursales, presentá tu tarjeta en caja y disfrutá tu café gratis. ¡Te lo ganaste!',
    extra: null,
    heroImage: null,
  },
  {
    id: 'email-monthly-summary',
    icon: BarChart2,
    color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600',
    accent: 'border-indigo-400',
    title: 'Resumen mensual',
    description: 'Se envía el 1° de cada mes con el resumen de actividad del miembro.',
    enabled: false,
    header: 'Tu mes en Moon Café ☕',
    body: 'Este mes acumulaste X sellos y realizaste X visitas. ¡Seguí así para llegar a tu próximo premio! Gracias por ser parte de Moon Café.',
    extra: { type: 'monthly_day', value: 1 },
    heroImage: null,
  },
  {
    id: 'email-post-visit',
    icon: Heart,
    color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600',
    accent: 'border-pink-400',
    title: 'Post-visita',
    description: 'Se envía 2 horas después de cada visita para pedir feedback.',
    enabled: false,
    header: '¿Cómo estuvo tu visita? 💛',
    body: 'Gracias por pasar hoy por Moon Café. ¿Qué te pareció? Tu opinión nos ayuda a mejorar cada taza. ¡Esperamos verte pronto!',
    extra: { type: 'hours_after_visit', value: 2 },
    heroImage: null,
  },
]

// ─── Shared components ────────────────────────────────────────────────────────

function AutomationCard({
  auto,
  onChange,
  headerLabel,
  bodyLabel,
  headerMax,
  bodyMax,
  richBody = false,
  expanded: expandedProp,
  onExpand,
  onCollapse,
  onDraftChange,
}) {
  const [expandedLocal, setExpandedLocal] = useState(false)
  const expanded = expandedProp !== undefined ? expandedProp : expandedLocal
  const [draft, setDraft] = useState({
    header: auto.header,
    body: auto.body,
    days: auto.extra?.value ?? 30,
    heroImage: auto.heroImage ?? null,
  })
  const cardEditorRef = useRef(null)
  const cardImgRef = useRef(null)
  const Icon = auto.icon

  // Populate rich editor when card expands
  useEffect(() => {
    if (expanded && richBody && cardEditorRef.current) {
      cardEditorRef.current.innerHTML = draft.body
    }
  }, [expanded]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sync live preview when in controlled (split-view) mode
  useEffect(() => {
    if (expanded && onDraftChange) {
      onDraftChange({ subject: draft.header, body: draft.body, heroImage: draft.heroImage })
    }
  }, [draft, expanded]) // eslint-disable-line react-hooks/exhaustive-deps

  // Reset draft to latest saved values when collapsed
  useEffect(() => {
    if (!expanded) {
      setDraft({
        header: auto.header,
        body: auto.body,
        days: auto.extra?.value ?? 30,
        heroImage: auto.heroImage ?? null,
      })
    }
  }, [auto, expanded])

  const handleCardImage = (file) => {
    if (!file?.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => setDraft((d) => ({ ...d, heroImage: e.target.result }))
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    const body = richBody ? cardEditorRef.current?.innerHTML || '' : draft.body
    onChange({
      ...auto,
      header: draft.header,
      body,
      heroImage: richBody ? draft.heroImage : undefined,
      extra: auto.extra ? { ...auto.extra, value: draft.days } : null,
    })
    if (onCollapse) onCollapse()
    else setExpandedLocal(false)
    toast.success('Automatización guardada')
  }

  const handleCancel = () => {
    setDraft({ header: auto.header, body: auto.body, days: auto.extra?.value ?? 30, heroImage: auto.heroImage ?? null })
    if (richBody && cardEditorRef.current) cardEditorRef.current.innerHTML = auto.body
    if (onCollapse) onCollapse()
    else setExpandedLocal(false)
  }

  const handleExpand = () => {
    if (onExpand) onExpand()
    else setExpandedLocal(true)
  }

  return (
    <Card
      className={cn(
        'border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col',
        !expanded && 'h-full',
        auto.enabled ? `border-l-4 ${auto.accent}` : 'border-gray-200 dark:border-gray-800',
      )}
    >
      <CardContent className="p-0 flex flex-col flex-1">
        <div className="flex items-start gap-4 p-5">
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', auto.color)}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{auto.title}</p>
              {auto.enabled && (
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded-full">
                  Activa
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{auto.description}</p>
            {auto.extra?.type === 'days' && auto.enabled && !expanded && (
              <p className="text-xs text-gray-400 mt-0.5">
                Días sin visita: <strong>{auto.extra.value}</strong>
              </p>
            )}
            {auto.extra?.type === 'birthday_days' && auto.enabled && !expanded && (
              <p className="text-xs text-gray-400 mt-0.5">
                {auto.extra.value === 0
                  ? 'Se envía el mismo día'
                  : `Se envía ${auto.extra.value} día${auto.extra.value !== 1 ? 's' : ''} antes`}
              </p>
            )}
          </div>
          <Switch
            checked={auto.enabled}
            onCheckedChange={(val) => onChange({ ...auto, enabled: val })}
            className="flex-shrink-0 mt-0.5"
          />
        </div>

        {/* Collapsed message preview */}
        {!expanded && (
          <div className="mx-5 mb-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
            {auto.heroImage && <img src={auto.heroImage} alt="" className="w-full h-16 object-cover" />}
            <div className="px-4 py-3">
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5 truncate">{auto.header}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                {auto.body.replace(/<[^>]*>/g, '')}
              </p>
            </div>
          </div>
        )}

        {/* Toggle button — only in uncontrolled (non-split) mode */}
        {!expandedProp && (
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
        )}

        {/* Expanded form */}
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
                {auto.extra?.type === 'days' && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">Días de inactividad</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        max={365}
                        value={draft.days}
                        onChange={(e) => setDraft((d) => ({ ...d, days: Number(e.target.value) }))}
                        className="w-24 text-sm"
                      />
                      <span className="text-xs text-gray-400">días sin visita</span>
                    </div>
                  </div>
                )}
                {auto.extra?.type === 'birthday_days' && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">¿Cuándo enviar?</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        max={30}
                        value={draft.days}
                        onChange={(e) => setDraft((d) => ({ ...d, days: Number(e.target.value) }))}
                        className="w-24 text-sm"
                      />
                      <span className="text-xs text-gray-400">
                        {draft.days === 0 ? 'el mismo día del cumpleaños' : 'días antes del cumpleaños'}
                      </span>
                    </div>
                  </div>
                )}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">{headerLabel}</Label>
                    <span className="text-xs text-muted-foreground">
                      {draft.header.length}/{headerMax}
                    </span>
                  </div>
                  <Input
                    value={draft.header}
                    onChange={(e) => setDraft((d) => ({ ...d, header: e.target.value.slice(0, headerMax) }))}
                    className="text-sm"
                    maxLength={headerMax}
                  />
                </div>
                {richBody && (
                  <div className="space-y-1.5">
                    <Label className="text-xs">Imagen destacada</Label>
                    {draft.heroImage ? (
                      <div className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <img src={draft.heroImage} alt="" className="w-full h-28 object-cover" />
                        <div className="absolute top-1.5 right-1.5 flex gap-1">
                          <button
                            onClick={() => cardImgRef.current?.click()}
                            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md px-2 py-0.5 text-xs font-medium shadow hover:bg-gray-50 transition-colors"
                          >
                            Cambiar
                          </button>
                          <button
                            onClick={() => setDraft((d) => ({ ...d, heroImage: null }))}
                            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md p-0.5 shadow hover:bg-red-50 hover:text-red-500 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-gray-300 rounded-lg p-4 text-center cursor-pointer transition-colors"
                        onDrop={(e) => {
                          e.preventDefault()
                          handleCardImage(e.dataTransfer.files[0])
                        }}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => cardImgRef.current?.click()}
                      >
                        <ImageIcon className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                        <p className="text-xs text-gray-400">Arrastrá o hacé click para subir</p>
                      </div>
                    )}
                    <input
                      ref={cardImgRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleCardImage(e.target.files[0])}
                    />
                  </div>
                )}
                <div className="space-y-1.5">
                  <Label className="text-xs">{bodyLabel}</Label>
                  {richBody ? (
                    <RichEditor
                      editorRef={cardEditorRef}
                      onContentChange={(html) => setDraft((d) => ({ ...d, body: html }))}
                    />
                  ) : (
                    <Textarea
                      value={draft.body}
                      onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value.slice(0, bodyMax) }))}
                      rows={3}
                      className="text-sm resize-none"
                      maxLength={bodyMax}
                    />
                  )}
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" size="sm" onClick={handleCancel}>
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    Guardar
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── Push tab ─────────────────────────────────────────────────────────────────

function PushTab() {
  const [tab, setTab] = useState('manual')
  const [audience, setAudience] = useState('todos')
  const [sucursal, setSucursal] = useState('all')
  const [header, setHeader] = useState('')
  const [body, setBody] = useState('')
  const [history, setHistory] = useState([])
  const [automations, setAutomations] = useState(PUSH_AUTOMATIONS_DEFAULT)

  const canSend = header.trim().length > 0 && body.trim().length > 0
  const activeCount = automations.filter((a) => a.enabled).length

  const handleSend = () => {
    setHistory([
      {
        id: Date.now(),
        header,
        body,
        program: audience === 'todos' ? 'Todos los programas' : 'Por sucursal',
        sent_at: new Date().toISOString(),
        recipients: 148,
      },
      ...history,
    ])
    toast.success('Notificación enviada a 148 miembros')
    setHeader('')
    setBody('')
  }

  const handleAutoChange = (updated) => setAutomations((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))

  return (
    <>
      <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1 mb-8">
        <button
          onClick={() => setTab('manual')}
          className={cn(
            'px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            tab === 'manual'
              ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
          )}
        >
          Manual
        </button>
        <button
          onClick={() => setTab('auto')}
          className={cn(
            'px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2',
            tab === 'auto'
              ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
          )}
        >
          <Zap className="w-3.5 h-3.5" />
          Automáticas
          <span
            className={cn(
              'text-xs font-semibold px-1.5 py-0.5 rounded-full',
              tab === 'auto'
                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
            )}
          >
            {activeCount}
          </span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'manual' && (
          <motion.div
            key="push-manual"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Nueva campaña</h2>
                <Card>
                  <CardContent className="pt-6 space-y-6">
                    <div className="space-y-3">
                      <Label>Enviar a</Label>
                      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
                        {[
                          { id: 'todos', label: 'Todos' },
                          { id: 'sucursal', label: 'Por sucursal' },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setAudience(opt.id)}
                            className={cn(
                              'flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                              audience === opt.id
                                ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      {audience === 'sucursal' && (
                        <Select value={sucursal} onValueChange={setSucursal}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas las sucursales</SelectItem>
                            <SelectItem value="s1">Moon Café · Centro</SelectItem>
                            <SelectItem value="s2">Moon Café · Palermo</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Título</Label>
                        <span className="text-xs text-muted-foreground">
                          {header.length}/{PUSH_HEADER_MAX}
                        </span>
                      </div>
                      <Input
                        value={header}
                        onChange={(e) => setHeader(e.target.value.slice(0, PUSH_HEADER_MAX))}
                        placeholder="Ej: ¡Doble sellos este fin de semana!"
                        maxLength={PUSH_HEADER_MAX}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Mensaje</Label>
                        <span className="text-xs text-muted-foreground">
                          {body.length}/{PUSH_BODY_MAX}
                        </span>
                      </div>
                      <Textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value.slice(0, PUSH_BODY_MAX))}
                        placeholder="Ej: Visitá Moon Café el sábado o domingo y sumá el doble de sellos en cada pedido."
                        maxLength={PUSH_BODY_MAX}
                        rows={4}
                      />
                    </div>
                    <div className="space-y-1.5 border-t border-gray-100 dark:border-gray-800 pt-4">
                      <p className="text-xs text-muted-foreground">
                        La notificación se enviará a todos los miembros con tarjeta en Google Wallet y Apple Wallet.
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">Podés enviar notificaciones cada 24 horas.</p>
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">3/3 restantes</p>
                      </div>
                    </div>
                    <Button onClick={handleSend} disabled={!canSend} className="w-full">
                      <Send className="w-4 h-4 mr-2" />
                      Enviar notificación
                    </Button>
                  </CardContent>
                </Card>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Historial de envíos</h2>
                {history.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
                    <Bell className="w-10 h-10 mb-3 opacity-30" />
                    <p className="text-sm">Todavía no enviaste ninguna notificación.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((n, i) => (
                      <motion.div
                        key={n.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <Card className="border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 leading-snug">
                                {n.header}
                              </p>
                              <span className="flex items-center gap-1 text-emerald-600 flex-shrink-0 mt-0.5">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span className="text-xs font-medium">Enviada</span>
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{n.body}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(n.sent_at)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {n.recipients} miembros
                              </span>
                              <span className="ml-auto bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
                                {n.program}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
        {tab === 'auto' && (
          <motion.div
            key="push-auto"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Notificaciones automáticas</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Se envían sin intervención manual según el comportamiento del miembro.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-xl">
                <Zap className="w-3.5 h-3.5" />
                <span className="text-sm font-semibold">{activeCount} activas</span>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {automations.map((auto, i) => (
                <motion.div
                  key={auto.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="h-full"
                >
                  <AutomationCard
                    auto={auto}
                    onChange={handleAutoChange}
                    headerLabel="Título"
                    bodyLabel="Mensaje"
                    headerMax={PUSH_HEADER_MAX}
                    bodyMax={PUSH_BODY_MAX}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Email tab ────────────────────────────────────────────────────────────────

function RichEditor({ editorRef, onContentChange }) {
  const exec = useCallback(
    (cmd, value = null) => {
      editorRef.current?.focus()
      document.execCommand(cmd, false, value)
      onContentChange(editorRef.current?.innerHTML || '')
    },
    [editorRef, onContentChange],
  )

  const handleLink = useCallback(() => {
    const url = window.prompt('URL del enlace:')
    if (url) exec('createLink', url)
  }, [exec])

  const tools = [
    { icon: Bold, cmd: () => exec('bold'), title: 'Negrita' },
    { icon: Italic, cmd: () => exec('italic'), title: 'Cursiva' },
    { icon: Underline, cmd: () => exec('underline'), title: 'Subrayado' },
    null,
    { icon: List, cmd: () => exec('insertUnorderedList'), title: 'Lista' },
    { icon: ListOrdered, cmd: () => exec('insertOrderedList'), title: 'Lista numerada' },
    null,
    { icon: Link2, cmd: handleLink, title: 'Insertar enlace' },
  ]

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        {tools.map((tool, i) =>
          tool === null ? (
            <div key={i} className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />
          ) : (
            <button
              key={tool.title}
              onMouseDown={(e) => {
                e.preventDefault()
                tool.cmd()
              }}
              title={tool.title}
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <tool.icon className="w-3.5 h-3.5" />
            </button>
          ),
        )}
      </div>
      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onContentChange(editorRef.current?.innerHTML || '')}
        className="min-h-[180px] p-4 focus:outline-none text-sm text-gray-700 dark:text-gray-300 prose prose-sm dark:prose-invert max-w-none"
        data-placeholder="Escribí el contenido del email..."
      />
      <style>{`[contenteditable]:empty:before{content:attr(data-placeholder);color:#9ca3af;pointer-events:none}`}</style>
    </div>
  )
}

function EmailPreview({ subject, body, heroImage }) {
  const isEmpty = !subject && !body && !heroImage
  const timeStr = new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
  const dateStr = new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })

  return (
    <div>
      <p className="text-xs font-medium text-gray-400 dark:text-gray-500 text-center mb-3 uppercase tracking-wider">
        Vista previa
      </p>

      {/* Browser window frame */}
      <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700 text-left">
        {/* Email thread area */}
        <div className="bg-white dark:bg-[#1f1f1f]">
          {/* Subject line */}
          <div className="px-4 pt-4 pb-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 leading-snug">
              {subject || <span className="text-gray-300 dark:text-gray-600 italic text-base">Sin asunto</span>}
            </h3>
          </div>

          {/* Sender card */}
          <div className="px-4 pb-3 flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold tracking-tight">MC</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Moon Café</span>
                  <span className="text-xs text-gray-400 ml-1.5">&lt;noreply@repeat.la&gt;</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-400">
                    {dateStr}, {timeStr}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    viewBox="0 0 24 24"
                  >
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Para: <span className="text-gray-500 dark:text-gray-400">yo</span>
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 dark:bg-gray-800 mx-4 mb-4" />

          {/* Email body — scrollable */}
          <div className="max-h-[420px] overflow-y-auto">
            <div className="bg-[#f4f4f4] px-4 pb-6">
              {/* HTML email template */}
              <div className="bg-white rounded-lg overflow-hidden shadow-sm max-w-md mx-auto">
                {/* Brand header */}
                <div className="bg-black px-6 py-5 flex items-center gap-3">
                  <img
                    src="/moon-cafe-logo.png"
                    alt="Moon Café"
                    className="w-9 h-9 rounded-lg object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                  <div>
                    <p className="text-white font-bold text-sm">Moon Café</p>
                    <p className="text-gray-400 text-[11px]">noreply@repeat.la</p>
                  </div>
                </div>

                {/* Hero image */}
                {heroImage && <img src={heroImage} alt="" className="w-full object-cover max-h-44" />}

                {/* Content */}
                <div className="px-7 py-6">
                  {isEmpty ? (
                    <div className="space-y-2.5 py-2">
                      <div className="h-4 bg-gray-100 rounded-full w-3/5" />
                      <div className="h-3 bg-gray-100 rounded-full w-full" />
                      <div className="h-3 bg-gray-100 rounded-full w-[90%]" />
                      <div className="h-3 bg-gray-100 rounded-full w-4/5" />
                      <div className="h-3 bg-gray-100 rounded-full w-2/3 mt-1" />
                    </div>
                  ) : (
                    <div
                      className="text-[13px] text-gray-700 leading-relaxed prose prose-sm max-w-none [&_ul]:pl-5 [&_ol]:pl-5 [&_li]:my-0.5 [&_a]:text-amber-600 [&_a]:underline [&_strong]:font-semibold [&_em]:italic"
                      dangerouslySetInnerHTML={{ __html: body || '' }}
                    />
                  )}

                  {/* CTA */}
                  <div className="mt-7 mb-1">
                    <div className="bg-black text-white text-[13px] font-semibold text-center py-3.5 px-6 rounded-lg cursor-pointer hover:opacity-90 transition-opacity">
                      Ver mi tarjeta →
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100 mx-6" />

                {/* Footer */}
                <div className="px-7 py-5 text-center bg-gray-50">
                  <p className="text-[11px] text-gray-500 leading-relaxed">
                    Moon Café · Av. Corrientes 1234, Buenos Aires
                  </p>
                  <p className="text-[10px] text-gray-400 mt-2 leading-relaxed">
                    Recibiste este mensaje porque sos miembro del programa de fidelidad.
                  </p>
                  <div className="flex items-center justify-center gap-3 mt-2">
                    <span className="text-[10px] text-gray-400 underline cursor-pointer">Cancelar suscripción</span>
                    <span className="text-gray-200">·</span>
                    <span className="text-[10px] text-gray-400 underline cursor-pointer">Política de privacidad</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) return { contacts: [], error: 'El archivo no tiene datos suficientes.' }
  const headers = lines[0].split(',').map((h) =>
    h
      .trim()
      .replace(/^["']|["']$/g, '')
      .toLowerCase(),
  )
  const emailIdx = headers.findIndex((h) => ['email', 'correo', 'mail', 'e-mail', 'email address'].includes(h))
  const nameIdx = headers.findIndex((h) => ['name', 'nombre', 'full_name', 'nombre completo', 'fullname'].includes(h))
  if (emailIdx === -1) return { contacts: [], error: 'No se encontró columna de email en el archivo.' }
  const contacts = []
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''))
    const email = cols[emailIdx]
    if (email && email.includes('@')) {
      contacts.push({ name: nameIdx >= 0 && cols[nameIdx] ? cols[nameIdx] : email.split('@')[0], email })
    }
  }
  if (contacts.length === 0) return { contacts: [], error: 'No se encontraron emails válidos en el archivo.' }
  return { contacts, error: null }
}

function EmailTab() {
  const [tab, setTab] = useState('manual')
  const [audience, setAudience] = useState('todos')
  const [sucursal, setSucursal] = useState('all')
  const [selectedMembers, setSelectedMembers] = useState(new Set())
  const [memberSearch, setMemberSearch] = useState('')
  const [subject, setSubject] = useState('')
  const [bodyMode, setBodyMode] = useState('visual')
  const [htmlSource, setHtmlSource] = useState('')
  const [liveContent, setLiveContent] = useState('')
  const [heroImage, setHeroImage] = useState(null)
  const [history, setHistory] = useState([
    {
      id: 1,
      subject: '¡Nuevo menú de otoño disponible! 🍂',
      preview:
        'Esta temporada incorporamos nuevas opciones de café de especialidad y pastelería artesanal. Visitanos y descubrí los sabores de la estación.',
      program: 'Todos los miembros',
      sent_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      recipients: 148,
      heroImage: null,
      stats: { openRate: 61, clickRate: 18, unsubscribed: 1 },
    },
    {
      id: 2,
      subject: 'Doble sellos este fin de semana ☕✨',
      preview:
        'Sábado y domingo acumulás el doble de sellos en todas tus compras. ¡Es tu momento de completar la tarjeta más rápido!',
      program: 'Todos los miembros',
      sent_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      recipients: 148,
      heroImage: null,
      stats: { openRate: 74, clickRate: 31, unsubscribed: 0 },
    },
    {
      id: 3,
      subject: 'Abrimos nueva sucursal en Palermo 📍',
      preview:
        'Ahora también estamos en Thames 1540. Pasá a conocernos, presentá tu tarjeta fidelidad y seguí acumulando sellos en cualquiera de nuestros locales.',
      program: 'Sucursal Centro',
      sent_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      recipients: 92,
      heroImage: null,
      stats: { openRate: 58, clickRate: 22, unsubscribed: 2 },
    },
    {
      id: 4,
      subject: 'Tu opinión nos importa — contanos cómo fue tu visita',
      preview:
        'Queremos seguir mejorando. Respondé estas 3 preguntas rápidas sobre tu última experiencia en Moon Café y llevate un sello extra.',
      program: 'Todos los miembros',
      sent_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      recipients: 131,
      heroImage: null,
      stats: { openRate: 49, clickRate: 14, unsubscribed: 3 },
    },
  ])
  const [automations, setAutomations] = useState(EMAIL_AUTOMATIONS_DEFAULT)
  const [expandedAutoId, setExpandedAutoId] = useState(null)
  const [liveAutoPreview, setLiveAutoPreview] = useState({ subject: '', body: '', heroImage: null })
  const [previewItem, setPreviewItem] = useState(null)

  const [csvContacts, setCsvContacts] = useState([])
  const [csvError, setCsvError] = useState(null)

  const editorRef = useRef(null)
  const fileInputRef = useRef(null)
  const csvFileRef = useRef(null)

  const handleCsvFile = (file) => {
    if (!file) return
    setCsvError(null)
    const reader = new FileReader()
    reader.onload = (e) => {
      const { contacts, error } = parseCsv(e.target.result)
      if (error) {
        setCsvError(error)
        return
      }
      setCsvContacts(contacts)
    }
    reader.readAsText(file)
  }

  const activeCount = automations.filter((a) => a.enabled).length

  // Sync htmlSource → visual editor when switching back to visual mode
  useEffect(() => {
    if (bodyMode === 'visual' && editorRef.current) {
      editorRef.current.innerHTML = htmlSource
      setLiveContent(htmlSource)
    }
  }, [bodyMode]) // eslint-disable-line react-hooks/exhaustive-deps

  const switchToHtml = () => {
    const html = editorRef.current?.innerHTML || ''
    setHtmlSource(html)
    setLiveContent(html)
    setBodyMode('html')
  }

  const switchToVisual = () => setBodyMode('visual')

  const handleContentChange = useCallback((html) => setLiveContent(html), [])

  const handleImageFile = (file) => {
    if (!file?.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => setHeroImage(e.target.result)
    reader.readAsDataURL(file)
  }

  const toggleMember = (id) => {
    setSelectedMembers((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const filteredMembers = DEMO_MEMBERS.filter(
    (m) =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(memberSearch.toLowerCase()),
  )

  const recipientCount =
    audience === 'todos'
      ? 148
      : audience === 'sucursal'
        ? sucursal === 's1'
          ? 92
          : sucursal === 's2'
            ? 56
            : 148
        : audience === 'lista'
          ? selectedMembers.size
          : csvContacts.length

  const canSend = subject.trim().length > 0 && liveContent.replace(/<[^>]*>/g, '').trim().length > 0

  const handleSend = () => {
    const content = bodyMode === 'visual' ? editorRef.current?.innerHTML || '' : htmlSource
    const preview = content
      .replace(/<[^>]*>/g, '')
      .trim()
      .slice(0, 120)
    setHistory([
      {
        id: Date.now(),
        subject,
        preview,
        heroImage,
        program:
          audience === 'todos'
            ? 'Todos los programas'
            : audience === 'sucursal'
              ? 'Por sucursal'
              : audience === 'lista'
                ? `${selectedMembers.size} contactos`
                : `CSV · ${csvContacts.length} contactos`,
        sent_at: new Date().toISOString(),
        recipients: recipientCount,
      },
      ...history,
    ])
    toast.success(`Email enviado a ${recipientCount} miembro${recipientCount !== 1 ? 's' : ''}`)
    setSubject('')
    setHtmlSource('')
    setLiveContent('')
    setHeroImage(null)
    setSelectedMembers(new Set())
    setCsvContacts([])
    setCsvError(null)
    if (editorRef.current) editorRef.current.innerHTML = ''
  }

  const handleAutoChange = (updated) => setAutomations((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))

  return (
    <>
      <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1 mb-8">
        <button
          onClick={() => setTab('manual')}
          className={cn(
            'px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200',
            tab === 'manual'
              ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
          )}
        >
          Manual
        </button>
        <button
          onClick={() => setTab('auto')}
          className={cn(
            'px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2',
            tab === 'auto'
              ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
          )}
        >
          <Zap className="w-3.5 h-3.5" />
          Automáticos
          <span
            className={cn(
              'text-xs font-semibold px-1.5 py-0.5 rounded-full',
              tab === 'auto'
                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
            )}
          >
            {activeCount}
          </span>
        </button>
        <button
          onClick={() => setTab('historial')}
          className={cn(
            'px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2',
            tab === 'historial'
              ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
          )}
        >
          Historial
          {history.length > 0 && (
            <span
              className={cn(
                'text-xs font-semibold px-1.5 py-0.5 rounded-full',
                tab === 'historial'
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
              )}
            >
              {history.length}
            </span>
          )}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'manual' && (
          <motion.div
            key="email-manual"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
              {/* ── Compose form ── */}
              <div className="xl:col-span-3 space-y-5">
                <h2 className="text-lg font-semibold text-foreground">Nueva campaña</h2>

                {/* De */}
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-xs text-gray-400 w-6 flex-shrink-0">De</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Moon Café &lt;noreply@repeat.la&gt;</span>
                </div>

                {/* Para */}
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-gray-400 w-6 flex-shrink-0">Para</span>
                    <div className="flex bg-white dark:bg-gray-900 rounded-lg p-0.5 gap-0.5 border border-gray-200 dark:border-gray-700">
                      {[
                        { id: 'todos', label: 'Todos' },
                        { id: 'sucursal', label: 'Sucursal' },
                        { id: 'lista', label: 'Lista' },
                        { id: 'csv', label: 'CSV' },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setAudience(opt.id)}
                          className={cn(
                            'px-3 py-1 text-xs font-medium rounded-md transition-all',
                            audience === opt.id
                              ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 ml-auto">
                      {audience === 'csv'
                        ? csvContacts.length > 0
                          ? `${csvContacts.length} contactos`
                          : '—'
                        : `${recipientCount} destinatarios`}
                    </span>
                  </div>

                  {audience === 'sucursal' && (
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                      <Select value={sucursal} onValueChange={setSucursal}>
                        <SelectTrigger className="h-9 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas las sucursales (148)</SelectItem>
                          <SelectItem value="s1">Moon Café · Centro (92)</SelectItem>
                          <SelectItem value="s2">Moon Café · Palermo (56)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {audience === 'lista' && (
                    <div>
                      <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                          <input
                            value={memberSearch}
                            onChange={(e) => setMemberSearch(e.target.value)}
                            placeholder="Buscar miembro..."
                            className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300"
                          />
                        </div>
                      </div>
                      <div className="max-h-44 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800 bg-white dark:bg-gray-900">
                        {filteredMembers.map((m) => (
                          <label
                            key={m.id}
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedMembers.has(m.id)}
                              onChange={() => toggleMember(m.id)}
                              className="rounded border-gray-300 text-amber-500 focus:ring-amber-400"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{m.name}</p>
                              <p className="text-xs text-gray-400 truncate">{m.email}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                        <span className="text-xs text-gray-500">{selectedMembers.size} seleccionados</span>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setSelectedMembers(new Set(DEMO_MEMBERS.map((m) => m.id)))}
                            className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                          >
                            Todos
                          </button>
                          <button
                            onClick={() => setSelectedMembers(new Set())}
                            className="text-xs text-gray-400 hover:text-gray-600"
                          >
                            Ninguno
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {audience === 'csv' && (
                    <div className="p-4 bg-white dark:bg-gray-900">
                      {csvContacts.length === 0 ? (
                        <div
                          className="border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 rounded-xl p-6 text-center cursor-pointer transition-colors"
                          onDrop={(e) => {
                            e.preventDefault()
                            handleCsvFile(e.dataTransfer.files[0])
                          }}
                          onDragOver={(e) => e.preventDefault()}
                          onClick={() => csvFileRef.current?.click()}
                        >
                          <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Arrastrá o hacé click para subir un CSV
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Debe tener columnas <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">email</code>{' '}
                            y opcionalmente <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">nombre</code>
                          </p>
                          <input
                            ref={csvFileRef}
                            type="file"
                            accept=".csv,text/csv"
                            className="hidden"
                            onChange={(e) => handleCsvFile(e.target.files[0])}
                          />
                        </div>
                      ) : (
                        <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                          <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              <span className="font-bold">{csvContacts.length}</span> contactos importados
                            </span>
                            <button
                              onClick={() => {
                                setCsvContacts([])
                                setCsvError(null)
                              }}
                              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex items-center gap-1"
                            >
                              <X className="w-3 h-3" /> Cambiar archivo
                            </button>
                          </div>
                          <div className="max-h-44 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800">
                            {csvContacts.slice(0, 100).map((c, i) => (
                              <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                                <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-semibold text-gray-500 dark:text-gray-400 flex-shrink-0">
                                  {c.name[0]?.toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                    {c.name}
                                  </p>
                                  <p className="text-xs text-gray-400 truncate">{c.email}</p>
                                </div>
                              </div>
                            ))}
                            {csvContacts.length > 100 && (
                              <div className="px-4 py-2.5 text-xs text-gray-400 text-center bg-gray-50 dark:bg-gray-800">
                                +{csvContacts.length - 100} contactos más
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {csvError && (
                        <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                          <X className="w-3 h-3" />
                          {csvError}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Asunto */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Asunto</Label>
                    <span className="text-xs text-muted-foreground">
                      {subject.length}/{EMAIL_SUBJECT_MAX}
                    </span>
                  </div>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value.slice(0, EMAIL_SUBJECT_MAX))}
                    placeholder="Ej: ¡Doble sellos este fin de semana!"
                    maxLength={EMAIL_SUBJECT_MAX}
                    className="text-sm"
                  />
                </div>

                {/* Imagen destacada */}
                <div className="space-y-1.5">
                  <Label className="text-sm">Imagen destacada</Label>
                  <div
                    className={cn(
                      'border-2 border-dashed rounded-xl transition-colors cursor-pointer',
                      heroImage
                        ? 'border-gray-200 dark:border-gray-700 p-2'
                        : 'border-gray-200 dark:border-gray-700 hover:border-amber-300 dark:hover:border-amber-700 p-6',
                    )}
                    onDrop={(e) => {
                      e.preventDefault()
                      handleImageFile(e.dataTransfer.files[0])
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => !heroImage && fileInputRef.current?.click()}
                  >
                    {heroImage ? (
                      <div className="relative">
                        <img src={heroImage} alt="Hero" className="w-full max-h-48 object-cover rounded-lg" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setHeroImage(null)
                          }}
                          className="absolute top-2 right-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full p-1 shadow hover:bg-red-50 hover:text-red-500 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            fileInputRef.current?.click()
                          }}
                          className="absolute bottom-2 right-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-2.5 py-1 text-xs font-medium shadow hover:bg-gray-50 transition-colors"
                        >
                          Cambiar
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <ImageIcon className="w-7 h-7" />
                        <p className="text-sm font-medium">Arrastrá o hacé click para subir</p>
                        <p className="text-xs">PNG, JPG, GIF · máx. 5MB</p>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFile(e.target.files[0])}
                    />
                  </div>
                </div>

                {/* Cuerpo del email */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Cuerpo</Label>
                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
                      <button
                        onClick={switchToVisual}
                        className={cn(
                          'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all',
                          bodyMode === 'visual'
                            ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700',
                        )}
                      >
                        <Eye className="w-3 h-3" />
                        Diseño
                      </button>
                      <button
                        onClick={switchToHtml}
                        className={cn(
                          'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all',
                          bodyMode === 'html'
                            ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700',
                        )}
                      >
                        <Code2 className="w-3 h-3" />
                        HTML
                      </button>
                    </div>
                  </div>

                  {bodyMode === 'visual' ? (
                    <RichEditor editorRef={editorRef} onContentChange={handleContentChange} />
                  ) : (
                    <Textarea
                      value={htmlSource}
                      onChange={(e) => {
                        setHtmlSource(e.target.value)
                        setLiveContent(e.target.value)
                      }}
                      rows={10}
                      className="font-mono text-xs leading-relaxed resize-y"
                      placeholder="<p>Escribí el HTML del email...</p>"
                      spellCheck={false}
                    />
                  )}
                </div>

                {/* Footer + send */}
                <div className="pt-2 space-y-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>El email se enviará a los miembros con correo registrado.</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {recipientCount} destinatarios
                    </span>
                  </div>
                  <Button
                    onClick={handleSend}
                    disabled={
                      !canSend ||
                      (audience === 'lista' && selectedMembers.size === 0) ||
                      (audience === 'csv' && csvContacts.length === 0)
                    }
                    className="w-full"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar email
                  </Button>
                </div>
              </div>

              {/* ── Preview ── */}
              <div className="xl:col-span-2">
                <EmailPreview subject={subject} body={liveContent} heroImage={heroImage} />
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'historial' && (
          <motion.div
            key="email-historial"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <h2 className="text-lg font-semibold text-foreground mb-6">Historial de envíos</h2>
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
                <Mail className="w-10 h-10 mb-3 opacity-25" />
                <p className="text-sm font-medium">Todavía no enviaste ningún email.</p>
                <p className="text-xs mt-1 text-gray-300 dark:text-gray-600">Los emails que envíes aparecerán acá.</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {history.map((n, i) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Card
                        onClick={() => setPreviewItem(n)}
                        className="border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer hover:border-gray-300 dark:hover:border-gray-600"
                      >
                        {n.heroImage && <img src={n.heroImage} alt="" className="w-full h-24 object-cover" />}
                        <CardContent className="p-4">
                          {/* Header row */}
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 leading-snug">
                              {n.subject}
                            </p>
                            <span className="flex items-center gap-1 text-emerald-600 flex-shrink-0 mt-0.5">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span className="text-xs font-medium">Enviado</span>
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDate(n.sent_at)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {n.recipients}
                            </span>
                            <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-gray-500 dark:text-gray-400">
                              {n.program}
                            </span>
                          </div>

                          {/* Stats */}
                          {n.stats && (
                            <div className="flex items-center gap-4 pt-3 border-t border-gray-100 dark:border-gray-800">
                              <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                <span className="text-xs text-gray-400">Apertura</span>
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                  {n.stats.openRate}%
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                                <span className="text-xs text-gray-400">Clicks</span>
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                  {n.stats.clickRate}%
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-300 flex-shrink-0" />
                                <span className="text-xs text-gray-400">Desuscripciones</span>
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                  {n.stats.unsubscribed}
                                </span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <Dialog open={!!previewItem} onOpenChange={(open) => !open && setPreviewItem(null)}>
                  <DialogContent className="max-w-lg p-0 overflow-hidden bg-transparent border-none shadow-none [&>button]:hidden">
                    {previewItem && (
                      <EmailPreview
                        subject={previewItem.subject}
                        body={previewItem.preview}
                        heroImage={previewItem.heroImage}
                      />
                    )}
                  </DialogContent>
                </Dialog>
              </>
            )}
          </motion.div>
        )}

        {tab === 'auto' && (
          <motion.div
            key="email-auto"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            <AnimatePresence mode="wait">
              {expandedAutoId ? (
                <motion.div
                  key="auto-split"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <button
                      onClick={() => setExpandedAutoId(null)}
                      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> Volver
                    </button>
                    <span className="text-gray-300 dark:text-gray-700">·</span>
                    <h2 className="text-lg font-semibold text-foreground">
                      {automations.find((a) => a.id === expandedAutoId)?.title}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
                    <div className="xl:col-span-3">
                      {automations
                        .filter((a) => a.id === expandedAutoId)
                        .map((auto) => (
                          <AutomationCard
                            key={auto.id}
                            auto={auto}
                            onChange={handleAutoChange}
                            headerLabel="Asunto"
                            bodyLabel="Cuerpo"
                            headerMax={EMAIL_SUBJECT_MAX}
                            bodyMax={800}
                            richBody
                            expanded
                            onExpand={() => setExpandedAutoId(auto.id)}
                            onCollapse={() => setExpandedAutoId(null)}
                            onDraftChange={setLiveAutoPreview}
                          />
                        ))}
                    </div>
                    <div className="xl:col-span-2 sticky top-6">
                      <EmailPreview
                        subject={liveAutoPreview.subject}
                        body={liveAutoPreview.body}
                        heroImage={liveAutoPreview.heroImage}
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="auto-grid"
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Emails automáticos</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        Se envían sin intervención manual según el comportamiento del miembro.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-xl">
                      <Zap className="w-3.5 h-3.5" />
                      <span className="text-sm font-semibold">{activeCount} activos</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {automations.map((auto, i) => (
                      <motion.div
                        key={auto.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="h-full"
                      >
                        <AutomationCard
                          auto={auto}
                          onChange={handleAutoChange}
                          headerLabel="Asunto"
                          bodyLabel="Cuerpo"
                          headerMax={EMAIL_SUBJECT_MAX}
                          bodyMax={800}
                          richBody
                          onExpand={() => {
                            setLiveAutoPreview({ subject: auto.header, body: auto.body, heroImage: auto.heroImage })
                            setExpandedAutoId(auto.id)
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const CHANNELS = [
  { id: 'push', label: 'Notificaciones', icon: Bell },
  { id: 'email', label: 'Emails', icon: Mail },
]

export default function ComunicacionRoadmap() {
  const [channel, setChannel] = useState('push')

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Megaphone className="w-8 h-8 text-gray-700 dark:text-gray-300" />
            <h1 className="text-4xl font-bold leading-tight text-foreground">Comunicación</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Notificaciones push y emails a los miembros de tus programas.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8"
        >
          <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
            {CHANNELS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setChannel(id)}
                className={cn(
                  'flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  channel === id
                    ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {channel === 'push' && (
            <motion.div
              key="push"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <PushTab />
            </motion.div>
          )}
          {channel === 'email' && (
            <motion.div
              key="email"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <EmailTab />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
