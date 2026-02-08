  import { useState, useEffect, useCallback } from "react";
    import { DoctorModel } from '../../models/types'; // 导入 DoctorModel 类型
  export const useDoctorList = () => {
    const [doctors, setDoctors] = useState<DoctorModel[]>([]);

    const fetchDoctors = useCallback(async () => {
      try {
        const response = await fetch('/api/doctors');
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    }, []);
    

    useEffect(() => {
      fetchDoctors();
    }, []);
  
    return { doctors };
  };