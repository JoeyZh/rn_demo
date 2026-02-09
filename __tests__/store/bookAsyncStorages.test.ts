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
import { generateUniqueId } from "@/app/utils/bookUtils";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe("bookAsyncStorages", () => {
  const mockTableKey = "BOOKED_SLOTS_TABLE";
  // 使用字符串格式的日期，因为 JSON.parse 会将 Date 对象转换为字符串
  const mockData = [
    {
      id: "1",
      doctorName: "Dr. Smith",
      date: "2023-10-01T00:00:00.000Z",
      time: "10:00",
      createTime: "2023-10-01T09:00:00.000Z",
      userId: 1,
    },
    {
      id: "2",
      doctorName: "Dr. Jones",
      date: "2023-10-02T00:00:00.000Z",
      time: "11:00",
      createTime: "2023-10-02T10:00:00.000Z",
      userId: 1,
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
        date: new Date("2023-10-03"),
        time: "12:00",
        createTime: new Date("2023-10-03T11:00:00Z"),
        userId: 1,
      };
      const result = await addRow(newRow);
      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        mockTableKey,
        JSON.stringify([...mockData, { ...newRow, date: expect.any(String), createTime: expect.any(String) }])
      );
    });

    test("should not add a row if the id already exists", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockData)
      );
      const duplicateRow: BookedSlotModel = {
        id: "1",
        doctorName: "Dr. Smith",
        date: new Date("2023-10-01"),
        time: "10:00",
        createTime: new Date("2023-10-01T09:00:00Z"),
        userId: 1,
      };
      const result = await addRow(duplicateRow);
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
      const result = await deleteRow("1");
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
      const result = await deleteRow("999");
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