import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ZoomIn } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ProductImage } from '@/components/products/ProductImage'

interface ProductGalleryProps {
  images: string[]
  name: string
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [zoomOpen, setZoomOpen] = useState(false)

  const activeImage = images[activeIndex] ?? images[0]

  return (
    <div className="space-y-4">
      <motion.div
        className="group relative aspect-square w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft"
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <ProductImage src={activeImage} alt={name} />
        <button
          type="button"
          onClick={() => setZoomOpen(true)}
          className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl bg-background/90 px-4 py-2 text-sm font-medium shadow-soft backdrop-blur transition-opacity opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <ZoomIn className="size-4" />
          Zoom
        </button>
      </motion.div>

      {images.length > 1 && (
        <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
          {images.map((img, index) => (
            <button
              key={img}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={cn(
                'size-16 shrink-0 overflow-hidden rounded-xl border-2 sm:size-20',
                index === activeIndex
                  ? 'border-primary shadow-float scale-105'
                  : 'border-transparent opacity-70 hover:opacity-100'
              )}
            >
              <ProductImage src={img} alt={`${name} ${index + 1}`} />
            </button>
          ))}
        </div>
      )}

      <Dialog open={zoomOpen} onOpenChange={setZoomOpen}>
        <DialogContent className="max-w-4xl border-none bg-transparent p-0 shadow-none">
          <AnimatePresence mode="wait">
            <motion.img
              key={activeImage}
              src={activeImage}
              alt={name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full rounded-2xl object-contain"
            />
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  )
}
