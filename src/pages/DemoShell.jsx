import { useEffect, useRef, useState } from 'react'
import DemoGuideCard from '@/components/demo/DemoGuideCard'

const MOONCAFE_STEPS = [
  {
    url: '/publicprogram-demo/mooncafe',
    title: 'Registro de cliente',
    desc: 'El cliente escanea el QR y se une al programa de sellos de Moon Café.',
    fullWidth: false,
  },
  {
    url: '/wallet-demo/mooncafe',
    title: 'Guardar tarjeta',
    desc: 'El cliente guarda la tarjeta digital en la wallet de su celular.',
    fullWidth: false,
  },
  {
    url: '/scan-demo/mooncafe',
    title: 'Registrar visita',
    desc: 'El operador escanea la tarjeta y agrega un sello al instante.',
    fullWidth: false,
  },
  {
    url: '/dashboard/mooncafe-demo',
    title: 'Panel de control',
    desc: 'Métricas en tiempo real: miembros, visitas, sellos y canjes.',
    fullWidth: true,
  },
]

const MOONCAFE_POINTS_STEPS = [
  {
    url: '/publicprogram-demo/mooncafe-points',
    title: 'Registro de cliente',
    desc: 'El cliente escanea el QR y se une al programa de puntos de Moon Café.',
    fullWidth: false,
  },
  {
    url: '/wallet-demo/mooncafe-points',
    title: 'Guardar tarjeta',
    desc: 'El cliente guarda la tarjeta de puntos en la wallet de su celular.',
    fullWidth: false,
  },
  {
    url: '/scan-demo/mooncafe-points',
    title: 'Registrar visita',
    desc: 'El operador registra la visita y suma puntos al instante.',
    fullWidth: false,
  },
  {
    url: '/dashboard/mooncafe-points-demo',
    title: 'Panel de control',
    desc: 'Métricas en tiempo real: miembros, visitas, puntos y canjes.',
    fullWidth: true,
  },
]

export default function DemoShell({ flow }) {
  const steps = flow === 'mooncafe-points' ? MOONCAFE_POINTS_STEPS : MOONCAFE_STEPS
  const [currentStep, setCurrentStep] = useState(0)
  const [done, setDone] = useState(false)
  const iframeRef = useRef(null)
  const step = steps[currentStep]

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === 'demo-next') setCurrentStep((s) => Math.min(s + 1, steps.length - 1))
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [steps.length])

  const iframeUrl = step.url + (step.url.includes('?') ? '&shell=1' : '?shell=1')

  const handleNext = () => {
    if (currentStep === steps.length - 1) {
      setDone(true)
    } else {
      setCurrentStep((s) => s + 1)
    }
  }

  const handlePrev = () => setCurrentStep((s) => Math.max(s - 1, 0))

  const handleRestart = () => {
    setDone(false)
    setCurrentStep(0)
  }

  const brandName = flow === 'mooncafe-points' ? 'Moon Café · Puntos' : 'Moon Café · Sellos'

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#fff',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
      }}
    >
      <iframe
        ref={iframeRef}
        key={iframeUrl}
        src={iframeUrl}
        style={{
          border: 'none',
          width: '100%',
          height: '100%',
          display: 'block',
        }}
        title="Demo"
      />
      <DemoGuideCard
        steps={steps}
        currentStep={currentStep}
        onPrev={handlePrev}
        onNext={handleNext}
        brandName={brandName}
        brandLogo="/moon-cafe-logo.png"
        done={done}
        onRestart={handleRestart}
      />
    </div>
  )
}
