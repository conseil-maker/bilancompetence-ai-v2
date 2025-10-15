import { memo, ReactNode } from 'react'

interface CardProps {
  /**
   * Titre de la carte
   */
  title?: string
  
  /**
   * Description ou sous-titre
   */
  description?: string
  
  /**
   * Contenu de la carte
   */
  children: ReactNode
  
  /**
   * Classes CSS additionnelles
   */
  className?: string
  
  /**
   * Actions à afficher dans le header
   */
  actions?: ReactNode
  
  /**
   * Footer de la carte
   */
  footer?: ReactNode
  
  /**
   * Callback au clic sur la carte
   */
  onClick?: () => void
  
  /**
   * Rendre la carte cliquable avec effet hover
   */
  clickable?: boolean
}

/**
 * Composant Card optimisé avec React.memo
 * 
 * Ne se re-render que si ses props changent
 * 
 * @example
 * ```tsx
 * <Card
 *   title="Mon Bilan"
 *   description="En cours"
 *   clickable
 *   onClick={() => router.push('/bilans/123')}
 * >
 *   <p>Contenu du bilan...</p>
 * </Card>
 * ```
 */
export const Card = memo(function Card({
  title,
  description,
  children,
  className = '',
  actions,
  footer,
  onClick,
  clickable = false,
}: CardProps) {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200'
  const clickableClasses = clickable || onClick
    ? 'cursor-pointer hover:shadow-md transition-shadow duration-200'
    : ''

  return (
    <div
      className={`${baseClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {(title || description || actions) && (
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">
                  {title}
                </h3>
              )}
              {description && (
                <p className="mt-1 text-sm text-gray-500">
                  {description}
                </p>
              )}
            </div>
            {actions && (
              <div className="ml-4 flex-shrink-0">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="px-6 py-4">
        {children}
      </div>
      
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          {footer}
        </div>
      )}
    </div>
  )
})

