import { DoctorModel, BookedSlotModel, BookedStatus } from "@/app/models/types"
export const generateUniqueId = (slot: BookedSlotModel): string => {
  const { doctorName, date, time } = slot
  const formattedDate = date.toISOString().split("T")[0] // YYYY-MM-DD
  return `${doctorName}_${formattedDate}_${time}`
}

export const getDoctorName = (doctor: DoctorModel): string => {
  return doctor.name
}

export const predicateBookedByDoctorAndDate = (
  bookTimeSlot: BookedSlotModel,
  doctor: DoctorModel,
  date: Date,
  time: string,
): boolean => {
  const formattedDate = date.toISOString().split("T")[0] // YYYY-MM-DD
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
