'use client'

import { memo, useEffect, useState } from 'react'
import { useDebounce } from '@/hooks/useDebounce'

interface SearchInputProps {
  /**
   * Placeholder du champ de recherche
   */
  placeholder?: string
  
  /**
   * Valeur initiale
   */
  initialValue?: string
  
  /**
   * Délai de debounce en millisecondes
   */
  debounceDelay?: number
  
  /**
   * Callback appelé avec la valeur debouncée
   */
  onSearch: (value: string) => void
  
  /**
   * Classes CSS additionnelles
   */
  className?: string
  
  /**
   * Afficher un indicateur de chargement
   */
  isLoading?: boolean
}

/**
 * Composant SearchInput optimisé avec debounce
 * 
 * Évite les appels API excessifs en attendant que l'utilisateur
 * ait fini de taper avant de déclencher la recherche
 * 
 * @example
 * ```tsx
 * <SearchInput
 *   placeholder="Rechercher un bénéficiaire..."
 *   debounceDelay={300}
 *   onSearch={(term) => searchBeneficiaires(term)}
 *   isLoading={isSearching}
 * />
 * ```
 */
export const SearchInput = memo(function SearchInput({
  placeholder = 'Rechercher...',
  initialValue = '',
  debounceDelay = 300,
  onSearch,
  className = '',
  isLoading = false,
}: SearchInputProps) {
  const [value, setValue] = useState(initialValue)
  const debouncedValue = useDebounce(value, debounceDelay)

  useEffect(() => {
    onSearch(debouncedValue)
  }, [debouncedValue, onSearch])

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg
          className="h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
      />
      
      {isLoading && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <svg
            className="animate-spin h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}
      
      {value && !isLoading && (
        <button
          type="button"
          onClick={() => setValue('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <svg
            className="h-5 w-5 text-gray-400 hover:text-gray-600"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  )
})

