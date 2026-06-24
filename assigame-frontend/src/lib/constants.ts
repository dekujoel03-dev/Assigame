export const APP_NAME = 'ASSIGAME'
export const APP_TAGLINE = 'La marketplace togolaise'
export const CONTACT_PHONE = '+22896613591'
export const CONTACT_PHONE_DISPLAY = '+228 96 61 35 91'

export const NAV_LINKS = [
  { label: 'Accueil', href: '/', hasDropdown: false },
  { label: 'Catégories', href: '/categories', hasDropdown: true },
  { label: 'Produits', href: '/produits', hasDropdown: false },
  { label: 'À propos', href: '/a-propos', hasDropdown: true },
] as const

export const CITIES = [
  'Lomé',
  'Kara',
  'Sokodé',
  'Atakpamé',
  'Kpalimé',
  'Tsévié',
  'Dapaong',
  'Aného',
] as const

export const AVANTAGES = [
  {
    title: 'Produits vérifiés',
    description: 'Chaque vendeur est vérifié pour garantir des transactions sûres.',
    image: 'verified' as const,
  },
  {
    title: 'Meilleurs prix',
    description: 'Comparez les offres et trouvez les meilleurs deals au Togo.',
    image: 'pricing' as const,
  },
  {
    title: 'Contact direct',
    description: 'Contactez les vendeurs instantanément via WhatsApp.',
    image: 'contact' as const,
  },
  {
    title: 'Livraison rapide',
    description: 'Des vendeurs partout au Togo pour une livraison locale.',
    image: 'delivery' as const,
  },
] as const

export const CHIFFRES_CLES = [
  { label: 'Produits actifs', value: '2 500+' },
  { label: 'Vendeurs vérifiés', value: '180+' },
  { label: 'Villes couvertes', value: '8' },
  { label: 'Transactions/mois', value: '1 200+' },
] as const
