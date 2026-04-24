import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Loader2, Upload, Plus, Trash2, ImageIcon, Package, ArrowRightLeft, Users } from 'lucide-react'
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

      {!isPoints && !isCoupon && !isMembership && !isCashback && (
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

function AccumulationField({ formData, setFormData }) {
  const moneyPerPoint = formData.money_per_point ?? 1000
  return (
    <div className="space-y-2">
      <Label htmlFor="money_per_point">Acumulación</Label>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        ¿Cuánto tiene que gastar el cliente para ganar 1 punto?
      </p>
      <div className="flex items-center gap-3">
        <Input
          id="money_per_point"
          type="number"
          min="1"
          value={moneyPerPoint}
          onChange={(e) => {
            const v = parseInt(e.target.value)
            if (!isNaN(v) && v >= 1) setFormData((prev) => ({ ...prev, money_per_point: v }))
          }}
          className="h-12 flex-1"
        />
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">= 1 punto</span>
      </div>
    </div>
  )
}

function DirectRedeemFields({ formData, setFormData }) {
  const moneyPerPoint = formData.money_per_point ?? 1000
  const moneyPerPointRedeem = formData.money_per_point_redeem ?? 100
  const exampleSpend = moneyPerPoint * 5
  const earnedPoints = moneyPerPoint > 0 ? Math.floor(exampleSpend / moneyPerPoint) : 0
  const redeemValue = earnedPoints * moneyPerPointRedeem

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="money_per_point_redeem">Valor de canje</Label>
        <p className="text-xs text-gray-500 dark:text-gray-400">¿Cuánto vale 1 punto cuando el cliente lo canjea?</p>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">1 punto =</span>
          <Input
            id="money_per_point_redeem"
            type="number"
            min="1"
            value={moneyPerPointRedeem}
            onChange={(e) => {
              const v = parseInt(e.target.value)
              if (!isNaN(v) && v >= 1) setFormData((prev) => ({ ...prev, money_per_point_redeem: v }))
            }}
            className="h-12 flex-1"
          />
        </div>
      </div>

      <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 p-4 space-y-2">
        <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
          Ejemplo con estos valores
        </p>
        <div className="space-y-2 text-sm text-blue-900 dark:text-blue-200">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              1
            </span>
            <span>
              Gasta <strong>{exampleSpend.toLocaleString()}</strong> → gana{' '}
              <strong>
                {earnedPoints} {earnedPoints === 1 ? 'punto' : 'puntos'}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              2
            </span>
            <span>
              Al canjear obtiene <strong>{redeemValue.toLocaleString()}</strong> de descuento o crédito
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

function CatalogFields({ formData, setFormData }) {
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

export function PointsConversionSection({ formData, setFormData }) {
  const redeemMode = formData.redeem_mode || 'direct'

  return (
    <div className="border-t pt-6 pb-6 space-y-5">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Configuración de puntos</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Definí cómo acumulan y cómo canjean puntos tus clientes.
        </p>
      </div>

      {/* Acumulación — siempre visible */}
      <AccumulationField formData={formData} setFormData={setFormData} />

      {/* Modo de canje */}
      <div className="space-y-3">
        <Label>Modo de canje</Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              value: 'direct',
              icon: ArrowRightLeft,
              title: 'Conversión directa',
              desc: 'Los puntos se convierten en dinero o crédito',
            },
            {
              value: 'catalog',
              icon: Package,
              title: 'Catálogo',
              desc: 'El cliente elige un producto o servicio',
            },
          ].map((opt) => {
            const Icon = opt.icon
            const isSelected = redeemMode === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, redeem_mode: opt.value }))}
                className={`flex flex-col items-start gap-1.5 p-3 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/40'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-blue-500' : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <p
                  className={`text-xs font-semibold ${isSelected ? 'text-foreground' : 'text-gray-500 dark:text-gray-400'}`}
                >
                  {opt.title}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 leading-tight">{opt.desc}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Campos según modo */}
      {redeemMode === 'direct' && <DirectRedeemFields formData={formData} setFormData={setFormData} />}
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

export function CustomerDataFields({ formData, setFormData }) {
  const { t } = useLanguage()

  return (
    <div className="border-t pt-6 pb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('formCustomerData')}</h3>
      <div className="grid gap-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl opacity-75">
          <div className="space-y-0.5">
            <Label className="text-base">
              {t('formNameLabel')}{' '}
              <span className="text-xs text-gray-400 dark:text-gray-500">({t('formRequired')})</span>
            </Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('formRequestName')}</p>
          </div>
          <Input type="checkbox" checked={true} disabled className="w-6 h-6 accent-yellow-500 cursor-not-allowed" />
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl opacity-75">
          <div className="space-y-0.5">
            <Label className="text-base">
              Email <span className="text-xs text-gray-400 dark:text-gray-500">({t('formRequired')})</span>
            </Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('formRequestEmail')}</p>
          </div>
          <Input type="checkbox" checked={true} disabled className="w-6 h-6 accent-yellow-500 cursor-not-allowed" />
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div className="space-y-0.5">
            <Label className="text-base">{t('formPhoneLabel')}</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('formRequestPhone')}</p>
          </div>
          <Input
            type="checkbox"
            checked={formData.collect_phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, collect_phone: e.target.checked }))}
            className="w-6 h-6 accent-yellow-500"
          />
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div className="space-y-0.5">
            <Label className="text-base">{t('formBirthdayLabel')}</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('formRequestBirthday')}</p>
          </div>
          <Input
            type="checkbox"
            checked={formData.collect_birthday}
            onChange={(e) => setFormData((prev) => ({ ...prev, collect_birthday: e.target.checked }))}
            className="w-6 h-6 accent-yellow-500"
          />
        </div>
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

export function ReferralSection({ formData, setFormData }) {
  const enabled = formData.referral_enabled || false
  const isMembership = formData.program_type_id === MEMBERSHIP_TYPE_ID
  const membershipRewardType = formData.referral_reward_membership_type || 'days'
  const config = getReferralConfig(formData.program_type_id, formData)

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
                <span>Su amigo se registra usando ese link y obtiene su tarjeta.</span>
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
  { value: 'manual', label: 'Manual', desc: 'Vos entregás el cupón manualmente desde el panel.' },
]

const COUPON_BENEFIT_TYPES = [
  { value: 'percent', label: '% de descuento' },
  { value: 'fixed', label: 'Monto fijo' },
  { value: 'free_item', label: 'Producto gratis' },
]

export function CouponConfigSection({ formData, setFormData }) {
  const trigger = formData.coupon_trigger || 'purchase'
  const benefitType = formData.coupon_benefit_type || 'percent'
  const benefitValue = formData.coupon_benefit_value ?? 10
  const validityDays = formData.coupon_validity_days ?? 30
  const selectedTrigger = COUPON_TRIGGERS.find((t) => t.value === trigger)

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
        <div className="grid grid-cols-1 gap-2">
          {COUPON_TRIGGERS.map((opt) => {
            const isSelected = trigger === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, coupon_trigger: opt.value }))}
                className={`flex items-start gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-orange-400 bg-orange-50 dark:bg-orange-950/40'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${isSelected ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'}`}
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
        <p className="text-sm text-orange-900 dark:text-orange-200">
          {selectedTrigger?.label} → el cliente recibe un cupón de{' '}
          <strong>
            {benefitType === 'percent' && `${benefitValue}% de descuento`}
            {benefitType === 'fixed' && `$${benefitValue} de descuento`}
            {benefitType === 'free_item' && (formData.coupon_description || 'producto gratis')}
          </strong>{' '}
          válido por <strong>{validityDays} días</strong>.
        </p>
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
  const [newTier, setNewTier] = useState({ name: '', min_spend: '', color: '#f59e0b' })
  const [newBenefit, setNewBenefit] = useState({
    name: '',
    description: '',
    use_type: 'unlimited',
    tier_required: 'all',
  })
  const [benefitImagePreview, setBenefitImagePreview] = useState(null)

  const activation = formData.membership_activation || 'free'
  const tiers = [...(formData.membership_tiers || [])].sort((a, b) => a.min_spend - b.min_spend)
  const catalog = formData.membership_catalog || []

  const handleAddTier = () => {
    if (!newTier.name.trim() || newTier.min_spend === '') return
    const tier = {
      id: Date.now().toString(),
      name: newTier.name.trim(),
      min_spend: parseInt(newTier.min_spend) || 0,
      color: newTier.color,
    }
    setFormData((prev) => ({ ...prev, membership_tiers: [...(prev.membership_tiers || []), tier] }))
    setNewTier({ name: '', min_spend: '', color: '#f59e0b' })
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
    const benefit = {
      id: Date.now(),
      name: newBenefit.name.trim(),
      description: newBenefit.description.trim(),
      use_type: newBenefit.use_type,
      tier_required: newBenefit.tier_required,
      image_url: benefitImagePreview || null,
    }
    setFormData((prev) => ({ ...prev, membership_catalog: [...(prev.membership_catalog || []), benefit] }))
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
              desc: 'Los clientes suben de nivel según cuánto gastan. Cada nivel tiene sus propios beneficios.',
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
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3 bg-gray-50 dark:bg-gray-800/50">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Agregar nivel</p>
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
            <Button
              type="button"
              onClick={handleAddTier}
              disabled={!newTier.name.trim() || newTier.min_spend === ''}
              className="w-full gap-2 text-white"
              style={{ backgroundColor: newTier.color }}
            >
              <Plus className="w-4 h-4" />
              Agregar nivel
            </Button>
          </div>

          {tiers.length > 0 ? (
            <div className="space-y-2">
              {tiers.map((tier) => (
                <div
                  key={tier.id}
                  className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <div className="w-8 h-8 rounded-lg flex-shrink-0" style={{ backgroundColor: tier.color }} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{tier.name}</p>
                    <p className="text-xs text-gray-400">Gasto mínimo: ${parseInt(tier.min_spend).toLocaleString()}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTier(tier.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
        <div>
          <Label>Beneficios del programa</Label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Agregá descuentos, productos o servicios. Definí si son ilimitados, 1 vez por mes, o de un solo uso.
          </p>
        </div>

        {/* Form nuevo beneficio */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3 bg-gray-50 dark:bg-gray-800/50">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Agregar beneficio</p>

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

          <Button
            type="button"
            onClick={handleAddBenefit}
            disabled={!newBenefit.name.trim()}
            className="w-full gap-2 bg-violet-500 hover:bg-violet-600 text-white"
          >
            <Plus className="w-4 h-4" />
            Agregar beneficio
          </Button>
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
                  <button
                    type="button"
                    onClick={() => handleRemoveBenefit(benefit.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
