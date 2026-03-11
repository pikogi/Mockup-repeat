import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreditCard, Plus } from 'lucide-react';
import { motion } from "framer-motion";
import { createPageUrl } from '@/utils';

export default function Step3CTA() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-12 text-center max-w-2xl mx-auto bg-white shadow-xl border-0">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-50 to-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CreditCard className="w-12 h-12 text-black" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Crea tu primer Club de Fidelidad
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              Ahora que tienes una cuenta, crea diferentes clubes para hacer que tus clientes vuelvan una y otra vez.
            </p>
            
            <Button
              size="lg"
              className="h-14 px-8 text-lg bg-black hover:bg-gray-800 gap-3 shadow-lg hover:shadow-xl transition-all"
              onClick={() => navigate(createPageUrl('CreateClub'))}
            >
              <Plus className="w-6 h-6" />
              Crear Club
            </Button>
        </Card>
      </motion.div>
    </div>
  );
}
