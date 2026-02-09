import { DoctorsList } from "./components/DoctorsList"
import { DoctorModel } from "../models/types"
import { View, Text, ScrollView } from "react-native"
import { WeeklyCalendar } from "./components/WeeklyCalendar"
import { useDoctorList } from "./hooks/useDoctorList"
import { useBook } from "./hooks/useBook"
export default function DoctorsScreen() {
  const { setSelectedDate, filterDoctors, loading, fetchDoctors } =
    useDoctorList()
  const { gotoDetail } = useBook()
  return (
    <ScrollView>
      <WeeklyCalendar changeDate={setSelectedDate}></WeeklyCalendar>
      <DoctorsList
        doctors={filterDoctors}
        onLoading={fetchDoctors}
        loading={loading}
        gotoDetail={gotoDetail}
      />
    </ScrollView>
  )
}
