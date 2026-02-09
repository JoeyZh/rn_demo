import { useState, useEffect, useCallback, useMemo } from "react"
import { DoctorModel } from "../../models/types"
import { listDoctors } from "../domains/doctors"
import { filterDoctorOfWeekDay } from "@/app/utils/utils"
import { initTable,addAllRow,queryRows } from "@/app/store/doctorsAsyncStorages"
import { RootState } from "@/app/store"
import { useSelector } from "react-redux"

export const useDoctorList = () => {
  const [doctors, setDoctors] = useState<DoctorModel[]>([])

  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState<boolean>(true)

  const filterDoctors = useMemo(() => {
    return filterDoctorOfWeekDay(doctors, selectedDate)
  }, [doctors, selectedDate])

  const offline = useSelector((state: RootState) => state.doctor.offline)

  const fetchDoctors = useCallback(async () => {
    try {
      console.log("Fetching doctors, offline mode:", offline)
      const data = offline ? await queryRows() : await listDoctors()
      setDoctors(data)
      initTable().then(() => addAllRow(data))
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
