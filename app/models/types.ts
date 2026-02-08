export interface DoctorModel {
  name: string;
  timezone: string;
  day_of_week: string | null;
  available_at: string | null;
  available_until: string | null;
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