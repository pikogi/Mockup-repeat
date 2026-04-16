import { useState, useEffect, useRef } from 'react'
import { api } from '@/api/client'
import { getCurrentUser } from '@/utils/jwt'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { createPageUrl } from '@/utils'
import { toast } from 'sonner'
import {
  compressForBrandUpload,
  compressForStampCard,
  resizeImageToMax,
  cropToCircle,
  sampleCircleEdgeColor,
  estimateBase64Size,
} from '@/utils/image'
import { useLanguage } from '@/components/auth/LanguageContext'

const DEFAULT_FORM_DATA = {
  club_name: '',
  program_type_id: '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc151', // Default: Sellos
  description: '',
  reward_text: '',
  reward_tiers: [],
  stamps_required: 5,
  logo_url: '',
  background_image_url: '',
  stamp_image_url: '',
  stamp_icon_bg_color: '#000000',
  card_color: '#000000',
  foreground_color: '#FFFFFF',
  label_color: '#FFFFFF',
  terms: '',
  contact_email: '',
  contact_phone: '',
  website: '',
  security_ticket_required: false,
  security_geofence_required: false,
  security_cooldown_hours: 0,
  validity_stamps_days: 0,
  validity_reward_days: 0,
  validity_duration_days: 0,
  collect_name: true,
  collect_email: true,
  collect_phone: false,
  collect_birthday: false,
  selected_store_ids: [],
}

function getSavedImages(programId) {
  try {
    return JSON.parse(localStorage.getItem(`program_images_${programId}`) || '{}')
  } catch {
    return {}
  }
}

function isBase64(url) {
  return url?.startsWith('data:')
}

// Build form data from an existing program, merging API response + program list + localStorage fallbacks
function buildFormDataFromProgram(existingProgram, programFromList, brandId, stores) {
  const images = existingProgram.images || programFromList?.images || {}
  const walletDesign = { ...existingProgram.wallet_design, ...programFromList?.wallet_design }
  const metadata = existingProgram.metadata || programFromList?.metadata || {}
  const savedImages = getSavedImages(existingProgram.program_id)

  return {
    club_name: existingProgram.program_name || '',
    program_type_id: existingProgram.program_type_id || '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc151',
    description: existingProgram.description || '',
    reward_text: existingProgram.reward_description || '',
    reward_tiers: existingProgram.reward_rules?.reward_tiers || [],
    stamps_required: existingProgram.program_rules?.stamps_required ?? 20,
    logo_url:
      existingProgram.brand?.logo_url ||
      programFromList?.brand?.logo_url ||
      walletDesign.logo_url ||
      images.logo ||
      savedImages.logo ||
      existingProgram.program_rules?.logo_url ||
      localStorage.getItem(`brand_logo_url_${brandId}`) ||
      '',
    background_image_url: savedImages.background || images.stamp_background || '',
    stamp_image_url: savedImages.stamp || images.stamp_icon || '',
    card_color: walletDesign.hex_background_color || existingProgram.program_rules?.card_color || '#000000',
    foreground_color: walletDesign.hex_foreground_color || '#FFFFFF',
    label_color: walletDesign.hex_label_color || '#FFFFFF',
    terms:
      metadata.terms_and_conditions ||
      existingProgram.program_rules?.terms_and_conditions ||
      existingProgram.program_rules?.terms ||
      '',
    contact_email: metadata.contact_email || existingProgram.program_rules?.contact_email || '',
    contact_phone: metadata.contact_phone || existingProgram.program_rules?.contact_phone || '',
    website: metadata.website || existingProgram.program_rules?.website || '',
    security_ticket_required: existingProgram.program_rules?.security_ticket_required ?? false,
    security_geofence_required: existingProgram.program_rules?.security_geofence_required ?? false,
    security_cooldown_hours: existingProgram.program_rules?.security_cooldown_hours ?? 0,
    validity_stamps_days:
      existingProgram.program_rules?.card_validity_days ?? existingProgram.program_rules?.validity_stamps_days ?? 0,
    validity_reward_days: existingProgram.program_rules?.validity_reward_days ?? 0,
    validity_duration_days: existingProgram.program_rules?.validity_duration_days ?? 0,
    collect_name: existingProgram.program_rules?.required_customer_fields?.name ?? true,
    collect_email: existingProgram.program_rules?.required_customer_fields?.email ?? true,
    collect_phone: existingProgram.program_rules?.required_customer_fields?.phone ?? false,
    collect_birthday: existingProgram.program_rules?.required_customer_fields?.birth_date ?? false,
    selected_store_ids: existingProgram.store_ids || stores.map((s) => s.store_id || s.id).filter(Boolean),
    stamp_icon_bg_color: savedImages.color || '#000000',
  }
}

const getValidityTermsText = (days) =>
  days > 0 ? `Plazo para juntar sellos: ${days} días, de lo contrario tu tarjeta vuelve a 0.` : ''

const buildProgramRules = (data) => {
  const rules = {}
  if (data.stamps_required) rules.stamps_required = data.stamps_required
  if (data.security_cooldown_hours) rules.interval_between_transactions_hours = data.security_cooldown_hours
  if (data.validity_stamps_days) rules.card_validity_days = data.validity_stamps_days
  return rules
}

const buildRequiredCustomerFields = (data) => ({
  phone: data.collect_phone || false,
  birth_date: data.collect_birthday || false,
})

const buildMetadata = (data) => {
  const metadata = {}
  if (data.terms) metadata.terms_and_conditions = data.terms
  if (data.contact_email) metadata.contact_email = data.contact_email
  if (data.contact_phone) metadata.contact_phone = data.contact_phone
  if (data.website) metadata.website = data.website
  return Object.keys(metadata).length > 0 ? metadata : undefined
}

// Update localStorage logo for other programs of the same brand
function updateOtherProgramsLogo(programsList, excludeId, logoUrl) {
  programsList
    .filter((p) => (p.program_id || p.id) !== excludeId)
    .forEach((p) => {
      const pid = p.program_id || p.id
      try {
        const saved = JSON.parse(localStorage.getItem(`program_images_${pid}`) || '{}')
        localStorage.setItem(`program_images_${pid}`, JSON.stringify({ ...saved, logo: logoUrl }))
      } catch {
        /* ignore */
      }
    })
}

export function useClubForm() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const urlParams = new URLSearchParams(window.location.search)
  const editId = urlParams.get('edit')

  const user = getCurrentUser()

  /* =========================
     AUTH / BRAND
  ========================= */
  const { data: meData } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const res = await api.auth.me()
      return res?.data
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  })

  const brandIdFromStorage = localStorage.getItem('brand_id')
  const brandId = brandIdFromStorage || meData?.brands?.[0]?.brand_id

  const { data: brandData } = useQuery({
    queryKey: ['brand', brandId],
    queryFn: async () => {
      if (!brandId) return null
      const res = await api.brands.get(brandId)
      return res?.data || res
    },
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
  })

  // Stores via React Query (replaces useStoresStore)
  const { data: stores = [] } = useQuery({
    queryKey: ['stores', brandId],
    queryFn: async () => {
      if (!brandId) return []
      const res = await api.stores.list(brandId)
      return res?.data || res || []
    },
    enabled: !!brandId,
    staleTime: 5 * 60 * 1000,
  })

  // Programs list from cache (shared with useMyPrograms via same queryKey)
  const programsList = queryClient.getQueryData(['loyaltyPrograms', brandId]) || []

  /* =========================
     STATE
  ========================= */
  const [programId, setProgramId] = useState(null)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingBackground, setUploadingBackground] = useState(false)
  const [uploadingStamp, setUploadingStamp] = useState(false)
  const [newUpload, setNewUpload] = useState({ logo: false, background: false, stamp: false })
  const initialFormData = useRef(null)
  const [previewPlatform, setPreviewPlatform] = useState('ios')
  const [isFlipped, setIsFlipped] = useState(false)
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA)

  const stampCardImageUrl = editId && programId ? `${api.images.getStampCardUrl(programId, 0)}?v=${Date.now()}` : null

  /* =========================
     LOAD EXISTING PROGRAM
  ========================= */
  const { data: existingProgram } = useQuery({
    queryKey: ['loyaltyProgram', editId],
    queryFn: async () => {
      if (!editId) return null
      const res = await api.loyaltyPrograms.get(editId)
      return res?.data || res || null
    },
    enabled: !!editId,
    gcTime: 0,
    initialData: () => {
      const programs = queryClient.getQueryData(['loyaltyPrograms', brandId])
      return programs?.find((p) => (p.program_id || p.id) === editId) ?? undefined
    },
  })

  // Initialize selected_store_ids with all stores when they load (create mode only)
  useEffect(() => {
    if (stores.length > 0 && !editId) {
      setFormData((prev) => ({
        ...prev,
        selected_store_ids: stores.map((s) => s.store_id || s.id).filter(Boolean),
      }))
    }
  }, [stores.length]) // eslint-disable-line react-hooks/exhaustive-deps

  // Pre-load brand logo in create mode
  useEffect(() => {
    if (editId) return
    const logoUrl = brandData?.logo_url || null
    if (logoUrl) {
      setFormData((prev) => ({ ...prev, logo_url: prev.logo_url || logoUrl }))
    }
  }, [brandData]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setDataLoaded(false)
  }, [editId])

  useEffect(() => {
    if (existingProgram && !dataLoaded) {
      setProgramId(existingProgram.program_id)
      setNewUpload({ logo: false, background: false, stamp: false })

      const programFromList = programsList.find((p) => (p.program_id || p.id) === existingProgram.program_id)
      const data = buildFormDataFromProgram(existingProgram, programFromList, brandId, stores)

      setFormData(data)
      initialFormData.current = { ...data }
      setDataLoaded(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingProgram, dataLoaded])

  // Sync images from API when existingProgram updates (preserves user uploads)
  useEffect(() => {
    if (!existingProgram) return
    const programFromList = programsList.find((p) => (p.program_id || p.id) === existingProgram.program_id)
    const images = existingProgram.images || programFromList?.images || {}
    const walletDesign = { ...existingProgram.wallet_design, ...programFromList?.wallet_design }
    const savedImages = getSavedImages(existingProgram.program_id)
    setFormData((prev) => ({
      ...prev,
      logo_url: newUpload.logo
        ? prev.logo_url
        : existingProgram.brand?.logo_url ||
          programFromList?.brand?.logo_url ||
          walletDesign.logo_url ||
          images.logo ||
          savedImages.logo ||
          existingProgram.program_rules?.logo_url ||
          localStorage.getItem(`brand_logo_url_${brandId}`) ||
          prev.logo_url,
      background_image_url: newUpload.background
        ? prev.background_image_url
        : savedImages.background || images.stamp_background || prev.background_image_url,
      stamp_image_url: newUpload.stamp
        ? prev.stamp_image_url
        : savedImages.stamp || images.stamp_icon || prev.stamp_image_url,
    }))
  }, [existingProgram]) // eslint-disable-line react-hooks/exhaustive-deps

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!brandId) return

    if (formData.program_type_id === '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc157') {
      toast.info('El programa de Puntos todavía no está disponible. Este es un mockup visual.')
      return
    }

    const program_rules = buildProgramRules(formData)
    const required_customer_fields = buildRequiredCustomerFields(formData)
    const metadata = buildMetadata(formData)
    const reward_rules = formData.reward_tiers?.length ? { reward_tiers: formData.reward_tiers } : undefined

    setIsSubmitting(true)

    try {
      if (editId) {
        await handleUpdate({
          program_rules,
          required_customer_fields,
          metadata,
          reward_rules,
        })
      } else {
        await handleCreate({
          program_rules,
          required_customer_fields,
          metadata,
          reward_rules,
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async ({ program_rules, required_customer_fields, metadata, reward_rules }) => {
    const idToUpdate = programId || editId
    if (!idToUpdate) return

    const hasChanged = (field) => JSON.stringify(formData[field]) !== JSON.stringify(initialFormData.current?.[field])

    const updateData = {}

    if (hasChanged('club_name')) updateData.program_name = formData.club_name
    if (hasChanged('description')) updateData.description = formData.description
    if (hasChanged('reward_text')) updateData.reward_description = formData.reward_text
    if (reward_rules && hasChanged('reward_tiers')) updateData.reward_rules = reward_rules

    const programRulesFields = [
      'stamps_required',
      'security_cooldown_hours',
      'collect_phone',
      'collect_birthday',
      'validity_stamps_days',
    ]
    const programRulesChanged = programRulesFields.some(hasChanged)
    if (programRulesChanged) {
      updateData.program_rules = { ...program_rules, required_customer_fields }
    }

    const metadataFields = ['terms', 'contact_email', 'contact_phone', 'website']
    const metadataChanged = metadataFields.some(hasChanged)
    if (metadataChanged) {
      if (metadata) updateData.metadata = metadata
    }

    const logoVersion = newUpload.logo ? Date.now() : null
    const s3LogoUrl = api.images.getLogoUrl(brandId)
    const versionedLogoUrl = logoVersion && s3LogoUrl ? `${s3LogoUrl}?v=${logoVersion}` : s3LogoUrl || null

    const walletDesignChanged =
      hasChanged('card_color') || hasChanged('foreground_color') || hasChanged('label_color') || newUpload.logo
    if (walletDesignChanged) {
      updateData.wallet_design = {
        hex_background_color: formData.card_color || null,
        hex_foreground_color: formData.foreground_color || null,
        hex_label_color: formData.label_color || null,
        show_logo_text: false,
      }
      if (!updateData.program_rules) {
        updateData.program_rules = { ...program_rules, required_customer_fields }
      }
    }

    if (newUpload.logo && versionedLogoUrl) {
      if (!updateData.program_rules) {
        updateData.program_rules = { ...program_rules, required_customer_fields }
      }
      updateData.program_rules = { ...updateData.program_rules, logo_url: versionedLogoUrl }
    }

    if (hasChanged('selected_store_ids') && formData.selected_store_ids.length > 0) {
      updateData.store_ids = formData.selected_store_ids
    }

    console.log('[CreateClub] updateData (dirty fields only):', updateData)

    const hasStampsRequiredChanged = hasChanged('stamps_required')
    const { logo: hasNewLogo, background: hasNewBackground, stamp: hasNewStamp } = newUpload

    const prevImages = getSavedImages(idToUpdate)

    const shouldRegenerateImage = hasNewBackground || hasNewStamp || hasNewLogo || hasStampsRequiredChanged
    // Only use base64 data URLs for compression — remote S3 URLs can't be drawn
    // to canvas without CORS headers. Null fields are omitted by the stamp card API,
    // so the backend reuses existing images for any missing components.
    const prevBg = isBase64(prevImages.background) ? prevImages.background : null
    const prevStamp = isBase64(prevImages.stamp) ? prevImages.stamp : null
    const prevLogo = isBase64(prevImages.logo) ? prevImages.logo : null

    const hasLocalImages =
      (hasNewBackground ? formData.background_image_url : prevBg) ||
      (hasNewStamp ? formData.stamp_image_url : prevStamp) ||
      (hasNewLogo ? formData.logo_url : prevLogo)

    // Compress images before updating so we can validate payload size
    const stampBgColor = hasNewStamp ? formData.stamp_icon_bg_color : prevImages.color || formData.stamp_icon_bg_color
    const rawBg = hasNewBackground ? formData.background_image_url : prevBg
    const rawStamp = hasNewStamp ? formData.stamp_image_url : prevStamp
    const rawLogo = hasNewLogo ? formData.logo_url : prevLogo

    let compBg, compStamp, compLogo, compBrandLogo
    try {
      ;[compBg, compStamp, compLogo, compBrandLogo] = await Promise.all([
        shouldRegenerateImage && hasLocalImages && rawBg ? compressForStampCard(rawBg) : null,
        shouldRegenerateImage && hasLocalImages && rawStamp ? rawStamp : null,
        shouldRegenerateImage && hasLocalImages && rawLogo ? compressForStampCard(rawLogo) : null,
        hasNewLogo && formData.logo_url ? compressForBrandUpload(formData.logo_url) : null,
      ])
    } catch {
      toast.error(t('clubFormImageError'))
      return
    }

    if (shouldRegenerateImage && hasLocalImages) {
      const MAX_PAYLOAD_BYTES = 5 * 1024 * 1024 // 5MB safe limit (Lambda max 6MB)
      const stampCardSize = estimateBase64Size(compBg) + estimateBase64Size(compStamp) + estimateBase64Size(compLogo)
      if (stampCardSize > MAX_PAYLOAD_BYTES) {
        toast.error(t('clubFormImagesTooLarge'))
        return
      }
    }

    try {
      await api.loyaltyPrograms.update(idToUpdate, updateData)

      // Optimistically update the programs list cache so MyPrograms shows changes immediately
      queryClient.setQueryData(['loyaltyPrograms', brandId], (old) => {
        if (!old) return old
        return old.map((p) => {
          if ((p.program_id || p.id) !== idToUpdate) return p
          const updated = { ...p }
          if (updateData.program_name !== undefined) updated.program_name = updateData.program_name
          if (updateData.description !== undefined) updated.description = updateData.description
          if (updateData.reward_description !== undefined) updated.reward_description = updateData.reward_description
          if (updateData.reward_rules) updated.reward_rules = { ...p.reward_rules, ...updateData.reward_rules }
          if (updateData.program_rules) updated.program_rules = { ...p.program_rules, ...updateData.program_rules }
          if (updateData.wallet_design) updated.wallet_design = { ...p.wallet_design, ...updateData.wallet_design }
          if (updateData.metadata) updated.metadata = { ...p.metadata, ...updateData.metadata }
          if (updateData.store_ids) updated.store_ids = updateData.store_ids
          if (updateData.is_active !== undefined) updated.is_active = updateData.is_active
          return updated
        })
      })

      queryClient.invalidateQueries({ queryKey: ['loyaltyProgram', editId] })
      queryClient.invalidateQueries({ queryKey: ['loyaltyPrograms', brandId] })
      queryClient.invalidateQueries({ queryKey: ['brandUsers'] })
      toast.success(t('clubFormUpdated'))
    } catch (error) {
      toast.error(error?.message || t('clubFormUpdateError'))
      return
    }

    initialFormData.current = { ...formData }

    try {
      localStorage.setItem(
        `program_images_${idToUpdate}`,
        JSON.stringify({
          background: hasNewBackground ? formData.background_image_url : prevImages.background,
          stamp: hasNewStamp ? formData.stamp_image_url : prevImages.stamp,
          logo: hasNewLogo ? formData.logo_url : prevImages.logo,
          color: formData.stamp_icon_bg_color,
        }),
      )
    } catch {
      /* localStorage full */
    }

    // Run brand logo update and stamp card generation in parallel
    const parallelTasks = []

    if (hasNewLogo && formData.logo_url) {
      try {
        localStorage.setItem(`brand_logo_version_${brandId}`, logoVersion)
      } catch {
        /* ignore */
      }
      if (versionedLogoUrl) {
        try {
          localStorage.setItem(`brand_logo_url_${brandId}`, versionedLogoUrl)
        } catch {
          /* ignore */
        }
      }
      try {
        localStorage.setItem(
          `logo_preview_${brandId}`,
          JSON.stringify({ data: compBrandLogo, expires: Date.now() + 120000 }),
        )
      } catch {
        /* ignore */
      }
      updateOtherProgramsLogo(programsList, idToUpdate, versionedLogoUrl || formData.logo_url)
      parallelTasks.push(
        api.brands
          .update(brandId, { logo_image: compBrandLogo })
          .catch((err) => console.warn('[CreateClub edit] Error actualizando logo en brand:', err)),
      )
    }

    if (shouldRegenerateImage && hasLocalImages) {
      parallelTasks.push(
        api.images
          .createStampCard(idToUpdate, compBg, compStamp, compLogo, stampBgColor)
          .catch((err) => console.warn('[CreateClub edit] Error generating stamp card image:', err)),
      )
    }

    await Promise.all(parallelTasks)
    navigate(createPageUrl('MyPrograms'))
  }

  const handleCreate = async ({ program_rules, required_customer_fields, metadata, reward_rules }) => {
    const isPoints = formData.program_type_id === '7aedc7a8-b1c9-4fa3-a0b0-4ea74b6fc157'
    // Validate required images in create mode
    if (!formData.background_image_url) {
      toast.error(t('clubFormBackgroundRequired'))
      return
    }
    if (!isPoints && !formData.stamp_image_url) {
      toast.error(t('clubFormStampRequired'))
      return
    }

    const storeIds =
      formData.selected_store_ids.length > 0
        ? formData.selected_store_ids
        : stores.map((s) => s.store_id || s.id).filter(Boolean)

    const { logo: hasNewLogo, background: hasNewBackground, stamp: hasNewStamp } = newUpload

    // Compress images before creating the program so we can validate payload size
    let compBg, compStamp, compLogo, compBrandLogo
    try {
      ;[compBg, compStamp, compLogo, compBrandLogo] = await Promise.all([
        hasNewBackground && formData.background_image_url ? compressForStampCard(formData.background_image_url) : null,
        hasNewStamp && formData.stamp_image_url ? formData.stamp_image_url : null,
        hasNewLogo && formData.logo_url ? compressForStampCard(formData.logo_url) : null,
        hasNewLogo && formData.logo_url ? compressForBrandUpload(formData.logo_url) : null,
      ])
    } catch {
      toast.error(t('clubFormImageError'))
      return
    }

    const MAX_PAYLOAD_BYTES = 5 * 1024 * 1024 // 5MB safe limit (Lambda max 6MB)
    const stampCardSize = estimateBase64Size(compBg) + estimateBase64Size(compStamp) + estimateBase64Size(compLogo)
    if (stampCardSize > MAX_PAYLOAD_BYTES) {
      toast.error(t('clubFormImagesTooLarge'))
      return
    }

    const dataToSend = {
      program_type_id: formData.program_type_id,
      brand_id: brandId,
      program_name: formData.club_name,
      description: formData.description,
      start_date: new Date().toISOString(),
      reward_description: formData.reward_text,
      program_rules: { ...program_rules, required_customer_fields },
      reward_rules: reward_rules || {},
      wallet_design: {
        hex_background_color: formData.card_color || null,
        hex_foreground_color: formData.foreground_color || null,
        hex_label_color: formData.label_color || null,
        show_logo_text: false,
      },
      store_ids: storeIds,
      ...(metadata && { metadata }),
    }

    let newProgram
    try {
      const response = await api.loyaltyPrograms.create(dataToSend)
      newProgram = response?.data || response
      toast.success(t('clubFormCreated'))
      queryClient.invalidateQueries({ queryKey: ['loyaltyPrograms', brandId] })
    } catch (error) {
      toast.error(error?.message || t('clubFormCreateError'))
      return
    }

    const newProgramId = newProgram?.program_id || newProgram?.id
    if (newProgramId) {
      try {
        localStorage.setItem(
          `program_images_${newProgramId}`,
          JSON.stringify({
            background: formData.background_image_url,
            stamp: formData.stamp_image_url,
            logo: formData.logo_url,
            color: formData.stamp_icon_bg_color,
          }),
        )
      } catch {
        /* localStorage full */
      }

      try {
        // Run brand logo update and stamp card generation in parallel
        const parallelTasks = []

        if (hasNewLogo && formData.logo_url) {
          const s3LogoUrl = api.images.getLogoUrl(brandId)
          const version = Date.now()
          const versionedUrl = s3LogoUrl ? `${s3LogoUrl}?v=${version}` : null
          if (versionedUrl) {
            try {
              localStorage.setItem(`brand_logo_url_${brandId}`, versionedUrl)
            } catch {
              /* ignore */
            }
          }
          updateOtherProgramsLogo(programsList, newProgramId, versionedUrl || formData.logo_url)
          parallelTasks.push(
            api.brands
              .update(brandId, { logo_image: compBrandLogo })
              .catch((err) => console.warn('[CreateClub] Error actualizando logo en brand:', err)),
          )
        }

        parallelTasks.push(
          api.images.createStampCard(newProgramId, compBg, compStamp, compLogo, formData.stamp_icon_bg_color),
        )

        await Promise.all(parallelTasks)
      } catch (err) {
        console.warn('[CreateClub] Error generando stamp card image:', err)
        toast.warning(t('clubFormImageProcessWarning'))
      }
    }
    navigate(createPageUrl('MyPrograms'))
  }

  /* =========================
     UPLOAD HANDLERS
  ========================= */
  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error(t('clubFormInvalidImageType'))
      return
    }

    const maxSize = 1 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error(t('clubFormFileTooLarge1MB'))
      return
    }

    setUploadingLogo(true)

    try {
      const reader = new FileReader()
      reader.onloadend = async () => {
        try {
          const raw = reader.result
          const base64String = await resizeImageToMax(raw, 600, 600)
          const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
          if (brandId) localStorage.setItem(`logo_ext_${brandId}`, ext)
          setFormData((prev) => ({ ...prev, logo_url: base64String }))
          setNewUpload((prev) => ({ ...prev, logo: true }))
          setUploadingLogo(false)
          toast.success(t('clubFormLogoUploaded'))
        } catch {
          setUploadingLogo(false)
          toast.error(t('clubFormLogoProcessError'))
        }
      }
      reader.onerror = () => {
        setUploadingLogo(false)
        toast.error(t('clubFormFileReadError'))
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading logo:', error)
      setUploadingLogo(false)
      toast.error(t('clubFormLogoUploadError'))
    }
  }

  const handleBackgroundImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error(t('clubFormInvalidImageType'))
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error(t('clubFormFileTooLarge5MB'))
      return
    }

    setUploadingBackground(true)
    const reader = new FileReader()
    reader.onloadend = async () => {
      try {
        const raw = reader.result
        const base64String = await resizeImageToMax(raw, 1125, 432)
        setFormData((prev) => ({ ...prev, background_image_url: base64String }))
        setNewUpload((prev) => ({ ...prev, background: true }))
        setUploadingBackground(false)
        toast.success(t('clubFormBackgroundUploaded'))
      } catch {
        setUploadingBackground(false)
        toast.error(t('clubFormBackgroundProcessError'))
      }
    }
    reader.onerror = () => {
      setUploadingBackground(false)
      toast.error(t('clubFormFileReadError'))
    }
    reader.readAsDataURL(file)
  }

  const handleStampImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error(t('clubFormInvalidImageType'))
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error(t('clubFormFileTooLarge5MB'))
      return
    }

    setUploadingStamp(true)
    const reader = new FileReader()
    reader.onloadend = async () => {
      try {
        const raw = reader.result
        const base64String = await cropToCircle(raw, 150)
        const bgColor = await sampleCircleEdgeColor(base64String, 150)
        setFormData((prev) => ({ ...prev, stamp_image_url: base64String, stamp_icon_bg_color: bgColor }))
        setNewUpload((prev) => ({ ...prev, stamp: true }))
        setUploadingStamp(false)
        toast.success(t('clubFormStampUploaded'))
      } catch {
        setUploadingStamp(false)
        toast.error(t('clubFormStampProcessError'))
      }
    }
    reader.onerror = () => {
      setUploadingStamp(false)
      toast.error(t('clubFormFileReadError'))
    }
    reader.readAsDataURL(file)
  }

  return {
    // Form state
    formData,
    setFormData,
    // Queries
    brandData,
    brandId,
    stores,
    // Upload state
    uploadingLogo,
    uploadingBackground,
    uploadingStamp,
    // Preview state
    previewPlatform,
    setPreviewPlatform,
    isFlipped,
    setIsFlipped,
    // Submission
    handleSubmit,
    isSubmitting,
    // Upload handlers
    handleLogoUpload,
    handleBackgroundImageUpload,
    handleStampImageUpload,
    // Derived
    stampCardImageUrl,
    editId,
    isLoadingProgram: !!editId && !dataLoaded,
    // Validity helper (needed by form section)
    getValidityTermsText,
  }
}
