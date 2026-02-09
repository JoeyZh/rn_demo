import AsyncStorage from "@react-native-async-storage/async-storage"
import { DoctorModel } from "../models/types"

const DOCTORS_TABLE_KEY = "DOCTORS_TABLE"

export type filterFn = (item: DoctorModel) => boolean
/**
 * 初始化表格（若不存在则创建空数组）
 */
export const initTable = async () => {
  try {
    const existingData = await AsyncStorage.getItem(DOCTORS_TABLE_KEY)
    if (!existingData) {
      // 空表格 = 空数组
      await AsyncStorage.setItem(DOCTORS_TABLE_KEY, JSON.stringify([]))
    }
  } catch (error) {
    console.error("初始化表格失败：", error)
  }
}

/**
 * 新增行（插入表格记录）
 * @param {Object} row - 单行数据（必须包含 id 主键）
 */
export const addAllRow = async (row: DoctorModel[]) => {
  try {
    // 1. 读取现有表格数据（数组），并显式指定类型
    const tableData: DoctorModel[] = JSON.parse(
      (await AsyncStorage.getItem(DOCTORS_TABLE_KEY)) || "[]",
    )
    // 4. 存回 AsyncStorage
    await AsyncStorage.setItem(DOCTORS_TABLE_KEY, JSON.stringify(tableData))
    return true
  } catch (error) {
    console.error("新增行失败：", error)
    return false
  }
}

/**
 * 查询表格所有行（读取整张表）
 */
export const queryRows = async (): Promise<DoctorModel[]> => {
  try {
    const tableData = JSON.parse(
      (await AsyncStorage.getItem(DOCTORS_TABLE_KEY)) || "[]",
    )
    return tableData // 返回表格数组（每行是一个对象）
  } catch (error) {
    console.error("查询表格失败：", error)
    return []
  }
}

/**
 * 清空表格
 */
export const clearTable = async () => {
  try {
    await AsyncStorage.setItem(DOCTORS_TABLE_KEY, JSON.stringify([]))
    return true
  } catch (error) {
    console.error("清空表格失败：", error)
    return false
  }
}
