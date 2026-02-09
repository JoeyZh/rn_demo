// bookAsyncStorages.test.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  initTable,
  addRow,
  getAllRows,
  queryRows,
  deleteRow,
  clearTable,
} from "@/app/store/bookAsyncStorages";
import { BookedSlotModel } from "@/app/models/types";

// Mock AsyncStorage  
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe("bookAsyncStorages", () => {
  const mockTableKey = "BOOKED_SLOTS_TABLE";
  const mockData: BookedSlotModel[] = [
    {
      id: "Dr. Smith_2023-10-01_10:00", // 使用 generateUniqueId 生成的 ID
      doctorName: "Dr. Smith",
      doctorTimeZone: "UTC",
      date: 1696118400000, // 2023-10-01 00:00:00 UTC
      time: "10:00",
      bookedTime: 1696152000000, // 2023-10-01 10:00:00 UTC
      isBooked: true,
    },
    {
      id: "Dr. Johnson_2023-10-02_14:00", // 使用 generateUniqueId 生成的 ID
      doctorName: "Dr. Johnson",
      doctorTimeZone: "UTC",
      date: 1696204800000, // 2023-10-02 00:00:00 UTC
      time: "14:00",
      bookedTime: 1696256400000, // 2023-10-02 14:00:00 UTC
      isBooked: true,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("initTable", () => {
    test("should initialize table if it does not exist", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      await initTable();
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        mockTableKey,
        JSON.stringify([])
      );
    });

    test("should not initialize table if it already exists", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockData)
      );
      await initTable();
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe("addRow", () => {
    test("should add a new row successfully", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockData)
      );
      const newRow: BookedSlotModel = {
        id: "3",
        doctorName: "Dr. Brown",
        doctorTimeZone: "UTC",
        date: 1696291200000, // 2023-10-03 00:00:00 UTC
        time: "12:00",
        bookedTime: 1696339200000, // 2023-10-03 11:00:00 UTC
        isBooked: true,
      };
      const result = await addRow(newRow);
      // addRow 返回生成的 ID 字符串
      expect(result).toBe("Dr. Brown_2023-10-03_12:00");
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        mockTableKey,
        JSON.stringify([...mockData, { ...newRow, id: "Dr. Brown_2023-10-03_12:00" }])
      );
    });

    test("should not add a row if the generated id already exists", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockData)
      );
      // 创建一个会生成与 mockData 中第一个记录相同 ID 的记录
      const duplicateRow: BookedSlotModel = {
        id: "any-id",
        doctorName: "Dr. Smith",
        doctorTimeZone: "UTC",
        date: 1696118400000, // 2023-10-01 00:00:00 UTC
        time: "10:00",
        bookedTime: 1696152000000, // 2023-10-01 10:00:00 UTC
        isBooked: true,
      };
      const result = await addRow(duplicateRow);
      // 生成的 ID "Dr. Smith_2023-10-01_10:00" 已存在于 mockData 中
      expect(result).toBe(false);
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe("getAllRows", () => {
    test("should return all rows from the table", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockData)
      );
      const result = await getAllRows();
      expect(result).toEqual(mockData);
    });

    test("should return an empty array if the table is empty", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify([])
      );
      const result = await getAllRows();
      expect(result).toEqual([]);
    });
  });

  describe("queryRows", () => {
    test("should return filtered rows based on the filter function", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockData)
      );
      const filterFn = (item: any) =>
        item.doctorName === "Dr. Smith";
      const result = await queryRows(filterFn);
      expect(result).toEqual([mockData[0]]);
    });
  });

  describe("deleteRow", () => {
    test("should delete a row by id", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockData)
      );
      const result = await deleteRow("Dr. Smith_2023-10-01_10:00");
      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        mockTableKey,
        JSON.stringify([mockData[1]])
      );
    });

    test("should not delete anything if the id does not exist", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockData)
      );
      const result = await deleteRow("non-existent-id");
      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        mockTableKey,
        JSON.stringify(mockData)
      );
    });
  });

  describe("clearTable", () => {
    test("should clear the table", async () => {
      const result = await clearTable();
      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        mockTableKey,
        JSON.stringify([])
      );
    });
  });
});