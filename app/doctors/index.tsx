import { DoctorsList } from "./components/DoctorsList"
import { DoctorModel } from "../models/types"
import { View, Text, ScrollView } from "react-native"
import { WeeklyCalendar } from "./components/WeeklyCalendar"
import { useDoctorList } from "./hooks/useDoctorList"
export default function DoctorsScreen() {
  const {setSelectedDate,filterDoctors} = useDoctorList();
  return (
    <ScrollView>
      <WeeklyCalendar changeDate={setSelectedDate}></WeeklyCalendar>
      <DoctorsList doctors={filterDoctors} />
    </ScrollView>
  )
}

