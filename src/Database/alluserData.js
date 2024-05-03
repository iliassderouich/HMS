import { onValue, ref } from 'firebase/database';
import { useState, useEffect } from 'react';
import { db } from '../firebase';

const useAlluserData = () => {
  const [alluserData, setAlluserData] = useState();

  useEffect(() => {
const alluserDataListener = onValue(ref(db, 'User'), (snapshot) => {
  const records = [];
  if(snapshot.exists()){
  snapshot.forEach(childsnapshot => {
  records.push(childsnapshot.val());
});}
setAlluserData(records);
    });
    return () => {
        alluserDataListener();
    };
  }, []);

  return alluserData;
};

export default useAlluserData;