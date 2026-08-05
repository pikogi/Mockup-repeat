import { useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Save, Zap, ArrowRightLeft, Package } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import ProgramPreviewSection from '@/components/programs/ProgramPreviewSection'
import {
  StoreSelector,
  ProgramTypeSelector,
  BasicInfoFields,
  ImageUploadGroup,
  ColorPickerGroup,
  ValiditySection,
  CustomerDataFields,
  SecuritySection,
  BusinessInfoSection,
  CouponConfigSection,
  MembershipConfigSection,
  PartnerBenefitsSection,
  CashbackConfigSection,
  ReferralSection,
} from '@/components/programs/ClubFormSections'
import {
  MOONCAFE_CLUBS,
  MOONCAFE_STORES,
  MOONCAFE_BRAND,
  POINTS_TYPE_ID,
  getValidityTermsText,
} from '@/constants/moonCafeClubs'

const REDEEM_MODES = [
  {
    value: 'threshold',
    icon: Zap,
    title: 'Umbral automático',
    desc: 'Al alcanzar la cantidad de puntos se entrega la recompensa',
  },
  {
    value: 'direct',
    icon: ArrowRightLeft,
    title: 'Conversión directa',
    desc: 'Staff canjea puntos por dinero o crédito en caja',
  },
  { value: 'catalog', icon: Package, title: 'Catálogo', desc: 'El cliente elige un producto o servicio' },
]

const CATALOG_TYPES = [
  {
    value: 'repeat',
    icon: Package,
    title: 'Catálogo en Repeat',
    desc: 'Creas los premios aquí y los clientes los ven en una página pública',
  },
  {
    value: 'own',
    icon: ArrowRightLeft,
    title: 'Catálogo propio del comercio',
    desc: 'Los premios se gestionan fuera de Repeat; el canje registra una referencia',
  },
]

function DemoPointsConversionSection({ formData, setFormData }) {
  const redeemMode = formData.redeem_mode || 'direct'
  const catalogType = formData.catalog_type || 'repeat'
  const moneyPerPoint = formData.money_per_point ?? 1
  const exampleSpend = moneyPerPoint * 5
  const earnedPoints = moneyPerPoint > 0 ? Math.floor(exampleSpend / moneyPerPoint) : 0

  return (
    <div className="border-t pt-6 pb-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Configuración de puntos</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Define cómo acumulan y cómo canjean puntos tus clientes.
        </p>
      </div>

      {/* Modo de canje */}
      <div className="space-y-3">
        <Label>Modo de canje</Label>
        <div className="grid grid-cols-3 gap-3">
          {REDEEM_MODES.map(({ value, icon: Icon, title, desc }) => {
            const isSelected = redeemMode === value
            return (
              <button
                key={value}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, redeem_mode: value }))}
                className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 bg-white dark:bg-gray-900 transition-all text-left ${isSelected ? 'border-gray-900 dark:border-gray-100' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${isSelected ? 'bg-gray-900 dark:bg-gray-100' : 'bg-gray-100 dark:bg-gray-800'}`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white dark:text-gray-900' : 'text-gray-400'}`} />
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
                <p className="text-xs leading-tight text-gray-400 dark:text-gray-500">{desc}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tipo de catálogo */}
      {redeemMode === 'catalog' && (
        <div className="space-y-3">
          <Label>Tipo de catálogo</Label>
          <div className="grid grid-cols-2 gap-3">
            {CATALOG_TYPES.map(({ value, icon: Icon, title, desc }) => {
              const isSelected = catalogType === value
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, catalog_type: value }))}
                  className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 bg-white dark:bg-gray-900 transition-all text-left ${isSelected ? 'border-gray-900 dark:border-gray-100' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${isSelected ? 'bg-gray-900 dark:bg-gray-100' : 'bg-gray-100 dark:bg-gray-800'}`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-white dark:text-gray-900' : 'text-gray-400'}`} />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</p>
                  <p className="text-xs leading-tight text-gray-400 dark:text-gray-500">{desc}</p>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Valor del punto */}
      <div className="space-y-5">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Valor del punto</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {redeemMode === 'catalog'
              ? 'Define cuánto gasto equivale a 1 punto. Los puntos acumulados se canjean por premios del catálogo.'
              : 'Define la tasa a la que ganan y canjean los puntos.'}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acumulación</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Monto en moneda necesario para ganar 1 punto</p>
          <div className="flex items-center gap-3">
            <div className="relative flex items-center">
              <span className="absolute left-3 text-sm text-gray-500">$</span>
              <Input
                type="number"
                min="1"
                value={moneyPerPoint}
                onChange={(e) => {
                  const v = parseInt(e.target.value)
                  if (!isNaN(v) && v >= 1) setFormData((prev) => ({ ...prev, money_per_point: v }))
                }}
                className="pl-7 w-36"
              />
            </div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">= 1 punto</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Ej: Gasta <strong className="text-gray-700 dark:text-gray-300">${exampleSpend.toLocaleString()}</strong> →
          gana <strong className="text-gray-700 dark:text-gray-300">{earnedPoints} puntos</strong>.{' '}
          {redeemMode === 'catalog' ? 'Canjea sus puntos por premios del catálogo.' : ''}
        </p>
      </div>
    </div>
  )
}

const COUPON_TYPE_ID = '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc156'
const MEMBERSHIP_TYPE_ID = '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc155'
const CASHBACK_TYPE_ID = '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc154'

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function EditClubMoonCafe() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const clubId = searchParams.get('club')
  const flowSuffix = location.pathname.includes('points') ? 'mooncafe-points' : 'mooncafe'

  const initialClub = MOONCAFE_CLUBS.find((c) => c.id === clubId) || MOONCAFE_CLUBS[0]

  const [formData, setFormData] = useState(initialClub)
  const [previewPlatform, setPreviewPlatform] = useState('ios')
  const [isFlipped, setIsFlipped] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingBackground, setUploadingBackground] = useState(false)
  const [uploadingStamp, setUploadingStamp] = useState(false)

  const isPointsProgram = formData.program_type_id === POINTS_TYPE_ID
  const isCouponProgram = formData.program_type_id === COUPON_TYPE_ID
  const isMembershipProgram = formData.program_type_id === MEMBERSHIP_TYPE_ID
  const isCashbackProgram = formData.program_type_id === CASHBACK_TYPE_ID

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.info('Esto es una demo — los cambios no se guardan.')
  }

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingLogo(true)
    const dataUrl = await readFileAsDataUrl(file)
    setFormData((prev) => ({ ...prev, logo_url: dataUrl }))
    setUploadingLogo(false)
  }

  const handleBackgroundImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingBackground(true)
    const dataUrl = await readFileAsDataUrl(file)
    setFormData((prev) => ({ ...prev, background_image_url: dataUrl }))
    setUploadingBackground(false)
  }

  const handleStampImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingStamp(true)
    const dataUrl = await readFileAsDataUrl(file)
    setFormData((prev) => ({ ...prev, stamp_image_url: dataUrl }))
    setUploadingStamp(false)
  }

  const previewProps = {
    formData,
    brandData: MOONCAFE_BRAND,
    previewPlatform,
    setPreviewPlatform,
    isFlipped,
    setIsFlipped,
    stampCardImageUrl: null,
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to={`/myprograms-demo/${flowSuffix}`}>
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver a Mis Clubes
            </Button>
          </Link>

          <h1 className="text-4xl font-bold leading-tight text-foreground mb-8">Editar club</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div className="lg:hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ProgramPreviewSection {...previewProps} isMobile />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <Card className="p-8 shadow-xl border-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                <StoreSelector stores={MOONCAFE_STORES} formData={formData} setFormData={setFormData} />

                <ProgramTypeSelector formData={formData} setFormData={setFormData} />

                <BasicInfoFields formData={formData} setFormData={setFormData} setIsFlipped={setIsFlipped} />

                <ImageUploadGroup
                  formData={formData}
                  uploadingLogo={uploadingLogo}
                  uploadingBackground={uploadingBackground}
                  uploadingStamp={uploadingStamp}
                  handleLogoUpload={handleLogoUpload}
                  handleBackgroundImageUpload={handleBackgroundImageUpload}
                  handleStampImageUpload={handleStampImageUpload}
                  setIsFlipped={setIsFlipped}
                />

                <ColorPickerGroup formData={formData} setFormData={setFormData} />

                {isPointsProgram && <DemoPointsConversionSection formData={formData} setFormData={setFormData} />}
                {isCouponProgram && <CouponConfigSection formData={formData} setFormData={setFormData} />}
                {isMembershipProgram && <MembershipConfigSection formData={formData} setFormData={setFormData} />}
                {isMembershipProgram && <PartnerBenefitsSection formData={formData} setFormData={setFormData} />}
                {isCashbackProgram && <CashbackConfigSection formData={formData} setFormData={setFormData} />}

                <ValiditySection
                  formData={formData}
                  setFormData={setFormData}
                  getValidityTermsText={getValidityTermsText}
                  programTypeId={formData.program_type_id}
                />

                <CustomerDataFields formData={formData} setFormData={setFormData} />

                <ReferralSection formData={formData} setFormData={setFormData} />

                <SecuritySection
                  formData={formData}
                  setFormData={setFormData}
                  programTypeId={formData.program_type_id}
                />

                <BusinessInfoSection formData={formData} setFormData={setFormData} setIsFlipped={setIsFlipped} />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black gap-2"
                >
                  <Save className="w-5 h-5" />
                  Guardar
                </Button>
              </form>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block lg:sticky lg:top-8 h-fit"
          >
            <ProgramPreviewSection {...previewProps} isMobile={false} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
