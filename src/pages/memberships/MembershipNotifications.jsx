import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, Send, Zap, Clock, Users, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import MembershipAutomationsSection from '@/components/memberships/MembershipAutomationsSection'
import { loadMembershipData, saveMembershipData } from '@/constants/membershipDemoData'
import { cn } from '@/lib/utils'

const HEADER_MAX = 40
const BODY_MAX = 200

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function MembershipNotifications() {
  const [tab, setTab] = useState('manual')
  const [data, setData] = useState(loadMembershipData)
  useEffect(() => {
    saveMembershipData(data)
  }, [data])

  const activeAutomationsCount = data.automations.filter((a) => a.enabled).length
  const activeMembersCount = data.members.filter((m) => m.status === 'active').length

  const handleAutomationChange = (updated) => {
    setData((prev) => ({
      ...prev,
      automations: prev.automations.map((a) => (a.id === updated.id ? updated : a)),
    }))
  }

  const [header, setHeader] = useState('')
  const [body, setBody] = useState('')
  const [history, setHistory] = useState([])
  const canSend = header.trim().length > 0 && body.trim().length > 0

  const handleSend = () => {
    setHistory([
      { id: Date.now(), header, body, sent_at: new Date().toISOString(), recipients: activeMembersCount },
      ...history,
    ])
    toast.success(`Notificación enviada a ${activeMembersCount} miembros activos`)
    setHeader('')
    setBody('')
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-8 h-8 text-gray-700 dark:text-gray-300" />
            <h1 className="text-4xl font-bold leading-tight text-foreground">Notificaciones</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Enviá notificaciones push a los miembros de tus programas.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6"
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
              Automáticas
              <span
                className={cn(
                  'text-xs font-semibold px-1.5 py-0.5 rounded-full',
                  tab === 'auto'
                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
                )}
              >
                {activeAutomationsCount}
              </span>
            </button>
          </div>
        </motion.div>

        {tab === 'auto' ? (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <MembershipAutomationsSection automations={data.automations} onChangeAutomation={handleAutomationChange} />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="lg:order-2">
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
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <div className="lg:order-1">
                <h2 className="text-lg font-semibold text-foreground mb-4">Nueva notificación</h2>
                <Card>
                  <CardContent className="pt-6 space-y-6">
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
                        placeholder="Ej. ¡Nuevo beneficio disponible!"
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
                        placeholder="Ej. Ya podés canjear tu nuevo beneficio en cualquier sucursal."
                        maxLength={BODY_MAX}
                        rows={4}
                      />
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Se enviará a los {activeMembersCount} miembros con membresía activa.
                    </p>

                    <Button onClick={handleSend} disabled={!canSend} className="w-full">
                      <Send className="w-4 h-4 mr-2" />
                      Enviar notificación
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
