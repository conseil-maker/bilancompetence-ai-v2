'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuthContext } from '@/components/providers/AuthProvider'
import { Menu, X, User, LogOut } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuthContext()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: 'Accueil', href: '/' },
    { name: 'Tarifs', href: '/tarifs' },
    { name: 'À propos', href: '/a-propos' },
    { name: 'Contact', href: '/contact' },
  ]

  const handleLogout = async () => {
    await logout()
    window.location.href = '/'
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between border-b border-gray-200 py-6 lg:border-none">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">BilanCompetence.AI</span>
            </Link>
            <div className="ml-10 hidden space-x-8 lg:block">
              {navigation.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-base font-medium transition-colors ${
                    pathname === link.href
                      ? 'text-primary'
                      : 'text-gray-700 hover:text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="ml-10 space-x-4 hidden lg:flex items-center">
            {isAuthenticated && user ? (
              <>
                <Link
                  href={
                    user.role === 'beneficiaire'
                      ? '/beneficiaire/dashboard'
                      : user.role === 'consultant'
                      ? '/consultant/dashboard'
                      : '/admin/dashboard'
                  }
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
                >
                  <User className="h-4 w-4" />
                  Mon espace
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-block rounded-md border border-transparent px-4 py-2 text-base font-medium text-gray-700 hover:text-primary transition-colors"
                >
                  Se connecter
                </Link>
                <Link
                  href="/register"
                  className="inline-block rounded-md border border-transparent bg-primary px-4 py-2 text-base font-medium text-white hover:bg-primary/90 transition-colors"
                >
                  Commencer
                </Link>
              </>
            )}
          </div>
          <div className="lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Ouvrir le menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 space-y-2">
            {navigation.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              {isAuthenticated && user ? (
                <>
                  <Link
                    href={
                      user.role === 'beneficiaire'
                        ? '/beneficiaire/dashboard'
                        : user.role === 'consultant'
                        ? '/consultant/dashboard'
                        : '/admin/dashboard'
                    }
                    className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Mon espace
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Commencer
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

