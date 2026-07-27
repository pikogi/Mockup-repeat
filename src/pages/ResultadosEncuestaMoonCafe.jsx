import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, BarChart2, Star, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

const TOTAL = 142

const QUESTIONS = [
  {
    id: 1,
    text: '¿Cómo calificarías tu experiencia en general?',
    type: 'rating',
    avg: 4.8,
    responses: 142,
  },
  {
    id: 2,
    text: '¿Cómo fue la atención del personal?',
    type: 'text',
    responses: 97,
  },
  {
    id: 3,
    text: '¿Por dónde nos conociste?',
    type: 'multiple',
    responses: 142,
    options: [
      { label: 'Instagram', count: 74 },
      { label: 'Google', count: 38 },
      { label: 'Boca en boca', count: 22 },
      { label: 'Facebook', count: 8 },
    ],
  },
  {
    id: 4,
    text: '¿Volverías a visitarnos?',
    type: 'rating',
    avg: 4.9,
    responses: 142,
  },
]

const INDIVIDUAL_RESPONSES = [
  {
    id: 1,
    date: '22 jul 2026, 21:02',
    email: 'pedro@repeat.la',
    fields: { 'Nombre completo': 'Clau', Celular: '354357935', 'Fecha de cumpleaños': '2026-07-06', DNI: '36431271' },
    answers: {
      '¿Cómo calificarías tu experiencia en general?': '5 / 5',
      '¿Cómo fue la atención del personal?': 'Excelente trato!',
      '¿Por dónde nos conociste?': 'Instagram',
      '¿Volverías a visitarnos?': '5 / 5',
    },
  },
  {
    id: 2,
    date: '22 jul 2026, 20:55',
    email: null,
    fields: {
      'Nombre completo': 'Candelaria Scarafia',
      Celular: '35467278',
      'Fecha de cumpleaños': '2026-07-01',
      DNI: '14701947',
    },
    answers: {
      '¿Cómo calificarías tu experiencia en general?': '5 / 5',
      '¿Cómo fue la atención del personal?': 'Muy amables, volvería siempre.',
      '¿Por dónde nos conociste?': 'Instagram',
      '¿Volverías a visitarnos?': '5 / 5',
    },
  },
  {
    id: 3,
    date: '21 jul 2026, 14:30',
    email: 'valentina@gmail.com',
    fields: {
      'Nombre completo': 'Valentina Giménez',
      Celular: '351890234',
      'Fecha de cumpleaños': '1995-03-15',
      DNI: '29834512',
    },
    answers: {
      '¿Cómo calificarías tu experiencia en general?': '4 / 5',
      '¿Cómo fue la atención del personal?': 'Muy buena, aunque el café tardó un poco.',
      '¿Por dónde nos conociste?': 'Google',
      '¿Volverías a visitarnos?': '5 / 5',
    },
  },
]

function Stars({ value }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={cn(
            'w-5 h-5',
            s <= Math.round(value)
              ? 'text-amber-400 fill-amber-400'
              : 'text-gray-200 dark:text-gray-700 fill-gray-200 dark:fill-gray-700',
          )}
        />
      ))}
    </div>
  )
}

function QuestionCard({ q }) {
  const maxCount = q.type === 'multiple' ? Math.max(...q.options.map((o) => o.count)) : 0

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <p className="font-bold text-gray-900 dark:text-gray-100 text-[15px] leading-snug">{q.text}</p>
        <span className="text-sm text-gray-400 dark:text-gray-500 flex-shrink-0 mt-0.5">{q.responses} respuestas</span>
      </div>

      {q.type === 'rating' && (
        <div className="flex items-center gap-3">
          <span className="text-4xl font-black text-gray-900 dark:text-gray-100">{q.avg.toFixed(1)}</span>
          <Stars value={q.avg} />
        </div>
      )}

      {q.type === 'text' && (
        <p className="text-sm text-gray-400 dark:text-gray-500 italic">
          Ver respuestas de texto en la pestaña Respuestas.
        </p>
      )}

      {q.type === 'multiple' && (
        <div className="space-y-3">
          {q.options.map((opt) => {
            const pct = q.responses > 0 ? Math.round((opt.count / q.responses) * 100) : 0
            return (
              <div key={opt.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-700 dark:text-gray-300">{opt.label}</span>
                  <span className="text-gray-400 dark:text-gray-500">
                    {opt.count} · {pct}%
                  </span>
                </div>
                <div className="h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: maxCount > 0 ? `${(opt.count / maxCount) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function ResultadosEncuestaMoonCafe() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('resumen')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back */}
        <button
          onClick={() => navigate('/encuesta/mooncafe-demo')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors mb-5"
        >
          <ArrowLeft className="w-4 h-4" />
          Encuestas de Satisfacción
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <BarChart2 className="w-7 h-7 text-gray-800 dark:text-gray-200 flex-shrink-0" />
          <h1 className="text-2xl font-black text-gray-900 dark:text-gray-100 leading-tight">
            Moon Cafe Queremos conocer tu opinión :)
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit">
          {[
            { id: 'resumen', label: 'Resumen' },
            { id: 'respuestas', label: 'Respuestas' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
                tab === t.id
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'resumen' && (
          <div className="space-y-4">
            {/* Total responses */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-1">Respuestas totales</p>
              <p className="text-4xl font-black text-gray-900 dark:text-gray-100">{TOTAL}</p>
            </div>

            {/* Per-question cards */}
            {QUESTIONS.map((q) => (
              <QuestionCard key={q.id} q={q} />
            ))}
          </div>
        )}

        {tab === 'respuestas' && (
          <div className="space-y-4">
            {INDIVIDUAL_RESPONSES.map((r) => (
              <div
                key={r.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl px-5 py-4"
              >
                {/* Header: date + email */}
                <div className="flex items-center gap-3 mb-4 text-sm text-gray-400 dark:text-gray-500">
                  <span>{r.date}</span>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{r.email ?? 'Anónimo'}</span>
                  </div>
                </div>

                {/* Personal fields */}
                <div className="space-y-1 mb-4">
                  {Object.entries(r.fields).map(([label, value]) => (
                    <p key={label} className="text-sm text-gray-600 dark:text-gray-400">
                      {label}: <span className="font-semibold text-gray-900 dark:text-gray-100">{value}</span>
                    </p>
                  ))}
                </div>

                {/* Question answers */}
                <div className="space-y-1">
                  {Object.entries(r.answers).map(([label, value]) => (
                    <p key={label} className="text-sm text-gray-600 dark:text-gray-400">
                      {label}: <span className="font-semibold text-gray-900 dark:text-gray-100">{value}</span>
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
