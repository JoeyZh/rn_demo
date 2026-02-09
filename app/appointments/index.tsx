import { StyleSheet, Text, ScrollView } from "react-native"
import {AppointmentList} from "./components/AppointmentList"
import { AppointmentItem } from "./components/AppointmentItem"
import { MyAppointmentModel } from "../models/types"
import { useAppointment } from "./hooks/useAppointment"
export default function AppointmentsScreen() {

  const { cancelBook,appointments } = useAppointment();

  return (
    <ScrollView>
      {/* <AppointmentItem appointment={mockAppointment} /> */}
      <AppointmentList items={appointments} onCancelItem={cancelBook} />
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