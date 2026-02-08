
import { DoctorModel } from "@/app/models/types";
export const listDoctors = async (): Promise<DoctorModel[]> => {
  const response = await fetch('/api/doctors');
  if (!response.ok) {
    throw new Error('Failed to fetch doctors');
  }
  return response.json();
};


export const getAvailableSlots = async (doctorId: string): Promise<string[]> => {
  const response = await fetch(`/api/doctors/${doctorId}/slots`);
  if (!response.ok) {
    throw new Error('Failed to fetch available slots');
  }
  return response.json();
};
