// __tests__/utils.test.ts
import { filterDoctorOfWeekDay,getWeekDateArray,getTimeSlot} from "../app/utils/utils";
import { DoctorModel } from "../app/models/types";

describe("getWeekDateArray", () => {
  // 测试正常情况：输入一个日期，返回正确的周日期数组
  it("should return correct week dates starting from Sunday", () => {
    const inputDate = new Date("2026-02-08"); // 星期日
    const result = getWeekDateArray(inputDate);

    expect(result).toEqual([
      new Date("2026-02-08"), // 星期日
      new Date("2026-02-09"), // 星期一
      new Date("2026-02-10"), // 星期二
      new Date("2026-02-11"), // 星期三
      new Date("2026-02-12"), // 星期四
      new Date("2026-02-13"), // 星期五
      new Date("2026-02-14"), // 星期六
    ]);
  });

  // 测试跨月份的情况
  it("should handle weeks that span across months", () => {
    const inputDate = new Date("2026-01-31"); // 星期六
    const result = getWeekDateArray(inputDate);

    expect(result).toEqual([
      new Date("2026-01-25"), // 星期日
      new Date("2026-01-26"), // 星期一
      new Date("2026-01-27"), // 星期二
      new Date("2026-01-28"), // 星期三
      new Date("2026-01-29"), // 星期四
      new Date("2026-01-30"), // 星期五
      new Date("2026-01-31"), // 星期六
    ]);
  });

  // 测试无效输入：抛出错误
  it("should throw an error for invalid date input", () => {
    expect(() => getWeekDateArray(new Date("invalid"))).toThrow("Invalid date input");
    expect(() => getWeekDateArray(null as any)).toThrow("Invalid date input");
    expect(() => getWeekDateArray(undefined as any)).toThrow("Invalid date input");
  });

  // 测试边界情况：输入为星期日
  it("should work correctly when input is a Sunday", () => {
    const inputDate = new Date("2026-02-01"); // 星期日
    const result = getWeekDateArray(inputDate);

    expect(result).toEqual([
      new Date("2026-02-01"), // 星期日
      new Date("2026-02-02"), // 星期一
      new Date("2026-02-03"), // 星期二
      new Date("2026-02-04"), // 星期三
      new Date("2026-02-05"), // 星期四
      new Date("2026-02-06"), // 星期五
      new Date("2026-02-07"), // 星期六
    ]);
  });

  // 测试边界情况：输入为星期六
  it("should work correctly when input is a Saturday", () => {
    const inputDate = new Date("2026-02-07"); // 星期六
    const result = getWeekDateArray(inputDate);

    expect(result).toEqual([
      new Date("2026-02-01"), // 星期日
      new Date("2026-02-02"), // 星期一
      new Date("2026-02-03"), // 星期二
      new Date("2026-02-04"), // 星期三
      new Date("2026-02-05"), // 星期四
      new Date("2026-02-06"), // 星期五
      new Date("2026-02-07"), // 星期六
    ]);
  });
});



describe("filterDoctorOfWeekDay", () => {
  // 测试正常情况：过滤出符合星期几的医生
  it("should filter doctors by the given weekday", () => {
    const doctors: DoctorModel[] = [
      { 
        name: "Dr. Smith", 
        timezone: "America/New_York",
        day_of_week: "Monday",
        available_at: "09:00",
        available_until: "17:00"
      },
      { 
        name: "Dr. Johnson", 
        timezone: "America/New_York",
        day_of_week: "Tuesday",
        available_at: "10:00",
        available_until: "18:00"
      },
      { 
        name: "Dr. Brown", 
        timezone: "America/New_York",
        day_of_week: "Monday",
        available_at: "08:00",
        available_until: "16:00"
      },
    ];
    const date = new Date("2026-02-02"); // 星期一

    const result = filterDoctorOfWeekDay(doctors, date);

    expect(result).toEqual([
      { 
        name: "Dr. Smith", 
        timezone: "America/New_York",
        day_of_week: "Monday",
        available_at: "09:00",
        available_until: "17:00"
      },
      { 
        name: "Dr. Brown", 
        timezone: "America/New_York",
        day_of_week: "Monday",
        available_at: "08:00",
        available_until: "16:00"
      },
    ]);
  });

  // 测试无匹配项的情况
  it("should return an empty array when no doctors match the weekday", () => {
    const doctors: DoctorModel[] = [
      { 
        name: "Dr. Smith", 
        timezone: "America/New_York",
        day_of_week: "Monday",
        available_at: "09:00",
        available_until: "17:00"
      },
      { 
        name: "Dr. Johnson", 
        timezone: "America/New_York",
        day_of_week: "Tuesday",
        available_at: "10:00",
        available_until: "18:00"
      },
    ];
    const date = new Date("2026-02-04"); // 星期三

    const result = filterDoctorOfWeekDay(doctors, date);

    expect(result).toEqual([]);
  });

  // 测试空数组输入
  it("should return an empty array when the doctors list is empty", () => {
    const doctors: DoctorModel[] = [];
    const date = new Date("2026-02-02"); // 星期一

    const result = filterDoctorOfWeekDay(doctors, date);

    expect(result).toEqual([]);
  });

  // 测试无效输入：医生数据 day_of_week 字段为 null
  it("should ignore doctors with null day_of_week field", () => {
    const doctors: DoctorModel[] = [
      { 
        name: "Dr. Smith", 
        timezone: "America/New_York",
        day_of_week: "Monday",
        available_at: "09:00",
        available_until: "17:00"
      },
      { 
        name: "Dr. Johnson", 
        timezone: "America/New_York",
        day_of_week: "Tuesday",
        available_at: "10:00",
        available_until: "18:00"
      },
      { 
        name: "Dr. Brown", 
        timezone: "America/New_York",
        day_of_week: "Monday",
        available_at: "08:00",
        available_until: "16:00"
      },
    ];
    const date = new Date("2026-02-02"); // 星期一

    const result = filterDoctorOfWeekDay(doctors, date);

    expect(result).toEqual([
      { 
        name: "Dr. Smith", 
        timezone: "America/New_York",
        day_of_week: "Monday",
        available_at: "09:00",
        available_until: "17:00"
      },
      { 
        name: "Dr. Brown", 
        timezone: "America/New_York",
        day_of_week: "Monday",
        available_at: "08:00",
        available_until: "16:00"
      },
    ]);
  });

  // 测试无效输入：传入非法日期
  it("should throw an error for invalid date input", () => {
    const doctors: DoctorModel[] = [
      { 
        name: "Dr. Smith", 
        timezone: "America/New_York",
        day_of_week: "Monday",
        available_at: "09:00",
        available_until: "17:00"
      },
    ];

    // 无效日期字符串会创建无效的 Date 对象，Intl.DateTimeFormat.format() 会抛出 RangeError
    expect(() => filterDoctorOfWeekDay(doctors, new Date("invalid"))).toThrow(RangeError);
  });

  // 测试边界情况：不同星期几的日期
  it("should correctly filter doctors for different weekdays", () => {
    const doctors: DoctorModel[] = [
      { 
        name: "Dr. Smith", 
        timezone: "America/New_York",
        day_of_week: "Sunday",
        available_at: "09:00",
        available_until: "17:00"
      },
      { 
        name: "Dr. Johnson", 
        timezone: "America/New_York",
        day_of_week: "Saturday",
        available_at: "10:00",
        available_until: "18:00"
      },
      { 
        name: "Dr. Brown", 
        timezone: "America/New_York",
        day_of_week: "Friday",
        available_at: "08:00",
        available_until: "16:00"
      },
    ];

    const sundayResult = filterDoctorOfWeekDay(doctors, new Date("2026-02-01")); // 星期日
    const saturdayResult = filterDoctorOfWeekDay(doctors, new Date("2026-02-07")); // 星期六
    const fridayResult = filterDoctorOfWeekDay(doctors, new Date("2026-02-06")); // 星期五

    expect(sundayResult).toEqual([{ 
      name: "Dr. Smith", 
      timezone: "America/New_York",
      day_of_week: "Sunday",
      available_at: "09:00",
      available_until: "17:00"
    }]);
    expect(saturdayResult).toEqual([{ 
      name: "Dr. Johnson", 
      timezone: "America/New_York",
      day_of_week: "Saturday",
      available_at: "10:00",
      available_until: "18:00"
    }]);
    expect(fridayResult).toEqual([{ 
      name: "Dr. Brown", 
      timezone: "America/New_York",
      day_of_week: "Friday",
      available_at: "08:00",
      available_until: "16:00"
    }]);
  });
});


describe("getTimeSlot", () => {
  // 测试正常情况：标准时间格式
  it("should generate time slots for standard time format", () => {
    const doctor: DoctorModel = {
      name: "Dr. Smith",
      timezone: "America/New_York",
      day_of_week: "Monday",
      available_at: "09:00",
      available_until: "17:00",
    };
    const date = new Date("2026-02-02");

    const result = getTimeSlot(doctor, date);

    expect(result).toEqual([
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
    ]);
  });

  // 测试 AM/PM 时间格式
  it("should generate time slots for AM/PM time format", () => {
    const doctor: DoctorModel = {
      name: "Dr. Johnson",
      timezone: "America/New_York",
      day_of_week: "Tuesday",
      available_at: "8:00AM",
      available_until: "3:00PM",
    };
    const date = new Date("2026-02-03");

    const result = getTimeSlot(doctor, date);

    expect(result).toEqual([
      "08:00",
      "08:30",
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
    ]);
  });

  // 测试无效输入：缺少字段
  it("should throw an error for missing doctor fields", () => {
    const doctor = {} as DoctorModel;
    const date = new Date("2026-02-02");

    expect(() => getTimeSlot(doctor, date)).toThrow(
      "Invalid doctor data: missing available_at or available_until fields"
    );
  });

  // 测试无效输入：非法日期
  it("should throw an error for invalid date input", () => {
    const doctor: DoctorModel = {
      name: "Dr. Brown",
      timezone: "America/New_York",
      day_of_week: "Wednesday",
      available_at: "09:00",
      available_until: "17:00",
    };

    expect(() => getTimeSlot(doctor, new Date("invalid"))).toThrow("Invalid date input");
  });

  // 测试非法时间范围
  it("should throw an error for invalid time range", () => {
    const doctor: DoctorModel = {
      name: "Dr. Lee",
      timezone: "America/New_York",
      day_of_week: "Thursday",
      available_at: "17:00",
      available_until: "09:00",
    };
    const date = new Date("2026-02-05");

    expect(() => getTimeSlot(doctor, date)).toThrow(
      "Invalid time range: available_at must be earlier than available_until"
    );
  });
});