import { Button } from '@/components/ui/button'
import { RotateCw } from 'lucide-react'
import { useLanguage } from '@/components/auth/LanguageContext'
import { getProgramTypeName } from '@/constants/programTypes'
import ProgramPreviewComponent from '@/components/programs/ProgramPreviewComponent'

export default function ProgramPreviewSection({
  formData,
  brandData,
  previewPlatform,
  setPreviewPlatform,
  isFlipped,
  setIsFlipped,
  stampCardImageUrl,
  isMobile,
}) {
  const { t } = useLanguage()

  return (
    <>
      <div className={isMobile ? 'mb-6' : 'mb-4'}>
        <div className={`flex items-center justify-between ${isMobile ? 'mb-2' : 'mb-4'}`}>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('livePreview')}</h2>
            <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300">
              {getProgramTypeName(formData.program_type_id)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFlipped(!isFlipped)}
              className="gap-2 h-7 w-7 p-0"
              aria-label="Voltear vista previa"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={previewPlatform === 'ios' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewPlatform('ios')}
              className="gap-2"
            >
              iOS
            </Button>
            <Button
              variant={previewPlatform === 'android' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewPlatform('android')}
              className="gap-2"
            >
              Android
            </Button>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{t('livePreviewDesc')}</p>
      </div>
      <div className={isMobile ? 'scale-[0.9] origin-top -mb-12' : undefined}>
        <ProgramPreviewComponent
          card={{
            ...formData,
            logo_url: formData.logo_url || brandData?.logo_url || '',
            brand_name: brandData?.brand_name || localStorage.getItem('brand_name') || '',
          }}
          showDetails
          platform={previewPlatform}
          isFlipped={isFlipped}
          stampCardImageUrl={stampCardImageUrl}
        />
      </div>
    </>
  )
}
