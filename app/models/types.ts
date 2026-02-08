export interface DoctorModel {
  name: string;
  timezone: string;
  day_of_week: string;
  available_at: string ;
  available_until: string ;
}


export interface AvailableTimeSlot {
  doctorId: string;
  start: Date;
  end: Date;
  isBooked: boolean;
}

export interface MyAppointment {
  id: string;
  patientId: string;
  doctorId: string;
  timeSlot: AvailableTimeSlot;
  status: 'scheduled' | 'completed' | 'canceled';
}