import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import type { Category, ProductFilters as Filters } from '@/types'
import { CITIES } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ProductFiltersProps {
  filters: Filters
  categories: Category[]
  maxPrice?: number
  onChange: (filters: Filters) => void
  className?: string
}

function FilterFields({
  filters,
  categories,
  maxPrice,
  onChange,
}: ProductFiltersProps) {
  const priceRange = [filters.minPrice ?? 0, filters.maxPrice ?? maxPrice ?? 1000000]

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Catégorie</Label>
        <Select
          value={filters.category ?? 'all'}
          onValueChange={(value) =>
            onChange({ ...filters, category: value === 'all' ? undefined : value })
          }
        >
          <SelectTrigger className="glass w-full">
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent className="z-[120]">
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.name}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Prix (FCFA)</Label>
        <Slider
          min={0}
          max={maxPrice ?? 1000000}
          step={5000}
          value={priceRange}
          onValueChange={([min, max]) =>
            onChange({ ...filters, minPrice: min, maxPrice: max })
          }
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Ville</Label>
        <Select
          value={filters.city ?? 'all'}
          onValueChange={(value) =>
            onChange({ ...filters, city: value === 'all' ? undefined : value })
          }
        >
          <SelectTrigger className="glass w-full">
            <SelectValue placeholder="Toutes les villes" />
          </SelectTrigger>
          <SelectContent className="z-[120]">
            <SelectItem value="all">Toutes les villes</SelectItem>
            {CITIES.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3">
        <Checkbox
          id="available-filter"
          checked={filters.available ?? false}
          onCheckedChange={(checked) =>
            onChange({ ...filters, available: checked === true ? true : undefined })
          }
        />
        <Label htmlFor="available-filter" className="cursor-pointer font-normal">
          Disponible uniquement
        </Label>
      </div>
    </div>
  )
}

export function ProductFilters({
  filters,
  categories,
  maxPrice = 1000000,
  onChange,
  className,
}: ProductFiltersProps) {
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false
  )
  const [panelStyle, setPanelStyle] = useState<{ top: number; left: number; width: number }>()
  const triggerRef = useRef<HTMLButtonElement>(null)

  const hasActiveFilters =
    !!filters.category ||
    !!filters.city ||
    !!filters.available ||
    (filters.minPrice !== undefined && filters.minPrice > 0) ||
    (filters.maxPrice !== undefined && filters.maxPrice < maxPrice)

  const updatePosition = () => {
    if (window.matchMedia('(max-width: 767px)').matches) {
      setIsMobile(true)
      setPanelStyle(undefined)
      return
    }
    setIsMobile(false)
    const el = triggerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const width = Math.min(320, window.innerWidth - 16)
    const gap = 8
    const maxHeight = Math.min(window.innerHeight * 0.7, 480)

    let left = rect.right + gap
    if (left + width > window.innerWidth - 8) {
      left = rect.left - width - gap
    }

    const gridEl = document.querySelector('[data-products-grid]')
    const gridTop = gridEl?.getBoundingClientRect().top ?? rect.bottom + 24

    let top = Math.min(rect.top - 12, gridTop - maxHeight - 16)
    top = Math.max(8, top)

    setPanelStyle({
      top,
      left: Math.max(8, left),
      width,
    })
  }

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const onMqChange = () => setIsMobile(mq.matches)
    mq.addEventListener('change', onMqChange)
    return () => mq.removeEventListener('change', onMqChange)
  }, [])

  useEffect(() => {
    if (!open) return
    updatePosition()
    const onResize = () => updatePosition()
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onResize, true)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onResize, true)
    }
  }, [open])

  const clearFilters = () => {
    onChange({
      ...filters,
      category: undefined,
      city: undefined,
      available: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    })
    setOpen(false)
  }

  const toggleOpen = () => {
    setOpen((v) => {
      if (!v) updatePosition()
      return !v
    })
  }

  return (
    <>
      <div className={cn('relative', className)}>
        <Button
          ref={triggerRef}
          type="button"
          variant="outline"
          className="glass w-full justify-between font-normal sm:w-48"
          onClick={toggleOpen}
          aria-expanded={open}
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-muted-foreground" />
            Filtres
            {hasActiveFilters && (
              <span className="size-2 rounded-full bg-secondary" />
            )}
          </span>
          <ChevronDown className={cn('size-4 transition-transform', open && 'rotate-180')} />
        </Button>
      </div>

      {open &&
        createPortal(
          <>
            <button
              type="button"
              className="fixed inset-0 z-[100] bg-foreground/20 backdrop-blur-[2px] md:bg-transparent md:backdrop-blur-none"
              aria-label="Fermer les filtres"
              onClick={() => setOpen(false)}
            />
            {isMobile ? (
              <div
                className="glass-panel fixed inset-x-0 bottom-0 z-[110] max-h-[85dvh] overflow-y-auto rounded-t-3xl p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-volumetric"
              >
                <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">Filtres</h3>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      className="text-xs text-primary hover:underline"
                      onClick={clearFilters}
                    >
                      Réinitialiser
                    </button>
                  )}
                </div>
                <FilterFields
                  filters={filters}
                  categories={categories}
                  maxPrice={maxPrice}
                  onChange={onChange}
                />
              </div>
            ) : (
              panelStyle && (
                <div
                  className="glass-panel fixed z-[110] max-h-[min(55vh,480px)] overflow-y-auto p-5 shadow-volumetric"
                  style={{
                    top: panelStyle.top,
                    left: panelStyle.left,
                    width: panelStyle.width,
                  }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold">Filtres</h3>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        className="text-xs text-primary hover:underline"
                        onClick={clearFilters}
                      >
                        Réinitialiser
                      </button>
                    )}
                  </div>
                  <FilterFields
                    filters={filters}
                    categories={categories}
                    maxPrice={maxPrice}
                    onChange={onChange}
                  />
                </div>
              )
            )}
          </>,
          document.body
        )}
    </>
  )
}
