const URLS_IMAGES_AVANTAGES = {
  verified: '/why-verified.png',
  pricing:
    'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600&h=360&fit=crop&crop=center',
  contact:
    'https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=600&h=360&fit=crop&crop=center',
  delivery: '/why-delivery.png',
} as const

export const IMAGES_AVANTAGES = {
  verified: { src: URLS_IMAGES_AVANTAGES.verified, position: 'center 40%' },
  pricing: { src: URLS_IMAGES_AVANTAGES.pricing, position: 'center 40%' },
  contact: { src: URLS_IMAGES_AVANTAGES.contact, position: 'center center' },
  delivery: { src: URLS_IMAGES_AVANTAGES.delivery, position: 'center 30%' },
} as const

export const CATEGORY_IMAGE_META = {
  telephones: {
    src: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=640&h=480&fit=crop',
    position: 'center center',
  },
  informatique: {
    src: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=640&h=480&fit=crop',
    position: 'center center',
  },
  'mode-et-habillement': {
    src: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=640&h=480&fit=crop',
    position: 'center 35%',
  },
  electromenager: {
    src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=640&h=480&fit=crop',
    position: 'center center',
  },
  'maison-et-decoration': {
    src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=640&h=480&fit=crop',
    position: 'center center',
  },
  automobile: {
    src: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=640&h=480&fit=crop',
    position: 'center center',
  },
  agropastoral: {
    src: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=640&h=480&fit=crop',
    position: 'center center',
  },
  'beaute-et-cosmetique': {
    src: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=640&h=480&fit=crop',
    position: 'center 40%',
  },
  alimentation: {
    src: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=640&h=480&fit=crop',
    position: 'center center',
  },
  'sport-et-loisirs': {
    src: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=640&h=480&fit=crop',
    position: 'center center',
  },
  'enfants-et-bebe': {
    src: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=640&h=480&fit=crop',
    position: 'center center',
  },
  'materiaux-btp': {
    src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=640&h=480&fit=crop',
    position: 'center center',
  },
} as const

function isCategoryApiImage(src?: string): boolean {
  return Boolean(src && /categorieproduit\/\d+\/image/.test(src))
}

export function getCategoryImageMeta(slug: string, customSrc?: string) {
  if (isCategoryApiImage(customSrc)) {
    return { src: customSrc!, position: 'center center' }
  }

  const meta = CATEGORY_IMAGE_META[slug as keyof typeof CATEGORY_IMAGE_META]
  return meta ?? { src: customSrc ?? CATEGORY_IMAGE_META.telephones.src, position: 'center center' }
}
