import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from "@/api/client";
import { decodeJWT, hasValidToken } from "@/utils/jwt";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { validatePassword } from "@/utils/passwordValidation";

// Componente de animación de máquina de escribir
function Typewriter({ text, speed = 100, delay = 0 }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }
    }, currentIndex === 0 ? delay : speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, speed, delay]);

  // Reiniciar cuando cambia el texto
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, [text]);

  return (
    <span>
      {displayedText}
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
          className="inline-block w-0.5 h-4 bg-yellow-500 ml-1 align-middle"
        />
      )}
    </span>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [showLoginError, setShowLoginError] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    isValid: false,
    requirements: {
      hasMinLength: false,
      hasUppercase: false,
      hasNumber: false,
    },
  });

  // Verificar si el usuario ya está autenticado y redirigir
  useEffect(() => {
    const isAuthenticated = hasValidToken();
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await api.auth.login(email, password);
      return response;
    },
    onSuccess: async (response) => {
      toast.success('¡Inicio de sesión exitoso!');
      
      // Obtener el token de la respuesta o de localStorage (api.auth.login ya lo guarda)
      const token = response?.data?.token;
      
      if (token) {
        // Decodificar el JWT para obtener el payload
        const decoded = decodeJWT(token);
        
        if (decoded) {
          // Guardar campos en localStorage
       
          const { onboarding_completed, full_name, email } = decoded;

            localStorage.setItem('user_onboarding_completed', String(onboarding_completed));
        
            localStorage.setItem('user_full_name', full_name);
          
            localStorage.setItem('user_email', email);

          // Redirigir según onboarding_completed          
          if (onboarding_completed) {
            navigate('/dashboard');
          } else {
            navigate('/onboarding');
          }
        } else {
          // Si no se puede decodificar, mostrar error
          toast.error('Error al procesar la autenticación. Intenta nuevamente.');
        }
      } else {
        // Si no hay token, mostrar error
        toast.error('Error al procesar la autenticación. Intenta nuevamente.');
      }
    },
    onError: (error) => {
      // Si el error es por verificación requerida, mostrar mensaje especial
      if (error.response?.data?.requiresVerification) {
        setShowVerificationMessage(true);
        setVerificationEmail(formData.email);
        toast.error('Por favor verifica tu correo electrónico antes de iniciar sesión');
      } else if (error.response?.status === 401) {
        // Si es un 401 (Unauthorized), podría ser porque el email no está verificado
        const errorMessage = error.response?.data?.message || error.message || 'Credenciales inválidas';
        if (errorMessage.toLowerCase().includes('invalid credentials') ||
            errorMessage.toLowerCase().includes('credenciales inválidas')) {
          setShowLoginError(true);
          toast.error(
            'Credenciales inválidas. Intenta nuevamente.',
            { duration: 5000 }
          );
        } else {
          toast.error(errorMessage);
        }
      } else if (!error.response) {
        // Error de red (CORS, servidor no disponible, etc.)
        setShowLoginError(true);
        toast.error('Error de conexión. Verifica tu conexión a internet e intenta nuevamente.', { duration: 5000 });
      } else {
        setShowLoginError(true);
        toast.error(error.message || 'Error al iniciar sesión');
      }
    }
  });

  const registerMutation = useMutation({
    mutationFn: async ({ email, password, name }) => {
      // Validar contraseña antes de enviar al backend
      const validation = validatePassword(password);
      if (!validation.isValid) {
        throw new Error(validation.errors[0]);
      }
      const response = await api.auth.register(email, password, name);
      return response;
    },
    onSuccess: async () => {
      setVerificationEmail(formData.email);
      setShowVerificationMessage(true);
      toast.success('¡Registro exitoso! Por favor verifica tu correo electrónico.');
    },
    onError: (error) => {
      const errorMessage = error.message || error.response?.data?.message || 'Error al registrarse';
      toast.error(errorMessage);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Limpiar mensajes de error previos
    setShowLoginError(false);
    setShowVerificationMessage(false);
    
    if (isLogin) {
      loginMutation.mutate({ email: formData.email, password: formData.password });
    } else {
      registerMutation.mutate(formData);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 relative overflow-hidden">
      {/* Efectos de fondo decorativos con animaciones */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradientes animados */}
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-yellow-400/20 via-yellow-500/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-yellow-400/20 via-yellow-500/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Elementos decorativos adicionales */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-gray-800/30 to-gray-700/20 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-gradient-to-l from-gray-800/30 to-gray-700/20 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Líneas de gradiente sutiles */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-900/50 via-transparent to-gray-900/50"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-gray-800/20 to-transparent"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1]
        }}
        className="w-full max-w-md relative z-10"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="w-full border-0 shadow-2xl backdrop-blur-md bg-white/95 hover:bg-white/98 transition-all duration-300">
          <CardHeader className="text-center pb-8 pt-10">
            {/* Logo de Repeat */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: 0.4,
                type: "spring",
                stiffness: 200,
                damping: 15
              }}
              className="mb-0"
            >
              <motion.h1 
                className="text-5xl font-bold bg-gradient-to-r from-black via-gray-800 to-black bg-clip-text text-transparent mb-2"
                animate={{
                  backgroundPosition: ["0%", "100%", "0%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: "200% auto"
                }}
              >
                Repeat
              </motion.h1>
            </motion.div>
            
            {/* Animación de máquina de escribir */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-2"
              style={{ marginBottom: '2rem' }}
            >
              <p className="text-lg text-gray-600 font-medium min-h-[28px]">
                <Typewriter 
                  text="What your clients love 💛" 
                  speed={80}
                  delay={800}
                />
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              style={{ marginTop: '-1rem' }}
            >
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                {isLogin ? 'Iniciar sesión' : 'Crear cuenta'}
              </CardTitle>
              <CardDescription className="text-base">
                {isLogin 
                  ? 'Bienvenido de vuelta' 
                  : 'Comienza tu viaje con nosotros'}
              </CardDescription>
            </motion.div>
          </CardHeader>
          
          <CardContent className="space-y-6 pb-8" style={{ marginTop: '-1rem' }}>
            {/* Botón de Google */}
            {/*<motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium shadow-sm transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
                onClick={handleGoogleLogin}
              >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar con Google
              </Button>
            </motion.div>*/}

            {/* Divisor */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="relative"
            >
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Continúa con tu email</span>
              </div>
            </motion.div>

            {/* Mensaje de verificación de email */}
            {showVerificationMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-4"
              >
                <p className="text-sm text-yellow-800 mb-3">
                  Se ha enviado un correo de verificación a <strong>{verificationEmail}</strong>. 
                  Por favor revisa tu bandeja de entrada (y la carpeta de spam) y haz clic en el enlace para activar tu cuenta.
                </p>
                <p className="text-xs text-yellow-700 mb-3">
                  Si no recibes el correo en unos minutos, verifica tu carpeta de spam o contacta al administrador.
                </p>
                {/* Botón deshabilitado temporalmente - endpoint /auth/resend-verification no existe en el backend */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast.info('El reenvío de correo no está disponible actualmente. Por favor verifica tu bandeja de entrada y spam.');
                  }}
                  disabled={true}
                  className="w-full text-yellow-800 border-yellow-300 hover:bg-yellow-100 opacity-50 cursor-not-allowed"
                >
                  Reenviar correo de verificación (No disponible)
                </Button>
              </motion.div>
            )}

            {/* Mensaje de error de login (credenciales inválidas) */}
            {showLoginError && isLogin && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4"
              >
                <p className="text-sm text-red-800 mb-2">
                  <strong>Error de autenticación:</strong> Las credenciales proporcionadas no son válidas.
                </p>
                <p className="text-xs text-red-700">
                  Si acabas de registrarte, es posible que necesites verificar tu correo electrónico antes de poder iniciar sesión. 
                  Por favor revisa tu bandeja de entrada (incluyendo la carpeta de spam) y haz clic en el enlace de verificación.
                </p>
              </motion.div>
            )}

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              onSubmit={handleSubmit} 
              className="space-y-5"
            >
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2"
                >
                  <Label htmlFor="name" className="text-gray-700 font-medium">
                    Nombre
                  </Label>
                  <motion.div
                    whileFocus={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      id="name"
                      type="text"
                      placeholder="Tu nombre completo"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required={!isLogin}
                      className="h-12 border-2 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500/20 transition-all duration-300"
                    />
                  </motion.div>
                </motion.div>
              )}
              
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email
                </Label>
                <motion.div
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="h-12 border-2 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500/20 transition-all duration-300"
                  />
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.3 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700 font-medium">
                    Contraseña
                  </Label>
                  {isLogin && (
                    <motion.button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-yellow-600 hover:text-yellow-700 hover:underline font-medium transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ¿Olvidaste tu contraseña?
                    </motion.button>
                  )}
                </div>
                <motion.div
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => {
                      const newPassword = e.target.value;
                      setFormData({ ...formData, password: newPassword });
                      // Validar contraseña en tiempo real solo en modo registro
                      if (!isLogin) {
                        setPasswordValidation(validatePassword(newPassword));
                      }
                    }}
                    required
                    className="h-12 border-2 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500/20 transition-all duration-300 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </motion.div>
                
                {/* Requisitos de contraseña (solo en modo registro) */}
                {!isLogin && formData.password && (
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
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.4 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-black font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={loginMutation.isPending || registerMutation.isPending}
                  >
                {(loginMutation.isPending || registerMutation.isPending) ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {isLogin ? 'Iniciando sesión...' : 'Creando cuenta...'}
                  </>
                ) : (
                  isLogin ? 'Iniciar sesión' : 'Crear cuenta'
                  )}
                </Button>
                </motion.div>
              </motion.div>
            </motion.form>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.4 }}
              className="pt-4 text-center"
            >
              <motion.button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ email: '', password: '', name: '' });
                  setShowLoginError(false);
                  setShowVerificationMessage(false);
                  setPasswordValidation({
                    isValid: false,
                    requirements: {
                      hasMinLength: false,
                      hasUppercase: false,
                      hasNumber: false,
                    },
                  });
                }}
                className="text-sm text-gray-600 hover:text-yellow-600 font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLogin 
                  ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
                <span className="text-yellow-600 hover:underline font-semibold">
                  {isLogin ? 'Regístrate' : 'Inicia sesión'}
                </span>
              </motion.button>
            </motion.div>
          </CardContent>
        </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

