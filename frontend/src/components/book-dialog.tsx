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
import { useState, useEffect, useRef, type SubmitEventHandler } from "react"
import { fetchData } from "@/services/fetch"

export function BookingDialog({ deskid }: { deskid: string }) {
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>([
    new Date(),
  ])
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())
  const [bookedDates, setBookedDates] = useState<Date[]>([] as Date[])
  const [open, setOpen] = useState<boolean>(false)
  const esRef = useRef<EventSource>(null)

  useEffect(() => {
    const getInitUnavailableDates = async () => {
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
      const initData = await fetchData(
        "http://localhost:3000/api/v1/desks",
        params,
        headers,
        "GET",
        undefined
      )
      if (initData && initData.success && initData.success == "true")
        setBookedDates(initData.data)
    }
    getInitUnavailableDates()
    const eventSource = new EventSource(
      "http://localhost:3000/api/v1/realtime/desks"
    )
    esRef.current = eventSource
    eventSource.onmessage = (event) => {
      // setBookedDates(event.data)
      console.log(event.data)
    }
    eventSource.onerror = function (event) {
      console.log("Error occurred:", event)
    }
  }, [deskid, selectedMonth])

  const closeClick = () => {
    esRef.current?.close()
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
        </DialogContent>
      </form>
    </Dialog>
  )
}
