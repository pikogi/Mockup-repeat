import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from "@/api/client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, CheckCircle2, XCircle, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  const hasVerified = useRef(false);

  const verifyEmailMutation = useMutation({
    mutationFn: async ({ email, token }) => {
      return await api.auth.verifyEmail(email, token);
    },
    onSuccess: () => {
      // El token ya está guardado automáticamente en api.auth.verifyEmail()
      // Mostrar mensaje de éxito - el usuario debe hacer login manualmente
      toast.success('¡Email verificado exitosamente! Ya puedes iniciar sesión.');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Error al verificar el email';
      toast.error(errorMessage);
    }
  });

  useEffect(() => {
    // Verificar automáticamente solo una vez cuando se carga el componente
    if (email && token && !hasVerified.current) {
      hasVerified.current = true;
      verifyEmailMutation.mutate({ email, token });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, token]);

  const handleGoToLogin = () => {
    navigate('/login');
  };

  // Si no hay token o email, mostrar error
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
              <CardTitle className="text-2xl">Enlace Inválido</CardTitle>
              <CardDescription className="pt-2">
                El enlace de verificación no es válido o está incompleto.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleGoToLogin}
                className="w-full bg-black hover:bg-gray-800 text-white"
              >
                Ir al Login
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
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
              {verifyEmailMutation.isPending && 'Verificando Email...'}
              {verifyEmailMutation.isSuccess && '¡Email Verificado!'}
              {verifyEmailMutation.isError && 'Error de Verificación'}
              {!verifyEmailMutation.isPending && !verifyEmailMutation.isSuccess && !verifyEmailMutation.isError && 'Verificación de Email'}
            </CardTitle>
            
            <CardDescription className="pt-2">
              {verifyEmailMutation.isPending && 'Por favor espera mientras verificamos tu email...'}
              {verifyEmailMutation.isSuccess && 'Tu email ha sido verificado exitosamente. Por favor inicia sesión para continuar.'}
              {verifyEmailMutation.isError && (
                verifyEmailMutation.error?.response?.data?.message || 
                'Hubo un error al verificar tu email. El enlace puede haber expirado o ser inválido.'
              )}
              {!verifyEmailMutation.isPending && !verifyEmailMutation.isSuccess && !verifyEmailMutation.isError && 
                `Verificando email: ${email}`
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {verifyEmailMutation.isSuccess && (
              <Button 
                onClick={handleGoToLogin}
                className="w-full bg-black hover:bg-gray-800 text-white"
              >
                Ir al Login
              </Button>
            )}
            
            {verifyEmailMutation.isError && (
              <div className="space-y-2">
                <Button 
                  onClick={() => navigate('/login')}
                  className="w-full bg-black hover:bg-gray-800 text-white"
                >
                  Ir al Login
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  Si el problema persiste, contacta al administrador o intenta registrarte nuevamente.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

