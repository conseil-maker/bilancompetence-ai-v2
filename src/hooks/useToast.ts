'use client'

import { useState, useCallback } from 'react'
import type { ToastType } from '@/components/common/Toast'

interface ToastState {
  id: string
  message: string
  type: ToastType
  duration: number
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastState[]>([])

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration: number = 5000) => {
      const id = Math.random().toString(36).substr(2, 9)
      const newToast: ToastState = { id, message, type, duration }

      setToasts((prev) => [...prev, newToast])

      // Auto-remove après la durée spécifiée
      if (duration > 0) {
        setTimeout(() => {
          removeToast(id)
        }, duration)
      }

      return id
    },
    []
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const success = useCallback(
    (message: string, duration?: number) => showToast(message, 'success', duration),
    [showToast]
  )

  const error = useCallback(
    (message: string, duration?: number) => showToast(message, 'error', duration),
    [showToast]
  )

  const warning = useCallback(
    (message: string, duration?: number) => showToast(message, 'warning', duration),
    [showToast]
  )

  const info = useCallback(
    (message: string, duration?: number) => showToast(message, 'info', duration),
    [showToast]
  )

  return {
    toasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info,
  }
}

