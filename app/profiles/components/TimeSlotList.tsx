import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TimeSlot } from './TimeSlot';
import { outDateFunc, TimeSlotModel } from '@/app/models/types';


interface TimeSlotListProps {
  date: Date;
  timeSlots: TimeSlotModel[];
  onTimeSlotPress: (time: string) => void;
  outDate: outDateFunc;
}

export const TimeSlotList: React.FC<TimeSlotListProps> = ({ date, timeSlots, onTimeSlotPress, outDate }) => {
  return (
    <View style={styles.container}>
      {timeSlots.map((timeSlot,i) => (
        <TimeSlot
          outDate={outDate(date, timeSlot.time, timeSlot.timezone)}
          key={i}
          timeSlot={timeSlot}
          bookSlot={onTimeSlotPress}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
});
