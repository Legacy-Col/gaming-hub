import { useState, useEffect, useCallback, useRef } from 'react'
import type { FetchState, ApiResponse } from '@/types'

/**
 * Generic data-fetching hook.
 * Pass any function that returns a Promise<ApiResponse<T>>.
 * Falls back to `fallback` data when the API is unreachable (dev mode).
 */
export function useApi<T>(
  fetcher: () => Promise<ApiResponse<T>>,
  fallback?: T,
  deps: unknown[] = [],
): FetchState<T> {
  const [state, setState] = useState<Omit<FetchState<T>, 'refetch'>>({
    data: fallback ?? null,
    loading: true,
    error: null,
  })

  const mountedRef = useRef(true)
  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const run = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }))
    try {
      const res = await fetcher()
      if (mountedRef.current) {
        setState({ data: res.data, loading: false, error: null })
      }
    } catch (err) {
      if (mountedRef.current) {
        const msg = err instanceof Error ? err.message : 'Unknown error'
        setState(s => ({
          data: fallback ?? s.data,
          loading: false,
          error: import.meta.env.DEV ? null : msg,
        }))
        if (import.meta.env.DEV) {
          console.warn('[useApi] Using fallback data:', msg)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => { run() }, [run])

  return { ...state, refetch: run }
}
