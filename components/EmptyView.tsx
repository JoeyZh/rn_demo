import { View, Text, Button, StyleSheet } from 'react-native';

export const EmptyView = ({
  message,
  loading,
  loadingMessage,
  onLoading,
  reload,
}: {
  message: string;
  loading: boolean;
  loadingMessage: string;
  onLoading: () => void;
  reload?: boolean;
}) => {
  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.text}>{loadingMessage}</Text>
      ) : (
        <>
          <Text style={styles.text}>{message}</Text>
          {reload && <Button title="Reload" onPress={onLoading} />}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // 垂直居中
    alignItems: 'center',     // 水平居中
  },
  text: {
    fontSize: 16,
    textAlign: 'center',  
    marginTop: 16,         // 文本居中对齐
    marginBottom: 16,         // 添加按钮与文本之间的间距
  },
});