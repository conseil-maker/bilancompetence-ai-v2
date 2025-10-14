import Link from 'next/link'
import { ArrowRight, Brain, Shield, Users, Sparkles, CheckCircle, TrendingUp } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-white to-primary/5 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                Votre bilan de compétences
                <span className="block text-primary">augmenté par l'IA</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Découvrez vos talents cachés, explorez de nouveaux horizons professionnels et construisez
                votre projet de carrière avec l'accompagnement d'experts et la puissance de l'intelligence artificielle.
              </p>
              <div className="mt-10 flex gap-x-6 sm:justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="rounded-md bg-primary px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all inline-flex items-center gap-2"
                >
                  Commencer mon bilan
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/tarifs"
                  className="rounded-md px-6 py-3 text-base font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:ring-gray-400 transition-all"
                >
                  Voir les tarifs
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-x-6 sm:justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="text-sm text-gray-600">Certifié Qualiopi</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="text-sm text-gray-600">Finançable CPF</span>
                </div>
              </div>
            </div>
            <div className="mt-16 sm:mt-24 lg:col-span-6 lg:mt-0">
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Brain className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Analyse IA de votre profil</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Notre IA analyse votre CV et vos compétences pour identifier vos forces cachées
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Accompagnement personnalisé</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Un consultant expert vous accompagne tout au long de votre parcours
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <TrendingUp className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Recommandations métiers</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Découvrez les métiers qui correspondent à votre profil et vos aspirations
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Une approche innovante du bilan de compétences
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Nous combinons l'expertise humaine de nos consultants certifiés avec la puissance
              de l'intelligence artificielle pour vous offrir un bilan de compétences unique.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-7xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">IA Avancée</h3>
                <p className="mt-4 text-gray-600">
                  Analyse automatique de votre CV, identification de compétences transférables,
                  et recommandations personnalisées basées sur vos aspirations.
                </p>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">Conformité Qualiopi</h3>
                <p className="mt-4 text-gray-600">
                  Centre certifié Qualiopi garantissant la qualité de nos prestations et
                  l'éligibilité au financement CPF.
                </p>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-gray-900">Experts Certifiés</h3>
                <p className="mt-4 text-gray-600">
                  Nos consultants sont certifiés et expérimentés dans l'accompagnement
                  de projets professionnels variés.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Comment ça marche ?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Un parcours en 3 phases pour construire votre projet professionnel
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-7xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="relative">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                    1
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Phase Préliminaire</h3>
                </div>
                <p className="mt-4 text-gray-600 ml-20">
                  Analyse de votre parcours, définition de vos objectifs et identification
                  de vos besoins avec votre consultant.
                </p>
              </div>

              <div className="relative">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                    2
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Phase d'Investigation</h3>
                </div>
                <p className="mt-4 text-gray-600 ml-20">
                  Tests psychométriques, exploration de pistes professionnelles et
                  validation de votre projet avec l'aide de l'IA.
                </p>
              </div>

              <div className="relative">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                    3
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Phase de Conclusion</h3>
                </div>
                <p className="mt-4 text-gray-600 ml-20">
                  Élaboration de votre plan d'action et remise de votre document de synthèse
                  personnalisé.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Prêt à donner un nouvel élan à votre carrière ?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/90">
              Commencez votre bilan de compétences dès aujourd'hui et découvrez
              toutes les opportunités qui s'offrent à vous.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/register"
                className="rounded-md bg-white px-6 py-3 text-base font-semibold text-primary shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all inline-flex items-center gap-2"
              >
                Démarrer maintenant
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="rounded-md px-6 py-3 text-base font-semibold text-white ring-1 ring-inset ring-white/20 hover:ring-white/30 transition-all"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

