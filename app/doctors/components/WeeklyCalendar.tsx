// /Volumes/WD-SN5000-2T/code/rn/MedScheduler/app/doctors/components/WeeklyCalendar.tsx

import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { CalendarItem } from "./CalendarItem";
import { useCalendar } from "../hooks/useCalendar"; 

export const WeeklyCalendar = () => {
  // 数据源：包含 7 个日历项
  const { dateArray } = useCalendar(new Date()); // 获取当前日期所在周的日期数组

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal // 启用横向滚动
        showsHorizontalScrollIndicator={false} // 隐藏滚动条
        contentContainerStyle={styles.scrollViewContent}
      >
        {dateArray.map((date, i) => (
          <CalendarItem key={i} date={date} />
        ))}
      </ScrollView>
    </View>
  );
};

// 样式定义
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
  },
  scrollViewContent: {
    paddingHorizontal: 10, // 左右间距
    alignItems: "center", // 垂直居中对齐
  },
});