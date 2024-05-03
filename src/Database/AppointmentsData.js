import { onValue, ref } from 'firebase/database';
import { useState, useEffect } from 'react';
import { getDatabase } from 'firebase/database';

const useAppointmentsData = () => {
  const db = getDatabase();
  const [appointmentsData, setAppointmentsData] = useState([]);

  useEffect(() => {
const appointmentsDataListener = onValue(ref(db, 'Appointment'), (snapshot) => {
  const records = [];
  if(snapshot.exists()){
  snapshot.forEach(childsnapshot => {
  records.push(childsnapshot.val());
});}
setAppointmentsData(records);
    });
    return () => {
      appointmentsDataListener();
    };
  }, [db]);

  return appointmentsData;
};

export default useAppointmentsData;

  

  