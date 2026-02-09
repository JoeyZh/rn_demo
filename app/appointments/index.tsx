import { StyleSheet, Text, ScrollView } from "react-native"
import {AppointmentList} from "./components/AppointmentList"
import { AppointmentItem } from "./components/AppointmentItem"
import { MyAppointmentModel } from "../models/types"
import { useAppointment } from "./hooks/useAppointment"
import { useBookAlert } from "../profiles/hooks/useBookAlert"
export default function AppointmentsScreen() {

  const { cancelBook,appointments,currentSlotId } = useAppointment();
  const {show} = useBookAlert({onConfirm:cancelBook});

  return (
    <ScrollView>
      {/* <AppointmentItem appointment={mockAppointment} /> */}
      <AppointmentList items={appointments} onCancelItem={(item) => {
        currentSlotId.current = item.timeSlot.id || '';
        show("Cancel Booking?","Are you sure you want to cancel this appointment?");
      }} />
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