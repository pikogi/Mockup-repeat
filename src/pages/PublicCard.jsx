import { useEffect, useState } from 'react'
import { api } from '@/api/client'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Apple, Smartphone, Share2, CheckCircle, Mail, Phone, Globe, Loader2, Gift, ChevronDown } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { useDeviceDetection } from '@/hooks/useDeviceDetection'

const DEMO_PROGRAMS = {
  mooncafe: {
    card_color: '#1a4a2e',
    foreground_color: '#ffffff',
    club_name: 'The Club',
    card_title: 'The Club',
    description: 'café moon',
    logo_url: '/moon-cafe-logo.png',
    welcome_text: '¡Bienvenido a nuestro Club de Fidelidad!',
    reward_text: 'Cada 5 cafés, 1 GRATIS ☕',
    stamps_required: 5,
    collect_name: true,
    collect_email: true,
    collect_phone: false,
    collect_birthday: false,
    is_active: true,
    terms: `Al registrarte en este programa de fidelidad aceptás los Términos y Condiciones de Repeat (repeat.la).\n\n• Repeat es la plataforma tecnológica que gestiona el programa. Los beneficios son definidos y otorgados por el comercio.\n• Tus datos personales serán utilizados exclusivamente para administrar tu membresía.\n• Los sellos y recompensas no son transferibles ni canjeables por dinero.\n• El comercio puede modificar los beneficios con previo aviso.\n• Podés solicitar la baja de tu cuenta en cualquier momento escribiendo a hola@repeat.la.`,
    contact_email: '',
    contact_phone: '',
    website: 'cafemoon.com.ar',
  },
  'mooncafe-points': {
    card_color: '#1a4a2e',
    foreground_color: '#ffffff',
    club_name: 'Club de Puntos Moon Cafe',
    card_title: 'Club de Puntos Moon Cafe',
    description: 'café moon',
    logo_url: '/moon-cafe-logo.png',
    welcome_text: '¡Bienvenido al Club de Puntos!',
    reward_text: 'Junta 100 puntos y canjealos por un desayuno 💚',
    stamps_required: 100,
    collect_name: true,
    collect_email: true,
    collect_phone: false,
    collect_birthday: false,
    is_active: true,
    terms: `Al registrarte en este programa de fidelidad aceptás los Términos y Condiciones de Repeat (repeat.la).\n\n• Repeat es la plataforma tecnológica que gestiona el programa. Los beneficios son definidos y otorgados por el comercio.\n• Tus datos personales serán utilizados exclusivamente para administrar tu membresía.\n• Los puntos no son transferibles ni canjeables por dinero.\n• El comercio puede modificar los beneficios con previo aviso.\n• Podés solicitar la baja de tu cuenta en cualquier momento escribiendo a hola@repeat.la.`,
    contact_email: '',
    contact_phone: '',
    website: 'cafemoon.com.ar',
  },
  glow: {
    card_color: '#2d0a3e',
    foreground_color: '#ffffff',
    club_name: 'Club de Fidelidad Glow',
    card_title: 'Club de Fidelidad Glow',
    description: 'glow estética',
    logo_url: null,
    welcome_text: '¡Bienvenida al Club de Fidelidad Glow!',
    reward_text: 'Completá 8 visitas y ganás una sesión de lifting facial gratis ✨',
    stamps_required: 8,
    collect_name: true,
    collect_email: true,
    collect_phone: false,
    collect_birthday: false,
    is_active: true,
    terms: `Club de Fidelidad Glow es el programa de fidelización de Glow Estética. Al registrarte aceptás los siguientes términos:\n\n• Por cada visita acumulás 1 sello.\n• Al completar 8 sellos obtenés una sesión de lifting facial gratis.\n• Los sellos no son transferibles ni canjeables por dinero.\n• Glow Estética se reserva el derecho de modificar los beneficios con previo aviso.\n• La membresía es personal e intransferible.`,
    contact_email: '',
    contact_phone: '',
    website: 'glowstetica.com.ar',
  },
  'glow-points': {
    card_color: '#2d0a3e',
    foreground_color: '#ffffff',
    club_name: 'Club de Puntos Glow',
    card_title: 'Club de Puntos Glow',
    description: 'glow estética',
    logo_url: null,
    welcome_text: '¡Bienvenida al Club de Puntos Glow!',
    reward_text: 'Juntá 150 puntos y canjeálos por un tratamiento de hidratación profunda ✨',
    stamps_required: 150,
    collect_name: true,
    collect_email: true,
    collect_phone: false,
    collect_birthday: false,
    is_active: true,
    terms: `Club de Puntos Glow es el programa de fidelización de Glow Estética. Al registrarte aceptás los siguientes términos:\n\n• Por cada visita acumulás puntos según el servicio.\n• Al llegar a 150 puntos obtenés un tratamiento de hidratación profunda gratis.\n• Los puntos no son transferibles ni canjeables por dinero.\n• Glow Estética se reserva el derecho de modificar los beneficios con previo aviso.\n• La membresía es personal e intransferible.`,
    contact_email: '',
    contact_phone: '',
    website: 'glowstetica.com.ar',
  },
  'del-pilar': {
    card_color: '#eab308',
    foreground_color: '#000000',
    club_name: 'Club Del Pilar',
    card_title: 'Club Del Pilar',
    description: 'del pilar panadería',
    logo_url: '/del-pilar-logo.jpg',
    welcome_text: '¡Bienvenido al Club Del Pilar!',
    reward_text: 'Completá 5 compras y ganás una docena de facturas gratis 🥐',
    stamps_required: 5,
    collect_name: true,
    collect_email: true,
    collect_phone: false,
    collect_birthday: false,
    is_active: true,
    terms: `Club Del Pilar es el programa de fidelidad de Panadería Del Pilar. Al registrarte aceptás los siguientes términos:\n\n• Por cada compra acumulás 1 sello.\n• Al completar 5 sellos obtenés una docena de facturas gratis.\n• Los sellos no son transferibles ni canjeables por dinero.\n• Del Pilar se reserva el derecho de modificar los beneficios con previo aviso.\n• La membresía es personal e intransferible.`,
    contact_email: '',
    contact_phone: '',
    website: 'delpilarpan.com.ar',
  },
  'del-pilar-points': {
    card_color: '#eab308',
    foreground_color: '#000000',
    club_name: 'Club de Puntos Del Pilar',
    card_title: 'Club de Puntos Del Pilar',
    description: 'del pilar panadería',
    logo_url: '/del-pilar-logo.jpg',
    welcome_text: '¡Bienvenido al Club de Puntos Del Pilar!',
    reward_text: 'Juntá 100 puntos y canjeálos por un desayuno completo 🥐',
    stamps_required: 100,
    collect_name: true,
    collect_email: true,
    collect_phone: false,
    collect_birthday: false,
    is_active: true,
    terms: `Club de Puntos Del Pilar es el programa de fidelidad de Panadería Del Pilar. Al registrarte aceptás los siguientes términos:\n\n• Por cada compra acumulás puntos según el monto gastado.\n• Al llegar a 100 puntos obtenés un desayuno completo gratis.\n• Los puntos no son transferibles ni canjeables por dinero.\n• Del Pilar se reserva el derecho de modificar los beneficios con previo aviso.\n• La membresía es personal e intransferible.`,
    contact_email: '',
    contact_phone: '',
    website: 'delpilarpan.com.ar',
  },
  leroma: {
    card_color: '#111111',
    foreground_color: '#ffffff',
    club_name: 'Círculo Leroma',
    card_title: 'Círculo Leroma',
    description: 'il momento felice',
    logo_url: '/leroma-logo.jpg',
    reward_text: 'Experiencias exclusivas Leroma',
    stamps_required: 10,
    collect_name: true,
    collect_email: true,
    collect_phone: true,
    collect_birthday: true,
    is_active: true,
    terms: `Círculo Leroma es el programa de fidelidad de Leroma. Al registrarte aceptás los siguientes términos:\n\n• Los puntos se acumulan con cada compra en locales adheridos.\n• Los puntos no son transferibles ni canjeables por dinero.\n• Leroma se reserva el derecho de modificar los beneficios con previo aviso.\n• La membresía es personal e intransferible.\n• Los niveles se calculan según los puntos acumulados en el período vigente.\n• Las experiencias tienen disponibilidad limitada y sujeta a reserva previa.`,
    contact_email: '',
    contact_phone: '',
    website: 'leroma.com.ar',
  },
}

export default function PublicCard() {
  const urlParams = new URLSearchParams(window.location.search)
  const cardId = urlParams.get('id') // Este es el program_id
  const brandIdFromUrl = urlParams.get('brand_id')
  const demoParam = urlParams.get('demo')

  const [pageLoadTs] = useState(() => Date.now())
  const [added, setAdded] = useState(false)
  const [, setCustomerCardId] = useState(null) // ID de la tarjeta del cliente
  const [showSignUp, setShowSignUp] = useState(() => urlParams.get('showform') === '1')
  const [signupData, setSignupData] = useState({ name: '', email: '', phone: '', birthday: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [walletType, setWalletType] = useState(null)
  const [customerData, setCustomerData] = useState(null) // Datos de la tarjeta del cliente
  const [termsOpen, setTermsOpen] = useState(false)

  // Detectar sistema operativo usando el hook
  const { preferredWallet, isMobile } = useDeviceDetection()

  // Obtener datos de la marca (para el logo) — brand_id puede venir de la URL o del programa
  const [brandIdFromProgram, setBrandIdFromProgram] = useState(null)

  // Obtener programa de lealtad directamente por ID (endpoint público)
  const {
    data: program,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['publicProgram', cardId],
    queryFn: async () => {
      if (!cardId) {
        console.log('[PublicCard] Falta cardId (program_id)')
        return null
      }

      console.log('[PublicCard] Obteniendo programa:', { cardId })

      try {
        // Obtener programa directamente por ID usando endpoint público
        const res = await api.loyaltyPrograms.getPublic(cardId)
        const programData = res?.data || res
        console.log('[PublicCard] Programa recibido:', {
          program_id: programData?.program_id,
          program_name: programData?.program_name,
          wallet_design: programData?.wallet_design,
          images: programData?.images,
          metadata: programData?.metadata,
          program_rules: programData?.program_rules,
        })
        return programData
      } catch (err) {
        console.error('[PublicCard] Error al obtener programa:', err)
        throw err
      }
    },
    enabled: !!cardId && !demoParam,
    retry: false,
  })

  const brandId = brandIdFromUrl || program?.brand_id || brandIdFromProgram

  // Extraer brand_id del programa si no vino en la URL
  useEffect(() => {
    if (program?.brand_id && !brandIdFromUrl) {
      setBrandIdFromProgram(program.brand_id)
    }
  }, [program, brandIdFromUrl])

  // Pre-cargar el logo en cuanto lleguen los datos del programa
  useEffect(() => {
    const logoUrl = program?.brand?.logo_url || program?.images?.logo || program?.wallet_design?.logo_url
    if (logoUrl) {
      const img = new Image()
      img.src = logoUrl
    }
  }, [program])

  console.log('[PublicCard] Programa encontrado:', {
    cardId,
    found: !!program,
    programName: program?.program_name,
  })

  // Cache-buster por sesión: la URL del logo en S3 es determinista, solo cambia el contenido.
  // Usamos updated_at si el backend lo provee; si no, el timestamp de carga de página.
  const logoCacheBuster = (() => {
    const storedVersion = brandId ? localStorage.getItem(`brand_logo_version_${brandId}`) : null
    return storedVersion ? Number(storedVersion) : pageLoadTs
  })()
  const addCacheBuster = (url) => {
    if (!url || url.startsWith('data:')) return url
    const cleanUrl = url.replace(/([?&])v=[^&]*(&|$)/, (_, pre, post) => (post === '&' ? pre : '')).replace(/[?&]$/, '')
    return `${cleanUrl}${cleanUrl.includes('?') ? '&' : '?'}v=${logoCacheBuster}`
  }

  const resolvedLogoUrl = program
    ? (() => {
        const base64Logo =
          typeof program.images?.logo === 'string' && program.images.logo.startsWith('data:')
            ? program.images.logo
            : null
        return base64Logo || program.brand?.logo_url || addCacheBuster(program.wallet_design?.logo_url) || ''
      })()
    : ''

  const card = program
    ? {
        id: program.program_id || program.id,
        club_name: program.program_name,
        card_title: program.program_name,
        description: program.description,
        logo_url: resolvedLogoUrl,
        stamp_background: program.images?.stamp_background || '',
        stamp_icon: program.images?.stamp_icon || '',
        card_color: program.wallet_design?.hex_background_color || program.program_rules?.card_color || '#000000',
        foreground_color:
          program.wallet_design?.hex_foreground_color || program.program_rules?.foreground_color || '#FFFFFF',
        label_color: program.wallet_design?.hex_label_color || '#FFFFFF',
        gradient_color: program.program_rules?.gradient_color || '#F59E0B',
        reward_text: program.reward_description,
        terms:
          program.terms ||
          program.metadata?.terms_and_conditions ||
          program.program_rules?.terms_and_conditions ||
          program.program_rules?.terms ||
          '',
        stamps_required: program.stamps_required || program.program_rules?.stamps_required || 10,
        is_active: program.is_active !== false,
        contact_email: program.metadata?.contact_email || program.program_rules?.contact_email || '',
        contact_phone: program.metadata?.contact_phone || program.program_rules?.contact_phone || '',
        website: program.metadata?.website || program.program_rules?.website || '',
        collect_name: program.program_rules?.required_customer_fields?.name !== false,
        collect_email: program.program_rules?.required_customer_fields?.email !== false,
        collect_phone: program.program_rules?.required_customer_fields?.phone || false,
        collect_birthday: program.program_rules?.required_customer_fields?.birth_date || false,
      }
    : null

  const handleAddToWallet = (type) => {
    setWalletType(type)
    setShowSignUp(true)
    if (demoParam) window.parent?.postMessage({ type: 'demo-show-form' }, '*')
  }

  const processAddToWallet = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Llamar al API real para crear la tarjeta de lealtad
      const response = await api.loyaltyCards.create(
        cardId, // program_id de la URL
        signupData.email,
        signupData.name,
        signupData.phone || null,
        signupData.birthday || null,
      )

      const loyaltyCard = response?.data || response
      console.log('[PublicCard] Tarjeta creada:', loyaltyCard)

      // Guardar card_id
      const newCardId = loyaltyCard.card_id || loyaltyCard.id
      setCustomerCardId(newCardId)

      setCustomerData({
        customerName: loyaltyCard.customer_full_name || signupData.name,
        currentStamps: loyaltyCard.current_stamps || 0,
        cardId: newCardId,
      })

      setShowSignUp(false)

      // Manejar descarga del pass según el tipo de wallet seleccionado
      const walletUrl =
        loyaltyCard.save_to_wallet_url ||
        loyaltyCard.google_wallet_url ||
        loyaltyCard.wallet_url ||
        loyaltyCard.pass_url

      if (walletUrl) {
        const isApple = walletType === 'apple'
        toast.success(
          isApple
            ? '¡Te has unido al programa! Abriendo Apple Wallet...'
            : '¡Te has unido al programa! Abriendo Google Wallet...',
        )
        window.location.href = walletUrl
      } else {
        setAdded(true)
        toast.success('¡Te has unido al programa exitosamente!')
      }
    } catch (error) {
      console.error('[PublicCard] Error al crear tarjeta:', error)

      // 500 = el backend falló generando el wallet pass, pero el usuario SÍ quedó creado en la DB.
      // Tratar como éxito parcial: el cliente se unió, solo no hay wallet pass por ahora.
      if (error.response?.status === 500) {
        setShowSignUp(false)
        setAdded(true)
        toast.success('¡Te has unido al programa exitosamente!', { duration: 4000 })
      } else if (error.message?.toLowerCase().includes('unsupported device')) {
        toast.error(
          'Solo puedes unirte al club desde un teléfono móvil (Android o iOS). Por favor, abre este enlace desde tu celular.',
          {
            duration: 5000,
          },
        )
      } else {
        toast.error(error.message || 'Error al registrarte. Intenta nuevamente.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleShare = async () => {
    const shareUrl = (() => {
      if (program?.short_url) {
        const raw = program.short_url
        if (raw.startsWith('http')) return raw
        return `${window.location.origin}/s/${raw}`
      }
      return window.location.href
    })()
    const shareText = `¡Únete al programa de fidelidad ${card?.club_name}!`

    if (navigator.share) {
      try {
        await navigator.share({
          title: card?.club_name,
          text: `${shareText}\n${shareUrl}`,
        })
      } catch (e) {
        console.log(e)
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
        toast.success('Link copiado al portapapeles')
      } catch {
        toast.error('No se pudo copiar el link')
      }
    }
  }

  const demoCard = demoParam ? DEMO_PROGRAMS[demoParam] || null : null

  if (isLoading && !demoCard) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    )
  }

  if (error && !demoCard) {
    console.error('[PublicCard] Error al cargar:', error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="p-8 text-center max-w-md shadow-xl border-0">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar el programa</h2>
            <p className="text-gray-600 mb-4">
              {error?.message || 'No se pudo cargar el programa de fidelidad. Por favor, intenta nuevamente.'}
            </p>
            <p className="text-sm text-gray-500">Si el problema persiste, verifica que el enlace sea correcto.</p>
          </Card>
        </motion.div>
      </div>
    )
  }

  const resolvedCard = demoCard || card

  if (!resolvedCard) {
    console.warn('[PublicCard] Programa no encontrado:', { cardId })

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="p-8 text-center max-w-md shadow-xl border-0">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Programa no encontrado</h2>
            <p className="text-gray-600 mb-2">Este programa de fidelidad no existe o ha sido eliminado.</p>
            {import.meta.env.DEV && (
              <p className="text-xs text-gray-400 mt-4 p-2 bg-gray-50 rounded">Debug: ID buscado: {cardId}</p>
            )}
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Hero Section */}
      <div
        className="w-full py-12 px-4"
        style={{ background: program?.wallet_design?.hex_background_color || resolvedCard?.card_color || '#1a1a1a' }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
          style={{ color: program?.wallet_design?.hex_foreground_color || resolvedCard?.foreground_color || '#FFFFFF' }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {resolvedCard.welcome_text || `¡Bienvenido a ${resolvedCard.club_name}!`}
          </h1>
        </motion.div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-6"
        >
          {/* Reward Highlight */}
          <Card className="p-6 shadow-xl border-0 bg-white">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center flex-shrink-0">
                <Gift className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Tu recompensa</p>
                <p className="text-xl font-bold text-gray-900">{resolvedCard.reward_text}</p>
              </div>
            </div>
          </Card>

          {/* Join Section */}
          <Card className="p-8 shadow-xl border-0 bg-white">
            {added ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Bienvenido al club!</h3>
                <p className="text-gray-600 mb-6">
                  Ya eres parte de {resolvedCard.club_name}. Tu tarjeta ha sido agregada a tu wallet.
                </p>

                {customerData && (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 mb-6">
                    <p className="text-sm text-gray-500 mb-1">Miembro</p>
                    <p className="text-lg font-semibold text-gray-900">{customerData.customerName}</p>
                    <div className="mt-3 pt-3 border-t border-amber-200">
                      <p className="text-sm text-gray-500">Sellos acumulados</p>
                      <p className="text-2xl font-bold text-amber-600">
                        {customerData.currentStamps || 0} / {resolvedCard.stamps_required}
                      </p>
                    </div>
                  </div>
                )}

                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white gap-2 h-14"
                  onClick={handleShare}
                >
                  <Share2 className="w-5 h-5" />
                  Compartir con amigos
                </Button>
              </motion.div>
            ) : (
              <>
                <div className="text-center mb-6">
                  {resolvedCard.logo_url && (
                    <img
                      src={resolvedCard.logo_url}
                      alt={resolvedCard.club_name}
                      className="w-32 h-32 object-contain rounded-2xl mx-auto mb-4 transition-opacity duration-300"
                      style={{ opacity: 0 }}
                      fetchPriority="high"
                      onLoad={(e) => {
                        e.currentTarget.style.opacity = '1'
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  )}
                  <p className="text-gray-600">Guarda este programa en tu wallet y empieza a ganar recompensas</p>
                </div>

                <div className="space-y-3">
                  {/* Mostrar botones según el sistema operativo detectado */}
                  {(preferredWallet === 'apple' || preferredWallet === 'both') && (
                    <Button
                      size="lg"
                      className="w-full bg-black hover:bg-gray-800 text-white gap-3 h-14 text-base font-semibold"
                      onClick={() => handleAddToWallet('apple')}
                    >
                      <Apple className="w-6 h-6" />
                      Unirme al Club
                    </Button>
                  )}

                  {(preferredWallet === 'google' || preferredWallet === 'both') && (
                    <Button
                      size="lg"
                      className="w-full bg-black hover:bg-gray-800 text-white gap-3 h-14 text-base font-semibold"
                      onClick={() => handleAddToWallet('google')}
                    >
                      <Smartphone className="w-6 h-6" />
                      Unirme al Club
                    </Button>
                  )}

                  {/* En móvil, mostrar opción secundaria colapsada */}
                  {isMobile && (
                    <Button
                      size="lg"
                      variant="ghost"
                      className="w-full gap-2 h-12 text-sm text-gray-500 hover:text-gray-700"
                      onClick={() => handleAddToWallet(preferredWallet === 'apple' ? 'google' : 'apple')}
                    >
                      {preferredWallet === 'apple' ? (
                        <>
                          <Smartphone className="w-5 h-5" />
                          ¿Usas Android? Agregar a Google Wallet
                        </>
                      ) : (
                        <>
                          <Apple className="w-5 h-5" />
                          ¿Usas iPhone? Agregar a Apple Wallet
                        </>
                      )}
                    </Button>
                  )}
                  {/* Terms */}
                  {resolvedCard.terms && (
                    <div className="pt-4 border-t border-gray-100">
                      <button
                        onClick={() => setTermsOpen((o) => !o)}
                        className="w-full flex items-center justify-between text-sm font-semibold text-gray-900"
                      >
                        Términos y Condiciones
                        <ChevronDown
                          className="w-4 h-4 text-gray-400 transition-transform"
                          style={{ transform: termsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        />
                      </button>
                      {termsOpen && (
                        <p className="mt-2 text-xs text-gray-500 whitespace-pre-wrap break-words leading-relaxed">
                          {resolvedCard.terms}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="border-t border-gray-100 my-4" />
                  <Button
                    size="lg"
                    variant="ghost"
                    className="w-full gap-2 h-12 text-base text-gray-600 hover:text-gray-900"
                    onClick={handleShare}
                  >
                    <Share2 className="w-5 h-5" />
                    Compartir programa
                  </Button>
                </div>
              </>
            )}
          </Card>

          {/* Contact Info */}
          {(resolvedCard.contact_email || resolvedCard.contact_phone || resolvedCard.website) && (
            <Card className="p-6 border-0 bg-white shadow-md">
              <h3 className="font-semibold text-gray-900 mb-4">Información de Contacto</h3>
              <div className="space-y-3">
                {resolvedCard.contact_email && (
                  <a
                    href={`mailto:${resolvedCard.contact_email}`}
                    className="flex items-center gap-3 text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                      <Mail className="w-5 h-5 text-amber-600" />
                    </div>
                    <span>{resolvedCard.contact_email}</span>
                  </a>
                )}
                {resolvedCard.contact_phone && (
                  <a
                    href={`tel:${resolvedCard.contact_phone}`}
                    className="flex items-center gap-3 text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                      <Phone className="w-5 h-5 text-amber-600" />
                    </div>
                    <span>{resolvedCard.contact_phone}</span>
                  </a>
                )}
                {resolvedCard.website && (
                  <a
                    href={
                      resolvedCard.website.startsWith('http') ? resolvedCard.website : `https://${resolvedCard.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                      <Globe className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="truncate max-w-[200px]">{resolvedCard.website.replace(/^https?:\/\//, '')}</span>
                  </a>
                )}
              </div>
            </Card>
          )}

          {/* Footer */}
          <div className="text-center py-8 text-gray-400 text-sm">Powered by Repeat.la</div>
        </motion.div>
      </div>

      {/* Sign Up Dialog */}
      <Dialog open={showSignUp} onOpenChange={setShowSignUp}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Únete a {resolvedCard?.club_name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={processAddToWallet} className="space-y-4 py-4">
            {resolvedCard?.collect_name && (
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  required
                  placeholder="Tu nombre"
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  className="h-12"
                />
              </div>
            )}
            {resolvedCard?.collect_email && (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  className="h-12"
                />
                <p className="text-xs text-gray-400">Te enviaremos un mail con tu tarjeta de fidelidad</p>
              </div>
            )}
            {resolvedCard?.collect_phone && (
              <div className="space-y-2">
                <Label htmlFor="phone">Celular</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  placeholder="+54 11 1234-5678"
                  value={signupData.phone}
                  onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                  className="h-12"
                />
              </div>
            )}
            {resolvedCard?.collect_birthday && (
              <div className="space-y-2">
                <Label htmlFor="birthday">Fecha de cumpleaños</Label>
                <Input
                  id="birthday"
                  type="date"
                  required
                  max={new Date(new Date().getFullYear() - 10, new Date().getMonth(), new Date().getDate())
                    .toISOString()
                    .slice(0, 10)}
                  value={signupData.birthday}
                  onChange={(e) => setSignupData({ ...signupData, birthday: e.target.value })}
                  className="h-12"
                />
              </div>
            )}
            <DialogFooter className="pt-4">
              <Button
                type="submit"
                size="lg"
                className="w-full bg-black hover:bg-gray-800 text-white h-12"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Registrando...
                  </>
                ) : (
                  'Unirme al programa'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
