import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { useState, useEffect, useRef } from "react"
import { fetchData } from "@/services/fetch"
import { Loading } from "./loading"

export function BookingDialog({ deskid }: { deskid: string }) {
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>([
    new Date(),
  ])
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())
  const [bookedDates, setBookedDates] = useState<Date[]>([] as Date[])
  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const isFetching = useRef(false)

  useEffect(() => {
    const fetchRes = async () => {
      if (isFetching.current) return // Prevent overlaps
      isFetching.current = true
      setLoading(true)

      const params = {
        deskids: JSON.stringify(deskid),
        startDate: new Date(selectedMonth.setDate(1)).toISOString(),
        endDate: new Date(
          selectedMonth.setMonth(
            selectedMonth.getMonth() < 12 ? selectedMonth.getMonth() + 1 : 0,
            0
          )
        ).toISOString(),
      }
      const headers = {
        "Content-Type": "application/json",
      }
      try {
        const newData = await fetchData(
          "http://localhost:3000/api/v1/desks/get/booked-dates",
          params,
          headers,
          "GET",
          undefined
        )
        if (
          !newData ||
          !newData.success ||
          newData.success != "true" ||
          !newData.data
        )
          throw new Error(
            `Something went wrong when fetching data. Err: ${JSON.stringify(newData)}`
          )
        setBookedDates((prev) => newData.data) // Functional update
      } catch (err) {
        setError((err as Error).message)
        console.error("API error:", err)
      } finally {
        setLoading(false)
        isFetching.current = false // Reset flag
      }
    }
    const fetchResInterval = () => {
      fetchRes().catch((err) => {
        console.error(`API call failed: ${err}`)
      })
    }
    const intervalId = setInterval(fetchResInterval, 60000)
    fetchResInterval()
    return () => clearInterval(intervalId)
  }, [deskid, selectedMonth])

  const closeClick = () => {
    setOpen(false)
  }

  const submitHandle = () => {}

  return (
    <Dialog open={open} onOpenChange={closeClick}>
      <form onSubmit={submitHandle}>
        <DialogTrigger asChild>
          <Button variant="outline">Book Space</Button>
        </DialogTrigger>
        <DialogContent>
          {loading ? (
            <Loading
              emptyTitle="Loading"
              emptyContent="Please wait while booking page is loading. Do not refresh the page."
              includeSpinner={true}
            ></Loading>
          ) : error ? (
            <div>Something went wrong</div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Book this Space</DialogTitle>
                <DialogDescription>
                  Choose a time frame that you would like to book this space in.
                  Then, choose the dates during which your would use the space
                  within the chosen time frame.
                </DialogDescription>
              </DialogHeader>
              <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
                <Calendar
                  mode="multiple"
                  defaultMonth={new Date()}
                  selected={selectedDates}
                  onSelect={setSelectedDates}
                  disabled={bookedDates}
                  modifiers={{
                    booked: bookedDates,
                  }}
                  modifiersClassNames={{
                    booked: "[&>button]:line-through opacity-100",
                  }}
                  onMonthChange={setSelectedMonth}
                  captionLayout="dropdown"
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Submit</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </form>
    </Dialog>
  )
}
