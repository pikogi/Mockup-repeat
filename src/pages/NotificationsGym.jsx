import { useState } from 'react'
import { Bell, Send, Users, Clock, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const HEADER_MAX = 40
const BODY_MAX = 200
const TOTAL_MEMBERS = 700

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function NotificationsGym() {
  const [audience, setAudience] = useState('todos')
  const [level, setLevel] = useState('all')
  const [header, setHeader] = useState('')
  const [body, setBody] = useState('')
  const [history, setHistory] = useState([])

  const canSend = header.trim().length > 0 && body.trim().length > 0

  const audienceCount =
    audience === 'todos'
      ? TOTAL_MEMBERS
      : audience === 'nivel'
        ? ({ all: 700, beast: 18, elite: 67, pro: 168, amateur: 245, rookie: 202 }[level] ?? 700)
        : TOTAL_MEMBERS

  const handleSend = () => {
    setHistory([
      {
        id: Date.now(),
        header,
        body,
        segment:
          audience === 'todos'
            ? 'Todos los miembros'
            : audience === 'nivel'
              ? `Nivel: ${level === 'all' ? 'Todos' : level.charAt(0).toUpperCase() + level.slice(1)}`
              : 'Todos los miembros',
        sent_at: new Date().toISOString(),
        recipients: audienceCount,
      },
      ...history,
    ])
    toast.success(`Notificación enviada a ${audienceCount} miembros`)
    setHeader('')
    setBody('')
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-8 h-8 text-gray-700 dark:text-gray-300" />
            <h1 className="text-4xl font-bold leading-tight text-foreground">Notificaciones</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Enviá notificaciones push a los alumnos de Iron Club.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
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
                        { id: 'nivel', label: 'Por nivel' },
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
                    {audience === 'nivel' && (
                      <Select value={level} onValueChange={setLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar nivel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos los niveles</SelectItem>
                          <SelectItem value="rookie">Rookie (202)</SelectItem>
                          <SelectItem value="amateur">Amateur (245)</SelectItem>
                          <SelectItem value="pro">Pro (168)</SelectItem>
                          <SelectItem value="elite">Elite (67)</SelectItem>
                          <SelectItem value="beast">Beast (18)</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Título</Label>
                      <span className="text-xs text-muted-foreground">
                        {header.length}/{HEADER_MAX}
                      </span>
                    </div>
                    <Input
                      value={header}
                      onChange={(e) => setHeader(e.target.value.slice(0, HEADER_MAX))}
                      placeholder="Ej: ¡Semana de doble XP en Iron Club!"
                      maxLength={HEADER_MAX}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Mensaje</Label>
                      <span className="text-xs text-muted-foreground">
                        {body.length}/{BODY_MAX}
                      </span>
                    </div>
                    <Textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value.slice(0, BODY_MAX))}
                      placeholder="Ej: Esta semana cada visita vale el doble. ¡Vení y subí de nivel más rápido!"
                      maxLength={BODY_MAX}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-1.5 border-t border-gray-100 dark:border-gray-800 pt-4">
                    <p className="text-xs text-muted-foreground">
                      La notificación se enviará a los usuarios con tarjetas en Google Wallet y Apple Wallet.
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
                              {n.segment}
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
      </div>
    </div>
  )
}
