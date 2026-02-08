 import { View, Text } from 'react-native';
import { DoctorsItem } from './DoctorsItem';
import { DoctorModel } from '@/app/models/types'; // 导入 DoctorModel 类型
export const DoctorsList = ({doctors}: {doctors: DoctorModel[]}) => {

  return (
    <View>
        {doctors.length === 0 ? (
          <Text>No doctors found</Text>
        ) : (
          doctors.map((doctor) => (
            <DoctorsItem key={doctor.id} doctor={doctor} />
          ))
        )}
    </View>
  );
};
