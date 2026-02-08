import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export const CalendarItem = ({
  date,
  locale = "en-US",
  isSelected,
  setSelectedDate,
}: {
  date: Date;
  locale?: string;
  isSelected: boolean;
  setSelectedDate: (date: Date) => void;
}) => {
  // 创建 Intl.DateTimeFormat 实例，仅显示日期
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: "numeric", // 仅显示日期
  });

  // 格式化日期（仅显示日期）
  const formattedDate = dateFormatter.format(date);

  // 单独获取星期几（短格式）
  const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const weekday = weekdayFormatter.format(date);

 return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.selectedCard]} // 动态应用选中样式
      onPress={() => setSelectedDate(date)}
    >
      <Text style={[styles.weekdayText, isSelected  && styles.selectedWeekdayText]}>
        {weekday}
      </Text>
      <Text style={[styles.dateText, isSelected && styles.selectedDateText]}>
        {formattedDate}
      </Text>
    </TouchableOpacity>
  );
};

// 定义样式
const styles = StyleSheet.create({
  card: {
    backgroundColor: "white", // 默认背景色
    borderRadius: 8, // 圆角
    padding: 12, // 内边距
    margin: 8, // 外边距
    shadowColor: "#000", // 阴影颜色
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android 平台的阴影效果
    alignItems: "center", // 内容居中对齐
  },
  selectedCard: {
    backgroundColor: "#007AFF", // 选中时的背景色（蓝色）
    shadowColor: "#007AFF", // 选中时的阴影颜色
  },
  dateText: {
    fontSize: 24, // 日期字体大小
    fontWeight: "bold", // 加粗
    color: "#333", // 默认字体颜色
  },
  selectedDateText: {
    color: "white", // 选中时的字体颜色（白色）
  },
  weekdayText: {
    fontSize: 16, // 星期几字体大小
    color: "#666", // 默认字体颜色
  },
  selectedWeekdayText: {
    color: "white", // 选中时的字体颜色（白色）
  },
});