import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Star, Check, CheckCircle2, Circle, Gift } from 'lucide-react'
import { cn } from '@/lib/utils'

const QUESTIONS = [
  { id: 1, type: 'rating', text: '¿Cómo calificarías tu experiencia en general?', required: true },
  { id: 2, type: 'text', text: '¿Cómo fue la atención del personal?', required: false },
  {
    id: 3,
    type: 'multiple',
    text: '¿Por dónde nos conociste?',
    options: ['Instagram', 'Facebook', 'Google', 'Boca en boca'],
    required: true,
  },
  { id: 4, type: 'rating', text: '¿Volverías a visitarnos?', required: true },
]

const Q_TOTAL = QUESTIONS.length

const DOTTED_BG = {
  backgroundColor: '#f3f4f6',
  backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
  backgroundSize: '20px 20px',
}

function TopBar() {
  return (
    <div className="bg-gray-900 px-4 py-3 flex items-center gap-3 flex-shrink-0">
      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-800 border border-gray-700">
        <img src="/moon-cafe-logo.png" alt="Moon Cafe" className="w-full h-full object-cover" />
      </div>
      <div>
        <p className="text-white font-bold text-sm leading-tight">Moon Cafe</p>
        <p className="text-gray-400 text-xs">Encuesta</p>
      </div>
    </div>
  )
}

function ProgressBar({ step }) {
  const pct = Math.min((step / Q_TOTAL) * 100, 100)
  return (
    <div className="h-1.5 bg-gray-200 flex-shrink-0">
      <motion.div
        className="h-full bg-amber-400"
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.35 }}
      />
    </div>
  )
}

function Footer() {
  return (
    <p className="text-center text-[11px] text-gray-400 py-2">
      Powered by <span className="font-black text-gray-600">Repeat.la</span>
    </p>
  )
}

function StarRating({ value, onChange }) {
  const [hover, setHover] = useState(null)
  const display = hover ?? value ?? 0
  return (
    <div className="flex gap-2 mt-4">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(null)}
          onClick={() => onChange(s)}
          className="transition-transform hover:scale-110 active:scale-95"
        >
          <Star
            className={cn(
              'w-9 h-9 transition-colors',
              display >= s ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200',
            )}
          />
        </button>
      ))}
    </div>
  )
}

function MultipleChoice({ options, value, onChange }) {
  return (
    <div className="space-y-2 mt-4">
      {options.map((opt) => {
        const selected = value === opt
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={cn(
              'w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all',
              selected ? 'bg-amber-50 border-amber-400 text-gray-900' : 'bg-white border-gray-200 text-gray-700',
            )}
          >
            <span>{opt}</span>
            {selected ? (
              <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
            ) : (
              <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
            )}
          </button>
        )
      })}
    </div>
  )
}

function FieldInput({ label, required, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-800">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls =
  'w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 bg-white outline-none focus:border-amber-400 transition-colors'

export default function PublicEncuestaMoonCafe() {
  // step: 0=cover, 1-4=questions, 5=datos, 6=done
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [direction, setDirection] = useState(1)
  const [datos, setDatos] = useState({ nombre: '', celular: '', nacimiento: '', dni: '', email: '' })

  const qIndex = step - 1
  const question = QUESTIONS[qIndex]
  const answer = question ? answers[question.id] : undefined
  const hasAnswer = answer !== undefined && answer !== null && answer !== ''
  const canContinue = question ? !question.required || hasAnswer : true

  const setAnswer = (val) => question && setAnswers((p) => ({ ...p, [question.id]: val }))
  const setDato = (field, val) => setDatos((p) => ({ ...p, [field]: val }))

  const canSubmit = datos.nombre.trim() && datos.celular.trim() && datos.nacimiento && datos.dni.trim()

  const go = (delta) => {
    setDirection(delta)
    setStep((s) => {
      if (delta > 0) {
        if (s === 0) return 1
        if (s < Q_TOTAL) return s + 1
        if (s === Q_TOTAL) return Q_TOTAL + 1 // datos
        return Q_TOTAL + 2 // done
      } else {
        return Math.max(0, s - 1)
      }
    })
  }

  // ── Done ───────────────────────────────────────────────────────
  if (step === Q_TOTAL + 2) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar />
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12" style={DOTTED_BG}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xs text-center"
          >
            {/* Green check circle */}
            <div className="flex justify-center mb-5">
              <div className="w-12 h-12 rounded-full border-2 border-emerald-500 bg-white flex items-center justify-center">
                <Check className="w-6 h-6 text-emerald-500" strokeWidth={2.5} />
              </div>
            </div>

            <h2 className="text-3xl font-black text-gray-900 leading-tight mb-2">Gracias por tus comentarios</h2>
            <p className="text-sm text-gray-500 mb-8">Si quieres ayudarnos aún más, deja un comentario en Google :)</p>

            <a
              href="https://g.page/r/mooncafe/review"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-black font-bold text-sm transition-colors"
            >
              <span>⭐</span> Deja tu reseña en Google
            </a>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  // ── Cover ───────────────────────────────────────────────────────
  if (step === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar />
        <div className="flex-1 flex flex-col items-center justify-center px-5 py-8 gap-5" style={DOTTED_BG}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-xs space-y-5"
          >
            <div className="text-center space-y-1.5">
              <h1 className="text-2xl font-black text-gray-900">Comparte tu opinión :)</h1>
              <p className="text-sm text-gray-500">Completa esta encuesta y gana un 2x1 en Cafe</p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden aspect-[4/3] flex items-center justify-center p-8">
              <img src="/moon-cafe-logo.png" alt="Moon Cafe" className="w-full h-full object-contain" />
            </div>

            <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-3 shadow-sm">
              <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-900 flex items-center justify-center">
                <img src="/moon-cafe-logo.png" alt="" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-xs text-amber-500 font-semibold">Completa y llévate:</p>
                <p className="text-sm font-bold text-gray-900">2x1 en cafe</p>
              </div>
            </div>

            <button
              onClick={() => go(1)}
              className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-black font-bold text-base transition-colors shadow-md"
            >
              Empezar
            </button>
          </motion.div>
        </div>
        <Footer />
      </div>
    )
  }

  // ── Tus datos ──────────────────────────────────────────────────
  if (step === Q_TOTAL + 1) {
    return (
      <div className="min-h-screen flex flex-col">
        <TopBar />
        <ProgressBar step={Q_TOTAL} />
        <div className="flex-1 overflow-y-auto px-5 py-7 space-y-4" style={DOTTED_BG}>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Tus datos</h2>

          <FieldInput label="Nombre completo" required>
            <input
              type="text"
              value={datos.nombre}
              onChange={(e) => setDato('nombre', e.target.value)}
              className={inputCls}
            />
          </FieldInput>

          <FieldInput label="Celular" required>
            <input
              type="tel"
              value={datos.celular}
              onChange={(e) => setDato('celular', e.target.value)}
              placeholder="+54 11 1234-5678"
              className={inputCls}
            />
          </FieldInput>

          <FieldInput label="Fecha de cumpleaños" required>
            <input
              type="date"
              value={datos.nacimiento}
              onChange={(e) => setDato('nacimiento', e.target.value)}
              className={inputCls}
            />
          </FieldInput>

          <FieldInput label="DNI" required>
            <input
              type="text"
              value={datos.dni}
              onChange={(e) => setDato('dni', e.target.value)}
              className={inputCls}
            />
          </FieldInput>

          {/* Optional email */}
          <div className="pt-1 space-y-3">
            <div>
              <p className="text-xs text-amber-500 font-semibold">Opcional</p>
              <p className="text-xs text-gray-500">Lo usamos para vincular tu respuesta.</p>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-700">
              <Gift className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <span>Deja tu email y te llevas la recompensa de esta encuesta.</span>
            </div>
            <input
              type="email"
              value={datos.email}
              onChange={(e) => setDato('email', e.target.value)}
              placeholder="tu@email.com"
              className={inputCls}
            />
          </div>
        </div>

        <div className="bg-white flex-shrink-0 px-5 pt-3 pb-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => go(-1)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex-shrink-0"
            >
              <ChevronLeft className="w-4 h-4" />
              Atrás
            </button>
            <button
              onClick={() => go(1)}
              disabled={!canSubmit}
              className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-black text-sm font-bold transition-all disabled:opacity-40"
            >
              Enviar
            </button>
          </div>
          <Footer />
        </div>
      </div>
    )
  }

  // ── Question ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <ProgressBar step={step} />

      <div className="flex-1 flex flex-col justify-center px-5 py-8 overflow-hidden" style={DOTTED_BG}>
        <p className="text-sm text-gray-400 mb-3 font-medium">
          {step} / {Q_TOTAL}
        </p>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-md p-5">
              <p className="text-[15px] font-semibold text-gray-900 leading-snug">
                {question.text}
                {question.required && <span className="text-red-500 ml-0.5">*</span>}
              </p>

              {question.type === 'rating' && <StarRating value={answer} onChange={setAnswer} />}

              {question.type === 'text' && (
                <textarea
                  value={answer || ''}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Escribe tu respuesta..."
                  rows={4}
                  className="mt-4 w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 placeholder-gray-300 resize-none focus:outline-none focus:border-amber-300"
                />
              )}

              {question.type === 'multiple' && (
                <MultipleChoice options={question.options} value={answer} onChange={setAnswer} />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="bg-white flex-shrink-0 px-5 pt-3 pb-1">
        <div className="flex items-center gap-3">
          <button
            onClick={() => go(-1)}
            disabled={step === 1}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex-shrink-0 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
            Atrás
          </button>
          <button
            onClick={() => go(1)}
            disabled={!canContinue}
            className="flex-1 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-black text-sm font-bold transition-all disabled:opacity-40"
          >
            Continuar
          </button>
        </div>
        <Footer />
      </div>
    </div>
  )
}
