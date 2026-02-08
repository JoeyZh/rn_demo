    import { View, Text, Button } from 'react-native'; // 导入 React Native 组件
    import { DoctorModel } from '@/app/models/types'; // 导入 DoctorModel 类型
    import { useBook } from '../hooks/useBook';
    export const DoctorsItem = ({ doctor }: { doctor: DoctorModel }) => {

      const { gotoDetail } = useBook();

      return (
        <View>
          <Text>{doctor.name}</Text>
          <Text>{doctor.specialty}</Text>
          <Text>{doctor.yearsOfExperience} years of experience</Text>
          <Text>Time Zone: {doctor.timeZone}</Text>

          <View>
            <Button title="Book" onPress={() => gotoDetail(doctor.id)} />
          </View>
        </View>
      );
    };