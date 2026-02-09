
import { DoctorModel } from "@/app/models/types";
import { doctorList } from "@/app/services/myServices";
export const listDoctors = async (): Promise<DoctorModel[]> => {
  const doctors = await doctorList();
  return doctors;
};

