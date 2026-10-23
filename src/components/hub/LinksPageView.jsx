import { ExternalLink, Link2 } from 'lucide-react'
import { MOONCAFE_BRAND } from '@/constants/moonCafeClubs'
import { linkMeta, resolveLinkUrl } from '@/constants/moonCafeHub'
import { cn } from '@/lib/utils'

// Public "link in bio" page. Used by the public route and the admin's phone preview;
// `compact` shrinks spacing/type to fit the preview frame.
export default function LinksPageView({ config, compact = false }) {
  const links = config.links.filter((l) => l.enabled)

  return (
    <div
      className={cn(
        'flex flex-col items-center',
        compact ? 'h-full overflow-y-auto px-5 pt-10 pb-6' : 'min-h-screen px-5 pt-14 pb-10',
      )}
      style={{
        background: `linear-gradient(180deg, ${config.color} 0%, #0b1220 100%)`,
        scrollbarWidth: 'none',
      }}
    >
      <div className={cn('w-full flex flex-col items-center', !compact && 'max-w-md')}>
        <div
          className={cn(
            'rounded-3xl bg-white border-4 border-white/40 shadow-lg overflow-hidden flex items-center justify-center',
            compact ? 'w-20 h-20' : 'w-24 h-24',
          )}
        >
          <img src={MOONCAFE_BRAND.logo_url} alt={config.title} className="w-full h-full object-contain" />
        </div>
        <h1
          className={cn('font-extrabold text-white text-center mt-4 leading-tight', compact ? 'text-xl' : 'text-2xl')}
        >
          {config.title || MOONCAFE_BRAND.brand_name}
        </h1>
        {config.subtitle && (
          <p className={cn('text-white/80 text-center mt-1', compact ? 'text-xs' : 'text-sm')}>{config.subtitle}</p>
        )}

        <div className={cn('w-full space-y-3', compact ? 'mt-5' : 'mt-7')}>
          {links.map((link) => {
            const { icon: Icon = Link2 } = linkMeta(link) ?? {}
            const url = resolveLinkUrl(link)
            const external = url?.startsWith('http')
            return (
              <a
                key={link.id}
                href={url ?? undefined}
                target={external || compact ? '_blank' : undefined}
                rel="noopener noreferrer"
                className={cn(
                  'flex items-center gap-3 w-full bg-white rounded-2xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-transform',
                  compact ? 'px-3.5 py-3' : 'px-4 py-3.5',
                )}
              >
                <Icon className={cn('flex-shrink-0 text-gray-800', compact ? 'w-4 h-4' : 'w-5 h-5')} />
                <span
                  className={cn(
                    'flex-1 min-w-0 text-center font-semibold text-gray-900 truncate',
                    compact ? 'text-xs' : 'text-sm',
                  )}
                >
                  {link.label}
                </span>
                <ExternalLink className={cn('flex-shrink-0 text-gray-400', compact ? 'w-3.5 h-3.5' : 'w-4 h-4')} />
              </a>
            )
          })}
        </div>

        <p className={cn('text-white/50 text-center', compact ? 'text-[10px] mt-8' : 'text-xs mt-10')}>
          Con tecnología de Repeat.la
        </p>
      </div>
    </div>
  )
}
