import { Plus, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ─── Lista editable (servicios / productos / beneficios) ──────────────────────

function TagListField({ label, placeholder, items, onChange }) {
  const addItem = () => onChange([...items, { name: '' }])
  const updateItem = (index, name) => onChange(items.map((it, i) => (i === index ? { name } : it)))
  const removeItem = (index) => onChange(items.filter((_, i) => i !== index))

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Input
              value={item.name}
              onChange={(e) => updateItem(i, e.target.value)}
              placeholder={placeholder}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeItem(i)}
              className="text-gray-400 hover:text-red-500"
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-1.5 text-gray-500">
          <Plus className="w-3.5 h-3.5" /> Agregar
        </Button>
      </div>
    </div>
  )
}

// ─── Toggle segmentado (2 opciones) ────────────────────────────────────────────

function SegmentedToggle({ options, value, onChange }) {
  return (
    <div className="flex rounded-lg border border-input overflow-hidden text-sm w-fit">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            'px-3.5 py-2 font-medium transition-colors',
            value === opt.value ? 'bg-gray-900 text-white' : 'bg-background text-gray-500 hover:bg-gray-50',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

// ─── Formulario de plan ────────────────────────────────────────────────────────

export default function PlanFormDialog({ open, onOpenChange, formData, setFormData, onSave, editingId }) {
  const set = (field, value) => setFormData((f) => ({ ...f, [field]: value }))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingId ? 'Editar plan' : 'Nuevo plan de membresía'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <div className="space-y-1.5">
            <Label>
              Nombre <span className="text-red-400">*</span>
            </Label>
            <Input placeholder="Ej: Plus" value={formData.name} onChange={(e) => set('name', e.target.value)} />
          </div>

          <div className="space-y-1.5">
            <Label>Descripción</Label>
            <Textarea
              placeholder="Para quién es este plan y qué lo hace especial..."
              value={formData.description}
              onChange={(e) => set('description', e.target.value)}
              rows={2}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Color</Label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => set('color', e.target.value)}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white"
              />
              <Input
                value={formData.color}
                onChange={(e) => set('color', e.target.value)}
                className="flex-1 font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Facturación y precio</Label>
            <div className="flex gap-2">
              <SegmentedToggle
                options={[
                  { value: 'monthly', label: 'Mensual' },
                  { value: 'annual', label: 'Anual' },
                ]}
                value={formData.billing_period}
                onChange={(v) => set('billing_period', v)}
              />
              <Input
                type="number"
                placeholder="0"
                value={formData.price}
                onChange={(e) => set('price', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Días de prueba gratis</Label>
              <Input
                type="number"
                placeholder="0"
                value={formData.trial_days}
                onChange={(e) => set('trial_days', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Límite de miembros</Label>
              <Input
                type="number"
                placeholder="Sin límite"
                value={formData.member_limit}
                onChange={(e) => set('member_limit', e.target.value)}
              />
            </div>
          </div>

          <TagListField
            label="Servicios incluidos"
            placeholder="Ej: 2 cortes al mes"
            items={formData.included_services}
            onChange={(v) => set('included_services', v)}
          />

          <TagListField
            label="Productos incluidos"
            placeholder="Ej: Cera para barba"
            items={formData.included_products}
            onChange={(v) => set('included_products', v)}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Descuento en tienda (%)</Label>
              <Input
                type="number"
                placeholder="0"
                value={formData.discount_pct}
                onChange={(e) => set('discount_pct', e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Multiplicador de puntos</Label>
              <Input
                type="number"
                step="0.5"
                placeholder="1"
                value={formData.point_multiplier}
                onChange={(e) => set('point_multiplier', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Recompensa de bienvenida</Label>
            <Input
              placeholder="Ej: Corte de bienvenida gratis"
              value={formData.welcome_reward}
              onChange={(e) => set('welcome_reward', e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Recompensa de renovación</Label>
            <Input
              placeholder="Ej: 10% off en tu próxima renovación"
              value={formData.renewal_reward}
              onChange={(e) => set('renewal_reward', e.target.value)}
            />
          </div>

          <TagListField
            label="Beneficios exclusivos"
            placeholder="Ej: Reserva prioritaria"
            items={formData.perks}
            onChange={(v) => set('perks', v)}
          />

          <div className="space-y-1.5">
            <Label>Política de cancelación</Label>
            <SegmentedToggle
              options={[
                { value: 'anytime', label: 'En cualquier momento' },
                { value: 'end_of_period', label: 'Al fin del período' },
              ]}
              value={formData.cancellation_policy}
              onChange={(v) => set('cancellation_policy', v)}
            />
          </div>

          <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Permitir pausar membresía</p>
              <p className="text-xs text-gray-400">Los miembros pueden pausar en vez de cancelar</p>
            </div>
            <Switch checked={formData.allow_pause} onCheckedChange={(v) => set('allow_pause', v)} />
          </div>

          <div className="flex items-center justify-between py-2 border-t border-gray-100 dark:border-gray-800">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Plan activo</p>
              <p className="text-xs text-gray-400">Los clientes pueden sumarse a este plan</p>
            </div>
            <Switch checked={formData.active} onCheckedChange={(v) => set('active', v)} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button className="flex-1" onClick={onSave} disabled={!formData.name.trim() || !formData.price}>
              {editingId ? 'Guardar cambios' : 'Crear plan'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
