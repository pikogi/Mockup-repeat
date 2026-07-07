import { useState } from 'react'
import {
  Users,
  Star,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  ImageIcon,
  Hash,
  Type,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ExternalLink,
  ArrowLeft,
  Search,
  Edit,
  Eye,
  ClipboardList,
  Gift,
  Flag,
  UploadCloud,
  Info,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

const CARD_COLORS = ['#1B5E5A', '#4C1D95', '#92400E', '#064E3B', '#1E3A5F', '#831843', '#713F12', '#134E4A']
const OPTION_EMOJIS = ['😊', '👪', '👥', '☕', '🥪', '🍰', '🎁', '⭐']

// kept for QuestionCard option list dots
const OPTION_GRADIENTS = [
  'from-violet-400 to-purple-600',
  'from-rose-400 to-pink-600',
  'from-blue-400 to-cyan-600',
  'from-amber-400 to-orange-500',
  'from-emerald-400 to-teal-600',
  'from-fuchsia-400 to-pink-600',
]

const QUESTION_TYPES = [
  { id: 'image', label: 'Imagen', icon: ImageIcon },
  { id: 'nps', label: 'NPS', icon: Hash },
  { id: 'text', label: 'Texto libre', icon: Type },
]

let nextSurveyId = 3
let nextQuestionId = 10

const DEFAULT_PREMIO = {
  titulo: 'COMPLETA LA ENCUESTA Y GANA ☕☕',
  descripcion: '20% OFF en tu próxima compra',
  boton: 'COMENZAR ENCUESTA',
  referencia: 'Promesa: Te llevará menos de 30 segundos y nos ayuda a mejorar ❤️',
  color: '#111827',
  validezDias: 0,
  validezClienteDias: 30,
  redimibleVarias: false,
}

const DEFAULT_FIN = {
  titulo: '¡Gracias por tu opinión!',
  mensaje: 'Tu feedback nos ayuda a mejorar cada día.',
}

const INITIAL_SURVEYS = [
  {
    id: 1,
    name: 'Encuesta post-visita',
    description: 'Se envía automáticamente después de cada visita al local.',
    color: '#7C3AED',
    status: 'active',
    stats: { responses: 142, nps: 72, completion: 68 },
    premio: { ...DEFAULT_PREMIO },
    fin: { ...DEFAULT_FIN },
    questions: [
      { id: 1, type: 'image', text: '¿Con quién nos visitaste hoy?', options: ['AMIGOS', 'FAMILIA', 'COMPAÑEROS'] },
      { id: 2, type: 'nps', text: '¿Cuánto nos recomendarías a un amigo?' },
      { id: 3, type: 'image', text: '¿Qué pediste hoy?', options: ['CAFÉ', 'SANDWICH', 'POSTRE', 'COMBO'] },
      { id: 4, type: 'nps', text: '¿Cómo calificarías la atención del personal?' },
    ],
  },
  {
    id: 2,
    name: 'Feedback del menú nuevo',
    description: 'Para conocer la opinión sobre los platos nuevos de temporada.',
    color: '#0891B2',
    status: 'draft',
    stats: { responses: 0, nps: null, completion: 0 },
    premio: {
      titulo: 'COMPLETÁ LA ENCUESTA Y GANÁ 🎁',
      descripcion: 'Café gratis en tu próxima visita',
      boton: 'COMENZAR',
      referencia: '',
      validezDias: 7,
      validezClienteDias: 30,
      redimibleVarias: false,
    },
    fin: { ...DEFAULT_FIN },
    questions: [
      { id: 5, type: 'image', text: '¿Probaste algún plato nuevo?', options: ['EMPANADAS', 'WRAP', 'BOWL'] },
      { id: 6, type: 'nps', text: '¿Cómo calificarías el nuevo menú?' },
      { id: 7, type: 'text', text: '¿Qué producto te gustaría que incorporemos?' },
    ],
  },
]

// ─── Mobile previews ──────────────────────────────────────────────────────────

function isLightColor(hex) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55
}

function PhoneStatusBar() {
  return (
    <div className="relative flex items-center justify-between px-5 h-9 flex-shrink-0">
      {/* Dynamic Island */}
      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-[88px] h-[26px] bg-gray-900 rounded-full z-10" />
      <span className="text-[11px] font-semibold text-gray-900 z-20 relative">9:41</span>
      <div className="flex items-center gap-1 z-20 relative">
        {/* Signal bars */}
        <div className="flex items-end gap-[2px] h-[10px]">
          {[3, 5, 7, 9].map((h, i) => (
            <div key={i} className="w-[2.5px] rounded-sm bg-gray-900" style={{ height: h }} />
          ))}
        </div>
        {/* WiFi */}
        <svg width="13" height="10" viewBox="0 0 13 10" fill="currentColor" className="text-gray-900">
          <path d="M6.5 7.5a1 1 0 110 2 1 1 0 010-2zM6.5 4.5c1.38 0 2.63.56 3.54 1.46l.94-.94A6.26 6.26 0 006.5 3a6.26 6.26 0 00-4.48 1.98l.94.94A4.75 4.75 0 016.5 4.5zm0-3C8.7 1.5 10.7 2.4 12.14 3.86l.94-.94A8.75 8.75 0 006.5 0 8.75 8.75 0 00.42 2.92l.94.94A7.25 7.25 0 016.5 1.5z" />
        </svg>
        {/* Battery */}
        <div className="flex items-center gap-[1px]">
          <div className="w-[20px] h-[10px] border-[1.5px] border-gray-900 rounded-[2.5px] flex items-center px-[1.5px]">
            <div className="h-[5.5px] w-full bg-gray-900 rounded-[1px]" />
          </div>
          <div className="w-[2px] h-[5px] bg-gray-900 rounded-r-sm" />
        </div>
      </div>
    </div>
  )
}

function PhoneFrame({ children }) {
  return (
    <div className="relative mx-auto select-none" style={{ width: 252 }}>
      {/* Side buttons */}
      <div className="absolute -left-[3px] top-16 w-[3px] h-6 bg-gray-600 rounded-l-full" />
      <div className="absolute -left-[3px] top-[104px] w-[3px] h-9 bg-gray-600 rounded-l-full" />
      <div className="absolute -left-[3px] top-[152px] w-[3px] h-9 bg-gray-600 rounded-l-full" />
      <div className="absolute -right-[3px] top-[112px] w-[3px] h-14 bg-gray-600 rounded-r-full" />
      {/* Frame */}
      <div className="bg-gray-900 rounded-[44px] p-[10px] shadow-2xl ring-1 ring-black/20">
        <div className="bg-white rounded-[36px] overflow-hidden flex flex-col" style={{ minHeight: 506 }}>
          <PhoneStatusBar />
          <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
          <div className="flex justify-center pb-2 pt-1 flex-shrink-0">
            <div className="w-24 h-[5px] bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

function MobilePremioPreview({ premio }) {
  const accent = premio?.color || '#111827'
  const onAccent = isLightColor(accent) ? '#111827' : '#ffffff'

  return (
    <div className="flex flex-col items-center">
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 font-medium uppercase tracking-wider">Vista previa</p>
      <PhoneFrame>
        <div className="flex-1 flex flex-col">
          {/* Colored top section */}
          <div
            className="flex flex-col items-center justify-end px-5 pt-5 pb-12"
            style={{ backgroundColor: accent, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}
          >
            <h2
              className="text-[13px] font-black text-center leading-snug uppercase tracking-wide"
              style={{ color: onAccent }}
            >
              {premio?.titulo || 'COMPLETA LA ENCUESTA Y GANA ☕☕'}
            </h2>
          </div>

          {/* Floating image — overlaps the split */}
          <div className="flex justify-center -mt-9">
            <div className="w-[72px] h-[72px] rounded-[22px] bg-white shadow-xl border border-gray-100 flex items-center justify-center">
              <span className="text-4xl">☕</span>
            </div>
          </div>

          {/* Bottom content */}
          <div className="flex-1 flex flex-col items-center px-5 pt-4 pb-3 gap-2">
            <p className="text-sm font-bold text-gray-900 text-center leading-tight">
              {premio?.descripcion || '20% OFF en tu próxima compra'}
            </p>
            {premio?.referencia && (
              <p className="text-[10px] text-gray-400 text-center italic leading-relaxed px-1">{premio.referencia}</p>
            )}
            <div className="flex-1" />
            <button
              className="w-full py-3 rounded-xl text-[11px] font-black tracking-wider uppercase shadow-sm"
              style={{ backgroundColor: accent, color: onAccent }}
            >
              {premio?.boton || 'COMENZAR ENCUESTA'}
            </button>
          </div>

          <div className="border-t border-gray-100 py-2 flex items-center justify-center gap-1 flex-shrink-0">
            <span className="text-[9px] text-gray-400">Powered by</span>
            <span className="text-[9px] font-black text-gray-700">rep.eat</span>
          </div>
        </div>
      </PhoneFrame>
    </div>
  )
}

function MobileFinPreview({ fin }) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 font-medium uppercase tracking-wider">Vista previa</p>
      <PhoneFrame>
        <div className="flex-1 flex flex-col items-center justify-center px-5 gap-3">
          <div className="text-5xl">🎉</div>
          <h2 className="text-base font-bold text-gray-900 text-center leading-tight">
            {fin?.titulo || '¡Gracias por tu opinión!'}
          </h2>
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            {fin?.mensaje || 'Tu feedback nos ayuda a mejorar cada día.'}
          </p>
        </div>
        <div className="border-t border-gray-100 py-2 flex items-center justify-center gap-1 flex-shrink-0">
          <span className="text-[9px] text-gray-400">Powered by</span>
          <span className="text-[9px] font-black text-gray-700">rep.eat</span>
        </div>
      </PhoneFrame>
    </div>
  )
}

function MobileQuestionPreview({ question, index, total }) {
  const [npsValue, setNpsValue] = useState(null)
  const [selected, setSelected] = useState(null)

  return (
    <div className="flex flex-col items-center">
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 font-medium uppercase tracking-wider">Vista previa</p>
      <PhoneFrame>
        <div className="flex-1 flex flex-col px-5 pt-3 pb-4">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[11px] text-gray-400 font-medium tabular-nums">
              {index}/{total}
            </span>
            <div className="flex-1 h-[3px] bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-400 rounded-full transition-all duration-300"
                style={{ width: `${(index / total) * 100}%` }}
              />
            </div>
            <div className="w-[18px] h-[18px] rounded-full border border-gray-300 flex items-center justify-center flex-shrink-0">
              <Info className="w-2.5 h-2.5 text-gray-400" />
            </div>
          </div>

          {/* Question */}
          <h2 className="text-[16px] font-bold text-gray-900 text-center leading-snug mb-6">
            {question?.text || 'Tu pregunta aquí'}
          </h2>

          {/* Image options */}
          {question?.type === 'image' && (
            <div className="grid grid-cols-2 gap-3 flex-1 content-start">
              {(question.options || []).map((opt, i) => {
                const isLast = i === question.options.length - 1 && question.options.length % 2 !== 0
                return (
                  <button
                    key={opt}
                    onClick={() => setSelected(opt)}
                    className={cn(
                      'flex flex-col items-center gap-1.5 transition-all',
                      isLast && 'col-span-2 mx-auto w-[48%]',
                      selected === opt && 'scale-95',
                    )}
                  >
                    <div
                      className={cn(
                        'w-full aspect-square rounded-2xl flex items-center justify-center ring-2 transition-all',
                        selected === opt ? 'ring-gray-900' : 'ring-transparent',
                      )}
                      style={{ backgroundColor: CARD_COLORS[i % CARD_COLORS.length] }}
                    >
                      <span className="text-2xl">{OPTION_EMOJIS[i % OPTION_EMOJIS.length]}</span>
                    </div>
                    <p className="text-[9px] font-bold text-gray-600 text-center tracking-widest uppercase">{opt}</p>
                  </button>
                )
              })}
            </div>
          )}

          {/* NPS */}
          {question?.type === 'nps' && (
            <div className="space-y-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 11 }, (_, i) => i).map((n) => (
                  <button
                    key={n}
                    onClick={() => setNpsValue(n)}
                    className={cn(
                      'flex-1 aspect-square rounded text-[8px] font-bold transition-all',
                      npsValue === n ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600',
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex justify-between">
                <span className="text-[9px] text-gray-400">Nada probable</span>
                <span className="text-[9px] text-gray-400">Muy probable</span>
              </div>
            </div>
          )}

          {/* Text */}
          {question?.type === 'text' && (
            <div className="border border-gray-200 rounded-xl p-3 bg-gray-50">
              <p className="text-[11px] text-gray-400">Escribí tu respuesta...</p>
            </div>
          )}

          <div className="flex-1 min-h-3" />

          {/* Navigation */}
          <div className="flex gap-2 mt-3">
            <button className="w-10 h-10 border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 bg-white">
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </button>
            <button className="flex-1 h-10 bg-gray-900 text-white rounded-xl text-sm font-semibold">Siguiente</button>
          </div>
        </div>

        <div className="border-t border-gray-100 py-2 flex items-center justify-center gap-1 flex-shrink-0">
          <span className="text-[9px] text-gray-400">Powered by</span>
          <span className="text-[9px] font-black text-gray-700">rep.eat</span>
        </div>
      </PhoneFrame>
    </div>
  )
}

// ─── Section accordion header ─────────────────────────────────────────────────

function SectionHeader({ icon: Icon, label, expanded, onToggle }) {
  return (
    <button onClick={onToggle} className="w-full flex items-center gap-3 py-4 text-left group">
      <div
        className={cn(
          'w-7 h-7 rounded-lg flex items-center justify-center transition-colors flex-shrink-0',
          expanded ? 'bg-gray-900 dark:bg-gray-100' : 'bg-gray-100 dark:bg-gray-800',
        )}
      >
        <Icon
          className={cn('w-3.5 h-3.5', expanded ? 'text-white dark:text-gray-900' : 'text-gray-500 dark:text-gray-400')}
        />
      </div>
      <span
        className={cn(
          'text-sm font-semibold uppercase tracking-widest',
          expanded ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400',
        )}
      >
        {label}
      </span>
      <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
      {expanded ? (
        <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
      ) : (
        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
      )}
    </button>
  )
}

// ─── Premios section form ─────────────────────────────────────────────────────

function PremiosForm({ premio, onUpdate }) {
  const p = premio || DEFAULT_PREMIO

  const set = (field, value) => onUpdate({ ...p, [field]: value })

  return (
    <div className="space-y-6 pb-6">
      {/* Validez */}
      <div className="space-y-3">
        <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Validez</p>
        <p className="text-sm text-gray-700 dark:text-gray-300 flex flex-wrap items-center gap-x-2 gap-y-1">
          El premio será válido para cada cliente por
          <input
            type="number"
            min={0}
            value={p.validezClienteDias}
            onChange={(e) => set('validezClienteDias', Number(e.target.value))}
            className="w-14 text-center border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 text-sm font-semibold bg-white dark:bg-gray-800 focus:outline-none focus:border-gray-500"
          />
          días luego de completar la encuesta.
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300 flex flex-wrap items-center gap-x-2 gap-y-1">
          El premio expira a los
          <input
            type="number"
            min={0}
            value={p.validezDias}
            onChange={(e) => set('validezDias', Number(e.target.value))}
            className="w-14 text-center border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 text-sm font-semibold bg-white dark:bg-gray-800 focus:outline-none focus:border-gray-500"
          />
          días de emitido.
        </p>
        <div className="flex items-center gap-3">
          <Switch checked={p.redimibleVarias} onCheckedChange={(v) => set('redimibleVarias', v)} />
          <span className="text-sm text-gray-700 dark:text-gray-300">¿Puede ser redimido más de una vez?</span>
        </div>
      </div>

      <div className="h-px bg-gray-100 dark:bg-gray-800" />

      {/* Contenido */}
      <div className="space-y-4">
        <div className="inline-flex items-center px-2 py-0.5 border border-gray-200 dark:border-gray-700 rounded text-xs font-bold text-gray-500 tracking-widest">
          ES
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            Título
          </label>
          <Input
            value={p.titulo}
            onChange={(e) => set('titulo', e.target.value)}
            placeholder="COMPLETA LA ENCUESTA Y GANA..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            Premio
          </label>
          <Input
            value={p.descripcion}
            onChange={(e) => set('descripcion', e.target.value)}
            placeholder="20% OFF en tu próxima compra"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            Imagen de premio
          </label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">☕</span>
            </div>
            <div>
              <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5">
                <UploadCloud className="w-3.5 h-3.5" />
                Subir imagen
              </button>
              <p className="text-[11px] text-gray-400 mt-1.5">JPG o PNG · min 300×300 px · máx 500 KB</p>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            Botón para comenzar
          </label>
          <Input value={p.boton} onChange={(e) => set('boton', e.target.value)} placeholder="COMENZAR ENCUESTA" />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            Color de acento
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={p.color || '#111827'}
              onChange={(e) => set('color', e.target.value)}
              className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer p-1 bg-white dark:bg-gray-900"
            />
            <span className="text-xs text-gray-400 dark:text-gray-500">Se aplica a la franja superior y al botón</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            Referencia sobre la encuesta
          </label>
          <Input
            value={p.referencia}
            onChange={(e) => set('referencia', e.target.value)}
            placeholder="Promesa: Te llevará menos de 30 segundos..."
          />
        </div>
      </div>
    </div>
  )
}

// ─── Question card (builder) ──────────────────────────────────────────────────

function QuestionCard({ question, index, expanded, onToggle, onUpdate, onDelete }) {
  const [newOption, setNewOption] = useState('')

  const addOption = () => {
    const val = newOption.toUpperCase().trim()
    if (!val) return
    onUpdate({ ...question, options: [...(question.options || []), val] })
    setNewOption('')
  }

  const removeOption = (i) => onUpdate({ ...question, options: question.options.filter((_, idx) => idx !== i) })

  const changeType = (type) =>
    onUpdate({ ...question, type, options: type === 'image' ? ['OPCIÓN 1', 'OPCIÓN 2'] : undefined })

  const typeBadge =
    question.type === 'image'
      ? 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
      : question.type === 'nps'
        ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
        : 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'

  const typeLabel = question.type === 'image' ? 'Imagen' : question.type === 'nps' ? 'NPS' : 'Texto'

  return (
    <Card className="border border-gray-100 dark:border-gray-800 shadow-sm">
      <CardContent className="p-0">
        <button
          className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
          onClick={onToggle}
        >
          <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500 flex-shrink-0">
            {index}
          </span>
          <p className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
            {question.text || <span className="text-gray-400 italic font-normal">Sin título</span>}
          </p>
          <span className={cn('text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0', typeBadge)}>
            {typeLabel}
          </span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
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
              <div className="px-4 pb-4 space-y-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                <div className="flex gap-2">
                  {QUESTION_TYPES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => changeType(t.id)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                        question.type === t.id
                          ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-transparent'
                          : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-400',
                      )}
                    >
                      <t.icon className="w-3 h-3" />
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Pregunta</label>
                  <Input
                    value={question.text}
                    onChange={(e) => onUpdate({ ...question, text: e.target.value })}
                    placeholder="Escribí la pregunta..."
                    className="h-9"
                  />
                </div>

                {question.type === 'image' && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Opciones</label>
                    <div className="space-y-1.5">
                      {(question.options || []).map((opt, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div
                            className={cn(
                              'w-4 h-4 rounded flex-shrink-0 bg-gradient-to-br',
                              OPTION_GRADIENTS[i % OPTION_GRADIENTS.length],
                            )}
                          />
                          <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{opt}</span>
                          <button
                            onClick={() => removeOption(i)}
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addOption()}
                        placeholder="Nueva opción..."
                        className="h-8 text-sm"
                      />
                      <Button size="sm" variant="outline" onClick={addOption} className="h-8 px-3 flex-shrink-0">
                        <Plus className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )}

                {question.type === 'nps' && (
                  <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3">
                    <p className="text-xs text-amber-800 dark:text-amber-300">
                      Escala automática 0–10. Detractores: 0–6 · Pasivos: 7–8 · Promotores: 9–10.
                    </p>
                  </div>
                )}

                <div className="flex justify-end pt-1 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={onDelete}
                    className="text-xs text-red-400 hover:text-red-600 transition-colors flex items-center gap-1 mt-3"
                  >
                    <Trash2 className="w-3 h-3" />
                    Eliminar pregunta
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

// ─── Survey list item ─────────────────────────────────────────────────────────

function SurveyListItem({ survey, onEdit, onDelete, onToggleActive }) {
  const isActive = survey.status === 'active'

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="flex flex-col md:flex-row">
          <div
            className="w-full md:w-48 h-36 md:h-auto relative overflow-hidden flex-shrink-0"
            style={{ background: survey.color }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
              <ClipboardList className="w-8 h-8 text-white/70" />
              <h4 className="font-bold text-base text-white text-center leading-tight">{survey.name}</h4>
            </div>
          </div>

          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{survey.name}</h3>
                  <Badge
                    variant="outline"
                    className={cn(
                      'flex-shrink-0',
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                        : 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
                    )}
                  >
                    {isActive ? 'Activa' : 'Borrador'}
                  </Badge>
                </div>
                {survey.description && (
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">{survey.description}</p>
                )}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch checked={isActive} onCheckedChange={() => onToggleActive(survey.id)} />
                    <span
                      className={cn(
                        'text-sm font-medium',
                        isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400',
                      )}
                    >
                      {isActive ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {survey.stats.responses} respuestas
                  </Badge>
                  {survey.stats.nps !== null && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      NPS {survey.stats.nps}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400 mb-4">{survey.questions.length} preguntas</p>

            <div className="flex flex-wrap gap-2">
              <Link to="/encuesta/demo" target="_blank">
                <Button variant="outline" size="sm" className="gap-2 h-10 md:h-8">
                  <Eye className="w-4 h-4" />
                  Ver encuesta
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="gap-2 h-10 md:h-8" onClick={() => onEdit(survey.id)}>
                <Edit className="w-4 h-4" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 h-10 md:h-8 text-red-500 hover:text-red-600 hover:border-red-300"
                onClick={() => onDelete(survey.id)}
              >
                <Trash2 className="w-4 h-4" />
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// ─── Builder view ─────────────────────────────────────────────────────────────

function SurveyBuilder({ survey, onBack, onUpdate }) {
  const [openSection, setOpenSection] = useState('preguntas')
  const [expandedId, setExpandedId] = useState(survey.questions[0]?.id ?? null)

  const toggle = (section) => setOpenSection((prev) => (prev === section ? null : section))

  const expandedQuestion = survey.questions.find((q) => q.id === expandedId) || survey.questions[0]
  const expandedIndex = survey.questions.findIndex((q) => q.id === (expandedId ?? survey.questions[0]?.id)) + 1

  const addQuestion = (type) => {
    const newQ = {
      id: nextQuestionId++,
      type,
      text: '',
      options: type === 'image' ? ['OPCIÓN 1', 'OPCIÓN 2'] : undefined,
    }
    onUpdate({ ...survey, questions: [...survey.questions, newQ] })
    setExpandedId(newQ.id)
    setOpenSection('preguntas')
  }

  const updateQuestion = (updated) =>
    onUpdate({ ...survey, questions: survey.questions.map((q) => (q.id === updated.id ? updated : q)) })

  const deleteQuestion = (id) => {
    onUpdate({ ...survey, questions: survey.questions.filter((q) => q.id !== id) })
    setExpandedId(null)
  }

  const toggleStatus = () => onUpdate({ ...survey, status: survey.status === 'active' ? 'draft' : 'active' })

  const preview =
    openSection === 'premios' ? (
      <MobilePremioPreview premio={survey.premio} />
    ) : openSection === 'fin' ? (
      <MobileFinPreview fin={survey.fin} />
    ) : (
      <MobileQuestionPreview question={expandedQuestion} index={expandedIndex || 1} total={survey.questions.length} />
    )

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Encuestas
          </button>
          <span className="text-gray-300 dark:text-gray-600">/</span>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{survey.name}</h2>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/encuesta/demo"
            target="_blank"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Ver encuesta
          </Link>
          <div className="w-px h-4 bg-gray-200 dark:bg-gray-700" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {survey.status === 'active' ? 'Activa' : 'Borrador'}
          </span>
          <Switch checked={survey.status === 'active'} onCheckedChange={toggleStatus} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left: sections */}
        <div className="xl:col-span-2">
          {/* PREMIOS */}
          <div className="border-b border-gray-100 dark:border-gray-800">
            <SectionHeader
              icon={Gift}
              label="Premios"
              expanded={openSection === 'premios'}
              onToggle={() => toggle('premios')}
            />
            <AnimatePresence initial={false}>
              {openSection === 'premios' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <PremiosForm premio={survey.premio} onUpdate={(premio) => onUpdate({ ...survey, premio })} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* PREGUNTAS */}
          <div className="border-b border-gray-100 dark:border-gray-800">
            <SectionHeader
              icon={ClipboardList}
              label="Preguntas"
              expanded={openSection === 'preguntas'}
              onToggle={() => toggle('preguntas')}
            />
            <AnimatePresence initial={false}>
              {openSection === 'preguntas' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3 pb-6">
                    {survey.questions.map((q, i) => (
                      <QuestionCard
                        key={q.id}
                        question={q}
                        index={i + 1}
                        expanded={expandedId === q.id}
                        onToggle={() => setExpandedId(expandedId === q.id ? null : q.id)}
                        onUpdate={updateQuestion}
                        onDelete={() => deleteQuestion(q.id)}
                      />
                    ))}
                    <div className="flex gap-2 pt-1">
                      {QUESTION_TYPES.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => addQuestion(t.id)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600 dark:hover:border-gray-500 dark:hover:text-gray-300 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* FIN */}
          <div>
            <SectionHeader icon={Flag} label="Fin" expanded={openSection === 'fin'} onToggle={() => toggle('fin')} />
            <AnimatePresence initial={false}>
              {openSection === 'fin' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 pb-6">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                        Título de agradecimiento
                      </label>
                      <Input
                        value={survey.fin?.titulo || ''}
                        onChange={(e) => onUpdate({ ...survey, fin: { ...survey.fin, titulo: e.target.value } })}
                        placeholder="¡Gracias por tu opinión!"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                        Mensaje
                      </label>
                      <Input
                        value={survey.fin?.mensaje || ''}
                        onChange={(e) => onUpdate({ ...survey, fin: { ...survey.fin, mensaje: e.target.value } })}
                        placeholder="Tu feedback nos ayuda a mejorar cada día."
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: sticky preview */}
        <div className="hidden xl:flex flex-col items-center pt-2 sticky top-8 self-start">
          <AnimatePresence mode="wait">
            <motion.div
              key={openSection ?? 'none'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {preview}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// ─── Dashboard content ────────────────────────────────────────────────────────

const GLOBAL_STATS = [
  {
    label: 'Respuestas totales',
    value: '142',
    sub: '+23 este mes',
    icon: Users,
    color: 'text-violet-600',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
  },
  {
    label: 'NPS promedio',
    value: '72',
    sub: 'Promotores: 58%',
    icon: Star,
    color: 'text-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
  },
  {
    label: 'Completadas',
    value: '68%',
    sub: '97 de 142',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    label: 'Tiempo prom.',
    value: '1:42',
    sub: 'min por encuesta',
    icon: Clock,
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
]

export function EncuestasContent() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {GLOBAL_STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="border border-gray-100 dark:border-gray-800 shadow-sm">
              <CardContent className="p-5">
                <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-3', s.bg)}>
                  <s.icon className={cn('w-4.5 h-4.5', s.color)} />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-none mb-1">{s.value}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{s.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-gray-800">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Encuestas</p>
              <Link
                to="/encuesta/roadmap"
                className="text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Ver todas
              </Link>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-gray-800">
              {INITIAL_SURVEYS.map((survey) => (
                <div key={survey.id} className="flex items-center gap-4 px-5 py-3.5">
                  <span
                    className={cn(
                      'w-2 h-2 rounded-full flex-shrink-0',
                      survey.status === 'active' ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600',
                    )}
                  />
                  <p className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{survey.name}</p>
                  <span
                    className={cn(
                      'text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0',
                      survey.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
                    )}
                  >
                    {survey.status === 'active' ? 'Activa' : 'Borrador'}
                  </span>
                  <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>
                      <strong className="text-gray-800 dark:text-gray-200">{survey.stats.responses}</strong> resp.
                    </span>
                    <span>
                      NPS <strong className="text-gray-800 dark:text-gray-200">{survey.stats.nps ?? '—'}</strong>
                    </span>
                    <span>
                      <strong className="text-gray-800 dark:text-gray-200">
                        {survey.stats.completion > 0 ? `${survey.stats.completion}%` : '—'}
                      </strong>{' '}
                      completadas
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function EncuestaRoadmap() {
  const [surveys, setSurveys] = useState(INITIAL_SURVEYS)
  const [selectedId, setSelectedId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const selectedSurvey = surveys.find((s) => s.id === selectedId) ?? null
  const filtered = surveys.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const createSurvey = () => {
    const newS = {
      id: nextSurveyId++,
      name: `Nueva encuesta ${surveys.length + 1}`,
      description: '',
      color: '#6366F1',
      status: 'draft',
      stats: { responses: 0, nps: null, completion: 0 },
      premio: { ...DEFAULT_PREMIO },
      fin: { ...DEFAULT_FIN },
      questions: [],
    }
    setSurveys((prev) => [...prev, newS])
    setSelectedId(newS.id)
  }

  const updateSurvey = (updated) => setSurveys((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
  const deleteSurvey = (id) => setSurveys((prev) => prev.filter((s) => s.id !== id))
  const toggleActive = (id) =>
    setSurveys((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === 'active' ? 'draft' : 'active' } : s)),
    )

  if (selectedSurvey) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <SurveyBuilder survey={selectedSurvey} onBack={() => setSelectedId(null)} onUpdate={updateSurvey} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <ClipboardList className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                <h1 className="text-4xl font-bold leading-tight text-foreground">Encuestas</h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Conocé la opinión de tus clientes con preguntas de imagen y NPS.
              </p>
            </div>
            <Button
              size="lg"
              onClick={createSurvey}
              className="w-full md:w-fit bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black gap-2 shadow-md border-0"
            >
              <Plus className="w-5 h-5" />
              Nueva encuesta
            </Button>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar encuestas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl border-gray-200 dark:border-gray-700 focus:border-yellow-500"
            />
          </div>
        </motion.div>

        <div className="space-y-4">
          {filtered.map((survey) => (
            <SurveyListItem
              key={survey.id}
              survey={survey}
              onEdit={setSelectedId}
              onDelete={deleteSurvey}
              onToggleActive={toggleActive}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
