import { Shield, Users, Brain, Award, Heart, Target } from 'lucide-react'

export default function AProposPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 to-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              À Propos de BilanCompetence.AI
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Pionniers de l'accompagnement professionnel augmenté par l'intelligence artificielle
            </p>
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl text-center mb-8">
            Notre Mission
          </h2>
          <p className="text-lg text-gray-600 text-center">
            Chez <strong>BilanCompetence.AI</strong>, nous croyons que chaque personne possède un potentiel unique.
            Notre mission est de vous aider à le découvrir, le développer et le mettre au service de votre épanouissement
            professionnel. En combinant l'expertise humaine de nos consultants certifiés avec la puissance de
            l'intelligence artificielle, nous révolutionnons l'approche traditionnelle du bilan de compétences.
          </p>
        </div>
      </div>

      {/* Valeurs */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Nos Valeurs
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Bienveillance</h3>
              <p className="text-gray-600">
                Un accompagnement humain, empathique et respectueux de votre parcours unique
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                L'utilisation de l'IA pour enrichir l'analyse et personnaliser l'accompagnement
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Qualité</h3>
              <p className="text-gray-600">
                Certification Qualiopi garantissant l'excellence de nos prestations
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expertise</h3>
              <p className="text-gray-600">
                Des consultants certifiés et expérimentés dans l'accompagnement professionnel
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Résultats</h3>
              <p className="text-gray-600">
                Un accompagnement orienté vers l'action et la concrétisation de votre projet
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600">
                Un engagement constant vers l'amélioration continue de nos services
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notre Approche */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Notre Approche Unique
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">L'Humain au Cœur</h3>
            <p className="text-gray-600 mb-4">
              Nos consultants certifiés vous accompagnent personnellement tout au long de votre parcours.
              Leur expertise, leur écoute et leur bienveillance sont les piliers de notre accompagnement.
            </p>
            <p className="text-gray-600">
              Chaque bilan est unique car chaque personne est unique. Nous prenons le temps de comprendre
              votre histoire, vos aspirations et vos contraintes pour construire avec vous un projet
              professionnel réaliste et épanouissant.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">L'IA comme Accélérateur</h3>
            <p className="text-gray-600 mb-4">
              Notre intelligence artificielle analyse votre CV, identifie vos compétences transférables
              et vous propose des pistes professionnelles que vous n'auriez peut-être pas envisagées.
            </p>
            <p className="text-gray-600">
              L'IA ne remplace pas l'humain, elle l'augmente. Elle permet à nos consultants de se concentrer
              sur ce qui compte vraiment : vous écouter, vous comprendre et vous guider vers la réussite
              de votre projet.
            </p>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Nos Certifications
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Qualiopi</h3>
              <p className="text-sm text-gray-600">
                Certification nationale qualité des organismes de formation
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 text-center">
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">CPF</h3>
              <p className="text-sm text-gray-600">
                Organisme référencé sur Mon Compte Formation
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-200 text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">RGPD</h3>
              <p className="text-sm text-gray-600">
                Conformité totale à la protection des données personnelles
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Équipe */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Notre Équipe
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Des professionnels passionnés et engagés dans votre réussite
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 max-w-3xl mx-auto">
            Notre équipe est composée de consultants certifiés en bilans de compétences, de psychologues du travail
            et d'experts en orientation professionnelle. Tous partagent la même passion : vous aider à révéler
            votre potentiel et à construire le projet professionnel qui vous correspond.
          </p>
        </div>
      </div>
    </div>
  )
}

