import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* À propos */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">BilanCompetence.AI</h3>
            <p className="text-gray-400 mb-4">
              Plateforme de bilans de compétences augmentée par l'intelligence artificielle.
              Certifié Qualiopi pour une qualité garantie.
            </p>
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Mail className="h-4 w-4" />
              <a href="mailto:contact@netz-informatique.fr" className="hover:text-white transition-colors">
                contact@netz-informatique.fr
              </a>
            </div>
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Phone className="h-4 w-4" />
              <a href="tel:+33612345678" className="hover:text-white transition-colors">
                +33 6 12 34 56 78
              </a>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="h-4 w-4" />
              <span>France</span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/tarifs" className="text-gray-400 hover:text-white transition-colors">
                  Tarifs
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-gray-400 hover:text-white transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Légal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/mentions-legales" className="text-gray-400 hover:text-white transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="text-gray-400 hover:text-white transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="text-gray-400 hover:text-white transition-colors">
                  CGV
                </Link>
              </li>
              <li>
                <Link href="/accessibilite" className="text-gray-400 hover:text-white transition-colors">
                  Accessibilité
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Netz Informatique. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span className="text-sm text-gray-400">Certifié Qualiopi</span>
            <span className="text-sm text-gray-400">|</span>
            <span className="text-sm text-gray-400">Conforme RGPD</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

