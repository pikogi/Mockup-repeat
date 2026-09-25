import { useRef, useState } from 'react'
import {
  Link2,
  Plus,
  Trash2,
  ExternalLink,
  QrCode,
  Download,
  ChevronUp,
  ChevronDown,
  Pencil,
  SlidersHorizontal,
  Image as ImageIcon,
  X,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { ICONS_BY_KEY, loadHubConfig, saveHubConfig } from '@/constants/moonCafeHub'

function QrButton({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors p-1"
      aria-label={`Ver QR de ${label}`}
      title="Imprimir solo este QR"
    >
      <QrCode className="w-4 h-4" />
    </button>
  )
}

function MoveButtons({ onMoveUp, onMoveDown, isFirst, isLast }) {
  return (
    <div className="flex flex-col flex-shrink-0 -my-1">
      <button
        onClick={onMoveUp}
        disabled={isFirst}
        className="text-gray-300 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30 disabled:hover:text-gray-300 transition-colors"
        aria-label="Subir"
      >
        <ChevronUp className="w-4 h-4" />
      </button>
      <button
        onClick={onMoveDown}
        disabled={isLast}
        className="text-gray-300 hover:text-gray-700 dark:hover:text-gray-300 disabled:opacity-30 disabled:hover:text-gray-300 transition-colors"
        aria-label="Bajar"
      >
        <ChevronDown className="w-4 h-4" />
      </button>
    </div>
  )
}

function EditLinkForm({ link, onSave, onCancel }) {
  const [label, setLabel] = useState(link.label)
  const [description, setDescription] = useState(link.description)
  const [url, setUrl] = useState(link.url)
  const isExternal = link.kind === 'external'

  const handleSave = () => {
    if (!label.trim()) return
    onSave({ label: label.trim(), description: description.trim(), ...(isExternal ? { url: url.trim() } : {}) })
  }

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div className="px-4 pb-4 pt-1 space-y-3 border-t border-gray-100 dark:border-gray-800">
        <div className="space-y-1.5">
          <Label className="text-xs">Título</Label>
          <Input value={label} onChange={(e) => setLabel(e.target.value)} className="text-sm" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Descripción</Label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} className="text-sm" />
        </div>
        {isExternal && (
          <div className="space-y-1.5">
            <Label className="text-xs">URL</Label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} className="text-sm" />
          </div>
        )}
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!label.trim()}>
            Guardar
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

function LinkRow({ link, isFirst, isLast, onMove, onToggle, onDelete, onShowQr, onEdit }) {
  const [editing, setEditing] = useState(false)
  const Icon = ICONS_BY_KEY[link.iconKey] ?? Link2

  const handleSave = (fields) => {
    onEdit(link.id, fields)
    setEditing(false)
    toast.success('Enlace actualizado')
  }

  return (
    <Card className="border shadow-sm overflow-hidden">
      <CardContent className="p-4 flex items-center gap-3">
        <MoveButtons
          onMoveUp={() => onMove(link.id, -1)}
          onMoveDown={() => onMove(link.id, 1)}
          isFirst={isFirst}
          isLast={isLast}
        />
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{link.label}</p>
          {link.description && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{link.description}</p>}
          {link.kind === 'external' && (
            <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">{link.url}</p>
          )}
        </div>
        <Switch checked={link.enabled} onCheckedChange={() => onToggle(link.id)} className="flex-shrink-0" />
        <button
          onClick={() => setEditing((v) => !v)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors p-1"
          aria-label={`Editar ${link.label}`}
        >
          <Pencil className="w-4 h-4" />
        </button>
        <QrButton onClick={() => onShowQr(link)} label={link.label} />
        {onDelete && (
          <button
            onClick={() => onDelete(link.id)}
            className="flex-shrink-0 text-gray-300 hover:text-red-500 transition-colors p-1"
            aria-label={`Eliminar ${link.label}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </CardContent>
      <AnimatePresence initial={false}>
        {editing && <EditLinkForm link={link} onSave={handleSave} onCancel={() => setEditing(false)} />}
      </AnimatePresence>
    </Card>
  )
}

function AddLinkForm({ onAdd, onCancel }) {
  const [label, setLabel] = useState('')
  const [url, setUrl] = useState('')

  const handleAdd = () => {
    if (!label.trim() || !url.trim()) return
    onAdd({
      id: `custom-${Date.now()}`,
      kind: 'external',
      iconKey: 'link',
      label: label.trim(),
      description: '',
      url: url.trim(),
      enabled: true,
    })
    setLabel('')
    setUrl('')
  }

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <Card className="border shadow-sm border-dashed">
        <CardContent className="p-4 space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Nombre del enlace</Label>
            <Input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ej: TikTok"
              className="text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">URL</Label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="text-sm" />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleAdd} disabled={!label.trim() || !url.trim()}>
              Agregar
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Igual al patrón de StoreQrDialog (src/components/stores/StoresSections.jsx): QR vía
// api.qrserver.com + descarga en alta resolución. Sirve para imprimir un solo enlace
// (p. ej. un cartel de mesa que va directo al Menú) sin pasar por la página completa del hub.
function LinkQrDialog({ link, onOpenChange }) {
  if (!link) return null
  const url = link.url.startsWith('http') ? link.url : `${window.location.origin}${link.url}`

  return (
    <Dialog open={Boolean(link)} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{`QR de "${link.label}"`}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-6 py-4">
          <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`}
              alt={`QR ${link.label}`}
              className="w-48 h-48"
              loading="lazy"
            />
          </div>
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p className="font-medium text-gray-900 dark:text-gray-100">{link.label}</p>
            <p className="text-xs mt-1 break-all">{url}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              Escanea para ir directo a este enlace, sin pasar por el resto del hub.
            </p>
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button
            variant="secondary"
            onClick={() => {
              const a = document.createElement('a')
              a.href = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(url)}`
              a.download = `qr-${link.label.toLowerCase().replace(/\s+/g, '-')}.png`
              a.target = '_blank'
              a.click()
            }}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Descargar QR
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// Redimensiona a un ancho máximo (preserva la relación de aspecto, no recorta)
// y comprime a JPEG — suficiente calidad para un banner, liviano para localStorage.
function compressBannerFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new window.Image()
      img.onload = () => {
        const maxW = 960
        const ratio = Math.min(maxW / img.naturalWidth, 1)
        const w = Math.round(img.naturalWidth * ratio)
        const h = Math.round(img.naturalHeight * ratio)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      }
      img.onerror = () => reject(new Error('No se pudo procesar la imagen'))
      img.src = e.target.result
    }
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'))
    reader.readAsDataURL(file)
  })
}

function HubSettingsDialog({ open, onOpenChange, color, bannerUrl, pageBackground, subtitle, onSave }) {
  const [draftColor, setDraftColor] = useState(color)
  const [draftBanner, setDraftBanner] = useState(bannerUrl)
  const [draftBg, setDraftBg] = useState(pageBackground)
  const [draftSubtitle, setDraftSubtitle] = useState(subtitle)
  const fileInputRef = useRef(null)

  // Reabrir el diálogo siempre parte de los valores actuales, no de lo que haya
  // quedado tipeado (y descartado) la vez anterior.
  const handleOpenChange = (next) => {
    if (next) {
      setDraftColor(color)
      setDraftBanner(bannerUrl)
      setDraftBg(pageBackground)
      setDraftSubtitle(subtitle)
    }
    onOpenChange(next)
  }

  const handleBannerFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      setDraftBanner(await compressBannerFile(file))
    } catch {
      toast.error('No se pudo cargar la imagen')
    }
  }

  const handleSave = () => {
    onSave({ color: draftColor, bannerUrl: draftBanner, pageBackground: draftBg, subtitle: draftSubtitle })
    onOpenChange(false)
    toast.success('Apariencia guardada')
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Apariencia de la página pública</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Banner (reemplaza el color de fondo del encabezado)</Label>
            {draftBanner ? (
              <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 h-24">
                <img src={draftBanner} alt="Banner" className="w-full h-full object-cover" />
                <button
                  onClick={() => setDraftBanner('')}
                  className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black/75 text-white rounded-full p-1 transition-colors"
                  aria-label="Quitar banner"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-24 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-400 transition-colors"
              >
                <ImageIcon className="w-5 h-5" />
                <span className="text-xs">Subir imagen</span>
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleBannerFile} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Color de marca {draftBanner && '(oculto mientras haya un banner)'}</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={draftColor}
                onChange={(e) => setDraftColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-800 cursor-pointer bg-transparent"
              />
              <Input value={draftColor} onChange={(e) => setDraftColor(e.target.value)} className="text-sm font-mono" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Color de fondo de la pantalla</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={draftBg}
                onChange={(e) => setDraftBg(e.target.value)}
                className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-800 cursor-pointer bg-transparent"
              />
              <Input value={draftBg} onChange={(e) => setDraftBg(e.target.value)} className="text-sm font-mono" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Subtítulo</Label>
            <Input
              value={draftSubtitle}
              onChange={(e) => setDraftSubtitle(e.target.value)}
              placeholder="Ej: Elegí lo que buscás"
              className="text-sm"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function HubMoonCafe() {
  const [config, setConfig] = useState(() => loadHubConfig())
  const [adding, setAdding] = useState(false)
  const [qrLink, setQrLink] = useState(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const updateConfig = (updater) => {
    setConfig((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      saveHubConfig(next)
      return next
    })
  }

  // "group" es 'repeatLinks' o 'externalLinks' — cada sección se reordena y edita
  // por separado, nunca se mezclan entre sí.
  const moveLink = (group, id, direction) => {
    updateConfig((prev) => {
      const list = [...prev[group]]
      const index = list.findIndex((l) => l.id === id)
      const target = index + direction
      if (index < 0 || target < 0 || target >= list.length) return prev
      ;[list[index], list[target]] = [list[target], list[index]]
      return { ...prev, [group]: list }
    })
  }

  const toggleLink = (group, id) =>
    updateConfig((prev) => ({
      ...prev,
      [group]: prev[group].map((l) => (l.id === id ? { ...l, enabled: !l.enabled } : l)),
    }))

  const editLink = (group, id, fields) =>
    updateConfig((prev) => ({
      ...prev,
      [group]: prev[group].map((l) => (l.id === id ? { ...l, ...fields } : l)),
    }))

  const deleteExternalLink = (id) => {
    updateConfig((prev) => ({ ...prev, externalLinks: prev.externalLinks.filter((l) => l.id !== id) }))
    toast.success('Enlace eliminado')
  }

  const addExternalLink = (link) => {
    updateConfig((prev) => ({ ...prev, externalLinks: [...prev.externalLinks, link] }))
    setAdding(false)
    toast.success('Enlace agregado')
  }

  const saveAppearance = ({ color, bannerUrl, pageBackground, subtitle }) =>
    updateConfig((prev) => ({ ...prev, color, bannerUrl, pageBackground, subtitle }))

  const handleSave = () => toast.success('Cambios guardados')

  return (
    <div className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-start justify-between gap-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link2 className="w-8 h-8 text-gray-700 dark:text-gray-300" />
              <h1 className="text-4xl font-bold leading-tight text-foreground">Enlaces</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Lo que ve tu cliente al escanear el QR de tu local — armá tu propio Linktree.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setSettingsOpen(true)}
              className="w-9 h-9 flex items-center justify-center border border-gray-200 dark:border-gray-800 rounded-xl text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              aria-label="Editar apariencia de la página pública"
              title="Color y subtítulo de la página pública"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <a
              href="/hub-demo/mooncafe"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-2 transition-colors"
            >
              Ver página pública <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8"
        >
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Enlaces de Repeat — usá las flechas para ordenar
          </h2>
          <div className="space-y-2">
            {config.repeatLinks.map((link, index) => (
              <LinkRow
                key={link.id}
                link={link}
                isFirst={index === 0}
                isLast={index === config.repeatLinks.length - 1}
                onMove={(id, dir) => moveLink('repeatLinks', id, dir)}
                onToggle={(id) => toggleLink('repeatLinks', id)}
                onShowQr={setQrLink}
                onEdit={(id, fields) => editLink('repeatLinks', id, fields)}
              />
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Tus enlaces — usá las flechas para ordenar
            </h2>
            {!adding && (
              <Button variant="outline" size="sm" onClick={() => setAdding(true)} className="gap-1.5">
                <Plus className="w-4 h-4" /> Agregar enlace
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {config.externalLinks.map((link, index) => (
              <LinkRow
                key={link.id}
                link={link}
                isFirst={index === 0}
                isLast={index === config.externalLinks.length - 1}
                onMove={(id, dir) => moveLink('externalLinks', id, dir)}
                onToggle={(id) => toggleLink('externalLinks', id)}
                onDelete={deleteExternalLink}
                onShowQr={setQrLink}
                onEdit={(id, fields) => editLink('externalLinks', id, fields)}
              />
            ))}
            <AnimatePresence initial={false}>
              {adding && <AddLinkForm onAdd={addExternalLink} onCancel={() => setAdding(false)} />}
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="mt-8 flex justify-end">
          <Button onClick={handleSave}>Guardar cambios</Button>
        </div>
      </div>

      <LinkQrDialog link={qrLink} onOpenChange={(open) => !open && setQrLink(null)} />
      <HubSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        color={config.color}
        bannerUrl={config.bannerUrl}
        pageBackground={config.pageBackground}
        subtitle={config.subtitle}
        onSave={saveAppearance}
      />
    </div>
  )
}
