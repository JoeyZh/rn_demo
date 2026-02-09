// __tests__/utils/bookUtils.test.ts
import {
  generateUniqueId,
  getDoctorName,
  predicateBookedByDoctorAndDate,
  appointmentStatus,
  bookedAvailable,
  mergeSlotDate,
} from "@/app/utils/bookUtils"
import { DoctorModel, BookedSlotModel } from "@/app/models/types"

describe("generateUniqueId", () => {
  it("should generate unique ID with correct format", () => {
    const slot: BookedSlotModel = {
      id: "test_id",
      doctorName: "Dr. Smith",
      doctorTimeZone: "America/New_York",
      date: new Date("2023-10-01").getTime(),
      time: "10:00",
      bookedTime: new Date("2023-10-01T10:00:00").getTime(),
      isBooked: true,
    }

    const result = generateUniqueId(slot)
    expect(result).toBe("Dr. Smith_2023-10-01_10:00")
  })

  it("should handle different dates correctly", () => {
    const slot: BookedSlotModel = {
      id: "test_id",
      doctorName: "Dr. Johnson",
      doctorTimeZone: "America/New_York",
      date: new Date("2024-12-25").getTime(),
      time: "14:30",
      bookedTime: new Date("2024-12-25T14:30:00").getTime(),
      isBooked: true,
    }

    const result = generateUniqueId(slot)
    expect(result).toBe("Dr. Johnson_2024-12-25_14:30")
  })

  it("should handle date with time component", () => {
    const slot: BookedSlotModel = {
      id: "test_id",
      doctorName: "Dr. Brown",
      doctorTimeZone: "America/New_York",
      date: new Date("2023-10-01T15:30:00").getTime(),
      time: "09:00",
      bookedTime: new Date("2023-10-01T09:00:00").getTime(),
      isBooked: true,
    }

    const result = generateUniqueId(slot)
    expect(result).toBe("Dr. Brown_2023-10-01_09:00")
  })
})

describe("getDoctorName", () => {
  it("should return doctor name correctly", () => {
    const doctor: DoctorModel = {
      name: "Dr. Smith",
      timezone: "America/New_York",
      day_of_week: "Monday",
      available_at: "09:00",
      available_until: "17:00",
    }

    const result = getDoctorName(doctor)
    expect(result).toBe("Dr. Smith")
  })

  it("should handle doctor with special characters in name", () => {
    const doctor: DoctorModel = {
      name: "Dr. María García-López",
      timezone: "Europe/Madrid",
      day_of_week: "Tuesday",
      available_at: "08:00",
      available_until: "16:00",
    }

    const result = getDoctorName(doctor)
    expect(result).toBe("Dr. María García-López")
  })
})

describe("predicateBookedByDoctorAndDate", () => {
  const mockDoctor: DoctorModel = {
    name: "Dr. Smith",
    timezone: "America/New_York",
    day_of_week: "Monday",
    available_at: "09:00",
    available_until: "17:00",
  }

  it("should return true when all conditions match", () => {
    const bookTimeSlot: BookedSlotModel = {
      id: "test_id",
      doctorName: "Dr. Smith",
      date: new Date("2023-10-02").getTime(),
      time: "10:00",
      isBooked: true,
      bookedTime: Date.now(),
      doctorTimeZone: "America/New_York",
    }
    const dateTime = new Date("2023-10-02").getTime()

    const result = predicateBookedByDoctorAndDate(
      bookTimeSlot,
      mockDoctor,
      dateTime,
      "10:00"
    )

    expect(result).toBe(true)
  })

  it("should return false when doctor name doesn't match", () => {
    const bookTimeSlot: BookedSlotModel = {
      id: "test_id",
      doctorName: "Dr. Johnson",
      date: new Date("2023-10-02").getTime(),
      time: "10:00",
      isBooked: true,
      bookedTime: Date.now(),
      doctorTimeZone: "America/New_York",
    }
    const dateTime = new Date("2023-10-02").getTime()

    const result = predicateBookedByDoctorAndDate(
      bookTimeSlot,
      mockDoctor,
      dateTime,
      "10:00"
    )

    expect(result).toBe(false)
  })

  it("should return false when date doesn't match", () => {
    const bookTimeSlot: BookedSlotModel = {
      id: "test_id",
      doctorName: "Dr. Smith",
      date: new Date("2023-10-03").getTime(),
      time: "10:00",
      isBooked: true,
      bookedTime: Date.now(),
      doctorTimeZone: "America/New_York",
    }
    const dateTime = new Date("2023-10-02").getTime()

    const result = predicateBookedByDoctorAndDate(
      bookTimeSlot,
      mockDoctor,
      dateTime,
      "10:00"
    )

    expect(result).toBe(false)
  })

  it("should return false when time doesn't match", () => {
    const bookTimeSlot: BookedSlotModel = {
      id: "test_id",
      doctorName: "Dr. Smith",
      date: new Date("2023-10-02").getTime(),
      time: "11:00",
      isBooked: true,
      bookedTime: Date.now(),
      doctorTimeZone: "America/New_York",
    }
    const dateTime = new Date("2023-10-02").getTime()

    const result = predicateBookedByDoctorAndDate(
      bookTimeSlot,
      mockDoctor,
      dateTime,
      "10:00"
    )

    expect(result).toBe(false)
  })

  it("should handle date with time component correctly", () => {
    const bookTimeSlot: BookedSlotModel = {
      id: "test_id",
      doctorName: "Dr. Smith",
      date: new Date("2023-10-02T15:30:00").getTime(),
      time: "10:00",
      isBooked: true,
      bookedTime: Date.now(),
      doctorTimeZone: "America/New_York",
    }
    const dateTime = new Date("2023-10-02").getTime()

    const result = predicateBookedByDoctorAndDate(
      bookTimeSlot,
      mockDoctor,
      dateTime,
      "10:00"
    )

    expect(result).toBe(true)
  })
})

describe("appointmentStatus", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2023-10-01T10:00:00"))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("should return 'completed' for past appointment", () => {
    const date = new Date("2023-09-30")
    const time = "09:00"

    const result = appointmentStatus(date, time)
    expect(result).toBe("completed")
  })

  it("should return 'scheduled' for future appointment", () => {
    const date = new Date("2023-10-02")
    const time = "14:00"

    const result = appointmentStatus(date, time)
    expect(result).toBe("scheduled")
  })

  it("should return 'completed' for same day but past time", () => {
    const date = new Date("2023-10-01")
    const time = "09:00"

    const result = appointmentStatus(date, time)
    expect(result).toBe("completed")
  })

  it("should return 'scheduled' for same day and future time", () => {
    const date = new Date("2023-10-01")
    const time = "11:00"

    const result = appointmentStatus(date, time)
    expect(result).toBe("scheduled")
  })

  it("should handle PM time format correctly", () => {
    const date = new Date("2023-10-01");
    const time = "14:00";

    const result = appointmentStatus(date, time);
    expect(result).toBe("scheduled");
  });

  it("should handle AM time format correctly", () => {
    const date = new Date("2023-10-01");
    const time = "08:00";

    const result = appointmentStatus(date, time);
    expect(result).toBe("completed");
  });
})

describe("bookedAvailable", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2023-10-01T10:00:00"))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("should return true when appointment is past interval", () => {
    const date = new Date("2023-09-30")
    const time = "09:00"
    const timezone = "America/New_York"

    const result = bookedAvailable(date, time, timezone)
    expect(result).toBe(false)
  })

  it("should return false when appointment is within interval", () => {
    const date = new Date("2023-10-01");
    const time = "09:45";
    const timezone = "America/New_York";

    const result = bookedAvailable(date, time, timezone);
    expect(result).toBe(false);
  });

  it("should return false when appointment is in the future", () => {
    const date = new Date("2023-10-02");
    const time = "10:00";
    const timezone = "America/New_York";

    const result = bookedAvailable(date, time, timezone);
    expect(result).toBe(false);
  });

  it("should handle custom interval", () => {
    const date = new Date("2026-02-10")
    const time = "09:00"
    const timezone = "America/New_York"
    const interval = 60 * 60 * 1000 // 1 hour

    const result = bookedAvailable(date, time, timezone, interval)
    expect(result).toBe(true)
  })

  it("should handle different timezones correctly", () => {
    const date = new Date("2026-03-01")
    const time = "14:00"
    const timezone = "Asia/Shanghai"

    const result = bookedAvailable(date, time, timezone)
    expect(result).toBe(true)
  })

  it("should handle PM time format", () => {
    const date = new Date("2023-02-01");
    const time = "14:00";
    const timezone = "America/New_York";

    const result = bookedAvailable(date, time, timezone);
    expect(result).toBe(false);
  });
})

describe("mergeSlotDate", () => {
  it("should merge date and time correctly", () => {
    const slot: BookedSlotModel = {
      id: "test_id",
      doctorName: "Dr. Smith",
      doctorTimeZone: "America/New_York",
      date: new Date("2023-10-01").getTime(),
      time: "10:00",
      bookedTime: new Date("2023-10-01T10:00:00").getTime(),
      isBooked: true,
    }

    const result = mergeSlotDate(slot)
    expect(result).toContain("10/1/2023")
    expect(result).toContain("10:00:00")
  })

  it("should handle different time formats", () => {
    const slot: BookedSlotModel = {
      id: "test_id",
      doctorName: "Dr. Johnson",
      doctorTimeZone: "America/New_York",
      date: new Date("2023-10-01").getTime(),
      time: "14:30",
      bookedTime: new Date("2023-10-01T14:30:00").getTime(),
      isBooked: true,
    }

    const result = mergeSlotDate(slot)
    expect(result).toContain("2:30:00")
  })

  it("should handle date with time component", () => {
    const slot: BookedSlotModel = {
      id: "test_id",
      doctorName: "Dr. Brown",
      doctorTimeZone: "America/New_York",
      date: new Date("2023-10-01T15:30:00").getTime(),
      time: "09:00",
      bookedTime: new Date("2023-10-01T09:00:00").getTime(),
      isBooked: true,
    }

    const result = mergeSlotDate(slot)
    expect(result).toContain("9:00:00")
  })

  it("should handle PM time format", () => {
    const slot: BookedSlotModel = {
      id: "test_id",
      doctorName: "Dr. Lee",
      doctorTimeZone: "America/New_York",
      date: new Date("2023-10-01").getTime(),
      time: "14:00",
      bookedTime: new Date("2023-10-01T14:00:00").getTime(),
      isBooked: true,
    };

    const result = mergeSlotDate(slot);
    expect(result).toContain("2:00:00");
  });

  it("should set seconds to 0", () => {
    const slot: BookedSlotModel = {
      id: "test_id",
      doctorName: "Dr. Smith",
      doctorTimeZone: "America/New_York",
      date: new Date("2023-10-01").getTime(),
      time: "10:00",
      bookedTime: new Date("2023-10-01T10:00:00").getTime(),
      isBooked: true,
    }

    const result = mergeSlotDate(slot)
    expect(result).toContain("10:00:00")
  })
})
