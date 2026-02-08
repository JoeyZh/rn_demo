import { useMemo, useState } from "react"
import { getWeekDateArray } from "@/app/utils/utils"

export const useCalendar = (date: Date) => {
  const [dateArray, setDateArray] = useState<Date[]>([])
  const init = useMemo(() => {
    const today = new Date()
    const weekDates = getWeekDateArray(today)
    setDateArray(weekDates)
  }, [date])
  return { dateArray }
}
