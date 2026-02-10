import { useState, useEffect, useCallback, useMemo } from "react"
import { DoctorModel } from "../../models/types"
import { listDoctors } from "../domains/doctors"
import { filterDoctorOfWeekDay } from "@/app/utils/utils"
import { addAllRow,queryRows, getOffline } from "@/app/store/doctorsAsyncStorages"

export const useDoctorList = () => {
  const [doctors, setDoctors] = useState<DoctorModel[]>([])

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState<boolean>(true)

  const filterDoctors = useMemo(() => {
    return filterDoctorOfWeekDay(doctors, selectedDate)
  }, [doctors, selectedDate])

  const fetchDoctors = useCallback(async () => {
    try {
      const offline = await getOffline()
      console.log("Fetching doctors, offline mode:", offline)
      const data = offline ? await queryRows() : await listDoctors()
      setDoctors(data)
      addAllRow(data)
    } catch (error) {
      console.error("Error fetching doctors:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDoctors()
  }, [])

  return { selectedDate, setSelectedDate, filterDoctors, fetchDoctors, loading}
}
