
import { DoctorModel } from "@/app/models/types";
export const listDoctors = async (): Promise<DoctorModel[]> => {
  const response = await fetch('https://raw.githubusercontent.com/suyogshiftcare/jsontest/main/available.json');
  if (!response.ok) {
    throw new Error('Failed to fetch doctors');
  }
  const doctors = await response.json();
  console.log('Fetched doctors:', doctors);
  return doctors;
};