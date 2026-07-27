import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ImagePlus, Plus, ChevronUp, ChevronDown, Trash2, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

const QUESTION_TYPES = [
  { value: 'rating', label: 'Calificación (1-5 estrellas)' },
  { value: 'nps', label: 'NPS (0-10)' },
  { value: 'text', label: 'Texto libre' },
  { value: 'multiple', label: 'Selección múltiple' },
  { value: 'yesno', label: 'Sí / No' },
]

const CTA_TYPES = [
  { value: 'google', label: 'Reseña en Google' },
  { value: 'club', label: 'Unirse al club' },
  { value: 'custom', label: 'Personalizado' },
]

const INITIAL_FORM = {
  titulo: 'Queremos conocer tu opinión',
  descripcion: 'Encuesta post-visita para conocer la experiencia de nuestros clientes.',
  slug: 'moon-cafe-queremos-conocer-tu-opinion',
  color: '#1a4a2e',
  activa: true,
  pedirSucursal: false,
  respuestasMultiples: false,
  portadaTitulo: '¡Hola! Gracias por visitarnos 👋',
  portadaTexto: 'Tu opinión nos ayuda a mejorar cada día. Solo te llevará 1 minuto.',
  preguntas: [
    { id: 1, texto: '¿Cómo calificarías tu experiencia en general?', tipo: 'rating', obligatoria: true },
    { id: 2, texto: '¿Cómo fue la atención del personal?', tipo: 'rating', obligatoria: true },
    { id: 3, texto: '¿Volverías a visitarnos?', tipo: 'yesno', obligatoria: false },
    { id: 4, texto: '¿Tienes algún comentario adicional?', tipo: 'text', obligatoria: false },
  ],
  pedirNombre: false,
  pedirTelefono: false,
  pedirNacimiento: false,
  registrarMiembros: false,
  recompensa: 'none',
  cierreTitulo: '¡Muchas gracias! ☕',
  cierreTexto: 'Tu opinión es muy valiosa para el equipo de Moon Cafe.',
  ctas: [{ id: 1, tipo: 'google', url: '' }],
}

function Section({ title, description, children }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
        {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  )
}

function Field({ label, helper, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</label>
      {children}
      {helper && <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{helper}</p>}
    </div>
  )
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
        {description && <p className="text-sm text-gray-500 dark:text-gray-400 leading-snug">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} className="flex-shrink-0 mt-0.5" />
    </div>
  )
}

export default function CrearEncuestaMoonCafe() {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  let nextId = 10

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const updatePregunta = (id, field, value) =>
    set(
      'preguntas',
      form.preguntas.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    )

  const movePregunta = (idx, dir) => {
    const arr = [...form.preguntas]
    const target = idx + dir
    if (target < 0 || target >= arr.length) return
    ;[arr[idx], arr[target]] = [arr[target], arr[idx]]
    set('preguntas', arr)
  }

  const removePregunta = (id) =>
    set(
      'preguntas',
      form.preguntas.filter((p) => p.id !== id),
    )

  const addPregunta = () => {
    const newId = nextId++
    set('preguntas', [...form.preguntas, { id: newId, texto: '', tipo: 'rating', obligatoria: true }])
  }

  const updateCta = (id, field, value) =>
    set(
      'ctas',
      form.ctas.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    )

  const removeCta = (id) =>
    set(
      'ctas',
      form.ctas.filter((c) => c.id !== id),
    )

  const addCta = () => {
    const newId = (Math.max(...form.ctas.map((c) => c.id), 0) || 0) + 1
    set('ctas', [...form.ctas, { id: newId, tipo: 'custom', url: '' }])
  }

  const handleSave = () => {
    toast.success('Encuesta guardada correctamente.')
    navigate('/encuesta/mooncafe-demo')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-28">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back + title */}
        <button
          onClick={() => navigate('/encuesta/mooncafe-demo')}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors mb-5"
        >
          <ArrowLeft className="w-4 h-4" />
          Encuestas de Satisfacción
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-7">Crear encuesta</h1>

        <div className="space-y-5">
          {/* ── 1. Datos de la encuesta ── */}
          <Section title="Datos de la encuesta">
            <Field label="Título *">
              <div className="flex items-stretch border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden focus-within:border-gray-400 transition-colors">
                <span className="flex items-center px-3 bg-gray-100 dark:bg-gray-800 text-sm text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
                  Moon Cafe
                </span>
                <input
                  type="text"
                  value={form.titulo}
                  onChange={(e) => set('titulo', e.target.value)}
                  placeholder="Ej: ¿Cómo fue tu experiencia?"
                  className="flex-1 px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none min-w-0"
                />
              </div>
            </Field>

            <Field label="Descripción">
              <textarea
                value={form.descripcion}
                onChange={(e) => set('descripcion', e.target.value)}
                placeholder="Descripción interna u objetivo de la encuesta (opcional)"
                rows={3}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none resize-y focus:border-gray-400 transition-colors"
              />
            </Field>

            <Field
              label="Link público (slug)"
              helper="Se genera automáticamente a partir del título. Si ya está en uso, se le agrega un número."
            >
              <Input value={form.slug} readOnly className="bg-gray-50 dark:bg-gray-800 text-gray-400 cursor-default" />
            </Field>

            <Field
              label="Color de acento"
              helper="Se aplica a los botones y elementos destacados de la encuesta pública."
            >
              <input
                type="color"
                value={form.color}
                onChange={(e) => set('color', e.target.value)}
                className="w-14 h-10 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer p-1 bg-white dark:bg-gray-900"
              />
            </Field>

            <ToggleRow
              label="Encuesta activa"
              description="Si está inactiva, el link público deja de funcionar."
              checked={form.activa}
              onChange={(v) => set('activa', v)}
            />
            <ToggleRow
              label="Pedir sucursal"
              description="El cliente deberá elegir en qué sucursal fue atendido."
              checked={form.pedirSucursal}
              onChange={(v) => set('pedirSucursal', v)}
            />
            <ToggleRow
              label="Permitir respuestas múltiples"
              description="Un mismo email podrá responder la encuesta más de una vez."
              checked={form.respuestasMultiples}
              onChange={(v) => set('respuestasMultiples', v)}
            />
          </Section>

          {/* ── 2. Portada ── */}
          <Section title="Portada" description="Lo primero que ve el cliente al abrir la encuesta.">
            <button className="w-full border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center py-8 gap-2 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
              <ImagePlus className="w-6 h-6 text-gray-400" />
              <span className="text-sm text-gray-400">Subir imagen</span>
            </button>
            <Field label="Título de portada">
              <Input value={form.portadaTitulo} onChange={(e) => set('portadaTitulo', e.target.value)} />
            </Field>
            <Field label="Texto de portada">
              <textarea
                value={form.portadaTexto}
                onChange={(e) => set('portadaTexto', e.target.value)}
                rows={3}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none resize-y focus:border-gray-400 transition-colors"
              />
            </Field>
          </Section>

          {/* ── 3. Preguntas ── */}
          <Section title="Preguntas">
            <div className="space-y-3">
              {form.preguntas.map((p, idx) => (
                <div key={p.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                      #{idx + 1}
                    </span>
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => movePregunta(idx, -1)}
                        className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => movePregunta(idx, 1)}
                        className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removePregunta(p.id)}
                        className="p-1.5 rounded text-red-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      value={p.texto}
                      onChange={(e) => updatePregunta(p.id, 'texto', e.target.value)}
                      placeholder="Ej: ¿Cómo calificarías la atención?"
                      className="flex-1"
                    />
                    <select
                      value={p.tipo}
                      onChange={(e) => updatePregunta(p.id, 'tipo', e.target.value)}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 outline-none cursor-pointer sm:flex-shrink-0"
                    >
                      {QUESTION_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={p.obligatoria} onCheckedChange={(v) => updatePregunta(p.id, 'obligatoria', v)} />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Obligatoria</span>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={addPregunta}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 border border-dashed border-gray-200 dark:border-gray-700 hover:border-gray-400 rounded-xl px-4 py-2.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              Agregar pregunta
            </button>
          </Section>

          {/* ── 4. Datos del encuestado ── */}
          <Section
            title="Datos del encuestado"
            description="Pedile datos a quien responde antes de enviar. Los campos activados son obligatorios."
          >
            <ToggleRow
              label="Pedir nombre"
              description="El encuestado deberá ingresar su nombre completo."
              checked={form.pedirNombre}
              onChange={(v) => set('pedirNombre', v)}
            />
            <ToggleRow
              label="Pedir teléfono"
              description="El encuestado deberá ingresar su número de celular."
              checked={form.pedirTelefono}
              onChange={(v) => set('pedirTelefono', v)}
            />
            <ToggleRow
              label="Pedir fecha de nacimiento"
              description="El encuestado deberá ingresar su fecha de nacimiento."
              checked={form.pedirNacimiento}
              onChange={(v) => set('pedirNacimiento', v)}
            />

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Campos personalizados</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Hasta 10 campos de texto propios (ej: número de socio). El identificador se genera desde la etiqueta.
              </p>
              <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 border border-dashed border-gray-200 dark:border-gray-700 hover:border-gray-400 rounded-xl px-4 py-2 transition-all">
                <Plus className="w-4 h-4" />
                Agregar campo
              </button>
            </div>

            <ToggleRow
              label="Registrar como miembros"
              description="Si el email de quien responde no existe todavía, se lo crea como miembro de la marca con sus datos. Requiere pedir el nombre (se activa automáticamente)."
              checked={form.registrarMiembros}
              onChange={(v) => set('registrarMiembros', v)}
            />
          </Section>

          {/* ── 5. Recompensa ── */}
          <Section
            title="Recompensa"
            description="Vincula un programa de cupones como premio por completar la encuesta."
          >
            <Field
              label="Cupón de recompensa"
              helper="El cupón se crea y gestiona como un programa de tipo cupón en Mis Programas."
            >
              <select
                value={form.recompensa}
                onChange={(e) => set('recompensa', e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 outline-none cursor-pointer"
              >
                <option value="none">Sin recompensa</option>
                <option value="cupon">Seleccionar cupón...</option>
              </select>
            </Field>
            <div className="space-y-1.5">
              <button
                onClick={() => toast('Guarda la encuesta antes de crear el cupón.')}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="text-base">🎟</span>
                Crear cupón
              </button>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Guarda la encuesta antes: crear el cupón abandona este formulario.
              </p>
            </div>
          </Section>

          {/* ── 6. Pantalla de cierre ── */}
          <Section title="Pantalla de cierre" description="Lo que ve el cliente después de enviar sus respuestas.">
            <Field label="Título de cierre">
              <Input value={form.cierreTitulo} onChange={(e) => set('cierreTitulo', e.target.value)} />
            </Field>
            <Field label="Texto de cierre">
              <textarea
                value={form.cierreTexto}
                onChange={(e) => set('cierreTexto', e.target.value)}
                rows={3}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none resize-y focus:border-gray-400 transition-colors"
              />
            </Field>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Botones (CTAs)</p>
              <div className="space-y-2">
                {form.ctas.map((cta) => (
                  <div
                    key={cta.id}
                    className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-xl p-3"
                  >
                    <select
                      value={cta.tipo}
                      onChange={(e) => updateCta(cta.id, 'tipo', e.target.value)}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 outline-none cursor-pointer flex-shrink-0"
                    >
                      {CTA_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <Input
                      value={cta.url}
                      onChange={(e) => updateCta(cta.id, 'url', e.target.value)}
                      placeholder={cta.tipo === 'google' ? 'Link de tu reseña en Google...' : 'URL...'}
                      className="flex-1 min-w-0"
                    />
                    <button
                      onClick={() => removeCta(cta.id)}
                      className="p-1.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addCta}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 border border-dashed border-gray-200 dark:border-gray-700 hover:border-gray-400 rounded-xl px-4 py-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                Agregar CTA
              </button>
            </div>
          </Section>
        </div>
      </div>

      {/* Sticky save */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 z-30">
        <button
          onClick={handleSave}
          className="w-full py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-base transition-colors"
        >
          Guardar encuesta
        </button>
      </div>
    </div>
  )
}
