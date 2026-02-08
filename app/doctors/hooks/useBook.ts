// /Volumes/WD-SN5000-2T/code/rn/MedScheduler/app/doctors/hooks/useBook.ts
import { DoctorModel } from "@/app/models/types";
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router'; // 使用 Expo Router 的 useRouter
import { selectDoctor } from '@/app/store/doctorSlice';

export const useBook = () => {
  const dispatch = useDispatch();
  const router = useRouter(); // 获取路由对象

  const gotoDetail = (doctor: DoctorModel) => {
    // 1. 将医生信息存储到 Redux 中
    dispatch(selectDoctor(doctor));

    // 2. 跳转到预约详情页
    router.push('/appointment'); // 使用 Expo Router 的 push 方法
  };

  return { gotoDetail };
};