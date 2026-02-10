import { DoctorsList } from "./components/DoctorsList"
import { ScrollView } from "react-native"
import { WeeklyCalendar } from "./components/WeeklyCalendar"
import { useDoctorList } from "./hooks/useDoctorList"
import { useBook } from "./hooks/useBook"
import { isEarlyByDay } from "../utils/utils"
export default function DoctorsScreen() {
  const { setSelectedDate, filterDoctors, loading, fetchDoctors,selectedDate } =
    useDoctorList()
  const { gotoDetail } = useBook()
  return (
    <ScrollView>
      <WeeklyCalendar changeDate={setSelectedDate} timezone={Intl.DateTimeFormat().resolvedOptions().timeZone}></WeeklyCalendar>
      <DoctorsList
        doctors={filterDoctors}
        onLoading={fetchDoctors}
        loading={loading}
        gotoDetail={gotoDetail}
        viewOnly={isEarlyByDay(selectedDate)}
      />
    </ScrollView>
  )
}
