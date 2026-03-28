import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Send, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import posthog from 'posthog-js'
import { useLanguage } from '@/components/auth/LanguageContext'
import { useNotifications } from '@/hooks/useNotifications'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const HEADER_MAX = 40
const BODY_MAX = 200

export default function Notifications() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const brandId = localStorage.getItem('brand_id')

  const [flagsReady, setFlagsReady] = useState(() => {
    // Flags may already be loaded if user navigated here after initial page load
    if (!posthog.__loaded) return true
    return posthog.getFeatureFlag('notifications') !== undefined
  })

  useEffect(() => {
    if (!flagsReady && posthog.__loaded) {
      posthog.onFeatureFlags(() => setFlagsReady(true))
    }
  }, [flagsReady])

  useEffect(() => {
    if (flagsReady && !posthog.isFeatureEnabled('notifications')) {
      navigate('/dashboard', { replace: true })
    }
  }, [flagsReady, navigate])

  const {
    programs,
    programsLoading,
    programId,
    setProgramId,
    header,
    setHeader,
    body,
    setBody,
    isSending,
    canSend,
    handleSend,
  } = useNotifications(brandId)

  if (!flagsReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-8 h-8 text-gray-700 dark:text-gray-300" />
            <h1 className="text-4xl font-bold leading-tight text-foreground">{t('notifications')}</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{t('notificationsDescription')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-lg"
        >
          <Card>
            <CardContent className="pt-6 space-y-6">
              {/* Program selector */}
              <div className="space-y-2">
                <Label>{t('notificationProgram')}</Label>
                <Select value={programId} onValueChange={setProgramId} disabled={programsLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('notificationAllPrograms')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('notificationAllPrograms')}</SelectItem>
                    {programs.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Header */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{t('notificationHeader')}</Label>
                  <span className="text-xs text-muted-foreground">
                    {header.length}/{HEADER_MAX}
                  </span>
                </div>
                <Input
                  value={header}
                  onChange={(e) => setHeader(e.target.value.slice(0, HEADER_MAX))}
                  placeholder={t('notificationHeaderPlaceholder')}
                  maxLength={HEADER_MAX}
                />
              </div>

              {/* Body */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{t('notificationBody')}</Label>
                  <span className="text-xs text-muted-foreground">
                    {body.length}/{BODY_MAX}
                  </span>
                </div>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value.slice(0, BODY_MAX))}
                  placeholder={t('notificationBodyPlaceholder')}
                  maxLength={BODY_MAX}
                  rows={4}
                />
              </div>

              {/* Info */}
              <p className="text-xs text-muted-foreground">{t('notificationInfo')}</p>

              {/* Send button */}
              <Button onClick={handleSend} disabled={!canSend || isSending} className="w-full">
                {isSending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                {t('notificationSend')}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
