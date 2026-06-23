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
    phoneFrame: true,
  },
  {
    url: '/dashboard-demo/mooncafe',
    title: 'Panel de control',
    desc: 'Una vez dentro de Repeat, verás las métricas de tus programas en tiempo real.',
    fullWidth: true,
  },
  {
    url: '/scan-demo/mooncafe',
    title: 'Registrar visita',
    desc: 'El botón amarillo de escaneo registra la visita del cliente al instante.',
    fullWidth: false,
    desktopSubSteps: [
      {
        url: '/dashboard-demo/mooncafe',
        title: 'Registrar visita',
        desc: 'Tienes 2 formas de registrar la visita del cliente. Elige la que más se adapte a tu operación diaria.',
      },
      {
        title: 'Opción 1: Escaneo QR',
        desc: 'Escanea la tarjeta del cliente desde el lector de QR para registrar la visita al instante.',
      },
      {
        title: 'Opción 2: Manual desde Miembros',
        desc: 'En la sección Miembros, localiza al cliente en la base de datos y agrega la visita manualmente.',
      },
    ],
    mobileSubSteps: [
      {
        url: '/dashboard-demo/mooncafe',
        title: 'Registrar visita',
        desc: 'Tienes 2 formas de registrar la visita del cliente. Elige la que más se adapte a tu operación diaria.',
      },
      {
        url: '/scan-demo/mooncafe',
        title: 'Opción 1: Escaneo QR',
        desc: 'Toca el botón amarillo para escanear la tarjeta del cliente y registrar la visita al instante.',
      },
      {
        url: '/scan-demo/mooncafe',
        title: 'Opción 2: Manual desde Miembros',
        desc: 'En la sección Miembros, localiza al cliente en la base de datos y agrega la visita manualmente.',
      },
    ],
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
    phoneFrame: true,
  },
  {
    url: '/dashboard-demo/mooncafe-points',
    title: 'Panel de control',
    desc: 'Una vez dentro de Repeat, verás las métricas de tus programas en tiempo real.',
    fullWidth: true,
  },
  {
    url: '/scan-demo/mooncafe-points',
    title: 'Registrar visita',
    desc: 'El botón amarillo de escaneo registra la visita del cliente al instante.',
    fullWidth: false,
    desktopSubSteps: [
      {
        url: '/dashboard-demo/mooncafe-points',
        title: 'Registrar visita',
        desc: 'Tienes 2 formas de registrar la visita del cliente. Elige la que más se adapte a tu operación diaria.',
      },
      {
        title: 'Opción 1: Escaneo QR',
        desc: 'Escanea la tarjeta del cliente desde el lector de QR para registrar la visita al instante.',
      },
      {
        title: 'Opción 2: Manual desde Miembros',
        desc: 'En la sección Miembros, localiza al cliente en la base de datos y agrega la visita manualmente.',
      },
    ],
    mobileSubSteps: [
      {
        url: '/dashboard-demo/mooncafe-points',
        title: 'Registrar visita',
        desc: 'Tienes 2 formas de registrar la visita del cliente. Elige la que más se adapte a tu operación diaria.',
      },
      {
        url: '/scan-demo/mooncafe-points',
        title: 'Opción 1: Escaneo QR',
        desc: 'Toca el botón amarillo para escanear la tarjeta del cliente y registrar los puntos al instante.',
      },
      {
        url: '/scan-demo/mooncafe-points',
        title: 'Opción 2: Manual desde Miembros',
        desc: 'En la sección Miembros, localiza al cliente en la base de datos y agrega los puntos manualmente.',
      },
    ],
  },
]

/* ─── Marco de celular (desktop) ─────────────────────────────────────────── */
function PhoneFrame({ children }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 390,
          height: 760,
          background: '#111',
          borderRadius: 52,
          padding: 14,
          boxShadow: '0 0 0 2px #2a2a2a, 0 0 0 4px #444, 0 30px 80px rgba(0,0,0,0.35)',
          flexShrink: 0,
        }}
      >
        {/* Notch */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 126,
            height: 34,
            background: '#111',
            borderRadius: '0 0 22px 22px',
            zIndex: 10,
          }}
        />
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: 40,
            overflow: 'hidden',
            background: '#fff',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

/* ─── Pantalla de bienvenida ─────────────────────────────────────────────── */
function WelcomeScreen({ onStart }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '32px 28px',
        textAlign: 'center',
      }}
    >
      <img
        src="/logo.png"
        alt="Repeat"
        style={{
          width: 72,
          height: 72,
          objectFit: 'contain',
          borderRadius: 18,
          marginBottom: 32,
          boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 8px 32px rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.07)',
        }}
      />
      <h1
        style={{
          color: '#fff',
          fontSize: 28,
          fontWeight: 800,
          margin: '0 0 12px',
          lineHeight: 1.2,
          letterSpacing: -0.5,
        }}
      >
        Bienvenido al tour de Repeat
      </h1>
      <p
        style={{
          color: 'rgba(255,255,255,0.42)',
          fontSize: 15,
          margin: '0 0 48px',
          lineHeight: 1.6,
          maxWidth: 280,
        }}
      >
        Conoce cómo funciona el sistema de fidelización en menos de 2 minutos.
      </p>
      <button
        onClick={onStart}
        style={{
          width: '100%',
          maxWidth: 320,
          padding: '16px 0',
          background: '#eab308',
          color: '#000',
          fontWeight: 800,
          fontSize: 16,
          border: 'none',
          borderRadius: 14,
          cursor: 'pointer',
          letterSpacing: 0.2,
        }}
      >
        Comenzar tour →
      </button>
    </div>
  )
}

/* ─── Pantalla de cafetería con QR ──────────────────────────────────────── */
function CafeScreen({ onNext, cafeImage }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Foto de la cafetería */}
      <img
        src={cafeImage}
        alt="Cafetería"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center top',
        }}
      />

      {/* Overlay sutil en la parte inferior */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '50%',
          background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.45))',
          pointerEvents: 'none',
        }}
      />

      {/* Card de guía */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          left: 16,
          right: 16,
          background: '#fff',
          borderRadius: 16,
          padding: '16px 16px 14px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
          border: '2px solid #eab308',
          zIndex: 30,
        }}
      >
        {/* Barra de progreso decorativa */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
          <div style={{ height: 4, flex: 1, borderRadius: 2, background: '#eab308' }} />
          <div style={{ height: 4, flex: 1, borderRadius: 2, background: '#e5e7eb' }} />
          <div style={{ height: 4, flex: 1, borderRadius: 2, background: '#e5e7eb' }} />
          <div style={{ height: 4, flex: 1, borderRadius: 2, background: '#e5e7eb' }} />
        </div>

        <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>El cliente escanea el QR</p>
        <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 14px', lineHeight: 1.5 }}>
          En tu local hay un QR de Repeat. El cliente lo escanea y accede al formulario de registro del programa.
        </p>
        <button
          onClick={onNext}
          style={{
            width: '100%',
            padding: '11px 0',
            background: '#eab308',
            color: '#000',
            fontWeight: 700,
            fontSize: 14,
            border: 'none',
            borderRadius: 10,
            cursor: 'pointer',
          }}
        >
          Escanear QR →
        </button>
      </div>
    </div>
  )
}

/* ─── Shell principal ────────────────────────────────────────────────────── */
export default function DemoShell({ flow }) {
  const steps = flow === 'mooncafe-points' ? MOONCAFE_POINTS_STEPS : MOONCAFE_STEPS
  const cafeImage = '/cafe-mostrador.jpg'

  const [phase, setPhase] = useState('welcome') // 'welcome' | 'cafe' | 'steps'
  const [currentStep, setCurrentStep] = useState(0)
  const [subStep, setSubStep] = useState(0)
  const [done, setDone] = useState(false)
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024)
  const [scanActive, setScanActive] = useState(false)
  const iframeRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === 'demo-next') setCurrentStep((s) => Math.min(s + 1, steps.length - 1))
      if (e.data?.type === 'scan-opened') setScanActive(true)
      if (e.data?.type === 'scan-closed') setScanActive(false)
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [steps.length])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const handler = (e) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (subStep > 0) {
      iframeRef.current?.contentWindow?.postMessage({ type: 'demo-substep', subStep }, '*')
    }
  }, [subStep])

  const handleRestart = () => {
    setDone(false)
    setCurrentStep(0)
    setPhase('welcome')
  }

  // Pre-pasos: welcome y cafe
  if (phase === 'welcome') {
    const content = <WelcomeScreen onStart={() => setPhase('cafe')} />
    return isDesktop ? <PhoneFrame>{content}</PhoneFrame> : <div style={{ position: 'fixed', inset: 0 }}>{content}</div>
  }
  if (phase === 'cafe') {
    const content = <CafeScreen cafeImage={cafeImage} onNext={() => setPhase('steps')} />
    return isDesktop ? <PhoneFrame>{content}</PhoneFrame> : <div style={{ position: 'fixed', inset: 0 }}>{content}</div>
  }

  // Flujo principal de pasos
  const step = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1
  const activeSubSteps = isDesktop ? step.desktopSubSteps : step.mobileSubSteps
  const useSubSteps = isLastStep && activeSubSteps
  const activeSubStepUrl = useSubSteps ? activeSubSteps[subStep]?.url : null
  const rawUrl = activeSubStepUrl ?? step.url
  const iframeUrl = rawUrl + (rawUrl.includes('?') ? '&shell=1' : '?shell=1')
  const showPhoneFrame = step.phoneFrame && isDesktop
  const lastStep = steps[steps.length - 1]
  const displaySubSteps = isDesktop ? lastStep.desktopSubSteps : lastStep.mobileSubSteps
  const displaySteps = displaySubSteps ? [...steps.slice(0, -1), ...displaySubSteps] : steps
  const displayCurrentStep = useSubSteps ? steps.length - 1 + subStep : currentStep
  const mobileSubStepsActive = !isDesktop && !!useSubSteps

  const handleNext = () => {
    setScanActive(false)
    if (useSubSteps && subStep < activeSubSteps.length - 1) {
      setSubStep((s) => s + 1)
      return
    }
    if (currentStep === steps.length - 1) {
      setDone(true)
    } else {
      setCurrentStep((s) => s + 1)
      setSubStep(0)
    }
  }

  const handlePrev = () => {
    setScanActive(false)
    if (useSubSteps && subStep > 0) {
      setSubStep((s) => s - 1)
      return
    }
    if (currentStep === 0) {
      setPhase('cafe')
    } else {
      setCurrentStep((s) => s - 1)
      setSubStep(0)
    }
  }

  const brandName = flow === 'mooncafe-points' ? 'Moon Café · Puntos' : 'Moon Café · Sellos'

  const demoIframe = (
    <iframe
      ref={iframeRef}
      key={iframeUrl}
      src={iframeUrl}
      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      title="Demo"
    />
  )

  if (showPhoneFrame) {
    return (
      <>
        <PhoneFrame>{demoIframe}</PhoneFrame>
        {!scanActive && (
          <DemoGuideCard
            steps={displaySteps}
            currentStep={displayCurrentStep}
            onPrev={handlePrev}
            onNext={handleNext}
            brandName={brandName}
            brandLogo="/moon-cafe-logo.png"
            done={done}
            onRestart={handleRestart}
            positionTop={mobileSubStepsActive}
            isDesktop={isDesktop}
          />
        )}
      </>
    )
  }

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
      {demoIframe}
      {!scanActive && (
        <DemoGuideCard
          steps={displaySteps}
          currentStep={displayCurrentStep}
          onPrev={handlePrev}
          onNext={handleNext}
          brandName={brandName}
          brandLogo="/moon-cafe-logo.png"
          done={done}
          onRestart={handleRestart}
          positionTop={mobileSubStepsActive}
          isDesktop={isDesktop}
        />
      )}
    </div>
  )
}
