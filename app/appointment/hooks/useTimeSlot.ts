import { useState, useEffect, useCallback, useMemo } from "react"
import { getTimeSlot } from "@/app/utils/utils"
import { DoctorModel } from "@/app/models/types"
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "@/app/store"
import { TimeSlotModel } from "@/app/models/types"

export const useTimeSlot = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlotModel[]>([])
  const doctor = useSelector((state: RootState) => state.doctor.selectedDoctor)
  const selectedDate = useSelector((state: RootState) => state.doctor.selectedDate)

  const [bookedTimeSlots, setBookedTimeSlots] = useState<{ [key: string]: string[] }>({})
  
  const bookSlot = (slot: string) => {
    // Booking logic here
    if (doctor) {
      setBookedTimeSlots((prev) => ({
        ...prev,
        [doctor.name]: [...(prev[doctor.name] || []), slot]
      }))
    }
  }

    const init = useMemo(() => {
        if (!doctor || !doctor.available_at || !doctor.available_until )  setTimeSlots([])
        const slots: string[] = getTimeSlot(doctor, selectedDate)
        setTimeSlots(slots.map((slot) => ({
          doctor: doctor!,
          time: slot,
          isBooked: false
        })))

  }, [doctor, selectedDate])

  return { timeSlots, bookSlot,doctor }
}