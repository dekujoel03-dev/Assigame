import { BanniereAccueil } from '@/components/home/BanniereAccueil'
import { BarreChiffres } from '@/components/home/BarreChiffres'
import { SectionAvantages } from '@/components/home/SectionAvantages'
import { BandeauVendeur } from '@/components/home/BandeauVendeur'
import { Footer } from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <div className="home-scroll max-lg:min-h-[100dvh] max-lg:h-auto max-lg:snap-none overflow-y-auto lg:h-[100dvh] lg:snap-y lg:snap-mandatory">
      <section className="home-snap-panel flex min-h-[100dvh] flex-col lg:h-full lg:min-h-0 lg:snap-start lg:snap-always">
        <BanniereAccueil />
      </section>

      <section className="home-snap-panel flex flex-col lg:min-h-full lg:snap-start lg:snap-always">
        <BarreChiffres />
        <SectionAvantages />
        <BandeauVendeur />
        <Footer />
      </section>
    </div>
  )
}
