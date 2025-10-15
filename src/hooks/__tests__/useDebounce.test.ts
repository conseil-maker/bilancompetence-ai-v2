import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '../useDebounce'

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('should debounce the value change', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 },
      }
    )

    expect(result.current).toBe('initial')

    // Change the value
    rerender({ value: 'updated', delay: 500 })

    // Value should not change immediately
    expect(result.current).toBe('initial')

    // Fast-forward time by 500ms
    act(() => {
      jest.advanceTimersByTime(500)
    })

    // Value should now be updated
    expect(result.current).toBe('updated')
  })

  it('should cancel previous timeout on rapid changes', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: 'initial' },
      }
    )

    // Change value multiple times rapidly
    rerender({ value: 'first' })
    act(() => {
      jest.advanceTimersByTime(200)
    })

    rerender({ value: 'second' })
    act(() => {
      jest.advanceTimersByTime(200)
    })

    rerender({ value: 'third' })
    act(() => {
      jest.advanceTimersByTime(200)
    })

    // Value should still be initial (total time < 500ms)
    expect(result.current).toBe('initial')

    // Fast-forward remaining time
    act(() => {
      jest.advanceTimersByTime(300)
    })

    // Value should be the last one
    expect(result.current).toBe('third')
  })

  it('should work with different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 1000 },
      }
    )

    rerender({ value: 'updated', delay: 1000 })

    act(() => {
      jest.advanceTimersByTime(500)
    })
    expect(result.current).toBe('initial')

    act(() => {
      jest.advanceTimersByTime(500)
    })
    expect(result.current).toBe('updated')
  })

  it('should work with different data types', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      {
        initialProps: { value: 0 },
      }
    )

    expect(result.current).toBe(0)

    rerender({ value: 42 })
    act(() => {
      jest.advanceTimersByTime(500)
    })
    expect(result.current).toBe(42)
  })
})

