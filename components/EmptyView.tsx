import { View, Text } from 'react-native';

export const EmptyView = ({ message }: { message: string }) => {
  return (
    <View>
      <Text>{message}</Text>
    </View>
  );
};
