import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ClipboardList,
  Star,
  MessageSquare,
  ThumbsUp,
  ChevronDown,
  ChevronUp,
  Send,
  ExternalLink,
  Filter,
  Sparkles,
  Ticket,
  Trophy,
  Users,
  CalendarDays,
  Store,
  CreditCard,
  RefreshCw,
  Crown,
  Clock,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'

// ─── Encuestas: contenido existente ──────────────────────────────────────────
const benefits = [
  { icon: '💬', title: 'Escucha a tus clientes', desc: 'Recopila feedback real sobre su experiencia en tu negocio.' },
  { icon: '📊', title: 'Identifica mejoras', desc: 'Descubre qué funciona y qué hay que ajustar en tu servicio.' },
  { icon: '🎁', title: 'Incentiva respuestas', desc: 'Ofrece un descuento o premio a quien complete la encuesta.' },
  { icon: '🔄', title: 'Fomenta la recompra', desc: 'Convierte el feedback en una razón más para volver.' },
]

// ─── Reseñas: datos mock ──────────────────────────────────────────────────────
const MOCK_REVIEWS = [
  {
    id: 1,
    author: 'Valentina Ríos',
    rating: 5,
    date: 'hace 2 días',
    text: 'Excelente atención, el local está muy limpio y el personal es súper amable. Volvería sin dudarlo. Lo recomiendo a todos mis amigos.',
    owner_reply: null,
  },
  {
    id: 2,
    author: 'Martín Gómez',
    rating: 4,
    date: 'hace 5 días',
    text: 'Muy buena experiencia en general. El servicio fue rápido y la calidad estuvo a la altura. Le falta un poco más de variedad pero en general muy bien.',
    owner_reply: '¡Gracias Martín! Estamos trabajando para ampliar nuestro menú muy pronto. ¡Hasta la próxima!',
  },
  {
    id: 3,
    author: 'Lucía Fernández',
    rating: 5,
    date: 'hace 1 semana',
    text: 'Increíble lugar. El café es el mejor que probé en el barrio. La atención es de primera y el ambiente es muy agradable para trabajar o tomar algo tranquilo.',
    owner_reply: '¡Muchas gracias Lucía! Nos alegra mucho que te haya gustado. ¡Te esperamos pronto!',
  },
  {
    id: 4,
    author: 'Diego Martínez',
    rating: 3,
    date: 'hace 2 semanas',
    text: 'El producto está bien pero tuve que esperar bastante más de lo normal. Quizás era un día con mucha demanda.',
    owner_reply: null,
  },
  {
    id: 5,
    author: 'Camila Torres',
    rating: 5,
    date: 'hace 3 semanas',
    text: 'Todo perfecto como siempre. La mejor opción del barrio sin dudas. Personal muy atento y precios razonables.',
    owner_reply: null,
  },
  {
    id: 6,
    author: 'Sebastián López',
    rating: 4,
    date: 'hace 1 mes',
    text: 'Buena atención y buen producto. El lugar es cómodo y bien ubicado. Lo recomiendo.',
    owner_reply: '¡Gracias Sebastián! Es un placer tenerte como cliente.',
  },
]

const AVATAR_COLORS = ['#2563EB', '#0f766e', '#7c3aed', '#db2777', '#d97706', '#059669', '#dc2626', '#0284c7']

function getAvatarColor(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function getInitials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

// Respuestas sugeridas por IA según rating
const AI_SUGGESTIONS = {
  5: [
    '¡Muchas gracias por tu reseña! Nos alegra muchísimo que hayas tenido una experiencia tan positiva. Es lo que nos motiva a seguir mejorando cada día. ¡Te esperamos pronto!',
    '¡Qué bueno leer esto! Tu opinión nos llena de energía para seguir dando lo mejor. Gracias por tomarte el tiempo de compartirla. ¡Hasta la próxima!',
  ],
  4: [
    '¡Gracias por tu comentario! Nos alegra que hayas tenido una buena experiencia. Tomamos nota de tus observaciones para seguir mejorando. ¡Esperamos verte pronto!',
    'Muchas gracias por tu reseña. Es un placer tenerte como cliente y trabajamos constantemente para mejorar. ¡Te esperamos de vuelta!',
  ],
  3: [
    'Gracias por tomarte el tiempo de dejarnos tu opinión. Lamentamos que tu experiencia no haya sido la ideal. Tomamos nota de tus comentarios y trabajaremos para mejorar. ¡Esperamos darte una mejor experiencia en tu próxima visita!',
    'Apreciamos tu feedback honesto. Entendemos tu punto y estamos trabajando para mejorar los tiempos y el servicio. Nos gustaría que le des una nueva oportunidad. ¡Gracias!',
  ],
}

function getAISuggestion(rating) {
  const pool = AI_SUGGESTIONS[rating] ?? AI_SUGGESTIONS[3]
  return pool[Math.floor(Math.random() * pool.length)]
}

function StarRow({ rating, size = 'w-4 h-4' }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((v) => (
        <Star
          key={v}
          className={size}
          fill={v <= rating ? '#facc15' : 'none'}
          stroke={v <= rating ? '#facc15' : '#d1d5db'}
        />
      ))}
    </div>
  )
}

function RatingSummary({ reviews }) {
  const avg = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
  const responded = reviews.filter((r) => r.owner_reply).length
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }))

  return (
    <Card className="p-5 border border-gray-100 dark:border-gray-800 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        {/* Score */}
        <div className="flex flex-col items-center justify-center min-w-[100px]">
          <p className="text-5xl font-black text-gray-900 dark:text-white leading-none">{avg}</p>
          <StarRow rating={Math.round(avg)} size="w-4 h-4" />
          <p className="text-xs text-gray-400 mt-1">{reviews.length} reseñas</p>
        </div>

        {/* Barras */}
        <div className="flex-1 space-y-1.5 w-full">
          {dist.map(({ star, count }) => {
            const pct = reviews.length ? Math.round((count / reviews.length) * 100) : 0
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-3">{star}</span>
                <Star className="w-3 h-3 fill-yellow-400 stroke-yellow-400 flex-shrink-0" />
                <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-6 text-right">{count}</span>
              </div>
            )
          })}
        </div>

        {/* Stats */}
        <div className="flex sm:flex-col gap-4 sm:gap-2 sm:min-w-[130px]">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round((responded / reviews.length) * 100)}%
            </p>
            <p className="text-xs text-gray-400">respondidas</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{reviews.length - responded}</p>
            <p className="text-xs text-gray-400">sin responder</p>
          </div>
        </div>
      </div>
    </Card>
  )
}

function ReviewCard({ review, onReplySubmit }) {
  const [expanded, setExpanded] = useState(false)
  const [replyOpen, setReplyOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const avatarColor = getAvatarColor(review.author)
  const isLong = review.text.length > 120

  const handleSubmit = () => {
    if (!replyText.trim()) return
    const text = replyText.trim()
    setReplyText('')
    setReplyOpen(false)
    setSuccess(true)
    setTimeout(() => {
      onReplySubmit(review.id, text)
      setSuccess(false)
    }, 2200)
  }

  const handleAISuggest = () => {
    setAiLoading(true)
    setReplyText('')
    setTimeout(() => {
      setAiLoading(false)
      setReplyText(getAISuggestion(review.rating))
    }, 1600)
  }

  return (
    <Card className="p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
          style={{ backgroundColor: avatarColor }}
        >
          {getInitials(review.author)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{review.author}</p>
            <span className="text-xs text-gray-400 flex-shrink-0">{review.date}</span>
          </div>
          <StarRow rating={review.rating} size="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Texto */}
      <div className="mb-3">
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {isLong && !expanded ? `${review.text.slice(0, 120)}…` : review.text}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mt-1 flex items-center gap-1 transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3 h-3" /> Ver menos
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" /> Ver más
              </>
            )}
          </button>
        )}
      </div>

      {/* Respuesta existente */}
      {review.owner_reply && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 mb-3 border-l-2 border-gray-300 dark:border-gray-600">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Tu respuesta</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{review.owner_reply}</p>
        </div>
      )}

      {/* Mensaje de éxito */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-2 rounded-xl mb-3"
          >
            <ThumbsUp className="w-3.5 h-3.5 flex-shrink-0" />
            Respuesta publicada correctamente
          </motion.div>
        )}
      </AnimatePresence>

      {/* Acción responder */}
      {!review.owner_reply && (
        <div>
          {!replyOpen ? (
            <button
              onClick={() => setReplyOpen(true)}
              className="flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Responder
            </button>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                {/* Botón sugerir con IA */}
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-400">Respuesta pública</p>
                  <button
                    onClick={handleAISuggest}
                    disabled={aiLoading}
                    className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors disabled:opacity-60"
                  >
                    <Sparkles className="w-3 h-3" />
                    {aiLoading ? 'Generando…' : 'Sugerir con IA'}
                  </button>
                </div>

                {/* Textarea con estado de carga */}
                <div className="relative mb-2">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Escribí tu respuesta pública..."
                    rows={3}
                    disabled={aiLoading}
                    className="w-full text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 resize-none outline-none focus:border-violet-400 placeholder:text-gray-300 dark:placeholder:text-gray-600 dark:text-gray-200 disabled:opacity-50 transition-opacity"
                  />
                  <AnimatePresence>
                    {aiLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/80 dark:bg-gray-900/80"
                      >
                        <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400">
                          <Sparkles className="w-4 h-4 animate-pulse" />
                          <span className="text-xs font-medium">Generando respuesta</span>
                          <span className="flex gap-0.5">
                            {[0, 1, 2].map((i) => (
                              <motion.span
                                key={i}
                                className="w-1 h-1 rounded-full bg-violet-500"
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                              />
                            ))}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    className="h-8 text-xs gap-1.5"
                    onClick={handleSubmit}
                    disabled={!replyText.trim() || aiLoading}
                  >
                    <Send className="w-3 h-3" />
                    Publicar respuesta
                  </Button>
                  <button
                    onClick={() => {
                      setReplyOpen(false)
                      setReplyText('')
                    }}
                    className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}
    </Card>
  )
}

// ─── Tab Reseñas de Google ────────────────────────────────────────────────────
function GoogleReviewsTab() {
  const [redirectPostCanje, setRedirectPostCanje] = useState(true)
  const [redirectEncuesta, setRedirectEncuesta] = useState(false)
  const [configOpen, setConfigOpen] = useState(false)
  const [filter, setFilter] = useState('todas')
  const [reviews, setReviews] = useState(MOCK_REVIEWS)

  const handleReplySubmit = (id, text) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, owner_reply: text } : r)))
  }

  const filtered = reviews.filter((r) => {
    if (filter === 'sin-responder') return !r.owner_reply
    if (filter === 'respondidas') return !!r.owner_reply
    return true
  })

  const anyEnabled = redirectPostCanje || redirectEncuesta

  return (
    <div className="space-y-6">
      {/* Toggles configuración */}
      <Card className="border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <button
          onClick={() => setConfigOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-0.5">Redirigir a Google Maps</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Invitamos a los clientes satisfechos (4★ o más) a dejar una reseña en Google.
            </p>
          </div>
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium flex-shrink-0 transition-colors ${
              configOpen
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 border-gray-900 dark:border-white'
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'
            }`}
          >
            {configOpen ? 'Cerrar' : 'Configurar'}
            <motion.div animate={{ rotate: configOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-3.5 h-3.5" />
            </motion.div>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {configOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 space-y-3">
                {/* Toggle 1: post-canje */}
                <div className="flex items-start justify-between gap-4 py-3 border-t border-gray-100 dark:border-gray-800">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Encuesta post-canje</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      Después de que un cliente canjea puntos y completa la encuesta de experiencia.
                    </p>
                  </div>
                  <Switch checked={redirectPostCanje} onCheckedChange={setRedirectPostCanje} />
                </div>

                {/* Toggle 2: encuesta de satisfacción */}
                <div className="flex items-start justify-between gap-4 py-3 border-t border-gray-100 dark:border-gray-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Encuesta de satisfacción</p>
                      <span className="text-xs bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400 px-2 py-0.5 rounded-full font-medium">
                        Próximamente
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      Al finalizar una encuesta interna generada desde Repeat.
                    </p>
                  </div>
                  <Switch checked={redirectEncuesta} onCheckedChange={setRedirectEncuesta} disabled />
                </div>

                <AnimatePresence>
                  {anyEnabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-xs text-gray-400">Perfil de Google configurado</p>
                        <a
                          href="#"
                          className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Ver en Google
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Resumen */}
      <RatingSummary reviews={reviews} />

      {/* Filtros */}
      <div className="flex items-center gap-2">
        <Filter className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        {[
          { id: 'todas', label: 'Todas' },
          { id: 'sin-responder', label: 'Sin responder' },
          { id: 'respondidas', label: 'Respondidas' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filter === f.id
                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista de reseñas */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <ReviewCard review={review} onReplySubmit={handleReplySubmit} />
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <ThumbsUp className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No hay reseñas en este filtro</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Tab Encuestas (coming soon) ──────────────────────────────────────────────
function SurveysTab() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg">
            <ClipboardList className="w-10 h-10 text-white" />
          </div>
        </div>
        <div className="flex justify-center mb-3">
          <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800 px-3 py-1 text-sm font-medium rounded-full pointer-events-none select-none">
            Próximamente
          </span>
        </div>
        <h1 className="text-4xl font-bold leading-tight text-foreground mb-2">Encuesta de Satisfacción</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Conoce la experiencia real de tus clientes</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">¿Qué es?</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            La encuesta de satisfacción te permite conocer de primera mano qué piensan tus clientes sobre su experiencia
            en tu negocio: qué les gusta, qué no y qué podrías mejorar. Con esa información, podrás tomar decisiones más
            inteligentes y ofrecer experiencias cada vez mejores.
          </p>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Beneficios</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.07 }}
            >
              <Card className="p-5 h-full border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{b.icon}</div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">{b.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{b.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card className="p-6 bg-gradient-to-r from-yellow-400 to-yellow-500 border-0 shadow-lg text-center">
          <h2 className="text-xl font-bold text-black mb-2">¿Querés ser de los primeros?</h2>
          <p className="text-black/70 text-sm">
            Esta funcionalidad estará disponible muy pronto. Te avisaremos cuando esté lista.
          </p>
        </Card>
      </motion.div>
    </div>
  )
}

// ─── Mock data sorteos ────────────────────────────────────────────────────────
const MOCK_MEMBERS = [
  { id: 1, name: 'Valentina Ríos', email: 'vale@email.com', visits: 12, last_visit: '2026-04-20' },
  { id: 2, name: 'Martín Gómez', email: 'martin@email.com', visits: 8, last_visit: '2026-04-18' },
  { id: 3, name: 'Lucía Fernández', email: 'lucia@email.com', visits: 21, last_visit: '2026-04-21' },
  { id: 4, name: 'Diego Martínez', email: 'diego@email.com', visits: 5, last_visit: '2026-04-10' },
  { id: 5, name: 'Camila Torres', email: 'cami@email.com', visits: 17, last_visit: '2026-04-19' },
  { id: 6, name: 'Sebastián López', email: 'seba@email.com', visits: 9, last_visit: '2026-04-15' },
  { id: 7, name: 'Ana García', email: 'ana@email.com', visits: 14, last_visit: '2026-04-22' },
  { id: 8, name: 'Carlos Ruiz', email: 'carlos@email.com', visits: 6, last_visit: '2026-04-05' },
  { id: 9, name: 'Sofía Martínez', email: 'sofi@email.com', visits: 19, last_visit: '2026-04-21' },
  { id: 10, name: 'Lucas Fernández', email: 'lucas@email.com', visits: 11, last_visit: '2026-04-17' },
  { id: 11, name: 'Florencia Pérez', email: 'flor@email.com', visits: 7, last_visit: '2026-04-12' },
  { id: 12, name: 'Tomás Herrera', email: 'tomas@email.com', visits: 3, last_visit: '2026-03-28' },
]

const MOCK_HISTORY = [
  {
    id: 1,
    date: '15 abr 2026',
    prize: 'Cena para dos',
    filter: 'Última visita · últimos 30 días',
    participants: 47,
    winners: [{ name: 'Camila Torres', email: 'cami@email.com' }],
  },
  {
    id: 2,
    date: '1 abr 2026',
    prize: 'Gift card $5.000',
    filter: 'Todos los miembros · Club Café',
    participants: 134,
    winners: [
      { name: 'Martín Gómez', email: 'martin@email.com' },
      { name: 'Ana García', email: 'ana@email.com' },
    ],
  },
  {
    id: 3,
    date: '15 mar 2026',
    prize: 'Descuento 50%',
    filter: 'Última visita · últimos 7 días',
    participants: 23,
    winners: [{ name: 'Valentina Ríos', email: 'vale@email.com' }],
  },
]

const AVATAR_COLORS_SORTEO = ['#2563EB', '#0f766e', '#7c3aed', '#db2777', '#d97706', '#059669']

function getAvatarColorSorteo(name) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS_SORTEO[Math.abs(hash) % AVATAR_COLORS_SORTEO.length]
}

function getInitialsSorteo(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

function WinnerCard({ winner, index, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', damping: 18, stiffness: 250, delay: index * 0.15 }}
      className="flex items-center gap-3 p-4 rounded-2xl border-2 bg-white dark:bg-gray-900"
      style={{ borderColor: color }}
    >
      <div className="relative flex-shrink-0">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold"
          style={{ backgroundColor: getAvatarColorSorteo(winner.name) }}
        >
          {getInitialsSorteo(winner.name)}
        </div>
        <div
          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: color }}
        >
          <Trophy className="w-2.5 h-2.5" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{winner.name}</p>
        <p className="text-xs text-gray-400 truncate">{winner.email}</p>
      </div>
      <span
        className="text-xs font-bold px-2 py-1 rounded-full text-white flex-shrink-0"
        style={{ backgroundColor: color }}
      >
        #{index + 1}
      </span>
    </motion.div>
  )
}

function SorteosTab() {
  const [filterType, setFilterType] = useState('last_visit')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [winnerCount, setWinnerCount] = useState(1)
  const [prize, setPrize] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'spinning' | 'done'
  const [winners, setWinners] = useState([])
  const [historyOpen, setHistoryOpen] = useState(false)
  const [spinLabel, setSpinLabel] = useState('')

  const accentColor = '#ca8a04'

  const eligibleCount = MOCK_MEMBERS.filter((m) => {
    if (filterType === 'last_visit') {
      if (!dateFrom && !dateTo) return true
      const d = new Date(m.last_visit)
      if (dateFrom && d < new Date(dateFrom)) return false
      if (dateTo && d > new Date(dateTo)) return false
      return true
    }
    return true
  }).length

  const handleSorteo = () => {
    if (eligibleCount < winnerCount) return
    setStatus('spinning')
    setWinners([])

    const labels = ['Mezclando participantes…', 'Eligiendo ganadores…', '¡Casi listo!']
    let i = 0
    setSpinLabel(labels[0])
    const lbl = setInterval(() => {
      i++
      if (i < labels.length) setSpinLabel(labels[i])
      else clearInterval(lbl)
    }, 700)

    setTimeout(() => {
      clearInterval(lbl)
      const pool = [...MOCK_MEMBERS].sort(() => Math.random() - 0.5)
      setWinners(pool.slice(0, Math.min(winnerCount, pool.length)))
      setStatus('done')
    }, 2200)
  }

  const handleReset = () => {
    setStatus('idle')
    setWinners([])
    setPrize('')
  }

  return (
    <div className="space-y-6">
      {/* Formulario de configuración */}
      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div key="config" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card className="p-5 border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
              {/* Premio */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5" /> Premio
                </label>
                <input
                  type="text"
                  value={prize}
                  onChange={(e) => setPrize(e.target.value)}
                  placeholder="Ej: Cena para dos, Gift card $5.000, Descuento 50%..."
                  className="w-full h-11 px-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:outline-none focus:border-yellow-400"
                />
              </div>

              {/* Filtro de participantes */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> Participantes
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Tipo de filtro */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Filtrar por</label>
                    <div className="relative">
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full h-10 pl-3 pr-8 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 appearance-none focus:outline-none focus:border-yellow-400"
                      >
                        <option value="last_visit">Última visita</option>
                        <option value="member_since">Miembro desde</option>
                        <option value="all">Todos los miembros</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Desde */}
                  {filterType !== 'all' && (
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400">Desde</label>
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="w-full h-10 px-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                  )}

                  {/* Hasta */}
                  {filterType !== 'all' && (
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400">Hasta</label>
                      <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        className="w-full h-10 px-3 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Sucursal */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 flex items-center gap-1">
                      <Store className="w-3 h-3" /> Sucursal
                    </label>
                    <div className="relative">
                      <select className="w-full h-10 pl-3 pr-8 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 appearance-none focus:outline-none focus:border-yellow-400">
                        <option value="">Todas las sucursales</option>
                        <option value="1">Sucursal Centro</option>
                        <option value="2">Sucursal Norte</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Programa */}
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400 flex items-center gap-1">
                      <CreditCard className="w-3 h-3" /> Programa
                    </label>
                    <div className="relative">
                      <select className="w-full h-10 pl-3 pr-8 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 appearance-none focus:outline-none focus:border-yellow-400">
                        <option value="">Todos los programas</option>
                        <option value="1">Club Café Bonafide</option>
                        <option value="2">Spa Alma Club</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cantidad de ganadores */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5" /> Cantidad de ganadores
                </label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setWinnerCount(n)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold border-2 transition-all ${
                        winnerCount === n
                          ? 'border-yellow-400 bg-yellow-400 text-black'
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={winnerCount}
                    onChange={(e) => setWinnerCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 h-10 px-2 text-sm text-center rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none focus:border-yellow-400"
                  />
                </div>
              </div>

              {/* Resumen de participantes */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>Participantes elegibles</span>
                </div>
                <span className="text-lg font-black text-gray-900 dark:text-white">{eligibleCount}</span>
              </div>

              {/* Botón */}
              <button
                onClick={handleSorteo}
                disabled={eligibleCount < winnerCount || eligibleCount === 0}
                className="w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#facc15', color: '#000' }}
              >
                <Ticket className="w-4 h-4" />
                Realizar sorteo
                {prize && <span className="font-normal opacity-70">· {prize}</span>}
              </button>
            </Card>
          </motion.div>
        )}

        {/* Estado: sorteando */}
        {status === 'spinning' && (
          <motion.div
            key="spinning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 space-y-6"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 rounded-full border-4 border-yellow-200 border-t-yellow-400"
            />
            <div className="text-center">
              <motion.p
                key={spinLabel}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg font-semibold text-gray-800 dark:text-gray-200"
              >
                {spinLabel}
              </motion.p>
              <p className="text-sm text-gray-400 mt-1">{eligibleCount} participantes en el sorteo</p>
            </div>
          </motion.div>
        )}

        {/* Estado: resultado */}
        {status === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            <div className="text-center space-y-1">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center mx-auto mb-3 shadow-lg"
              >
                <Trophy className="w-8 h-8 text-black" />
              </motion.div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white">
                {winners.length === 1 ? '¡Ganador del sorteo!' : `¡${winners.length} ganadores del sorteo!`}
              </h2>
              {prize && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Premio: <strong>{prize}</strong>
                </p>
              )}
              <p className="text-xs text-gray-400">
                {eligibleCount} participantes · sorteo {new Date().toLocaleDateString('es-AR')}
              </p>
            </div>

            <div className="space-y-3">
              {winners.map((winner, i) => (
                <WinnerCard key={winner.id || i} winner={winner} index={i} color={accentColor} />
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 h-11 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Nuevo sorteo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Historial */}
      <div className="border-t border-gray-100 dark:border-gray-800 pt-5">
        <button
          onClick={() => setHistoryOpen((v) => !v)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Historial de sorteos</p>
            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
              {MOCK_HISTORY.length}
            </span>
          </div>
          <motion.div animate={{ rotate: historyOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {historyOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="mt-4 space-y-3">
                {MOCK_HISTORY.map((entry) => (
                  <Card key={entry.id} className="p-4 border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{entry.prize}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {entry.filter} · {entry.participants} participantes
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0 flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        {entry.date}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {entry.winners.map((w, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                        >
                          <Trophy className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
                          <span className="text-xs font-medium text-yellow-800 dark:text-yellow-300">{w.name}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function Survey() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Feedback</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Gestioná las opiniones y encuestas de tus clientes
        </p>
      </motion.div>

      <Tabs defaultValue="resenas">
        <TabsList className="mb-6">
          <TabsTrigger value="encuestas">Encuestas</TabsTrigger>
          <TabsTrigger value="resenas">Reseñas de Google</TabsTrigger>
          <TabsTrigger value="sorteos">Sorteos</TabsTrigger>
        </TabsList>

        <TabsContent value="encuestas">
          <SurveysTab />
        </TabsContent>

        <TabsContent value="resenas">
          <GoogleReviewsTab />
        </TabsContent>

        <TabsContent value="sorteos">
          <SorteosTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
