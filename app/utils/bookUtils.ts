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
  return now.getTime() - bookDate.getTime() > interval;
};
