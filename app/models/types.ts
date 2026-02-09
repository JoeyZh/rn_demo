export interface DoctorModel {
  name: string;
  timezone: string;
  day_of_week: string;
  available_at: string ;
  available_until: string ;
}


export interface TimeSlotModel {
  timezone: string;
  time:string;
  isBooked: boolean;
}

export interface MyAppointmentModel {
  // id: string;
  // patientId: string;
  doctorName: string;
  doctorTimeZone:string;
  timeSlot: BookedSlotModel;
  status: BookedStatus;
}

export type BookedStatus = 'scheduled' | 'completed' | 'canceled' | '';
export interface BookedSlotModel {
  // doctorName_date_time. 
  id?: string ;
  doctorName: string;
  doctorTimeZone: string;
  // 时间戳
  date: number;
  time: string;
  // 时间戳
  bookedTime: number;
  isBooked: boolean;
}

export type outDateFunc = (date: Date, time: string, timeZone: string) => boolean;
