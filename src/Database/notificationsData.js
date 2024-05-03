import { onValue, ref } from 'firebase/database';
import { useState, useEffect } from 'react';
import { getDatabase } from 'firebase/database';

const useNotificationsData = () => {
  const db = getDatabase();
  const [notificationsData, setNotificationsData] = useState([]);

  useEffect(() => {
const notificationsDataListener = onValue(ref(db, 'AllNotifications'), (snapshot) => {
  const records = [];
  if(snapshot.exists()){
  snapshot.forEach(childsnapshot => {
  records.push(childsnapshot.val());
});}
setNotificationsData(records);
    });
    return () => {
      notificationsDataListener();
    };
  }, [db]);

  return notificationsData;
};

export default useNotificationsData;

  

  