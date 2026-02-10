import { DoctorModel, BookedSlotModel, BookedStatus } from "@/app/models/types"
import { bookTimeSlot } from "../store/doctorSlice"
export const generateUniqueId = (slot: BookedSlotModel): string => {
  const { doctorName, date, time } = slot
  const formattedDate = new Date(date).toISOString().split("T")[0] // YYYY-MM-DD
  return `${doctorName}_${formattedDate}_${time}`
}

export const getDoctorName = (doctor: DoctorModel): string => {
  return doctor.name
}

export const predicateBookedByDoctorAndDate = (
  bookTimeSlot: BookedSlotModel,
  doctor: DoctorModel,
  dateTime: number,
  time: string,
): boolean => {
  const formattedDate = new Date(dateTime).toISOString().split("T")[0] // YYYY-MM-DD
  const bookSlotFormattedDate = new Date(bookTimeSlot.date)
    .toISOString()
    .split("T")[0] // 转换为 YYYY-MM-DD 格式
  return (
    bookTimeSlot.doctorName === doctor.name &&
    bookSlotFormattedDate === formattedDate &&
    bookTimeSlot.time === time
  )
}

export const appointmentStatus = (timeSlot:BookedSlotModel): BookedStatus => {
  const { date, time ,doctorTimeZone} = timeSlot
  console.log("appointmentStatus data",date,time,doctorTimeZone)
  if(!timeSlot){
    return ""  as BookedStatus;
  }
  const now = new Date();
  // date获取日期值，time 是时间 比如 10:00 或 10:00PM， 拼接起来组成一个新的时间 newDate
  const bookDate = new Date(date);
  const [hours, minutes] = time.split(":").map(Number);
  bookDate.setHours(hours);
  bookDate.setMinutes(minutes);
  const localeTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const interval = utcInterval(localeTimeZone,doctorTimeZone);
  bookDate.setTime(bookDate.getTime() - interval)
  // console.log("appointmentStatus bookDate:", bookDate.toLocaleString(), "now:", now.toLocaleString());
  
  if (bookDate < now) {
    return "completed";
  } else if (bookDate >= now) {
    return "scheduled";
  } else {
    return '' as BookedStatus;
  }
}


// 定义常量
const HOURS_MILLS = 60 * 60 * 1000;

export const mergeSlotDate = (item: BookedSlotModel): string => {
  const { date, time } = item;
  const mergedDate = new Date(date);
  const [hours, minutes] = time.split(":").map(Number);
  mergedDate.setHours(hours);
  mergedDate.setMinutes(minutes);
  mergedDate.setSeconds(0);
  return  mergedDate.toLocaleString("en-US");
};

/**
 * 根据时区获取 UTC 偏移量，例如 Asia/Shanghai => UTC+8
 * @param timezone 时区字符串，如 "Asia/Shanghai"
 */
export const timeZoneToUTC = (timezone: string): string => {
  try {
    // 创建一个基于指定时区的日期对象
    const date = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "shortOffset", // 获取时区偏移量
    });

    // 提取时区偏移量部分
    const parts = formatter.formatToParts(date);
    const offsetPart = parts.find((part) => part.type === "timeZoneName");

    if (!offsetPart) {
      throw new Error(`无法解析时区: ${timezone}`);
    }

    // 格式化为 UTC±X 形式
    const offset = offsetPart.value.replace("GMT", "UTC");
    return offset;
  } catch (error) {
    console.error("时区解析失败:", error);
    return ""; // 返回空字符串表示解析失败
  }
};

export const formattedDateOfUTC = (date: Date): string => {
  // 获取手机本地时区 
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return date.toLocaleString("en-US",{timeZoneName:"shortOffset"});
}

/**
 * 根据指定时区获取相对于 UTC 的时间偏移量（单位：毫秒）
 * @param timezone 时区字符串，如 "Asia/Shanghai"
 * @returns 相对于 UTC 的时间偏移量（毫秒）
 */
export const utcNumber = (timezone: string): number => {
  try {
    // 获取时区偏移字符串，例如 "UTC+8" 或 "UTC-5"
    const utcOffset = timeZoneToUTC(timezone);

    // 匹配偏移量中的数字和符号（支持正负数）
    const match = utcOffset.match(/([+-])(\d+)/);
    if (!match) {
      throw new Error(`无法解析时区偏移量: ${utcOffset}`);
    }

    const sign = match[1]; // '+' 或 '-'
    const hours = parseInt(match[2], 10); // 偏移小时数

    // 计算毫秒偏移量
    return sign === "+" ? hours : -hours;
  } catch (error) {
    console.error("时区偏移量解析失败:", error);
    return 0; // 解析失败时默认返回 0
  }
};
export const utcInterval = (fromTimeZone: string,toTimeZone:string): number => { 
  // 特殊情况：当两个时区相同时，返回 0
  if (fromTimeZone === toTimeZone) {
    return 0;
  }
  return utcNumber(toTimeZone) - utcNumber(fromTimeZone)*HOURS_MILLS;
};

/**
 * 检查预约时间是否可用
 * @param date 预约日期
 * @param time 预约时间
 * @param timezone 时区
 * @param interval 时间间隔（毫秒），默认30分钟
 * @returns 是否可用
 */
export const bookedAvailable = (date: Date, time: string, timezone: string, interval: number = 30 * 60 * 1000): boolean => {
  // 处理负间隔情况
  if (interval < 0) {
    return true;
  }

  try {
    const now = new Date();
    
    // 验证时区是否有效
    const isValidTimezone = () => {
      try {
        new Intl.DateTimeFormat('en-US', { timeZone: timezone });
        return true;
      } catch {
        return false;
      }
    };
    
    if (!isValidTimezone()) {
      return false;
    }
    
    // 获取 date 的年月日部分，年月日需要小于当前时间的年月日部分， 获取time的小时和分钟部分，拼接成一个新的时间 newDate，设置时区为 timezone
    const bookDate = new Date(date.toLocaleString("en-US", { timeZone: timezone }));
    const [hours, minutes] = time.split(":").map(Number);
    bookDate.setHours(hours);
    bookDate.setMinutes(minutes);
    //  如果当前时间早于预约时间 并且预约时间与当前时间的间隔大于 interval，则返回 true，否则返回 false
    return bookDate.getTime() - now.getTime() > interval;
  } catch (error) {
    return false;
  }
};