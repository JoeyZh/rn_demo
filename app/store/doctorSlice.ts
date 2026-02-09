// /Volumes/WD-SN5000-2T/code/rn/MedScheduler/app/store/doctorSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DoctorModel, BookedSlotModel } from "../models/types"
import { equalsIgnoreTime } from "@/app/utils/utils"
import { generateUniqueId } from "../utils/bookUtils"

interface DoctorState {
  selectedDoctor: DoctorModel | null
  selectedDate: number // 新增：选中的日期 时间戳
  bookedTimeSlots: BookedSlotModel[] // 医生姓名 -> 日期 -> 时间槽数组
}

const initialState: DoctorState = {
  selectedDoctor: null,
  selectedDate: Date.now(), // 初始化：当前时间戳
  // 改成通过 doctorsAsyncStorates 获取，初始值为空数组
  bookedTimeSlots: [],
}

export const doctorSlice = createSlice({
  name: "doctor",
  initialState,
  reducers: {
    // 选择医生
    selectDoctor: (state, action: PayloadAction<DoctorModel>) => {
      state.selectedDoctor = action.payload
    },

    // 清空选中的医生
    clearSelectedDoctor: (state) => {
      state.selectedDoctor = null
    },

    // 选择日期
    selectDate: (state, action: PayloadAction<number>) => {
      state.selectedDate = action.payload // 存储为时间戳
    },

    // 清空选中的日期
    clearSelectedDate: (state) => {
      state.selectedDate = Date.now() // 重置为当前时间戳
    },


    initBookedTimeSlots: (state, action: PayloadAction<BookedSlotModel[]>) => {
      state.bookedTimeSlots = action.payload
    },
    // 预约时间槽
    bookTimeSlot: (
      state,
      action: PayloadAction<{
        doctor: DoctorModel
        dateTime: number
        time: string
      }>,
    ) => {
      const { doctor,   dateTime, time } = action.payload
      const {name,timezone} = doctor
      const date = new Date(dateTime)

      // 检查是否已存在该时间槽
      const existingIndex = state.bookedTimeSlots.findIndex(
        (booked) =>
          booked.doctorName === name &&
          equalsIgnoreTime(new Date(booked.date), new Date(date)) &&
          booked.time === time,
      )

      if (existingIndex >= 0) {
        console.log("已存在该时间槽",existingIndex)
                // 更新createTime为当前时间
        const item = state.bookedTimeSlots[existingIndex]
        state.bookedTimeSlots[existingIndex]= {
          ...item,
          isBooked: true,
          time,
          bookedTime: Date.now(),
        }
        return
      } else {
        const newSlot: BookedSlotModel = {
          doctorName:name,
          doctorTimeZone: timezone,
          date:dateTime,
          time,
          isBooked: true,
          bookedTime: Date.now(),
        }
        const newId = generateUniqueId(newSlot)
        // 添加新的时间槽
        state.bookedTimeSlots.push({ ...newSlot, id: newId })
      }
    },

    // 取消预约
    cancelTimeSlot: (
      state,
      action: PayloadAction<{
        id: string
      }>,
    ) => {
      const { id } = action.payload

      // 确保医生和日期的预约记录存在
      const timeSlotIndex = state.bookedTimeSlots.findIndex(
        (slot) => slot.id === id,
      )

      if (timeSlotIndex >= 0) {
        // 标记为未预约
        state.bookedTimeSlots[timeSlotIndex].isBooked = false}
    },
  },
})

export const {
  selectDoctor,
  clearSelectedDoctor,
  selectDate,
  clearSelectedDate,
  bookTimeSlot,
  cancelTimeSlot,
  initBookedTimeSlots,
} = doctorSlice.actions
export const doctorReducer = doctorSlice.reducer
