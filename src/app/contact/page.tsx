import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 to-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Contactez-nous
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Une question ? Un projet ? Notre équipe est là pour vous accompagner
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info + Form */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Nos Coordonnées
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <a href="mailto:contact@netz-informatique.fr" className="text-gray-600 hover:text-primary transition-colors">
                    contact@netz-informatique.fr
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Téléphone</h3>
                  <a href="tel:+33612345678" className="text-gray-600 hover:text-primary transition-colors">
                    +33 6 12 34 56 78
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Adresse</h3>
                  <p className="text-gray-600">
                    Netz Informatique<br />
                    France
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Horaires</h3>
                  <p className="text-gray-600">
                    Lundi - Vendredi : 9h00 - 18h00<br />
                    Samedi - Dimanche : Fermé
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 rounded-2xl bg-primary/5 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Besoin d'un rendez-vous ?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Nous proposons des entretiens préliminaires gratuits de 30 minutes pour discuter
                de votre projet et répondre à toutes vos questions.
              </p>
              <a
                href="/register"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
              >
                Prendre rendez-vous →
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Envoyez-nous un Message
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2 border"
                    placeholder="Jean"
                  />
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2 border"
                    placeholder="Dupont"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2 border"
                  placeholder="jean.dupont@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2 border"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2 border"
                >
                  <option>Demande d'information</option>
                  <option>Prise de rendez-vous</option>
                  <option>Question sur les tarifs</option>
                  <option>Question sur le financement</option>
                  <option>Autre</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2 border"
                  placeholder="Décrivez votre projet ou posez-nous vos questions..."
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-primary px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all"
              >
                Envoyer le message
              </button>

              <p className="text-xs text-gray-500 text-center">
                En soumettant ce formulaire, vous acceptez que vos données soient utilisées
                pour vous recontacter. Consultez notre{' '}
                <a href="/politique-confidentialite" className="text-primary hover:text-primary/80">
                  politique de confidentialité
                </a>
                .
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Questions Fréquentes
            </h2>
          </div>
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">
                Combien de temps dure un bilan de compétences ?
              </h3>
              <p className="text-sm text-gray-600">
                Un bilan de compétences dure généralement entre 12 et 24 heures, réparties sur 2 à 3 mois.
                La durée exacte dépend de la formule choisie et de vos besoins.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">
                Mon bilan peut-il être financé par mon CPF ?
              </h3>
              <p className="text-sm text-gray-600">
                Oui, nous sommes référencés sur Mon Compte Formation. Vous pouvez utiliser vos droits CPF
                pour financer tout ou partie de votre bilan de compétences.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">
                Le bilan se déroule-t-il en présentiel ou à distance ?
              </h3>
              <p className="text-sm text-gray-600">
                Nous proposons les deux formats. Vous pouvez choisir de réaliser votre bilan entièrement
                à distance en visioconférence, entièrement en présentiel, ou en format hybride selon vos préférences.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">
                Mon employeur sera-t-il informé de ma démarche ?
              </h3>
              <p className="text-sm text-gray-600">
                Non, sauf si vous le souhaitez. Le bilan de compétences est confidentiel. Votre employeur
                ne sera pas informé de votre démarche, sauf si vous décidez de l'en informer vous-même.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

