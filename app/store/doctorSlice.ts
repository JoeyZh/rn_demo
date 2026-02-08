// /Volumes/WD-SN5000-2T/code/rn/MedScheduler/app/store/doctorSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DoctorModel } from '../models/types';

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface DoctorState {
  selectedDoctor: DoctorModel | null;
  selectedDate: Date | null; // 新增：选中的日期
  bookedTimeSlots: Record<string, Record<string, TimeSlot[]>>; // 医生姓名 -> 日期 -> 时间槽数组
}

const initialState: DoctorState = {
  selectedDoctor: null,
  selectedDate: null, // 初始化：null
  bookedTimeSlots: {},
};

export const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    // 选择医生
    selectDoctor: (state, action: PayloadAction<DoctorModel>) => {
      state.selectedDoctor = action.payload;
    },
    
    // 清空选中的医生
    clearSelectedDoctor: (state) => {
      state.selectedDoctor = null;
    },
    
    // 选择日期
    selectDate: (state, action: PayloadAction<Date>) => {
      state.selectedDate = action.payload;
    },
    
    // 清空选中的日期
    clearSelectedDate: (state) => {
      state.selectedDate = null;
    },
    
    // 预约时间槽
    bookTimeSlot: (state, action: PayloadAction<{
      doctorName: string;
      date: string;
      timeSlot: TimeSlot;
    }>) => {
      const { doctorName, date, timeSlot } = action.payload;
      
      // 确保医生的预约记录存在
      if (!state.bookedTimeSlots[doctorName]) {
        state.bookedTimeSlots[doctorName] = {};
      }
      
      // 确保日期的预约记录存在
      if (!state.bookedTimeSlots[doctorName][date]) {
        state.bookedTimeSlots[doctorName][date] = [];
      }
      
      // 检查是否已存在该时间槽
      const existingIndex = state.bookedTimeSlots[doctorName][date].findIndex(
        (slot) => slot.id === timeSlot.id
      );
      
      if (existingIndex >= 0) {
        // 更新已存在的时间槽
        state.bookedTimeSlots[doctorName][date][existingIndex] = {
          ...timeSlot,
          isBooked: true,
        };
      } else {
        // 添加新的时间槽
        state.bookedTimeSlots[doctorName][date].push({
          ...timeSlot,
          isBooked: true,
        });
      }
    },
    
    // 取消预约
    cancelTimeSlot: (state, action: PayloadAction<{
      doctorName: string;
      date: string;
      timeSlotId: string;
    }>) => {
      const { doctorName, date, timeSlotId } = action.payload;
      
      // 确保医生和日期的预约记录存在
      if (state.bookedTimeSlots[doctorName] && state.bookedTimeSlots[doctorName][date]) {
        const timeSlotIndex = state.bookedTimeSlots[doctorName][date].findIndex(
          (slot) => slot.id === timeSlotId
        );
        
        if (timeSlotIndex >= 0) {
          // 标记为未预约
          state.bookedTimeSlots[doctorName][date][timeSlotIndex].isBooked = false;
        }
      }
    },
  },
});

export const { selectDoctor, clearSelectedDoctor, selectDate, clearSelectedDate, bookTimeSlot, cancelTimeSlot } = doctorSlice.actions;
export const doctorReducer = doctorSlice.reducer;
