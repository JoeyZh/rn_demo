import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native"
import { MyAppointmentModel } from "@/app/models/types"
import { mergeSlotDate } from "@/app/utils/bookUtils"

export const AppointmentItem = ({
  appointment,
  onCancel,
}: {
  appointment: MyAppointmentModel
  onCancel: (appointment: MyAppointmentModel) => void
}) => {

  const stateStyle = (status: string) => {
    switch (status) {
      case "scheduled":
        return styles.stateBooked;
      case "canceled":
        return styles.stateCancel;
      default:
        return {};
    }
  };
  return (
    <View style={styles.card}>
      {/* 医生信息区域 */}
      <View style={styles.infoContainer}>
        <View style={styles.headRow}>
          <View style={styles.nameRow}>
            <Text style={styles.doctorIcon}>👨‍⚕️</Text>
            <Text style={styles.name}>{appointment.doctorName ??''}</Text>
          </View>
          <Text style={[styles.state, stateStyle(appointment.status)]}>{appointment.status}</Text>
        </View>
        {/* 医生姓名和图标 */}

        {/* 时区信息 */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Time Zone</Text>
          <Text style={styles.value}>{appointment.doctorTimeZone??''}</Text>
        </View>
        {/* 可用时间信息 */}

        <View style={styles.infoRow}>
          <Text style={styles.label}>Date:</Text>
          <Text style={styles.value}>{mergeSlotDate(appointment.timeSlot)}</Text>
        </View>
      </View>

      {appointment.status === "scheduled" && (
        <Button title='Cancel BOOKING' onPress={() => onCancel(appointment)} color='#007AFF' />
      )}
    </View>
  )
}

// 定义样式
const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoContainer: {
    marginBottom: 4,
  },
  headRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  state: {
    fontSize: 14,
    padding: 4,
    color: "#1a1a1a",
  },
  stateBooked:{
    color: "#007AFF",
  },
  stateCancel:{
    color: "#1a1a1a",
  },
  doctorIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  infoContent: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  infoItem: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#8e8e93",
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: "#1a1a1a",
    fontWeight: "500",
    flex: 1,
    marginLeft: 8,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonContainer: {
    alignSelf: "flex-end", // 将按钮对齐到右侧
    marginTop: 8, // 可选：增加按钮与上方内容的间距
    width: 100, // 设置按钮宽度为 100
  },
})
