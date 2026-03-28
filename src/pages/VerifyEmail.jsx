import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '@/api/client'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2, CheckCircle2, XCircle, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/components/auth/LanguageContext'

export default function VerifyEmail() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')
  const token = searchParams.get('token')
  const hasVerified = useRef(false)

  const verifyEmailMutation = useMutation({
    mutationFn: async ({ email, token }) => {
      return await api.auth.verifyEmail(email, token)
    },
    onSuccess: () => {
      toast.success(t('verifySuccessToast'))
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || t('verifyErrorToast')
      toast.error(errorMessage)
    },
  })

  useEffect(() => {
    if (email && token && !hasVerified.current) {
      hasVerified.current = true
      verifyEmailMutation.mutate({ email, token })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, token])

  const handleGoToLogin = () => {
    navigate('/login')
  }

  if (!email || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="bg-white shadow-xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl">{t('verifyInvalidLink')}</CardTitle>
              <CardDescription className="pt-2">{t('verifyInvalidLinkDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleGoToLogin} className="w-full bg-black hover:bg-gray-800 text-white">
                {t('goToLogin')}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <Card className="bg-white shadow-xl">
          <CardHeader className="text-center">
            {verifyEmailMutation.isPending && (
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
            )}
            {verifyEmailMutation.isSuccess && (
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            )}
            {verifyEmailMutation.isError && (
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            )}
            {!verifyEmailMutation.isPending && !verifyEmailMutation.isSuccess && !verifyEmailMutation.isError && (
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-gray-600" />
              </div>
            )}

            <CardTitle className="text-2xl">
              {verifyEmailMutation.isPending && t('verifyVerifying')}
              {verifyEmailMutation.isSuccess && t('verifySuccess')}
              {verifyEmailMutation.isError && t('verifyErrorTitle')}
              {!verifyEmailMutation.isPending &&
                !verifyEmailMutation.isSuccess &&
                !verifyEmailMutation.isError &&
                t('verifyTitle')}
            </CardTitle>

            <CardDescription className="pt-2">
              {verifyEmailMutation.isPending && t('verifyWaiting')}
              {verifyEmailMutation.isSuccess && t('verifySuccessDesc')}
              {verifyEmailMutation.isError &&
                (verifyEmailMutation.error?.response?.data?.message || t('verifyErrorDesc'))}
              {!verifyEmailMutation.isPending &&
                !verifyEmailMutation.isSuccess &&
                !verifyEmailMutation.isError &&
                `${t('verifyingEmail')}: ${email}`}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {verifyEmailMutation.isSuccess && (
              <Button onClick={handleGoToLogin} className="w-full bg-black hover:bg-gray-800 text-white">
                {t('goToLogin')}
              </Button>
            )}

            {verifyEmailMutation.isError && (
              <div className="space-y-2">
                <Button onClick={() => navigate('/login')} className="w-full bg-black hover:bg-gray-800 text-white">
                  {t('goToLogin')}
                </Button>
                <p className="text-xs text-gray-500 text-center">{t('verifyPersistError')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
