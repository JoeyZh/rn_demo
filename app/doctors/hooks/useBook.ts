// /Volumes/WD-SN5000-2T/code/rn/MedScheduler/app/doctors/hooks/useBook.ts
import { DoctorModel } from "@/app/models/types";
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router'; // 使用 Expo Router 的 useRouter
import { selectDoctor } from '@/app/store/doctorSlice';

// useBook.ts
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store'; // 假设你有根状态类型定义

export const useBook = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const selectedDateStr = useSelector((state: RootState) => state.doctor.selectedDate);

  const gotoDetail = (doctor: DoctorModel) => {
    // 1. 将医生信息存储到 Redux 中
    dispatch(selectDoctor(doctor));

    // 2. 跳转到预约详情页
    router.push('/profiles');
  };

  // 提供一个辅助函数将字符串转换为 Date 对象
  const getSelectedDate = (): Date | null => {
    return selectedDateStr ? new Date(selectedDateStr) : null;
  };

  return { gotoDetail, getSelectedDate };
};