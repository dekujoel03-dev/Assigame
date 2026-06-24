import { AVANTAGES } from '@/lib/constants'
import { IMAGES_AVANTAGES } from '@/lib/images'
import { cn } from '@/lib/utils'

type Avantage = (typeof AVANTAGES)[number]

interface CarteAvantageProps {
  avantage: Avantage
  className?: string
  animer?: boolean
}

export function CarteAvantage({ avantage, className, animer = false }: CarteAvantageProps) {
  const meta = IMAGES_AVANTAGES[avantage.image]

  return (
    <div
      data-apparition={animer ? true : undefined}
      className={cn(
        'glass-card flex flex-col overflow-hidden rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:border-primary/20 hover:shadow-volumetric',
        className,
      )}
    >
      <div className="relative aspect-[5/3] w-full overflow-hidden bg-gradient-to-br from-slate-50 to-primary/5">
        <img
          src={meta.src}
          alt={avantage.title}
          className="size-full object-cover"
          style={{ objectPosition: meta.position }}
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent" />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-semibold">{avantage.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{avantage.description}</p>
      </div>
    </div>
  )
}
