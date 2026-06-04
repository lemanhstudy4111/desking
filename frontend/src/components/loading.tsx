import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"

export function Loading({
  emptyTitle,
  emptyContent,
  includeSpinner,
}: {
  emptyTitle: string
  emptyContent: string
  includeSpinner: boolean
}) {
  return (
    <Empty className="w-full">
      <EmptyHeader>
        {includeSpinner ? (
          <EmptyMedia variant="icon">
            <Spinner />
          </EmptyMedia>
        ) : (
          <></>
        )}
        <EmptyTitle>{emptyTitle}</EmptyTitle>
        <EmptyDescription>{emptyContent}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent></EmptyContent>
    </Empty>
  )
}
