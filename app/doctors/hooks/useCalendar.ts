import { useEffect, useMemo, useState } from "react"
import { getWeekDateArray, equalsIgnoreTime } from "@/app/utils/utils"
import { useDispatch, useSelector } from "react-redux"
import { selectDate } from "@/app/store/doctorSlice"
import { RootState } from "@/app/store"

export const useCalendar = (changeDate: (date: Date) => void) => {
  const [dateArray, setDateArray] = useState<Date[]>([])
  const dispatch = useDispatch()
  const [selected, setSelected] = useState<number>()

  const setSelectedDate = (date: Date) => {
    const index = dateArray.findIndex((d) => equalsIgnoreTime(d, date))
    if (index !== -1) {
      setSelected(index)
      changeDate(date)
      dispatch(selectDate(date.getTime())) // 传递时间戳
    }
  }
  const isSelected = (index: number) => {
    return selected === index
  }

  const init = useMemo(() => {
    const today = new Date()
    const weekDates = getWeekDateArray(today)
    setDateArray(weekDates)
  }, [])

  useEffect(() => {
    if (dateArray.length > 0) {
      setSelectedDate(new Date())
    }
  }, [dateArray])

  return { dateArray, selected, setSelectedDate, isSelected }
}
