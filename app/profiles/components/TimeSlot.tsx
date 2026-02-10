
import { StyleSheet, Text, TouchableOpacity } from "react-native"
import { TimeSlotModel } from "@/app/models/types"
export const TimeSlot = ({ timeSlot,bookSlot ,outDate,readonly}: { timeSlot: TimeSlotModel;bookSlot:(time:string)=>void, outDate:boolean ,readonly?:boolean}) => {

  return (
  <TouchableOpacity
       disabled={readonly || outDate || timeSlot.isBooked} // 如果时间已被预约或过期，则禁用按钮
       style={[styles.container, timeSlot.isBooked && styles.booked, outDate && styles.outDate]} // 动态应用选中样式
       onPress={() => bookSlot(timeSlot.time)}
     >
       <Text style={[styles.timeText , timeSlot.isBooked && styles.timeBooked]}>
         {timeSlot.time}
       </Text>
     </TouchableOpacity>
  )
}

// 定义样式
const styles = StyleSheet.create({
   container: {
    backgroundColor: "white", // 默认背景色
    borderRadius: 8, // 圆角
    padding: 4, // 内边距
    margin: 4, // 外边距
    shadowColor: "#000", // 阴影颜色
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android 平台的阴影效果
    alignItems: "center", // 内容居中对齐
    width: "20%", // 调整宽度以适应网格布局
  },
  outDate:{
    opacity: 0.8, // 半透明效果
  },
  booked: {
    borderWidth: 1,
    borderColor: "#aaa",
    backgroundColor: "#f0f0f0",
  },


  timeText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "600",
  },
  timeBooked:{
    color: "#aaa", // 已预约的文本颜色
  },
  bookedText: {
    color: "#888", // 已预约的文本颜色
  },
})