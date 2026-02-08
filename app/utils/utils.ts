// /Volumes/WD-SN5000-2T/code/rn/MedScheduler/app/utils/utils.ts

/**
 * 获取指定日期所在周的 7 个日期（从星期日开始）
 * @param date 输入的日期
 * @returns 包含 7 个 Date 对象的数组，表示一周的日期
 */
export const getWeekDateArray = (date: Date): Date[] => {
  // 参数校验：确保输入是有效的 Date 对象
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid date input");
  }

  // 创建一个新的 Date 对象，避免修改原始日期
  const startOfWeek = new Date(date);

  // 计算本周的起始日期（星期日）
  const dayOfWeek = startOfWeek.getDay(); // 0 表示星期日
  startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

  // 生成一周的 7 个日期
  const weekDates = Array.from({ length: 7 }, (_, index) => {
    const currentDate = new Date(startOfWeek);
    currentDate.setDate(startOfWeek.getDate() + index);
    return currentDate;
  });

  return weekDates;
};