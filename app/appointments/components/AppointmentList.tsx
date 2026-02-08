 import { View, Text } from 'react-native';
import { AppointmentItem } from './AppointmentItem';
import { MyAppointmentModel } from '@/app/models/types'; 
export const AppointmentList = ({items}: {items: MyAppointmentModel[]}) => {

  return (
    <View>
        {items.length === 0 ? (
          <Text>Loading...</Text>
        ) : (
          items.map((item,i) => (
            <AppointmentItem key={i} appointment={item} />
          ))
        )}
    </View>
  );
};
