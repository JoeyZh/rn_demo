 import { View, Text } from 'react-native';
import { AppointmentItem } from './AppointmentItem';
import { MyAppointmentModel } from '@/app/models/types'; 
import { EmptyView } from '@/components/EmptyView';
export const AppointmentList = ({items,onCancelItem}: {items: MyAppointmentModel[], onCancelItem: (appointment: MyAppointmentModel) => void}) => {

  return (
    <View>
        {items.length === 0 ? (
          <EmptyView
          loading={false}
          message="No appointments found"
          loadingMessage="Loading appointments..."
          onLoading={() => {}}
          ></EmptyView>
        ) : (
          items.map((item,i) => (
            <AppointmentItem key={i} appointment={item} onCancel={onCancelItem} />
          ))
        )}
    </View>
  );
};
