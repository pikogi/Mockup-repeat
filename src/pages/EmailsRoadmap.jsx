import { useState } from 'react'
import { Mail, Send, Users, Clock, CheckCircle2, Sparkles, Cake, Star, ChevronDown, ChevronUp, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const SUBJECT_MAX = 80
const BODY_MAX = 500

const AUTOMATIONS_DEFAULT = [
  {
    id: 'welcome',
    icon: Sparkles,
    color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600',
    accent: 'border-emerald-400',
    title: 'Bienvenida',
    description: 'Se envía cuando un nuevo miembro se une al programa.',
    enabled: true,
    header: '¡Bienvenido/a a Moon Café! ☕',
    body: 'Hola, bienvenido/a al programa de fidelidad de Moon Café. A partir de ahora acumulás sellos en cada visita y cuando completes tu tarjeta recibís un café gratis. Tu tarjeta ya está disponible en Google y Apple Wallet.',
    extra: null,
  },
  {
    id: 'birthday',
    icon: Cake,
    color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600',
    accent: 'border-rose-400',
    title: 'Cumpleaños',
    description: 'Se envía antes o el día del cumpleaños del miembro.',
    enabled: true,
    header: '¡Feliz cumpleaños! Te regalamos un café 🎂',
    body: '¡Hoy es tu día y queremos celebrarlo! En tu cumpleaños te regalamos un café gratis. Pasá por cualquiera de nuestras sucursales y presentá tu tarjeta. ¡Que lo disfrutes!',
    extra: { type: 'birthday_days', value: 0 },
  },
  {
    id: 'inactivity',
    icon: Clock,
    color: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
    accent: 'border-slate-400',
    title: 'Inactividad',
    description: 'Se envía si el miembro no visitó en los últimos N días.',
    enabled: true,
    header: 'Te extrañamos en Moon Café ☕',
    body: 'Hace tiempo que no pasás por Moon Café. Tus sellos te esperan y estás cada vez más cerca de tu próximo café gratis. Visitanos y seguí acumulando.',
    extra: { type: 'days', value: 30 },
  },
  {
    id: 'benefit',
    icon: Star,
    color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600',
    accent: 'border-amber-400',
    title: 'Premio desbloqueado',
    description: 'Se envía cuando el miembro completa la tarjeta y desbloquea su premio.',
    enabled: true,
    header: '¡Tenés un café gratis esperándote! 🎁',
    body: 'Completaste tu tarjeta Moon Café. Pasá por cualquiera de nuestras sucursales, presentá tu tarjeta en caja y disfrutá tu café gratis. ¡Te lo ganaste!',
    extra: null,
  },
]

function AutomationCard({ auto, onChange }) {
  const [expanded, setExpanded] = useState(false)
  const [draft, setDraft] = useState({ header: auto.header, body: auto.body, days: auto.extra?.value ?? 30 })

  const Icon = auto.icon

  const handleSave = () => {
    onChange({
      ...auto,
      header: draft.header,
      body: draft.body,
      extra: auto.extra ? { ...auto.extra, value: draft.days } : null,
    })
    setExpanded(false)
    toast.success('Email automático guardado')
  }

  const handleCancel = () => {
    setDraft({ header: auto.header, body: auto.body, days: auto.extra?.value ?? 30 })
    setExpanded(false)
  }

  return (
    <Card
      className={cn(
        'border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden h-full flex flex-col',
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

        {!expanded && (
          <div className="mx-5 mb-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5 truncate">{auto.header}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{auto.body}</p>
          </div>
        )}

        <button
          onClick={() => setExpanded((v) => !v)}
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
                        {draft.days === 0 ? 'el mismo día del cumpleaños' : `días antes del cumpleaños`}
                      </span>
                    </div>
                  </div>
                )}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Asunto</Label>
                    <span className="text-xs text-muted-foreground">
                      {draft.header.length}/{SUBJECT_MAX}
                    </span>
                  </div>
                  <Input
                    value={draft.header}
                    onChange={(e) => setDraft((d) => ({ ...d, header: e.target.value.slice(0, SUBJECT_MAX) }))}
                    className="text-sm"
                    maxLength={SUBJECT_MAX}
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Cuerpo</Label>
                    <span className="text-xs text-muted-foreground">
                      {draft.body.length}/{BODY_MAX}
                    </span>
                  </div>
                  <Textarea
                    value={draft.body}
                    onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value.slice(0, BODY_MAX) }))}
                    rows={4}
                    className="text-sm resize-none"
                    maxLength={BODY_MAX}
                  />
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

export default function EmailsRoadmap() {
  const [tab, setTab] = useState('manual')
  const [audience, setAudience] = useState('todos')
  const [sucursal, setSucursal] = useState('all')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [history, setHistory] = useState([])
  const [automations, setAutomations] = useState(AUTOMATIONS_DEFAULT)

  const canSend = subject.trim().length > 0 && body.trim().length > 0

  const handleSend = () => {
    setHistory([
      {
        id: Date.now(),
        subject,
        body,
        program: audience === 'todos' ? 'Todos los programas' : 'Por sucursal',
        sent_at: new Date().toISOString(),
        recipients: 148,
      },
      ...history,
    ])
    toast.success('Email enviado a 148 miembros')
    setSubject('')
    setBody('')
  }

  const handleAutoChange = (updated) => {
    setAutomations((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
  }

  const activeCount = automations.filter((a) => a.enabled).length

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="w-8 h-8 text-gray-700 dark:text-gray-300" />
            <h1 className="text-4xl font-bold leading-tight text-foreground">Emails</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Enviá emails a los miembros de tus programas.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8"
        >
          <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
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
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {tab === 'manual' && (
            <motion.div
              key="manual"
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
                      <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">De</Label>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Moon Café &lt;noreply@repeat.la&gt;
                          </span>
                        </div>
                      </div>
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
                              <SelectValue placeholder="Seleccionar sucursal" />
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
                          <Label>Asunto</Label>
                          <span className="text-xs text-muted-foreground">
                            {subject.length}/{SUBJECT_MAX}
                          </span>
                        </div>
                        <Input
                          value={subject}
                          onChange={(e) => setSubject(e.target.value.slice(0, SUBJECT_MAX))}
                          placeholder="Ej: ¡Doble sellos este fin de semana!"
                          maxLength={SUBJECT_MAX}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Cuerpo</Label>
                          <span className="text-xs text-muted-foreground">
                            {body.length}/{BODY_MAX}
                          </span>
                        </div>
                        <Textarea
                          value={body}
                          onChange={(e) => setBody(e.target.value.slice(0, BODY_MAX))}
                          placeholder="Ej: Visitá Moon Café el sábado o domingo y sumá el doble de sellos en cada pedido."
                          maxLength={BODY_MAX}
                          rows={5}
                        />
                      </div>
                      <div className="space-y-1.5 border-t border-gray-100 dark:border-gray-800 pt-4">
                        <p className="text-xs text-muted-foreground">
                          El email se enviará a todos los miembros con correo electrónico registrado.
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">Podés enviar campañas cada 24 horas.</p>
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">3/3 restantes</p>
                        </div>
                      </div>
                      <Button onClick={handleSend} disabled={!canSend} className="w-full">
                        <Send className="w-4 h-4 mr-2" />
                        Enviar email
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">Historial de envíos</h2>
                  {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
                      <Mail className="w-10 h-10 mb-3 opacity-30" />
                      <p className="text-sm">Todavía no enviaste ningún email.</p>
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
                                  {n.subject}
                                </p>
                                <span className="flex items-center gap-1 text-emerald-600 flex-shrink-0 mt-0.5">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span className="text-xs font-medium">Enviado</span>
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
              key="auto"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
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
                    <AutomationCard auto={auto} onChange={handleAutoChange} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
