import { fetchData } from "@/services/fetch"
import { useState, useRef, useEffect } from "react"

export function usePolling(
  urlString,
  params,
  body,
  headers,
  method,
  intervalMs: number = 60000
) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const isFetching = useRef(false)

  useEffect(() => {
    const fetchRes = async () => {
      if (isFetching.current) return // Prevent overlaps
      isFetching.current = true
      setLoading(true)

      try {
        const newData = await fetchData(
          urlString,
          params,
          headers,
          method,
          body
        )
        if (!newData || !newData.success || newData.success == "false")
          throw new Error(
            `Something went wrong when fetching data. Err: ${JSON.stringify(newData)}`
          )
        setData((prev) => newData) // Functional update
      } catch (err) {
        setError((err as Error).message)
        console.error("API error:", err)
      } finally {
        setLoading(false)
        isFetching.current = false // Reset flag
      }
    }
    const fetchDataInterval = () => {
      fetchRes().catch((err) => {
        console.error("Interval API call failed:", err)
      })
    }

    // Start interval and initial fetch
    const intervalId = setInterval(fetchDataInterval, 60000) // 60 seconds
    fetchDataInterval() // Fetch immediately on mount

    // ✅ Cleanup: Clear interval on unmount
    return () => clearInterval(intervalId)
  }, [body, headers, intervalMs, method, params, urlString])

  return { data, loading, error }
}
