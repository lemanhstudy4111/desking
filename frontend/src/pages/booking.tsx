import { MultiSpaceCard } from "@/components/space-card"

export function Booking() {
  const mockData = [
    {
      name: "cubicle 1",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur luctus, purus non ultrices porttitor, velit dolor finibus eros, ut sodales nisl eros vitae ante. Donec ut egestas enim. Ut vel congue elit, quis efficitur velit. Nam eu efficitur tellus, sed egestas elit.",
      startHour: "9:00 AM",
      endHour: "8:00 PM",
      imgSrc: "../../../frontend/src/assets/image.png",
    },
  ]
  return (
    <div>
      <div>
        <h1>Book a Space</h1>
        <span>Refresh for more spaces!</span>
      </div>
      <div>
        <MultiSpaceCard data={mockData} />
      </div>
    </div>
  )
}
