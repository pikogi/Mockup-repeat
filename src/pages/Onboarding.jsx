import { Fragment, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '@/api/client'
import { useQueryClient } from '@tanstack/react-query'
import { getCurrentUser } from '@/utils/jwt'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, Store } from 'lucide-react'
import { toast } from 'sonner'
import { useLanguage } from '@/components/auth/LanguageContext'

export default function Onboarding() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const user = useMemo(() => getCurrentUser(), [])

  const [currentStep, setCurrentStep] = useState(1)
  const [brandName, setBrandName] = useState('')
  const [storeFormData, setStoreFormData] = useState({ name: '', address: '', city: '', lat: 0, lng: 0 })
  const [isFinalizing, setIsFinalizing] = useState(false)

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!brandName.trim()) {
        toast.error(t('onboardingBrandRequired'))
        return
      }
      setCurrentStep(2)
    }
  }

  const handleFinalizeFromStep1 = async () => {
    setIsFinalizing(true)
    try {
      const res = await api.brands.create(brandName, '', user.user_id)
      const brand_id = res?.data?.brand_id

      localStorage.setItem('brand_id', brand_id)
      localStorage.setItem('brand_name', brandName)

      const new_name = brandName + ' - Sucursal Principal'
      await api.stores.create(brand_id, new_name, '', '', 0, 0)

      await api.auth.updateBrandAdmin({ onboarding_completed: true })

      queryClient.removeQueries({ queryKey: ['auth', 'me'] })

      navigate('/dashboard')
    } catch {
      toast.error(t('onboardingCreateError'))
    } finally {
      setIsFinalizing(false)
    }
  }

  const handleFinalize = async () => {
    setIsFinalizing(true)
    try {
      const res = await api.brands.create(brandName, '', user.user_id)
      const brand_id = res?.data?.brand_id

      localStorage.setItem('brand_id', brand_id)
      localStorage.setItem('brand_name', brandName)

      const { name, address, city, lat, lng } = storeFormData

      const new_name = name?.length > 2 ? name : brandName + ' - Sucursal Principal'

      await api.stores.create(brand_id, new_name, address, city, lat, lng)

      await api.auth.updateBrandAdmin({ onboarding_completed: true })

      queryClient.removeQueries({ queryKey: ['auth', 'me'] })

      navigate('/dashboard')
    } catch {
      toast.error(t('onboardingCreateError'))
    } finally {
      setIsFinalizing(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-2xl shadow-xl border-0">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {currentStep === 1 ? t('onboardingStep1Title') : t('onboardingStep2Title')}
          </CardTitle>
          <CardDescription className="text-base">
            {currentStep === 1 ? t('onboardingStep1Desc') : t('onboardingStep2Desc')}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center justify-center gap-2 py-6">
            {[1, 2].map((step) => (
              <Fragment key={step}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step === currentStep
                      ? 'bg-black text-white'
                      : step < currentStep
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {step}
                </div>
                {step < 2 && (
                  <div
                    className={`h-1 w-12 ${step < currentStep ? 'bg-gray-800 dark:bg-gray-200' : 'bg-gray-300 dark:bg-gray-700'}`}
                  />
                )}
              </Fragment>
            ))}
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
              {t('onboardingStep')} {currentStep} {t('of')} 2
            </span>
          </div>

          <div className="space-y-6 py-4">
            {currentStep === 1 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <Store className="w-16 h-16 text-yellow-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brandName" className="text-gray-700 dark:text-gray-300 font-medium">
                    {t('onboardingBrandName')}
                  </Label>
                  <Input
                    id="brandName"
                    type="text"
                    placeholder={t('onboardingBrandPlaceholder')}
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="h-12"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName" className="text-gray-700 dark:text-gray-300 font-medium">
                    {t('onboardingStoreName')}
                  </Label>
                  <Input
                    id="storeName"
                    type="text"
                    placeholder={t('onboardingStorePlaceholder')}
                    value={storeFormData.name}
                    onChange={(e) => setStoreFormData({ ...storeFormData, name: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-gray-700 dark:text-gray-300 font-medium">
                    {t('storeAddress')}
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder={t('onboardingAddressPlaceholder')}
                    value={storeFormData.address}
                    onChange={(e) => setStoreFormData({ ...storeFormData, address: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-gray-700 dark:text-gray-300 font-medium">
                    {t('storeCity')}
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder={t('onboardingCityPlaceholder')}
                    value={storeFormData.city}
                    onChange={(e) => setStoreFormData({ ...storeFormData, city: e.target.value })}
                    className="h-12"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-4">
            {currentStep === 1 ? (
              <div className="flex gap-3">
                <Button
                  onClick={handleNextStep}
                  variant="outline"
                  className="flex-1 bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800 border-2 border-black dark:border-white text-black dark:text-white h-12"
                >
                  {t('onboardingAddStore')}
                </Button>
                <Button
                  onClick={handleFinalizeFromStep1}
                  disabled={isFinalizing}
                  className="flex-1 bg-black hover:bg-gray-800 h-12"
                >
                  {isFinalizing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      {t('onboardingFinalizing')}
                    </>
                  ) : (
                    t('onboardingFinalize')
                  )}
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleFinalize}
                disabled={isFinalizing}
                className="w-full bg-black hover:bg-gray-800 h-12"
              >
                {isFinalizing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {t('onboardingFinalizing')}
                  </>
                ) : (
                  t('onboardingFinalize')
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
