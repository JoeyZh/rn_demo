import { Alert } from "react-native"

interface AlertOptions {
  onConfirm: () => void
  onCancel?: () => void
}
export const useBookAlert = ({
  onConfirm,
  onCancel,
}: AlertOptions) => {
  const show = (title: string, message: string) => {
    Alert.alert(
      title, // 标题
      message, // 消息
      [
        {
          text: "cancel",
          onPress: onCancel,
          style: "cancel", // 样式：cancel, default, destructive
        },
        {
          text: "ok",
          onPress: onConfirm,
          style: "default", // 或 'destructive' 表示危险操作
        },
      ],
      {
        cancelable: false, // 点击外部是否可以关闭 (Android)
      },
    )
  }

  return { show }
}
