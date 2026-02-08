import { useState, useEffect, useCallback, useMemo } from "react"
import { DoctorModel } from "../../models/types"
import { listDoctors } from "../domains/doctors"
import { filterDoctorOfWeekDay } from "@/app/utils/utils"
export const useDoctorList = () => {
  const [doctors, setDoctors] = useState<DoctorModel[]>([])

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

    const filterDoctors = useMemo(() => {
    return  filterDoctorOfWeekDay(doctors, selectedDate)
  }, [doctors,selectedDate])

  const fetchDoctors = useCallback(async () => {
    try {
      // const response = await fetch("/api/doctors")
      const data = await  listDoctors()
      setDoctors(data)
    } catch (error) {
      console.error("Error fetching doctors:", error)
    }
  }, [])

  useEffect(() => {
    fetchDoctors()
  }, [])


  return { selectedDate, setSelectedDate ,filterDoctors}
}
