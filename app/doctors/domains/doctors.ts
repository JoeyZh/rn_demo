import { DoctorModel } from "@/app/models/types"
import { doctorList } from "@/app/services/myServices"
export const listDoctors = async (): Promise<DoctorModel[]> => {
  console.log("listDoctors")
  const doctors = await doctorList()
  console.log("listDoctors ok")

  return doctors
}
