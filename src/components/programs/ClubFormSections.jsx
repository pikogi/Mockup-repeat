import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  Loader2,
  Upload,
  Plus,
  Trash2,
  ImageIcon,
  Package,
  ArrowRightLeft,
  Users,
  Zap,
  Check,
  CheckCircle2,
  Copy,
  Building2,
  ChevronDown,
  Pencil,
  X,
  Megaphone,
} from 'lucide-react'
import { useLanguage } from '@/components/auth/LanguageContext'

export function StoreSelector({ stores, formData, setFormData }) {
  const { t } = useLanguage()

  if (stores.length <= 1) return null

  return (
    <div className="space-y-2">
      <Label>{t('formStores')} *</Label>
      <p className="text-xs text-gray-500 dark:text-gray-400">{t('formStoresDesc')}</p>
      <div className="space-y-2 pt-1">
        {stores.map((store) => {
          const storeId = store.store_id || store.id
          const isChecked = formData.selected_store_ids.includes(storeId)
          return (
            <label
              key={storeId}
              className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => {
                  setFormData((prev) => ({
                    ...prev,
                    selected_store_ids: isChecked
                      ? prev.selected_store_ids.filter((id) => id !== storeId)
                      : [...prev.selected_store_ids, storeId],
                  }))
                }}
                className="w-4 h-4 accent-black"
              />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {store.store_name || store.name}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

const POINTS_TYPE_ID = '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc157'
const COUPON_TYPE_ID = '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc156'
const MEMBERSHIP_TYPE_ID = '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc155'
const CASHBACK_TYPE_ID = '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc154'

const TYPE_DESCRIPTIONS = {
  [POINTS_TYPE_ID]:
    'Los clientes acumulan puntos según el monto gastado. Vos definís cuánto dinero equivale a 1 punto y cuánto vale cada punto al canjear.',
  [COUPON_TYPE_ID]:
    'Emitís cupones digitales con descuentos o beneficios. Los clientes los reciben automáticamente y los presentan en caja para usarlos.',
  [MEMBERSHIP_TYPE_ID]:
    'Los clientes pagan una cuota mensual o anual para acceder a beneficios exclusivos. Ideal para fidelizar con servicios recurrentes.',
  [CASHBACK_TYPE_ID]:
    'El cliente recibe un porcentaje de cada compra como saldo a favor. Cuando acumula suficiente, lo usa como descuento en su próxima visita.',
  default:
    'Programa clásico donde los clientes acumulan sellos por cada compra. Al completar todos los sellos, obtienen una recompensa. Ejemplo: Compra 5 cafés, el 6° es gratis.',
}

export function ProgramTypeSelector({ formData, setFormData, className }) {
  const { t } = useLanguage()

  return (
    <div className={`space-y-2 ${className || ''}`}>
      <Label htmlFor="program_type_id">{t('formProgramType')} *</Label>
      <Select
        value={formData.program_type_id}
        onValueChange={(value) => setFormData((prev) => ({ ...prev, program_type_id: value }))}
      >
        <SelectTrigger className="h-12">
          <SelectValue placeholder={t('formProgramTypePlaceholder')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc151">{t('formStampsType')}</SelectItem>
          <SelectItem value="7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc157">Puntos</SelectItem>
          <SelectItem value={COUPON_TYPE_ID}>Cupones</SelectItem>
          <SelectItem value={MEMBERSHIP_TYPE_ID}>Membresías</SelectItem>
          <SelectItem value={CASHBACK_TYPE_ID}>Cashback</SelectItem>
        </SelectContent>
      </Select>
      <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-300 rounded-lg">
        <p className="text-xs text-yellow-900 dark:text-yellow-200 leading-relaxed">
          {TYPE_DESCRIPTIONS[formData.program_type_id] ?? TYPE_DESCRIPTIONS.default}
        </p>
      </div>
    </div>
  )
}

export function BasicInfoFields({ formData, setFormData, setIsFlipped }) {
  const { t } = useLanguage()
  const isPoints = formData.program_type_id === POINTS_TYPE_ID
  const isCoupon = formData.program_type_id === COUPON_TYPE_ID
  const isMembership = formData.program_type_id === MEMBERSHIP_TYPE_ID
  const isCashback = formData.program_type_id === CASHBACK_TYPE_ID

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="club_name">{t('clubName')} *</Label>
        <Input
          id="club_name"
          value={formData.club_name}
          onChange={(e) => setFormData((prev) => ({ ...prev, club_name: e.target.value }))}
          onFocus={() => setIsFlipped(false)}
          placeholder={t('clubNamePlaceholder')}
          required
          className="h-12"
        />
      </div>

      <div className="space-y-2 ">
        <div className="flex items-center gap-2">
          <Label htmlFor="description">{t('description')}</Label>
          <span className="text-xs text-gray-400 dark:text-gray-500">{t('formInternalOnly')}</span>
        </div>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          onFocus={() => setIsFlipped(false)}
          placeholder={t('descriptionPlaceholder')}
          rows={3}
        />
      </div>

      {!isCoupon && !isMembership && !isCashback && (
        <div className="space-y-2">
          <Label htmlFor="reward_text">{t('rewardOffer')} *</Label>
          <Input
            id="reward_text"
            value={formData.reward_text}
            onChange={(e) => setFormData((prev) => ({ ...prev, reward_text: e.target.value }))}
            onFocus={() => setIsFlipped(false)}
            placeholder={t('rewardOfferPlaceholder')}
            required
            maxLength={35}
            className="h-12"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formData.reward_text?.length || 0}/35 {t('formCharacters')}
          </p>
        </div>
      )}

      {!isPoints && !isCoupon && !isMembership && !isCashback && (
        <div className="space-y-2">
          <Label htmlFor="stamps_required">{t('stampsRequired')}</Label>
          <Input
            id="stamps_required"
            type="number"
            min="1"
            max="20"
            value={formData.stamps_required || ''}
            onChange={(e) => {
              const inputValue = e.target.value
              if (inputValue === '') {
                setFormData((prev) => ({ ...prev, stamps_required: '' }))
              } else {
                const numValue = parseInt(inputValue)
                if (!isNaN(numValue) && numValue >= 1 && numValue <= 20) {
                  setFormData((prev) => ({ ...prev, stamps_required: numValue }))
                }
              }
            }}
            onFocus={() => setIsFlipped(false)}
            onBlur={(e) => {
              const currentValue = e.target.value
              if (currentValue === '' || isNaN(parseInt(currentValue)) || parseInt(currentValue) < 1) {
                setFormData((prev) => ({ ...prev, stamps_required: 20 }))
              } else if (parseInt(currentValue) > 20) {
                setFormData((prev) => ({ ...prev, stamps_required: 20 }))
              }
            }}
            className="h-12"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('formMaxStamps')}</p>
        </div>
      )}
    </>
  )
}

function CurrencyInput({ id, value, onChange }) {
  return (
    <div className="relative flex-1">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">$</span>
      <Input id={id} type="number" min="1" value={value} onChange={onChange} className="h-12 pl-7" />
    </div>
  )
}

function ThresholdRedeemFields({ formData, setFormData }) {
  const pointsThreshold = formData.points_threshold ?? 100

  return (
    <div className="space-y-2">
      <Label htmlFor="points_threshold">Puntos requeridos</Label>
      <p className="text-xs text-gray-500 dark:text-gray-400">Cantidad de puntos para obtener la recompensa</p>
      <div className="flex items-center gap-3 max-w-[200px]">
        <Input
          id="points_threshold"
          type="number"
          min="1"
          value={pointsThreshold}
          onChange={(e) => {
            const v = parseInt(e.target.value)
            if (!isNaN(v) && v >= 1) setFormData((prev) => ({ ...prev, points_threshold: v }))
          }}
          className="h-12"
        />
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        En este modo la recompensa es fija. Definila en el campo &quot;Recompensa&quot;.
      </p>
    </div>
  )
}

function AccumulationField({ formData, setFormData }) {
  const moneyPerPoint = formData.money_per_point ?? 1000

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acumulación</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">Monto en moneda necesario para ganar 1 punto</p>
      <div className="flex items-center gap-3">
        <CurrencyInput
          id="money_per_point"
          value={moneyPerPoint}
          onChange={(e) => {
            const v = parseInt(e.target.value)
            if (!isNaN(v) && v >= 1) setFormData((prev) => ({ ...prev, money_per_point: v }))
          }}
        />
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">= 1 punto</span>
      </div>
    </div>
  )
}

function ThresholdValueSection({ formData, setFormData }) {
  const moneyPerPoint = formData.money_per_point ?? 1000
  const pointsThreshold = formData.points_threshold ?? 100
  const totalSpendForReward = moneyPerPoint * pointsThreshold

  return (
    <div className="space-y-5">
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Valor del punto</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Tasa para convertir importe en puntos. La recompensa al alcanzar el umbral es fija.
        </p>
      </div>

      <AccumulationField formData={formData} setFormData={setFormData} />

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Ej: Gasta <strong className="text-gray-700 dark:text-gray-300">${totalSpendForReward.toLocaleString()}</strong>{' '}
        → gana <strong className="text-gray-700 dark:text-gray-300">{pointsThreshold} puntos</strong>. Recibe la
        recompensa automáticamente.
      </p>
    </div>
  )
}

function PointsValueSection({ formData, setFormData }) {
  const moneyPerPoint = formData.money_per_point ?? 1000
  const moneyPerPointRedeem = formData.money_per_point_redeem ?? 100
  const exampleSpend = moneyPerPoint * 5
  const earnedPoints = moneyPerPoint > 0 ? Math.floor(exampleSpend / moneyPerPoint) : 0
  const redeemValue = earnedPoints * moneyPerPointRedeem

  return (
    <div className="space-y-5">
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Valor del punto</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">Definí la tasa a la que ganan y canjean los puntos.</p>
      </div>

      <AccumulationField formData={formData} setFormData={setFormData} />

      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Valor de canje
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Valor en moneda al canjear cada punto</p>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">1 punto =</span>
          <CurrencyInput
            id="money_per_point_redeem"
            value={moneyPerPointRedeem}
            onChange={(e) => {
              const v = parseInt(e.target.value)
              if (!isNaN(v) && v >= 1) setFormData((prev) => ({ ...prev, money_per_point_redeem: v }))
            }}
          />
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Ej: Gasta <strong className="text-gray-700 dark:text-gray-300">${exampleSpend.toLocaleString()}</strong> → gana{' '}
        <strong className="text-gray-700 dark:text-gray-300">
          {earnedPoints} {earnedPoints === 1 ? 'punto' : 'puntos'}
        </strong>
        . Al canjear obtiene{' '}
        <strong className="text-gray-700 dark:text-gray-300">${redeemValue.toLocaleString()}</strong> de descuento o
        crédito.
      </p>
    </div>
  )
}

export function CatalogFields({ formData, setFormData }) {
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    points_cost: '',
    stock_enabled: false,
    stock: '',
  })
  const [imagePreview, setImagePreview] = useState(null)
  const items = formData.catalog_items || []

  const handleAddItem = () => {
    if (!newItem.name.trim() || !newItem.points_cost) return
    const item = {
      id: Date.now(),
      name: newItem.name.trim(),
      description: newItem.description.trim(),
      points_cost: parseInt(newItem.points_cost),
      stock_enabled: newItem.stock_enabled,
      stock: newItem.stock_enabled ? parseInt(newItem.stock) || null : null,
      image_url: imagePreview || null,
    }
    setFormData((prev) => ({ ...prev, catalog_items: [...(prev.catalog_items || []), item] }))
    setNewItem({ name: '', description: '', points_cost: '', stock_enabled: false, stock: '' })
    setImagePreview(null)
  }

  const handleRemoveItem = (id) => {
    setFormData((prev) => ({ ...prev, catalog_items: prev.catalog_items.filter((i) => i.id !== id) }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-4">
      {/* Form para nuevo ítem */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4 bg-gray-50 dark:bg-gray-800/50">
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Agregar ítem al catálogo</p>

        {/* Nombre */}
        <div className="space-y-1.5">
          <Label htmlFor="item_name">Nombre del producto / servicio</Label>
          <Input
            id="item_name"
            value={newItem.name}
            onChange={(e) => setNewItem((p) => ({ ...p, name: e.target.value }))}
            placeholder="Ej: Café gratis, Descuento 10%, Remera..."
            className="h-10"
          />
        </div>

        {/* Descripción */}
        <div className="space-y-1.5">
          <Label htmlFor="item_description">
            Descripción <span className="text-gray-400 font-normal">(opcional)</span>
          </Label>
          <Textarea
            id="item_description"
            value={newItem.description}
            onChange={(e) => setNewItem((p) => ({ ...p, description: e.target.value }))}
            placeholder="Ej: Tres medialunas de manteca recién horneadas..."
            className="resize-none text-sm"
            rows={2}
          />
        </div>

        {/* Puntos + imagen en la misma fila */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="item_points">Puntos necesarios</Label>
            <div className="flex items-center gap-2">
              <Input
                id="item_points"
                type="number"
                min="1"
                value={newItem.points_cost}
                onChange={(e) => setNewItem((p) => ({ ...p, points_cost: e.target.value }))}
                placeholder="50"
                className="h-10"
              />
              <span className="text-xs text-gray-400 whitespace-nowrap">pts</span>
            </div>
            {newItem.points_cost && parseInt(newItem.points_cost) > 0 && (formData.money_per_point ?? 1000) > 0 && (
              <p className="text-xs text-blue-600 dark:text-blue-400">
                ≈ gasta {(parseInt(newItem.points_cost) * (formData.money_per_point ?? 1000)).toLocaleString()} para
                canjearlo
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Imagen</Label>
            <label className="cursor-pointer flex items-center gap-2 h-10 px-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              {imagePreview ? (
                <img src={imagePreview} className="w-6 h-6 rounded object-cover flex-shrink-0" />
              ) : (
                <ImageIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
              )}
              <span className="text-xs text-gray-500 truncate">{imagePreview ? 'Cambiar' : 'Opcional'}</span>
            </label>
          </div>
        </div>

        {/* Stock */}
        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Limitar stock</p>
            <p className="text-xs text-gray-400">Desactivar cuando se agote</p>
          </div>
          <div className="flex items-center gap-3">
            {newItem.stock_enabled && (
              <Input
                type="number"
                min="1"
                value={newItem.stock}
                onChange={(e) => setNewItem((p) => ({ ...p, stock: e.target.value }))}
                placeholder="Cant."
                className="h-8 w-20 text-sm"
              />
            )}
            <input
              type="checkbox"
              checked={newItem.stock_enabled}
              onChange={(e) => setNewItem((p) => ({ ...p, stock_enabled: e.target.checked }))}
              className="w-5 h-5 accent-blue-500 cursor-pointer"
            />
          </div>
        </div>

        <Button
          type="button"
          onClick={handleAddItem}
          disabled={!newItem.name.trim() || !newItem.points_cost}
          className="w-full gap-2 bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Plus className="w-4 h-4" />
          Agregar al catálogo
        </Button>
      </div>

      {/* Lista de ítems */}
      {items.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Catálogo ({items.length} {items.length === 1 ? 'ítem' : 'ítems'})
          </p>
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
            >
              {item.image_url ? (
                <img src={item.image_url} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{item.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">{item.points_cost} pts</span>
                  {item.stock_enabled && item.stock && (
                    <span className="text-xs text-gray-400">· Stock: {item.stock}</span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {items.length === 0 && (
        <div className="text-center py-6 text-gray-400 dark:text-gray-500">
          <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Todavía no hay ítems en el catálogo</p>
        </div>
      )}
    </div>
  )
}

const REDEEM_MODES = [
  {
    value: 'threshold',
    icon: Zap,
    title: 'Umbral automático',
    desc: 'Al alcanzar la cantidad de puntos se entrega la recompensa',
  },
  {
    value: 'direct',
    icon: ArrowRightLeft,
    title: 'Conversión directa',
    desc: 'Staff canjea puntos por dinero o crédito en caja',
  },
  {
    value: 'catalog',
    icon: Package,
    title: 'Catálogo',
    desc: 'El cliente elige un producto o servicio',
    comingSoon: true,
  },
]

export function PointsConversionSection({ formData, setFormData }) {
  const redeemMode = formData.redeem_mode || 'direct'

  return (
    <div className="border-t pt-6 pb-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Configuración de puntos</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Definí cómo acumulan y cómo canjean puntos tus clientes.
        </p>
      </div>

      {/* Modo de canje */}
      <div className="space-y-3">
        <Label>Modo de canje</Label>
        <div className="grid grid-cols-3 gap-3">
          {REDEEM_MODES.map((opt) => {
            const Icon = opt.icon
            const isSelected = redeemMode === opt.value
            const isDisabled = !!opt.comingSoon
            return (
              <button
                key={opt.value}
                type="button"
                disabled={isDisabled}
                onClick={() => !isDisabled && setFormData((prev) => ({ ...prev, redeem_mode: opt.value }))}
                className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 bg-white dark:bg-gray-900 transition-all text-left ${
                  isSelected
                    ? 'border-gray-900 dark:border-gray-100'
                    : isDisabled
                      ? 'border-gray-200 dark:border-gray-700 cursor-not-allowed'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-gray-900 dark:bg-gray-100' : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isSelected
                        ? 'text-white dark:text-gray-900'
                        : isDisabled
                          ? 'text-gray-300 dark:text-gray-600'
                          : 'text-gray-400'
                    }`}
                  />
                </div>
                <p
                  className={`text-sm font-semibold ${
                    isDisabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {opt.title}
                </p>
                <p
                  className={`text-xs leading-tight ${
                    isDisabled ? 'text-gray-300 dark:text-gray-600' : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {opt.desc}
                </p>
                {opt.comingSoon && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400">
                    Próximamente
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Campos según modo */}
      {redeemMode === 'threshold' && (
        <>
          <ThresholdRedeemFields formData={formData} setFormData={setFormData} />
          <ThresholdValueSection formData={formData} setFormData={setFormData} />
        </>
      )}
      {redeemMode === 'direct' && <PointsValueSection formData={formData} setFormData={setFormData} />}
      {redeemMode === 'catalog' && <CatalogFields formData={formData} setFormData={setFormData} />}
    </div>
  )
}

function ImageUploadButton({ uploading, label, onChange, onClick }) {
  return (
    <label className="cursor-pointer">
      <input type="file" accept="image/*" onChange={onChange} className="hidden" disabled={uploading} />
      <div
        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center gap-2 transition-colors"
        onClick={onClick}
      >
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        <span className="text-sm font-medium">{label}</span>
      </div>
    </label>
  )
}

export function ImageUploadGroup({
  formData,
  uploadingLogo,
  uploadingBackground,
  uploadingStamp,
  handleLogoUpload,
  handleBackgroundImageUpload,
  handleStampImageUpload,
  setIsFlipped,
}) {
  const { t } = useLanguage()
  const isPoints = formData.program_type_id === POINTS_TYPE_ID
  const isMembershipImg = formData.program_type_id === MEMBERSHIP_TYPE_ID
  const isCashbackImg = formData.program_type_id === CASHBACK_TYPE_ID

  return (
    <>
      <div className="space-y-2">
        <Label>{t('logo')}</Label>
        <div className="flex gap-3 items-center">
          {formData.logo_url && (
            <img src={formData.logo_url} alt="Logo" className="w-16 h-16 rounded-xl object-contain border" />
          )}
          <ImageUploadButton
            uploading={uploadingLogo}
            label={t('uploadLogo')}
            onChange={handleLogoUpload}
            onClick={() => setIsFlipped(false)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t('formBackgroundImage')}</Label>
        <div className="flex gap-3 items-center">
          {formData.background_image_url && (
            <img
              src={formData.background_image_url}
              alt={t('formBackgroundImage')}
              className="w-16 h-16 rounded-xl object-cover border"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          )}
          <ImageUploadButton
            uploading={uploadingBackground}
            label={t('formUploadBackground')}
            onChange={handleBackgroundImageUpload}
            onClick={() => setIsFlipped(false)}
          />
        </div>
      </div>

      {!isPoints && !isMembershipImg && !isCashbackImg && (
        <div className="space-y-2">
          <Label>{t('formStampImage')}</Label>
          <div className="flex gap-3 items-center">
            {formData.stamp_image_url && (
              <img
                src={formData.stamp_image_url}
                alt={t('formStampImage')}
                className="w-16 h-16 rounded-xl object-cover border"
              />
            )}
            <ImageUploadButton
              uploading={uploadingStamp}
              label={t('formUploadStamp')}
              onChange={handleStampImageUpload}
              onClick={() => setIsFlipped(false)}
            />
          </div>
        </div>
      )}
    </>
  )
}

export function ColorPickerGroup({ formData, setFormData }) {
  const { t } = useLanguage()

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="card_color">{t('primaryColor')}</Label>
        <Input
          id="card_color"
          type="color"
          value={formData.card_color}
          onChange={(e) => setFormData((prev) => ({ ...prev, card_color: e.target.value }))}
          className="h-12 cursor-pointer"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="foreground_color">{t('formTextColor')}</Label>
        <Input
          id="foreground_color"
          type="color"
          value={formData.foreground_color}
          onChange={(e) => setFormData((prev) => ({ ...prev, foreground_color: e.target.value }))}
          className="h-12 cursor-pointer"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="label_color">{t('formLabelColor')}</Label>
        <Input
          id="label_color"
          type="color"
          value={formData.label_color}
          onChange={(e) => setFormData((prev) => ({ ...prev, label_color: e.target.value }))}
          className="h-12 cursor-pointer"
        />
      </div>
    </div>
  )
}

export function ValiditySection({ formData, setFormData, getValidityTermsText }) {
  const { t } = useLanguage()

  return (
    <div className="border-t pt-6 pb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('validityAndTerms')}</h3>
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <Label htmlFor="validity_stamps">{t('stampsValidity')}</Label>
          <div className="relative">
            <Input
              id="validity_stamps"
              type="number"
              min="0"
              value={formData.validity_stamps_days || ''}
              onChange={(e) => {
                const newDays = parseInt(e.target.value) || 0
                setFormData((prev) => {
                  const prevAutoText = getValidityTermsText(prev.validity_stamps_days || 0)
                  const newAutoText = getValidityTermsText(newDays)
                  const shouldUpdateTerms = !prev.terms || prev.terms === prevAutoText
                  return {
                    ...prev,
                    validity_stamps_days: newDays,
                    terms: shouldUpdateTerms ? newAutoText : prev.terms,
                  }
                })
              }}
              placeholder="0"
              className="h-12 pr-16"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
              {t('days')}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('noTimeLimit')}</p>
        </div>
      </div>
    </div>
  )
}

function AlwaysCollectedBadge() {
  return (
    <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 flex-shrink-0">
      <CheckCircle2 className="w-4 h-4" />
      Siempre se recolecta
    </div>
  )
}

function ToggleCheckbox({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
        checked ? 'bg-yellow-400' : 'bg-gray-200 dark:bg-gray-700'
      }`}
    >
      {checked && <Check className="w-4 h-4 text-black" />}
    </button>
  )
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .replace(/^(?=[0-9])/, 'campo_')
}

const IDENTIFIER_PATTERN = /^[a-z][a-z0-9_]*$/

function CustomFieldRow({ field, onChange, onRemove }) {
  const labelError = !field.label.trim() ? 'La etiqueta del campo personalizado es requerida.' : null
  const identifierError = !IDENTIFIER_PATTERN.test(field.identifier)
    ? 'Identificador inválido. Solo minúsculas, números y guiones bajos, empezando con letra.'
    : null

  const handleLabelChange = (value) => {
    const next = { ...field, label: value }
    if (!field.identifierTouched) next.identifier = slugify(value)
    onChange(next)
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-sm">Etiqueta</Label>
          <Input
            value={field.label}
            onChange={(e) => handleLabelChange(e.target.value)}
            className={labelError ? 'border-red-500 focus-visible:ring-red-500' : ''}
          />
          {labelError && <p className="text-xs text-red-500">{labelError}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="text-sm">Identificador</Label>
          <Input
            value={field.identifier}
            onChange={(e) => onChange({ ...field, identifier: e.target.value, identifierTouched: true })}
            className={identifierError ? 'border-red-500 focus-visible:ring-red-500' : ''}
          />
          {identifierError && <p className="text-xs text-red-500">{identifierError}</p>}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <ToggleCheckbox checked={field.required} onChange={(v) => onChange({ ...field, required: v })} />
          <span className="text-sm text-gray-700 dark:text-gray-300">Obligatorio</span>
        </label>
        <button
          type="button"
          onClick={onRemove}
          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function CustomFieldsSection({ formData, setFormData }) {
  const customFields = formData.custom_fields || []
  const canAddMore = customFields.length < 10

  const handleAdd = () => {
    if (!canAddMore) return
    setFormData((prev) => ({
      ...prev,
      custom_fields: [
        ...(prev.custom_fields || []),
        { id: Date.now(), label: '', identifier: '', identifierTouched: false, required: true },
      ],
    }))
  }

  const handleChange = (id, next) => {
    setFormData((prev) => ({
      ...prev,
      custom_fields: prev.custom_fields.map((f) => (f.id === id ? next : f)),
    }))
  }

  const handleRemove = (id) => {
    setFormData((prev) => ({ ...prev, custom_fields: prev.custom_fields.filter((f) => f.id !== id) }))
  }

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-base font-medium text-gray-900 dark:text-gray-100">Campos personalizados</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Solicita información adicional al cliente. Hasta 10 campos.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2 flex-shrink-0"
          onClick={handleAdd}
          disabled={!canAddMore}
        >
          <Plus className="w-4 h-4" />
          Agregar campo
        </Button>
      </div>

      {customFields.length > 0 && (
        <div className="space-y-3 pt-1">
          {customFields.map((field) => (
            <CustomFieldRow
              key={field.id}
              field={field}
              onChange={(next) => handleChange(field.id, next)}
              onRemove={() => handleRemove(field.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function CustomerDataFields({ formData, setFormData }) {
  const { t } = useLanguage()

  return (
    <div className="border-t pt-6 pb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('formCustomerData')}</h3>
      <div className="grid gap-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div className="space-y-0.5">
            <Label className="text-base">
              {t('formNameLabel')}{' '}
              <span className="text-xs text-gray-400 dark:text-gray-500">({t('formRequired')})</span>
            </Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('formRequestName')}</p>
          </div>
          <AlwaysCollectedBadge />
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div className="space-y-0.5">
            <Label className="text-base">
              Email <span className="text-xs text-gray-400 dark:text-gray-500">({t('formRequired')})</span>
            </Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('formRequestEmail')}</p>
          </div>
          <AlwaysCollectedBadge />
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div className="space-y-0.5">
            <Label className="text-base">{t('formPhoneLabel')}</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('formRequestPhone')}</p>
          </div>
          <ToggleCheckbox
            checked={formData.collect_phone}
            onChange={(v) => setFormData((prev) => ({ ...prev, collect_phone: v }))}
          />
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div className="space-y-0.5">
            <Label className="text-base">{t('formBirthdayLabel')}</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('formRequestBirthday')}</p>
          </div>
          <ToggleCheckbox
            checked={formData.collect_birthday}
            onChange={(v) => setFormData((prev) => ({ ...prev, collect_birthday: v }))}
          />
        </div>
        <CustomFieldsSection formData={formData} setFormData={setFormData} />
      </div>
    </div>
  )
}

export function SecuritySection({ formData, setFormData }) {
  const { t } = useLanguage()

  return (
    <div className="border-t pt-6 pb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('securityAndFraud')}</h3>
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="cooldown">{t('cooldownTime')}</Label>
          <Input
            id="cooldown"
            type="number"
            min="0"
            value={formData.security_cooldown_hours || ''}
            onChange={(e) => setFormData({ ...formData, security_cooldown_hours: parseInt(e.target.value) || 0 })}
            placeholder="0"
            className="h-12"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('cooldownTimeDesc')}</p>
        </div>

        <div className="flex items-start justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div className="space-y-0.5 flex-1">
            <Label className="text-base">Número de orden / compra</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Al registrar una transacción, el operador debe ingresar el número de orden o ticket. Permite verificar que
              el monto de la compra coincide con la transacción en Repeat.
            </p>
          </div>
          <input
            type="checkbox"
            checked={formData.require_order_number || false}
            onChange={(e) => setFormData((prev) => ({ ...prev, require_order_number: e.target.checked }))}
            className="w-6 h-6 mt-0.5 accent-yellow-500 cursor-pointer flex-shrink-0"
          />
        </div>

        {formData.require_order_number && (
          <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-4 space-y-1.5">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
              ¿Cómo funciona?
            </p>
            <ul className="text-sm text-amber-900 dark:text-amber-200 space-y-1">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0">①</span>
                <span>
                  El operador escanea la tarjeta del cliente y carga el número de orden del ticket o sistema de caja.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0">②</span>
                <span>Repeat registra ese número junto a la transacción.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0">③</span>
                <span>
                  Podés cruzar los reportes de Repeat con los de tu sistema de ventas para detectar inconsistencias.
                </span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export function BusinessInfoSection({ formData, setFormData, setIsFlipped }) {
  const { t } = useLanguage()

  return (
    <>
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('formBusinessInfo')}</h3>

        <Label htmlFor="contact_email">{t('contactEmail')}</Label>
        <Input
          id="contact_email"
          type="email"
          value={formData.contact_email}
          onChange={(e) => setFormData((prev) => ({ ...prev, contact_email: e.target.value }))}
          onFocus={() => setIsFlipped(true)}
          placeholder="contact@business.com"
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_phone">{t('contactPhone')}</Label>
        <Input
          id="contact_phone"
          value={formData.contact_phone}
          onChange={(e) => setFormData((prev) => ({ ...prev, contact_phone: e.target.value }))}
          onFocus={() => setIsFlipped(true)}
          placeholder="+1 (555) 123-4567"
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">{t('website')}</Label>
        <Input
          id="website"
          value={formData.website}
          onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
          onFocus={() => setIsFlipped(true)}
          placeholder="https://business.com"
          className="h-12"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="terms">{t('termsAndConditions')}</Label>
        <Textarea
          id="terms"
          value={formData.terms}
          onChange={(e) => setFormData((prev) => ({ ...prev, terms: e.target.value }))}
          onFocus={() => setIsFlipped(true)}
          placeholder={t('termsPlaceholder')}
          rows={3}
          maxLength={300}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formData.terms?.length || 0}/300 {t('formCharacters')}
        </p>
      </div>
    </>
  )
}

// Per-type referral config: label, unit, field, placeholder, reward description
function getReferralConfig(programTypeId, formData) {
  switch (programTypeId) {
    case POINTS_TYPE_ID:
      return {
        description: 'El cliente que refiere recibe puntos cuando su amigo se registra.',
        label: 'Puntos para el que refiere',
        unit: 'puntos',
        field: 'referral_reward_points',
        placeholder: '150',
        rewardSummary: `${formData.referral_reward_points || '—'} puntos`,
      }
    case CASHBACK_TYPE_ID:
      return {
        description: 'El cliente que refiere recibe saldo de cashback cuando su amigo se registra.',
        label: 'Cashback para el que refiere',
        unit: 'pesos',
        prefix: '$',
        field: 'referral_reward_cashback',
        placeholder: '500',
        rewardSummary: `$${formData.referral_reward_cashback || '—'} de cashback`,
      }
    case COUPON_TYPE_ID:
      return {
        description: 'El cliente que refiere recibe un cupón gratis cuando su amigo se registra.',
        label: null, // no amount input — fixed: one free coupon
        unit: null,
        field: null,
        placeholder: null,
        rewardSummary: 'un cupón gratis',
      }
    case MEMBERSHIP_TYPE_ID: {
      const rewardType = formData.referral_reward_membership_type || 'days'
      if (rewardType === 'benefit') {
        return {
          description: 'El cliente que refiere recibe un beneficio exclusivo cuando su amigo se activa.',
          label: null,
          unit: null,
          field: 'referral_reward_membership_benefit',
          fieldType: 'text',
          placeholder: 'Ej: Una sesión de masaje gratis, Kit de bienvenida...',
          rewardSummary: formData.referral_reward_membership_benefit || 'beneficio a elección',
        }
      }
      return {
        description: 'El cliente que refiere recibe días gratis de membresía cuando su amigo se activa.',
        label: 'Días gratis para el que refiere',
        unit: 'días',
        field: 'referral_reward_membership_days',
        fieldType: 'number',
        placeholder: '30',
        rewardSummary: `${formData.referral_reward_membership_days || '—'} días gratis`,
      }
    }
    default: // stamps
      return {
        description: 'El cliente que refiere recibe sellos cuando su amigo se registra.',
        label: 'Sellos para el que refiere',
        unit: 'sellos',
        field: 'referral_reward_stamps',
        placeholder: '1',
        rewardSummary: `${formData.referral_reward_stamps || '—'} ${(formData.referral_reward_stamps || 0) === 1 ? 'sello' : 'sellos'}`,
      }
  }
}

const MEMBERSHIP_REFERRAL_TYPES = [
  { value: 'days', label: 'Días gratis', desc: 'Días extra de membresía para el que refiere.' },
  { value: 'benefit', label: 'Beneficio exclusivo', desc: 'Un producto, servicio o regalo que vos definís.' },
]

function getReferredRewardConfig(programTypeId, formData) {
  switch (programTypeId) {
    case POINTS_TYPE_ID:
      return {
        label: 'Puntos de bienvenida',
        unit: 'puntos',
        field: 'referral_referred_points',
        placeholder: '50',
        rewardSummary: `${formData.referral_referred_points || '—'} puntos`,
      }
    case CASHBACK_TYPE_ID:
      return {
        label: 'Cashback de bienvenida',
        unit: 'pesos',
        prefix: '$',
        field: 'referral_referred_cashback',
        placeholder: '200',
        rewardSummary: `$${formData.referral_referred_cashback || '—'} de cashback`,
      }
    case COUPON_TYPE_ID:
      return {
        label: null,
        field: null,
        rewardSummary: 'un cupón gratis de bienvenida',
      }
    case MEMBERSHIP_TYPE_ID:
      return {
        label: 'Días gratis de bienvenida',
        unit: 'días',
        field: 'referral_referred_days',
        placeholder: '7',
        rewardSummary: `${formData.referral_referred_days || '—'} días gratis`,
      }
    default:
      return {
        label: 'Sellos de bienvenida',
        unit: 'sellos',
        field: 'referral_referred_stamps',
        placeholder: '1',
        rewardSummary: `${formData.referral_referred_stamps || '—'} ${(formData.referral_referred_stamps || 0) === 1 ? 'sello' : 'sellos'}`,
      }
  }
}

const REFERRAL_LINK_DEMO = 'https://repeat.la/r/mooncafe-a8f2k'

export function ReferralSection({ formData, setFormData }) {
  const [copied, setCopied] = useState(false)
  const enabled = formData.referral_enabled || false
  const isMembership = formData.program_type_id === MEMBERSHIP_TYPE_ID
  const membershipRewardType = formData.referral_reward_membership_type || 'days'
  const config = getReferralConfig(formData.program_type_id, formData)
  const referredConfig = getReferredRewardConfig(formData.program_type_id, formData)

  const handleCopy = () => {
    navigator.clipboard.writeText(REFERRAL_LINK_DEMO).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="border-t pt-6 pb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Programa de referidos</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Premia a tus clientes cuando traen a un amigo que se registra en el programa.
      </p>

      <div className="flex items-start justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
          <div className="space-y-0.5">
            <Label className="text-base">Activar referidos</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">{config.description}</p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setFormData((prev) => ({ ...prev, referral_enabled: e.target.checked }))}
          className="w-6 h-6 mt-0.5 accent-yellow-500 cursor-pointer flex-shrink-0"
        />
      </div>

      {enabled && (
        <div className="mt-4 grid gap-4">
          {/* Referral link */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Tu link de referido</p>
                <p className="text-xs text-gray-400 mt-0.5">Compartilo en redes, WhatsApp o en el local.</p>
              </div>
              <Button type="button" size="sm" variant="outline" onClick={handleCopy} className="gap-1.5 flex-shrink-0">
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado' : 'Copiar'}
              </Button>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg px-3 py-2 font-mono text-xs text-gray-600 dark:text-gray-300 truncate border border-gray-200 dark:border-gray-700">
              {REFERRAL_LINK_DEMO}
            </div>
          </div>

          {/* Selector de tipo de recompensa para membresías */}
          {isMembership && (
            <div className="space-y-2">
              <Label>Tipo de recompensa</Label>
              <div className="grid grid-cols-2 gap-2">
                {MEMBERSHIP_REFERRAL_TYPES.map((opt) => {
                  const isSelected = membershipRewardType === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, referral_reward_membership_type: opt.value }))}
                      className={`flex items-start gap-2.5 p-3 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-violet-400 bg-violet-50 dark:bg-violet-950/40'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${isSelected ? 'bg-violet-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                      />
                      <div>
                        <p
                          className={`text-xs font-semibold ${isSelected ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}
                        >
                          {opt.label}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 leading-tight">{opt.desc}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Cupón: sin cantidad, recompensa fija */}
          {config.field === null && !isMembership ? (
            <div className="rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/40 p-4">
              <p className="text-sm text-orange-900 dark:text-orange-200">
                El cliente que refiere recibe <strong>un cupón gratis</strong> automáticamente en cuanto su amigo
                complete el registro.
              </p>
            </div>
          ) : config.fieldType === 'text' ? (
            /* Membresía — beneficio exclusivo (texto libre) */
            <div className="space-y-2">
              <Label htmlFor="referral_reward_benefit">Describí el beneficio que recibe</Label>
              <Input
                id="referral_reward_benefit"
                type="text"
                placeholder={config.placeholder}
                value={formData.referral_reward_membership_benefit || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, referral_reward_membership_benefit: e.target.value }))
                }
                className="h-12"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Este texto se mostrará al cliente cuando comparta su link de referido.
              </p>
            </div>
          ) : config.field !== null ? (
            <div className="space-y-2">
              <Label htmlFor="referral_reward">{config.label}</Label>
              <div className="flex items-center gap-3">
                {config.prefix && (
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{config.prefix}</span>
                )}
                <Input
                  id="referral_reward"
                  type="number"
                  min="1"
                  placeholder={config.placeholder}
                  value={formData[config.field] || ''}
                  onChange={(e) => {
                    const v = parseInt(e.target.value) || 0
                    setFormData((prev) => ({ ...prev, [config.field]: v }))
                  }}
                  className="h-12 max-w-[140px]"
                />
                <span className="text-sm text-gray-500">{config.unit}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Se acreditarán automáticamente cuando el amigo complete su registro y realice su primera visita.
              </p>
            </div>
          ) : null}

          {/* Premio para el nuevo cliente */}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-3">
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Premio para el nuevo cliente</p>
              <p className="text-xs text-gray-400 mt-0.5">Incentivo para el amigo que se registra usando el link.</p>
            </div>
            {referredConfig.field === null ? (
              <div className="rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/40 p-4">
                <p className="text-sm text-orange-900 dark:text-orange-200">
                  El amigo recibe <strong>un cupón gratis de bienvenida</strong> al completar su registro.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="referral_referred_reward">{referredConfig.label}</Label>
                <div className="flex items-center gap-3">
                  {referredConfig.prefix && (
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {referredConfig.prefix}
                    </span>
                  )}
                  <Input
                    id="referral_referred_reward"
                    type="number"
                    min="1"
                    placeholder={referredConfig.placeholder}
                    value={formData[referredConfig.field] || ''}
                    onChange={(e) => {
                      const v = parseInt(e.target.value) || 0
                      setFormData((prev) => ({ ...prev, [referredConfig.field]: v }))
                    }}
                    className="h-12 max-w-[140px]"
                  />
                  <span className="text-sm text-gray-500">{referredConfig.unit}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Se acreditarán automáticamente cuando el amigo complete su registro.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 p-4 space-y-1.5">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
              ¿Cómo funciona?
            </p>
            <ul className="text-sm text-blue-900 dark:text-blue-200 space-y-1">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0">①</span>
                <span>El cliente comparte su link personal desde el catálogo del programa.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0">②</span>
                <span>
                  Su amigo se registra usando ese link, obtiene su tarjeta y recibe{' '}
                  <strong>{referredConfig.rewardSummary}</strong> de bienvenida.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0">③</span>
                <span>
                  Al completar su primera visita, el cliente que refirió recibe <strong>{config.rewardSummary}</strong>{' '}
                  automáticamente.
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

const COUPON_TRIGGERS = [
  { value: 'purchase', label: 'Por cada compra', desc: 'El cliente recibe un cupón cada vez que realiza una compra.' },
  { value: 'signup', label: 'Al registrarse', desc: 'El cliente recibe un cupón al unirse al programa.' },
  {
    value: 'survey',
    label: 'Al completar la encuesta',
    desc: 'El cliente recibe un cupón como premio al completar la encuesta de satisfacción.',
  },
  {
    value: 'manual',
    label: 'Manual',
    desc: 'Vos entregás el cupón manualmente desde el panel, por ejemplo enviándolo por correo.',
  },
]

function getCouponBenefitSummary(formData) {
  const benefitType = formData.coupon_benefit_type || 'percent'
  const benefitValue = formData.coupon_benefit_value ?? 10
  if (benefitType === 'percent') return `${benefitValue}% de descuento`
  if (benefitType === 'fixed') return `$${benefitValue} de descuento`
  return formData.coupon_description || 'Producto gratis'
}

const COUPON_BENEFIT_TYPES = [
  { value: 'percent', label: '% de descuento' },
  { value: 'fixed', label: 'Monto fijo' },
  { value: 'free_item', label: 'Producto gratis' },
]

export function CouponConfigSection({ formData, setFormData }) {
  const triggers = formData.coupon_triggers || ['purchase']
  const benefitType = formData.coupon_benefit_type || 'percent'
  const benefitValue = formData.coupon_benefit_value ?? 10
  const validityDays = formData.coupon_validity_days ?? 30
  const selectedTriggers = COUPON_TRIGGERS.filter((t) => triggers.includes(t.value))

  const toggleTrigger = (value) => {
    setFormData((prev) => {
      const current = prev.coupon_triggers || ['purchase']
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
      return { ...prev, coupon_triggers: next }
    })
  }

  return (
    <div className="border-t pt-6 pb-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Configuración del cupón</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Definí cómo se obtiene el cupón y qué beneficio ofrece.
        </p>
      </div>

      {/* Cómo se obtiene */}
      <div className="space-y-3">
        <Label>¿Cómo obtiene el cupón el cliente?</Label>
        <p className="text-xs text-gray-400 dark:text-gray-500 -mt-2">Podés tildar más de una opción.</p>
        <div className="grid grid-cols-1 gap-2">
          {COUPON_TRIGGERS.map((opt) => {
            const isSelected = triggers.includes(opt.value)
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleTrigger(opt.value)}
                className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-orange-400 bg-orange-50 dark:bg-orange-950/40'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-md mt-0.5 flex-shrink-0 flex items-center justify-center border-2 ${
                    isSelected ? 'bg-orange-500 border-orange-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <p
                    className={`text-sm font-semibold ${isSelected ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}
                  >
                    {opt.label}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{opt.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tipo de beneficio */}
      <div className="space-y-3">
        <Label>Tipo de beneficio</Label>
        <div className="grid grid-cols-3 gap-2">
          {COUPON_BENEFIT_TYPES.map((opt) => {
            const isSelected = benefitType === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, coupon_benefit_type: opt.value }))}
                className={`p-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'border-orange-400 bg-orange-50 dark:bg-orange-950/40 text-gray-900 dark:text-gray-100'
                    : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Valor del beneficio */}
      {benefitType !== 'free_item' ? (
        <div className="space-y-2">
          <Label htmlFor="coupon_benefit_value">
            {benefitType === 'percent' ? 'Porcentaje de descuento' : 'Monto de descuento'}
          </Label>
          <div className="flex items-center gap-3">
            <Input
              id="coupon_benefit_value"
              type="number"
              min="1"
              value={benefitValue}
              onChange={(e) => {
                const v = parseInt(e.target.value)
                if (!isNaN(v) && v >= 1) setFormData((prev) => ({ ...prev, coupon_benefit_value: v }))
              }}
              className="h-12 max-w-[140px]"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {benefitType === 'percent' ? '%' : 'pesos'}
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="coupon_description">Descripción del producto gratis</Label>
          <Input
            id="coupon_description"
            value={formData.coupon_description || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, coupon_description: e.target.value }))}
            placeholder="Ej: Café mediano a elección"
            className="h-12"
          />
        </div>
      )}

      {/* Validez */}
      <div className="space-y-2">
        <Label htmlFor="coupon_validity_days">Validez del cupón</Label>
        <p className="text-xs text-gray-500 dark:text-gray-400">¿Cuántos días tiene el cliente para usarlo?</p>
        <div className="flex items-center gap-3">
          <Input
            id="coupon_validity_days"
            type="number"
            min="1"
            value={validityDays}
            onChange={(e) => {
              const v = parseInt(e.target.value)
              if (!isNaN(v) && v >= 1) setFormData((prev) => ({ ...prev, coupon_validity_days: v }))
            }}
            className="h-12 max-w-[140px]"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">días</span>
        </div>
      </div>

      {/* Resumen */}
      <div className="rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/40 p-4 space-y-1.5">
        <p className="text-xs font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wider">Resumen</p>
        {selectedTriggers.length > 0 ? (
          <p className="text-sm text-orange-900 dark:text-orange-200">
            {selectedTriggers.map((t) => t.label.toLowerCase()).join(' · ')} → el cliente recibe un cupón de{' '}
            <strong>{getCouponBenefitSummary(formData)}</strong> válido por <strong>{validityDays} días</strong>.
          </p>
        ) : (
          <p className="text-sm text-orange-900 dark:text-orange-200">
            Seleccioná al menos una forma de entrega del cupón.
          </p>
        )}
      </div>
    </div>
  )
}

const TIER_COLOR_PRESETS = ['#cd7f32', '#9ca3af', '#f59e0b', '#7c3aed', '#0ea5e9', '#ec4899']

const USE_TYPES = [
  { value: 'unlimited', label: 'Ilimitado', desc: 'Sin restricción de uso' },
  { value: 'monthly', label: '1x por mes', desc: 'Se renueva cada mes' },
  { value: 'onetime', label: '1 solo uso', desc: 'Se canjea una sola vez' },
]

export function MembershipConfigSection({ formData, setFormData }) {
  const [newTier, setNewTier] = useState({
    name: '',
    min_spend: '',
    sub_price: '',
    sub_period: 'monthly',
    color: '#f59e0b',
  })
  const [newBenefit, setNewBenefit] = useState({
    name: '',
    description: '',
    use_type: 'unlimited',
    tier_required: 'all',
  })
  const [benefitImagePreview, setBenefitImagePreview] = useState(null)
  const [benefitsOpen, setBenefitsOpen] = useState(false)
  const [editingBenefitId, setEditingBenefitId] = useState(null)
  const [editingTierId, setEditingTierId] = useState(null)

  const activation = formData.membership_activation || 'free'
  const tiers = [...(formData.membership_tiers || [])].sort((a, b) => a.min_spend - b.min_spend)
  const catalog = formData.membership_catalog || []

  const handleAddTier = () => {
    if (!newTier.name.trim() || newTier.min_spend === '') return
    if (editingTierId !== null) {
      setFormData((prev) => ({
        ...prev,
        membership_tiers: prev.membership_tiers.map((t) =>
          t.id === editingTierId
            ? {
                ...t,
                name: newTier.name.trim(),
                min_spend: parseInt(newTier.min_spend) || 0,
                color: newTier.color,
                ...(newTier.sub_price !== ''
                  ? { sub_price: parseInt(newTier.sub_price), sub_period: newTier.sub_period }
                  : { sub_price: undefined, sub_period: undefined }),
              }
            : t,
        ),
      }))
      setEditingTierId(null)
    } else {
      const tier = {
        id: Date.now().toString(),
        name: newTier.name.trim(),
        min_spend: parseInt(newTier.min_spend) || 0,
        color: newTier.color,
        ...(newTier.sub_price !== '' && {
          sub_price: parseInt(newTier.sub_price),
          sub_period: newTier.sub_period,
        }),
      }
      setFormData((prev) => ({ ...prev, membership_tiers: [...(prev.membership_tiers || []), tier] }))
    }
    setNewTier({ name: '', min_spend: '', sub_price: '', sub_period: 'monthly', color: '#f59e0b' })
  }

  const handleEditTier = (tier) => {
    setNewTier({
      name: tier.name,
      min_spend: String(tier.min_spend ?? ''),
      sub_price: tier.sub_price != null ? String(tier.sub_price) : '',
      sub_period: tier.sub_period || 'monthly',
      color: tier.color || '#f59e0b',
    })
    setEditingTierId(tier.id)
  }

  const handleCancelTierEdit = () => {
    setEditingTierId(null)
    setNewTier({ name: '', min_spend: '', sub_price: '', sub_period: 'monthly', color: '#f59e0b' })
  }

  const handleRemoveTier = (id) => {
    setFormData((prev) => ({
      ...prev,
      membership_tiers: prev.membership_tiers.filter((t) => t.id !== id),
      membership_catalog: (prev.membership_catalog || []).map((b) =>
        b.tier_required === id ? { ...b, tier_required: 'all' } : b,
      ),
    }))
  }

  const handleAddBenefit = () => {
    if (!newBenefit.name.trim()) return
    if (editingBenefitId !== null) {
      setFormData((prev) => ({
        ...prev,
        membership_catalog: prev.membership_catalog.map((b) =>
          b.id === editingBenefitId
            ? {
                ...b,
                name: newBenefit.name.trim(),
                description: newBenefit.description.trim(),
                use_type: newBenefit.use_type,
                tier_required: newBenefit.tier_required,
                image_url: benefitImagePreview ?? b.image_url,
              }
            : b,
        ),
      }))
      setEditingBenefitId(null)
    } else {
      const benefit = {
        id: Date.now(),
        name: newBenefit.name.trim(),
        description: newBenefit.description.trim(),
        use_type: newBenefit.use_type,
        tier_required: newBenefit.tier_required,
        image_url: benefitImagePreview || null,
      }
      setFormData((prev) => ({ ...prev, membership_catalog: [...(prev.membership_catalog || []), benefit] }))
    }
    setNewBenefit({ name: '', description: '', use_type: 'unlimited', tier_required: 'all' })
    setBenefitImagePreview(null)
  }

  const handleEditBenefit = (benefit) => {
    setNewBenefit({
      name: benefit.name,
      description: benefit.description || '',
      use_type: benefit.use_type,
      tier_required: benefit.tier_required,
    })
    setBenefitImagePreview(benefit.image_url || null)
    setEditingBenefitId(benefit.id)
    setBenefitsOpen(true)
  }

  const handleCancelBenefitEdit = () => {
    setEditingBenefitId(null)
    setNewBenefit({ name: '', description: '', use_type: 'unlimited', tier_required: 'all' })
    setBenefitImagePreview(null)
  }

  const handleRemoveBenefit = (id) => {
    setFormData((prev) => ({ ...prev, membership_catalog: prev.membership_catalog.filter((b) => b.id !== id) }))
  }

  const handleBenefitImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setBenefitImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="border-t pt-6 pb-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Configuración de membresía</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Definí cómo acceden los clientes y qué beneficios tienen según su nivel.
        </p>
      </div>

      {/* Tipo de acceso */}
      <div className="space-y-3">
        <Label>Acceso a la membresía</Label>
        <div className="grid grid-cols-1 gap-2">
          {[
            { value: 'free', label: 'Libre', desc: 'Cualquier cliente que se registra es miembro automáticamente.' },
            {
              value: 'tiers',
              label: 'Por niveles',
              desc: 'Los clientes suben de nivel según cuánto gastan. Opcionalmente podés habilitar suscripción paga por nivel para que puedan saltear el gasto.',
            },
          ].map((opt) => {
            const isSelected = activation === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, membership_activation: opt.value }))}
                className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-violet-400 bg-violet-50 dark:bg-violet-950/40'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${isSelected ? 'bg-violet-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                />
                <div>
                  <p
                    className={`text-sm font-semibold ${isSelected ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}
                  >
                    {opt.label}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{opt.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tier builder */}
      {activation === 'tiers' && (
        <div className="space-y-4">
          <Label>Niveles</Label>
          <div
            className={`rounded-xl border p-4 space-y-3 ${editingTierId !== null ? 'border-violet-300 dark:border-violet-700 bg-violet-50/50 dark:bg-violet-950/20' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'}`}
          >
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {editingTierId !== null ? 'Editando nivel' : 'Agregar nivel'}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="tier_name" className="text-xs">
                  Nombre
                </Label>
                <Input
                  id="tier_name"
                  value={newTier.name}
                  onChange={(e) => setNewTier((p) => ({ ...p, name: e.target.value }))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTier()
                    }
                  }}
                  placeholder="Ej: Bronce, Oro..."
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tier_min_spend" className="text-xs">
                  Gasto mínimo ($)
                </Label>
                <Input
                  id="tier_min_spend"
                  type="number"
                  min="0"
                  value={newTier.min_spend}
                  onChange={(e) => setNewTier((p) => ({ ...p, min_spend: e.target.value }))}
                  placeholder="0"
                  className="h-9"
                />
              </div>
            </div>

            {/* Suscripción opcional */}
            <div className="pt-1 border-t border-gray-200 dark:border-gray-700 space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Suscripción directa</p>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-400 font-medium">
                  opcional
                </span>
              </div>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-snug">
                Si definís un precio, los clientes pueden pagar para acceder a este nivel sin necesidad de alcanzar el
                gasto mínimo.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="tier_sub_price" className="text-xs">
                    Precio ($)
                  </Label>
                  <Input
                    id="tier_sub_price"
                    type="number"
                    min="0"
                    value={newTier.sub_price}
                    onChange={(e) => setNewTier((p) => ({ ...p, sub_price: e.target.value }))}
                    placeholder="Dejar vacío si no aplica"
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Período</Label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { value: 'monthly', label: 'Mensual' },
                      { value: 'annual', label: 'Anual' },
                    ].map((opt) => {
                      const isSelected = newTier.sub_period === opt.value
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setNewTier((p) => ({ ...p, sub_period: opt.value }))}
                          className={`py-2 rounded-lg border-2 text-[11px] font-semibold transition-all ${
                            isSelected
                              ? 'border-violet-400 bg-violet-50 dark:bg-violet-950/40 text-gray-900 dark:text-gray-100'
                              : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:border-gray-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Color</Label>
              <div className="flex items-center gap-2">
                {TIER_COLOR_PRESETS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewTier((p) => ({ ...p, color: c }))}
                    className={`w-7 h-7 rounded-full transition-transform ${newTier.color === c ? 'scale-125 ring-2 ring-offset-1 ring-gray-400' : 'hover:scale-110'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              {editingTierId !== null && (
                <Button type="button" onClick={handleCancelTierEdit} variant="outline" className="flex-1">
                  Cancelar
                </Button>
              )}
              <Button
                type="button"
                onClick={handleAddTier}
                disabled={!newTier.name.trim() || newTier.min_spend === ''}
                className="flex-1 gap-2 bg-violet-500 hover:bg-violet-600 text-white"
              >
                {editingTierId !== null ? (
                  <>
                    <Pencil className="w-4 h-4" />
                    Guardar cambios
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Agregar nivel
                  </>
                )}
              </Button>
            </div>
          </div>

          {tiers.length > 0 ? (
            <div className="space-y-2">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ backgroundColor: tier.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{tier.name}</p>
                    <p className="text-xs text-gray-400">
                      Gasto mín. ${parseInt(tier.min_spend || 0).toLocaleString()}
                      {tier.sub_price != null && (
                        <span className="ml-2 text-violet-500 font-medium">
                          · Suscripción ${parseInt(tier.sub_price).toLocaleString()}/
                          {tier.sub_period === 'annual' ? 'año' : 'mes'}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditTier(tier)}
                      className="p-1.5 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950/30 text-gray-400 hover:text-violet-500 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveTier(tier.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-400 dark:text-gray-500 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
              <p className="text-sm">Agregá al menos un nivel para continuar.</p>
            </div>
          )}
        </div>
      )}

      {/* Beneficios / catálogo */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setBenefitsOpen((p) => !p)}
          className="w-full flex items-center justify-between text-left group"
        >
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Beneficios del programa
              {catalog.length > 0 && (
                <span className="ml-2 text-xs font-semibold px-1.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400">
                  {catalog.length}
                </span>
              )}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Agregá descuentos, productos o servicios propios.
            </p>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${benefitsOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {benefitsOpen && (
          <div className="space-y-4">
            {/* Form nuevo / editar beneficio */}
            <div
              className={`rounded-xl border p-4 space-y-3 ${editingBenefitId !== null ? 'border-violet-300 dark:border-violet-700 bg-violet-50/50 dark:bg-violet-950/20' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'}`}
            >
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {editingBenefitId !== null ? 'Editando beneficio' : 'Agregar beneficio'}
              </p>

              <div className="space-y-1.5">
                <Label htmlFor="benefit_name" className="text-xs">
                  Nombre
                </Label>
                <Input
                  id="benefit_name"
                  value={newBenefit.name}
                  onChange={(e) => setNewBenefit((p) => ({ ...p, name: e.target.value }))}
                  placeholder="Ej: 10% de descuento, Gatorade gratis, Corte gratis..."
                  className="h-10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="benefit_desc" className="text-xs">
                    Descripción <span className="text-gray-400 font-normal">(opcional)</span>
                  </Label>
                  <Input
                    id="benefit_desc"
                    value={newBenefit.description}
                    onChange={(e) => setNewBenefit((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Detalles..."
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">
                    Imagen <span className="text-gray-400 font-normal">(opcional)</span>
                  </Label>
                  <label className="cursor-pointer flex items-center gap-2 h-10 px-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                    <input type="file" accept="image/*" onChange={handleBenefitImageChange} className="hidden" />
                    {benefitImagePreview ? (
                      <img src={benefitImagePreview} className="w-6 h-6 rounded object-cover flex-shrink-0" />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                    <span className="text-xs text-gray-500 truncate">{benefitImagePreview ? 'Cambiar' : 'Subir'}</span>
                  </label>
                </div>
              </div>

              {/* Tipo de uso */}
              <div className="space-y-1.5">
                <Label className="text-xs">Tipo de uso</Label>
                <div className="grid grid-cols-3 gap-2">
                  {USE_TYPES.map((opt) => {
                    const isSelected = newBenefit.use_type === opt.value
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setNewBenefit((p) => ({ ...p, use_type: opt.value }))}
                        className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                          isSelected
                            ? 'border-violet-400 bg-violet-50 dark:bg-violet-950/40'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <p
                          className={`text-xs font-semibold ${isSelected ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}
                        >
                          {opt.label}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 leading-tight">{opt.desc}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Nivel requerido */}
              {activation === 'tiers' && tiers.length > 0 && (
                <div className="space-y-1.5">
                  <Label className="text-xs">Nivel mínimo requerido</Label>
                  <Select
                    value={newBenefit.tier_required}
                    onValueChange={(v) => setNewBenefit((p) => ({ ...p, tier_required: v }))}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los niveles</SelectItem>
                      {tiers.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}+
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex gap-2">
                {editingBenefitId !== null && (
                  <Button type="button" onClick={handleCancelBenefitEdit} variant="outline" className="flex-1">
                    Cancelar
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={handleAddBenefit}
                  disabled={!newBenefit.name.trim()}
                  className="flex-1 gap-2 bg-violet-500 hover:bg-violet-600 text-white"
                >
                  {editingBenefitId !== null ? (
                    <>
                      <Pencil className="w-4 h-4" />
                      Guardar cambios
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Agregar beneficio
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Lista beneficios */}
            {catalog.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {catalog.length} {catalog.length === 1 ? 'beneficio' : 'beneficios'}
                </p>
                {catalog.map((benefit) => {
                  const useType = USE_TYPES.find((u) => u.value === benefit.use_type)
                  const tierInfo =
                    benefit.tier_required !== 'all' ? tiers.find((t) => t.id === benefit.tier_required) : null
                  return (
                    <div
                      key={benefit.id}
                      className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                    >
                      {benefit.image_url ? (
                        <img src={benefit.image_url} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-violet-50 dark:bg-violet-950/30 flex items-center justify-center flex-shrink-0">
                          <Package className="w-5 h-5 text-violet-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{benefit.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 font-medium">
                            {useType?.label}
                          </span>
                          {tierInfo ? (
                            <span
                              className="text-xs px-1.5 py-0.5 rounded-full font-medium text-white"
                              style={{ backgroundColor: tierInfo.color }}
                            >
                              {tierInfo.name}+
                            </span>
                          ) : (
                            <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-medium">
                              Todos
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleEditBenefit(benefit)}
                          className="p-1.5 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950/30 text-gray-400 hover:text-violet-500 transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveBenefit(benefit.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400 dark:text-gray-500">
                <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">Todavía no hay beneficios cargados</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function CashbackConfigSection({ formData, setFormData }) {
  const percentage = formData.cashback_percentage ?? 5
  const minPurchase = formData.cashback_min_purchase ?? 0
  const minRedeem = formData.cashback_min_redeem ?? 500
  const validityDays = formData.cashback_validity_days ?? 365

  const examplePurchase = 10000
  const exampleCashback = Math.round(examplePurchase * (percentage / 100))

  return (
    <div className="border-t pt-6 pb-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Configuración de cashback</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Definí cuánto cashback acumulan tus clientes y cuándo pueden usarlo.
        </p>
      </div>

      {/* Porcentaje */}
      <div className="space-y-2">
        <Label htmlFor="cashback_percentage">Porcentaje de cashback</Label>
        <p className="text-xs text-gray-500 dark:text-gray-400">¿Qué % de cada compra recibe el cliente como saldo?</p>
        <div className="flex items-center gap-3">
          <Input
            id="cashback_percentage"
            type="number"
            min="1"
            max="100"
            value={percentage}
            onChange={(e) => {
              const v = parseFloat(e.target.value)
              if (!isNaN(v) && v >= 1 && v <= 100) setFormData((prev) => ({ ...prev, cashback_percentage: v }))
            }}
            className="h-12 max-w-[120px]"
          />
          <span className="text-lg font-bold text-gray-500 dark:text-gray-400">%</span>
          <div className="flex-1 h-3 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: '#10b981' }}
            />
          </div>
        </div>
      </div>

      {/* Monto mínimo de compra */}
      <div className="space-y-2">
        <Label htmlFor="cashback_min_purchase">Compra mínima para acumular</Label>
        <p className="text-xs text-gray-500 dark:text-gray-400">Dejar en 0 para acumular desde cualquier monto.</p>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">$</span>
          <Input
            id="cashback_min_purchase"
            type="number"
            min="0"
            value={minPurchase}
            onChange={(e) => {
              const v = parseInt(e.target.value)
              if (!isNaN(v) && v >= 0) setFormData((prev) => ({ ...prev, cashback_min_purchase: v }))
            }}
            className="h-12 max-w-[160px]"
            placeholder="0"
          />
        </div>
      </div>

      {/* Saldo mínimo para canjear */}
      <div className="space-y-2">
        <Label htmlFor="cashback_min_redeem">Saldo mínimo para canjear</Label>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          El cliente puede usar su cashback recién cuando acumule este monto.
        </p>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">$</span>
          <Input
            id="cashback_min_redeem"
            type="number"
            min="1"
            value={minRedeem}
            onChange={(e) => {
              const v = parseInt(e.target.value)
              if (!isNaN(v) && v >= 1) setFormData((prev) => ({ ...prev, cashback_min_redeem: v }))
            }}
            className="h-12 max-w-[160px]"
          />
        </div>
      </div>

      {/* Validez */}
      <div className="space-y-2">
        <Label htmlFor="cashback_validity_days">Validez del saldo</Label>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Días que tiene el cliente para usar el saldo antes de que expire. 0 = sin vencimiento.
        </p>
        <div className="flex items-center gap-3">
          <Input
            id="cashback_validity_days"
            type="number"
            min="0"
            value={validityDays}
            onChange={(e) => {
              const v = parseInt(e.target.value)
              if (!isNaN(v) && v >= 0) setFormData((prev) => ({ ...prev, cashback_validity_days: v }))
            }}
            className="h-12 max-w-[140px]"
          />
          <span className="text-sm text-gray-500 dark:text-gray-400">días</span>
        </div>
      </div>

      {/* Ejemplo visual */}
      <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-4 space-y-3">
        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
          Ejemplo con estos valores
        </p>
        <div className="space-y-2 text-sm text-emerald-900 dark:text-emerald-200">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              1
            </span>
            <span>
              El cliente compra por <strong>${examplePurchase.toLocaleString()}</strong> → acumula{' '}
              <strong>${exampleCashback.toLocaleString()} de cashback</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              2
            </span>
            <span>
              Cuando su saldo llega a <strong>${minRedeem.toLocaleString()}</strong>, puede usarlo como descuento en
              caja
            </span>
          </div>
          {validityDays > 0 && (
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                3
              </span>
              <span>
                El saldo vence a los <strong>{validityDays} días</strong> si no lo usa
              </span>
            </div>
          )}
        </div>
        <div className="pt-1 border-t border-emerald-200 dark:border-emerald-700">
          <p className="text-xs text-emerald-700 dark:text-emerald-300">
            Necesita comprar{' '}
            <strong>
              ${minRedeem > 0 && percentage > 0 ? Math.ceil(minRedeem / (percentage / 100)).toLocaleString() : '—'}
            </strong>{' '}
            en total para poder hacer su primer canje
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Partner Benefits ──────────────────────────────────────────────────────────

const PARTNER_CATEGORIES = [
  { value: 'gastronomia', label: 'Gastronomía', emoji: '🍽️' },
  { value: 'salud', label: 'Salud & Bienestar', emoji: '💊' },
  { value: 'deportes', label: 'Deportes', emoji: '⚽' },
  { value: 'moda', label: 'Moda & Belleza', emoji: '👗' },
  { value: 'entretenimiento', label: 'Entretenimiento', emoji: '🎬' },
  { value: 'servicios', label: 'Servicios', emoji: '🔧' },
  { value: 'otro', label: 'Otro', emoji: '⭐' },
]

const DEFAULT_PARTNER = {
  partner_name: '',
  benefit_name: '',
  description: '',
  category: 'gastronomia',
  use_type: 'unlimited',
  tier_required: 'all',
}

export function PartnerBenefitsSection({ formData, setFormData }) {
  const [newPartner, setNewPartner] = useState(DEFAULT_PARTNER)
  const [logoPreview, setLogoPreview] = useState(null)
  const [open, setOpen] = useState(false)
  const [editingPartnerId, setEditingPartnerId] = useState(null)

  const activation = formData.membership_activation || 'free'
  const tiers = [...(formData.membership_tiers || [])].sort((a, b) => a.min_spend - b.min_spend)
  const partners = formData.membership_partners || []

  const handleAddPartner = () => {
    if (!newPartner.partner_name.trim() || !newPartner.benefit_name.trim()) return
    if (editingPartnerId !== null) {
      setFormData((prev) => ({
        ...prev,
        membership_partners: prev.membership_partners.map((p) =>
          p.id === editingPartnerId
            ? {
                ...p,
                partner_name: newPartner.partner_name.trim(),
                benefit_name: newPartner.benefit_name.trim(),
                description: newPartner.description.trim(),
                category: newPartner.category,
                use_type: newPartner.use_type,
                tier_required: newPartner.tier_required,
                logo_url: logoPreview ?? p.logo_url,
              }
            : p,
        ),
      }))
      setEditingPartnerId(null)
    } else {
      const partner = {
        id: Date.now(),
        ...newPartner,
        partner_name: newPartner.partner_name.trim(),
        benefit_name: newPartner.benefit_name.trim(),
        description: newPartner.description.trim(),
        logo_url: logoPreview || null,
      }
      setFormData((prev) => ({ ...prev, membership_partners: [...(prev.membership_partners || []), partner] }))
    }
    setNewPartner(DEFAULT_PARTNER)
    setLogoPreview(null)
  }

  const handleEditPartner = (partner) => {
    setNewPartner({
      partner_name: partner.partner_name,
      benefit_name: partner.benefit_name,
      description: partner.description || '',
      category: partner.category || 'gastronomia',
      use_type: partner.use_type,
      tier_required: partner.tier_required,
    })
    setLogoPreview(partner.logo_url || null)
    setEditingPartnerId(partner.id)
    setOpen(true)
  }

  const handleCancelPartnerEdit = () => {
    setEditingPartnerId(null)
    setNewPartner(DEFAULT_PARTNER)
    setLogoPreview(null)
  }

  const handleRemovePartner = (id) => {
    setFormData((prev) => ({ ...prev, membership_partners: prev.membership_partners.filter((p) => p.id !== id) }))
  }

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setLogoPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div className="border-t pt-6 pb-6 space-y-4">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between text-left"
      >
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Comercios adheridos
            {partners.length > 0 && (
              <span className="ml-2 text-xs font-semibold px-1.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400">
                {partners.length}
              </span>
            )}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Sumá negocios aliados que ofrezcan beneficios exclusivos a tus miembros.
          </p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <>
          {/* Formulario de alta / edición */}
          <div
            className={`rounded-xl border p-4 space-y-3 ${editingPartnerId !== null ? 'border-violet-300 dark:border-violet-700 bg-violet-50/50 dark:bg-violet-950/20' : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'}`}
          >
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {editingPartnerId !== null ? 'Editando comercio' : 'Agregar comercio'}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="partner_name" className="text-xs">
                  Nombre del comercio
                </Label>
                <Input
                  id="partner_name"
                  value={newPartner.partner_name}
                  onChange={(e) => setNewPartner((p) => ({ ...p, partner_name: e.target.value }))}
                  placeholder="Ej: Starbucks, Gym X..."
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="partner_benefit" className="text-xs">
                  Beneficio
                </Label>
                <Input
                  id="partner_benefit"
                  value={newPartner.benefit_name}
                  onChange={(e) => setNewPartner((p) => ({ ...p, benefit_name: e.target.value }))}
                  placeholder="Ej: 20% descuento, Café gratis..."
                  className="h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="partner_desc" className="text-xs">
                  Descripción <span className="text-gray-400 font-normal">(opcional)</span>
                </Label>
                <Input
                  id="partner_desc"
                  value={newPartner.description}
                  onChange={(e) => setNewPartner((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Detalles del beneficio..."
                  className="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">
                  Logo <span className="text-gray-400 font-normal">(opcional)</span>
                </Label>
                <label className="cursor-pointer flex items-center gap-2 h-10 px-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                  <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                  {logoPreview ? (
                    <img src={logoPreview} className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  )}
                  <span className="text-xs text-gray-500 truncate">{logoPreview ? 'Cambiar' : 'Subir logo'}</span>
                </label>
              </div>
            </div>

            {/* Categoría */}
            <div className="space-y-1.5">
              <Label className="text-xs">Categoría</Label>
              <div className="grid grid-cols-3 gap-2">
                {PARTNER_CATEGORIES.map((cat) => {
                  const isSelected = newPartner.category === cat.value
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setNewPartner((p) => ({ ...p, category: cat.value }))}
                      className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-violet-400 bg-violet-50 dark:bg-violet-950/40'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <p className="text-sm">{cat.emoji}</p>
                      <p
                        className={`text-xs font-semibold mt-0.5 leading-tight ${isSelected ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}
                      >
                        {cat.label}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Tipo de uso */}
            <div className="space-y-1.5">
              <Label className="text-xs">Tipo de uso</Label>
              <div className="grid grid-cols-3 gap-2">
                {USE_TYPES.map((opt) => {
                  const isSelected = newPartner.use_type === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setNewPartner((p) => ({ ...p, use_type: opt.value }))}
                      className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-violet-400 bg-violet-50 dark:bg-violet-950/40'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <p
                        className={`text-xs font-semibold ${isSelected ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}
                      >
                        {opt.label}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-tight">{opt.desc}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Nivel requerido */}
            {activation === 'tiers' && tiers.length > 0 && (
              <div className="space-y-1.5">
                <Label className="text-xs">Nivel mínimo requerido</Label>
                <Select
                  value={newPartner.tier_required}
                  onValueChange={(v) => setNewPartner((p) => ({ ...p, tier_required: v }))}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los niveles</SelectItem>
                    {tiers.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.name}+
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex gap-2">
              {editingPartnerId !== null && (
                <Button type="button" onClick={handleCancelPartnerEdit} variant="outline" className="flex-1">
                  Cancelar
                </Button>
              )}
              <Button
                type="button"
                onClick={handleAddPartner}
                disabled={!newPartner.partner_name.trim() || !newPartner.benefit_name.trim()}
                className="flex-1 gap-2 bg-violet-500 hover:bg-violet-600 text-white"
              >
                {editingPartnerId !== null ? (
                  <>
                    <Pencil className="w-4 h-4" />
                    Guardar cambios
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Agregar comercio
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Lista de comercios */}
          {partners.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {partners.length} {partners.length === 1 ? 'comercio adherido' : 'comercios adheridos'}
              </p>
              {partners.map((partner) => {
                const cat = PARTNER_CATEGORIES.find((c) => c.value === partner.category)
                const useType = USE_TYPES.find((u) => u.value === partner.use_type)
                const tierInfo =
                  partner.tier_required !== 'all' ? tiers.find((t) => t.id === partner.tier_required) : null
                const initial = partner.partner_name.charAt(0).toUpperCase()
                return (
                  <div
                    key={partner.id}
                    className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                  >
                    {partner.logo_url ? (
                      <img src={partner.logo_url} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-violet-600 dark:text-violet-300">{initial}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                        {partner.partner_name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{partner.benefit_name}</p>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        {cat && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium">
                            {cat.emoji} {cat.label}
                          </span>
                        )}
                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 font-medium">
                          {useType?.label}
                        </span>
                        {tierInfo ? (
                          <span
                            className="text-xs px-1.5 py-0.5 rounded-full font-medium text-white"
                            style={{ backgroundColor: tierInfo.color }}
                          >
                            {tierInfo.name}+
                          </span>
                        ) : (
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 font-medium">
                            Todos
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditPartner(partner)}
                        className="p-1.5 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950/30 text-gray-400 hover:text-violet-500 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemovePartner(partner.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400 dark:text-gray-500">
              <Building2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Todavía no hay comercios adheridos</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── Ticker Section ───────────────────────────────────────────────────────────

export function TickerSection({ formData, setFormData }) {
  const [newItem, setNewItem] = useState('')
  const items = formData.ticker_items || []

  const handleAdd = () => {
    if (!newItem.trim()) return
    setFormData((prev) => ({ ...prev, ticker_items: [...items, newItem.trim()] }))
    setNewItem('')
  }

  const handleRemove = (i) => {
    setFormData((prev) => ({ ...prev, ticker_items: prev.ticker_items.filter((_, idx) => idx !== i) }))
  }

  return (
    <div className="border-t pt-6 space-y-4">
      <div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Banner deslizante</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Texto que se desplaza en el encabezado de la página pública del club.
        </p>
      </div>
      <div className="flex gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Ej: ☕ Cappuccino artesanal"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleAdd()
            }
          }}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={handleAdd}
          disabled={!newItem.trim()}
          className="bg-violet-500 hover:bg-violet-600 text-white"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 text-sm text-violet-800 dark:text-violet-300"
            >
              {item}
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="text-violet-400 hover:text-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
          Todavía no hay elementos en el banner
        </p>
      )}
    </div>
  )
}

// ─── Novedades Section ────────────────────────────────────────────────────────

const POST_TYPES = [
  { value: 'novedad', label: 'Novedad', emoji: '📢', color: 'bg-violet-500' },
  { value: 'promo', label: 'Promo', emoji: '🏷️', color: 'bg-rose-500' },
  { value: 'evento', label: 'Evento', emoji: '📅', color: 'bg-amber-500' },
]

const DEFAULT_POST = { type: 'novedad', title: '', body: '', image_url: null, date: '' }

export function NovedadesSection({ formData, setFormData }) {
  const [newPost, setNewPost] = useState(DEFAULT_POST)
  const [imagePreview, setImagePreview] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [open, setOpen] = useState(false)
  const posts = formData.novedades || []

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleAdd = () => {
    if (!newPost.title.trim()) return
    const date = newPost.date.trim() || new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })
    if (editingId !== null) {
      setFormData((prev) => ({
        ...prev,
        novedades: prev.novedades.map((p) =>
          p.id === editingId
            ? {
                ...p,
                ...newPost,
                title: newPost.title.trim(),
                body: newPost.body.trim(),
                date,
                image_url: imagePreview ?? p.image_url,
              }
            : p,
        ),
      }))
      setEditingId(null)
    } else {
      setFormData((prev) => ({
        ...prev,
        novedades: [
          {
            id: Date.now(),
            ...newPost,
            title: newPost.title.trim(),
            body: newPost.body.trim(),
            date,
            image_url: imagePreview || null,
          },
          ...(prev.novedades || []),
        ],
      }))
    }
    setNewPost(DEFAULT_POST)
    setImagePreview(null)
  }

  const handleEdit = (post) => {
    setEditingId(post.id)
    setNewPost({
      type: post.type,
      title: post.title,
      body: post.body || '',
      image_url: post.image_url,
      date: post.date || '',
    })
    setImagePreview(null)
    setOpen(true)
  }

  const handleCancel = () => {
    setEditingId(null)
    setNewPost(DEFAULT_POST)
    setImagePreview(null)
  }

  const handleRemove = (id) => {
    setFormData((prev) => ({ ...prev, novedades: prev.novedades.filter((p) => p.id !== id) }))
    if (editingId === id) handleCancel()
  }

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Megaphone className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Novedades</h3>
          {posts.length > 0 && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300">
              {posts.length}
            </span>
          )}
        </div>
        <ChevronDown
          className="w-4 h-4 text-gray-400 transition-transform"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {open && (
        <div className="border-t border-gray-100 dark:border-gray-800 px-5 py-5 space-y-5">
          {/* Add / edit form */}
          <div
            className={`rounded-2xl border p-4 space-y-4 ${
              editingId !== null
                ? 'border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/10'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
            }`}
          >
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {editingId !== null ? 'Editar novedad' : 'Agregar novedad'}
            </p>

            {/* Type pills */}
            <div className="grid grid-cols-3 gap-2">
              {POST_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setNewPost((p) => ({ ...p, type: t.value }))}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border-2 py-2 text-xs font-semibold transition-all ${
                    newPost.type === t.value
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <span>{t.emoji}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Título *</Label>
              <Input
                value={newPost.title}
                onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))}
                placeholder="Ej: Nueva línea de fríos de temporada"
              />
            </div>

            {/* Body */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Descripción</Label>
              <Textarea
                value={newPost.body}
                onChange={(e) => setNewPost((p) => ({ ...p, body: e.target.value }))}
                placeholder="Contá más detalles..."
                rows={2}
                className="resize-none"
              />
            </div>

            {/* Image + Date */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Imagen</Label>
                {imagePreview || (editingId !== null && newPost.image_url) ? (
                  <div className="relative w-full h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img src={imagePreview || newPost.image_url} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null)
                        setNewPost((p) => ({ ...p, image_url: null }))
                      }}
                      className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/80 flex items-center justify-center shadow"
                    >
                      <X className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-1.5 h-20 w-full rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 cursor-pointer hover:border-violet-400 transition-colors text-gray-400 hover:text-violet-500 text-xs font-medium">
                    <Upload className="w-4 h-4" />
                    Subir
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Fecha visible</Label>
                <Input
                  value={newPost.date}
                  onChange={(e) => setNewPost((p) => ({ ...p, date: e.target.value }))}
                  placeholder="Ej: 7 jul"
                />
                <p className="text-xs text-gray-400">Se muestra en la tarjeta</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleAdd}
                disabled={!newPost.title.trim()}
                className="flex-1 bg-violet-500 hover:bg-violet-600 text-white"
              >
                {editingId !== null ? (
                  'Guardar cambios'
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-1" />
                    Agregar novedad
                  </>
                )}
              </Button>
              {editingId !== null && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
              )}
            </div>
          </div>

          {/* List */}
          {posts.length > 0 ? (
            <div className="space-y-2">
              {posts.map((post) => {
                const typeInfo = POST_TYPES.find((t) => t.value === post.type)
                return (
                  <div
                    key={post.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      editingId === post.id
                        ? 'border-violet-300 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/10'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                    }`}
                  >
                    {post.image_url ? (
                      <img src={post.image_url} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 text-2xl">
                        {typeInfo?.emoji}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-xs font-bold text-white px-1.5 py-0.5 rounded-md ${typeInfo?.color}`}>
                          {typeInfo?.label}
                        </span>
                        {post.date && <span className="text-xs text-gray-400">{post.date}</span>}
                      </div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{post.title}</p>
                      {post.body && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{post.body}</p>}
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEdit(post)}
                        className="p-1.5 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-950/30 text-gray-400 hover:text-violet-500 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemove(post.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400 dark:text-gray-500">
              <Megaphone className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Todavía no hay novedades</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
