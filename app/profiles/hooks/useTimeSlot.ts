import { useState, useEffect, useCallback, useMemo, use, useRef } from "react"
import { getTimeSlot, equalsIgnoreTime } from "@/app/utils/utils"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/app/store"
import { bookTimeSlot } from "@/app/store/doctorSlice"
import { TimeSlotModel } from "@/app/models/types"
import * as bookAsyncStorages from "@/app/store/bookAsyncStorages"

export const useTimeSlot = () => {
  const dispatch = useDispatch()
  const doctor = useSelector((state: RootState) => state.doctor.selectedDoctor)
  const selectedDate = useSelector(
    (state: RootState) => state.doctor.selectedDate,
  )
  
  const allBookedList = useSelector(
    (state: RootState) => state.doctor.bookedTimeSlots,
  )
  const bookedList = useMemo(() => {
    return allBookedList.filter(
      (booked) =>
        booked.isBooked &&
        booked.doctorName === doctor?.name &&
        equalsIgnoreTime(new Date(booked.date), new Date(selectedDate))
    )
  }, [allBookedList, doctor?.name, selectedDate])


  const [timeSlots, setTimeSlots] = useState<TimeSlotModel[]>([])

  const currentSlot = useRef<string>("")
  const isBooked = (slot: string) => {
    if (bookedList.length === 0) return false
    return bookedList.some((booked) => booked.time === slot)
  }
  const bookSlot = async () => {
    if (currentSlot.current === "") return
    // Booking logic here
    if (doctor && selectedDate) {
      const item = {
        doctor: doctor,
        dateTime: selectedDate,
        time: currentSlot.current,
      }
      dispatch(bookTimeSlot({ ...item }))
    }
  }

  const init = useMemo(() => {
    if (!doctor || !doctor.available_at || !doctor.available_until)
      setTimeSlots([])
    const slots: string[] = getTimeSlot(doctor, new Date(selectedDate))
    setTimeSlots(
      slots.map((slot) => ({
        doctor: doctor!,
        time: slot,
        isBooked: isBooked(slot),
      })),
    )
  }, [doctor, selectedDate])

  useEffect(() => {
    bookAsyncStorages.addAllRows(allBookedList)
  }, [allBookedList])

  return { timeSlots, bookSlot, doctor, isBooked, currentSlot }
}
