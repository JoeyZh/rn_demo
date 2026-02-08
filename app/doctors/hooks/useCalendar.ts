import { useEffect, useMemo, useState } from "react"
import { getWeekDateArray } from "@/app/utils/utils"

export const useCalendar = (changeDate: (date: Date) => void) => {
  const [dateArray, setDateArray] = useState<Date[]>([])

  const [selected, setSelected] = useState<number>(0)

  const setSelectedDate = (date: Date) => {
    const index = dateArray.findIndex((d) => d == date)
    if (index !== -1) {
      setSelected(index)
      changeDate(date)
    }
  }
  const isSelected = (index: number) => {
    return selected === index
  }

  const init = useMemo(() => {
    const today = new Date()
    const weekDates = getWeekDateArray(today)
    setDateArray(weekDates)
    setSelectedDate(today)
  }, [])

  return { dateArray, selected, setSelectedDate, isSelected }
}
