import { useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
  PointsConversionSection,
  CouponConfigSection,
  MembershipConfigSection,
  CashbackConfigSection,
} from '@/components/programs/ClubFormSections'
import {
  MOONCAFE_CLUBS,
  MOONCAFE_STORES,
  MOONCAFE_BRAND,
  POINTS_TYPE_ID,
  getValidityTermsText,
} from '@/constants/moonCafeClubs'

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

                {isPointsProgram && <PointsConversionSection formData={formData} setFormData={setFormData} />}
                {isCouponProgram && <CouponConfigSection formData={formData} setFormData={setFormData} />}
                {isMembershipProgram && <MembershipConfigSection formData={formData} setFormData={setFormData} />}
                {isCashbackProgram && <CashbackConfigSection formData={formData} setFormData={setFormData} />}

                <ValiditySection
                  formData={formData}
                  setFormData={setFormData}
                  getValidityTermsText={getValidityTermsText}
                />

                <CustomerDataFields formData={formData} setFormData={setFormData} />

                <SecuritySection formData={formData} setFormData={setFormData} />

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
