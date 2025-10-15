import Link from 'next/link';
import { ArrowRight, Brain, Users, FileText, BarChart3, CheckCircle2, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">BilanCompetence.AI</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <Link href="/a-propos" className="text-gray-600 hover:text-blue-600 transition">
                À propos
              </Link>
              <Link href="/tarifs" className="text-gray-600 hover:text-blue-600 transition">
                Tarifs
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition">
                Contact
              </Link>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/login"
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition"
              >
                Connexion
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg"
              >
                S'inscrire
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Transformez votre carrière avec l'
            <span className="text-blue-600">Intelligence Artificielle</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plateforme de bilans de compétences nouvelle génération, propulsée par l'IA pour vous accompagner 
            dans votre évolution professionnelle et révéler votre plein potentiel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl text-lg font-semibold"
            >
              Commencer mon bilan
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/a-propos"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition shadow-md text-lg font-semibold border-2 border-blue-600"
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Une approche innovante du bilan de compétences
          </h2>
          <p className="text-xl text-gray-600">
            Découvrez comment notre plateforme révolutionne l'accompagnement professionnel
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Analyse IA avancée
            </h3>
            <p className="text-gray-600">
              Algorithmes d'intelligence artificielle pour une analyse approfondie de vos compétences et aspirations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Accompagnement personnalisé
            </h3>
            <p className="text-gray-600">
              Consultants certifiés qui vous guident tout au long de votre parcours de reconversion.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Tests psychométriques
            </h3>
            <p className="text-gray-600">
              Évaluations scientifiquement validées pour identifier vos forces et axes de développement.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition">
            <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Suivi en temps réel
            </h3>
            <p className="text-gray-600">
              Tableau de bord intuitif pour suivre votre progression et vos résultats en temps réel.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Pourquoi choisir BilanCompetence.AI ?
            </h2>
            <p className="text-xl text-blue-100">
              Les avantages qui font la différence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              'Certification reconnue par l\'État',
              'Financement CPF possible',
              'Plateforme 100% en ligne',
              'Accompagnement sur mesure',
              'Résultats en 3 mois',
              'Garantie satisfaction'
            ].map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle2 className="h-6 w-6 text-blue-200 flex-shrink-0 mt-1" />
                <span className="text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ils ont réussi leur reconversion
          </h2>
          <p className="text-xl text-gray-600">
            Découvrez les témoignages de nos bénéficiaires
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: 'Marie Dupont',
              role: 'Reconversion en développeuse web',
              content: 'Grâce à BilanCompetence.AI, j\'ai pu identifier mes compétences transférables et réussir ma reconversion dans le développement web en 6 mois.'
            },
            {
              name: 'Thomas Martin',
              role: 'Transition vers le management',
              content: 'L\'accompagnement personnalisé et les outils d\'analyse m\'ont permis de prendre confiance et d\'évoluer vers un poste de manager.'
            },
            {
              name: 'Sophie Bernard',
              role: 'Création d\'entreprise',
              content: 'Le bilan m\'a aidée à clarifier mon projet entrepreneurial et à identifier les formations nécessaires pour réussir.'
            }
          ].map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Prêt à transformer votre carrière ?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Rejoignez les milliers de professionnels qui ont déjà fait le choix de l'excellence
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition shadow-lg hover:shadow-xl text-lg font-semibold"
          >
            Commencer gratuitement
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">BilanCompetence.AI</span>
              </div>
              <p className="text-gray-400">
                La plateforme de bilans de compétences propulsée par l'intelligence artificielle.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Plateforme</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/a-propos" className="hover:text-white transition">À propos</Link></li>
                <li><Link href="/tarifs" className="hover:text-white transition">Tarifs</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Ressources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Documentation</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Légal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition">Mentions légales</a></li>
                <li><a href="#" className="hover:text-white transition">CGU</a></li>
                <li><a href="#" className="hover:text-white transition">Confidentialité</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BilanCompetence.AI. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

