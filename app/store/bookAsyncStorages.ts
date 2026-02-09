import AsyncStorage from "@react-native-async-storage/async-storage"
import { BookedSlotModel } from "../models/types"
import { generateUniqueId } from "../utils/bookUtils"

const TABLE_KEY = "BOOKED_SLOTS_TABLE"

export type filterFn = (item: BookedSlotModel) => boolean
/**
 * 初始化表格（若不存在则创建空数组）
 */
export const initTable = async () => {
  try {
    const existingData = await AsyncStorage.getItem(TABLE_KEY)
    if (!existingData) {
      // 空表格 = 空数组
      await AsyncStorage.setItem(TABLE_KEY, JSON.stringify([]))
    }
  } catch (error) {
    console.error("初始化表格失败：", error)
  }
}

/**
 * 新增行（插入表格记录）
 * @param {Object} rows - 存储数据
 */
export const addAllRows = async (rows: BookedSlotModel[]): Promise<boolean> => {
  try {
    // 1. 读取现有表格数据（数组），并显式指定类型
    const tableData: BookedSlotModel[] = JSON.parse(
      (await AsyncStorage.getItem(TABLE_KEY)) || "[]",
    )
    // 4. 存回 AsyncStorage
    await AsyncStorage.setItem(TABLE_KEY, JSON.stringify(rows))
    return true
  } catch (error) {
    console.error("新增行失败：", error)
    return false
  }
}

/**
 * 新增行（插入表格记录）
 * @param {Object} row - 单行数据（必须包含 id 主键）
 */
export const addRow = async (row: BookedSlotModel): Promise<boolean|string> => {
  try {
    // 1. 读取现有表格数据（数组），并显式指定类型
    const tableData: BookedSlotModel[] = JSON.parse(
      (await AsyncStorage.getItem(TABLE_KEY)) || "[]",
    )
    const newId = generateUniqueId(row)
    // 2. 检查主键是否重复
    const isDuplicate = tableData.some((item) => item.id === newId)
    if (isDuplicate) {
      console.warn("主键重复，无法新增：", newId)
      return false
    }
    // 3. 新增行（push 到数组末尾）
    tableData.push({
      ...{...row, id: newId},
      bookedTime: row.bookedTime || Date.now(), // 自动补全时间
    })
    // 4. 存回 AsyncStorage
    await AsyncStorage.setItem(TABLE_KEY, JSON.stringify(tableData))
    return newId
  } catch (error) {
    console.error("新增行失败：", error)
    return false
  }
}

/**
 * 查询表格所有行（读取整张表）
 */
export const getAllRows = async (): Promise<BookedSlotModel[]> => {
  try {
    const tableData = JSON.parse(
      (await AsyncStorage.getItem(TABLE_KEY)) || "[]",
    )
    return tableData // 返回表格数组（每行是一个对象）
  } catch (error) {
    console.error("查询表格失败：", error)
    return []
  }
}

/**
 * 按条件查询行（模拟 WHERE 筛选）
 * @param {Function} filterFn - 筛选函数（类似数组 filter）
 */
export const queryRows = async (
  filterFn: filterFn,
): Promise<BookedSlotModel[]> => {
  try {
    const tableData = JSON.parse(
      (await AsyncStorage.getItem(TABLE_KEY)) || "[]",
    )
    return tableData.filter(filterFn) // 按条件筛选行
  } catch (error) {
    console.error("条件查询失败：", error)
    return []
  }
}

/**
 * 删除行（按主键删除）
 * @param {string} id - 主键 ID
 */
export const deleteRow = async (id: string) => {
  try {
    const tableData: BookedSlotModel[] = JSON.parse(
      (await AsyncStorage.getItem(TABLE_KEY)) || "[]",
    )
    // 过滤掉要删除的行
    const updatedTable = tableData.filter((item) => item.id !== id)
    await AsyncStorage.setItem(TABLE_KEY, JSON.stringify(updatedTable))
    return true
  } catch (error) {
    console.error("删除行失败：", error)
    return false
  }
}

/**
 * 清空表格
 */
export const clearTable = async () => {
  try {
    await AsyncStorage.setItem(TABLE_KEY, JSON.stringify([]))
    return true
  } catch (error) {
    console.error("清空表格失败：", error)
    return false
  }
}
