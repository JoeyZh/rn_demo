import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native"
import { DoctorModel } from "@/app/models/types"
export const DoctorsItem = ({ doctor }: { doctor: DoctorModel }) => {

  return (
    <View style={styles.card}>
      {/* 医生信息区域 */}
      <View style={styles.infoContainer}>
        {/* 医生姓名和图标 */}
        <View style={styles.nameRow}>
          <Text style={styles.doctorIcon}>👨‍⚕️</Text>
          <Text style={styles.name}>{doctor.name}</Text>
        </View>
        {/* 时区信息 */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Time Zone</Text>
          <Text style={styles.value}>{doctor.timezone}</Text>
        </View>
         <View style={styles.infoRow}>
                  <Text style={styles.label}>Time:</Text>
                  <Text style={styles.value}>
                    {doctor.available_at} - {doctor.available_until}
                  </Text>
                </View>
        </View>

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
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
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
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
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
  }
})
