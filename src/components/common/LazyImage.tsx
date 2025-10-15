'use client'

import { useState } from 'react'
import Image, { ImageProps } from 'next/image'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'

interface LazyImageProps extends Omit<ImageProps, 'onLoad'> {
  /**
   * Classe CSS pour le skeleton loader
   */
  skeletonClassName?: string
  
  /**
   * Callback appelé quand l'image est chargée
   */
  onLoad?: () => void
}

/**
 * Composant Image optimisé avec lazy loading
 * 
 * L'image ne se charge que lorsqu'elle est visible dans le viewport
 * Affiche un skeleton loader pendant le chargement
 * 
 * @example
 * ```tsx
 * <LazyImage
 *   src="/images/profile.jpg"
 *   alt="Photo de profil"
 *   width={200}
 *   height={200}
 *   className="rounded-full"
 * />
 * ```
 */
export function LazyImage({
  src,
  alt,
  skeletonClassName = 'bg-gray-200 animate-pulse',
  onLoad,
  ...props
}: LazyImageProps) {
  const [ref, isVisible] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    freezeOnceVisible: true,
  })
  
  const [isLoaded, setIsLoaded] = useState(false)

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  return (
    <div ref={ref} className="relative">
      {isVisible ? (
        <>
          {!isLoaded && (
            <div
              className={`absolute inset-0 ${skeletonClassName}`}
              style={{
                width: props.width,
                height: props.height,
              }}
            />
          )}
          <Image
            src={src}
            alt={alt}
            {...props}
            onLoad={handleLoad}
            className={`${props.className} ${!isLoaded ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
          />
        </>
      ) : (
        <div
          className={skeletonClassName}
          style={{
            width: props.width,
            height: props.height,
          }}
        />
      )}
    </div>
  )
}

