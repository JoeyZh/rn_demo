// /Volumes/WD-SN5000-2T/code/rn/MedScheduler/app/store/index.ts

import { configureStore } from '@reduxjs/toolkit';
import { doctorReducer } from './doctorSlice';

export const store = configureStore({
  reducer: {
    doctor: doctorReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {doctor: DoctorState}
export type AppDispatch = typeof store.dispatch;
