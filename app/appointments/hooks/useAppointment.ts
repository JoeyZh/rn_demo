import { MyAppointmentModel } from "@/app/models/types";
import { useMemo, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { RootState } from "@/app/store"
import { appointmentStatus } from "@/app/utils/bookUtils";
export const useAppointment = () => {
  const dispatch = useDispatch();

  const allBookedList = useSelector((state: RootState) => state.doctor.bookedTimeSlots)
 const initAppointments = useMemo<MyAppointmentModel[]>((): MyAppointmentModel[] => {
   const list =  allBookedList.map((item) => ({
     doctorName: item.doctorName,
     doctorTimeZone:item.doctorTimeZone,
     timeSlot: item, // 假设 item 对应 timeSlot
     status: item.isBooked ? appointmentStatus(new Date(item.date), item.time) : "canceled", // 添加默认状态
   }));
   return list.sort((a, b) => b.timeSlot.bookedTime - a.timeSlot.bookedTime );
 }, [allBookedList]);

  const [appointments, setAppointments] = useState<MyAppointmentModel[] | []>(initAppointments);

  const cancelBook = (appointItem: MyAppointmentModel) => {
    // 预约逻辑
  };

  const mockAppointments = () => {
    // 获取预约列表
    
  };

  return { cancelBook ,appointments};
};