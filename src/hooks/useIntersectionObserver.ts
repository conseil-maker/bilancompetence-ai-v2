import { useEffect, useRef, useState } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number
  root?: Element | null
  rootMargin?: string
  freezeOnceVisible?: boolean
}

/**
 * Hook pour observer l'intersection d'un élément avec le viewport
 * Utile pour le lazy loading, infinite scroll, animations au scroll, etc.
 * 
 * @param options - Options de l'IntersectionObserver
 * @returns Un tuple [ref, isIntersecting]
 * 
 * @example
 * ```tsx
 * function LazyImage({ src, alt }: { src: string; alt: string }) {
 *   const [ref, isVisible] = useIntersectionObserver({
 *     threshold: 0.1,
 *     freezeOnceVisible: true
 *   })
 * 
 *   return (
 *     <div ref={ref}>
 *       {isVisible ? (
 *         <img src={src} alt={alt} />
 *       ) : (
 *         <div className="skeleton" />
 *       )}
 *     </div>
 *   )
 * }
 * ```
 */
export function useIntersectionObserver<T extends Element = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
): [React.RefObject<T>, boolean] {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false,
  } = options

  const ref = useRef<T>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Si on freeze une fois visible et qu'on est déjà visible, ne rien faire
    if (freezeOnceVisible && isIntersecting) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      },
      { threshold, root, rootMargin }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, root, rootMargin, freezeOnceVisible, isIntersecting])

  return [ref, isIntersecting]
}

