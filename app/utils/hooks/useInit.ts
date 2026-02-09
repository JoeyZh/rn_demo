import { useCallback, useEffect } from "react"
import { useDispatch } from "react-redux"
import { initBookedTimeSlots, selectDate } from "@/app/store/doctorSlice"
import { initTable, getAllRows } from "@/app/store/bookAsyncStorages"
export const useInit = () => {
  const dispatch = useDispatch()

  const init = useCallback(async () => {
    dispatch(selectDate(Date.now()))
    initTable().then(() => {
      getAllRows().then((allBookedList) => {
        dispatch(initBookedTimeSlots(allBookedList))
      })
    })
  }, [])

  useEffect(() => {
    init()
    return () => {
      dispatch(initBookedTimeSlots([]))
    }
  }, [])
}
