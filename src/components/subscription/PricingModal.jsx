import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Crown, X, Loader2 } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function PricingModal({ open, onOpenChange, brand }) {
  const queryClient = useQueryClient();

  const updatePlanMutation = useMutation({
    mutationFn: async (newPlan) => {
      if (!brand?.id) return;
      return api.brands.update(brand.id, { subscription_plan: newPlan });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brand'] });
      toast.success("Plan actualizado correctamente");
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Error al actualizar el plan");
    }
  });

  const currentPlan = brand?.subscription_plan || 'free';

  const handleSubscribe = (planType) => {
    updatePlanMutation.mutate(planType);
  };

  const plans = [
    {
      id: "free",
      name: "Starter",
      price: "Gratis",
      description: "Ideal para probar la plataforma",
      features: [
        "1 Tarjeta de Lealtad",
        "1 Sucursal",
        "1 Usuario",
        "100 clientes máximo",
        "Analíticas básicas"
      ],
      notIncluded: [
        "Compartir tarjetas",
        "Sin marca de agua",
        "Soporte prioritario"
      ],
      current: currentPlan === 'free'
    },
    {
      id: "pro",
      name: "Pro",
      price: "$29/mes",
      description: "Para negocios en crecimiento",
      features: [
        "Tarjetas ilimitadas",
        "Sucursales ilimitadas",
        "Usuarios ilimitados",
        "Clientes ilimitados",
        "Compartir tarjetas públicamente",
        "Analíticas avanzadas",
        "Soporte prioritario"
      ],
      popular: true,
      trial: true,
      current: currentPlan === 'pro'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-2">Mejora tu Plan</DialogTitle>
          <DialogDescription className="text-center mb-6">
            Desbloquea todo el potencial de tu programa de lealtad
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 py-4">
          {plans.map((plan) => (
            <Card key={plan.name} className={`p-6 relative border-2 ${plan.popular ? 'border-yellow-400 shadow-xl' : 'border-transparent'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-yellow-400 text-black hover:bg-yellow-500 px-3 py-1">
                    Más Popular
                  </Badge>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold mb-2">{plan.price}</div>
                <p className="text-gray-500 text-sm">{plan.description}</p>
              </div>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className="mt-0.5 bg-green-100 text-green-600 rounded-full p-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
                {plan.notIncluded?.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-gray-400">
                    <div className="mt-0.5 bg-gray-100 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <Button 
                className={`w-full ${plan.popular ? 'bg-black text-white hover:bg-gray-800' : 'bg-white text-black border hover:bg-gray-50'}`}
                disabled={plan.current || updatePlanMutation.isPending}
                onClick={() => handleSubscribe(plan.id)}
              >
                {updatePlanMutation.isPending && !plan.current ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {plan.current ? 'Plan Actual' : (plan.trial ? 'Prueba Gratis 7 días' : 'Suscribirse')}
              </Button>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}