    import { ScrollView } from "react-native"; // 导入 ScrollView 组件
    import { useDoctorList } from "../hooks/useDoctorList";
    import { DoctorsList } from "../components/DoctorsList";
    export const DoctorsPage = () => {
      const { doctors } = useDoctorList();
    
      return (
        <ScrollView>
          <DoctorsList doctors={doctors} />
        </ScrollView>
      );
    };

    