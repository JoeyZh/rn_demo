import { useState, useEffect, useCallback, useMemo } from "react"
import { DoctorModel } from "../../models/types"
import { listDoctors } from "../domains/doctors"
import { filterDoctorOfWeekDay } from "@/app/utils/utils"
import { initTable } from "@/app/store/doctorsAsyncStorages"
export const useDoctorList = () => {
  const [doctors, setDoctors] = useState<DoctorModel[]>([])

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState<boolean>(true)

  const filterDoctors = useMemo(() => {
    return filterDoctorOfWeekDay(doctors, selectedDate)
  }, [doctors, selectedDate])

  const initTable = useCallback(async () => {
    await initTable()
  }, [])

  const fetchDoctors = useCallback(async () => {
    try {
      const data = await listDoctors()
      setDoctors(data)
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
