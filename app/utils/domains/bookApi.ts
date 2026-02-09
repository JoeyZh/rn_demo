


export const addBookSlot = async (doctorId: string, date:Date) => {
  
};


export const cancelTimeSlot = async (doctorId: string, date: Date) => {
  
};

export const getBookedSlots = async (doctorId: string): Promise<string[]> => {
  const response = await fetch(`/api/doctors/${doctorId}/booked`);
  if (!response.ok) {
    throw new Error('Failed to fetch booked slots');
  }
  return response.json();
};
