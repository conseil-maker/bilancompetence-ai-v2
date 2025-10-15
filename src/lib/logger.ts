/**
 * Système de logging structuré pour l'application
 * 
 * Utilise un format JSON en production pour faciliter l'analyse des logs
 * et un format lisible en développement.
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogContext {
  [key: string]: any
}

class Logger {
  private isDevelopment: boolean

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'
  }

  /**
   * Log un message de debug
   */
  debug(message: string, context?: LogContext) {
    this.log(LogLevel.DEBUG, message, context)
  }

  /**
   * Log un message d'information
   */
  info(message: string, context?: LogContext) {
    this.log(LogLevel.INFO, message, context)
  }

  /**
   * Log un avertissement
   */
  warn(message: string, context?: LogContext) {
    this.log(LogLevel.WARN, message, context)
  }

  /**
   * Log une erreur
   */
  error(message: string, error?: Error | unknown, context?: LogContext) {
    const errorContext: LogContext = {
      ...context,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
    }

    this.log(LogLevel.ERROR, message, errorContext)
  }

  /**
   * Méthode interne de logging
   */
  private log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString()

    if (this.isDevelopment) {
      // Format lisible pour le développement
      const prefix = this.getColoredPrefix(level)
      console.log(`${prefix} [${timestamp}] ${message}`)
      if (context) {
        console.log('Context:', context)
      }
    } else {
      // Format JSON pour la production
      const logEntry = {
        timestamp,
        level,
        message,
        ...context,
      }
      console.log(JSON.stringify(logEntry))
    }
  }

  /**
   * Retourne un préfixe coloré selon le niveau de log (développement uniquement)
   */
  private getColoredPrefix(level: LogLevel): string {
    const colors = {
      [LogLevel.DEBUG]: '\x1b[36m[DEBUG]\x1b[0m', // Cyan
      [LogLevel.INFO]: '\x1b[32m[INFO]\x1b[0m',   // Green
      [LogLevel.WARN]: '\x1b[33m[WARN]\x1b[0m',   // Yellow
      [LogLevel.ERROR]: '\x1b[31m[ERROR]\x1b[0m', // Red
    }
    return colors[level]
  }

  /**
   * Crée un logger avec un contexte par défaut
   */
  withContext(defaultContext: LogContext): Logger {
    const contextLogger = new Logger()
    const originalLog = contextLogger.log.bind(contextLogger)

    contextLogger.log = (level: LogLevel, message: string, context?: LogContext) => {
      originalLog(level, message, { ...defaultContext, ...context })
    }

    return contextLogger
  }
}

// Instance singleton du logger
export const logger = new Logger()

/**
 * Crée un logger pour une route API
 */
export function createApiLogger(route: string) {
  return logger.withContext({ route, type: 'api' })
}

/**
 * Crée un logger pour un composant
 */
export function createComponentLogger(component: string) {
  return logger.withContext({ component, type: 'component' })
}

/**
 * Crée un logger pour un service
 */
export function createServiceLogger(service: string) {
  return logger.withContext({ service, type: 'service' })
}

