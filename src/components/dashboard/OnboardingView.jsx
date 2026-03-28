import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Store, Plus, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/components/auth/LanguageContext'

export default function OnboardingView({ onAddStore, onCreateBrand, hasBrand, hasStores, children, showForm }) {
  const { t } = useLanguage()
  const [brandName, setBrandName] = useState('')
  const [isCreatingBrand, setIsCreatingBrand] = useState(false)

  let icon = Store
  let title = t('onboardingWelcome')
  let description = t('onboardingWelcomeDesc')
  let buttonText = t('onboardingCreateBrand')
  let step = 1
  let totalSteps = 2
  let showInput = false
  let showStepIndicator = true

  if (!hasBrand) {
    icon = Store
    title = t('onboardingWelcome')
    description = t('onboardingWelcomeDesc')
    buttonText = t('onboardingCreateBrand')
    step = 1
    showInput = true
  } else if (!hasStores) {
    icon = Store
    title = t('onboardingCreateStoreTitle')
    description = t('onboardingCreateStoreDesc')
    buttonText = t('onboardingCreateStoreBtn')
    step = 2
  }

  const handleBrandSubmit = async (e) => {
    e.preventDefault()
    if (!brandName.trim() || !onCreateBrand) return
    setIsCreatingBrand(true)
    try {
      await onCreateBrand(brandName)
      setBrandName('')
    } catch (error) {
      console.error('Error creating brand:', error)
    } finally {
      setIsCreatingBrand(false)
    }
  }

  const Icon = icon

  const shouldShowFormInstead = showForm === true && !hasStores && hasBrand

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-12 text-center max-w-2xl mx-auto bg-white shadow-xl border-0">
            {shouldShowFormInstead ? (
              children
            ) : (
              <>
                <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Icon className="w-12 h-12 text-black" />
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>

                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">{description}</p>

                {showInput && (
                  <form onSubmit={handleBrandSubmit} className="mb-8">
                    <Input
                      type="text"
                      placeholder={t('onboardingBrandInputPlaceholder')}
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="h-14 text-lg mb-4 text-center"
                      autoFocus
                      required
                      disabled={isCreatingBrand}
                    />
                  </form>
                )}

                {!hasStores && hasBrand && onAddStore ? (
                  <Button
                    size="lg"
                    className="h-14 px-8 text-lg bg-black hover:bg-gray-800 gap-3 shadow-lg hover:shadow-xl transition-all"
                    onClick={() => {
                      if (onAddStore) {
                        onAddStore()
                      }
                    }}
                  >
                    <Plus className="w-6 h-6" />
                    {buttonText}
                  </Button>
                ) : showInput ? (
                  <Button
                    size="lg"
                    className="h-14 px-8 text-lg bg-black hover:bg-gray-800 gap-3 shadow-lg hover:shadow-xl transition-all"
                    onClick={handleBrandSubmit}
                    disabled={!brandName.trim() || isCreatingBrand}
                  >
                    {isCreatingBrand ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        {t('onboardingCreating')}
                      </>
                    ) : (
                      <>
                        <Plus className="w-6 h-6" />
                        {buttonText}
                      </>
                    )}
                  </Button>
                ) : null}

                {showStepIndicator && (
                  <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-400">
                    {Array.from({ length: totalSteps }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${i + 1 === step ? 'bg-black' : i + 1 < step ? 'bg-gray-800' : 'bg-gray-300'}`}
                      />
                    ))}
                    <span className="ml-2">
                      {t('onboardingStep')} {step} {t('of')} {totalSteps}
                    </span>
                  </div>
                )}
              </>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
