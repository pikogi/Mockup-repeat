import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowUp, ExternalLink, Link2, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import LinksPageView from '@/components/hub/LinksPageView'
import { MOONCAFE_BRAND } from '@/constants/moonCafeClubs'
import {
  linkMeta,
  LINKS_URL_PREFIX,
  loadHubConfig,
  REPEAT_DESTINATIONS,
  saveHubConfig,
  SLUG_PATTERN,
} from '@/constants/moonCafeHub'
import { genId } from '@/hooks/useMoonCafeShowcase'
import { cn } from '@/lib/utils'

function Section({ title, action, children }) {
  return (
    <section className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

function LinkCard({ link, isFirst, isLast, onChange, onMove, onDelete }) {
  const meta = linkMeta(link)
  const Icon = meta?.icon ?? Link2
  const options = link.type === 'external' ? [] : REPEAT_DESTINATIONS[link.type].getOptions()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3"
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-semibold px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
          {meta?.label}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <label className="flex items-center gap-2 text-sm text-gray-500 mr-2 cursor-pointer">
            <Switch checked={link.enabled} onCheckedChange={(v) => onChange({ enabled: v })} />
            {link.enabled ? 'Activo' : 'Inactivo'}
          </label>
          <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isFirst} onClick={() => onMove(-1)}>
            <ArrowUp className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isLast} onClick={() => onMove(1)}>
            <ArrowDown className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-600" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {options.length > 1 && (
        <div className="space-y-1.5">
          <Label className="text-xs">Destino</Label>
          <Select value={link.target} onValueChange={(v) => onChange({ target: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-1.5">
        <Label className="text-xs">Etiqueta</Label>
        <Input value={link.label} onChange={(e) => onChange({ label: e.target.value })} />
      </div>

      {link.type === 'external' && (
        <div className="space-y-1.5">
          <Label className="text-xs">URL</Label>
          <Input
            value={link.url}
            placeholder="https://"
            onChange={(e) => onChange({ url: e.target.value })}
            className={cn(link.url && !/^https?:\/\//.test(link.url) && 'border-red-400')}
          />
        </div>
      )}
    </motion.div>
  )
}

export default function HubMoonCafe() {
  const [saved, setSaved] = useState(loadHubConfig)
  const [draft, setDraft] = useState(saved)

  const set = (fields) => setDraft((d) => ({ ...d, ...fields }))
  const setLinks = (updater) => setDraft((d) => ({ ...d, links: updater(d.links) }))

  const slugValid = SLUG_PATTERN.test(draft.slug)
  const urlsValid = draft.links.every((l) => l.type !== 'external' || /^https?:\/\/\S+/.test(l.url))
  const isDirty = JSON.stringify(draft) !== JSON.stringify(saved)
  const canSave = isDirty && slugValid && urlsValid

  const handleSave = () => {
    saveHubConfig(draft)
    setSaved(draft)
    toast.success('Cambios guardados')
  }

  const addDestination = (type) => {
    const option = REPEAT_DESTINATIONS[type].getOptions()[0]
    setLinks((links) => [
      ...links,
      { id: genId(), type, target: option?.id, label: option?.label ?? REPEAT_DESTINATIONS[type].label, enabled: true },
    ])
  }

  const addExternal = () =>
    setLinks((links) => [
      ...links,
      { id: genId(), type: 'external', label: 'Sitio web', url: 'https://', enabled: true },
    ])

  const moveLink = (index, dir) =>
    setLinks((links) => {
      const next = [...links]
      ;[next[index], next[index + dir]] = [next[index + dir], next[index]]
      return next
    })

  return (
    <div className="px-4 sm:px-8 py-6 sm:py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900 dark:text-white">
              <Link2 className="w-8 h-8" /> Links de tu marca
            </h1>
            <p className="text-gray-500 mt-1">Comparte todos tus destinos en una sola página.</p>
          </div>
          <Button onClick={handleSave} disabled={!canSave}>
            Guardar
          </Button>
        </div>

        <div className="flex gap-8 items-start">
          <div className="flex-1 min-w-0 space-y-6">
            <Section title="Apariencia">
              <div className="space-y-1.5">
                <Label>Título</Label>
                <Input value={draft.title} onChange={(e) => set({ title: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Subtítulo</Label>
                <Input value={draft.subtitle} onChange={(e) => set({ subtitle: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Dirección de tu página</Label>
                <div className="flex items-center gap-2">
                  <span className="hidden sm:block text-sm text-gray-500 whitespace-nowrap">{LINKS_URL_PREFIX}</span>
                  <Input
                    value={draft.slug}
                    onChange={(e) => set({ slug: e.target.value.trim().toLowerCase() })}
                    className={cn(!slugValid && 'border-red-400')}
                  />
                  <Button variant="outline" size="icon" asChild title="Ver página pública">
                    <a href="/hub-demo/mooncafe" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
                <p className={cn('text-xs', slugValid ? 'text-gray-500' : 'text-red-500')}>
                  Solo letras, números y guiones, entre 3 y 60 caracteres.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Label>Color</Label>
                <input
                  type="color"
                  value={draft.color}
                  onChange={(e) => set({ color: e.target.value })}
                  className="w-12 h-9 rounded-md border border-gray-200 cursor-pointer p-0.5 bg-white"
                />
                <img
                  src={MOONCAFE_BRAND.logo_url}
                  alt=""
                  className="w-9 h-9 rounded-lg border border-gray-200 object-contain bg-white"
                />
                <span className="text-sm text-gray-500">Usamos el logo de tu marca.</span>
              </div>
              <div className="space-y-1">
                <label className="flex items-center gap-3 cursor-pointer">
                  <Switch checked={draft.published} onCheckedChange={(v) => set({ published: v })} />
                  <span className="font-medium text-gray-900 dark:text-white">Página publicada</span>
                </label>
                <p className="text-xs text-gray-500">Si la desactivas, la página deja de ser pública.</p>
              </div>
            </Section>

            <Section
              title="Tus links"
              action={
                <div className="flex flex-wrap items-center gap-2">
                  <Select value="" onValueChange={addDestination}>
                    <SelectTrigger className="w-60">
                      <SelectValue placeholder="Agregar destino de Repeat" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(REPEAT_DESTINATIONS).map(([type, { label, icon: Icon }]) => (
                        <SelectItem key={type} value={type}>
                          <span className="flex items-center gap-2">
                            <Icon className="w-4 h-4" /> {label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={addExternal}>
                    <Plus className="w-4 h-4 mr-2" /> Agregar link
                  </Button>
                </div>
              }
            >
              {draft.links.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">
                  Agrega tu primer link con los botones de arriba.
                </p>
              )}
              <div className="space-y-3">
                <AnimatePresence initial={false}>
                  {draft.links.map((link, i) => (
                    <LinkCard
                      key={link.id}
                      link={link}
                      isFirst={i === 0}
                      isLast={i === draft.links.length - 1}
                      onChange={(fields) =>
                        setLinks((links) => links.map((l) => (l.id === link.id ? { ...l, ...fields } : l)))
                      }
                      onMove={(dir) => moveLink(i, dir)}
                      onDelete={() => setLinks((links) => links.filter((l) => l.id !== link.id))}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </Section>
          </div>

          <div className="hidden xl:block flex-shrink-0 sticky top-8">
            <div className="rounded-[2.75rem] bg-gray-900 p-2.5 shadow-2xl" style={{ width: 320 }}>
              <div className="rounded-[2.25rem] overflow-hidden" style={{ height: 620 }}>
                <LinksPageView config={draft} compact />
              </div>
            </div>
            {!draft.published && <p className="text-center text-xs text-gray-400 mt-3">La página no está publicada.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
