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

const POINTS_DESCRIPTION =
  'Los clientes acumulan puntos según el monto gastado. Vos definís cuánto dinero equivale a 1 punto y cuánto vale cada punto al canjear.'

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
        </SelectContent>
      </Select>
      <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-300 rounded-lg">
        <p className="text-xs text-yellow-900 dark:text-yellow-200 leading-relaxed">
          {formData.program_type_id === POINTS_TYPE_ID
            ? POINTS_DESCRIPTION
            : 'Programa clásico donde los clientes acumulan sellos por cada compra. Al completar todos los sellos, obtienen una recompensa. Ejemplo: Compra 5 cafés, el 6° es gratis.'}
        </p>
      </div>
    </div>
  )
}

export function BasicInfoFields({ formData, setFormData, setIsFlipped }) {
  const { t } = useLanguage()
  const isPoints = formData.program_type_id === POINTS_TYPE_ID

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

      {!isPoints && (
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

      {!isPoints && (
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

      {!isPoints && (
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

export function ReferralSection({ formData, setFormData }) {
  const isPoints = formData.program_type_id === POINTS_TYPE_ID
  const enabled = formData.referral_enabled || false

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
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isPoints
                ? 'El cliente que refiere recibe puntos cuando su amigo se registra.'
                : 'El cliente que refiere recibe sellos cuando su amigo se registra.'}
            </p>
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
          <div className="space-y-2">
            <Label htmlFor="referral_reward">
              {isPoints ? 'Puntos para el que refiere' : 'Sellos para el que refiere'}
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="referral_reward"
                type="number"
                min="1"
                placeholder={isPoints ? '150' : '1'}
                value={isPoints ? formData.referral_reward_points || '' : formData.referral_reward_stamps || ''}
                onChange={(e) => {
                  const v = parseInt(e.target.value) || 0
                  setFormData((prev) =>
                    isPoints ? { ...prev, referral_reward_points: v } : { ...prev, referral_reward_stamps: v },
                  )
                }}
                className="h-12 max-w-[140px]"
              />
              <span className="text-sm text-gray-500">{isPoints ? 'puntos' : 'sellos'}</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isPoints
                ? 'Se acreditarán automáticamente cuando el amigo complete su registro y realice su primera visita.'
                : 'Se acreditarán automáticamente cuando el amigo complete su registro y realice su primera visita.'}
            </p>
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
                <span>Su amigo se registra usando ese link y obtiene su tarjeta.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex-shrink-0">③</span>
                <span>
                  Al completar su primera visita, el cliente que refirió recibe{' '}
                  {isPoints
                    ? `${formData.referral_reward_points || '—'} puntos`
                    : `${formData.referral_reward_stamps || '—'} ${(formData.referral_reward_stamps || 0) === 1 ? 'sello' : 'sellos'}`}{' '}
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
