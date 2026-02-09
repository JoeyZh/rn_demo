// doctorsAsyncStorages.test.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setOffline,
  getOffline,
  initTable,
  addAllRow,
  queryRows,
  clearTable,
} from "../../app/store/doctorsAsyncStorages";
import { DoctorModel } from "../../app/models/types";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe("doctorsAsyncStorages", () => {
  const mockDoctors: DoctorModel[] = [
    {
      name: "Dr. Smith",
      timezone: "UTC",
      day_of_week: "1,2,3,4,5",
      available_at: "09:00",
      available_until: "17:00",
    },
    {
      name: "Dr. Johnson",
      timezone: "America/New_York",
      day_of_week: "0,1,2,3,4,5,6",
      available_at: "08:00",
      available_until: "18:00",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("setOffline", () => {
    test("should set offline status to true", async () => {
      await setOffline(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "OFFLINE_KEY",
        JSON.stringify(true)
      );
    });

    test("should set offline status to false", async () => {
      await setOffline(false);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "OFFLINE_KEY",
        JSON.stringify(false)
      );
    });

    test("should handle errors when setting offline status", async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
        new Error("Storage error")
      );
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      await setOffline(true);
      expect(consoleSpy).toHaveBeenCalledWith(
        "设置离线状态失败：",
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });
  });

  describe("getOffline", () => {
    test("should return true when offline status is true", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(true)
      );
      const result = await getOffline();
      expect(result).toBe(true);
    });

    test("should return false when offline status is false", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(false)
      );
      const result = await getOffline();
      expect(result).toBe(false);
    });

    test("should return false when offline status is not set", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      const result = await getOffline();
      expect(result).toBe(false);
    });

    test("should handle errors when getting offline status", async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
        new Error("Storage error")
      );
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const result = await getOffline();
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        "获取离线状态失败：",
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });
  });

  describe("initTable", () => {
    test("should initialize table if it does not exist", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      await initTable();
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "DOCTORS_TABLE",
        JSON.stringify([])
      );
    });

    test("should not initialize table if it already exists", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockDoctors)
      );
      await initTable();
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });

    test("should handle errors when initializing table", async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
        new Error("Storage error")
      );
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      await initTable();
      expect(consoleSpy).toHaveBeenCalledWith(
        "初始化表格失败：",
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });
  });

  describe("addAllRow", () => {
    test("should add all rows successfully", async () => {
      const result = await addAllRow(mockDoctors);
      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "DOCTORS_TABLE",
        JSON.stringify(mockDoctors)
      );
    });

    test("should handle errors when adding rows", async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
        new Error("Storage error")
      );
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const result = await addAllRow(mockDoctors);
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        "新增行失败：",
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });
  });

  describe("queryRows", () => {
    test("should return all rows from the table", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify(mockDoctors)
      );
      const result = await queryRows();
      expect(result).toEqual(mockDoctors);
    });

    test("should return an empty array if the table is empty", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
        JSON.stringify([])
      );
      const result = await queryRows();
      expect(result).toEqual([]);
    });

    test("should return an empty array if table data is null", async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
      const result = await queryRows();
      expect(result).toEqual([]);
    });

    test("should handle errors when querying rows", async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
        new Error("Storage error")
      );
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const result = await queryRows();
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalledWith(
        "查询表格失败：",
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });
  });

  describe("clearTable", () => {
    test("should clear the table", async () => {
      const result = await clearTable();
      expect(result).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "DOCTORS_TABLE",
        JSON.stringify([])
      );
    });

    test("should handle errors when clearing table", async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
        new Error("Storage error")
      );
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const result = await clearTable();
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        "清空表格失败：",
        expect.any(Error)
      );
      consoleSpy.mockRestore();
    });
  });
});
