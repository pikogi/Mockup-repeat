import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '@/api/client'
import { getTransactionErrorMessage } from '@/lib/utils'
import { getCurrentUser } from '@/utils/jwt'
import useStoresStore from '@/stores/useStoresStore'
import { createPageUrl } from '@/utils'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { X, CheckCircle, AlertCircle, Store, Gift, Loader2, Coins, Plus, QrCode } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/components/auth/LanguageContext'
import jsQR from 'jsqr'

const POINTS_PROGRAM_TYPE_ID = '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc157'
const MOCK_STORE_ID = 'mock-store'

// Extrae card_id de cualquier formato de QR razonable
function extractCardId(rawValue) {
  if (!rawValue) return null

  // 1. JSON: {"card_id": "xxx"}
  try {
    const data = JSON.parse(rawValue)
    if (data.card_id) return data.card_id
  } catch {
    /* invalid JSON */
  }

  // 2. URL con /card/UUID o ?card_id=UUID
  const urlCardPath = rawValue.match(/\/card(?:s)?\/([0-9a-f-]{36})/i)
  if (urlCardPath) return urlCardPath[1]
  const urlCardParam = rawValue.match(/[?&]card_id=([0-9a-f-]{36})/i)
  if (urlCardParam) return urlCardParam[1]

  // 3. UUID desnudo
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawValue.trim())) {
    return rawValue.trim()
  }

  return null
}

export default function ScanQR() {
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isDemoPoints = searchParams.get('demo') === 'points' || searchParams.get('demo') === 'points-direct'
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [hasCamera, setHasCamera] = useState(true)
  const [scanning, setScanning] = useState(true)
  const [result, setResult] = useState(null)
  const [barcodeDetector, setBarcodeDetector] = useState(null)
  const [useJsQR, setUseJsQR] = useState(false)
  const [selectedStore, setSelectedStore] = useState(null)
  const [processing, setProcessing] = useState(false)
  const [step, setStep] = useState('scan') // scan, review, success, error
  const [errorMsg, setErrorMsg] = useState('')
  const [isAuthError, setIsAuthError] = useState(false)
  const [cardData, setCardData] = useState(null) // { card, cardId, programTypeId, moneyPerPoint }
  const [redeemProcessing, setRedeemProcessing] = useState(false)
  const [pointsTab, setPointsTab] = useState('add') // 'add' | 'redeem' | 'direct'
  const [purchaseAmount, setPurchaseAmount] = useState('')
  const [redeemCodeInput, setRedeemCodeInput] = useState('')
  const [pointsToRedeem, setPointsToRedeem] = useState('')

  const processingRef = useRef(false)

  const user = getCurrentUser()
  const brandId = user?.brand_id || localStorage.getItem('brand_id')

  // Auto-trigger demo de puntos si viene con ?demo=points o ?demo=points-direct
  useEffect(() => {
    const demo = searchParams.get('demo')
    if (demo === 'points' || demo === 'points-direct') {
      const isDirect = demo === 'points-direct'
      setSelectedStore(MOCK_STORE_ID)
      setScanning(false)
      setPointsTab('add')
      setPurchaseAmount('')
      setRedeemCodeInput('')
      setPointsToRedeem('')
      setCardData({
        card: {
          customer: { full_name: 'Laura Gómez', email: 'laura@gmail.com' },
          current_balance: 1250,
          created_at: '2024-03-01T00:00:00Z',
          redemptions: [],
        },
        cardId: 'mock-points-card',
        stampsRequired: 10,
        programTypeId: POINTS_PROGRAM_TYPE_ID,
        moneyPerPoint: 1000,
        redeemMode: isDirect ? 'direct' : 'catalog',
        moneyPerPointRedeem: 100,
      })
      setStep('review')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Cargar stores del brand del usuario
  const { stores, isLoading: loadingStores, fetchStores } = useStoresStore()

  useEffect(() => {
    if (brandId) fetchStores(brandId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandId])

  // Store inicial desde usuario o localStorage (validado), o auto-selección si hay solo una
  useEffect(() => {
    if (user?.assigned_branch_id) {
      setSelectedStore(user.assigned_branch_id)
      return
    }
    if (stores.length === 0) return
    const stored = localStorage.getItem('operating_branch_id')
    const isValid = stored && stores.some((s) => (s.store_id || s.id) === stored)
    if (isValid) {
      setSelectedStore(stored)
    } else if (stores.length === 1) {
      const storeId = stores[0].store_id || stores[0].id
      setSelectedStore(storeId)
      localStorage.setItem('operating_branch_id', storeId)
    }
  }, [user, stores])

  const handleStoreSelect = (storeId) => {
    setSelectedStore(storeId)
    localStorage.setItem('operating_branch_id', storeId)
  }

  // Iniciar cámara y detector
  useEffect(() => {
    if (!selectedStore || !scanning) return
    let stream = null

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          try {
            await videoRef.current.play()
          } catch (e) {
            console.log('Autoplay blocked or failed', e)
          }
        }

        if ('BarcodeDetector' in window) {
          const detector = new window.BarcodeDetector({ formats: ['qr_code'] })
          setBarcodeDetector(detector)
        } else {
          // Fallback: jsQR via canvas
          setUseJsQR(true)
        }
      } catch (err) {
        console.error('Camera error:', err)
        setHasCamera(false)
      }
    }

    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
      setBarcodeDetector(null)
      setUseJsQR(false)
    }
  }, [selectedStore, scanning])

  // Detección con BarcodeDetector nativo
  useEffect(() => {
    if (!barcodeDetector || !scanning || !videoRef.current) return

    const detectCode = async () => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        try {
          const codes = await barcodeDetector.detect(videoRef.current)
          if (codes.length > 0) {
            const cardId = extractCardId(codes[0].rawValue)
            if (cardId) {
              handleScan(cardId)
              setBarcodeDetector(null)
            } else {
              console.log('[ScanQR] BarcodeDetector: QR sin card_id:', codes[0].rawValue)
            }
          }
        } catch (err) {
          console.error('Barcode detection error:', err)
        }
      }
    }

    const interval = setInterval(detectCode, 500)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barcodeDetector, scanning])

  // Detección con jsQR (fallback para Safari / Firefox)
  useEffect(() => {
    if (!useJsQR || !scanning) return

    const detectCode = () => {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video || !canvas || video.readyState !== 4) return

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)

      if (code) {
        const cardId = extractCardId(code.data)
        if (cardId) {
          setUseJsQR(false)
          handleScan(cardId)
        } else {
          console.log('[ScanQR] jsQR: QR sin card_id:', code.data)
        }
      }
    }

    const interval = setInterval(detectCode, 500)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [useJsQR, scanning])

  const handleClose = () => {
    navigate(createPageUrl('Dashboard'))
  }

  // Paso 1: escanear QR → obtener info del cliente
  const handleScan = async (cardId) => {
    if (processingRef.current) return
    processingRef.current = true
    setProcessing(true)
    setErrorMsg('')
    setScanning(false)

    try {
      console.log('[ScanQR] Procesando card_id:', cardId)
      const cardResponse = await api.loyaltyCards.get(cardId)
      const card = cardResponse?.data || cardResponse
      console.log('[ScanQR] Tarjeta obtenida:', card)

      if (!card) throw new Error(t('scanCardNotFound'))

      let stampsRequired = 10
      let programTypeId = null
      let moneyPerPoint = 1000
      let redeemMode = 'catalog'
      let moneyPerPointRedeem = 100
      if (card.program_id) {
        try {
          const progRes = await api.loyaltyPrograms.get(card.program_id)
          const program = progRes?.data || progRes

          if (program?.brand_id && brandId && program.brand_id !== brandId) {
            throw new Error(t('scanCardNotYours'))
          }

          const rules =
            typeof program?.program_rules === 'string'
              ? JSON.parse(program.program_rules)
              : program?.program_rules || {}
          stampsRequired = rules.stamps_required || 20
          programTypeId = program?.program_type_id || null
          moneyPerPoint = rules.money_per_point || 1000
          redeemMode = rules.redeem_mode || 'catalog'
          moneyPerPointRedeem = rules.money_per_point_redeem || 100
        } catch (err) {
          if (err.message === t('scanCardNotYours')) throw err
          // usar fallback 20
        }
      }

      setCardData({ card, cardId, stampsRequired, programTypeId, moneyPerPoint, redeemMode, moneyPerPointRedeem })
      setStep('review')
    } catch (err) {
      console.error('[ScanQR] Error al obtener tarjeta:', err)
      setStep('error')
      const authFailed =
        err?.response?.status === 401 ||
        err?.response?.status === 403 ||
        err?.message?.toLowerCase().includes('authentication') ||
        err?.message?.toLowerCase().includes('token') ||
        err?.message?.toLowerCase().includes('unauthorized')
      setIsAuthError(authFailed)
      setErrorMsg(authFailed ? t('scanSessionExpired') : err.message || t('scanCouldNotReadCard'))
    } finally {
      setProcessing(false)
      processingRef.current = false
    }
  }

  // Paso 2: confirmar → agregar sello
  const handleAddStamp = async () => {
    if (!cardData) return
    setProcessing(true)

    try {
      await api.transactions.create(cardData.cardId, selectedStore, 'stamp_added', 'stamp', 1)
      console.log('[ScanQR] Transacción creada exitosamente')

      const card = cardData.card

      // Regenerar imagen de stamp card para actualizar el pass
      const programId = card.program_id
      if (programId) {
        const prevImages = (() => {
          try {
            return JSON.parse(localStorage.getItem(`program_images_${programId}`) || '{}')
          } catch {
            return {}
          }
        })()
        if (prevImages.background || prevImages.stamp || prevImages.logo) {
          api.images
            .createStampCard(
              programId,
              prevImages.background || null,
              prevImages.stamp || null,
              prevImages.logo || null,
              prevImages.color || '#ffffff',
            )
            .catch((err) => console.warn('[ScanQR] Error regenerando stamp card image:', err))
        }
      }

      setResult({
        success: true,
        customerName: card.customer?.full_name,
        rewardText: card.reward_description || t('rewards'),
      })
      setStep('success')
    } catch (err) {
      console.error('[ScanQR] Error al crear transacción:', err)
      setStep('error')
      const authFailed =
        err?.response?.status === 401 ||
        err?.response?.status === 403 ||
        err?.message?.toLowerCase().includes('authentication') ||
        err?.message?.toLowerCase().includes('token') ||
        err?.message?.toLowerCase().includes('unauthorized')
      setIsAuthError(authFailed)
      setErrorMsg(authFailed ? t('scanSessionExpired') : getTransactionErrorMessage(err, t('scanErrorAddStamp')))
    } finally {
      setProcessing(false)
    }
  }

  const handleRedeemReward = async (redemptionId) => {
    setRedeemProcessing(true)
    try {
      await api.redemptions.update(redemptionId, 'completed')
      setResult({ success: true, isRedemption: true })
      setStep('success')
    } catch (err) {
      setStep('error')
      setErrorMsg(err.message || t('scanErrorRedeemReward'))
    } finally {
      setRedeemProcessing(false)
    }
  }

  // Paso 2b: agregar puntos (programa de puntos)
  const handleAddPoints = async () => {
    if (!cardData || !purchaseAmount) return
    setProcessing(true)
    const points = Math.max(1, Math.floor(parseFloat(purchaseAmount) / cardData.moneyPerPoint))
    try {
      await api.transactions.create(cardData.cardId, selectedStore, 'points_added', 'point', points)
      setResult({
        success: true,
        customerName: cardData.card.customer?.full_name,
        points,
        isPoints: true,
      })
      setStep('success')
    } catch (err) {
      setStep('error')
      const authFailed =
        err?.response?.status === 401 ||
        err?.response?.status === 403 ||
        err?.message?.toLowerCase().includes('unauthorized')
      setIsAuthError(authFailed)
      setErrorMsg(authFailed ? t('scanSessionExpired') : err.message || 'Error al agregar puntos')
    } finally {
      setProcessing(false)
    }
  }

  // Paso 2d: canje directo por puntos → descuento en $ (programa de puntos modo direct)
  const handleDirectRedeem = async () => {
    const pts = parseInt(pointsToRedeem)
    if (!pts || pts <= 0 || !cardData) return
    setProcessing(true)
    try {
      await api.transactions.create(cardData.cardId, selectedStore, 'points_redeemed', 'point', pts)
      const discount = pts * cardData.moneyPerPointRedeem
      setResult({
        success: true,
        customerName: cardData.card.customer?.full_name,
        points: pts,
        discount,
        isDirectRedeem: true,
      })
      setStep('success')
    } catch (err) {
      setStep('error')
      setErrorMsg(err.message || 'Error al procesar el canje')
    } finally {
      setProcessing(false)
    }
  }

  // Paso 2c: validar canje por código (programa de puntos)
  const handleValidateRedeem = async () => {
    if (!redeemCodeInput.trim()) return
    setProcessing(true)
    try {
      // Mockup: simulamos éxito para cualquier código REP-XXXX
      await new Promise((r) => setTimeout(r, 800))
      setResult({
        success: true,
        customerName: cardData?.card.customer?.full_name,
        isPointsRedeem: true,
        redeemCode: redeemCodeInput.trim().toUpperCase(),
        redeemItem: 'Corte de cabello',
        redeemPoints: 300,
        redeemImage: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=120&h=120&fit=crop&q=80',
      })
      setStep('success')
    } catch (err) {
      setStep('error')
      setErrorMsg(err.message || 'Error al validar el canje')
    } finally {
      setProcessing(false)
    }
  }

  // Demo: simular escaneo de tarjeta de puntos
  const handleMockPointsScan = (mode = 'catalog') => {
    setScanning(false)
    setPointsTab('add')
    setPurchaseAmount('')
    setRedeemCodeInput('')
    setPointsToRedeem('')
    setCardData({
      card: {
        customer: { full_name: 'Laura Gómez', email: 'laura@gmail.com' },
        current_balance: 1250,
        created_at: '2024-03-01T00:00:00Z',
        redemptions: [],
      },
      cardId: 'mock-points-card',
      stampsRequired: 10,
      programTypeId: POINTS_PROGRAM_TYPE_ID,
      moneyPerPoint: 1000,
      redeemMode: mode,
      moneyPerPointRedeem: 100,
    })
    setStep('review')
  }

  const resetScanner = () => {
    setScanning(true)
    setStep('scan')
    setResult(null)
    setCardData(null)
    setErrorMsg('')
    setIsAuthError(false)
    setPurchaseAmount('')
    setRedeemCodeInput('')
    setPointsToRedeem('')
    setPointsTab('add')
    processingRef.current = false
  }

  // Pantalla de selección de tienda (solo si hay más de una)
  if (!isDemoPoints && !selectedStore && stores.length > 1) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
        <Card className="p-8 w-full max-w-md bg-white dark:bg-gray-900">
          <div className="text-center mb-6">
            <Store className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('selectLocation')}</h2>
            <p className="text-gray-600 dark:text-gray-400">{t('whereWorking')}</p>
          </div>

          <div className="space-y-4">
            <Select onValueChange={handleStoreSelect}>
              <SelectTrigger className="w-full h-12 text-lg">
                <SelectValue placeholder={t('chooseStore')} />
              </SelectTrigger>
              <SelectContent>
                {stores.map((store) => (
                  <SelectItem key={store.store_id || store.id} value={store.store_id || store.id}>
                    {store.store_name || store.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="ghost" className="w-full" onClick={handleClose}>
              {t('cancel')}
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  // Pantalla de carga de tiendas
  if (!isDemoPoints && loadingStores) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
        <Card className="p-8 w-full max-w-md bg-white dark:bg-gray-900 text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">{t('scanLoadingStores')}</p>
        </Card>
      </div>
    )
  }

  // Pantalla si no hay tiendas
  if (!isDemoPoints && !loadingStores && stores.length === 0) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
        <Card className="p-8 w-full max-w-md bg-white dark:bg-gray-900 text-center">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('scanNoStoresTitle')}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{t('scanNoStoresDesc')}</p>
          <Button onClick={handleClose} className="w-full">
            {t('scanBackToDashboard')}
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Store Indicator */}
      <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 text-white border border-white/20">
        <Store className="w-4 h-4" />
        <span className="text-sm font-medium">
          {(() => {
            const s = stores.find((s) => (s.store_id || s.id) === selectedStore)
            return s?.store_name || s?.name || t('loading')
          })()}
        </span>
        {!user?.assigned_branch_id && stores.length > 1 && (
          <button
            onClick={() => {
              setSelectedStore(null)
              localStorage.removeItem('operating_branch_id')
            }}
            className="ml-2 text-xs text-yellow-400 hover:underline"
          >
            {t('change')}
          </button>
        )}
      </div>

      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClose}
        className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
      >
        <X className="w-6 h-6" />
      </Button>

      {scanning ? (
        <>
          {/* Camera View */}
          {hasCamera ? (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Card className="p-8 text-center mx-4">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t('cameraNotAvailable')}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">{t('allowCameraAccess')}</p>
                <Button onClick={handleClose}>{t('goBack')}</Button>
              </Card>
            </div>
          )}

          {/* Scan Overlay */}
          {hasCamera && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Scanning Frame */}
              <div className="relative w-64 h-64 mb-8">
                <div className="absolute inset-0 border-2 border-white/50 rounded-2xl" />
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-yellow-400 rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-yellow-400 rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-yellow-400 rounded-bl-2xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-yellow-400 rounded-br-2xl" />

                {/* Scanning Line Animation */}
                <motion.div
                  className="absolute left-2 right-2 h-0.5 bg-yellow-400"
                  animate={{ top: ['10%', '90%', '10%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>

              <p className="text-white text-lg font-medium mb-2">{t('scanCustomerQR')}</p>
              <p className="text-white/70 text-sm mb-4">{t('positionQR')}</p>

              {/* Demo buttons */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => handleMockPointsScan('catalog')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs hover:bg-white/20 transition-colors"
                >
                  <Coins className="w-3 h-3 text-yellow-400" />
                  Demo · Catálogo
                </button>
                <button
                  onClick={() => handleMockPointsScan('direct')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs hover:bg-white/20 transition-colors"
                >
                  <Coins className="w-3 h-3 text-green-400" />
                  Demo · Directo
                </button>
              </div>

              {/* Processing Indicator */}
              {processing && (
                <div className="absolute bottom-20 bg-black/50 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 text-white border border-white/20">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  <span className="text-sm font-medium">{t('scanProcessing')}</span>
                </div>
              )}

              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}
        </>
      ) : (
        /* Result / Review View */
        <div className="flex items-center justify-center h-full p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm"
          >
            <Card className="p-4 sm:p-8 text-center w-full">
              {/* ── LOADING ── */}
              {step === 'scan' && processing && (
                <div className="flex flex-col items-center justify-center py-4">
                  <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">{t('scanReadingCard')}</p>
                </div>
              )}

              {/* ── REVIEW: info del cliente ── */}
              {step === 'review' &&
                cardData &&
                (() => {
                  const card = cardData.card
                  const current = card.current_balance || 0
                  const required = card.program?.program_rules?.stamps_required ?? cardData.stampsRequired ?? 20
                  const isPoints = cardData.programTypeId === POINTS_PROGRAM_TYPE_ID
                  const redeemMode = cardData.redeemMode || 'catalog'
                  const moneyPerPointRedeem = cardData.moneyPerPointRedeem || 100
                  const initials = (card.customer?.full_name || '?')
                    .split(' ')
                    .map((w) => w[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                  const pointsToAdd = purchaseAmount
                    ? Math.max(1, Math.floor(parseFloat(purchaseAmount) / cardData.moneyPerPoint))
                    : 0

                  return (
                    <>
                      {/* Avatar */}
                      <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{initials}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                        {card.customer?.full_name}
                      </h3>
                      {card.customer?.email && (
                        <p className="text-sm text-gray-400 dark:text-gray-500 mb-1">{card.customer.email}</p>
                      )}
                      {card.created_at && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                          {t('scanMemberSince')}{' '}
                          {new Date(card.created_at).toLocaleDateString(language === 'en' ? 'en' : 'es', {
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      )}

                      {/* ── PUNTOS: balance + tabs ── */}
                      {isPoints ? (
                        <>
                          {/* Balance actual */}
                          <div className="mb-4 p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-800">
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <Coins className="w-5 h-5 text-indigo-500" />
                              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                                Puntos actuales
                              </span>
                            </div>
                            <p className="text-4xl font-black text-indigo-600 dark:text-indigo-400 text-center leading-none">
                              {current.toLocaleString()}
                            </p>
                          </div>

                          {/* Tabs */}
                          <div className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1 mb-4">
                            {[
                              { key: 'add', label: 'Agregar puntos', icon: Plus },
                              redeemMode === 'direct'
                                ? { key: 'direct', label: 'Canje directo', icon: Coins }
                                : { key: 'redeem', label: 'Validar canje', icon: QrCode },
                            ].map(({ key, label, icon: Icon }) => (
                              <button
                                key={key}
                                onClick={() => setPointsTab(key)}
                                className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg transition-all ${
                                  pointsTab === key
                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                                    : 'text-gray-500 dark:text-gray-400'
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5" />
                                {label}
                              </button>
                            ))}
                          </div>

                          <AnimatePresence mode="wait">
                            {pointsTab === 'direct' ? (
                              <motion.div
                                key="direct"
                                initial={{ opacity: 0, x: 8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                className="space-y-3 text-left"
                              >
                                {/* Valor del saldo */}
                                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-100 dark:border-emerald-800">
                                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mb-0.5">
                                    Valor del saldo
                                  </p>
                                  <p className="text-sm text-emerald-800 dark:text-emerald-200">
                                    {current.toLocaleString()} pts ={' '}
                                    <strong>${(current * moneyPerPointRedeem).toLocaleString()}</strong> de descuento
                                    disponible
                                  </p>
                                </div>
                                <div>
                                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                                    Puntos a canjear
                                  </label>
                                  <div className="relative">
                                    <Input
                                      type="number"
                                      min="1"
                                      max={current}
                                      value={pointsToRedeem}
                                      onChange={(e) => setPointsToRedeem(e.target.value)}
                                      placeholder="0"
                                      className="h-11 text-base font-semibold pr-16"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
                                      pts
                                    </span>
                                  </div>
                                  {pointsToRedeem && parseInt(pointsToRedeem) > 0 && (
                                    <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1.5 font-medium">
                                      ={' '}
                                      <strong>
                                        ${(parseInt(pointsToRedeem) * moneyPerPointRedeem).toLocaleString()}
                                      </strong>{' '}
                                      de descuento
                                    </p>
                                  )}
                                  {pointsToRedeem && parseInt(pointsToRedeem) > current && (
                                    <p className="text-xs text-red-500 mt-1">
                                      El cliente solo tiene {current.toLocaleString()} puntos
                                    </p>
                                  )}
                                </div>
                                <Button
                                  className="w-full h-11 bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                                  onClick={handleDirectRedeem}
                                  disabled={
                                    processing ||
                                    !pointsToRedeem ||
                                    parseInt(pointsToRedeem) <= 0 ||
                                    parseInt(pointsToRedeem) > current
                                  }
                                >
                                  {processing ? (
                                    <span className="flex items-center gap-2">
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      Procesando...
                                    </span>
                                  ) : pointsToRedeem && parseInt(pointsToRedeem) > 0 ? (
                                    `Aplicar $${(parseInt(pointsToRedeem) * moneyPerPointRedeem).toLocaleString()} de descuento`
                                  ) : (
                                    'Aplicar descuento'
                                  )}
                                </Button>
                              </motion.div>
                            ) : pointsTab === 'add' ? (
                              <motion.div
                                key="add"
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 8 }}
                                className="space-y-3 text-left"
                              >
                                <div>
                                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                                    Monto de la compra
                                  </label>
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">
                                      $
                                    </span>
                                    <Input
                                      type="number"
                                      min="0"
                                      value={purchaseAmount}
                                      onChange={(e) => setPurchaseAmount(e.target.value)}
                                      placeholder="0"
                                      className="pl-7 h-11 text-base font-semibold"
                                    />
                                  </div>
                                  {pointsToAdd > 0 && (
                                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1.5 font-medium">
                                      = <strong>{pointsToAdd}</strong> {pointsToAdd === 1 ? 'punto' : 'puntos'} a
                                      acreditar
                                    </p>
                                  )}
                                </div>
                                <Button
                                  className="w-full h-11 bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                                  onClick={handleAddPoints}
                                  disabled={processing || !purchaseAmount || parseFloat(purchaseAmount) <= 0}
                                >
                                  {processing ? (
                                    <span className="flex items-center gap-2">
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      Agregando...
                                    </span>
                                  ) : (
                                    `Agregar${pointsToAdd > 0 ? ` ${pointsToAdd}` : ''} puntos`
                                  )}
                                </Button>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="redeem"
                                initial={{ opacity: 0, x: 8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -8 }}
                                className="space-y-3 text-left"
                              >
                                <div>
                                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">
                                    Código de canje
                                  </label>
                                  <Input
                                    value={redeemCodeInput}
                                    onChange={(e) => setRedeemCodeInput(e.target.value.toUpperCase())}
                                    placeholder="REP-XXXX"
                                    className="h-11 text-base font-mono tracking-widest"
                                  />
                                  {redeemCodeInput.startsWith('REP-') && redeemCodeInput.length >= 8 && (
                                    <div className="mt-2 p-3 rounded-xl bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                                      <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2">
                                        Canje encontrado
                                      </p>
                                      <div className="flex items-center gap-3">
                                        <img
                                          src="https://images.unsplash.com/photo-1562322140-8baeececf3df?w=120&h=120&fit=crop&q=80"
                                          alt="Corte de cabello"
                                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <p className="font-semibold text-green-900 dark:text-green-100">
                                            Corte de cabello
                                          </p>
                                          <span className="text-xs font-bold text-green-700 dark:text-green-300">
                                            300 pts
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                <Button
                                  className="w-full h-11 bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                                  onClick={handleValidateRedeem}
                                  disabled={processing || !redeemCodeInput.trim()}
                                >
                                  {processing ? (
                                    <span className="flex items-center gap-2">
                                      <Loader2 className="w-4 h-4 animate-spin" />
                                      Validando...
                                    </span>
                                  ) : (
                                    'Confirmar canje'
                                  )}
                                </Button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <>
                          {/* ── SELLOS: flujo original ── */}
                          {(() => {
                            const pending = card.redemptions?.find((r) => r.status === 'pending')
                            if (!pending) return null
                            return (
                              <div className="mb-4 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl text-left">
                                <div className="flex items-center gap-2 mb-1">
                                  <Gift className="w-4 h-4 text-green-600 dark:text-green-400" />
                                  <span className="text-sm font-semibold text-green-800 dark:text-green-200">
                                    {t('scanRewardReady')}
                                  </span>
                                </div>
                                <p className="text-xs text-green-700 dark:text-green-300 mb-2">
                                  {card.program?.reward_description}
                                </p>
                                <Button
                                  size="sm"
                                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => handleRedeemReward(pending.redemption_id)}
                                  disabled={redeemProcessing}
                                >
                                  {redeemProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                                  {t('scanRedeemReward')}
                                </Button>
                              </div>
                            )
                          })()}
                          <div className="mb-4 text-left">
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                              <span>{t('scanStampsLabel')}</span>
                              <span>
                                {current} / {required}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-amber-400 to-yellow-500 h-2 rounded-full transition-all"
                                style={{ width: `${Math.min(100, (current / required) * 100)}%` }}
                              />
                            </div>
                          </div>
                          <Button
                            className="w-full h-12 bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-base mb-3"
                            onClick={handleAddStamp}
                            disabled={processing}
                          >
                            {processing ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {t('scanAddingStamp')}
                              </span>
                            ) : (
                              t('scanAddStamp')
                            )}
                          </Button>
                        </>
                      )}

                      <Button variant="outline" className="w-full mt-2" onClick={resetScanner} disabled={processing}>
                        {t('cancel')}
                      </Button>
                    </>
                  )
                })()}

              {/* ── SUCCESS ── */}
              {step === 'success' && (
                <>
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {result?.isDirectRedeem
                      ? 'Descuento aplicado'
                      : result?.isPointsRedeem
                        ? 'Canje validado'
                        : result?.isPoints
                          ? 'Puntos agregados'
                          : result?.isRedemption
                            ? t('scanRewardRedeemed')
                            : t('scanStampAdded')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {result?.isDirectRedeem
                      ? `$${result.discount?.toLocaleString()} de descuento aplicado a ${result.customerName}`
                      : result?.isPointsRedeem
                        ? result.customerName
                        : result?.isPoints
                          ? `+${result.points} ${result.points === 1 ? 'punto' : 'puntos'} acreditados a ${result.customerName}`
                          : result?.isRedemption
                            ? t('scanRewardRedeemedSuccess')
                            : result?.customerName}
                  </p>

                  {/* Producto canjeado */}
                  {result?.isPointsRedeem && result.redeemItem && (
                    <div className="mb-6 p-3 rounded-xl bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-left">
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">
                        Entregar al cliente
                      </p>
                      <div className="flex items-center gap-3">
                        {result.redeemImage && (
                          <img
                            src={result.redeemImage}
                            alt={result.redeemItem}
                            className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-green-900 dark:text-green-100">{result.redeemItem}</p>
                          <span className="text-xs font-bold text-green-700 dark:text-green-300">
                            {result.redeemPoints} pts
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={handleClose}>
                      {t('scanClose')}
                    </Button>
                    <Button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black" onClick={resetScanner}>
                      {t('scanNewScan')}
                    </Button>
                  </div>
                </>
              )}

              {/* ── ERROR ── */}
              {step === 'error' && (
                <>
                  <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Error</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">{errorMsg || t('scanCouldNotProcess')}</p>
                  <div className="flex gap-3">
                    {isAuthError ? (
                      <>
                        <Button variant="outline" className="flex-1" onClick={handleClose}>
                          {t('scanClose')}
                        </Button>
                        <Button
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                          onClick={() => navigate('/login')}
                        >
                          {t('loginTitle')}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" className="flex-1" onClick={handleClose}>
                          {t('scanClose')}
                        </Button>
                        <Button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black" onClick={resetScanner}>
                          {t('scanRetry')}
                        </Button>
                      </>
                    )}
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  )
}
