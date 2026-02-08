import { View, Text } from "react-native";

export const CalendarItem = ({ date, locale = "en-US" }: { date: Date; locale?: string }) => {
  // 创建 Intl.DateTimeFormat 实例
  const formatter = new Intl.DateTimeFormat(locale, {
    weekday: "long", // 显示完整的星期几（如 Monday）
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // 格式化日期
  const formattedDate = formatter.format(date);

  // 单独获取星期几（短格式）
  const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const weekday = weekdayFormatter.format(date);

  return (
    <View>
      <Text>{formattedDate}</Text> {/* 完整日期 */}
      <Text>{weekday}</Text>       {/* 星期几 */}
    </View>
  );
};