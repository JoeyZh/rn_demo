import { StyleSheet, Text, ScrollView } from "react-native"
import {AppointmentList} from "./components/AppointmentList"
import { AppointmentItem } from "./components/AppointmentItem"
import { MyAppointmentModel } from "../models/types"
import { useAppointment } from "./hooks/useAppointment"
export default function AppointmentsScreen() {
  const mockDoctor = { name: "Dr. Smith", timezone: "GMT+1", day_of_week: "Monday", available_at: "09:00", available_until: "17:00" }
  const mockAppointment: MyAppointmentModel = {
    doctor: mockDoctor,
    timeSlot: { time: "10:00 AM",isBooked:true,doctor:mockDoctor },
    status: "scheduled",
  }

  const { cancelBook,appointments } = useAppointment();

  return (
    <ScrollView>
      <Text>AppointmentsScreen</Text>

      {/* <AppointmentItem appointment={mockAppointment} /> */}
      <AppointmentList items={appointments} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})