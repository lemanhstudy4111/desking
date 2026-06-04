import { Button } from "./ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card"
import imgURL from "../assets/image.png"
import { useState, type SubmitEvent } from "react"
import { Dialog } from "radix-ui"
import { BookingDialog } from "./book-dialog"

interface SpaceCardType {
  id: string
  name: string
  description: string
  startHour: string
  endHour: string
  imgSrc: string
}

function ShowMore({ text, limit = 200 }: { text: string; limit: number }) {
  const [expanded, setExpanded] = useState(false)

  if (text.length <= limit) return <p>{text}</p>

  return (
    <span>
      {expanded ? text : text.slice(0, limit) + "..."}
      <button
        onClick={() => setExpanded(!expanded)}
        className="ml-1 text-blue-500 hover:underline"
      >
        {expanded ? "Show less" : "Show more"}
      </button>
    </span>
  )
}

export function SpaceCard(props: SpaceCardType) {
  return (
    <div className="sm:w-full md:w-1/2 lg:w-1/3">
      <Card>
        <img src={imgURL}></img>
        <CardHeader>
          <CardAction>
            <BookingDialog deskid={props.id} />
          </CardAction>
          <CardTitle className="text-2xl">{props.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="flex flex-col">
            <ShowMore text={props.description} limit={200} />
            <span>
              {props.startHour} - {props.endHour}
            </span>
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}

export function MultiSpaceCard({ data }: { data: SpaceCardType[] }) {
  return (
    <div className="flex flex-row gap-2">
      {data.map((spaceCardData: SpaceCardType) => (
        <SpaceCard key={spaceCardData.name} {...spaceCardData} />
      ))}
    </div>
  )
}
