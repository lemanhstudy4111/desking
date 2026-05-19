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
import * as React from "react"
import { es } from "react-day-picker/locale"
import { Calendar } from "@/components/ui/calendar"
import { useState, useEffect } from "react"
import { fetchData } from "@/services/fetch"

export function BookingDialog({ children }) {
  const [date, setDate] = useState<Date[] | undefined>([
    new Date(new Date().getFullYear(), 1, 3),
  ])
  const getUnavailableDates = async (deskids: string[], today: Date) => {
    const params = {
      deskids: JSON.stringify(deskids),
      startDate: new Date(today.setDate(1)).toISOString(),
      endDate: new Date(
        today.setMonth(today.getMonth() < 12 ? today.getMonth() + 1 : 0, 0)
      ).toISOString(),
    }
    return await fetchData("booking/get", params, undefined, "GET", undefined)
  }
  useEffect()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Book Space</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book this Space</DialogTitle>
          <DialogDescription>
            Choose a time frame that you would like to book this space in. Then,
            choose the dates during which your would use the space within the
            chosen time frame.
          </DialogDescription>
        </DialogHeader>
        <div className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
          <Calendar
            mode="multiple"
            defaultMonth={new Date()}
            selected={date}
            onSelect={setDate}
            disabled={bookedDates}
            modifiers={{
              booked: bookedDates,
            }}
            modifiersClassNames={{
              booked: "[&>button]:line-through opacity-100",
            }}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
