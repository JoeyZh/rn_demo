import { useEffect, useMemo, useState } from "react"
import { getWeekDateArray, equalsIgnoreTime } from "@/app/utils/utils"
import { useDispatch,useSelector } from "react-redux"
import { selectDate } from "@/app/store/doctorSlice"
import { RootState } from "@/app/store";

export const useCalendar = (changeDate: (date: Date) => void) => {
  const [dateArray, setDateArray] = useState<Date[]>([])
  const dispatch = useDispatch()
  const [selected, setSelected] = useState<number>(-1)

   const selectedDateStr = useSelector((state: RootState) => state.doctor.selectedDate);
  const setSelectedDate = (date: Date) => {
    const index = dateArray.findIndex((d) => equalsIgnoreTime(d, date));
    if (index !== -1) {
      setSelected(index);
      changeDate(date);
      dispatch(selectDate(date.getTime())); // 传递时间戳
    }
  };

  // 提供一个辅助函数将字符串转换为 Date 对象
  const getSelectedDate = (): Date | null => {
    return selectedDateStr ? new Date(selectedDateStr) : null;
  };
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
