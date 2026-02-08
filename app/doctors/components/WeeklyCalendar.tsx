// /Volumes/WD-SN5000-2T/code/rn/MedScheduler/app/doctors/components/WeeklyCalendar.tsx

import React from "react"
import { View, ScrollView, StyleSheet, Text } from "react-native"
import { CalendarItem } from "./CalendarItem"
import { useCalendar } from "../hooks/useCalendar"

// 为 setSelectedDate 显式声明类型
export const WeeklyCalendar = ({
  changeDate,
}: {
  changeDate: (date: Date) => void
}) => {
  // 数据源：包含 7 个日历项
  const { dateArray, isSelected, setSelectedDate } = useCalendar(changeDate) // 获取当前日期所在周的日期数组

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar</Text>

      <ScrollView
        horizontal // 启用横向滚动
        showsHorizontalScrollIndicator={false} // 隐藏滚动条
        contentContainerStyle={styles.scrollViewContent}
      >
        {dateArray.map((date, i) => (
          <CalendarItem
            key={i}
            date={date}
            setSelectedDate={setSelectedDate}
            isSelected={isSelected(i)}
          />
        ))}
      </ScrollView>
    </View>
  )
}

// 样式定义
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // 可选：设置背景色以区分日历区域
  },
  title: {
    fontSize: 20,
    padding: 10,
  },
  scrollViewContent: {
    alignItems: "center", // 垂直居中对齐
  },
})
