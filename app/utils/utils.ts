// /Volumes/WD-SN5000-2T/code/rn/MedScheduler/app/utils/utils.ts

import { DoctorModel } from "../models/types"
/**
 * 获取指定日期所在周的 7 个日期（从星期日开始）
 * @param date 输入的日期
 * @returns 包含 7 个 Date 对象的数组，表示一周的日期
 */
export const getWeekDateArray = (date: Date): Date[] => {
  // 参数校验：确保输入是有效的 Date 对象
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid date input")
  }

  // 创建一个新的 Date 对象，避免修改原始日期
  const startOfWeek = new Date(date)

  // 计算本周的起始日期（星期日）
  const dayOfWeek = startOfWeek.getDay() // 0 表示星期日
  startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek)

  // 生成一周的 7 个日期
  const weekDates = Array.from({ length: 7 }, (_, index) => {
    const currentDate = new Date(startOfWeek)
    currentDate.setDate(startOfWeek.getDate() + index)
    return currentDate
  })

  return weekDates
}

export const filterDoctorOfWeekDay = (
  doctors: DoctorModel[],
  date: Date,
): DoctorModel[] => {
  const weekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "long" })
  const weekday = (date: Date) => weekdayFormatter.format(date)
  return doctors.filter(
    (doctor) =>
      doctor.day_of_week?.toLowerCase() === weekday(date).toLowerCase(),
  )
}

/**
 * 获取医生的可用时间段
 * @param doctor 医生信息
 * @param date 查询日期（用于未来扩展，当前未使用）
 * @returns 可用时间段数组（格式为 HH:MM）
 */
export const getTimeSlot = (
  doctor: DoctorModel | null,
  date: Date | null = new Date(),
): string[] => {
  // 参数校验
  if (!doctor || !doctor.available_at || !doctor.available_until) {
    throw new Error(
      "Invalid doctor data: missing available_at or available_until fields",
    )
  }

  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error("Invalid date input")
  }

  // 解析时间字符串（支持 AM/PM 格式）
  const parseTime = (timeStr: string): Date => {
    const [time, modifier] = timeStr.match(/(\d{1,2}:\d{2})(AM|PM)?/)!.slice(1)
    let [hours, minutes] = time.split(":").map(Number)

    if (modifier === "PM" && hours !== 12) {
      hours += 12
    } else if (modifier === "AM" && hours === 12) {
      hours = 0
    }

    const parsedDate = new Date()
    parsedDate.setHours(hours, minutes, 0, 0)
    return parsedDate
  }

  const startTime = parseTime(doctor.available_at)
  const endTime = parseTime(doctor.available_until)

  // 检查时间范围合法性
  if (startTime >= endTime) {
    throw new Error(
      "Invalid time range: available_at must be earlier than available_until",
    )
  }

  // 生成时间段（每 30 分钟一个间隔）
  const timeSlots: string[] = []
  for (
    let time = new Date(startTime);
    time < endTime;
    time.setMinutes(time.getMinutes() + 30)
  ) {
    timeSlots.push(time.toTimeString().slice(0, 5)) // 格式化为 HH:MM
  }

  return timeSlots
}

export const equalsIgnoreTime = (date1: Date, date2: Date): boolean => {
  const formatDate = (d: Date) => d.toISOString().split("T")[0] // 转换为 YYYY-MM-DD 格式
  const d1 = formatDate(date1)
  const d2 = formatDate(date2)
  return d1 === d2
}

export const isEarlyByDay = (date: Date): boolean => {
  const now = new Date()
  // 获取 date 的年月日部分，年月日需要小于 now 的年月日部分
  return (
    date.getFullYear() < now.getFullYear() ||
    (date.getFullYear() === now.getFullYear() &&
      date.getMonth() < now.getMonth()) ||
    (date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() < now.getDate())
  )
}

export const weekday = (date: Date, locale: string = "en-US"): string => {
  // 单独获取星期几（短格式）
  const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: "short" })
  const weekday = weekdayFormatter.format(date)
  return weekday
}

export const getDateDay = (date: Date, locale: string = "en-US"): string => {
    // 创建 Intl.DateTimeFormat 实例，仅显示日期
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: "numeric", // 仅显示日期
  })

  // 格式化日期（仅显示日期）
  const formattedDate = dateFormatter.format(date)
  return formattedDate
}
