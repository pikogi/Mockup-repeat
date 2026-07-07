import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

const CARD_COLORS = ['#1B5E5A', '#4C1D95', '#92400E', '#064E3B', '#1E3A5F', '#831843', '#713F12', '#134E4A']

const SURVEY_QUESTIONS = [
  {
    id: 1,
    type: 'image',
    text: '¿Con quién nos visitaste hoy?',
    options: [
      { label: 'AMIGOS', emoji: '😊' },
      { label: 'FAMILIA', emoji: '👪' },
      { label: 'COMPAÑEROS', emoji: '👥' },
    ],
  },
  {
    id: 2,
    type: 'image',
    text: '¿Qué pediste hoy?',
    options: [
      { label: 'CAFÉ', emoji: '☕' },
      { label: 'SANDWICH', emoji: '🥪' },
      { label: 'POSTRE', emoji: '🍰' },
      { label: 'COMBO', emoji: '🎁' },
    ],
  },
  {
    id: 3,
    type: 'nps',
    text: '¿Cuánto nos recomendarías a un amigo?',
  },
  {
    id: 4,
    type: 'nps',
    text: '¿Cómo calificarías la atención del personal?',
  },
  {
    id: 5,
    type: 'text',
    text: '¿Hay algo que podríamos mejorar?',
  },
]

function npsColor(n) {
  if (n === null) return 'bg-gray-100 text-gray-600'
  if (n <= 6) return 'bg-red-500 text-white'
  if (n <= 8) return 'bg-amber-400 text-white'
  return 'bg-emerald-500 text-white'
}

export default function PublicEncuesta() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [completed, setCompleted] = useState(false)
  const [direction, setDirection] = useState(1)

  const question = SURVEY_QUESTIONS[currentIndex]
  const total = SURVEY_QUESTIONS.length
  const answer = answers[question?.id]
  const hasAnswer = answer !== undefined && answer !== null && answer !== ''

  const setAnswer = (value) => setAnswers((prev) => ({ ...prev, [question.id]: value }))

  const go = (delta) => {
    setDirection(delta)
    if (delta > 0) {
      if (currentIndex < total - 1) setCurrentIndex((i) => i + 1)
      else setCompleted(true)
    } else {
      if (currentIndex > 0) setCurrentIndex((i) => i - 1)
    }
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-10 text-center max-w-sm w-full shadow-xl"
        >
          <div className="text-6xl mb-5">🎉</div>
          <h2 className="text-xl font-black text-gray-900 mb-2">¡Gracias por tu opinión!</h2>
          <p className="text-gray-500 text-sm">Tu feedback nos ayuda a mejorar cada día.</p>
          <div className="mt-8">
            <span className="text-xs text-gray-400">Powered by </span>
            <span className="text-xs font-black text-gray-800">rep.eat</span>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl overflow-hidden max-w-sm w-full shadow-xl">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-5 pt-5 pb-3">
          <span className="text-sm text-gray-500 font-medium w-8 flex-shrink-0">
            {currentIndex + 1}/{total}
          </span>
          <div className="flex-1 h-0.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gray-800 rounded-full"
              initial={false}
              animate={{ width: `${((currentIndex + 1) / total) * 100}%` }}
              transition={{ duration: 0.35 }}
            />
          </div>
          <Info className="w-4 h-4 text-gray-300 flex-shrink-0" />
        </div>

        {/* Question */}
        <div className="px-6 pb-2 overflow-hidden min-h-[340px]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
              transition={{ duration: 0.22 }}
            >
              <h2 className="text-2xl font-black text-gray-900 text-center mb-8 leading-snug">{question.text}</h2>

              {/* Image options — square app-icon cards */}
              {question.type === 'image' && (
                <div className="grid grid-cols-2 gap-x-4 gap-y-5 justify-items-center">
                  {question.options.map((opt, i) => {
                    const isLast = i === question.options.length - 1 && question.options.length % 2 !== 0
                    return (
                      <button
                        key={opt.label}
                        onClick={() => setAnswer(opt.label)}
                        className={cn('flex flex-col items-center gap-2 transition-all', isLast && 'col-span-2')}
                      >
                        <div
                          className={cn(
                            'w-28 h-28 rounded-[28px] flex items-center justify-center transition-all shadow-sm',
                            answer === opt.label ? 'ring-4 ring-gray-800 ring-offset-2 scale-95' : 'hover:scale-95',
                          )}
                          style={{ backgroundColor: CARD_COLORS[i % CARD_COLORS.length] }}
                        >
                          <span className="text-5xl">{opt.emoji}</span>
                        </div>
                        <p className="text-xs font-bold text-gray-700 tracking-widest">{opt.label}</p>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* NPS */}
              {question.type === 'nps' && (
                <div className="space-y-3">
                  <div className="flex gap-1">
                    {Array.from({ length: 11 }, (_, i) => i).map((n) => (
                      <button
                        key={n}
                        onClick={() => setAnswer(n)}
                        className={cn(
                          'flex-1 aspect-square rounded-xl text-sm font-bold transition-all',
                          answer === n ? npsColor(n) : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
                        )}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-400">Nada probable</span>
                    <span className="text-xs text-gray-400">Muy probable</span>
                  </div>
                </div>
              )}

              {/* Text */}
              {question.type === 'text' && (
                <textarea
                  value={answer || ''}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Escribí tu respuesta..."
                  className="w-full border border-gray-200 rounded-2xl p-4 text-sm text-gray-700 placeholder-gray-300 resize-none h-28 focus:outline-none focus:border-gray-400"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="px-6 py-5 flex items-center gap-3">
          <button
            onClick={() => go(-1)}
            disabled={currentIndex === 0}
            className="w-11 h-11 border border-gray-300 rounded-xl flex items-center justify-center disabled:opacity-0 transition-colors hover:bg-gray-50 flex-shrink-0"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button
            onClick={() => go(1)}
            disabled={!hasAnswer}
            className="flex-1 h-11 bg-gray-800 text-white text-sm font-bold rounded-xl disabled:opacity-30 transition-all hover:bg-gray-700"
          >
            {currentIndex === total - 1 ? 'Enviar' : 'Siguiente'}
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 py-3 flex items-center justify-center gap-1.5">
          <span className="text-xs text-gray-400">Powered by</span>
          <span className="text-xs font-black text-gray-800">rep.eat</span>
        </div>
      </div>
    </div>
  )
}
