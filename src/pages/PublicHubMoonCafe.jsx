import { useState } from 'react'
import { Link2, ChevronRight, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { MOONCAFE_BRAND } from '@/constants/moonCafeClubs'
import { CLUB_OPTIONS, ICONS_BY_KEY, loadHubConfig } from '@/constants/moonCafeHub'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'

function LinkCard({ children, onClick, className }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 bg-white rounded-2xl border border-gray-200 shadow-sm transition-all cursor-pointer',
        'hover:shadow-md hover:border-gray-300 active:scale-[0.98]',
        'p-4',
        className,
      )}
    >
      {children}
    </div>
  )
}

function IconBubble({ icon: Icon, color }) {
  return (
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: `${color}15` }}
    >
      <Icon className="w-5 h-5" style={{ color }} />
    </div>
  )
}

function HubLink({ link, color }) {
  const Icon = ICONS_BY_KEY[link.iconKey] ?? Link2
  const external = link.url.startsWith('http')

  const row = (
    <LinkCard>
      <IconBubble icon={Icon} color={color} />
      <div className="flex-1 min-w-0 text-left">
        <p className="font-semibold text-gray-900 leading-tight text-[15px]">{link.label}</p>
        {link.description && <p className="text-xs text-gray-500 truncate mt-0.5">{link.description}</p>}
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
    </LinkCard>
  )

  if (external) {
    return (
      <a href={link.url} target="_blank" rel="noopener noreferrer" className="block">
        {row}
      </a>
    )
  }

  return (
    <Link to={link.url} className="block">
      {row}
    </Link>
  )
}

function ClubDropdown({ link, color }) {
  const [open, setOpen] = useState(false)
  const Icon = ICONS_BY_KEY[link.iconKey] ?? Link2

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div>
          <LinkCard>
            <IconBubble icon={Icon} color={color} />
            <div className="flex-1 min-w-0 text-left">
              <p className="font-semibold text-gray-900 leading-tight text-[15px]">{link.label}</p>
              {link.description && <p className="text-xs text-gray-500 truncate mt-0.5">{link.description}</p>}
            </div>
            <ChevronDown
              className={cn('w-4 h-4 text-gray-300 flex-shrink-0 transition-transform', open && 'rotate-180')}
            />
          </LinkCard>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[calc(100vw-2.5rem)] max-w-md">
        {CLUB_OPTIONS.map((option) => {
          const OptionIcon = ICONS_BY_KEY[option.iconKey] ?? Link2
          return (
            <DropdownMenuItem key={option.url} asChild className="cursor-pointer py-2.5">
              <Link to={option.url} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <OptionIcon className="w-4 h-4" style={{ color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">{option.label}</p>
                  <p className="text-xs text-gray-500 truncate">{option.description}</p>
                </div>
              </Link>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SectionLabel({ children }) {
  return <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1 mb-2">{children}</p>
}

export default function PublicHubMoonCafe() {
  const [config] = useState(() => loadHubConfig())
  const repeatLinks = config.repeatLinks.filter((l) => l.enabled)
  const externalLinks = config.externalLinks.filter((l) => l.enabled)

  const headerStyle = config.bannerUrl
    ? { backgroundImage: `url(${config.bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundColor: config.color }

  return (
    <div className="min-h-screen pb-10" style={{ backgroundColor: config.pageBackground }}>
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="relative pt-10 pb-6 px-6 text-center" style={headerStyle}>
          {config.bannerUrl && <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/55" />}
          <div className="relative z-10">
            <img
              src="/moon-cafe-logo.png"
              alt={MOONCAFE_BRAND.brand_name}
              className="w-20 h-20 rounded-2xl object-contain mx-auto mb-4"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
            />
            <h1 className="text-xl font-bold text-white leading-tight">{MOONCAFE_BRAND.brand_name}</h1>
            <p className="text-sm text-white/60 mt-1">{config.subtitle}</p>
          </div>
        </div>

        {/* Links */}
        {/* "relative" es necesario acá: el header tiene "relative" (para el banner/overlay), y en CSS
            un elemento posicionado siempre se pinta encima de sus hermanos NO posicionados, sin
            importar el orden en el DOM. Sin esto, el header tapaba la esquina superior de esta card. */}
        <div className="relative px-5 -mt-3 space-y-3">
          {repeatLinks.map((link) =>
            link.kind === 'club' ? (
              <ClubDropdown key={link.id} link={link} color={config.color} />
            ) : (
              <HubLink key={link.id} link={link} color={config.color} />
            ),
          )}

          {externalLinks.length > 0 && (
            <div className="pt-4">
              <SectionLabel>Más de nosotros</SectionLabel>
              <div className="space-y-2">
                {externalLinks.map((link) => (
                  <HubLink key={link.id} link={link} color={config.color} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <p className="text-xs text-gray-400">Powered by Repeat.la</p>
        </div>
      </div>
    </div>
  )
}
