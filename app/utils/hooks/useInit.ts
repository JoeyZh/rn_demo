import { useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { initBookedTimeSlots, selectDate,setOffline } from "@/app/store/doctorSlice"
import { initTable, getAllRows } from "@/app/store/bookAsyncStorages"
import { RootState } from "@/app/store"
export const useInit = () => {
  const dispatch = useDispatch()

  const offline = useSelector((state: RootState) => state.doctor.offline)
  const init = useCallback(async () => {
    dispatch(selectDate(Date.now()))
    initTable().then(() => {
      getAllRows().then((allBookedList) => {
        dispatch(initBookedTimeSlots(allBookedList))
      })
    })
  }, [])

  const toggleOffline = () => {
    const toggle = !offline;
    dispatch(setOffline(toggle))
  }

  useEffect(() => {
    init()
    return () => {
      dispatch(initBookedTimeSlots([]))
    }
  }, [])
  return { toggleOffline ,offline}
}
