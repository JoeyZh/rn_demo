export interface DoctorModel {
  name: string;
  timezone: string;
  day_of_week: string;
  available_at: string ;
  available_until: string ;
}


export interface TimeSlotModel {
  doctor: DoctorModel;
  time:string;
  isBooked: boolean;
}

export interface MyAppointmentModel {
  // id: string;
  // patientId: string;
  doctor: DoctorModel;
  timeSlot: TimeSlotModel;
  status: 'scheduled' | 'completed' | 'canceled';
}