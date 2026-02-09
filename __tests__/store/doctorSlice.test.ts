// doctorSlice.test.ts
import {
  doctorReducer,
  selectDoctor,
  clearSelectedDoctor,
  selectDate,
  clearSelectedDate,
  bookTimeSlot,
  cancelTimeSlot,
  initBookedTimeSlots,
  setOffline,
} from "../../app/store/doctorSlice";
import { DoctorModel, BookedSlotModel } from "../../app/models/types";

describe("doctorSlice", () => {
  const mockDoctor: DoctorModel = {
    name: "Dr. Smith",
    timezone: "UTC",
    day_of_week: "1,2,3,4,5",
    available_at: "09:00",
    available_until: "17:00",
  };

  const mockBookedSlot: BookedSlotModel = {
    id: "Dr. Smith_2023-10-01_10:00",
    doctorName: "Dr. Smith",
    doctorTimeZone: "UTC",
    date: 1696118400000,
    time: "10:00",
    bookedTime: 1696152000000,
    isBooked: true,
  };

  const initialState = {
    selectedDoctor: null,
    selectedDate: Date.now(),
    bookedTimeSlots: [],
    offline: false,
  };

  describe("initial state", () => {
    test("should return the initial state", () => {
      expect(doctorReducer(undefined, { type: "unknown" })).toEqual(
        initialState
      );
    });
  });

  describe("setOffline", () => {
    test("should set offline status to true", () => {
      const action = setOffline(true);
      const state = doctorReducer(initialState, action);
      expect(state.offline).toBe(true);
    });

    test("should set offline status to false", () => {
      const action = setOffline(false);
      const state = doctorReducer(
        { ...initialState, offline: true },
        action
      );
      expect(state.offline).toBe(false);
    });
  });

  describe("selectDoctor", () => {
    test("should select a doctor", () => {
      const action = selectDoctor(mockDoctor);
      const state = doctorReducer(initialState, action);
      expect(state.selectedDoctor).toEqual(mockDoctor);
    });

    test("should replace the previously selected doctor", () => {
      const anotherDoctor: DoctorModel = {
        name: "Dr. Johnson",
        timezone: "America/New_York",
        day_of_week: "0,1,2,3,4,5,6",
        available_at: "08:00",
        available_until: "18:00",
      };
      const stateWithDoctor = doctorReducer(
        initialState,
        selectDoctor(mockDoctor)
      );
      const state = doctorReducer(stateWithDoctor, selectDoctor(anotherDoctor));
      expect(state.selectedDoctor).toEqual(anotherDoctor);
    });
  });

  describe("clearSelectedDoctor", () => {
    test("should clear the selected doctor", () => {
      const stateWithDoctor = doctorReducer(
        initialState,
        selectDoctor(mockDoctor)
      );
      const action = clearSelectedDoctor();
      const state = doctorReducer(stateWithDoctor, action);
      expect(state.selectedDoctor).toBeNull();
    });
  });

  describe("selectDate", () => {
    test("should select a date", () => {
      const timestamp = 1696118400000;
      const action = selectDate(timestamp);
      const state = doctorReducer(initialState, action);
      expect(state.selectedDate).toBe(timestamp);
    });

    test("should replace the previously selected date", () => {
      const firstTimestamp = 1696118400000;
      const secondTimestamp = 1696204800000;
      const stateWithDate = doctorReducer(
        initialState,
        selectDate(firstTimestamp)
      );
      const state = doctorReducer(stateWithDate, selectDate(secondTimestamp));
      expect(state.selectedDate).toBe(secondTimestamp);
    });
  });

  describe("clearSelectedDate", () => {
    test("should clear the selected date and reset to current time", () => {
      const stateWithDate = doctorReducer(
        initialState,
        selectDate(1696118400000)
      );
      const action = clearSelectedDate();
      const state = doctorReducer(stateWithDate, action);
      expect(state.selectedDate).toBeCloseTo(Date.now(), -4); // Allow some time difference
    });
  });

  describe("initBookedTimeSlots", () => {
    test("should initialize booked time slots", () => {
      const slots: BookedSlotModel[] = [mockBookedSlot];
      const action = initBookedTimeSlots(slots);
      const state = doctorReducer(initialState, action);
      expect(state.bookedTimeSlots).toEqual(slots);
    });

    test("should replace existing booked time slots", () => {
      const existingSlots: BookedSlotModel[] = [mockBookedSlot];
      const newSlots: BookedSlotModel[] = [
        {
          id: "Dr. Johnson_2023-10-02_14:00",
          doctorName: "Dr. Johnson",
          doctorTimeZone: "UTC",
          date: 1696204800000,
          time: "14:00",
          bookedTime: 1696256400000,
          isBooked: true,
        },
      ];
      const stateWithSlots = doctorReducer(
        initialState,
        initBookedTimeSlots(existingSlots)
      );
      const state = doctorReducer(stateWithSlots, initBookedTimeSlots(newSlots));
      expect(state.bookedTimeSlots).toEqual(newSlots);
    });
  });

  describe("bookTimeSlot", () => {
    test("should add a new time slot", () => {
      const dateTime = 1696118400000;
      const time = "10:00";
      const action = bookTimeSlot({
        doctor: mockDoctor,
        dateTime,
        time,
      });
      const state = doctorReducer(initialState, action);
      expect(state.bookedTimeSlots).toHaveLength(1);
      expect(state.bookedTimeSlots[0].doctorName).toBe(mockDoctor.name);
      expect(state.bookedTimeSlots[0].time).toBe(time);
      expect(state.bookedTimeSlots[0].isBooked).toBe(true);
    });

    test("should update an existing time slot", () => {
      const dateTime = 1696118400000;
      const time = "10:00";
      const stateWithSlot = doctorReducer(initialState, bookTimeSlot({
        doctor: mockDoctor,
        dateTime,
        time,
      }));
      
      // Book the same slot again
      const action = bookTimeSlot({
        doctor: mockDoctor,
        dateTime,
        time,
      });
      const state = doctorReducer(stateWithSlot, action);
      
      expect(state.bookedTimeSlots).toHaveLength(1);
      expect(state.bookedTimeSlots[0].isBooked).toBe(true);
    });

    test("should add multiple time slots for different dates", () => {
      const firstDateTime = 1696118400000;
      const secondDateTime = 1696204800000;
      const time = "10:00";
      
      const state = doctorReducer(
        doctorReducer(
          initialState,
          bookTimeSlot({ doctor: mockDoctor, dateTime: firstDateTime, time })
        ),
        bookTimeSlot({ doctor: mockDoctor, dateTime: secondDateTime, time })
      );
      
      expect(state.bookedTimeSlots).toHaveLength(2);
    });

    test("should add multiple time slots for different doctors", () => {
      const anotherDoctor: DoctorModel = {
        name: "Dr. Johnson",
        timezone: "America/New_York",
        day_of_week: "0,1,2,3,4,5,6",
        available_at: "08:00",
        available_until: "18:00",
      };
      const dateTime = 1696118400000;
      const time = "10:00";
      
      const state = doctorReducer(
        doctorReducer(
          initialState,
          bookTimeSlot({ doctor: mockDoctor, dateTime, time })
        ),
        bookTimeSlot({ doctor: anotherDoctor, dateTime, time })
      );
      
      expect(state.bookedTimeSlots).toHaveLength(2);
      expect(state.bookedTimeSlots[0].doctorName).toBe(mockDoctor.name);
      expect(state.bookedTimeSlots[1].doctorName).toBe(anotherDoctor.name);
    });
  });

  describe("cancelTimeSlot", () => {
    test("should cancel a booked time slot", () => {
      const stateWithSlot = doctorReducer(
        initialState,
        bookTimeSlot({
          doctor: mockDoctor,
          dateTime: 1696118400000,
          time: "10:00",
        })
      );
      
      const slotId = stateWithSlot.bookedTimeSlots[0].id;
      if (slotId) {
        const action = cancelTimeSlot({ id: slotId });
        const state = doctorReducer(stateWithSlot, action);
        
        expect(state.bookedTimeSlots[0].isBooked).toBe(false);
      }
    });

    test("should not modify state if slot id does not exist", () => {
      const stateWithSlot = doctorReducer(
        initialState,
        bookTimeSlot({
          doctor: mockDoctor,
          dateTime: 1696118400000,
          time: "10:00",
        })
      );
      
      const action = cancelTimeSlot({ id: "non-existent-id" });
      const state = doctorReducer(stateWithSlot, action);
      
      expect(state.bookedTimeSlots[0].isBooked).toBe(true);
    });

    test("should handle cancelling from multiple slots", () => {
      const anotherDoctor: DoctorModel = {
        name: "Dr. Johnson",
        timezone: "America/New_York",
        day_of_week: "0,1,2,3,4,5,6",
        available_at: "08:00",
        available_until: "18:00",
      };
      
      const stateWithSlots = doctorReducer(
        doctorReducer(
          initialState,
          bookTimeSlot({
            doctor: mockDoctor,
            dateTime: 1696118400000,
            time: "10:00",
          })
        ),
        bookTimeSlot({
          doctor: anotherDoctor,
          dateTime: 1696204800000,
          time: "14:00",
        })
      );
      
      const firstSlotId = stateWithSlots.bookedTimeSlots[0].id;
      if (firstSlotId) {
        const action = cancelTimeSlot({ id: firstSlotId });
        const state = doctorReducer(stateWithSlots, action);
        
        expect(state.bookedTimeSlots[0].isBooked).toBe(false);
        expect(state.bookedTimeSlots[1].isBooked).toBe(true);
      }
    });
  });

  describe("complex workflows", () => {
    test("should handle complete booking and cancellation workflow", () => {
      // Book a slot
      let state = doctorReducer(initialState, bookTimeSlot({
        doctor: mockDoctor,
        dateTime: 1696118400000,
        time: "10:00",
      }));
      
      expect(state.bookedTimeSlots[0].isBooked).toBe(true);
      
      // Cancel the slot
      const slotId = state.bookedTimeSlots[0].id;
      if (slotId) {
        state = doctorReducer(state, cancelTimeSlot({ id: slotId }));
        
        expect(state.bookedTimeSlots[0].isBooked).toBe(false);
        
        // Book again
        state = doctorReducer(state, bookTimeSlot({
          doctor: mockDoctor,
          dateTime: 1696118400000,
          time: "10:00",
        }));
        
        expect(state.bookedTimeSlots[0].isBooked).toBe(true);
      }
    });

    test("should handle selecting doctor and date together", () => {
      let state = doctorReducer(initialState, selectDoctor(mockDoctor));
      expect(state.selectedDoctor).toEqual(mockDoctor);
      
      state = doctorReducer(state, selectDate(1696118400000));
      expect(state.selectedDate).toBe(1696118400000);
      
      state = doctorReducer(state, bookTimeSlot({
        doctor: mockDoctor,
        dateTime: 1696118400000,
        time: "10:00",
      }));
      
      expect(state.bookedTimeSlots).toHaveLength(1);
      expect(state.bookedTimeSlots[0].isBooked).toBe(true);
    });
  });
});
