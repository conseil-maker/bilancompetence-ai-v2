import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'

export default function TarifsPage() {
  const formules = [
    {
      nom: "Bilan Standard",
      prix: "1 800€",
      duree: "24h",
      description: "Le parcours complet pour construire votre projet professionnel",
      caracteristiques: [
        "Entretien préliminaire personnalisé",
        "Tests psychométriques complets",
        "6 séances avec un consultant certifié",
        "Analyse IA de votre profil",
        "Document de synthèse détaillé",
        "Plan d'action personnalisé",
        "Suivi post-bilan (3 mois)",
      ],
      populaire: false,
    },
    {
      nom: "Bilan Premium",
      prix: "2 400€",
      duree: "24h",
      description: "L'accompagnement le plus complet avec coaching renforcé",
      caracteristiques: [
        "Tout du Bilan Standard",
        "8 séances avec consultant expert",
        "Coaching de carrière personnalisé",
        "Simulation d'entretiens",
        "Révision CV et lettre de motivation",
        "Accès illimité aux ressources",
        "Suivi post-bilan (6 mois)",
        "Mise en relation avec notre réseau",
      ],
      populaire: true,
    },
    {
      nom: "Bilan Express",
      prix: "1 200€",
      duree: "12h",
      description: "Pour une validation rapide de projet professionnel",
      caracteristiques: [
        "Entretien préliminaire",
        "Tests essentiels",
        "4 séances avec un consultant",
        "Analyse IA simplifiée",
        "Synthèse concise",
        "Recommandations ciblées",
      ],
      populaire: false,
    },
  ]

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 to-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Nos Tarifs
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Des formules adaptées à vos besoins et finançables par votre CPF ou votre employeur
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {formules.map((formule) => (
            <div
              key={formule.nom}
              className={`relative rounded-2xl ${
                formule.populaire
                  ? 'ring-2 ring-primary shadow-xl scale-105'
                  : 'ring-1 ring-gray-200'
              } p-8 bg-white`}
            >
              {formule.populaire && (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-fit">
                  <span className="inline-flex rounded-full bg-primary px-4 py-1 text-sm font-semibold text-white">
                    Le plus populaire
                  </span>
                </div>
              )}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">{formule.nom}</h3>
                <p className="mt-4 text-sm text-gray-600">{formule.description}</p>
                <p className="mt-6">
                  <span className="text-4xl font-bold text-gray-900">{formule.prix}</span>
                  <span className="text-base font-medium text-gray-600"> / {formule.duree}</span>
                </p>
              </div>
              <ul className="mt-8 space-y-3">
                {formule.caracteristiques.map((caracteristique) => (
                  <li key={caracteristique} className="flex items-start gap-3">
                    <Check className="h-5 w-5 flex-shrink-0 text-primary mt-0.5" />
                    <span className="text-sm text-gray-600">{caracteristique}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`mt-8 block w-full rounded-md px-6 py-3 text-center text-sm font-semibold transition-all ${
                  formule.populaire
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Choisir cette formule
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Financement Section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Options de Financement
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Plusieurs solutions s'offrent à vous pour financer votre bilan de compétences
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">CPF (Mon Compte Formation)</h3>
                <p className="mt-4 text-sm text-gray-600">
                  Utilisez vos droits à la formation pour financer tout ou partie de votre bilan.
                  Prise en charge jusqu'à 100%.
                </p>
                <Link
                  href="https://www.moncompteformation.gouv.fr"
                  target="_blank"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
                >
                  Vérifier mes droits CPF
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Plan de Développement des Compétences</h3>
                <p className="mt-4 text-sm text-gray-600">
                  Votre employeur peut financer votre bilan dans le cadre du plan de développement
                  des compétences de l'entreprise.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Pôle Emploi</h3>
                <p className="mt-4 text-sm text-gray-600">
                  Si vous êtes demandeur d'emploi, Pôle Emploi peut prendre en charge votre bilan
                  dans le cadre de votre projet de retour à l'emploi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Besoin de conseils pour choisir ?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/90">
              Notre équipe est là pour vous aider à trouver la formule la plus adaptée
              à votre situation et vos objectifs.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/contact"
                className="rounded-md bg-white px-6 py-3 text-base font-semibold text-primary shadow-sm hover:bg-gray-100 transition-all"
              >
                Nous contacter
              </Link>
              <Link
                href="/register"
                className="rounded-md px-6 py-3 text-base font-semibold text-white ring-1 ring-inset ring-white/20 hover:ring-white/30 transition-all"
              >
                Commencer maintenant
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

