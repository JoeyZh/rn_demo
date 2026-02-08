import { MyAppointmentModel } from "@/app/models/types";
import { useState } from "react";

export const useAppointment = () => {

    const [appointments, setAppointments] = useState<MyAppointmentModel[] | []>([]);
  const cancelBook = (appointItem: MyAppointmentModel) => {
    // 预约逻辑
  };

  return { cancelBook };
};