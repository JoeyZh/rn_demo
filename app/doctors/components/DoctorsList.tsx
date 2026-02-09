 import { View, Text } from 'react-native';
import { DoctorsItem } from './DoctorsItem';
import { DoctorModel } from '@/app/models/types'; // 导入 DoctorModel 类型
import { EmptyView } from '@/components/EmptyView';
export const DoctorsList = ({doctors,loading,onLoading}: {doctors: DoctorModel[],loading:boolean,onLoading:()=>void}) => {

  return (
    <View>
        {doctors.length === 0 ? (
          <EmptyView
            message="No doctors found"
            loading={loading}
            loadingMessage="Loading doctors..."
            onLoading={onLoading}
          />
        ) : (
          doctors.map((doctor,i) => (
            <DoctorsItem key={i} doctor={doctor} />
          ))
        )}
    </View>
  );
};
