'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuthContext } from '@/components/providers/AuthProvider'
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BarChart3, 
  Settings,
  LogOut,
  Menu,
  X,
  Shield
} from 'lucide-react'
import { useState } from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user, logout } = useAuthContext()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: 'Tableau de bord', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Utilisateurs', href: '/admin/utilisateurs', icon: Users },
    { name: 'Bilans', href: '/admin/bilans', icon: FileText },
    { name: 'Statistiques', href: '/admin/statistiques', icon: BarChart3 },
    { name: 'Paramètres', href: '/admin/parametres', icon: Settings },
  ]

  const handleLogout = async () => {
    await logout()
    window.location.href = '/'
  }

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
            <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-gray-900 p-6">
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-bold text-white">Admin Panel</span>
                <button onClick={() => setSidebarOpen(false)}>
                  <X className="h-6 w-6 text-gray-400" />
                </button>
              </div>
              <nav className="space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Desktop sidebar */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          <div className="flex flex-col flex-grow bg-gray-900 pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6">
              <Shield className="h-8 w-8 text-primary mr-2" />
              <span className="text-xl font-bold text-white">Admin Panel</span>
            </div>
            <div className="mt-8 flex-grow flex flex-col">
              <nav className="flex-1 px-4 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 px-4 space-y-2">
              <div className="flex items-center gap-3 px-4 py-3 text-gray-300">
                <Shield className="h-5 w-5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-white">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs text-gray-400 truncate">Administrateur</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:pl-64 flex flex-col flex-1">
          {/* Top bar mobile */}
          <div className="sticky top-0 z-10 lg:hidden flex items-center justify-between bg-gray-900 px-4 py-4">
            <button onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6 text-gray-300" />
            </button>
            <span className="text-lg font-bold text-white">Admin Panel</span>
            <div className="w-6" /> {/* Spacer for centering */}
          </div>

          {/* Page content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}

