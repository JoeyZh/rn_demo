import { View, Text, Button, StyleSheet } from "react-native"; // 导入 StyleSheet
import { DoctorModel } from "@/app/models/types"; // 导入 DoctorModel 类型
import { useBook } from "../hooks/useBook";

export const DoctorsItem = ({ doctor }: { doctor: DoctorModel }) => {
  const { gotoDetail } = useBook();

  return (
    <View style={styles.card}>

      <View>
      <Text>Name: {doctor.name}</Text>
      <Text>Day of week: {doctor.day_of_week}</Text>
      <Text>Time Zone: {doctor.timezone}</Text>

      {/* 按钮容器 */}
      <View style={styles.buttonContainer}>
        <Button title="Book" onPress={() => gotoDetail(doctor)} color="#007AFF" />
      </View>
      </View>
    </View>
  );
};

// 定义样式
const styles = StyleSheet.create({
  card: {
    backgroundColor: "white", // 背景色为白色
    borderRadius: 5, // 圆角为 5
    padding: 4, // 内边距为 4
    marginTop: 8, // 可选：增加垂直间距以提升视觉效果
    shadowColor: "#000", // 可选：添加阴影效果
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Android 平台的阴影效果
  },
  buttonContainer: {
    alignSelf: "flex-end", // 将按钮对齐到右侧
    marginTop: 8, // 可选：增加按钮与上方内容的间距
    width: 100, // 设置按钮宽度为 100
  },
});