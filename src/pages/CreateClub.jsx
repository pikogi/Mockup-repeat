import { Link } from 'react-router-dom'
import { createPageUrl } from '@/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/components/auth/LanguageContext'
import { useClubForm } from '@/hooks/useClubForm'
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
} from '@/components/programs/ClubFormSections'

export default function CreateClub() {
  const { t } = useLanguage()

  const {
    formData,
    setFormData,
    brandData,
    stores,
    uploadingLogo,
    uploadingBackground,
    uploadingStamp,
    previewPlatform,
    setPreviewPlatform,
    isFlipped,
    setIsFlipped,
    handleSubmit,
    isSubmitting,
    handleLogoUpload,
    handleBackgroundImageUpload,
    handleStampImageUpload,
    stampCardImageUrl,
    editId,
    isLoadingProgram,
    getValidityTermsText,
  } = useClubForm()

  const isPointsProgram = formData.program_type_id === '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc157'

  const previewProps = {
    formData,
    brandData,
    previewPlatform,
    setPreviewPlatform,
    isFlipped,
    setIsFlipped,
    stampCardImageUrl,
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to={createPageUrl('MyPrograms')}>
            <Button variant="ghost" className="mb-6 gap-2">
              <ArrowLeft className="w-4 h-4" />
              {t('backToPrograms')}
            </Button>
          </Link>

          <h1 className="text-4xl font-bold leading-tight text-foreground mb-8">
            {editId ? t('editProgram') : t('createNewProgram')}
          </h1>
        </motion.div>

        {isLoadingProgram ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-8 shadow-xl border-0">
              <div className="space-y-6 animate-pulse">
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    </div>
                  ))}
                </div>
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
              </div>
            </Card>
            <div className="hidden lg:block">
              <Card className="p-6 shadow-lg border-0">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded mx-auto" />
                  <div className="h-[400px] bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                </div>
              </Card>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Program Type - Mobile Only */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="lg:hidden"
            >
              <Card className="p-6 shadow-lg border-0">
                <ProgramTypeSelector formData={formData} setFormData={setFormData} />
              </Card>
            </motion.div>

            {/* Preview - Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:hidden"
            >
              <ProgramPreviewSection {...previewProps} isMobile />
            </motion.div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-8 shadow-xl border-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <StoreSelector stores={stores} formData={formData} setFormData={setFormData} />

                  <ProgramTypeSelector formData={formData} setFormData={setFormData} className="hidden lg:block" />

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
                    disabled={isSubmitting || uploadingLogo || uploadingBackground || uploadingStamp}
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {editId ? t('Guardar') : t('createProgramBtn')}
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Preview - Desktop */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:block lg:sticky lg:top-8 h-fit"
            >
              <ProgramPreviewSection {...previewProps} isMobile={false} />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
