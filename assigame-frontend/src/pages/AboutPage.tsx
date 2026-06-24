import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Shield, Users, Zap } from 'lucide-react'
import { APP_NAME, APP_TAGLINE, CITIES, CHIFFRES_CLES, AVANTAGES } from '@/lib/constants'
import { CarteAvantage } from '@/components/home/CarteAvantage'
import { EnTetePage, SectionPage, Carte } from '@/components/layout/MiseEnPage'

const valeurs = [
  { icon: Shield, title: 'Confiance', desc: 'Vendeurs vérifiés et transactions sécurisées.' },
  { icon: Zap, title: 'Rapidité', desc: 'Contact direct et livraison locale dans tout le Togo.' },
  { icon: Users, title: 'Communauté', desc: 'Une marketplace pensée pour les Togolais.' },
  { icon: MapPin, title: 'Proximité', desc: `Présents dans ${CITIES.length} villes togolaises.` },
]

export default function AboutPage() {
  return (
    <>
      <EnTetePage
        badge="À propos"
        title={APP_NAME}
        description={APP_TAGLINE}
      />

      <SectionPage className="!pt-8">
        <p
          data-apparition
          className="glass-panel mx-auto max-w-3xl p-8 text-center text-lg leading-relaxed text-muted-foreground opacity-0"
        >
          Assigamé connecte acheteurs et vendeurs locaux. Électronique, mode, sport, maison —
          trouvez tout ce dont vous avez besoin et contactez les vendeurs via WhatsApp.
        </p>
      </SectionPage>

      <SectionPage style="scaleIn" className="!py-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {CHIFFRES_CLES.map((stat) => (
            <Carte key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-primary sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </Carte>
          ))}
        </div>
      </SectionPage>

      <SectionPage>
        <div data-apparition className="mb-10 text-center opacity-0">
          <h2 className="text-2xl font-bold sm:text-3xl">Pourquoi Assigamé ?</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {AVANTAGES.map((avantage) => (
            <CarteAvantage key={avantage.title} avantage={avantage} />
          ))}
        </div>
      </SectionPage>

      <SectionPage style="fadeUp">
        <div data-apparition className="mb-10 text-center opacity-0">
          <h2 className="text-2xl font-bold">Nos valeurs</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {valeurs.map(({ icon: Icon, title, desc }) => (
            <Carte key={title} className="text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-6" />
              </div>
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </Carte>
          ))}
        </div>
      </SectionPage>

      <section className="relative overflow-hidden bg-secondary px-4 py-16 text-center text-white sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <div className="relative">
          <h2 className="text-2xl font-bold sm:text-3xl">Rejoignez Assigamé</h2>
          <p className="mx-auto mt-4 max-w-lg text-white/90">
            Vendez vos produits à des milliers d&apos;acheteurs togolais.
          </p>
          <Link
            to="/inscription"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-secondary transition-transform hover:scale-[1.02]"
          >
            Devenir vendeur
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
