import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from "@/api/client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Mail, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const resetPasswordMutation = useMutation({
    mutationFn: async (email) => {
      return await api.auth.resetPassword(email);
    },
    onSuccess: () => {
      toast.success('Se ha enviado un correo con las instrucciones para restablecer tu contraseña. Por favor revisa tu bandeja de entrada.');
      // Opcional: redirigir después de un momento
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || error.message || 'Error al enviar el correo de restablecimiento';
      toast.error(errorMessage);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Por favor ingresa tu correo electrónico');
      return;
    }
    resetPasswordMutation.mutate(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              ¿Olvidaste tu contraseña?
            </CardTitle>
            <CardDescription className="text-base pt-2">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Correo electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 border-2 border-gray-200 focus:border-yellow-500 focus:ring-yellow-500/20 transition-all duration-300"
                  disabled={resetPasswordMutation.isPending}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-black font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={resetPasswordMutation.isPending || !email.trim()}
              >
                {resetPasswordMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Restablecer contraseña'
                )}
              </Button>
            </form>
            
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

