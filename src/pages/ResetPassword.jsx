import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { api } from "@/api/client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Lock, ArrowLeft, CheckCircle2, XCircle, Eye, EyeOff, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { validatePassword } from "@/utils/passwordValidation";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    requirements: {
      hasMinLength: false,
      hasUppercase: false,
      hasNumber: false,
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async ({ email, token, password }) => {
      return await api.auth.updatePassword(email, token, password);
    },
    onSuccess: () => {
      toast.success('¡Contraseña actualizada exitosamente! Ya puedes iniciar sesión con tu nueva contraseña.');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Error al actualizar la contraseña';
      toast.error(errorMessage);
    }
  });

  const validatePasswords = () => {
    // Validar requisitos de contraseña
    const validation = validatePassword(password);
    if (!validation.isValid) {
      setPasswordError(validation.errors[0]);
      return false;
    }
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validatePasswords()) {
      return;
    }

    if (!email || !token) {
      toast.error('El enlace de restablecimiento no es válido o está incompleto');
      return;
    }

    updatePasswordMutation.mutate({ email, token, password });
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
                El enlace de restablecimiento no es válido o está incompleto.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => navigate('/login')}
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
            {updatePasswordMutation.isSuccess ? (
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            ) : (
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-yellow-600" />
              </div>
            )}
            <CardTitle className="text-2xl font-bold text-gray-900">
              {updatePasswordMutation.isSuccess ? '¡Contraseña Actualizada!' : 'Restablecer Contraseña'}
            </CardTitle>
            <CardDescription className="text-base pt-2">
              {updatePasswordMutation.isSuccess 
                ? 'Tu contraseña ha sido actualizada exitosamente. Por favor inicia sesión para continuar.'
                : 'Ingresa tu nueva contraseña. Asegúrate de que tenga al menos 6 caracteres.'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {!updatePasswordMutation.isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">
                    Nueva contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        const newPassword = e.target.value;
                        setPassword(newPassword);
                        // Validar contraseña en tiempo real
                        setPasswordValidation(validatePassword(newPassword));
                        if (confirmPassword && newPassword !== confirmPassword) {
                          setPasswordError('Las contraseñas no coinciden');
                        } else if (passwordError) {
                          setPasswordError('');
                        }
                      }}
                      required
                      className="h-12 border-2 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500/20 transition-all duration-300 pr-10"
                      disabled={updatePasswordMutation.isPending}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      disabled={updatePasswordMutation.isPending}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  
                  {/* Requisitos de contraseña */}
                  {password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2 text-sm mt-2"
                    >
                      <div className={`flex items-center gap-2 ${passwordValidation.requirements.hasMinLength ? 'text-green-600' : 'text-red-600'}`}>
                        {passwordValidation.requirements.hasMinLength ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                        <span>Mínimo 8 caracteres</span>
                      </div>
                      <div className={`flex items-center gap-2 ${passwordValidation.requirements.hasUppercase ? 'text-green-600' : 'text-red-600'}`}>
                        {passwordValidation.requirements.hasUppercase ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                        <span>Al menos una letra mayúscula</span>
                      </div>
                      <div className={`flex items-center gap-2 ${passwordValidation.requirements.hasNumber ? 'text-green-600' : 'text-red-600'}`}>
                        {passwordValidation.requirements.hasNumber ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                        <span>Al menos un número</span>
                      </div>
                    </motion.div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                    Confirmar contraseña
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (e.target.value !== password) {
                          setPasswordError('Las contraseñas no coinciden');
                        } else {
                          setPasswordError('');
                        }
                      }}
                      onBlur={validatePasswords}
                      required
                      className="h-12 border-2 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500/20 transition-all duration-300 pr-10"
                      disabled={updatePasswordMutation.isPending}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                      aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      disabled={updatePasswordMutation.isPending}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-sm text-red-600">{passwordError}</p>
                  )}
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-black font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={updatePasswordMutation.isPending || !password || !confirmPassword || !!passwordError}
                >
                  {updatePasswordMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    'Guardar nueva contraseña'
                  )}
                </Button>
              </form>
            ) : (
              <Button 
                onClick={() => navigate('/login')}
                className="w-full h-12 bg-black hover:bg-gray-800 text-white"
              >
                Ir al Login
              </Button>
            )}
            
            <div className="pt-4 text-center">
              <Link
                to="/login"
                className="inline-flex items-center text-sm text-gray-600 hover:text-yellow-600 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio de sesión
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

