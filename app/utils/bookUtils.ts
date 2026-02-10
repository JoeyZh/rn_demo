import { DoctorModel, BookedSlotModel, BookedStatus } from "@/app/models/types"
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

export const appointmentStatus = (date:Date, time:string): BookedStatus => {
  const now = new Date();
  // date获取日期值，time 是时间 比如 10:00 或 10:00PM， 拼接起来组成一个新的时间 newDate
  const bookDate = new Date(date);
  const [hours, minutes] = time.split(":").map(Number);
  bookDate.setHours(hours);
  bookDate.setMinutes(minutes);
  
  if (bookDate < now) {
    return "completed";
  } else if (bookDate >= now) {
    return "scheduled";
  } else {
    return '' as BookedStatus;
  }
}


export const bookedAvailable = (date: Date,time:string, timezone: string,interval:number = 30 * 60 * 1000): boolean => {

  const now = new Date();
  // 获取 date 的年月日部分，年月日需要小于当前时间的年月日部分， 获取time的小时和分钟部分，拼接成一个新的时间 newDate，设置时区为 timezone
  const bookDate = new Date(date.toLocaleString("en-US", { timeZone: timezone }));
  const [hours, minutes] = time.split(":").map(Number);
  bookDate.setHours(hours);
  bookDate.setMinutes(minutes);
  //  如果当前时间早于预约时间 并且预约时间与当前时间的间隔大于 interval，则返回 true，否则返回 false
  return bookDate.getTime() - now.getTime() > interval;
};

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

  // const options = {
  //   year: "numeric",
  //   month: "2-digit",
  //   day: "2-digit",
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   second: "2-digit",
  //   timeZone: timeZone,
  // };
  // return new Intl.DateTimeFormat("en-US", options).format(date);
}
