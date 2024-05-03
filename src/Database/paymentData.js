import { onValue, ref } from 'firebase/database';
import { useState, useEffect } from 'react';
import { getDatabase } from 'firebase/database';

const usePaymentData = () => {
  const db = getDatabase();
  const [paymentData, setPaymentData] = useState([]);

  useEffect(() => {
const paymentDataListener = onValue(ref(db, 'Payment'), (snapshot) => {
  const records = [];
  if(snapshot.exists()){
  snapshot.forEach(childsnapshot => {
  records.push(childsnapshot.val());
});}
setPaymentData(records);
 });
    return () => {
      paymentDataListener();
    };
  }, [db]);

  return paymentData;
};

export default usePaymentData;

  

  