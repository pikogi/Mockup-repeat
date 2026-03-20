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

export default function Onboarding() {
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
        toast.error('Por favor ingresa un nombre para tu marca')
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

      // Crear sucursal por defecto (igual que en handleFinalize)
      const new_name = brandName + ' - Sucursal Principal'
      await api.stores.create(brand_id, new_name, '', '', 0, 0)

      await api.auth.updateBrandAdmin({ onboarding_completed: true })

      // Limpiar cache completamente para que Dashboard cargue datos frescos
      queryClient.removeQueries({ queryKey: ['auth', 'me'] })

      navigate('/dashboard')
    } catch {
      toast.error('No se pudo crear la marca')
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

      // Limpiar cache completamente para que Dashboard cargue datos frescos
      queryClient.removeQueries({ queryKey: ['auth', 'me'] })

      navigate('/dashboard')
    } catch {
      toast.error('No se pudo crear la marca')
    } finally {
      setIsFinalizing(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <Card className="w-full max-w-2xl shadow-xl border-0">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {currentStep === 1 ? 'Crear tu Marca' : 'Crear tu Primera Sucursal'}
          </CardTitle>
          <CardDescription className="text-base">
            {currentStep === 1
              ? 'Para comenzar, necesitamos el nombre de tu marca. Este nombre aparecerá en tus programas y panel de control.'
              : 'Crea tu primera sucursal. Si no completas los datos y haces clic en "Finalizar", se creará una sucursal por defecto.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Indicador de pasos */}
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
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Paso {currentStep} de 2</span>
          </div>

          {/* Contenido del formulario */}
          <div className="space-y-6 py-4">
            {currentStep === 1 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center mb-4">
                  <Store className="w-16 h-16 text-yellow-500" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brandName" className="text-gray-700 dark:text-gray-300 font-medium">
                    Nombre de la Marca
                  </Label>
                  <Input
                    id="brandName"
                    type="text"
                    placeholder="Ej: Mi Tienda"
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
                    Nombre de la Sucursal
                  </Label>
                  <Input
                    id="storeName"
                    type="text"
                    placeholder="Ej: Sucursal Centro"
                    value={storeFormData.name}
                    onChange={(e) => setStoreFormData({ ...storeFormData, name: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-gray-700 dark:text-gray-300 font-medium">
                    Dirección
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Ej: Calle Principal 123"
                    value={storeFormData.address}
                    onChange={(e) => setStoreFormData({ ...storeFormData, address: e.target.value })}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-gray-700 dark:text-gray-300 font-medium">
                    Ciudad
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Ej: Ciudad"
                    value={storeFormData.city}
                    onChange={(e) => setStoreFormData({ ...storeFormData, city: e.target.value })}
                    className="h-12"
                  />
                </div>

                {/* Latitud, Longitud y geolocalización — deshabilitado temporalmente
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lat" className="text-gray-700 font-medium text-sm">
                      Latitud
                    </Label>
                    <Input
                      id="lat"
                      type="number"
                      placeholder="Ej: -34.6037"
                      value={storeFormData.lat}
                      onChange={(e) =>
                        setStoreFormData({ ...storeFormData, lat: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lng" className="text-gray-700 font-medium text-sm">
                      Longitud
                    </Label>
                    <Input
                      id="lng"
                      type="number"
                      placeholder="Ej: -58.3816"
                      value={storeFormData.lng}
                      onChange={(e) =>
                        setStoreFormData({ ...storeFormData, lng: e.target.value })
                      }
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGetLocation}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Usar mi ubicación actual
                </Button>
                */}
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
                  Agregar Sucursal
                </Button>
                <Button
                  onClick={handleFinalizeFromStep1}
                  disabled={isFinalizing}
                  className="flex-1 bg-black hover:bg-gray-800 h-12"
                >
                  {isFinalizing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Finalizando...
                    </>
                  ) : (
                    'Finalizar'
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
                    Finalizando...
                  </>
                ) : (
                  'Finalizar'
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
