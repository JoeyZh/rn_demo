import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TimeSlot } from './TimeSlot';
import { TimeSlotModel } from '@/app/models/types';


interface TimeSlotListProps {
  timeSlots: TimeSlotModel[];
  onTimeSlotPress: (time: string) => void;
}

export const TimeSlotList: React.FC<TimeSlotListProps> = ({ timeSlots, onTimeSlotPress }) => {
  return (
    <View style={styles.container}>
      {timeSlots.map((timeSlot,i) => (
        <TimeSlot
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
