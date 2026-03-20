import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Upload } from 'lucide-react'
import { useLanguage } from '@/components/auth/LanguageContext'
import { getProgramTypeDescription } from '@/constants/programTypes'

export function StoreSelector({ stores, formData, setFormData }) {
  if (stores.length <= 1) return null

  return (
    <div className="space-y-2">
      <Label>Sucursales *</Label>
      <p className="text-xs text-gray-500 dark:text-gray-400">Seleccioná las sucursales donde aplica este programa</p>
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

export function ProgramTypeSelector({ formData, setFormData, className }) {
  return (
    <div className={`space-y-2 ${className || ''}`}>
      <Label htmlFor="program_type_id">Tipo de Club *</Label>
      <Select
        value={formData.program_type_id}
        onValueChange={(value) => setFormData((prev) => ({ ...prev, program_type_id: value }))}
      >
        <SelectTrigger className="h-12">
          <SelectValue placeholder="Selecciona el tipo de Club" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc151">Sellos</SelectItem>
        </SelectContent>
      </Select>
      <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-300 rounded-lg">
        <p className="text-xs text-yellow-900 leading-relaxed">{getProgramTypeDescription(formData.program_type_id)}</p>
      </div>
    </div>
  )
}

export function BasicInfoFields({ formData, setFormData, setIsFlipped }) {
  const { t } = useLanguage()

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
          <span className="text-xs text-gray-400 dark:text-gray-500">Solo para control interno</span>
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
        <p className="text-xs text-gray-500 dark:text-gray-400">{formData.reward_text?.length || 0}/35 caracteres</p>
      </div>

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
        <p className="text-xs text-gray-500 dark:text-gray-400">Máximo 20 sellos</p>
      </div>
    </>
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
        <Label>Imagen de Fondo</Label>
        <div className="flex gap-3 items-center">
          {formData.background_image_url && (
            <img
              src={formData.background_image_url}
              alt="Imagen de fondo"
              className="w-16 h-16 rounded-xl object-cover border"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          )}
          <ImageUploadButton
            uploading={uploadingBackground}
            label="Subir Imagen de Fondo"
            onChange={handleBackgroundImageUpload}
            onClick={() => setIsFlipped(false)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Imagen de Sello</Label>
        <div className="flex gap-3 items-center">
          {formData.stamp_image_url && (
            <img
              src={formData.stamp_image_url}
              alt="Imagen de sello"
              className="w-16 h-16 rounded-xl object-cover border"
            />
          )}
          <ImageUploadButton
            uploading={uploadingStamp}
            label="Subir Imagen de Sello"
            onChange={handleStampImageUpload}
            onClick={() => setIsFlipped(false)}
          />
        </div>
      </div>
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
        <Label htmlFor="foreground_color">Color de texto</Label>
        <Input
          id="foreground_color"
          type="color"
          value={formData.foreground_color}
          onChange={(e) => setFormData((prev) => ({ ...prev, foreground_color: e.target.value }))}
          className="h-12 cursor-pointer"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="label_color">Color de etiqueta</Label>
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
  return (
    <div className="border-t pt-6 pb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Datos a Solicitar al Cliente</h3>
      <div className="grid gap-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl opacity-75">
          <div className="space-y-0.5">
            <Label className="text-base">
              Nombre <span className="text-xs text-gray-400 dark:text-gray-500">(requerido)</span>
            </Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">Solicitar nombre al cliente</p>
          </div>
          <Input type="checkbox" checked={true} disabled className="w-6 h-6 accent-yellow-500 cursor-not-allowed" />
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl opacity-75">
          <div className="space-y-0.5">
            <Label className="text-base">
              Email <span className="text-xs text-gray-400 dark:text-gray-500">(requerido)</span>
            </Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">Solicitar email al cliente</p>
          </div>
          <Input type="checkbox" checked={true} disabled className="w-6 h-6 accent-yellow-500 cursor-not-allowed" />
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div className="space-y-0.5">
            <Label className="text-base">Teléfono</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">Solicitar número de celular</p>
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
            <Label className="text-base">Cumpleaños</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">Solicitar fecha de nacimiento</p>
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
      </div>
    </div>
  )
}

export function BusinessInfoSection({ formData, setFormData, setIsFlipped }) {
  const { t } = useLanguage()

  return (
    <>
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Datos de tu Negocio</h3>

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
        <p className="text-xs text-gray-500 dark:text-gray-400">{formData.terms?.length || 0}/300 caracteres</p>
      </div>
    </>
  )
}
