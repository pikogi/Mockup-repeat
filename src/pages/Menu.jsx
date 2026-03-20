import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { Card } from '@/components/ui/card'

const benefits = [
  {
    icon: '🛍️',
    title: 'Productos y servicios',
    desc: 'Mostrá todo lo que ofrecés en un solo lugar, ordenado y actualizado.',
  },
  {
    icon: '📱',
    title: 'Siempre actualizado',
    desc: 'Actualizá precios y disponibilidad en tiempo real desde tu panel.',
  },
  {
    icon: '🔗',
    title: 'Fácil de compartir',
    desc: 'Compartí tu catálogo con un link o código QR directo.',
  },
  {
    icon: '✨',
    title: 'Presentación visual',
    desc: 'Fotos, descripciones y precios en un diseño moderno y atractivo.',
  },
]

export default function Menu() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center shadow-lg">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
        </div>
        <div className="flex justify-center mb-3">
          <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800 px-3 py-1 text-sm font-medium rounded-full pointer-events-none select-none">
            Próximamente
          </span>
        </div>
        <h1 className="text-4xl font-bold leading-tight text-foreground mb-2">Menú / Catálogo</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Mostrá tus productos y servicios de forma digital</p>
      </motion.div>

      {/* ¿Qué es? */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">¿Qué es?</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            El Menú o Catálogo digital te permite mostrar todos tus productos o servicios de manera atractiva y
            organizada. Tus clientes podrán consultarlo desde su celular en cualquier momento, y vos podrás actualizarlo
            en tiempo real sin necesidad de imprimir nada nuevo.
          </p>
        </Card>
      </motion.div>

      {/* Beneficios */}
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

      {/* CTA */}
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
