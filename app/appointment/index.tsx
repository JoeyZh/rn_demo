import { View, Text, ScrollView, StyleSheet } from "react-native"
import { TimeSlotList } from "./components/TimeSlotList"
import { DoctorsItem } from "./components/DoctorsItem"
import { useTimeSlot } from "./hooks/useTimeSlot"
import { useRouter } from "expo-router"

export default function AppointmentScreen() {
  const router = useRouter()
  const { timeSlots, doctor, bookSlot } = useTimeSlot()

  // 如果没有选中医生，显示提示信息
  if (!doctor) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No doctor selected</Text>
        <Text style={styles.emptySubText}>Please select a doctor from the doctors list</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <DoctorsItem doctor={doctor} />
      <View style={styles.timeSlotSection}>
        <Text style={styles.sectionTitle}>Available Time Slots</Text>
        <TimeSlotList timeSlots={timeSlots || []} onTimeSlotPress={bookSlot} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: "#8e8e93",
    textAlign: "center",
  },
  timeSlotSection: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginHorizontal: 12,
    marginTop: 16,
    marginBottom: 12,
  },
})